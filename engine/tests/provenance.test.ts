import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  normalizeText,
  contentHash,
  routeSequence,
  routeContainment,
  orderScore,
  compareToCanonical,
} from "../tools/provenance-core.mjs";

const MANIFEST_PATH = join(import.meta.dir, "..", "provenance", "manifest.json");

/* ============================================================
   PROVENANCE / FINGERPRINT CORE (2026-07-28)

   ATTRIBUTION.md says copying "gets demonstrated rather than
   asserted". That promise is only worth something if the
   detector is both SENSITIVE (catches a reworded copy) and
   SPECIFIC (does not cry wolf on an unrelated router).

   Specificity is the harder half and the one that decides
   whether the tool is usable. A detector that flags every file
   that mentions `superpowers:brainstorming` would produce a
   confident accusation against an honest author, which is worse
   than having no tool at all. The false-positive tests below
   are load-bearing, not decoration.
   ============================================================ */

const CANONICAL = `# FLOW.md: demo

  ├─ new idea worth building?      → ultra-powers:office-hours
  ├─ refine it into a spec?        → ultra-powers:brainstorming
  ├─ approved design to a plan?    → ultra-powers:writing-plans
  ├─ about to write code?          → ultra-powers:test-driven-development
  └─ about to claim done?          → ultra-powers:verification-before-completion

## You are rationalizing if you think...

- "I'll just design the screen myself." -> The taste is in the skill. Invoke it.
- "I'll verify after." -> Run the command in THIS message.
`;

describe("normalizeText", () => {
  test("a CRLF checkout and an LF checkout hash identically", () => {
    // Without this the tool reports our OWN Windows checkout as a non-match,
    // which is how a provenance tool quietly becomes decorative.
    const lf = "alpha\nbeta\n";
    const crlf = "alpha\r\nbeta\r\n";

    expect(contentHash(crlf)).toBe(contentHash(lf));
  });

  test("trailing whitespace does not change the hash", () => {
    expect(contentHash("alpha   \nbeta\n")).toBe(contentHash("alpha\nbeta\n"));
  });

  test("a real word change DOES change the hash", () => {
    expect(contentHash("alpha\n")).not.toBe(contentHash("alpine\n"));
  });

  test("normalizeText is idempotent", () => {
    const once = normalizeText("a  \r\nb\r\n\r\n");
    expect(normalizeText(once)).toBe(once);
  });
});

describe("routeSequence", () => {
  test("returns namespaced skill references in document order", () => {
    expect(routeSequence(CANONICAL)).toEqual([
      "ultra-powers:office-hours",
      "ultra-powers:brainstorming",
      "ultra-powers:writing-plans",
      "ultra-powers:test-driven-development",
      "ultra-powers:verification-before-completion",
    ]);
  });

  test("a URL is not a route", () => {
    // `https://flowy.sh` must not read as namespace `https` skill `//flowy.sh`.
    expect(routeSequence("see https://flowy.sh for details")).toEqual([]);
  });

  test("a prose label followed by a space is not a route", () => {
    expect(routeSequence("Gate: a research brief. Phase: 2.")).toEqual([]);
  });

  test("a slash is not a separator in OUR canonical extraction", () => {
    // A9's first draft canonicalized `/` to `:` on BOTH sides. Measured on the
    // shipped Flows that took growth-marketing from 7 routes to 14 and
    // ultra-powers from 40 to 56, every addition a prose fragment:
    // `read:invoke` from "READ/invoke", `ceo:eng` from "CEO/eng",
    // `com:coreyhaines31` from a GitHub URL. Containment divides by OUR count,
    // so that halves the score for the exact reworded copy this detector
    // exists to catch. Widen what counts as the SAME route, never what counts
    // as a route.
    expect(routeSequence("we READ/invoke and check CEO/eng")).toEqual([]);
    expect(routeSequence("see https://github.com/obra/superpowers")).toEqual([]);
    expect(routeSequence("see https://flowy.sh/license for terms")).toEqual([]);
  });
});

