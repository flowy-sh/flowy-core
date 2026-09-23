import { afterAll, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/* ============================================================
   THE SKILL LOADER REWRITES THE ACTIVATOR BEFORE THE MODEL READS IT (2026-09-23).

   Claude Code substitutes `$ARGUMENTS`, `$ARGUMENTS[N]` and the shorthand dollar-N in a
   SKILL.md body with the invocation's arguments, 0-BASED. Source, fetched 2026-09-23:
   code.claude.com/docs/en/skills, "String substitutions": the shorthand is "such as `$0` for
   the first argument or `$1` for the second", and "When no placeholder receives an argument,
   Claude Code appends them as `ARGUMENTS: <value>`".

   The state-dir helper was written with the SHELL's positional parameters. An overlay
   activation passes `overlay <flow-name> <overlay-plugin-root>`, so the second argument (the
   flow name) replaced the shell's first positional and the line reached the model as
   `. "growth-marketing/hooks/flowy-paths.sh"`: Stacking, DEACTIVATE and STATUS all run it.
   And because a placeholder had received the arguments, the loader stopped appending the
   `ARGUMENTS:` line that "Parse the argument" reads. Nothing failed loudly; each of those
   three paths simply computed nothing.

   These tests read the file THE WAY THE LOADER HANDS IT OVER: substituted, then run.
   ============================================================ */

const SKILL_MD = join(import.meta.dir, "..", "skills", "_activator", "SKILL.md");
const HELPER = join(import.meta.dir, "..", "hooks", "flowy-paths.sh");
const md = readFileSync(SKILL_MD, "utf8");

/** The documented substitutions, in the order that keeps `$ARGUMENTS[N]` whole. */
function loaderRender(body: string, args: readonly string[]): string {
  return body
    .replace(/(?<!\\)\$ARGUMENTS\[(\d+)\]/g, (_m, n: string) => args[Number(n)] ?? "")
    .replace(/(?<!\\)\$ARGUMENTS/g, args.join(" "))
    .replace(/(?<!\\)\$(\d+)/g, (_m, n: string) => args[Number(n)] ?? "");
}

/** The state-dir helper command, as the "Where state lives" section presents it. */
function helperCommand(body: string): string {
  const m = /Run this once via the Bash tool:\s*```[^\n]*\n([\s\S]*?)\n```/.exec(body);
  return (m?.[1] ?? "").trim();
}

const GIT_BASH = ["C:\\Program Files\\Git\\bin\\bash.exe", "C:\\Program Files (x86)\\Git\\bin\\bash.exe"].find((p) =>
  existsSync(p),
);
const toPosix = (p: string) => p.replace(/^([A-Za-z]):/, (_m, d: string) => `/${d.toLowerCase()}`).replace(/\\/g, "/");

/* A fake install with the REAL helper in it: <tmp>/U/.claude/plugins/cache/flowy-core/engine/9.9.9 */
const TMP = mkdtempSync(join(tmpdir(), "flowy-activator-"));
const PLUGIN_ROOT = join(TMP, "U", ".claude", "plugins", "cache", "flowy-core", "engine", "9.9.9");
mkdirSync(join(PLUGIN_ROOT, "hooks"), { recursive: true });
copyFileSync(HELPER, join(PLUGIN_ROOT, "hooks", "flowy-paths.sh"));
afterAll(() => rmSync(TMP, { recursive: true, force: true }));

/** Render as the loader would, fill the two placeholders as the model would, run it. */
function runHelper(args: readonly string[], pluginRoot: string) {
  const command = helperCommand(loaderRender(md, args))
    .replaceAll("<plugin-root>", pluginRoot)
    .replaceAll("<project-dir>", "E:\\Projects VS\\x");
  const res = spawnSync(GIT_BASH ?? "bash", ["-c", command], {
    encoding: "utf8",
    // Empty, so the command's own fallback (the literal project dir) is what is exercised.
    env: { ...process.env, CLAUDE_PROJECT_DIR: "" },
  });
  return { command, code: res.status, out: (res.stdout ?? "").trim() };
}

describe("the activator survives the skill loader's substitution", () => {
  test("the helper command is found in the file (anti-vacuity)", () => {
    expect(helperCommand(md)).toContain("flowy-paths.sh");
    expect(helperCommand(md)).toContain("flowy_state_dir");
  });

  test("no token the loader would substitute appears anywhere in the body", () => {
    /* Any dollar-digit or ARGUMENTS token is REPLACED before the model reads the file, and its
       presence also stops the loader appending the ARGUMENTS line the activator parses. Write
       shell parameters as named variables. (An escaped `\$` would survive, but a named variable
       is clearer and needs no escaping rule.) */
    expect(md.match(/(?<!\\)\$(?:\d|ARGUMENTS)/g) ?? []).toEqual([]);
  });

  test("no documented ${CLAUDE_*} placeholder is left for the SHELL to expand", () => {
    /* The loader also rewrites these exact braced forms (same docs page), so one written into a
       shell command would reach the model as a literal path, not an expansion. The helper command's
       `${CLAUDE_PROJECT_DIR:-...}` default form is not one of them. */
    expect(md.match(/\$\{CLAUDE_(?:PROJECT_DIR|PLUGIN_ROOT|PLUGIN_DATA|SESSION_ID|SKILL_DIR|EFFORT)\}/g) ?? []).toEqual([]);
  });

  const d = GIT_BASH ? describe : describe.skip;
  d("and the rendered command still computes the state dir", () => {
    for (const [label, args] of [
      ["an overlay activation", ["overlay", "growth-marketing", "/c/Users/U/.claude/plugins/cache/flowy-core/flowy-growth-marketing/1.2.0"]],
      ["a bundled-flow activation", ["superpowers-flow"]],
      ["a deactivation", ["deactivate", "superpowers-flow"]],
    ] as const) {
      test(`after ${label}`, () => {
        const got = runHelper(args, toPosix(PLUGIN_ROOT));
        expect({ label, code: got.code, key: got.out.endsWith("/.claude/flowy-state/E__Projects_VS_x") }).toEqual({
          label,
          code: 0,
          key: true,
        });
      });
    }
  });
});
