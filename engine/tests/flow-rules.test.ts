import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { validateFlow } from "../tools/validate-flow.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  checkRouteVerbs,
  checkNoOrphanSkills,
  checkSectionOrder,
  checkAdvisoryPhrasing,
  checkDriftClause,
  checkClaimedCounts,
  checkFlowRules,
} from "../tools/flow-rules.mjs";

/* ============================================================
   FLOW AUTHORING RULES (2026-07-28)

   Spec: docs/decisions/2026-07-28-flow-authoring-rules.md
   Plan: docs/plans/2026-07-28-flow-authoring-rules.md

   Diagnosed by diffing the FLOW.md that fires ~97% against the
   one that does not. Same engine, same hook, same banner, so the
   cause was in the content.

   R2 (trigger style) and R7 (register) are deliberately NOT
   checked here. They are judgment calls, and a check pretending
   to cover them would be a test that can never fail.
   ============================================================ */

describe("checkRouteVerbs (R3)", () => {
  test("a route line with the verb passes", () => {
    expect(checkRouteVerbs("  ├─ about to code? → invoke sp:tdd\n")).toEqual([]);
  });

  test("a route line naming a skill with NO verb is an error", () => {
    // The receipt-not-promise defect one layer down: a noun is a reference,
    // a verb is an instruction.
    const errs = checkRouteVerbs("  ├─ about to code? → sp:tdd\n");
    expect(errs.length).toBe(1);
    expect(errs[0]).toContain("sp:tdd");
  });

  test("prose that mentions a skill is NOT a route line", () => {
    // Disambiguation and Attribution name skills constantly. Treating those as
    // routes would make the rule unsatisfiable.
    expect(checkRouteVerbs("sp:tdd and sp:review overlap on purpose.\n")).toEqual([]);
  });

  test("ASCII arrows count as routes too", () => {
    expect(checkRouteVerbs("  - bug? -> sp:debug\n").length).toBe(1);
  });
});