describe("routeContainment", () => {
  test("an identical route set is fully contained", () => {
    expect(routeContainment(["a:1", "b:2"], ["a:1", "b:2"])).toBe(1);
  });

  test("half the canonical routes present scores 0.5", () => {
    expect(routeContainment(["a:1", "b:2"], ["a:1", "z:9"])).toBe(0.5);
  });

  test("an empty canonical set scores 0 rather than dividing by zero", () => {
    expect(routeContainment([], ["a:1"])).toBe(0);
  });
});

describe("orderScore", () => {
  test("the same routes in the same order score 1", () => {
    expect(orderScore(["a:1", "b:2", "c:3"], ["a:1", "b:2", "c:3"])).toBe(1);
  });

  test("the same routes fully reversed score low", () => {
    // Shared vocabulary, independent arrangement. This is the shape of an
    // honest author who happens to route to the same public skills.
    expect(orderScore(["a:1", "b:2", "c:3"], ["c:3", "b:2", "a:1"])).toBeLessThan(0.5);
  });

  test("no shared routes scores 0", () => {
    expect(orderScore(["a:1"], ["z:9"])).toBe(0);
  });

  test("orderScore measures arrangement, not verbosity", () => {
    // B1: repeated MENTIONS diluted the denominator, so a verbatim Routing tree
    // scored 0.34 and an appended skill index dropped it below the threshold.
    expect(orderScore(["a:1", "b:2", "c:3"], ["a:1", "a:1", "a:1", "b:2", "c:3"])).toBe(1);
  });
});

