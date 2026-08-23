import { describe, expect, test } from "bun:test";
import { checkRoutesResolve } from "../tools/flow-rules.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/* ============================================================
   R8: A ROUTED SLUG MUST EXIST IN THE TARGET PLUGIN.

   Every other rule in flow-rules.mjs checks a FLOW.md against
   ITSELF: its section order, its own verbs, its own claimed
   counts. None of them can see the world the routes point at,
   and that is the whole gap this rule closes.

   Measured 2026-08-23 across the 7 overlays whose target plugin
   was installed locally:

     overlay                target                routed  dead
     agent-skills           agent-skills              24     0
     compound-engineering   compound-engineering      32    23
     growth-marketing       marketing-skills          47     0
     mem0                   mem0                      23     7
     superpowers            superpowers               14     0
     taste-skill            taste-skill               13     0
     ultra-powers           ultra-powers              40     0

   compound-engineering routes `ce-commit`, `ce-worktree`,
   `ce-proof`, `ce-test-browser`. Upstream ships `git-commit`,
   `git-worktree`, `proof`, `test-browser`. The overlay was
   authored when every skill carried a `ce-` prefix and upstream
   has since dropped it, so 23 of 32 routes are silent no-ops.

   A dead route produces NO error at runtime. The skill simply
   never fires, which is indistinguishable from the model choosing
   not to route. That is why this needs a build-time check and not
   a runtime one.
   ============================================================ */

const FENCE = "```";

/** A FLOW.md routing tree, built line-wise so the markdown fence
 *  cannot collide with the template literal that carries it. */
function flowWithRoutes(routes: string[], prose: string[] = []): string {
  return [
    "# FLOW.md: Test",
    "",
    "## Routing",
    "",
    FENCE,
    "USER MESSAGE",
    ...routes.map((r) => `  ├─ some trigger?  → invoke ${r}   gate: something`),
    FENCE,
    "",
    ...prose,
  ].join("\n");
}

describe("checkRoutesResolve — R8, a route must resolve to an installed skill", () => {
  test("flags a routed slug the target plugin does not install", () => {
    const text = flowWithRoutes(["mem0:remember", "mem0:memory-triage"]);

    const errors = checkRoutesResolve(text, { mem0: ["remember", "peek", "policy"] });

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("mem0:memory-triage");
  });

  test("returns no errors when every routed slug resolves", () => {
    const text = flowWithRoutes(["mem0:remember", "mem0:peek"]);

    const errors = checkRoutesResolve(text, { mem0: ["remember", "peek", "policy"] });

    expect(errors).toEqual([]);
  });

  /* THE none-vs-unavailable CASE, and the reason this rule exists at all.
     "The plugin is not installed here" is NOT "every route is fine". An empty
     return for an unverifiable namespace is exactly the silent pass that let
     102 overlays drift, so it is reported, never swallowed. */
  test("reports an uninstalled namespace instead of passing it", () => {
    const text = flowWithRoutes(["taste-skill:brandkit"]);

    const errors = checkRoutesResolve(text, { mem0: ["remember"] });

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("taste-skill");
    expect(errors[0]).toMatch(/not installed|cannot verify/i);
  });

  /* A caller that forgets the second argument must not receive a clean pass.
     Throwing is the only return value that cannot be mistaken for success. */
  test("throws when no skill map is supplied, rather than returning clean", () => {
    const text = flowWithRoutes(["mem0:remember"]);

    expect(() => checkRoutesResolve(text)).toThrow(/skill map/i);
  });

  /* Scoped to the fence, exactly like checkRouteVerbs. Prose names skills for
     explanation ("`ai-seo` targets LLM citation") and demanding those resolve
     is how a checker earns its own suppression. */
  test("ignores a skill named in prose outside the routing fence", () => {
    const text = flowWithRoutes(
      ["mem0:remember"],
      ["## Disambiguation", "", "`mem0:some-retired-name` was the old spelling."],
    );

    const errors = checkRoutesResolve(text, { mem0: ["remember"] });

    expect(errors).toEqual([]);
  });
});

/* ============================================================
   REGRESSION PIN, 2026-08-23.

   The two overlays repaired that day. This asserts the specific
   slugs that were dead can never come back, and it needs no
   plugin installed to do it, so it holds on any machine and in
   CI where check-routes.mjs can only report UNVERIFIABLE.

   Anti-vacuity: each file must still contain real routes. A
   moved or emptied file would otherwise satisfy every
   not-to-contain below while proving nothing.
   ============================================================ */
describe("repaired overlays stay repaired", () => {
  const cases = [
    {
      overlay: "mem0",
      file: "overlays/mem0/flows/mem0/FLOW.md",
      ns: "mem0",
      dead: [
        "memory-dream", "memory-triage", "mem0-cli", "mem0-integrate",
        "mem0-oss-to-platform", "mem0-test-integration", "mem0-vercel-ai-sdk",
      ],
      minRoutes: 17,
    },
    {
      overlay: "compound-engineering",
      file: "overlays/compound-engineering/flows/compound-engineering/FLOW.md",
      ns: "compound-engineering",
      dead: [
        "ce-babysit-pr", "ce-code-review", "ce-commit-push-pr", "ce-commit",
        "ce-doc-review", "ce-dogfood", "ce-explain", "ce-handoff", "ce-optimize",
        "ce-polish", "ce-pov", "ce-product-pulse", "ce-promote", "ce-proof",
        "ce-resolve-pr-feedback", "ce-retune", "ce-riffrec-feedback-analysis",
        "ce-simplify-code", "ce-strategy", "ce-sweep", "ce-test-browser",
        "ce-test-xcode", "ce-worktree",
      ],
      minRoutes: 21,
    },
  ];

  for (const c of cases) {
    test(`${c.overlay} routes none of its ${c.dead.length} historically dead slugs`, () => {
      const text = readFileSync(join(import.meta.dir, "..", "..", c.file), "utf8");
      const routed = new Set(
        [...text.matchAll(new RegExp(`invoke ${c.ns}:([a-z0-9-]+)`, "g"))].map((m) => m[1]),
      );
      // anti-vacuity: an emptied or moved file must not pass by having no routes
      expect(routed.size).toBeGreaterThanOrEqual(c.minRoutes);
      expect([...routed].filter((slug) => c.dead.includes(slug))).toEqual([]);
    });
  }
});
