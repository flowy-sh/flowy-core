/**
 * Tests for hooks/flowy-resolve.sh — the shared FLOW.md resolver sourced by both
 * flowy-inject.sh and flowy-recompact.sh. The integration suites exercise it through
 * the hooks; this asserts the resolution CONTRACT directly so a future change to the
 * resolver is caught at the unit level, not only via the two consumers.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const GIT_BASH = [
  "C:\\Program Files\\Git\\bin\\bash.exe",
  "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
].find((p) => existsSync(p));
const HERE = fileURLToPath(new URL(".", import.meta.url));
const HELPER = join(HERE, "..", "hooks", "flowy-resolve.sh");

function toPosix(p: string): string {
  return p.replace(/^([A-Za-z]):/, (_m, d) => `/${d.toLowerCase()}`).replace(/\\/g, "/");
}

// flowy_resolve_flowmd NAME REF LOC PROJECT_FLOWS_DIR PLUGIN_ROOT [OVERLAY_PLUGIN_ROOT] -> resolved path (or "")
function resolve(name: string, ref: string, loc: string, pfd: string, pr: string, flowpr = ""): string {
  if (!GIT_BASH) return "";
  const r = spawnSync(
    GIT_BASH,
    ['-c', '. "$1"; flowy_resolve_flowmd "$2" "$3" "$4" "$5" "$6" "$7"', "_", toPosix(HELPER), name, ref, loc, pfd, pr, flowpr],
    { encoding: "utf8" },
  );
  return (r.stdout ?? "").trim();
}

let root: string;
beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "flowy-resolve-"));
});
afterAll(() => {
  try {
    rmSync(root, { recursive: true, force: true });
  } catch {
    /* best-effort */
  }
});

describe("flowy_resolve_flowmd (shared resolver contract)", () => {
  test("plugin ref, auto-repair, project, traversal-dropped, bad-name, missing", () => {
    if (!GIT_BASH) return; // loud-skip without Git Bash
    const base = mkdtempSync(join(root, "case ")); // space exercises quoting
    const prWin = join(base, "plugin");
    const pfdWin = join(base, "proj", ".flowy", "flows");
    mkdirSync(join(prWin, "flows", "sp"), { recursive: true });
    writeFileSync(join(prWin, "flows", "sp", "FLOW.md"), "x");
    mkdirSync(join(pfdWin, "sp"), { recursive: true });
    writeFileSync(join(pfdWin, "sp", "FLOW.md"), "y");
    const PR = toPosix(prWin);
    const PFD = toPosix(pfdWin);

    // plugin resolution via the stored ref
    expect(resolve("sp", "flows/sp/FLOW.md", "plugin", PFD, PR)).toBe(`${PR}/flows/sp/FLOW.md`);
    // auto-repair: a stale ref falls back to flows/<name>/FLOW.md under the plugin root
    expect(resolve("sp", "flows/stale/FLOW.md", "plugin", PFD, PR)).toBe(`${PR}/flows/sp/FLOW.md`);
    // project resolution (no plugin fallback)
    expect(resolve("sp", "flows/sp/FLOW.md", "project", PFD, PR)).toBe(`${PFD}/sp/FLOW.md`);
    // traversal ref is dropped, then auto-repairs to the plugin canonical path
    expect(resolve("sp", "../../../etc/hosts", "plugin", PFD, PR)).toBe(`${PR}/flows/sp/FLOW.md`);
    // unsafe name + non-resolving ref -> empty. (A VALID ref wins first, so the bad name only
    // matters once we fall through to name-based auto-repair — give it a missing ref to get there.)
    expect(resolve("../evil", "flows/nope/FLOW.md", "plugin", PFD, PR)).toBe("");
    // missing flow -> empty
    expect(resolve("nope", "flows/nope/FLOW.md", "plugin", PFD, PR)).toBe("");
    // project with a missing file -> empty (NO plugin rescue, even though plugin sp exists)
    expect(resolve("sp", "flows/sp/FLOW.md", "project", toPosix(join(base, "empty")), PR)).toBe("");
  });
});

