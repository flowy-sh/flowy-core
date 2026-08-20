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

describe("checkRouteVerbs (R3) — a ROUTE is a line in the routing tree, not any arrow", () => {
  /**
   * Every shipped Flow puts its entire routing tree inside a fence, and every
   * Flow also uses arrows in PROSE: a Disambiguation line ("an SEO-specific verb
   * -> ultra-powers:seo"), a Phases lifecycle chain, a rationalization. Those are
   * explanation, not instruction, and demanding the verb in them produced 4 of
   * ultra-powers' 56 errors. The only remedies were to mangle readable prose or
   * to switch the rule off, which is how a guard that cries wolf dies.
   *
   * Task 7's escape hatch covers exactly this: when a rule flags legitimate
   * content, amend the rule.
   */
  test("an arrow in PROSE, outside the fence, is not a route", () => {
    const prose = "## Disambiguation\nAn SEO-specific verb → ultra-powers:seo; otherwise marketing.\n";
    expect(checkRouteVerbs(prose)).toEqual([]);
  });

  test("a lifecycle chain in Phases is not a route either", () => {
    const phases = "## Phases\nValidate (ultra-powers:office-hours) → Design (ultra-powers:brainstorming)\n";
    expect(checkRouteVerbs(phases)).toEqual([]);
  });

  test("a verbless route INSIDE the fence is still an error", () => {
    // The rule must keep its teeth where routing actually lives.
    const fenced = "## Routing\n\n```\n  ├─ about to code? → ultra-powers:tdd\n```\n";
    expect(checkRouteVerbs(fenced).length).toBe(1);
    expect(checkRouteVerbs(fenced)[0]).toContain("ultra-powers:tdd");
  });

  test("a verbed route inside the fence passes", () => {
    const ok = "## Routing\n\n```\n  ├─ about to code? → invoke ultra-powers:tdd\n```\n";
    expect(checkRouteVerbs(ok)).toEqual([]);
  });
});

