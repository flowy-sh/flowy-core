/**
 * Builds the provenance manifest: what each shipped Flow said, in a form a
 * later dispute can be checked against.
 *
 * The manifest is committed, so git and GitHub supply the timestamp. That is
 * the part we cannot fake and a copier cannot backdate: "our file said this,
 * on this date, in a public repository."
 *
 * Deterministic by construction. No clock, no directory-order dependence, so
 * the freshness test in engine/tests/provenance-manifest.test.ts can compare a
 * fresh build against the committed copy without flapping.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { contentHash, routeSequence, normalizeText } from "./provenance-core.mjs";

export const MANIFEST_SCHEMA = "flowy-provenance-v1";

const RATIONALIZATION_HEADING = /^##\s+You are rationalizing/i;
const ARROW = /(?:→|->)/;

/**
 * A canary has to be distinctive enough that a verbatim match is not
 * coincidence.
 *
 * These numbers are not taste. Running the first version against obra's
 * upstream skills produced a match on the canary "TDD." A three-character
 * fragment is shared vocabulary, and the tool accused the very author we
 * credit in ATTRIBUTION.md. Anything below this bar is a false-positive
 * generator, so it is dropped rather than reported.
 *
 * Exported because engine/tests/provenance-manifest.test.ts asserts every
 * shipped canary clears the bar. One definition, so the test and the extractor
 * cannot drift into disagreeing about what "distinctive" means.
 */
export const CANARY_MIN_WORDS = 5;
export const CANARY_MIN_CHARS = 24;

const isDistinctive = (s) => s.length >= CANARY_MIN_CHARS && s.split(/\s+/).length >= CANARY_MIN_WORDS;

/** Split a reply into sentences, keeping their terminators. */
function sentences(text) {
  return text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) ?? [];
}

/**
 * Canaries are our original expression, not our routing.
 *
 * The reply to a rationalization is the strongest candidate in the file: a
 * route line has one natural phrasing, but "the taste is in the skill" is a
 * choice. The shortest distinctive prefix is kept, so a copier who edits the
 * tail of the paragraph still trips it, while a reply that opens on a
 * two-word sentence absorbs the next one instead of being thrown away.
 */
export function extractCanaries(flowText) {
  const lines = normalizeText(flowText).split("\n");
  const canaries = [];
  let inSection = false;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      inSection = RATIONALIZATION_HEADING.test(line);
      continue;
    }
    if (!inSection || !line.trimStart().startsWith("- ")) continue;

    const parts = line.split(ARROW);
    if (parts.length < 2) continue;

    const reply = parts.slice(1).join(" ").trim();

    let candidate = "";
    for (const sentence of sentences(reply)) {
      candidate = `${candidate} ${sentence.trim()}`.trim();
      if (isDistinctive(candidate)) break;
    }

    if (isDistinctive(candidate)) canaries.push(candidate);
  }

  return canaries;
}

function flowFile(root, overlay) {
  const dir = join(root, "overlays", overlay, "flows", overlay);
  const main = join(dir, "FLOW.md");
  return existsSync(main) ? { dir, main } : null;
}

export function buildManifest(root) {
  const overlayNames = readdirSync(join(root, "overlays"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const flows = [];

  for (const overlay of overlayNames) {
    const found = flowFile(root, overlay);
    if (!found) continue;

    const text = readFileSync(found.main, "utf8");

    flows.push({
      id: overlay,
      path: `overlays/${overlay}/flows/${overlay}/FLOW.md`,
      hash: contentHash(text),
      routes: routeSequence(text),
      canaries: extractCanaries(text),
    });
  }

  return { schema: MANIFEST_SCHEMA, flows };
}
