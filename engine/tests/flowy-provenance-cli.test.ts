import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

import { walk, check, generate } from "../tools/flowy-provenance.mjs";

/* ============================================================
   flowy-provenance CLI (2026-07-28)

   161 lines, the entry point every document points at, zero
   tests (B5). Three real defects were sitting behind that:
   a wrong-shaped manifest crashed with a raw stack (B6),
   .mdx / .mdc / .rst were silently skipped (B7), and an
   unreadable target was dropped while the run still reported
   a clean bill with exit 0 (B8).
   ============================================================ */

const SCRIPT = join(import.meta.dir, "..", "tools", "flowy-provenance.mjs");
const FIXTURE_DIR = join(import.meta.dir, "fixtures", "cli-scan");

describe("the documented entry point", () => {
  test("still runs under node, which is what every document tells you to use", () => {
    // The guard that makes this module importable must not also make the CLI
    // a silent no-op. `import.meta.main` is UNDEFINED on node v20, so a bare
    // `if (import.meta.main)` would leave `generate` and `check` doing nothing
    // while every test above kept passing, because the tests call the
    // functions directly and never the command.
    const r = spawnSync("node", [SCRIPT, "check", FIXTURE_DIR], { encoding: "utf8" });

    expect(r.stdout).toContain("checked");
    expect(r.status).toBe(0);
  });

  test("usage still exits 2 on a bad command", () => {
    const r = spawnSync("node", [SCRIPT, "nonsense"], { encoding: "utf8" });
    expect(r.status).toBe(2);
  });
});

describe("walk", () => {
  test("sees .mdx, .mdc and .rst", () => {
    // B7: routing prose does not only live in .md. Cursor writes .mdc, several
    // doc toolchains write .mdx, and .rst is ordinary in Python projects.
    const found = walk(FIXTURE_DIR).map((p) => basename(p));

    expect(found).toContain("routing.mdx");
    expect(found).toContain("router.mdc");
    expect(found).toContain("AGENTS.rst");
    expect(found).toContain("plain.md");
  });

  test("a single file target returns just that file", () => {
    expect(walk(join(FIXTURE_DIR, "plain.md"))).toEqual([join(FIXTURE_DIR, "plain.md")]);
  });
});

describe("check", () => {
  test("a wrong-shaped manifest fails with a message, not a stack", () => {
    // B6. Written to a TEMP path on purpose: a test that overwrites the
    // committed manifest corrupts the evidence artifact the whole subsystem
    // exists to preserve, and leaves it corrupted if it fails part-way.
    const bad = join(mkdtempSync(join(tmpdir(), "flowy-cli-")), "manifest.json");
    writeFileSync(bad, '{"schema":"flowy-provenance-v2"}', "utf8");

    expect(check([FIXTURE_DIR], bad)).toBe(2);
  });

  test("a manifest with no flows array fails the same way", () => {
    const bad = join(mkdtempSync(join(tmpdir(), "flowy-cli-")), "manifest.json");
    writeFileSync(bad, '{"schema":"flowy-provenance-v1"}', "utf8");

    expect(check([FIXTURE_DIR], bad)).toBe(2);
  });

  test("a missing manifest fails rather than throwing", () => {
    expect(check([FIXTURE_DIR], join(tmpdir(), "flowy-no-such-manifest.json"))).toBe(2);
  });

  test("an unreadable target is reported, not silently dropped", () => {
    // B8: the walk failure was swallowed and the run reported "No match" with
    // exit 0. A partial scan must never read as a clean bill.
    const rc = check([join(FIXTURE_DIR, "DOES-NOT-EXIST"), FIXTURE_DIR]);
    expect(rc).not.toBe(0);
  });

  test("a clean scan of unrelated files still exits 0", () => {
    // The other direction. If everything returns non-zero the exit code is
    // noise, and the tool is unusable in CI.
    expect(check([FIXTURE_DIR])).toBe(0);
  });
});

describe("generate", () => {
  test("is importable and reports success", () => {
    // Kept honest by tests/provenance-manifest.test.ts, which compares the
    // committed manifest against a fresh build. This only pins that the
    // command is reachable as a function.
    expect(typeof generate).toBe("function");
  });
});
