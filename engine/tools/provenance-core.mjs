/**
 * Provenance core: the pure functions behind `flowy-provenance`.
 *
 * ATTRIBUTION.md claims copying "gets demonstrated rather than asserted".
 * This module is what has to make that true. It answers one question about a
 * suspected copy, with evidence attached:
 *
 *     Is this our routing, and can I show why?
 *
 * Three independent signals, weakest to strongest:
 *
 *   1. CONTENT HASH. Byte-identical after newline normalization. Settles it.
 *   2. CANARY STRINGS. Distinctive original prose carried verbatim. A route
 *      line has one natural phrasing; a rationalization reply does not.
 *   3. ROUTE SEQUENCE. Which skills, in which order. Containment says how much
 *      of our selection is present; order says whether the arrangement came
 *      with it. Selection and arrangement is the copyrightable part, so this is
 *      the signal that maps onto the actual claim.
 *
 * SPECIFICITY IS THE DESIGN CONSTRAINT. Every skill we route to is public and
 * anyone may route to the same ones. Shared vocabulary is not evidence.
 * Containment alone is not evidence, and STRUCTURE ALONE IS NOT EVIDENCE
 * EITHER: high containment with preserved order was believed to be the
 * combination an independent author does not reproduce, and it is not. An
 * independently written table over obra's public superpowers plugin scored 100%
 * containment and 86% order with zero carried prose, because the selection was
 * the whole plugin and the arrangement was a lifecycle nobody owns. That file
 * is checked in at engine/tests/fixtures/independent-router.md.
 *
 * `derivative-likely` therefore requires ORIGINAL EXPRESSION carried across: a
 * canary alongside the structural signal, or two canaries alone. Everything
 * structural without it tops out at `possible-derivative`, which reports the
 * same evidence and withholds only the word "likely". A tool that accuses an
 * honest author is worse than no tool, so the thresholds under-claim.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { createHash } from "node:crypto";

import { normalizeText } from "./text-normalize.mjs";

/**
 * Namespaced skill reference: `plugin-name:skill-name`.
 *
 * No whitespace either side of the colon, which is what keeps `Gate: brief`
 * and `https://flowy.sh` out of the results. BOTH are excluded by that rule
 * alone: each fails on the character immediately after the colon, a space in
 * one and a slash in the other.
 *
 * ⭐ CASE WAS NEVER PART OF IT, and the lowercase-only class said otherwise
 * until 2026-08-20. `cyberkaida/reverse-engineering-assistant` publishes its
 * plugin as `ReVa`, so a Flow routing 6 skills recorded ZERO routes in the
 * manifest and tripped "every Flow carries a non-empty route sequence".
 * `ROUTE_VARIANT_RE` twenty lines below already accepted capitals; this is
 * the same pattern in the same file with a different blind spot, which is
 * the fourth copy of it found in two repositories on one day.
 */
const ROUTE_RE = /\b([A-Za-z0-9][A-Za-z0-9-]*):([A-Za-z0-9][A-Za-z0-9-]*)\b/g;

/** High containment AND preserved order. Both, never either. */
const DERIVATIVE_CONTAINMENT = 0.8;
const DERIVATIVE_ORDER = 0.8;
/** Two verbatim canaries is prose, not coincidence. */
const DERIVATIVE_CANARIES = 2;
/** Worth a human look. Never worth an accusation. */
const POSSIBLE_CONTAINMENT = 0.5;

/**
 * Canonicalize so a checkout difference is never mistaken for a content
 * difference. CRLF, trailing spaces, and trailing blank lines all vary by
 * editor and platform and mean nothing.
 *
 * Re-exported, not defined here: flow-rules.mjs made the same decision
 * separately and got it wrong, so there is now exactly one definition and this
 * module's importers are unchanged.
 */
export { normalizeText } from "./text-normalize.mjs";

export function contentHash(text) {
  return createHash("sha256").update(normalizeText(text), "utf8").digest("hex");
}

/** Every namespaced skill reference, in document order, duplicates kept. */
export function routeSequence(text) {
  const out = [];
  for (const m of normalizeText(text).matchAll(ROUTE_RE)) out.push(m[0]);
  return out;
}

/**
 * The same reference written with either separator, in either case.
 * `Superpowers/Brainstorming` is the same route as `superpowers:brainstorming`.
 */
const ROUTE_VARIANT_RE = /\b([A-Za-z0-9][A-Za-z0-9-]*)[:/]([A-Za-z0-9][A-Za-z0-9-]*)\b/g;

/**
 * The suspect's route sequence, widened to the separator and case variants of
 * routes the canonical file ACTUALLY HAS.
 *
 * A byte-complete copy reached `no-match` after nothing more than changing
 * `plugin:skill` to `plugin/skill` (A9). Neither that nor a case change removes
 * anything, so neither may erase the evidence.
 *
 * WIDENING WHAT COUNTS AS THE SAME ROUTE, NEVER WHAT COUNTS AS A ROUTE. The
 * first draft canonicalized `/` to `:` across the whole text on both sides.
 * Measured on the shipped Flows that took growth-marketing from 7 routes to 14
 * and ultra-powers from 40 to 56, every addition a prose fragment:
 * `read:invoke` from "READ/invoke", `ceo:eng` from "CEO/eng",
 * `com:coreyhaines31` from a GitHub URL. Containment divides by OUR count, so
 * symmetric widening would have HALVED the score for the reworded copy this
 * detector exists to catch, in the name of raising it. A variant form is
 * therefore only accepted when it names a route we already have, which adds
 * exactly zero routes to the canonical side.
 *
 * Whitespace around the separator is deliberately NOT collapsed. `ns: alpha`
 * and `Gate: a research brief` are the same shape, and accepting the first
 * makes every `Gate:`, `Phase:` and `Note:` in every scanned file a route.
 */
