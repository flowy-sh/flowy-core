import { describe, expect, test } from "bun:test";

import {
  normalizeText,
  contentHash,
  routeSequence,
  routeContainment,
  orderScore,
  compareToCanonical,
} from "../tools/provenance-core.mjs";

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

  test("reworded prose that keeps the routes and their order is flagged", () => {
    // The real case: a copier rewrites the descriptions, keeps the routing.
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
    expect(r.verdict).toBe("derivative-likely");
  });

  test("canary strings carried verbatim are reported individually", () => {
    const withCanary = `# Other\n\n- "whatever" -> The taste is in the skill. Invoke it.\n`;
    const r = compareToCanonical(canonical, withCanary);

    expect(r.canaryHits).toEqual(["The taste is in the skill"]);
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
