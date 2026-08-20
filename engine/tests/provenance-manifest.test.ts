import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  buildManifest,
  extractCanaries,
  CANARY_MIN_WORDS,
  CANARY_MIN_CHARS,
} from "../tools/provenance-manifest.mjs";
import { normalizeText } from "../tools/text-normalize.mjs";

/* ============================================================
   MANIFEST FRESHNESS GUARD (2026-07-28)

   The manifest is the evidence. It records what each shipped
   FLOW.md said, so a later dispute compares against a committed,
   git-timestamped record instead of against whatever the file
   happens to say today.

   A stale manifest is worse than none: it would report our own
   current file as a non-match and quietly exonerate a real copy.
   version-consistency.test.ts exists because engine/package.json
   sat at 0.2.0 while the manifest said 0.3.0. Same failure mode,
   so the same kind of guard.
   ============================================================ */

const ROOT = join(import.meta.dir, "..", "..");
const MANIFEST_PATH = join(ROOT, "engine", "provenance", "manifest.json");

describe("extractCanaries", () => {
  test("pulls the reply clause from a rationalization bullet", () => {
    // The reply is the original expression. The quoted excuse is closer to a
    // common phrase and makes a weaker fingerprint.
    const flow = `## You are rationalizing if you think…

- "I'll just design the screen myself." → The taste is in the skill. Invoke it.
`;
    expect(extractCanaries(flow)).toEqual(["The taste is in the skill."]);
  });

  test("ignores bullets outside the rationalization section", () => {
    const flow = `## Routing

- "not a canary" → some other thing entirely that is long enough to qualify.

## You are rationalizing if you think…

- "real one." → This reply is long enough to be a real fingerprint. Yes.
`;
    expect(extractCanaries(flow)).toEqual([
      "This reply is long enough to be a real fingerprint.",
    ]);
  });

  test("a file with no rationalization section yields no canaries", () => {
    expect(extractCanaries("# FLOW.md\n\njust routing\n")).toEqual([]);
  });

  test("a short generic first sentence is NOT accepted as a canary", () => {
    // Found by running the tool: "TDD." and "Invoke it." were being extracted,
    // and "TDD." then matched obra's OWN upstream skills. A detector that
    // accuses the author we credit is worse than no detector. A canary has to
    // be distinctive enough that a match means something.
    const flow = `## You are rationalizing if you think…

- "I'll skip the test." → TDD.
- "I'll design it myself." → Invoke it.
`;
    expect(extractCanaries(flow)).toEqual([]);
  });

  test("a short first sentence absorbs the next one rather than being dropped", () => {
    // The prose is still distinctive; only the sentence boundary was unlucky.
    // Dropping it would throw away a usable fingerprint.
    const flow = `## You are rationalizing if you think…

- "excuse" → TDD. Run the failing test before you write the code.
`;
    expect(extractCanaries(flow)).toEqual([
      "TDD. Run the failing test before you write the code.",
    ]);
  });

  test("every extracted canary is a literal substring of its source", () => {
    // B9: the one property the whole matching path depends on, unasserted. A
    // canary that is not a substring of the file it came from cannot match
    // anything, ever, and reports as a clean bill.
    for (const flow of buildManifest(ROOT).flows) {
      const src = normalizeText(readFileSync(join(ROOT, flow.path), "utf8"));
      for (const c of flow.canaries) expect(src).toContain(c);
    }
  });

  test("a double space after a full stop does not corrupt the canary", () => {
    // B9: sentences were re-joined with ONE space instead of sliced out of the
    // original, so any second space vanished from the fingerprint.
    const flow = '## You are rationalizing if you think…\n\n- "x" → TDD.  Run the failing test before you write the code.\n';
    const [canary] = extractCanaries(flow);
    expect(normalizeText(flow)).toContain(canary);
  });

  test("an inline second arrow does not corrupt the canary", () => {
    // B9: `line.split(ARROW)` re-joined the pieces, so a reply that itself
    // contains an arrow had that arrow replaced by a space.
    const flow = '## You are rationalizing if you think…\n\n- "x" → Route it -> then verify, because a claim is not a result.\n';
    const [canary] = extractCanaries(flow);
    expect(normalizeText(flow)).toContain(canary);
  });

  test("no shipped canary also appears in the scaffold template", () => {
    // A11: the template ships "After compaction, re-read this file and restate
    // the phase.", which is a canary of superpowers AND ultra-powers, so a Flow
    // built with our own scaffolder is flagged on birth with exit 1.
    const template = normalizeText(
      readFileSync(join(ROOT, "engine", "templates", "flow-standard", "FLOW.md"), "utf8"),
    );
    for (const flow of buildManifest(ROOT).flows) {
      for (const c of flow.canaries) expect(template).not.toContain(c);
    }
  });

  test("no canary in a shipped Flow is short enough to be a coincidence", () => {
    // The real guard. Applies to the actual shipped files, not a fixture.
    for (const flow of buildManifest(ROOT).flows) {
      for (const canary of flow.canaries) {
        expect(canary.split(/\s+/).length).toBeGreaterThanOrEqual(CANARY_MIN_WORDS);
        expect(canary.length).toBeGreaterThanOrEqual(CANARY_MIN_CHARS);
      }
    }
  });
});

describe("buildManifest", () => {
  const manifest = buildManifest(ROOT);

  // DERIVED, not frozen. This was a hardcoded four-name list, which is correct
  // on the day it is written and silently stops covering whatever the repo
  // grows: adding `overlays/nextjs/` broke it, and the only signal was a
  // failure naming the four Flows that DID exist. Reading the directory is the
  // stronger assertion, because a Flow that ships without reaching the manifest
  // now fails forever rather than until someone remembers this array.
  const shipped = readdirSync(join(ROOT, "overlays"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  test("the overlays directory was actually read", () => {
    // An empty list would make the next test assert nothing at all.
    expect(shipped.length).toBeGreaterThanOrEqual(4);
    expect(shipped).toContain("superpowers");
  });

  test("covers every shipped Flow", () => {
    const ids = manifest.flows.map((f) => f.id).sort();
    expect(ids).toEqual(shipped);
  });

  test("every Flow carries a hash and a non-empty route sequence", () => {
    for (const flow of manifest.flows) {
      expect(flow.hash).toMatch(/^[0-9a-f]{64}$/);
      expect(flow.routes.length).toBeGreaterThan(0);
    }
  });

  test("the routes are real namespaced references, not prose fragments", () => {
    for (const flow of manifest.flows) {
      for (const route of flow.routes) {
        expect(route).toMatch(/^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*$/);
      }
    }
  });

  test("building twice produces the same manifest", () => {
    // Any nondeterminism (a timestamp, a directory-order dependency) would make
    // the freshness guard below flap and get deleted for being annoying.
    expect(buildManifest(ROOT)).toEqual(manifest);
  });
});

describe("the committed manifest", () => {
  test("exists", () => {
    expect(existsSync(MANIFEST_PATH)).toBe(true);
  });

  test("matches the current Flow files", () => {
    const committed = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
    expect(committed).toEqual(buildManifest(ROOT));
  });
});
