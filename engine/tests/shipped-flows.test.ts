/**
 * ENFORCEMENT. Every shipped Flow obeys the authoring rules.
 *
 * Landing this BEFORE the content was fixed would have failed the repo on its
 * own contents, which is how a useful check gets switched off for being
 * annoying. It lands now because all three Flows are clean:
 *
 *   growth-marketing  54 errors -> 0   (rewritten 2026-07-29, all 47 skills routed)
 *   ultra-powers      56 errors -> 0   (verb sweep inside the fence, drift clause, order)
 *   superpowers        1 error  -> 0   (the RULE was amended, not the file — see below)
 *
 * ON `superpowers`: it is the reference implementation whose firing behaviour
 * this whole standard was derived from. Its one error was the documented false
 * positive on a re-entry directive, and Task 7's escape hatch says that when a
 * rule flags the file whose behaviour we are copying, the rule is wrong before
 * the file is. The exemption lives in `flow-rules.mjs` with its own tests. For
 * every OTHER Flow the instruction is unchanged: fix the FILE, never the rule.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { checkFlowRules } from "../tools/flow-rules.mjs";

const ROOT = join(import.meta.dir, "..", "..");
const overlays = readdirSync(join(ROOT, "overlays"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

describe("every shipped Flow obeys the authoring rules", () => {
  test("the loop actually found the overlays", () => {
    // A for-loop over an empty list is a green suite that tested nothing.
    expect(overlays.length).toBeGreaterThanOrEqual(3);
    expect(overlays).toContain("superpowers");
  });

  for (const name of overlays) {
    test(`${name}/FLOW.md`, () => {
      const p = join(ROOT, "overlays", name, "flows", name, "FLOW.md");
      expect(checkFlowRules(readFileSync(p, "utf8"))).toEqual([]);
    });
  }
});

describe("a compact refresh never names a skill its parent does not route", () => {
  /**
   * FLOW-compact.md is what the every-N-prompt reinjection re-injects, so it is
   * the real hook-path surface. A skill named there but not routed in the parent
   * is a route the agent can match and then fail to resolve.
   */
  const SKILL_REF = /\b[a-z][a-z0-9-]*:[a-z][a-z0-9-]*\b/g;

  for (const name of overlays) {
    const dir = join(ROOT, "overlays", name, "flows", name);
    let compact: string | null = null;
    try {
      compact = readFileSync(join(dir, "FLOW-compact.md"), "utf8");
    } catch {
      compact = null; // not every Flow ships one; superpowers does not
    }
    if (compact === null) continue;

    test(`${name}/FLOW-compact.md is in sync with its parent`, () => {
      const parent = new Set(readFileSync(join(dir, "FLOW.md"), "utf8").match(SKILL_REF) ?? []);
      const drifted = [...new Set(compact.match(SKILL_REF) ?? [])].filter((r) => !parent.has(r));
      expect(drifted).toEqual([]);
    });
  }
});