describe("flowy_resolve_flowmd (location: overlay)", () => {
  test("overlay resolves against the 6th arg (overlay root), with plugins-tree containment", () => {
    if (!GIT_BASH) return;
    const base = mkdtempSync(join(root, "ov "));
    const cache = join(base, ".claude", "plugins", "cache");
    const engineWin = join(cache, "flowy-core", "engine", "0.1.0");
    const overlayWin = join(cache, "flowy-superpowers", "0.1.0");
    mkdirSync(join(overlayWin, "flows", "superpowers"), { recursive: true });
    writeFileSync(join(overlayWin, "flows", "superpowers", "FLOW.md"), "# routes");
    mkdirSync(join(engineWin, "flows"), { recursive: true });
    const ENGINE = toPosix(engineWin), OVERLAY = toPosix(overlayWin), PFD = toPosix(join(base, "pfd"));

    // 1. legit overlay resolve → the overlay's own FLOW.md (NOT the engine root, $5)
    expect(resolve("superpowers", "flows/superpowers/FLOW.md", "overlay", PFD, ENGINE, OVERLAY))
      .toBe(`${OVERLAY}/flows/superpowers/FLOW.md`);
    // 2. missing flow under a root with no canonical FLOW.md → empty
    expect(resolve("superpowers", "flows/superpowers/FLOW.md", "overlay", PFD, ENGINE, toPosix(join(cache, "flowy-empty", "0.1.0"))))
      .toBe("");
    // 3. traversal ref dropped, then auto-repairs to the overlay canonical path (NON-empty)
    expect(resolve("superpowers", "../../etc/x", "overlay", PFD, ENGINE, OVERLAY))
      .toBe(`${OVERLAY}/flows/superpowers/FLOW.md`);
    // 4. overlay root containing .. → refused (empty)
    expect(resolve("superpowers", "flows/superpowers/FLOW.md", "overlay", PFD, ENGINE, `${OVERLAY}/../0.1.0`))
      .toBe("");
    // 5. S1: overlay root OUTSIDE the engine's /plugins/ tree → refused, even with a real file
    const evilWin = join(base, "evil"); mkdirSync(join(evilWin, "flows", "superpowers"), { recursive: true });
    writeFileSync(join(evilWin, "flows", "superpowers", "FLOW.md"), "# attacker routing");
    expect(resolve("superpowers", "flows/superpowers/FLOW.md", "overlay", PFD, ENGINE, toPosix(evilWin)))
      .toBe("");
    // 6. plugin mode STILL resolves against the engine root ($5), unchanged
    mkdirSync(join(engineWin, "flows", "x"), { recursive: true });
    writeFileSync(join(engineWin, "flows", "x", "FLOW.md"), "x");
    expect(resolve("x", "flows/x/FLOW.md", "plugin", PFD, ENGINE, OVERLAY)).toBe(`${ENGINE}/flows/x/FLOW.md`);
  });

  // ---------------------------------------------------------------------------
  // FIX D — _flowpr was normalized (tr '\\' '/') but _pr (the engine root, $5)
  // was not, so a Windows-backslash-form CLAUDE_PLUGIN_ROOT made
  // ${_pr%/plugins/*} fail to match (no literal "/" in an all-backslash path)
  // -> S1's _plugbase came out as garbage (the unstripped _pr + a bogus
  // "/plugins/" suffix) -> the containment prefix check on _flowpr NEVER
  // matched -> every overlay silently resolved empty. Production hands hooks
  // POSIX paths (per the file header), but a defensive/future caller passing
  // the Windows form must not silently disable every overlay.
  // ---------------------------------------------------------------------------
  test("FIX D: engine root ($5) in Windows BACKSLASH form still resolves the overlay (overlay root, $6, stays POSIX)", () => {
    if (!GIT_BASH) return;
    const base = mkdtempSync(join(root, "ovd "));
    const cache = join(base, ".claude", "plugins", "cache");
    const engineWin = join(cache, "flowy-core", "engine", "0.1.0");
    const overlayWin = join(cache, "flowy-superpowers", "0.1.0");
    mkdirSync(join(overlayWin, "flows", "superpowers"), { recursive: true });
    writeFileSync(join(overlayWin, "flows", "superpowers", "FLOW.md"), "# routes");
    mkdirSync(join(engineWin, "flows"), { recursive: true });
    const OVERLAY = toPosix(overlayWin);
    const PFD = toPosix(join(base, "pfd"));
    // Take the POSIX engine path and convert /->\ for the 5th arg ONLY.
    const ENGINE_BACKSLASH = toPosix(engineWin).replace(/\//g, "\\");

    expect(resolve("superpowers", "flows/superpowers/FLOW.md", "overlay", PFD, ENGINE_BACKSLASH, OVERLAY))
      .toBe(`${OVERLAY}/flows/superpowers/FLOW.md`);
  });

  // ---------------------------------------------------------------------------
  // FIX B — S1 containment is a STRING-PREFIX check on the uncanonicalized
  // path. A directory JUNCTION in an INTERMEDIATE component of the overlay root
  // (e.g. its "flows" dir) can physically escape the /plugins/ tree while the
  // string still starts with the plugins-base prefix, and the leaf `[ ! -L ]`
  // check only rejects a symlinked FLOW.md itself — not an escaping ancestor
  // directory. Requires creating an NTFS junction (works unprivileged on this
  // machine per prior verification); loud-skip if junction creation fails.
  // ---------------------------------------------------------------------------
  test("FIX B: a `flows` JUNCTION escaping the /plugins/ tree is refused after canonicalization", () => {
    if (!GIT_BASH) return;
    const base = mkdtempSync(join(root, "junc "));
    const cache = join(base, ".claude", "plugins", "cache");
    const engineWin = join(cache, "flowy-core", "engine", "0.1.0");
    const overlayWin = join(cache, "flowy-legit", "0.1.0"); // legit-prefixed, under the SAME /plugins/ tree
    const outsideWin = join(base, "outside-evil", "flows-escaped");
    mkdirSync(join(outsideWin, "superpowers"), { recursive: true });
    writeFileSync(join(outsideWin, "superpowers", "FLOW.md"), "# attacker routing\n");
    mkdirSync(overlayWin, { recursive: true }); // overlay root itself; "flows" created as a junction below
    mkdirSync(join(engineWin, "flows"), { recursive: true });

    const junctionPath = join(overlayWin, "flows");
    const mk = spawnSync("powershell", [
      "-NoProfile",
      "-Command",
      `New-Item -ItemType Junction -Path '${junctionPath}' -Target '${outsideWin}'`,
    ]);
    if (mk.status !== 0) {
      console.warn(`[SKIP] cannot create junction: ${mk.stderr}`);
      return;
    }

    try {
      const PFD = toPosix(join(base, "pfd"));
      const got = resolve(
        "superpowers",
        "flows/superpowers/FLOW.md",
        "overlay",
        PFD,
        toPosix(engineWin),
        toPosix(overlayWin),
      );
      expect(got).toBe(""); // post-fix: canonicalization catches the escape -> empty
    } finally {
      // cmd /c rmdir removes the JUNCTION ENTRY only, never recursing into the
      // target (matches the documented Windows-junction cleanup pattern; a plain
      // recursive rm here risks deleting through the reparse point instead of it).
      spawnSync("cmd", ["/c", "rmdir", junctionPath]);
    }
  });
});