export function routeSequenceAgainst(text, canonicalRoutes) {
  const known = new Set(canonicalRoutes);
  const out = [];

  for (const m of normalizeText(text).matchAll(ROUTE_VARIANT_RE)) {
    const verbatim = `${m[1]}:${m[2]}`;
    if (m[0] === verbatim && verbatim === verbatim.toLowerCase()) {
      out.push(verbatim); // the strict form, exactly as routeSequence sees it
      continue;
    }
    const lower = verbatim.toLowerCase();
    if (known.has(lower)) out.push(lower);
  }

  return out;
}

/**
 * Canary comparison collapses ALL whitespace and case, so re-wrapping a
 * paragraph cannot erase one. A line break is a rendering choice, not a
 * rewrite.
 */
const flat = (s) => normalizeText(s).replace(/\s+/g, " ").trim().toLowerCase();

/** What share of OUR distinct routes appear in theirs. */
export function routeContainment(canonical, suspect) {
  const canon = new Set(canonical);
  if (canon.size === 0) return 0;

  const theirs = new Set(suspect);
  let hits = 0;
  for (const r of canon) if (theirs.has(r)) hits += 1;

  return hits / canon.size;
}

function longestCommonSubsequence(a, b) {
  const rows = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      rows[i][j] =
        a[i - 1] === b[j - 1] ? rows[i - 1][j - 1] + 1 : Math.max(rows[i - 1][j], rows[i][j - 1]);
    }
  }

  return rows[a.length][b.length];
}

/**
 * Of the routes both files share, what share appear in the same relative order.
 *
 * Restricted to shared routes on purpose: a copier who deletes half our routes
 * has still copied the arrangement of the half they kept.
 *
 * FIRST-OCCURRENCE DEDUP on both sides. Repeating a route is verbosity, not
 * arrangement, and it was diluting the denominator: our own superpowers FLOW.md
 * mentions 14 distinct routes 26 times, so a VERBATIM copy of its Routing tree
 * scored 0.46, and appending a skill index dropped it further.
 */
export function orderScore(canonical, suspect) {
  const canonSet = new Set(canonical);
  const suspectSet = new Set(suspect);

  const ours = [...new Set(canonical.filter((r) => suspectSet.has(r)))];
  const theirs = [...new Set(suspect.filter((r) => canonSet.has(r)))];
  if (ours.length === 0 || theirs.length === 0) return 0;

  return longestCommonSubsequence(ours, theirs) / Math.max(ours.length, theirs.length);
}

/**
 * @param {{id:string, hash:string, routes:string[], canaries:string[]}} canonical
 * @param {string} suspectText
 */
export function compareToCanonical(canonical, suspectText) {
  const suspectRoutes = routeSequenceAgainst(suspectText, canonical.routes);
  const flatSuspect = flat(suspectText);

  const exact = contentHash(suspectText) === canonical.hash;
  const containment = routeContainment(canonical.routes, suspectRoutes);
  const order = orderScore(canonical.routes, suspectRoutes);

  const canaryHits = (canonical.canaries ?? []).filter((c) => flatSuspect.includes(flat(c)));

  // DISTINCT, both of them. A canonical file that names one skill four times
  // was reporting "5/26 routes present (14% containment)": the fraction counted
  // repeats, the percentage did not, and the two numbers on one evidence line
  // contradicted each other.
  const suspectSet = new Set(suspectRoutes);
  const canonicalDistinct = [...new Set(canonical.routes)];
  const matchedRoutes = canonicalDistinct.filter((r) => suspectSet.has(r));

  let verdict = "no-match";
  if (exact) {
    verdict = "identical";
    // STRUCTURE ALONE IS NOT EVIDENCE. Routing most of one plugin in lifecycle
    // order is what an honest author independently produces: the selection is
    // the whole plugin, so it encodes nothing, and the arrangement is a
    // lifecycle nobody owns. An independently written table over obra's public
    // superpowers plugin scored 100% containment and 86% order with zero
    // canaries; engine/tests/fixtures/independent-router.md is that file.
    // `derivative-likely` now requires ORIGINAL EXPRESSION carried across (a
    // canary) alongside the structural signal.
    //
    // THE COST IS REAL AND DELIBERATE. A copier who lifts the routing tree and
    // rewrites ALL the prose now reaches `possible-derivative`, not
    // `derivative-likely`. That case and the honest author are structurally
    // identical, and PROVENANCE.md already chose: "A tool that accuses an
    // honest author is worse than no tool."
  } else if (
    (containment >= DERIVATIVE_CONTAINMENT && order >= DERIVATIVE_ORDER && canaryHits.length >= 1) ||
    canaryHits.length >= DERIVATIVE_CANARIES
  ) {
    verdict = "derivative-likely";
  } else if (containment >= POSSIBLE_CONTAINMENT || canaryHits.length >= 1) {
    verdict = "possible-derivative";
  }

  return {
    id: canonical.id,
    exact,
    verdict,
    routeContainment: containment,
    orderScore: order,
    canaryHits,
    matchedRoutes,
    canonicalRouteCount: canonicalDistinct.length,
    suspectRouteCount: suspectSet.size,
  };
}
