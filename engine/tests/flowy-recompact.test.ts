/**
 * Tests for hooks/flowy-recompact.sh — the SessionStart(source:compact) re-read hook.
 * Reviewers flagged that this hook had NO dedicated test file, yet this cycle added the
 * location:overlay pluginRoot read AND the shared parity/schema guards to it. These cover
 * the overlay happy path, the F2 parity guard (a first entry that would otherwise borrow a
 * LATER entry's pluginRoot via head -n 1), and the F_SCHEMA gate.
 */
import { afterAll, beforeAll, expect, test } from "bun:test";
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
const RECOMPACT = join(HERE, "..", "hooks", "flowy-recompact.sh");
const PATHS = join(HERE, "..", "hooks", "flowy-paths.sh");

function toPosix(p: string): string {
  return p.replace(/^([A-Za-z]):/, (_m, d) => `/${d.toLowerCase()}`).replace(/\\/g, "/");
}

// Compute the canonical project key exactly as the hook does (via flowy-paths.sh) so the
// fixture state dir lands where the hook will look for it.
function projectKey(projectDirEnv: string): string {
  if (!GIT_BASH) return "";
  const r = spawnSync(GIT_BASH, ['-c', '. "$1"; flowy_canonical_key "$2"', "_", toPosix(PATHS), projectDirEnv], { encoding: "utf8" });
  return (r.stdout ?? "").trim();
}

let root: string;
beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "flowy-recompact-"));
});
afterAll(() => {
  try {
    rmSync(root, { recursive: true, force: true });
  } catch {
    /* best-effort */
  }
});

interface Dirs {
  projectDirEnv: string;
  pluginRootEnv: string;
  stateDirWin: string;
  pluginRootWin: string;
  cacheWin: string;
}

function makeDirs(): Dirs {
  const base = mkdtempSync(join(root, "case ")); // space exercises quoting
  const projectDirWin = join(base, "project dir");
  const claudeHomeWin = join(base, ".claude");
  const cacheWin = join(claudeHomeWin, "plugins", "cache");
  const pluginRootWin = join(cacheWin, "flowy-core", "engine", "0.1.0"); // pure engine, no flows/
  mkdirSync(join(pluginRootWin, "flows"), { recursive: true });
  const projectDirEnv = toPosix(projectDirWin);
  const pluginRootEnv = toPosix(pluginRootWin);
  const key = projectKey(projectDirEnv);
  const stateDirWin = join(claudeHomeWin, "flowy-state", key);
  mkdirSync(stateDirWin, { recursive: true });
  return { projectDirEnv, pluginRootEnv, stateDirWin, pluginRootWin, cacheWin };
}

function writeState(dirs: Dirs, sessionId: string, json: unknown) {
  writeFileSync(
    join(dirs.stateDirWin, `state-${sessionId}.json`),
    typeof json === "string" ? json : JSON.stringify(json, null, 2),
  );
}

function compactStdin(sessionId: string): string {
  return JSON.stringify({ source: "compact", session_id: sessionId });
}