describe("checkRouteVerbs (R3)", () => {
  /**
   * Wrap a route in a fence, because R3 is scoped to the routing tree and every
   * shipped Flow fences its tree.
   *
   * These fixtures were BARE when the rule matched any arrow. After fence-scoping
   * landed, the two positive cases below ("verb passes", "capitalised verb")
   * started passing for the WRONG reason: with no fence the line was skipped, so
   * they asserted [] against a rule that never looked. They were green and
   * vacuous. Wrapping every fixture, not just the ones that went red, is what
   * keeps them meaningful.
   */
  const fenced = (line: string) => "## Routing\n\n\`\`\`\n" + line + "\`\`\`\n";

  test("a route line with the verb passes", () => {
    expect(checkRouteVerbs(fenced("  ├─ about to code? → invoke sp:tdd\n"))).toEqual([]);
  });

  test("a route line naming a skill with NO verb is an error", () => {
    // The receipt-not-promise defect one layer down: a noun is a reference,
    // a verb is an instruction.
    const errs = checkRouteVerbs(fenced("  ├─ about to code? → sp:tdd\n"));
    expect(errs.length).toBe(1);
    expect(errs[0]).toContain("sp:tdd");
  });

  test("prose that mentions a skill is NOT a route line", () => {
    // Disambiguation and Attribution name skills constantly. Treating those as
    // routes would make the rule unsatisfiable.
    expect(checkRouteVerbs(fenced("sp:tdd and sp:review overlap on purpose.\n"))).toEqual([]);
  });

  test("ASCII arrows count as routes too", () => {
    expect(checkRouteVerbs(fenced("  - bug? -> sp:debug\n")).length).toBe(1);
  });

  test("a re-entry directive is not a single-skill route", () => {
    /**
     * THE DOCUMENTED FALSE POSITIVE. The plan records that `superpowers` sits at
     * exactly 1 error and that it is "a known false positive on a re-entry
     * instruction", which is why Task 7 carries an escape hatch: when a rule
     * flags the reference implementation whose ~97% firing the whole cycle
     * exists to reproduce, the RULE is wrong before the file is.
     *
     * The line directs re-entry to a PHASE. The skills in parentheses are
     * candidates for which phase to return to, not a target to invoke, so
     * demanding a verb misreads what the line does. Editing the reference file
     * to satisfy it is the one change with a real chance of destroying the
     * behaviour being copied.
     */
    const reentry =
      "## Routing\n\n\`\`\`\n  ├─ scope changed mid-task? → re-enter the earliest invalidated phase (superpowers:brainstorming or superpowers:writing-plans)\n\`\`\`\n";
    expect(checkRouteVerbs(reentry)).toEqual([]);
  });

  test("but a plain verbless route is STILL an error, exemption or not", () => {
    // The exemption must be narrow. If it swallowed ordinary routes it would
    // disable R3 entirely, which is the failure mode of every escape hatch.
    const plain = "## Routing\n\n\`\`\`\n  ├─ about to code? → superpowers:tdd\n\`\`\`\n";
    expect(checkRouteVerbs(plain).length).toBe(1);
  });

  test("R3 accepts a capitalised verb", () => {
    // A8. Every sibling rule is case-insensitive; this one told authors to
    // lowercase a sentence-initial verb, which is how a checker gets switched
    // off.
    expect(checkRouteVerbs(fenced("- x? → Invoke sp:tdd\n"))).toEqual([]);
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

  test("the orphan rule flags a passive index in the REAL shape it took", () => {
    // A4: the defect the whole standard is named after. The unit tests used
    // `ms:ai-seo`; the real file wrote `` `ai-seo` `` in a backticked list, so
    // the rule returned ZERO errors on its own motivating example.
    //
    // THIS IS A FIXTURE, not a read of the shipped file. It used to read
    // growth-marketing/FLOW.md and assert >20 orphans, which pinned the BUG
    // rather than the RULE: the moment that file was fixed (2026-07-29, 54
    // errors -> 0) the test failed for the best possible reason. A guard whose
    // passing condition is "our content is still broken" cannot survive its own
    // success. The excerpt below is the real index, verbatim, so the rule stays
    // pinned against the shape that actually occurred.
    const realPassiveIndex = [
      "## Routing",
      "  ├─ page not converting? → invoke marketing-skills:cro",
      "",
      "## Additional skills (also available)",
      "",
      "The full `marketing-skills` set is available in the installed plugin; fire any as",
      "**`marketing-skills:<name>`** when its trigger matches. Index by intent:",
      "",
      "- **Acquisition / traffic:** `ads`, `ad-creative`, `ai-seo`, `programmatic-seo`, `directory-submissions`, `public-relations`, `prospecting`, `co-marketing`, `community-marketing`, `referrals`",
      "- **Conversion / on-page:** `signup`, `onboarding`, `paywalls`, `popups`, `offers`, `lead-magnets`, `free-tools`, `marketing-psychology`",
      "- **Content / channels:** `content-strategy`, `social`, `emails`, `sms`, `video`, `image`, `copy-editing`",
      "- **Ops / measurement:** `analytics`, `revops`, `churn-prevention`, `schema`, `site-architecture`, `aso`",
    ].join("\n");
    const errs = checkNoOrphanSkills(realPassiveIndex);
    expect(errs.length).toBeGreaterThan(20);
    expect(errs.join("\n")).toContain("ai-seo");
  });

  test("and the SHIPPED growth-marketing file now has none of them", () => {
    // The other half of the pair. The fixture above proves the rule can fire;
    // this proves the content was actually fixed. Separating them is the point:
    // one assertion cannot do both without inverting when the fix lands.
    const p = join(
      import.meta.dir, "..", "..", "overlays", "growth-marketing", "flows", "growth-marketing", "FLOW.md",
    );
    expect(checkNoOrphanSkills(readFileSync(p, "utf8"))).toEqual([]);
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

  test("R1's Attribution exemption is an EXACT heading, not a prefix", () => {
    // A8: `## Attributions and index` was being treated as Attribution, which
    // is a one-word rename away from exempting the whole passive index.
    const text = "## Routing\n- x? → invoke ms:cro\n\n## Attributions and index\nms:ai-seo\n";
    expect(checkNoOrphanSkills(text).length).toBe(1);
  });

  test("a fenced code block is not scanned for names", () => {
    // A8: a shell command is not a route and `test:watch` is not a skill.
    const text = "## Routing\n- x? → invoke ms:cro\n\n```\n## not a heading\nnpm run test:watch\n```\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });

  test("a route line INSIDE a fence still counts as a route", () => {
    // LOAD-BEARING. Every shipped Flow puts its ENTIRE routing tree in a fenced
    // block. Skipping fences wholesale empties `routed` and turns every named
    // skill into an orphan, which is the exact opposite of the rule.
    const text = "## Routing\n\n```\n- x? → invoke ms:cro\n```\n\n## Notes\nms:cro is the only one.\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });

  test("a port or a time is not a skill reference", () => {
    const text = "## Routing\n- x? → invoke ms:cro\n\nSee http://localhost:3000, standup 09:30.\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });

  /* FOUND BY SHIPPING, 2026-08-20. `superset-sh/superset` ships a skill named
     `10x`. SKILL_REF required BOTH halves to START with a letter, so
     `superset:10x` matched nothing: the Flow routed 8 skills,
     checkClaimedCounts counted 7, and a CORRECT Flow failed its own shipping
     gate with "claims 8 skills but routes 7". A false negative in a gate is
     the worst kind, because the remedy it suggests is to weaken a true claim.

     The letter-FIRST rule was aimed at `localhost:3000` and `09:30`, and the
     property that actually separates those from a skill is not POSITION: it is
     that `3000` and `30` contain NO LETTER AT ALL. Requiring at least one
     letter keeps both exclusions and admits the real name. */
  test("a skill name starting with a digit is still counted as routed", () => {
    const text =
      "> Routes 1 skills\n\n## Routing\n\n```\n- x? → invoke superset:10x\n```\n";
    expect(checkClaimedCounts(text)).toEqual([]);
  });

  test("a colon segment with no letter at all is still not a skill", () => {
    const text =
      "## Routing\n- x? → invoke ms:cro\n\nSee http://localhost:3000, standup 09:30, map 8080:3000." + "\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });

  /* THE THIRD AXIS OF THE SAME REGEX, FOUND BY SHIPPING, 2026-08-20.
     This morning SKILL_REF was widened so the SKILL half may start with a
     digit (`superset:10x`). The NAMESPACE half was left lowercase-only, and
     `cyberkaida/reverse-engineering-assistant` publishes its plugin as `ReVa`.
     So `ReVa:decompile` matched nothing: the Flow routed 6 skills, the checker
     counted 0, and a correct Flow failed its own gate with "claims 6 skills
     but routes 0".

     A plugin NAME is whatever its manifest says, and manifests carry capitals.
     Case has nothing to do with the exclusions this pattern exists for: a port
     and a time are still excluded, because `3000` and `30` contain no letter
     and `09` does not start with one. */
  test("a namespace with capitals is still a skill reference", () => {
    const text =
      "> Routes 1 skills\n\n## Routing\n\n```\n- x? → invoke ReVa:decompile\n```\n";
    expect(checkClaimedCounts(text)).toEqual([]);
  });

  test("a port and a time stay excluded whatever the case", () => {
    const text =
      "## Routing\n- x? → invoke ms:cro\n\nSee http://LocalHost:3000, standup 09:30." + "\n";
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

  test("a heading inside a fence is not a section", () => {
    // A8: `## Phases` shown as an EXAMPLE inside a code block was reordering
    // the real document.
    expect(checkSectionOrder("# T\n\n```\n## Phases\n```\n\n## Routing\nx\n")).toEqual([]);
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

  test("R6 catches the 47-plus form", () => {
    // A8: the crafted defect file wrote "47+ skills" and passed with 0 errors.
    expect(checkClaimedCounts("the 47+ skills bundle\n- a? → invoke x:one\n").length).toBe(1);
  });

  test("R6 reports one error per distinct over-claim, not per repetition", () => {
    expect(checkClaimedCounts("40 skills. 40 skills. 40 skills.\n- a? → invoke x:one\n").length).toBe(1);
  });

  test("under-claiming is allowed", () => {
    // A Flow may legitimately describe a subset of what it routes.
    const routes = Array.from({ length: 30 }, (_, i) => `- a? → invoke x:s${i}`).join("\n");
    expect(checkClaimedCounts(`covers 10 skills\n${routes}\n`)).toEqual([]);
  });
});

describe("checkFlowRules", () => {
  test("aggregates every rule's errors", () => {
    // The route sits inside a fence so R3 can see it: R3 is scoped to the
    // routing tree, and an unfenced arrow is prose. Without the fence this
    // asserted 3 errors while only 2 rules had fired, so it passed on a
    // miscount rather than on the aggregation it is named for.
    const errs = checkFlowRules(
      "# T\n\n## Phases\np\n\n## Routing\n\n\`\`\`\n- a? → x:one\n\`\`\`\n",
    );
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
