# Flow Authoring Rules — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every shipped Flow fire like the one that already does, by giving every named skill a state-based trigger with a verb, and by making the mechanical half of that rule enforceable.

**Architecture:** A new pure module `engine/tools/flow-rules.mjs` holds the checkable rules (R1, R3, R4, R5, R6). `validate-flow.mjs` calls it behind an opt-in option so the checks can land before the content is fixed without failing the repo. The three overlay FLOW.md files are then rewritten to comply, enforcement is switched on, and a repo-wide test asserts every shipped Flow passes. The banner clause ships last and separately.

**Tech Stack:** ES modules (`.mjs`), `bun test`, POSIX `sh` for the hook.

**Spec:** `docs/decisions/2026-07-28-flow-authoring-rules.md`

## STATUS (2026-07-28)

| Task | State |
|---|---|
| 1. Rule module: verbs + orphans (R1, R3) | **DONE** |
| 2. Section order, advisory, drift, counts (R4, R5, R6) | **DONE** |
| 3. Wire into validate-flow, opt-in | **DONE** |
| 4. Rewrite growth-marketing FLOW.md | open, **GATED**: does routed `seo-audit` fire? UNANSWERED |
| 5. growth-marketing FLOW-compact.md | open |
| 6. ultra-powers sweep | open |
| 7. superpowers sweep | open |
| 8. Turn enforcement on | open, blocked by 4-7 AND by remediation Task 5 (CRLF) on Windows |
| 9. Born-compliant template + scaffold | **DONE** |
| 10. Banner clause | open |
| 11. Release | open |

**Task 9 moved earlier than planned, because the plan was wrong about it.** It assumed a
template existed at `templates/flow-standard/`. It did not exist anywhere in this repo, and
`scaffold-flow.mjs` copies from `engine/templates/flow-standard` — so **the scaffolder was
broken and died with ENOENT on every invocation**, untested. Creating the born-compliant
template fixed the tool and satisfied Task 9 at the same time.

**A pre-existing validator bug surfaced while doing it.** `validate-flow.mjs` scanned the whole
file for `invoke <slug>`, so the standard's own mandated sentence ("producing it when a trigger
matched and you did not invoke is a VIOLATION") reported a routed skill named `"is"` and failed
every Flow that followed the standard. Now scans route lines only. Both fixtures put their route
on an arrow line, so the check keeps its teeth.

224 tests pass.

## Global Constraints

- **The banner stays ONE line.** Tests assert it. Do not split it or drop a clause.
- **The hook is FAIL-LOUD, NEVER FAIL-CLOSED.** It always exits 0 and never blocks. Do not add a path that can exit non-zero.
- **POSIX `sh` only** in `engine/hooks/**`. No bashisms.
- **TARGET EDITS BY ANCHOR STRING, NEVER BY LINE NUMBER.**
- **Do NOT modify the `flowy_plugins_base` containment guard** in `flowy-inject.sh`. It stops a cloned repo's planted `FLOW-compact.md` from being read into authoritative context. Deleting it is a security regression.
- **Overlays route to EXTERNAL namespaced skills (`ns:skill`), not vendored `skills/<slug>/`.** The existing `invoke <slug>` resolution check in `validate-flow.mjs` is for vendored Flows. New rules must not make a `ns:skill` reference look like a missing vendored skill.
- **Every FLOW.md edit invalidates `engine/provenance/manifest.json`.** `engine/tests/provenance-manifest.test.ts` fails until it is regenerated. Regeneration is a step in every content task, not an afterthought.
- **License buckets:** new `.mjs` under `engine/tools/` is Apache-2.0 and needs an `SPDX-License-Identifier: Apache-2.0` line. `engine/tests/license-coverage.test.ts` fails on an unassigned tracked file.
- Run tests from `engine/`: `cd engine && bun test`.

---

## File Structure

| File | Responsibility |
|---|---|
| `engine/tools/flow-rules.mjs` | **new.** Pure rule checks. No I/O. Exports `checkRouteVerbs`, `checkNoOrphanSkills`, `checkSectionOrder`, `checkAdvisoryPhrasing`, `checkDriftClause`, `checkClaimedCounts`, `checkFlowRules` |
| `engine/tests/flow-rules.test.ts` | **new.** Unit tests per rule, including a negative case per rule |
| `engine/tools/validate-flow.mjs` | modified. Calls `checkFlowRules` when `{ authoringRules: true }` |
| `engine/tests/shipped-flows.test.ts` | **new.** Asserts every `overlays/*/flows/*/FLOW.md` passes the rules |
| `overlays/growth-marketing/flows/growth-marketing/FLOW.md` | rewritten |
| `overlays/growth-marketing/flows/growth-marketing/FLOW-compact.md` | rewritten |
| `overlays/ultra-powers/flows/ultra-powers/FLOW.md` | verb + orphan sweep |
| `overlays/ultra-powers/flows/ultra-powers/FLOW-compact.md` | matched to parent |
| `overlays/superpowers/flows/superpowers/FLOW.md` | sweep only |
| `engine/templates/flow-standard/FLOW.md` | born-compliant template. **Path corrected:** the repo-root `templates/flow-standard/` this plan originally named does not exist, and `scaffold-flow.mjs` copies from `engine/templates/flow-standard` |
| `engine/hooks/flowy-inject.sh` | one added banner clause. LAST task |

---

## Task 1: The rule module, verbs and orphans (R3, R1)

**Files:**
- Create: `engine/tools/flow-rules.mjs`
- Test: `engine/tests/flow-rules.test.ts`

**Interfaces:**
- Produces: `checkRouteVerbs(text) -> string[]`, `checkNoOrphanSkills(text) -> string[]`. Each returns an array of human-readable error strings, empty when the rule holds. Later tasks add more `check*` functions with the identical signature and aggregate them in `checkFlowRules(text) -> string[]`.