function runRecompact(dirs: Dirs, stdin: string): { code: number; stdout: string; stderr: string } {
  if (!GIT_BASH) throw new Error("Git Bash not found — test should have been skipped");
  const r = spawnSync(GIT_BASH, [toPosix(RECOMPACT)], {
    input: stdin,
    encoding: "utf8",
    env: { ...process.env, CLAUDE_PROJECT_DIR: dirs.projectDirEnv, CLAUDE_PLUGIN_ROOT: dirs.pluginRootEnv },
  });
  return { code: r.status ?? -1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

// CI-GUARD (F12): hard-fail on Windows without Git Bash — the tests below open with
// `if (!GIT_BASH) return;`, which bun scores as a PASS, so this guard keeps a Git-Bash-less
// Windows/CI run from reporting the recompact suite falsely green.
test("CI-guard: Git Bash must be present on Windows to run recompact tests", () => {
  if (process.platform !== "win32") return;
  expect(!!GIT_BASH).toBe(true);
  if (!GIT_BASH) {
    throw new Error("Git Bash required to run recompact tests on Windows; install it from https://git-scm.com.");
  }
});

test("overlay happy path: a compaction re-read names the overlay's OWN FLOW.md", () => {
  if (!GIT_BASH) return;
  const dirs = makeDirs();
  const overlayWin = join(dirs.cacheWin, "flowy-superpowers", "0.1.0");
  mkdirSync(join(overlayWin, "flows", "superpowers"), { recursive: true });
  writeFileSync(join(overlayWin, "flows", "superpowers", "FLOW.md"), "# routes");
  writeState(dirs, "A", {
    schema: "flowy-state-v2",
    sessionId: "A",
    activeFlows: [
      { name: "superpowers", flowRef: "flows/superpowers/FLOW.md", location: "overlay", pluginRoot: toPosix(overlayWin) },
    ],
  });

  const r = runRecompact(dirs, compactStdin("A"));

  expect(r.code).toBe(0);
  expect(r.stdout).toContain("RE-READ the FLOW.md");
  expect(r.stdout).toContain(`${toPosix(overlayWin)}/flows/superpowers/FLOW.md`);
});

test("non-compact source (startup) → no-op, no re-read banner", () => {
  if (!GIT_BASH) return;
  const dirs = makeDirs();
  const overlayWin = join(dirs.cacheWin, "flowy-superpowers", "0.1.0");
  mkdirSync(join(overlayWin, "flows", "superpowers"), { recursive: true });
  writeFileSync(join(overlayWin, "flows", "superpowers", "FLOW.md"), "# routes");
  writeState(dirs, "A", {
    schema: "flowy-state-v2",
    sessionId: "A",
    activeFlows: [
      { name: "superpowers", flowRef: "flows/superpowers/FLOW.md", location: "overlay", pluginRoot: toPosix(overlayWin) },
    ],
  });

  const r = runRecompact(dirs, JSON.stringify({ source: "startup", session_id: "A" }));

  expect(r.code).toBe(0);
  expect(r.stdout.trim()).toBe("");
});

test("F2 parity guard (recompact): first entry missing its pluginRoot while a later entry has one → malformed, no mis-rooted re-read", () => {
  if (!GIT_BASH) return;
  const dirs = makeDirs();
  const betaWin = join(dirs.cacheWin, "flowy-beta", "0.1.0");
  mkdirSync(join(betaWin, "flows", "alpha"), { recursive: true });
  // This is the file a mis-rooted head -n 1 would (wrongly) re-read for entry 1.
  writeFileSync(join(betaWin, "flows", "alpha", "FLOW.md"), "# beta's alpha (must NOT be re-read for entry 1)\n");
  mkdirSync(join(betaWin, "flows", "beta"), { recursive: true });
  writeFileSync(join(betaWin, "flows", "beta", "FLOW.md"), "# beta routes\n");

  // Entry 1 (alpha) OMITS the pluginRoot key entirely; entry 2 (beta) supplies one. Raw
  // string so the key can be omitted (JSON.stringify of an object literal cannot express it).
  const stateJson = [
    "{",
    '  "schema": "flowy-state-v2",',
    '  "sessionId": "A",',
    '  "activeFlows": [',
    '    { "name": "alpha", "flowRef": "flows/alpha/FLOW.md", "location": "overlay" },',
    `    { "name": "beta", "flowRef": "flows/beta/FLOW.md", "location": "overlay", "pluginRoot": "${toPosix(betaWin)}" }`,
    "  ]",
    "}",
  ].join("\n");
  writeState(dirs, "A", stateJson);

  const r = runRecompact(dirs, compactStdin("A"));

  expect(r.code).toBe(0);
  expect(r.stdout).not.toContain("RE-READ the FLOW.md"); // no mis-rooted re-read for entry 1
  expect(r.stdout).toContain("malformed");
});

test("F_SCHEMA (recompact): an unknown/future schema is a silent no-op", () => {
  if (!GIT_BASH) return;
  const dirs = makeDirs();
  const overlayWin = join(dirs.cacheWin, "flowy-superpowers", "0.1.0");
  mkdirSync(join(overlayWin, "flows", "superpowers"), { recursive: true });
  writeFileSync(join(overlayWin, "flows", "superpowers", "FLOW.md"), "# routes");
  writeState(dirs, "A", {
    schema: "flowy-state-v99-from-the-future",
    sessionId: "A",
    activeFlows: [
      { name: "superpowers", flowRef: "flows/superpowers/FLOW.md", location: "overlay", pluginRoot: toPosix(overlayWin) },
    ],
  });

  const r = runRecompact(dirs, compactStdin("A"));

  expect(r.code).toBe(0);
  expect(r.stdout.trim()).toBe(""); // unknown schema → the reader does not parse it
});
