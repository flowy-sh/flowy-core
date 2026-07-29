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
 * STILL UNENFORCED, and named here so nobody mistakes green for compliant. A
 * crafted FLOW.md reproducing every defect these rules exist to stop passed all
 * six checks with 0 errors (A8). Four of those holes are now closed. These are
 * the ones that are not, and are not closeable mechanically:
 *   - R1 TRIGGER QUALITY. A route line with an empty trigger (`- → invoke p:x`)
 *     is the passive index by another name, and passes.
 *   - R1 NEGATIVE MENTIONS. A skill named precisely to say DO NOT ROUTE HERE
 *     reads as an orphan, and the remedy text ("give it a trigger, or remove
 *     the name") is wrong advice for it. One such case ships in ultra-powers.
 *   - R4 is a three-entry denylist. "answer from the skill's GUIDING
 *     principles" passes. It is a floor, not coverage.
 *   - R2 (trigger style) and R7 (register) are judgment calls, by design.
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

/**
 * Namespaced skill reference. BOTH sides must start with a letter, which is
 * what keeps `http://localhost:3000` and a `09:30` standup out of the results:
 * a port and a time are not skills, and reporting them as orphans is how a
 * checker gets switched off.
 */
const SKILL_REF = /\b([a-z][a-z0-9-]*):([a-z][a-z0-9-]*)\b/g;
const ARROW = /(?:→|->)/;

/**
 * A fenced code block opens and closes on a line whose first non-space run is
 * three backticks or three tildes.
 *
 * NAMES are not collected inside a fence, because a shell command is not a
 * passive index and `test:watch` is not a skill. ROUTES still are: every
 * shipped Flow puts its ENTIRE routing tree inside a fence, so skipping fenced
 * lines wholesale would empty the routed set and report every skill in the file
 * as an orphan.
 */
const FENCE = /^\s*(?:```|~~~)/;

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

/**
 * R3: a route line must say `invoke`.
 *
 * SCOPED TO THE FENCE. A route is a line in the routing TREE, and every shipped
 * Flow puts its entire tree inside a fence. Arrows also appear in prose all over
 * a good Flow: a Disambiguation line ("an SEO-specific verb -> ultra-powers:seo"),
 * the Phases lifecycle chain, a rationalization. Those explain; they do not
 * instruct, and demanding the verb in them produced 4 of ultra-powers' 56 errors
 * with only two remedies available: mangle readable prose, or switch the rule
 * off. That is how a guard that cries wolf dies (see
 * `guards-must-match-invocation-not-substring-2026-07-28`).
 *
 * Task 7's escape hatch is the authority for amending a rule that flags
 * legitimate content rather than editing the content to satisfy it.
 *
 * The rule keeps its teeth exactly where routing lives: a verbless route inside
 * the fence is still an error.
 */
export function checkRouteVerbs(text) {
  const errors = [];
  let inFence = false;
  for (const [i, line] of normalizeLines(text).entries()) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) continue; // prose arrow: explanation, not instruction
    if (!isRouteLine(line)) continue;
    // RE-ENTRY EXEMPTION, narrow and deliberate. A line that directs re-entry to
    // a PHASE names skills as candidates for which phase to return to, not as a
    // target to invoke. `superpowers` — the reference implementation this whole
    // standard is derived from — carries exactly one such line, and the plan
    // records it as the known false positive behind Task 7's escape hatch.
    // Editing that file to satisfy this rule is the single change most likely to
    // damage the behaviour being copied. Kept to the literal phrase so it cannot
    // grow into a general excuse: an ordinary verbless route is still an error.
    if (/\bre-enter\b/i.test(line)) continue;
    const after = line.split(ARROW).slice(1).join(" ");
    // Case-INSENSITIVE, like every sibling rule. Telling an author to lowercase
    // a sentence-initial verb is how a checker gets switched off.
    if (!/\binvoke\b/i.test(after)) {
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
  let inFence = false;

  for (const [i, line] of normalizeLines(text).entries()) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) {
      const h = headingOf(line);
      if (h !== null) {
        section = h;
        continue;
      }
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
    // Inside a fence a line is an example, a shell command or a diagram. Its
    // routes counted above; its NAMES do not.
    if (inFence) continue;
    // Attribution must name upstream skills in order to credit them. Requiring
    // a route for each would force a choice between crediting and validating.
    // And a name Attribution credits is not an orphan ANYWHERE in the file: a
    // Flow that repackages five plugins under one namespace still has to say
    // whose work it routes, and an attribution-first repo must never ship a
    // linter that answers an upstream credit with "remove the name".
    // EXACT heading, not a prefix: `## Attributions and index` was being read as
    // Attribution, which is one rename away from exempting a whole passive index.
    if (/^attribution$/i.test((section ?? "").trim())) {
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
  const headings = [];
  let inFence = false;
  for (const line of normalizeLines(text)) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue; // `## Phases` shown as an EXAMPLE is not a section
    const h = headingOf(line);
    if (h !== null) headings.push(h);
  }

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
  const lines = normalizeLines(text);
  const routed = new Set();
  for (const line of lines) {
    if (isRouteLine(line)) for (const r of refsIn(line)) routed.add(r);
  }

  // ONE pattern: hyphen or space, singular or plural, optional `+`. The crafted
  // defect file wrote "47+ skills" and passed with zero errors because two
  // alternations between them covered neither. DEDUPED, because saying
  // "40 skills" three times is one over-claim, not three.
  const claims = new Set();
  for (const m of lines.join("\n").matchAll(/\b(\d+)\s*\+?[\s-]*skills?\b/gi)) {
    claims.add(Number(m[1]));
  }

  const errors = [];
  for (const claimed of claims) {
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
