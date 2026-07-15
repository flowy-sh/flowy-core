/**
 * Tests for hooks/flowy-activate.sh — the one-shot activation writer.
 *
 * The _activator skill invokes this with the flow already resolved; the script
 * derives the canonical out-of-repo state dir via flowy-paths.sh (the SAME
 * helper the hook uses) and atomically writes a fresh state-PENDING.json.
 *
 * THE FIX THIS GUARDS: the activator must NOT make the agent guess the project
 * dir. The script reads ${CLAUDE_PROJECT_DIR:-$(pwd)}; on Git Bash pwd is the
 * MSYS form (/c/...) which the canonical helper folds to the hook's Windows-form
 * key — so pwd-derived activation lands in the dir the hook actually reads.
 *
 * Runs under Git Bash on Windows (the production platform).
 */
import { afterAll, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const GIT_BASH_CANDIDATES = [
  "C:\\Program Files\\Git\\bin\\bash.exe",
  "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
];
const GIT_BASH = GIT_BASH_CANDIDATES.find((p) => existsSync(p));
const HAVE_GIT_BASH = !!GIT_BASH;

const HERE = fileURLToPath(new URL(".", import.meta.url));
const SCRIPT_WIN = join(HERE, "..", "hooks", "flowy-activate.sh");
const HELPER_WIN = join(HERE, "..", "hooks", "flowy-paths.sh");
const RESOLVE_WIN = join(HERE, "..", "hooks", "flowy-resolve.sh");

function toPosix(p: string): string {
  return p.replace(/^([A-Za-z]):/, (_m, d) => `/${d.toLowerCase()}`).replace(/\\/g, "/");
}

/** Canonical key via the single source of truth, so the test can never drift. */
function projectKey(projectDirEnvValue: string): string {
  const res = spawnSync(
    GIT_BASH!,
    ["-c", '. "$1"; flowy_canonical_key "$2"', "_", toPosix(HELPER_WIN), projectDirEnvValue],
    { encoding: "utf8" },
  );
  return (res.stdout ?? "").trim();
}

interface Dirs {
  base: string;
  projectDirWin: string;
  projectDirEnv: string;
  claudeHomeWin: string;
  pluginRootWin: string;
  pluginRootEnv: string;
  stateDirWin: string;
}

let root: string | undefined;

function makeDirs(projectName = "project dir"): Dirs {
  if (!root) root = mkdtempSync(join(tmpdir(), "flowy-activate-"));
  const base = mkdtempSync(join(root, "case "));
  const projectDirWin = join(base, projectName);
  const claudeHomeWin = join(base, ".claude");
  const pluginRootWin = join(claudeHomeWin, "plugins", "cache", "flowy-flows", "flowy", "0.6.3");
  const hooksWin = join(pluginRootWin, "hooks");
  mkdirSync(projectDirWin, { recursive: true });
  mkdirSync(hooksWin, { recursive: true });
  // The script sources <plugin-root>/hooks/flowy-paths.sh — give it the real one.
  copyFileSync(HELPER_WIN, join(hooksWin, "flowy-paths.sh"));
  // An overlay activation also sources <plugin-root>/hooks/flowy-resolve.sh.
  copyFileSync(RESOLVE_WIN, join(hooksWin, "flowy-resolve.sh"));
  const projectDirEnv = toPosix(projectDirWin);
  const stateDirWin = join(claudeHomeWin, "flowy-state", projectKey(projectDirEnv));
  return {
    base,
    projectDirWin,
    projectDirEnv,
    claudeHomeWin,
    pluginRootWin,
    pluginRootEnv: toPosix(pluginRootWin),
    stateDirWin,
  };
}

function runActivate(opts: {
  pluginRoot: string;
  flowName?: string;
  flowRef?: string;
  location?: string;
  flowPluginRoot?: string; // 5th CLI arg — the overlay's own plugin-root
  projectDirEnv?: string | null; // null/undefined => env var unset
  cwd?: string; // Windows path, for the pwd fallback
}) {
  if (!GIT_BASH) throw new Error("Git Bash not found");
  const env: Record<string, string> = { ...process.env } as Record<string, string>;
  if (opts.projectDirEnv == null) delete env.CLAUDE_PROJECT_DIR;
  else env.CLAUDE_PROJECT_DIR = opts.projectDirEnv;
  const args = [toPosix(SCRIPT_WIN), opts.pluginRoot];
  if (opts.flowName !== undefined) args.push(opts.flowName);
  if (opts.flowRef !== undefined) args.push(opts.flowRef);
  if (opts.location !== undefined) args.push(opts.location);
  if (opts.flowPluginRoot !== undefined) args.push(opts.flowPluginRoot);
  const res = spawnSync(GIT_BASH, args, { encoding: "utf8", env, cwd: opts.cwd });
  return { code: res.status ?? -1, stdout: res.stdout ?? "", stderr: res.stderr ?? "" };
}

function pending(dirs: Dirs): string {
  return readFileSync(join(dirs.stateDirWin, "state-PENDING.json"), "utf8");
}

/**
 * Build a per-flow OVERLAY plugin dir with flows/<name>/FLOW.md present. By default
 * it lives under the SAME /plugins/ tree as the engine root (so the resolver's S1
 * containment guard passes); with outOfTree it lives at <base>/evil (a REAL FLOW.md
 * but OUTSIDE the plugins tree — S1 must refuse it, proving containment, not absence).
 */
function makeOverlay(dirs: Dirs, opts: { outOfTree?: boolean; flowName?: string } = {}) {
  const flowName = opts.flowName ?? "superpowers";
  const overlayRootWin = opts.outOfTree
    ? join(dirs.base, "evil")
    : join(dirs.claudeHomeWin, "plugins", "cache", "superpowers-overlay", "flowy", "0.1.0");
  const flowDirWin = join(overlayRootWin, "flows", flowName);
  mkdirSync(flowDirWin, { recursive: true });
  writeFileSync(join(flowDirWin, "FLOW.md"), "# Overlay FLOW\nRoute to the right skill. Use TDD.\n");
  return { overlayRootWin, overlayRootEnv: toPosix(overlayRootWin), flowName };
}

afterAll(() => {
  if (root) {
    try {
      rmSync(root, { recursive: true, force: true });
    } catch {
      /* best-effort */
    }
  }
});

const d = HAVE_GIT_BASH ? describe : describe.skip;

d("flowy-activate.sh", () => {
  test("CLAUDE_PROJECT_DIR set → PENDING written under the hook's key, exit 0, silent", () => {
    const dirs = makeDirs();
    const r = runActivate({
      pluginRoot: dirs.pluginRootEnv,
      flowName: "superpowers-flow",
      flowRef: "flows/superpowers-flow/FLOW.md",
      location: "plugin",
      projectDirEnv: dirs.projectDirEnv,
    });
    expect(r.code).toBe(0);
    expect(r.stdout.trim()).toBe(""); // silent on success
    expect(existsSync(join(dirs.stateDirWin, "state-PENDING.json"))).toBe(true);
    const j = JSON.parse(pending(dirs));
    expect(j.schema).toBe("flowy-state-v2");
    expect(j.sessionId).toBe("PENDING");
    expect(typeof j.createdAtEpoch).toBe("number");
    // A plugin activation carries an EMPTY pluginRoot (overlay-only field).
    expect(j.activeFlows).toEqual([
      {
        name: "superpowers-flow",
        flowRef: "flows/superpowers-flow/FLOW.md",
        location: "plugin",
        pluginRoot: "",
      },
    ]);
  });

  test("CLAUDE_PROJECT_DIR UNSET → pwd fallback writes a PENDING under the pwd-derived key, exit 0", () => {
    const dirs = makeDirs();
    // Under Git Bash a cwd inside the OS temp dir reports pwd via the /tmp mount
    // (e.g. /tmp/...), which differs from the Windows path. Production project dirs
    // are NOT under /tmp; here we derive the expected key from the ACTUAL pwd so the
    // test asserts the real invariant: env unset ⇒ the script keys off $(pwd). (The
    // pwd-form ⇄ Windows-form key fold itself is covered by flowy-paths.test.ts.)
    const pwdActual = spawnSync(GIT_BASH!, ["-c", "pwd"], {
      cwd: dirs.projectDirWin,
      encoding: "utf8",
    }).stdout.trim();
    const r = runActivate({
      pluginRoot: dirs.pluginRootEnv,
      flowName: "superpowers-flow",
      flowRef: "flows/superpowers-flow/FLOW.md",
      location: "plugin",
      projectDirEnv: null, // env var unset → script uses $(pwd)
      cwd: dirs.projectDirWin,
    });
    expect(r.code).toBe(0);
    const expected = join(dirs.claudeHomeWin, "flowy-state", projectKey(pwdActual), "state-PENDING.json");
    expect(existsSync(expected)).toBe(true);
  });

  test("createdAtEpoch is a fresh integer and the flow fields are present + hook-parseable", () => {
    const dirs = makeDirs();
    const before = Math.floor(Date.now() / 1000) - 2;
    runActivate({
      pluginRoot: dirs.pluginRootEnv,
      flowName: "superpowers-flow",
      flowRef: "flows/superpowers-flow/FLOW.md",
      location: "plugin",
      projectDirEnv: dirs.projectDirEnv,
    });
    const raw = pending(dirs);
    const j = JSON.parse(raw);
    expect(Number.isInteger(j.createdAtEpoch)).toBe(true);
    expect(j.createdAtEpoch).toBeGreaterThanOrEqual(before);
    // The hook greps each key/value pair line-by-line: the pair must be INTACT on a
    // single line (the canonical single-line object form satisfies this), never split
    // across lines. Assert the pairs the hook would grep, and that none is orphaned.
    expect(raw).toContain('"name": "superpowers-flow"');
    expect(raw).toContain('"flowRef": "flows/superpowers-flow/FLOW.md"');
    expect(raw).toContain('"location": "plugin"');
    expect(raw).not.toMatch(/"(name|flowRef|location)":\s*$/m); // value never on the next line
  });

  test("a stale PENDING is replaced with a fresh one; no .tmp left behind", () => {
    const dirs = makeDirs();
    mkdirSync(dirs.stateDirWin, { recursive: true });
    writeFileSync(
      join(dirs.stateDirWin, "state-PENDING.json"),
      JSON.stringify({
        schema: "flowy-state-v1",
        sessionId: "PENDING",
        createdAtEpoch: 1,
        activeFlows: [{ name: "old", flowRef: "flows/old/FLOW.md", location: "plugin" }],
      }),
    );
    runActivate({
      pluginRoot: dirs.pluginRootEnv,
      flowName: "superpowers-flow",
      flowRef: "flows/superpowers-flow/FLOW.md",
      location: "plugin",
      projectDirEnv: dirs.projectDirEnv,
    });
    const j = JSON.parse(pending(dirs));
    expect(j.activeFlows[0].name).toBe("superpowers-flow"); // replaced
    expect(j.createdAtEpoch).toBeGreaterThan(1); // fresh
    expect(existsSync(join(dirs.stateDirWin, "state-PENDING.json.tmp"))).toBe(false);
  });

  test("plugin root whose home is not /.claude → empty key, non-zero, no file", () => {
    const dirs = makeDirs();
    // Helper present, but home (before /plugins/) is NOT a /.claude dir → empty STATE_DIR.
    const badRootWin = join(dirs.base, "notclaude", "plugins", "cache", "flowy-flows", "flowy", "0.6.3");
    mkdirSync(join(badRootWin, "hooks"), { recursive: true });
    copyFileSync(HELPER_WIN, join(badRootWin, "hooks", "flowy-paths.sh"));
    const r = runActivate({
      pluginRoot: toPosix(badRootWin),
      flowName: "superpowers-flow",
      flowRef: "flows/superpowers-flow/FLOW.md",
      location: "plugin",
      projectDirEnv: dirs.projectDirEnv,
    });
    expect(r.code).not.toBe(0);
    expect(r.stderr).toMatch(/flowy-activate/);
    expect(existsSync(join(dirs.stateDirWin, "state-PENDING.json"))).toBe(false);
  });

  test("missing flow name → non-zero, stderr reason", () => {
    const dirs = makeDirs();
    const r = runActivate({
      pluginRoot: dirs.pluginRootEnv,
      // flowName omitted
      projectDirEnv: dirs.projectDirEnv,
    });
    expect(r.code).not.toBe(0);
    expect(r.stderr).toMatch(/flowy-activate/);
  });

  test("rejects a flow name with JSON-injection chars → non-zero, no file written", () => {
    const dirs = makeDirs();
    const r = runActivate({
      pluginRoot: dirs.pluginRootEnv,
      flowName: 'evil","flowRef":"flows/evil/FLOW.md","location":"plugin"},{"name":"INJECTED',
      flowRef: "flows/superpowers-flow/FLOW.md",
      location: "plugin",
      projectDirEnv: dirs.projectDirEnv,
    });
    expect(r.code).not.toBe(0);
    expect(r.stderr).toMatch(/invalid flow name/);
    expect(existsSync(join(dirs.stateDirWin, "state-PENDING.json"))).toBe(false);
  });

  test("rejects a flowRef with traversal/charset → non-zero, no file written", () => {
    const dirs = makeDirs();
    const r = runActivate({
      pluginRoot: dirs.pluginRootEnv,
      flowName: "superpowers-flow",
      flowRef: "flows/../../../etc/passwd",
      location: "plugin",
      projectDirEnv: dirs.projectDirEnv,
    });
    expect(r.code).not.toBe(0);
    expect(r.stderr).toMatch(/invalid flow ref/);
    expect(existsSync(join(dirs.stateDirWin, "state-PENDING.json"))).toBe(false);
  });
});

d("flowy-activate.sh (location: overlay)", () => {
  test("valid overlay under the shared /plugins/ tree → exit 0, state carries location:overlay + pluginRoot", () => {
    const dirs = makeDirs();
    const overlay = makeOverlay(dirs);
    const r = runActivate({
      pluginRoot: dirs.pluginRootEnv,
      flowName: overlay.flowName,
      flowRef: `flows/${overlay.flowName}/FLOW.md`,
      location: "overlay",
      flowPluginRoot: overlay.overlayRootEnv,
      projectDirEnv: dirs.projectDirEnv,
    });
    expect(r.code).toBe(0);
    expect(r.stdout.trim()).toBe(""); // silent on success
    const raw = pending(dirs);
    const j = JSON.parse(raw);
    expect(j.schema).toBe("flowy-state-v2");
    expect(j.activeFlows[0].location).toBe("overlay");
    expect(j.activeFlows[0].pluginRoot).toBe(overlay.overlayRootEnv);
    // Exact serialized form the hook greps (both fields on the entry's single line).
    expect(raw).toContain('"location": "overlay"');
    expect(raw).toContain(`"pluginRoot": "${overlay.overlayRootEnv}"`);
  });

  test("out-of-tree overlay root (outside /plugins/) is refused by S1 containment → non-zero, no file", () => {
    const dirs = makeDirs();
    // A REAL flows/superpowers/FLOW.md exists under the root — but the root is
    // OUTSIDE the plugins tree, so flowy_resolve_flowmd's S1 guard discards it and
    // returns empty. This proves containment (not mere absence) is what refuses it.
    const overlay = makeOverlay(dirs, { outOfTree: true });
    const r = runActivate({
      pluginRoot: dirs.pluginRootEnv,
      flowName: overlay.flowName,
      flowRef: `flows/${overlay.flowName}/FLOW.md`,
      location: "overlay",
      flowPluginRoot: overlay.overlayRootEnv,
      projectDirEnv: dirs.projectDirEnv,
    });
    expect(r.code).not.toBe(0);
    expect(r.stderr).toMatch(/overlay FLOW\.md not resolvable/);
    expect(existsSync(join(dirs.stateDirWin, "state-PENDING.json"))).toBe(false);
  });

  test("location overlay with NO flow-plugin-root arg → refused, exit 2, no file", () => {
    const dirs = makeDirs();
    const r = runActivate({
      pluginRoot: dirs.pluginRootEnv,
      flowName: "superpowers",
      flowRef: "flows/superpowers/FLOW.md",
      location: "overlay",
      // flowPluginRoot omitted → the 5th CLI arg is absent
      projectDirEnv: dirs.projectDirEnv,
    });
    expect(r.code).toBe(2);
    expect(r.stderr).toMatch(/location overlay requires a flow-plugin-root/);
    expect(existsSync(join(dirs.stateDirWin, "state-PENDING.json"))).toBe(false);
  });
});
