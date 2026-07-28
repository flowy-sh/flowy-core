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

const SENTENCE_RE = /[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g;

/**
 * Where each sentence ENDS, as an offset into `text`.
 *
 * Offsets, not the sentence strings, because the canary is then SLICED out of
 * the original rather than rebuilt from pieces. Rebuilding was the whole of B9:
 * sentences were trimmed and re-joined with one space, so "TDD.  Run the ..."
 * produced a canary with a single space that matched nothing, ever. Offsets are
 * also robust to the regex skipping a run (an abbreviation with no following
 * space produces a gap), which accumulating lengths is not.
 */
function sentenceEnds(text) {
  const ends = [];
  for (const m of text.matchAll(SENTENCE_RE)) ends.push(m.index + m[0].length);
  return ends;
}

/**
 * Canaries are our original expression, not our routing.
 *
 * The reply to a rationalization is the strongest candidate in the file: a
 * route line has one natural phrasing, but "the taste is in the skill" is a
 * choice. The shortest distinctive prefix is kept, so a copier who edits the
 * tail of the paragraph still trips it, while a reply that opens on a
 * two-word sentence absorbs the next one instead of being thrown away.
 *
 * EVERY CANARY IS A LITERAL SLICE OF THE NORMALIZED SOURCE, by construction.
 * The previous version rebuilt one by re-joining trimmed sentences with a
 * single space and by splitting on EVERY arrow, so a double space after a full
 * stop, or a second arrow inside the reply, produced a fingerprint that matched
 * nothing, ever, and reported as a clean bill.
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

    const arrowAt = line.search(ARROW);
    if (arrowAt === -1) continue;

    // Slice from the FIRST arrow and drop only that one. A second arrow inside
    // the reply is part of the author's prose and stays.
    const reply = line.slice(arrowAt).replace(ARROW, "").trimStart();

    for (const end of sentenceEnds(reply)) {
      const candidate = reply.slice(0, end).trim();
      if (isDistinctive(candidate)) {
        canaries.push(candidate);
        break;
      }
    }
  }

  return canaries;
}

/**
 * The scaffold template is the one file we deliberately hand to third parties,
 * so a sentence it contains can never be evidence that someone copied us.
 *
 * It shipped "After compaction, re-read this file and restate the phase.",
 * which extracted as a canary of BOTH superpowers and ultra-powers. Every Flow
 * built with our own scaffolder was therefore born `possible-derivative`
 * against two of our Flows, on 0% containment, and the CLI exited 1. Subtracted
 * at BUILD time rather than fixed in the template, because the sentence is good
 * guidance and the template is not the thing that is wrong.
 */
function templateText(root) {
  const p = join(root, "engine", "templates", "flow-standard", "FLOW.md");
  return existsSync(p) ? normalizeText(readFileSync(p, "utf8")) : "";
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
  const tmpl = templateText(root);

  for (const overlay of overlayNames) {
    const found = flowFile(root, overlay);
    if (!found) continue;

    const text = readFileSync(found.main, "utf8");

    flows.push({
      id: overlay,
      path: `overlays/${overlay}/flows/${overlay}/FLOW.md`,
      hash: contentHash(text),
      routes: routeSequence(text),
      canaries: extractCanaries(text).filter((c) => !tmpl.includes(c)),
    });
  }

  return { schema: MANIFEST_SCHEMA, flows };
}