describe("checkNoOrphanSkills (R1)", () => {
  test("a skill that appears only in prose is an orphan", () => {
    // THE defect: 40 of 47 skills named in an index with no trigger.
    const errs = checkNoOrphanSkills(
      "## Routing\n- x? → invoke ms:cro\n\n## More\nms:ai-seo is available.\n",
    );
    expect(errs.length).toBe(1);
    expect(errs[0]).toContain("ms:ai-seo");
  });

  test("a skill named in prose AND routed is not an orphan", () => {
    const text = "## Routing\n- x? → invoke ms:cro\n\n## Notes\nms:cro pairs well with research.\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });

  test("the orphan rule flags the ACTUAL growth-marketing passive index", () => {
    // A4: this is the defect the whole standard is named after. The unit tests
    // used `ms:ai-seo`; the real file writes `` `ai-seo` `` in a backticked
    // list, so the rule returned ZERO errors on its own motivating example.
    const p = join(
      import.meta.dir, "..", "..", "overlays", "growth-marketing", "flows", "growth-marketing", "FLOW.md",
    );
    const errs = checkNoOrphanSkills(readFileSync(p, "utf8"));
    expect(errs.length).toBeGreaterThan(20);
    expect(errs.join("\n")).toContain("ai-seo");
  });

  test("a backticked bare slug in a prose list is an orphan", () => {
    const text =
      "## Routing\n- x? → invoke marketing-skills:cro\n\n## More\n- **Acquisition:** `ads`, `ai-seo`, `schema`\n";
    const errs = checkNoOrphanSkills(text);
    expect(errs.length).toBe(3);
  });

  test("a backticked NON-skill word is not an orphan", () => {
    // False positives are what get a rule disabled. `bun test` is not a skill.
    const text =
      "## Routing\n- x? → invoke marketing-skills:cro\n\nRun `bun test` and `npm run build`.\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });

  test("a bare slug the file already routes is NOT an orphan", () => {
    // `ms:cro` routes the bare `cro`, and names the plugin `ms`. Flagging either
    // would tell the author to delete a name the file demonstrably routes.
    const text =
      "## Routing\n- x? → invoke marketing-skills:cro\n\n## More\nThe `marketing-skills` plugin ships `cro`.\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });

  test("an HTML comment is authoring guidance, not routing content", () => {
    // The shipped template documents R3 as "every route line carries the verb
    // `invoke`", inside a comment. Reading that as a passive index made the
    // template fail its own rules, which teaches every scaffolded Flow to.
    const text =
      "## Routing\n- x? → invoke ms:cro\n\n<!--\n  R3 every route line carries the verb `invoke`.\n-->\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });

  test("a plugin the Attribution section credits is not an orphan", () => {
    // An attribution-first repo must never have its own linter say "remove the
    // name" about an upstream credit. A Flow that repackages five plugins under
    // one namespace names all five in prose to explain the lanes.
    const text =
      "## Routing\n- x? → invoke up:cro\n\n## Lanes\n`claude-seo` owns SEO; `marketing-skills` owns GTM.\n\n## Attribution\n- **claude-seo** by AgricIDaniel, MIT\n- **marketing-skills** by Corey Haines, MIT\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });

  test("the Attribution section is exempt", () => {
    // Attribution MUST name upstream skills to credit them. Requiring a route
    // for each would force a choice between crediting and validating.
    const text = "## Routing\n- x? → invoke ms:cro\n\n## Attribution\nms:ai-seo by Corey Haines, MIT.\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });
});

describe("checkSectionOrder (R5)", () => {
  test("Routing first passes", () => {
    expect(checkSectionOrder("# T\n\n## Routing\nx\n\n## Phases\ny\n")).toEqual([]);
  });

  test("Phases before Routing is an error", () => {
    // growth-marketing led with 7 numbered Phases and pushed routing down.
    expect(checkSectionOrder("# T\n\n## Phases\ny\n\n## Routing\nx\n").length).toBe(1);
  });
});

describe("checkAdvisoryPhrasing (R4)", () => {
  test("the narrow escape passes", () => {
    expect(checkAdvisoryPhrasing("advise? → answer only; no files change\n")).toEqual([]);
  });

  test("answering from a skill's principles is banned", () => {
    // This sentence authorises the exact from-memory behaviour the engine
    // exists to stop, in the file that exists to stop it.
    const errs = checkAdvisoryPhrasing("→ answer from the relevant skill's principles\n");
    expect(errs.length).toBe(1);
  });

  test("the denylist is case-insensitive and apostrophe-agnostic", () => {
    expect(checkAdvisoryPhrasing("Answer From The Skill’s Principles.\n").length).toBe(1);
  });
});

describe("checkDriftClause (R6)", () => {
  test("a file containing the drift clause passes", () => {
    expect(
      checkDriftClause("**Drift:** a broken route is this Flow needing an update, never license to improvise.\n"),
    ).toEqual([]);
  });

  test("a file with no drift clause is an error", () => {
    expect(checkDriftClause("## Routing\nx\n").length).toBe(1);
  });
});

describe("checkClaimedCounts (R6)", () => {
  test("a claim that matches the routed count passes", () => {
    expect(checkClaimedCounts("routes 2 skills\n- a? → invoke x:one\n- b? → invoke y:two\n")).toEqual([]);
  });

  test("a claim that overstates the routed count is an error", () => {
    // The file said "47 skills" and listed 45.
    const errs = checkClaimedCounts("the full 47 skills set\n- a? → invoke x:one\n");
    expect(errs.length).toBe(1);
    expect(errs[0]).toContain("47");
  });

  test("under-claiming is allowed", () => {
    // A Flow may legitimately describe a subset of what it routes.
    const routes = Array.from({ length: 30 }, (_, i) => `- a? → invoke x:s${i}`).join("\n");
    expect(checkClaimedCounts(`covers 10 skills\n${routes}\n`)).toEqual([]);
  });
});

describe("checkFlowRules", () => {
  test("aggregates every rule's errors", () => {
    const errs = checkFlowRules("# T\n\n## Phases\np\n\n## Routing\n- a? → x:one\n");
    expect(errs.length).toBeGreaterThanOrEqual(3); // order + verb + drift
  });

  test("CRLF input produces the SAME result as LF", () => {
    // A3: on a fresh Windows clone every heading was invisible, so R5 always
    // errored and R1 started demanding authors delete upstream credits.
    const lf =
      "# T\n\n## Routing\n- x? → invoke ms:cro\n\n## Attribution\nms:ai-seo by Corey Haines, MIT.\n\n**Drift:** never license to improvise.\n";
    expect(checkFlowRules(lf)).toEqual([]);
    expect(checkFlowRules(lf.replace(/\n/g, "\r\n"))).toEqual([]);
  });

  test("the shipped template passes its own rules", () => {
    // A template that violates the standard teaches every new Flow to violate it.
    // engine/templates/, which is where scaffold-flow.mjs resolves it from.
    const p = join(import.meta.dir, "..", "templates", "flow-standard", "FLOW.md");
    expect(checkFlowRules(readFileSync(p, "utf8"))).toEqual([]);
  });
});

describe("the scaffolder produces a compliant, validating Flow", () => {
  // scaffold-flow.mjs shipped BROKEN: it copies engine/templates/flow-standard,
  // which did not exist, so every invocation died with ENOENT. Nothing tested
  // it. A build tool nobody runs in CI is a build tool that is already broken.
  test("scaffolding a flow yields one that passes BOTH checkers", () => {
    const target = join(mkdtempSync(join(tmpdir(), "flowy-scaffold-")), "demo-flow");
    execFileSync("node", [join(import.meta.dir, "..", "tools", "scaffold-flow.mjs"), target, "demo", "Demo Flow"], {
      encoding: "utf8",
    });

    const v = validateFlow(target);
    if (!v.ok) console.error(v.errors.join("\n"));
    expect(v.ok).toBe(true);
    expect(checkFlowRules(readFileSync(join(target, "FLOW.md"), "utf8"))).toEqual([]);
  });

  test("the placeholders are actually stamped", () => {
    // A template that ships __SLUG__ into the new repo is worse than no template.
    const target = join(mkdtempSync(join(tmpdir(), "flowy-scaffold-")), "demo-flow");
    execFileSync("node", [join(import.meta.dir, "..", "tools", "scaffold-flow.mjs"), target, "demo", "Demo Flow"], {
      encoding: "utf8",
    });
    const flow = readFileSync(join(target, "FLOW.md"), "utf8");
    expect(flow).not.toContain("__SLUG__");
    expect(flow).not.toContain("__TITLE__");
    expect(flow).toContain("Demo Flow");
  });
});
