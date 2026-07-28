import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

import { licenseFor, LICENSE_BUCKETS } from "../tools/license-buckets.mjs";

/* ============================================================
   LICENSE COVERAGE GUARD (2026-07-28)

   NOTICE claims a rule:

       ROUTING CONTENT is CC BY-SA 4.0.
       EVERYTHING THAT EXECUTES is Apache-2.0.

   A dual license is only real if every file lands in exactly one
   bucket. A file nobody assigned is a file with NO license, which
   under copyright means all rights reserved: the worst outcome,
   because it deters the good-faith fork and does nothing about a
   bad actor.

   NOTICE says this split is enforced by a test rather than by
   good intentions. This is that test. If it does not exist, or
   does not walk the real file list, NOTICE is lying.
   ============================================================ */

const ROOT = join(import.meta.dir, "..", "..");

const trackedFiles = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" })
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

describe("license buckets", () => {
  test("routing content is CC BY-SA 4.0", () => {
    expect(licenseFor("overlays/ultra-powers/flows/ultra-powers/FLOW.md")).toBe("CC-BY-SA-4.0");
    expect(licenseFor("overlays/growth-marketing/flows/growth-marketing/FLOW-compact.md")).toBe(
      "CC-BY-SA-4.0",
    );
  });

  test("the engine is Apache-2.0", () => {
    expect(licenseFor("engine/hooks/flowy-inject.sh")).toBe("Apache-2.0");
    expect(licenseFor("engine/tools/validate-flow.mjs")).toBe("Apache-2.0");
  });

  test("an overlay's activate shim executes, so it is Apache-2.0 and NOT content", () => {
    // The shim calls the activator. It is mechanism, not routing. Getting this
    // wrong would put share-alike on a file whose whole job is to be copied
    // into every new overlay.
    expect(licenseFor("overlays/superpowers/skills/activate/SKILL.md")).toBe("Apache-2.0");
  });

  test("a FLOW.md under engine/tests/fixtures is a test fixture, not shipped routing", () => {
    // Fixtures exist to exercise the parser. Licensing them as routing content
    // would claim share-alike over a file that says "demo-skill by Demo Author".
    expect(licenseFor("engine/tests/fixtures/good-flow/FLOW.md")).toBe("Apache-2.0");
  });

  test("the verbatim third-party license texts are their own bucket", () => {
    // We did not write CC BY-SA 4.0 or Apache-2.0 and must not claim to license them.
    expect(licenseFor("LICENSE")).toBe("license-text");
    expect(licenseFor("LICENSE-CODE")).toBe("license-text");
  });

  test("every bucket a file can land in is a declared bucket", () => {
    for (const f of trackedFiles) {
      expect(LICENSE_BUCKETS).toContain(licenseFor(f));
    }
  });
});

describe("coverage", () => {
  test("every tracked file is covered by exactly one bucket", () => {
    const uncovered = trackedFiles.filter((f) => licenseFor(f) === null);
    expect(uncovered).toEqual([]);
  });

  test("the repo actually ships both license texts", () => {
    expect(trackedFiles).toContain("LICENSE");
    expect(trackedFiles).toContain("LICENSE-CODE");
    expect(trackedFiles).toContain("NOTICE");
    expect(trackedFiles).toContain("ATTRIBUTION.md");
  });
});