describe("compareToCanonical", () => {
  const canonical = {
    id: "demo",
    hash: contentHash(CANONICAL),
    routes: routeSequence(CANONICAL),
    canaries: ["The taste is in the skill", "Run the command in THIS message"],
  };

  test("a byte-identical copy is reported as an exact match", () => {
    const r = compareToCanonical(canonical, CANONICAL);
    expect(r.exact).toBe(true);
    expect(r.verdict).toBe("identical");
  });

  test("a CRLF copy of our own file is still exact", () => {
    const r = compareToCanonical(canonical, CANONICAL.replace(/\n/g, "\r\n"));
    expect(r.exact).toBe(true);
  });

  test("reworded prose that keeps the routes and their order reports FULL evidence, but does not accuse", () => {
    // Was: expected `derivative-likely`. A10 forced this down to
    // `possible-derivative`, and the demotion is the point, not a regression.
    // This fixture and engine/tests/fixtures/independent-router.md are
    // structurally IDENTICAL: same routes, same order, no carried prose. No
    // signal separates a copier who rewrote every sentence from an honest
    // author who picked the same public skills and arranged them by lifecycle.
    // The evidence is still reported in full at 100/100, so a human reading the
    // report sees exactly what a human needs to see. Only the machine's word
    // "likely" is withheld, and PROVENANCE.md already chose that side: "A tool
    // that accuses an honest author is worse than no tool."
    const reworded = `# My Router

  - want to know if the idea is good?   → ultra-powers:office-hours
  - turn it into a design?              → ultra-powers:brainstorming
  - break the design into tasks?        → ultra-powers:writing-plans
  - starting to code?                   → ultra-powers:test-driven-development
  - finishing up?                       → ultra-powers:verification-before-completion
`;
    const r = compareToCanonical(canonical, reworded);

    expect(r.exact).toBe(false);
    expect(r.routeContainment).toBe(1);
    expect(r.orderScore).toBe(1);
    expect(r.matchedRoutes.length).toBe(5);
    expect(r.verdict).toBe("possible-derivative");
  });

  test("canary strings carried verbatim are reported individually", () => {
    const withCanary = `# Other\n\n- "whatever" -> The taste is in the skill. Invoke it.\n`;
    const r = compareToCanonical(canonical, withCanary);

    expect(r.canaryHits).toEqual(["The taste is in the skill"]);
  });

  test("a separator or case change does not erase the routes", () => {
    // A9: a byte-complete copy reached `no-match` after a prose re-wrap plus a
    // `plugin/skill` separator change. Neither transform removes anything.
    const d = { id: "d", hash: "", routes: ["ns:alpha", "ns:beta"], canaries: [] };
    for (const variant of ["ns/alpha ns/beta", "NS:Alpha NS:Beta"]) {
      expect(compareToCanonical(d, variant).routeContainment).toBe(1);
    }
  });

  test("a variant separator only counts for a route we ACTUALLY have", () => {
    // The widening is "the same route written differently", never "one more
    // thing that counts as a route". `sh/license` in a URL is not a route.
    const d = { id: "d", hash: "", routes: ["ns:alpha"], canaries: [] };
    const r = compareToCanonical(d, "ns/alpha and see https://flowy.sh/license");
    expect(r.routeContainment).toBe(1);
    expect(r.suspectRouteCount).toBe(1);
  });

  test("a re-wrapped paragraph does not erase a canary", () => {
    const d = { id: "d", hash: "", routes: [], canaries: ["The taste is in the skill"] };
    const rewrapped = "prose prose The taste is\nin the skill. more prose\n";
    expect(compareToCanonical(d, rewrapped).canaryHits.length).toBe(1);
  });

  test("an unrelated router that shares NO routes is not flagged", () => {
    const unrelated = `# Someone else's router

  - need a database?  → other-plugin:sql-helper
  - need a chart?     → other-plugin:viz
`;
    const r = compareToCanonical(canonical, unrelated);

    expect(r.verdict).toBe("no-match");
    expect(r.canaryHits).toEqual([]);
  });

  test("an honest router over the SAME public skills is not flagged as a copy", () => {
    // THE false-positive case. These skills are public and anyone may route to
    // them. Same vocabulary, different selection and different order must NOT
    // produce an accusation.
    const honest = `# Independent router

  - write tests first          → ultra-powers:test-driven-development
  - then check it works        → ultra-powers:verification-before-completion
  - deploy helper              → someone-else:deploy
  - lint helper                → someone-else:lint
  - format helper              → someone-else:format
`;
    const r = compareToCanonical(canonical, honest);

    expect(r.verdict).not.toBe("derivative-likely");
    expect(r.verdict).not.toBe("identical");
  });

  test("an INDEPENDENT router over the same public plugin is not accused", () => {
    // A10, and it only becomes reachable once B1 is fixed: deduping the order
    // signal takes this fixture from 0.46 to 0.857, over the threshold, at 100%
    // containment with ZERO canaries. Every trigger phrase, section name and
    // tie-break sentence in the fixture is original to it.
    // PROVENANCE.md: "A tool that accuses an honest author is worse than no tool."
    const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
    const sp = manifest.flows.find((f: { id: string }) => f.id === "superpowers");
    const text = readFileSync(join(import.meta.dir, "fixtures", "independent-router.md"), "utf8");
    const r = compareToCanonical(sp, text);

    expect(r.routeContainment).toBe(1);
    expect(r.canaryHits.length).toBe(0);
    expect(r.verdict).not.toBe("derivative-likely");
  });

  test("a reworded copy that keeps routes AND a canary is still flagged", () => {
    const d = {
      id: "d",
      hash: "",
      routes: ["ns:a", "ns:b"],
      canaries: ["Memory is not a research brief"],
    };
    const copy = "- when? → invoke ns:a\n- then? → invoke ns:b\nMemory is not a research brief.\n";
    expect(compareToCanonical(d, copy).verdict).toBe("derivative-likely");
  });

  test("the report carries the evidence, not just a verdict", () => {
    // An accusation a human cannot check is not usable in an email.
    const r = compareToCanonical(canonical, CANONICAL);
    expect(r).toHaveProperty("matchedRoutes");
    expect(r.matchedRoutes.length).toBe(canonical.routes.length);
  });

  test("matchedRoutes and canonicalRouteCount are both DISTINCT counts", () => {
    // Found by running the tool: a canonical file that mentions a skill four
    // times reported "5/26 routes present (14% containment)". The fraction
    // counted repeats and the percentage did not, so the two numbers in one
    // line of evidence contradicted each other. Evidence that disagrees with
    // itself is not evidence.
    const repeated = {
      id: "repeats",
      hash: "",
      routes: ["a:1", "a:1", "a:1", "b:2"],
      canaries: [],
    };
    const r = compareToCanonical(repeated, "a:1 appears once here");

    expect(r.canonicalRouteCount).toBe(2);
    expect(r.matchedRoutes).toEqual(["a:1"]);
    expect(r.matchedRoutes.length / r.canonicalRouteCount).toBe(r.routeContainment);
  });
});
