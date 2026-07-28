import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
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

   A6 (2026-07-28). It was lying anyway. `licenseFor` ended in a
   catch-all `return "Apache-2.0"`, so `=== null` was unreachable
   and the coverage guard below could not fail on ANY input. The
   ~100 assertions it makes were a tautology. Measured, with the
   catch-all in place and both files staged:

     THIRD-PARTY-LICENSE.txt                            Apache-2.0
     overlays/superpowers/flows/superpowers/bin/run.sh  CC-BY-SA-4.0

   8 pass / 0 fail. The first claims OUR license over somebody
   else's verbatim legal text. The second puts share-alike on an
   executable, the exact inversion of "EVERYTHING THAT EXECUTES is
   Apache-2.0". The bucket function is now an ALLOWLIST that
   returns null for anything it does not recognise, and the first
   test below pins that null so this guard keeps its teeth.
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

  /* ---- A6: the guard has to be ABLE to fail ---- */

  test("an unclassifiable path returns null so the guard can fail", () => {
    // The single assertion that makes every other one in this file mean
    // something. A verbatim third-party legal text at the repo root is the
    // concrete case: it is not ours to license, and the catch-all silently
    // stamped Apache-2.0 on it.
    expect(licenseFor("THIRD-PARTY-LICENSE.txt")).toBe(null);
  });

  test("an executable under overlays/*/flows/ is NOT routing content", () => {
    // The old rule keyed on the DIRECTORY alone, so anything dropped under a
    // flows/ tree inherited share-alike, including a shell script. NOTICE says
    // everything that executes is Apache-2.0; this is that sentence, tested.
    expect(licenseFor("overlays/superpowers/flows/superpowers/bin/run.sh")).toBe("Apache-2.0");
  });

  test("the scaffold template IS routing content and carries share-alike", () => {
    // C1: it is the routing content most likely to be copied, because it is
    // designed to be copied. It carries the mandatory-routing paragraph, the
    // tree shape, the priority-on-collision ordering and the rationalization
    // block, all of which are the expression ATTRIBUTION.md section 5 claims,
    // and it shipped under the one license with no share-alike.
    expect(licenseFor("engine/templates/flow-standard/FLOW.md")).toBe("CC-BY-SA-4.0");
    expect(licenseFor("engine/templates/flow-standard/ATTRIBUTION.md")).toBe("CC-BY-SA-4.0");
  });

  test("the template's plugin config still EXECUTES, so it stays Apache-2.0", () => {
    // INVARIANT PIN, not a RED: this was already correct before A6 and is
    // asserted so the C1 widening cannot swallow the config beside it.
    expect(licenseFor("engine/templates/flow-standard/.claude-plugin/plugin.json")).toBe(
      "Apache-2.0",
    );
  });
});

describe("scaffold template copy", () => {
  /* C7. These strings are not comments. `scaffold-flow.mjs` stamps __TITLE__
     and ships them as the plugin's rendered description, so every Flow built
     with our own scaffolder inherited a BRAND.md violation. Pinned here rather
     than in a brand test file because the scaffold template is what Task 12
     changes and what a third party actually receives. */
  const TEMPLATE = join(ROOT, "engine", "templates", "flow-standard");
  const RENDERED = [
    join(".claude-plugin", "plugin.json"),
    join(".claude-plugin", "marketplace.json"),
    "ATTRIBUTION.md",
    "FLOW.md",
  ];

  test("nothing the scaffolder stamps contains an em dash", () => {
    const offenders = RENDERED.filter((f) =>
      readFileSync(join(TEMPLATE, f), "utf8").includes("—"),
    );
    expect(offenders).toEqual([]);
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