**Definitions used by every rule:**
- A **skill reference** is `ns:skill`, matching `/\b[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*\b/`.
- A **route line** is a line containing `→` or `->` followed by a skill reference.

- [ ] **Step 1: Write the failing tests**

```typescript
import { describe, expect, test } from "bun:test";
import { checkRouteVerbs, checkNoOrphanSkills } from "../tools/flow-rules.mjs";

describe("checkRouteVerbs (R3)", () => {
  test("a route line with the verb passes", () => {
    expect(checkRouteVerbs("  ├─ about to code? → invoke sp:tdd\n")).toEqual([]);
  });

  test("a route line naming a skill with NO verb is an error", () => {
    // The receipt-not-promise defect one layer down: a noun is a reference,
    // a verb is an instruction.
    const errs = checkRouteVerbs("  ├─ about to code? → sp:tdd\n");
    expect(errs.length).toBe(1);
    expect(errs[0]).toContain("sp:tdd");
  });

  test("prose that mentions a skill is NOT a route line", () => {
    // Attribution and disambiguation sections name skills constantly. Treating
    // those as routes would make the rule unsatisfiable.
    expect(checkRouteVerbs("sp:tdd and sp:review overlap on purpose.\n")).toEqual([]);
  });

  test("ASCII arrows count as routes too", () => {
    expect(checkRouteVerbs("  - bug? -> sp:debug\n").length).toBe(1);
  });
});

describe("checkNoOrphanSkills (R1)", () => {
  test("a skill that appears only in prose is an orphan", () => {
    // THE defect: 40 of 47 skills named in an index with no trigger.
    const errs = checkNoOrphanSkills("## Routing\n- x? → invoke ms:cro\n\n## More\nms:ai-seo is available.\n");
    expect(errs.length).toBe(1);
    expect(errs[0]).toContain("ms:ai-seo");
  });

  test("a skill named in prose AND routed is not an orphan", () => {
    const text = "## Routing\n- x? → invoke ms:cro\n\n## Notes\nms:cro pairs well with research.\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });

  test("the Attribution section is exempt", () => {
    // Attribution MUST name upstream skills to credit them. Requiring a route
    // for each would force us to choose between crediting and validating.
    const text = "## Routing\n- x? → invoke ms:cro\n\n## Attribution\nms:ai-seo by Corey Haines, MIT.\n";
    expect(checkNoOrphanSkills(text)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `cd engine && bun test tests/flow-rules.test.ts`
Expected: FAIL with `Cannot find module '../tools/flow-rules.mjs'`

- [ ] **Step 3: Write the module**

```javascript
/**
 * Flow authoring rules, mechanical half.
 *
 * Spec: docs/decisions/2026-07-28-flow-authoring-rules.md
 *
 * Pure. No I/O. Every check takes FLOW.md text and returns an array of error
 * strings, empty when the rule holds.
 *
 * R2 (trigger style) and R7 (register) are NOT here and must not be added:
 * they are judgment calls, and a check that pretends to cover them would be a
 * test that can never fail.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const SKILL_REF = /\b[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*\b/g;
const ARROW = /(?:→|->)/;

/** Section heading a line opens, or null. */
function headingOf(line) {
  const m = line.match(/^##\s+(.*)$/);
  return m ? m[1].trim() : null;
}

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
  for (const [i, line] of text.split("\n").entries()) {
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

  for (const [i, line] of text.split("\n").entries()) {
    const h = headingOf(line);
    if (h !== null) {
      section = h;
      continue;
    }
    if (isRouteLine(line)) {
      for (const r of refsIn(line)) routed.add(r);
      continue;
    }
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
```

- [ ] **Step 4: Run the tests and watch them pass**

Run: `cd engine && bun test tests/flow-rules.test.ts`
Expected: PASS, 7 tests

- [ ] **Step 5: Commit**

```bash
git add engine/tools/flow-rules.mjs engine/tests/flow-rules.test.ts
git commit -m "feat(rules): R1 orphan-skill and R3 route-verb checks"
```

---

## Task 2: Section order, advisory phrasing, drift clause, claimed counts (R5, R4, R6)

**Files:**
- Modify: `engine/tools/flow-rules.mjs`
- Test: `engine/tests/flow-rules.test.ts`

**Interfaces:**
- Consumes: the module from Task 1.
- Produces: `checkSectionOrder(text)`, `checkAdvisoryPhrasing(text)`, `checkDriftClause(text)`, `checkClaimedCounts(text)`, and `checkFlowRules(text)` which concatenates all six.

- [ ] **Step 1: Write the failing tests**

```typescript
import {
  checkSectionOrder, checkAdvisoryPhrasing, checkDriftClause,
  checkClaimedCounts, checkFlowRules,
} from "../tools/flow-rules.mjs";

describe("checkSectionOrder (R5)", () => {
  test("Routing first passes", () => {
    expect(checkSectionOrder("# T\n\n## Routing\nx\n\n## Phases\ny\n")).toEqual([]);
  });
  test("Phases before Routing is an error", () => {
    // growth-marketing led with 7 numbered Phases and pushed the routing tree
    // down the file.
    expect(checkSectionOrder("# T\n\n## Phases\ny\n\n## Routing\nx\n").length).toBe(1);
  });
});

describe("checkAdvisoryPhrasing (R4)", () => {
  test("the narrow escape passes", () => {
    expect(checkAdvisoryPhrasing("advise? → answer only; no files change\n")).toEqual([]);
  });
  test("answering from a skill's principles is banned", () => {
    // This sentence authorises the exact from-memory behaviour the engine exists
    // to stop, in the file that exists to stop it.
    const errs = checkAdvisoryPhrasing("→ answer from the relevant skill's principles\n");
    expect(errs.length).toBe(1);
    expect(errs[0]).toContain("principles");
  });
  test("the denylist is case-insensitive and apostrophe-agnostic", () => {
    expect(checkAdvisoryPhrasing("Answer From The Skill’s Principles.\n").length).toBe(1);
  });
});

describe("checkDriftClause (R6)", () => {
  test("a file containing the drift clause passes", () => {
    expect(checkDriftClause("**Drift:** a broken route is this Flow needing an update, never license to improvise.\n")).toEqual([]);
  });
  test("a file with no drift clause is an error", () => {
    expect(checkDriftClause("## Routing\nx\n").length).toBe(1);
  });
});

describe("checkClaimedCounts (R6)", () => {
  test("a claim that matches the routed count passes", () => {
    expect(checkClaimedCounts("routes 2 skills\n- a? → invoke x:one\n- b? → invoke y:two\n")).toEqual([]);
  });
  test("a claim that overstates the routed count is an error", () => {
    // The file said "47 skills" and listed 45.
    const errs = checkClaimedCounts("the full 47 skills set\n- a? → invoke x:one\n");
    expect(errs.length).toBe(1);
    expect(errs[0]).toContain("47");
  });
});

describe("checkFlowRules", () => {
  test("aggregates every rule's errors", () => {
    const errs = checkFlowRules("# T\n\n## Phases\np\n\n## Routing\n- a? → x:one\n");
    expect(errs.length).toBeGreaterThanOrEqual(3); // order + verb + drift
  });
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `cd engine && bun test tests/flow-rules.test.ts`
Expected: FAIL, `checkSectionOrder is not a function`

- [ ] **Step 3: Append to `engine/tools/flow-rules.mjs`**

```javascript
/** R4: phrasings that authorise answering from memory instead of invoking. */
const BANNED_ADVISORY = [
  /answer\s+from\s+the\s+(?:relevant\s+)?skill['’]?s?\s+principles/i,
  /from\s+memory\s+is\s+(?:fine|ok|acceptable)/i,
  /you\s+may\s+summarise\s+the\s+skill\s+instead/i,
];

/** R5: Routing must be the first `##` section. */
export function checkSectionOrder(text) {
  const headings = text.split("\n").map(headingOf).filter((h) => h !== null);
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
    : ['no drift clause. Add one: a route whose target no longer exists is a Flow to fix, never license to improvise.'];
}

/**
 * R6: a claimed skill count must not exceed what the file actually routes.
 * Under-claiming is allowed; a Flow may describe a subset.
 */
export function checkClaimedCounts(text) {
  const routed = new Set();
  for (const line of text.split("\n")) {
    if (isRouteLine(line)) for (const r of refsIn(line)) routed.add(r);
  }
  const errors = [];
  for (const m of text.matchAll(/\b(\d{2,})[- ]skill|\b(\d{2,})\s+skills\b/gi)) {
    const claimed = Number(m[1] ?? m[2]);
    if (claimed > routed.size) {
      errors.push(`claims ${claimed} skills but routes ${routed.size}. State a number the file can back.`);
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
```

- [ ] **Step 4: Run the tests and watch them pass**

Run: `cd engine && bun test tests/flow-rules.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add engine/tools/flow-rules.mjs engine/tests/flow-rules.test.ts
git commit -m "feat(rules): R5 section order, R4 advisory denylist, R6 drift clause and counts"
```

---

## Task 3: Wire the rules into validate-flow behind an opt-in

**Files:**
- Modify: `engine/tools/validate-flow.mjs`
- Test: `engine/tests/validate-flow.test.ts`

**Interfaces:**
- Consumes: `checkFlowRules` from Task 2.
- Produces: `validateFlow(dir, opts)` where `opts.authoringRules === true` adds the rule errors. Default `false`, so existing callers are unchanged.

The opt-in exists so the checks can land before the content is fixed. Turning them on now would fail the repo on its own contents, which is how a useful check gets disabled for being annoying.

- [ ] **Step 1: Write the failing test**

Append to the existing file. The fixture helper is already defined there as
`const fx = (n) => join(import.meta.dir, "fixtures", n);` — use `fx`, not a new helper.

```typescript
test("authoringRules is OFF by default so existing callers are unchanged", () => {
  // The existing "good fixture validates clean" test must keep passing
  // untouched. If this flips, the opt-in is not actually opt-in.
  expect(validateFlow(fx("good-flow")).ok).toBe(true);
});

test("authoringRules:true surfaces rule errors on the same fixture", () => {
  // good-flow is a 15-line demo with no drift clause, so it is a genuine
  // negative case for the new rules while staying valid under the old ones.
  const res = validateFlow(fx("good-flow"), { authoringRules: true });
  expect(res.ok).toBe(false);
  expect(res.errors.some((e) => /drift clause/i.test(e))).toBe(true);
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `cd engine && bun test tests/validate-flow.test.ts`
Expected: FAIL, the second test gets `ok: true`

- [ ] **Step 3: Modify `validate-flow.mjs`**

Add the import at the top, next to the `flow-scan` import:

```javascript
import { checkFlowRules } from "./flow-rules.mjs";
```

Change the signature and append the rule errors immediately before the final `return`:

```javascript
export function validateFlow(dir, opts = {}) {
```

```javascript
  // Authoring rules (R1, R3, R4, R5, R6). Opt-in: see
  // docs/decisions/2026-07-28-flow-authoring-rules.md. Enabled repo-wide in
  // engine/tests/shipped-flows.test.ts once the overlays comply.
  if (opts.authoringRules) errors.push(...checkFlowRules(flow));

  return { ok: errors.length === 0, errors };
```

- [ ] **Step 4: Run and watch it pass**

Run: `cd engine && bun test tests/validate-flow.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add engine/tools/validate-flow.mjs engine/tests/validate-flow.test.ts
git commit -m "feat(validate): opt-in authoring rules, off by default"
```

---

## Task 4: Rewrite growth-marketing FLOW.md

**Files:**
- Modify: `overlays/growth-marketing/flows/growth-marketing/FLOW.md`

### BLOCKING GATE. Do not start this task until it is answered.

**Does the already-routed `marketing-skills:seo-audit` actually fire?**

`seo-audit` is the only SEO skill that already has a route, a state trigger and the verb. It is
the control for the entire missing-route theory, and answering it costs one observation.

- [ ] **Gate step: observe an SEO turn under the CURRENT `growth-marketing` Flow and record
      whether `marketing-skills:seo-audit` was invoked.**

- **It fires** -> the missing-route theory holds. Routed SEO skills fire, unrouted ones do not,
  and the difference between them is the route. Proceed with the rewrite exactly as written below.
- **It does NOT fire** -> **a missing route explains nothing, and this task as written is the
  wrong fix.** The skill WITH a route behaves the same as the 40 without one, so R1 is not the
  cause and adding 40 routes adds 40 more routes that also will not fire. The leading explanation
  is then the namespace contest recorded in the spec's confounder 2: `claude-seo` ships 19 SEO
  skills and the founder's own `overlays/ultra-powers/flows/ultra-powers/FLOW.md` line 16 says
  "`claude-seo` owns SEO execution; `marketing-skills` owns GTM", while `growth-marketing` has no
  disambiguation section at all. The real fix is then a **disambiguation section** stating which
  namespace owns SEO, and the route sweep becomes secondary hygiene rather than the headline fix.

Record the answer in this plan's STATUS block before proceeding either way.

This is the failing file and the reason the cycle exists. Every installed
`marketing-skills` skill gets an R1 verdict: a state-based trigger, or its name
removed. None stays named without a trigger.

- [ ] **Step 1: Derive the authoritative skill list**

```bash
ls "$HOME/.claude/plugins/cache/marketingskills/marketing-skills/2.8.12/skills"
```

Record the exact count. Any number stated in the file must be one this list backs (R6).

- [ ] **Step 2: Restructure the file**

Section order, top to bottom (R5): title and one-line summary, attribution line, HTML comment, `## Routing`, `## Priority on collision`, `## Phases`, `## Attribution`.

`## Routing` opens with the mandatory rule in the commanding register (R7). Replace the existing paragraph with:

```markdown
**The rule. MANDATORY, not advisory.** When a trigger matches, INVOKE the named skill with the
Skill tool BEFORE producing anything. Do not draft the copy, the audit, the sequence, or the
plan first. Producing the artifact when a trigger matched and you did not invoke is a
VIOLATION, not a shortcut, and naming the skill without calling it is not invoking.
```

- [ ] **Step 3: Write the route lines**

Every line takes the form `trigger? → invoke marketing-skills:<slug>` with an artifact gate.
Triggers are agent-state conditions (R2). A user quote may follow a condition as an example,
never replace it.

```
USER MESSAGE
  │
  ├─ INTAKE. Classify funnel stage before acting.
  │    ├─ no research brief exists for this audience?        → invoke marketing-skills:customer-research   gate: 3 pains + 5 verbatim quotes
  │    └─ no positioning doc exists for this product?        → invoke marketing-skills:product-marketing    gate: .agents/product-marketing.md written
  │
  ├─ COPY. About to write or rewrite words a user will read.
  │    ├─ about to write page, landing, or pricing copy?     → invoke marketing-skills:copywriting     gate: 1 headline + subhead + 1 CTA, each tied to a quote
  │    ├─ about to edit existing copy for clarity?           → invoke marketing-skills:copy-editing    gate: a redline against the original
  │    └─ about to write an offer, guarantee, or price?      → invoke marketing-skills:offers          gate: the offer stated with its risk reversal
  │
  ├─ ACQUISITION. About to change how traffic arrives.
  │    ├─ about to diagnose or improve organic ranking?      → invoke marketing-skills:seo-audit            gate: top 5 fixes, each keyword or page tagged
  │    ├─ about to optimise for AI search or LLM citation?   → invoke marketing-skills:ai-seo               gate: citable-passage plan per target query
  │    ├─ about to generate pages at scale from a dataset?   → invoke marketing-skills:programmatic-seo     gate: template + data source + dedup rule
  │    ├─ about to add or change structured data?            → invoke marketing-skills:schema              gate: the JSON-LD type and required fields
  │    ├─ about to change URL, nav, or internal-link shape?  → invoke marketing-skills:site-architecture   gate: before/after tree with the canonical rule
  │    ├─ about to write outbound to named prospects?        → invoke marketing-skills:cold-email          gate: first touch + 2 follow-ups + a per-prospect signal
  │    ├─ about to build a prospect list?                    → invoke marketing-skills:prospecting        gate: the qualifying criteria, written
  │    ├─ about to spend money on traffic?                   → invoke marketing-skills:ads                 gate: audience + budget + the kill metric
  │    ├─ about to produce ad creative?                      → invoke marketing-skills:ad-creative         gate: 3 variants against one hypothesis
  │    ├─ about to pitch press or a publication?             → invoke marketing-skills:public-relations    gate: the angle and why it is news now
  │    ├─ about to submit to directories?                    → invoke marketing-skills:directory-submissions  gate: the per-site description variants
  │    ├─ about to partner for shared audience?              → invoke marketing-skills:co-marketing        gate: what each side gives and gets
  │    ├─ about to post into a community you did not build?  → invoke marketing-skills:community-marketing gate: the 90/10 contribution record
  │    ├─ about to ask users to invite others?               → invoke marketing-skills:referrals           gate: the two-sided incentive
  │    └─ about to publish an app-store listing?             → invoke marketing-skills:aso                 gate: title, subtitle, keyword set
  │
  ├─ CONTENT AND CHANNELS. About to decide what to say or where.
  │    ├─ about to choose topics or a content calendar?      → invoke marketing-skills:content-strategy    gate: topic list tied to funnel stage
  │    ├─ about to write a social post or thread?            → invoke marketing-skills:social              gate: the hook and the one idea
  │    ├─ about to send an email to a list?                  → invoke marketing-skills:emails              gate: subject, one CTA, the segment
  │    ├─ about to send SMS?                                 → invoke marketing-skills:sms                 gate: consent basis + the single CTA
  │    ├─ about to script or storyboard video?               → invoke marketing-skills:video               gate: the first 3 seconds, written
  │    └─ about to brief or generate a marketing image?      → invoke marketing-skills:image               gate: the message the image carries
  │
  ├─ CONVERSION. A live surface underperforms, or is about to exist.
  │    ├─ about to change a page to convert better?          → invoke marketing-skills:cro                    gate: top 3 blockers ranked, each with a fix
  │    ├─ about to design or change signup?                  → invoke marketing-skills:signup                 gate: the field list and why each survives
  │    ├─ about to design onboarding or activation?          → invoke marketing-skills:onboarding             gate: the activation moment, named
  │    ├─ about to gate a feature behind payment?            → invoke marketing-skills:paywalls               gate: what stays free and why
  │    ├─ about to add a popup or interstitial?              → invoke marketing-skills:popups                 gate: trigger, frequency cap, exit
  │    ├─ about to build a lead magnet?                      → invoke marketing-skills:lead-magnets           gate: the promise and the capture
  │    ├─ about to build a free tool for acquisition?        → invoke marketing-skills:free-tools            gate: the standalone value + the path to product
  │    └─ about to apply persuasion or social proof?         → invoke marketing-skills:marketing-psychology  gate: the principle named, honestly applied
  │
  ├─ PRICING AND POSITIONING.
  │    ├─ about to set or change price or tiers?             → invoke marketing-skills:pricing               gate: the value metric
  │    ├─ about to plan a quarter or a budget?               → invoke marketing-skills:marketing-plan        gate: channels with owners and numbers
  │    ├─ out of ideas for the next growth move?             → invoke marketing-skills:marketing-ideas       gate: a ranked shortlist
  │    ├─ about to design a compounding loop?                → invoke marketing-skills:marketing-loops       gate: the loop drawn, with its cycle time
  │    ├─ about to compare against a named rival?            → invoke marketing-skills:competitor-profiling  gate: a profile from primary sources
  │    ├─ about to make a market-wide competitive claim?     → invoke marketing-skills:competitors           gate: the claim, sourced
  │    ├─ about to arm sales with material?                  → invoke marketing-skills:sales-enablement      gate: the objection list with answers
  │    └─ want a panel critique of a marketing decision?     → invoke marketing-skills:marketing-council     gate: the decision restated with dissent recorded
  │
  ├─ LAUNCH.
  │    └─ about to ship something publicly?                  → invoke marketing-skills:launch                gate: dated channel checklist + one owned-channel capture
  │
  ├─ MEASUREMENT AND RETENTION.
  │    ├─ about to define or read a growth metric?           → invoke marketing-skills:analytics             gate: the metric defined, with its source
  │    ├─ about to change revenue ops or the funnel model?   → invoke marketing-skills:revops                gate: the stage definitions
  │    └─ about to address churn or retention?               → invoke marketing-skills:churn-prevention      gate: the churn reason, evidenced
  │
  ├─ DONE-CHECK. Before ANY "this worked / it converts better / it is an improvement" claim.
  │    └─ about to claim a change won?                       → invoke marketing-skills:ab-testing            gate: hypothesis + primary metric + measured baseline + pre-computed sample size. No win is claimed before significance.
  │
  ├─ SCOPE CHANGE. Audience, product, or offer changed mid-stream.
  │    └─ re-enter INTAKE. A stale research brief invalidates every downstream asset.
  │
  ├─ BLOCKED. A gate needs an input you do not have.
  │    └─ name the missing input and the resume condition, then stop. Never fabricate the artifact to move on.
  │
  └─ ADVISORY. The user asked a question and no artifact is being produced.
       └─ answer only; no files change.
```

- [ ] **Step 4: Add the drift clause under the routing block**

```markdown
**Drift:** every route targets `marketing-skills:<slug>` in the separately installed
marketing-skills plugin. If a slug no longer exists there, that route is a silent no-op. Never
substitute a nearby-sounding skill. A broken route means this Flow needs an update, not that you
may improvise.
```

- [ ] **Step 5: Run the rules against the rewritten file**

```bash
cd engine && bun -e 'import {checkFlowRules} from "./tools/flow-rules.mjs"; import {readFileSync} from "node:fs"; const e=checkFlowRules(readFileSync("../overlays/growth-marketing/flows/growth-marketing/FLOW.md","utf8")); console.log(e.length?e.join("\n"):"CLEAN")'
```

Expected: `CLEAN`. Any error names the line to fix.

- [ ] **Step 6: Regenerate the provenance manifest and run the suite**

```bash
cd .. && node engine/tools/flowy-provenance.mjs generate && cd engine && bun test
```

Expected: all pass. The manifest regeneration is mandatory: `provenance-manifest.test.ts` compares the committed manifest against the files and fails otherwise.

- [ ] **Step 7: Commit**

```bash
git add overlays/growth-marketing/flows/growth-marketing/FLOW.md engine/provenance/manifest.json
git commit -m "fix(growth-marketing): route every skill with a state-based trigger

40 of 47 skills had no trigger at all. Every SEO skill except seo-audit sat in
a passive index, which is exactly the founder's complaint: there was nothing to
match. Also removes the advisory escape that authorised answering from the
skill's principles instead of invoking it."
```

---

## Task 5: Regenerate growth-marketing FLOW-compact.md

**Files:**
- Modify: `overlays/growth-marketing/flows/growth-marketing/FLOW-compact.md`

The compact file is what the every-N-prompt refresh re-injects, so it is the
real hook-path surface. It carries the same defects as its parent and must not
drift from it.

- [ ] **Step 1: Rewrite it, keeping it terse**

It stays a per-prompt cost, so it carries one line per funnel GROUP plus the
non-negotiable gates, not all 47 routes.

```markdown
# Growth Marketing — routing refresh (compact)

Agent-state triggers. When one matches, INVOKE the skill with the Skill tool BEFORE producing
the artifact. Producing it without invoking is a VIOLATION.

- about to write words a user reads → `invoke marketing-skills:copywriting` (or `copy-editing`, `offers`)
- about to change how traffic arrives → `invoke marketing-skills:seo-audit` (or `ai-seo`, `programmatic-seo`, `schema`, `site-architecture`, `ads`, `cold-email`, `public-relations`, `directory-submissions`)
- about to decide what to say or where → `invoke marketing-skills:content-strategy` (or `social`, `emails`, `sms`, `video`, `image`)
- about to change a converting surface → `invoke marketing-skills:cro` (or `signup`, `onboarding`, `paywalls`, `popups`, `lead-magnets`, `free-tools`)
- about to set price, plan, or positioning → `invoke marketing-skills:pricing` (or `product-marketing`, `marketing-plan`, `marketing-ideas`, `competitors`)
- about to ship publicly → `invoke marketing-skills:launch` (dated checklist + owned-channel capture)
- about to read or define a metric → `invoke marketing-skills:analytics` (or `revops`, `churn-prevention`)
- no research brief for this audience yet → `invoke marketing-skills:customer-research` FIRST
- about to claim "this worked" → `invoke marketing-skills:ab-testing` FIRST (hypothesis + metric + baseline + sample size)

Collision: Blocked > Scope-changed (re-Intake) > Done-check (ab-testing) > lifecycle order > advisory.
Advisory means answer only; no files change. Never answer from a skill's principles instead of invoking it.
Drift: a slug that no longer exists is a Flow to fix, never license to improvise.
```

- [ ] **Step 2: Verify the compact file names no skill the parent does not route**

```bash
cd engine && bun -e 'import {readFileSync} from "node:fs";const R=/\b[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*\b/g;const d="../overlays/growth-marketing/flows/growth-marketing/";const p=new Set(readFileSync(d+"FLOW.md","utf8").match(R));const c=[...new Set(readFileSync(d+"FLOW-compact.md","utf8").match(R))].filter(x=>!p.has(x));console.log(c.length?"DRIFT: "+c.join(", "):"IN SYNC")'
```

Expected: `IN SYNC`

- [ ] **Step 3: Regenerate provenance, run the suite, commit**

```bash
cd .. && node engine/tools/flowy-provenance.mjs generate && cd engine && bun test && cd ..
git add overlays/growth-marketing/flows/growth-marketing/FLOW-compact.md engine/provenance/manifest.json
git commit -m "fix(growth-marketing): compact refresh matches the rewritten parent"
```

---

## Task 6: ultra-powers sweep

**Files:**
- Modify: `overlays/ultra-powers/flows/ultra-powers/FLOW.md`
- Modify: `overlays/ultra-powers/flows/ultra-powers/FLOW-compact.md`

~40 distinct skills across 125 route references, and the public downloadable
Flow, so it goes after growth-marketing has proven the pattern.

- [ ] **Step 1: List the violations**

```bash
cd engine && bun -e 'import {checkFlowRules} from "./tools/flow-rules.mjs"; import {readFileSync} from "node:fs"; console.log(checkFlowRules(readFileSync("../overlays/ultra-powers/flows/ultra-powers/FLOW.md","utf8")).join("\n"))'
```

- [ ] **Step 2: Add `invoke` to every route line**

Route lines currently read `→ ultra-powers:office-hours`. They become
`→ invoke ultra-powers:office-hours`. Change ONLY lines the checker flagged;
the Disambiguation section names skills in prose and must stay prose.

- [ ] **Step 3: Resolve every orphan**

The checker names each skill mentioned outside Attribution with no route. For
each: give it a trigger in the routing tree, or delete the mention. No third
option.

- [ ] **Step 4: Add the drift clause and fix any count claim**

The header says "40 real, hand-verified skills across 7 suites". If the routed
count is lower, restate the number to one the file backs.

- [ ] **Step 5: Sync the compact file, regenerate provenance, run the suite**

```bash
cd engine && bun -e 'import {checkFlowRules} from "./tools/flow-rules.mjs"; import {readFileSync} from "node:fs"; console.log(checkFlowRules(readFileSync("../overlays/ultra-powers/flows/ultra-powers/FLOW.md","utf8")).length?"STILL FAILING":"CLEAN")'
cd .. && node engine/tools/flowy-provenance.mjs generate && cd engine && bun test
```

Expected: `CLEAN`, then all tests pass.

- [ ] **Step 6: Commit**

```bash
git add overlays/ultra-powers/flows/ultra-powers/ engine/provenance/manifest.json
git commit -m "fix(ultra-powers): verb on every route, no orphaned skills, drift clause"
```

---

## Task 7: superpowers sweep

**Files:**
- Modify: `overlays/superpowers/flows/superpowers/FLOW.md`

Already largely compliant. It has verbs, Routing is first, and it has a drift
clause. Expect few errors.

- [ ] **Step 1: List the violations**

```bash
cd engine && bun -e 'import {checkFlowRules} from "./tools/flow-rules.mjs"; import {readFileSync} from "node:fs"; console.log(checkFlowRules(readFileSync("../overlays/superpowers/flows/superpowers/FLOW.md","utf8")).join("\n") || "CLEAN")'
```

- [ ] **Step 2: Fix exactly what is listed. Change nothing else.**

This file is the one that works. Do not rewrite it for consistency with the
others; every unnecessary edit risks the behaviour we are trying to copy.

- [ ] **Step 2a: ESCAPE HATCH. When a rule flags THIS file, suspect the rule first.**

`superpowers` is the reference implementation. Its ~97% firing is the behaviour the entire cycle
exists to reproduce elsewhere. So when a rule fires on it, there are two readings, and the
default one is backwards:

- the file is wrong and the rule caught it, or
- **the rule encodes something the working file does not do, and the rule is what is wrong.**

For every other file, Task 8's instruction stands: fix the FILE, never the rule. **That
instruction does not apply to `superpowers`.** Changing this file to satisfy a rule that its
working version violates is changing the reference implementation to match a guess about why it
works. That is the one edit with a real chance of destroying the effect being copied.

Procedure per flagged line:

1. Ask what the working file does today and why the rule objects.
2. If the file's current form is defensible, **amend the rule and its tests**, and record in the
   rule module's header why `superpowers` is the counter-example.
3. Only edit `superpowers` when the flagged line is a defect on its own terms, independent of the
   rule, for example a genuinely broken route target or a count the file cannot back.

The current count is **2** errors on this file (`growth-marketing` is 17 and `ultra-powers` is
56). Two is small enough to reason about line by line. Do that rather than sweeping them.

- [ ] **Step 3: Regenerate provenance, run the suite, commit**

```bash
cd .. && node engine/tools/flowy-provenance.mjs generate && cd engine && bun test && cd ..
git add overlays/superpowers/flows/superpowers/FLOW.md engine/provenance/manifest.json
git commit -m "fix(superpowers): authoring-rule sweep, minimal edits"
```

---

## Task 8: Turn enforcement on

**Files:**
- Create: `engine/tests/shipped-flows.test.ts`

**Interfaces:**
- Consumes: `checkFlowRules` from Task 2, and the compliant files from Tasks 4 to 7.

**BLOCKED ON WINDOWS until Task 5 of `docs/plans/2026-07-28-ce-review-remediation.md` lands.**
This test reads shipped FLOW.md files off the working tree. On a Windows checkout those files
have CRLF line endings, and `flow-rules.mjs` splits on `"\n"` without stripping the `\r`, so
every `##` heading is invisible: `checkSectionOrder` returns "FLOW.md has no ## sections" for
every Flow and `checkNoOrphanSkills` loses its Attribution exemption. This test therefore cannot
pass on Windows no matter how compliant the files are. Remediation Task 5 adds the shared
`engine/tools/text-normalize.mjs` and `*.md text eol=lf` in `.gitattributes`, which fixes both.
Land that first. A red suite here before then is the CRLF defect, not a non-compliant file.

- [ ] **Step 1: Write the test**

```typescript
import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { checkFlowRules } from "../tools/flow-rules.mjs";

/* Enforcement. Landing this BEFORE tasks 4-7 would have failed the repo on its
   own contents, which is how a useful check gets disabled for being annoying. */

const ROOT = join(import.meta.dir, "..", "..");
const overlays = readdirSync(join(ROOT, "overlays"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

describe("every shipped Flow obeys the authoring rules", () => {
  for (const name of overlays) {
    test(`${name}/FLOW.md`, () => {
      const p = join(ROOT, "overlays", name, "flows", name, "FLOW.md");
      expect(checkFlowRules(readFileSync(p, "utf8"))).toEqual([]);
    });
  }

  test("the loop actually found the overlays", () => {
    // A for-loop over an empty list is a green suite that tested nothing.
    expect(overlays.length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Run it**

Run: `cd engine && bun test tests/shipped-flows.test.ts`
Expected: PASS for all three. Any failure means a task 4 to 7 file is not
actually compliant. Fix the FILE, never the rule.

**One exception, and only one: `superpowers`.** See Task 7 Step 2a. It is the reference
implementation whose behaviour this cycle is trying to copy, so a rule that flags it is
evidence against the rule before it is evidence against the file. For `growth-marketing` and
`ultra-powers` the instruction above holds without exception.

- [ ] **Step 3: Commit**

```bash
git add engine/tests/shipped-flows.test.ts
git commit -m "test(rules): enforce authoring rules on every shipped Flow"
```

---

## Task 9: Born-compliant template and scaffold

**Files:**
- Modify: `engine/templates/flow-standard/FLOW.md`
- Modify: `engine/tools/scaffold-flow.mjs`
- Test: `engine/tests/flow-rules.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
test("the shipped template passes its own rules", () => {
  // A template that violates the standard teaches every new Flow to violate it.
  const p = join(import.meta.dir, "..", "templates", "flow-standard", "FLOW.md");
  expect(checkFlowRules(readFileSync(p, "utf8"))).toEqual([]);
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `cd engine && bun test tests/flow-rules.test.ts`
Expected: FAIL, listing the template's violations.

- [ ] **Step 3: Update the template**

Give it `## Routing` first, one example route in the form
`- about to X? → invoke example-plugin:example-skill   gate: the artifact`, the
commanding rule paragraph from Task 4 Step 2, a drift clause, and
`answer only; no files change` as the advisory branch.

- [ ] **Step 4: Verify the scaffold emits a compliant Flow**

```bash
cd engine && node tools/scaffold-flow.mjs /tmp/scaffold-check demo && bun -e 'import {checkFlowRules} from "./tools/flow-rules.mjs";import {readFileSync} from "node:fs";console.log(checkFlowRules(readFileSync("/tmp/scaffold-check/flows/demo/FLOW.md","utf8")).join("\n")||"CLEAN")'
```

Expected: `CLEAN`. If the scaffold writes its own FLOW.md rather than copying
the template, update it so the two cannot drift.

- [ ] **Step 5: Run the suite and commit**

```bash
cd engine && bun test && cd ..
git add engine/templates/flow-standard/FLOW.md engine/tools/scaffold-flow.mjs engine/tests/flow-rules.test.ts
git commit -m "feat(standard): new Flows are born compliant"
```

---

## Task 10: The banner clause. LAST, and separable.

**Files:**
- Modify: `engine/hooks/flowy-inject.sh`
- Test: `engine/tests/flowy-inject.test.ts`

**This is the least evidence-backed change in the set.** The banner is
byte-identical for the Flow that fires and the Flow that does not. It ships
because the founder asked for it. It is a standalone commit so it can be
reverted without touching the FLOW.md work, and it is the FIRST thing to revert
if firing gets noisy.

- [ ] **Step 1: Write the failing test**

```typescript
test("the banner names a matched-trigger-without-invoke as a violation", () => {
  const out = runHook(activeState());
  expect(out).toContain("matched a trigger and did not invoke");
});

test("the banner is still ONE line", () => {
  // Non-negotiable. A split banner is a different contract.
  const banner = runHook(activeState()).split("\n").filter((l) => l.startsWith("⚑"));
  expect(banner.length).toBe(1);
});
```

- [ ] **Step 2: Run and watch the first fail, the second pass**

Run: `cd engine && bun test tests/flowy-inject.test.ts`
Expected: the violation test FAILS, the one-line test PASSES.

- [ ] **Step 3: Edit the banner by ANCHOR STRING**

Anchor on `Printing a YES you did not invoke is a VIOLATION, not compliance.`
and extend that sentence in place:

```
Printing a YES you did not invoke is a VIOLATION, not compliance; so is producing the artifact when you matched a trigger and did not invoke.
```

Do not add a line. Do not touch `flowy_plugins_base`.

- [ ] **Step 4: Run and watch both pass, then check the size**

```bash
cd engine && bun test tests/flowy-inject.test.ts
```

Expected: PASS. The banner grows by roughly 90 bytes on every prompt of every
session. If a test asserts a byte ceiling, respect it rather than raising it.

- [ ] **Step 5: Commit**

```bash
git add engine/hooks/flowy-inject.sh engine/tests/flowy-inject.test.ts
git commit -m "feat(banner): name producing-without-invoking as a violation

Least evidence-backed change in the authoring-rules cycle, and deliberately a
standalone commit. The banner is byte-identical for the Flow that fires at 97%
and the one that does not, so it is not a cause. Revert this first if firing
gets noisy."
```

---

## Task 11: Release

**Files:**
- Modify: `engine/.claude-plugin/plugin.json`, `engine/package.json`, overlay `plugin.json` files

- [ ] **Step 1: Bump the versions**

Content-only overlay changes are a MINOR bump. `version-consistency.test.ts`
enforces that engine and overlay versions agree, and that overlays pin the
engine with a caret on 1.x so a minor never strands the fleet.

- [ ] **Step 2: Run the whole suite**

```bash
cd engine && bun test
```

Expected: 0 fail. The Windows symlink SKIP lines are the documented
Developer-Mode limit and are not failures.

- [ ] **Step 3: Commit and push**

```bash
git add -A && git commit -m "chore(release): flow authoring rules" && git push
```

- [ ] **Step 4: Reinstall locally and re-activate**

```
/plugin update flowy-core
/flowy:growth-marketing
```

Then confirm the ⚑ banner is present and that `FLOW.md` resolves.

- [ ] **Step 5: Measure both dials with the harness that already exists**

`experiments/auto-invocation/{extract,judge,score,precision}.mjs` in the marketplace repo, 16
tests green, merged at `18a3b2a`. Re-point `extract.mjs`'s banner detector at the
`growth-marketing` banner. That is the whole cost. Nothing in `judge.mjs`, `score.mjs` or
`precision.mjs` is Flow-specific.

Score the window defined in the spec's expected-effect table, and score **both** dials.
`docs/handoffs/2026-07-12-auto-invocation-firing-precision-and-overlay-context.md` names this
cycle as its ranked next step and states the win condition: net correct firing up, precision does
not crater. Firing alone is not a result. Precision must not fall below **88%**, the conservative
bound of the prior band, or the cycle is reverted starting with the banner clause.

The founder's recorded decision (`docs/OPEN-WORK.md` section 8) is "do not BUILD one". Reusing
the one that exists is not building one.

---

## What is deliberately NOT in this plan

Recorded so a later reader does not think it was forgotten.

- **BUILDING a firing-rate harness. One already exists, and Task 11 Step 5 reuses it.** An
  earlier draft of this line said "any firing-rate harness" was out of scope because the founder
  "declined one". The instrument is `experiments/auto-invocation/{extract,judge,score,precision}.mjs`
  in the marketplace repo, 16 tests green, merged at `18a3b2a`. The recorded decision in
  `docs/OPEN-WORK.md` section 8 is "do not BUILD one", which is not "do not measure". Re-pointing
  `extract.mjs`'s banner detector is the entire cost, and the 2026-07-12 handoff requires firing
  and precision to be measured together because they trade against each other.
- **`REINJECT_N` cadence changes.** Worth having, unmeasured, and changing it alongside the content would confound both.
- **The activator** (`engine/skills/_activator/SKILL.md`). Already carries receipt-not-promise; not implicated by the differential.
- **Adding or removing skills from a Flow's curation.** This is a routing change, not a curation change. The only removals permitted are names that cannot be given a trigger (R1).
- **A check for R2 (trigger style) or R7 (register).** Judgment calls. A check pretending to cover them would be a test that can never fail.
