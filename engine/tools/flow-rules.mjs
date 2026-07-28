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

import { normalizeText } from "./text-normalize.mjs";

/**
 * Normalized lines with HTML comments blanked out.
 *
 * A comment is authoring guidance, never routing content. The shipped template
 * documents R3 as "every route line carries the verb `invoke`" inside one, and
 * reading that as a passive index made the template fail its own rules, which
 * would teach every scaffolded Flow to fail them too. Line COUNT is preserved,
 * so `line N:` messages stay correct.
 */
function normalizeLines(text) {
  return normalizeText(text)
    .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "))
    .split("\n");
}

const SKILL_REF = /\b[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*\b/g;
const ARROW = /(?:→|->)/;

/**
 * A backticked bare slug in prose: `ai-seo`, `ads`, `programmatic-seo`.
 *
 * THE FORM THE DEFECT ACTUALLY TAKES. The real passive index writes bare slugs
 * in backticks; SKILL_REF requires `ns:skill`, so the rule returned zero errors
 * on the very file the standard was derived from while the unit tests passed on
 * a form (`ms:ai-seo`) that does not occur in it.
 *
 * SHAPE CANNOT BE THE FILTER. Requiring a hyphen would miss `ads`, `signup`,
 * `social` and `schema`, a third of that same index. The whole backtick span
 * must be the slug, which is what excludes `bun test`, `npm run build` and
 * `.agents/product-marketing.md`: whitespace, a dot, a slash or a colon all
 * break the match. CONTEXT does the rest: a bare slug is an orphan only when
 * the file routes nothing by that name on either side of the colon.
 */
const BARE_SLUG = /`([a-z0-9]+(?:-[a-z0-9]+)*)`/g;

function bareSlugsIn(text) {
  return [...text.matchAll(BARE_SLUG)].map((m) => m[1]);
}

/** `**superpowers**`: how the Attribution section names the plugins it credits. */
const BOLD_NAME = /\*\*([a-z0-9]+(?:-[a-z0-9]+)*)\*\*/g;

function boldNamesIn(text) {
  return [...text.matchAll(BOLD_NAME)].map((m) => m[1]);
}

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
  const credited = new Set();
  const named = new Map();
  let section = null;

  for (const [i, line] of normalizeLines(text).entries()) {
    const h = headingOf(line);
    if (h !== null) {
      section = h;
      continue;
    }
    if (isRouteLine(line)) {
      for (const r of refsIn(line)) {
        routed.add(r);
        const colon = r.indexOf(":");
        routed.add(r.slice(colon + 1)); // `ms:ai-seo` also routes the bare `ai-seo`
        routed.add(r.slice(0, colon)); // ...and names the plugin `ms`
      }
      continue;
    }
    // Attribution must name upstream skills in order to credit them. Requiring
    // a route for each would force a choice between crediting and validating.
    // And a name Attribution credits is not an orphan ANYWHERE in the file: a
    // Flow that repackages five plugins under one namespace still has to say
    // whose work it routes, and an attribution-first repo must never ship a
    // linter that answers an upstream credit with "remove the name".
    if (/^attribution/i.test(section ?? "")) {
      for (const c of [...bareSlugsIn(line), ...boldNamesIn(line)]) credited.add(c);
      continue;
    }
    for (const r of [...refsIn(line), ...bareSlugsIn(line)]) {
      if (!named.has(r)) named.set(r, i + 1);
    }
  }

  return [...named]
    .filter(([ref]) => !routed.has(ref) && !credited.has(ref))
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
