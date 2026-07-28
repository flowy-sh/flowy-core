/**
 * Flow authoring rules, the mechanical half.
 *
 * Spec: docs/decisions/2026-07-28-flow-authoring-rules.md
 *
 * Pure. No I/O. Every check takes FLOW.md text and returns an array of error
 * strings, empty when the rule holds.
 *
 * WHY THESE RULES. Diagnosed by diffing the FLOW.md that fires ~97% against the
 * one that does not. Same engine, same hook, same banner, so the cause was in
 * the content. Six defects, of which the largest was that 40 of 47 skills had
 * no trigger at all: they sat in a passive index that named them and gave no
 * condition. Every SEO skill but one was in that dead zone, which is exactly
 * what the founder reported. No amount of extra sternness fixes a missing route.
 *
 * R2 (triggers must be agent-state conditions, not user quotes) and R7
 * (commanding register) are NOT here and must not be added. They are judgment
 * calls, and a check pretending to cover them would be a test that can never
 * fail, which this repo has already had to delete once.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { normalizeLines } from "./text-normalize.mjs";

const SKILL_REF = /\b[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*\b/g;
const ARROW = /(?:→|->)/;

/** R4: phrasings that authorise answering from memory instead of invoking. */
const BANNED_ADVISORY = [
  /answer\s+from\s+the\s+(?:relevant\s+)?skill['’]?s?\s+principles/i,
  /from\s+memory\s+is\s+(?:fine|ok|acceptable)/i,
  /you\s+may\s+summarise\s+the\s+skill\s+instead/i,
];

/** The `##` heading a line opens, or null. */
function headingOf(line) {
  const m = line.match(/^##\s+(.*)$/);
  return m ? m[1].trim() : null;
}

/** A route line: an arrow, followed by a skill reference. */
function isRouteLine(line) {
  if (!ARROW.test(line)) return false;
  const after = line.split(ARROW).slice(1).join(" ");
  return new RegExp(SKILL_REF.source).test(after);
}

function refsIn(text) {
  return [...text.matchAll(SKILL_REF)].map((m) => m[0]);
}

/** R3: a route line must say `invoke`. */
export function checkRouteVerbs(text) {
  const errors = [];
  for (const [i, line] of normalizeLines(text).entries()) {
    if (!isRouteLine(line)) continue;
    const after = line.split(ARROW).slice(1).join(" ");
    if (!/\binvoke\b/.test(after)) {
      const ref = refsIn(after)[0] ?? "(unknown)";
      errors.push(`line ${i + 1}: route to "${ref}" has no verb. Write "→ invoke ${ref}".`);
    }
  }
  return errors;
}

/** R1: every skill named outside Attribution must be routed somewhere. */
export function checkNoOrphanSkills(text) {
  const routed = new Set();
  const named = new Map();
  let section = null;

  for (const [i, line] of normalizeLines(text).entries()) {
    const h = headingOf(line);
    if (h !== null) {
      section = h;
      continue;
    }
    if (isRouteLine(line)) {
      for (const r of refsIn(line)) routed.add(r);
      continue;
    }
    // Attribution must name upstream skills in order to credit them. Requiring
    // a route for each would force a choice between crediting and validating.
    if (/^attribution/i.test(section ?? "")) continue;
    for (const r of refsIn(line)) if (!named.has(r)) named.set(r, i + 1);
  }

  return [...named]
    .filter(([ref]) => !routed.has(ref))
    .map(
      ([ref, line]) =>
        `line ${line}: "${ref}" is named but never routed. Give it a trigger, or remove the name.`,
    );
}

/** R5: Routing must be the first `##` section. */
export function checkSectionOrder(text) {
  const headings = normalizeLines(text).map(headingOf).filter((h) => h !== null);
  if (headings.length === 0) return ["FLOW.md has no ## sections"];
  if (!/^routing/i.test(headings[0])) {
    return [`"## ${headings[0]}" precedes "## Routing". Routing must be the first section.`];
  }
  return [];
}

export function checkAdvisoryPhrasing(text) {
  return BANNED_ADVISORY.filter((re) => re.test(text)).map(
    (re) =>
      `banned advisory phrasing ${re}. Use "answer only; no files change" instead. ` +
      `Anything softer authorises the from-memory failure this Flow exists to stop.`,
  );
}

export function checkDriftClause(text) {
  return /\bdrift\b/i.test(text) && /\bimprovis/i.test(text)
    ? []
    : [
        "no drift clause. Add one: a route whose target no longer exists is a Flow to fix, " +
          "never license to improvise.",
      ];
}

/**
 * R6: a claimed skill count must not EXCEED what the file routes.
 * Under-claiming is fine; a Flow may describe a subset of what it routes.
 */
export function checkClaimedCounts(text) {
  const routed = new Set();
  for (const line of normalizeLines(text)) {
    if (isRouteLine(line)) for (const r of refsIn(line)) routed.add(r);
  }

  const errors = [];
  for (const m of text.matchAll(/\b(\d{2,})[- ]skill\b|\b(\d{2,})\s+skills\b/gi)) {
    const claimed = Number(m[1] ?? m[2]);
    if (claimed > routed.size) {
      errors.push(
        `claims ${claimed} skills but routes ${routed.size}. State a number the file can back.`,
      );
    }
  }
  return errors;
}

export function checkFlowRules(text) {
  return [
    ...checkSectionOrder(text),
    ...checkRouteVerbs(text),
    ...checkNoOrphanSkills(text),
    ...checkAdvisoryPhrasing(text),
    ...checkDriftClause(text),
    ...checkClaimedCounts(text),
  ];
}
