# Flow authoring rules: why one Flow fires and another does not (2026-07-28)

**Status:** approved, unbuilt. Plan: `docs/plans/2026-07-28-flow-authoring-rules.md`.

## Problem

The founder, across real sessions: the `growth-marketing` Flow does not invoke the SEO and
marketing skills anywhere near as often as wanted, while `superpowers` invokes at roughly 97%.

Same engine. Same hook. Same banner. Same activator. Same machine, two very different outcomes,
so **the cause is in the FLOW.md content**, and it is measurable by diffing a file that works
against a file that does not.

The founder's hypothesis was that the file is not dictatorial enough. That turns out to be the
third-largest cause at best.

## Evidence

Differential between `overlays/superpowers/flows/superpowers/FLOW.md` (fires) and
`overlays/growth-marketing/flows/growth-marketing/FLOW.md` (does not).

**First, what was ruled out.** All 7 core routed skills resolve against the installed
`marketing-skills` 2.8.12 (`customer-research`, `copywriting`, `seo-audit`, `cold-email`,
`launch`, `cro`, `ab-testing`). This is not the silent-no-op drift the superpowers FLOW.md
warns about. The routes are live; they are simply not taken.

| # | Defect | Fires | Does not fire |
|---|---|---|---|
| **1** | **Most skills have no trigger at all.** 40 of 47 sit in a passive "Additional skills (also available)" index that names them and gives no condition | every skill has a route line | an index, not routes |
| **2** | **Triggers are user-quote patterns, not agent-state conditions** | `about to write implementation code?` | `"why am I not ranking?"` |
| **3** | **No verb on the route line** | `→ invoke superpowers:brainstorming` | `→ marketing-skills:customer-research` |
| **4** | **The advisory branch licenses inlining** | `answer only; no files change` | `answer from the relevant skill's principles` |
| **5** | **Prose precedes routing** | Routing is the first section | 7 numbered Phases first |
| **6** | **Unverifiable claims, no drift clause** | has a Drift clause forbidding improvisation | claims "47 skills" while listing 45 (`marketing-council`, `marketing-loops` absent) |

### Why #1 is the answer to the founder's actual complaint

> ## ❌ MEASURED FALSE, 2026-07-29. Read this box before the argument below it.
>
> The gate was run. `marketing-skills:seo-audit` **fires**. So do the skills with no route:
> across three single-turn `claude -p` probes with `growth-marketing` active, real `Skill`
> `tool_use` events were observed for **`ai-seo`**, **`schema`**, **`content-strategy`** and
> **`product-marketing`** — four skills that appear ONLY in the passive index, with no route
> line, no trigger and no verb. In that sample they fired MORE often than the routed ones.
>
> **So the paragraph below is wrong on its central claim.** "There is no trigger to match" is
> not what the model does with a passive index: it reads the FLOW.md, finds the name, and
> invokes it. A missing route is not what stops a skill firing, so adding 40 routes is not
> what will start them.
>
> The reasoning error is worth naming, because it is subtle and this document made it
> confidently: **defect #1 was inferred from a two-file diff and never tested against a
> control.** The gate that was supposed to test it had only a positive branch. Full
> measurement, method and limits: the GATE ANSWER section of
> `docs/plans/2026-07-28-flow-authoring-rules.md`.
>
> R1 survives as an **authoring discipline** (a skill worth naming is worth a condition), not
> as a firing remedy. Kept below unedited, because a spec that quietly rewrites its own
> disproved argument teaches nothing.

The complaint was specifically about SEO. `seo-audit` is the **only** SEO skill with a route.
`ai-seo`, `programmatic-seo`, `schema`, and `site-architecture` appear only in the passive
index, under a sentence telling the agent to "fire any as `marketing-skills:<name>` when its
trigger matches" **without ever stating a trigger**.

There is no trigger to match. No amount of additional sternness fixes a missing route.

### Why #2 is the second-largest

An agent-state trigger (`about to write page copy?`) is checkable on every turn regardless of
how the user phrased the request. A user-quote trigger (`"write/rewrite the homepage"`) fires
only when the phrasing is close to verbatim. "Let's improve the landing page" matches the state
condition and misses the quote.

### Why #3 is a known failure mode, already diagnosed once

`2026-07-25-receipt-not-promise.md` found that the banner asked for a written commitment and an
action, and the model discharged the obligation by writing the line. A route line that names a
noun is a reference. A route line that names a verb is an instruction. **Same defect class, one
layer down**, and it was fixed in the banner while the FLOW.md files were left alone.

### Three confounders this differential does not control for

The six defects above are observed facts about the two files. The causal claim built on them, that
defect #1 is why SEO skills do not fire, is not established by a two-file comparison. Three
specific alternatives are live, and none of them is ruled out.

**1. `ultra-powers` is a free third data point, and the differential never consults it.** Run the
rule engine over all three shipped Flows and the counts are `growth-marketing` **54**,
`superpowers` **1**, `ultra-powers` **56**.

> **RE-DERIVED 2026-07-29.** This paragraph first said 17 / 2 / 56. Those numbers came from the
> rule engine BEFORE the ce:review remediation, and that engine was CRLF-broken and blind to the
> bare-slug form the real passive index uses, so it was undercounting the file the whole standard
> was derived from. Re-measured after the fix: **54 / 1 / 56**. The argument below survives, and
> gets sharper: growth-marketing and ultra-powers are now within two errors of each other, so
> defect COUNT plainly does not separate the Flow that fires from the one that does not. A number
> derived from a broken instrument is not evidence, which is the same lesson this cycle learned
> three other ways.

The differential compares the best file to the worst
and reads the gap as cause. `ultra-powers` and `growth-marketing` now carry **almost identical**
defect counts, so if defect density is what predicts firing, they should fire about the same.
Nobody has looked. A two-point comparison cannot separate "defect count" from
every other difference between two files: different domain, different skill counts, different
upstream plugin, different work the founder actually does in each. The third point is installed,
in daily use, and is the natural control. Consult it before treating the gap as causal.

**2. The SEO skills may be losing a namespace contest, not missing a trigger.** `claude-seo` is
installed and ships **19** SEO skills (`seo`, `seo-audit`, `seo-backlinks`, `seo-competitor-pages`,
`seo-content`, `seo-dataforseo`, `seo-geo`, `seo-google`, `seo-hreflang`, `seo-image-gen`,
`seo-images`, `seo-local`, `seo-maps`, `seo-page`, `seo-plan`, `seo-programmatic`, `seo-schema`,
`seo-sitemap`, `seo-technical`). The founder's own
`overlays/ultra-powers/flows/ultra-powers/FLOW.md` line 16 states the resolution:
**"`claude-seo` owns SEO execution; `marketing-skills` owns GTM."** That is a routing document in
the fleet assigning SEO execution AWAY from the exact skills the complaint is about.
`growth-marketing` has **no disambiguation section at all**, so on an SEO turn the agent sees two
namespaces competing and one document in the fleet naming the winner, and the winner is not
`marketing-skills`. This is fully consistent with the founder's observation and R1 does not touch
it. The fix it implies is a disambiguation section in `growth-marketing` stating which namespace
owns SEO, which this spec does not currently mandate.

**3. The ~90% figure is PRECISION. The complaint is RECALL. They are not commensurable.** The
measured ~88% to ~92% answers "when Flowy auto-fires, is it the right skill?". The founder's
complaint, and every row of the expected-effect table, is "does it fire often enough?". Precision
cannot be used as a baseline for recall, and improving recall mechanically pressures precision
downward. Worse, there is currently **no recall baseline at all**: the 2026-07-12 work found that
per-turn correctness recall was the wrong model for skills that fire once and govern many turns,
read ~10% as an artifact, and suppressed it (`DIAGNOSIS.md`, root causes RC1 to RC4). So any
"firing improved" claim needs a recall number defined and measured the same way before and after.
Neither exists yet. Do not net one against the other.

## Decisions

Seven authoring rules become part of the Flow Standard. R1 to R6 are corrections; R7 is the
founder's requested register.

- **R1. Every skill NAMED in a Flow has a route line with a trigger.** A skill worth naming is
  worth a condition. Passive indexes are banned.

  **The resolution of R1 is binary, and the plan must state which branch each skill takes:**
  either the skill gets a real state-based trigger, or its name is removed from the file. There
  is no third option where it stays listed without a trigger, because that is the defect. A
  skill removed from a Flow is still installed and still invocable; it simply stops being
  advertised by a Flow that cannot say when to use it.
- **R2. Triggers are agent-state conditions, never user quotes.** Phrase as "about to X?" or "X
  exists but Y does not?". A quote may appear as an *example* after the condition, never as the
  condition itself.
- **R3. Every route line carries the verb `invoke`.**
- **R4. The advisory escape is narrow and testable.** `answer only; no files change`. The phrase
  "answer from the skill's principles" and anything like it is banned: it authorises the exact
  from-memory behaviour the engine exists to stop.
- **R5. Routing is the first section after the header.** Phases, disambiguation, and attribution
  follow it.
- **R6. No unverifiable claims, and a drift clause is mandatory.** A stated count must match what
  the file lists. A route whose target no longer exists is a Flow to fix, never licence to
  substitute a nearby-sounding skill.
- **R7. Imperative register, with the violation named.** The routing header states that producing
  the artifact without a prior invoke is a violation, in the same vocabulary the banner already
  uses. This is the founder's "a lil bit more dictatorial and commanding", applied as *precision
  about what counts as failure* rather than as volume.

**On R7 and volume:** 0.3.0 was already a "dictatorial MANDATORY framing" pass and still failed.
Emphasis is the lever that has already been pulled. R7 is scoped to naming the violation, not to
being louder.

## What is mechanically checkable, and what is not

Stated explicitly so the validator is not mistaken for full coverage.

| Rule | `validate-flow.mjs` | Why |
|---|---|---|
| R1 | **yes** | every `<ns>:<skill>` reference must appear in at least one route line |
| R3 | **yes** | route lines must match the verb form |
| R5 | **yes** | section order is structural |
| R6 (count) | **yes** | a claimed count is compared to what is listed |
| R4 | **yes, partially** | the banned phrases are a fixed list and can be grepped. **Upgraded during spec review**: R4 was called a review-only rule when the design was approved. It is partially mechanical, because "answer from the skill's principles" and its variants are a finite denylist. The denylist catches known phrasings only; a new way of saying the same thing passes, so this is a floor, not coverage |
| R2 | **no** | trigger *style* is a judgment call. Review rule, documented in the standard |
| R6 (drift clause) | **yes** | presence check only; wording is a review rule |
| R7 | **no** | register is a judgment call |

A validator that claimed to check R2 would be the "test that can never fail" pattern this repo
has already had to delete once.

## Scope

Founder-selected, all four surfaces.

1. **`growth-marketing`** FLOW.md and FLOW-compact.md. The failing file. All 47 installed skills
   get an R1 verdict: a trigger, or removal from the file. **`marketing-council` and
   `marketing-loops` are installed but named nowhere**, so they take the R1 decision from the
   opposite direction: route them or leave them unnamed, deliberately, not by omission.
2. **`ultra-powers`** FLOW.md and FLOW-compact.md. ~40 distinct skills across 125 route
   references, and the public downloadable Flow, so the largest blast radius.
3. **`superpowers`** FLOW.md. Already largely compliant; needs the sweep, not a rewrite.
4. **The Flow Standard**: `engine/templates/flow-standard/FLOW.md`, `engine/tools/validate-flow.mjs`,
   `engine/tools/scaffold-flow.mjs`, so a new Flow is born compliant and CI rejects one that is
   not.
5. **The banner**: one added clause. See the caveat below.

### The banner caveat, stated so it is the first thing reverted

**The banner is not a cause of any of the six defects.** It is byte-identical for the Flow that
fires and the Flow that does not, and it already carries receipt-not-promise. The genuine
hook-path fix is `FLOW-compact.md`, because that is what the every-N-prompt refresh re-injects,
and it carries the same defects as its parent.

The banner change ships because the founder asked for it, and the spec records that it is **the
least evidence-backed change in the set**. If firing gets noisy or advisory questions start
triggering skills, revert the banner clause first, before touching the FLOW.md rewrites.

Constraints that survive unchanged: the banner stays ONE line, the hook stays fail-loud and
never fail-closed, and `flowy_plugins_base` containment is not touched.

## Sequencing

The validator must land **with or after** the file fixes. Landing it first fails the repo on its
own contents, which is how a useful check gets disabled for being annoying.

### GATE, blocking the growth-marketing rewrite — ANSWERED 2026-07-29, and the gate was malformed

**Result: `seo-audit` fires. Unrouted skills fire too.** Neither branch below applies, because
both were written assuming unrouted skills do not fire. Disposition and method:
`docs/plans/2026-07-28-flow-authoring-rules.md`, GATE ANSWER section.

**The lesson about the gate itself, which is the more reusable half.** This gate cost one
observation and would have returned the WRONG verdict, because it specified only the positive
case. "Does the routed skill fire?" has a yes-branch that reads as confirmation, and the
confirmation is worthless without asking whether the unrouted ones fire too. **A gate that can
only confirm is not a gate.** Every future one states its control in the same breath as its
test.

Kept unedited below as the original specification.

**Answer this before the rewrite starts: does the already-routed `marketing-skills:seo-audit`
actually fire?**

It is the one SEO skill that already has a route, a trigger and a verb. It is the control the
whole missing-route theory rests on, and it costs one observation.

- **If it fires**, the missing-route theory holds: routed SEO skills fire, unrouted ones do not,
  and the difference between them is the route. Proceed with the rewrite as specified.
- **If it does NOT fire**, a missing route explains nothing. The skill with a route behaves the
  same as the 40 without one, so R1 cannot be the cause and adding 40 routes is 40 more routes
  that also will not fire. In that case the namespace contest in confounder 2 is the leading
  explanation and the real fix is a **disambiguation section** in `growth-marketing`, not routes.

This gate is on plan Task 4. Do not start the rewrite with it unanswered.

1. Validator checks, written but not yet enforced, plus their tests
2. `growth-marketing` FLOW.md and compact
3. `ultra-powers` FLOW.md and compact
4. `superpowers` FLOW.md
5. Turn validator enforcement on; it must now pass on all three
6. Template and scaffold
7. Banner clause, last and separable

## Expected effect, per defect

Every row below carries a **threshold, a denominator and a window**, so every row can come out
false. An earlier draft stated directional effects ("begin firing at all", "fewer turns") that no
observation could contradict, which is a prediction that costs nothing to make and proves nothing
when it holds.

**The window** is the first 20 qualifying turns after the rewritten `growth-marketing` Flow is
active. A **marketing turn** is one whose subject is copy, a channel, a converting surface,
pricing, a launch, or a growth metric, classified before the invocation is looked at, not after.
That classification is the denominator; state it before scoring, or the measurement is a
post-hoc.

| Defect fixed | Falsifiable prediction |
|---|---|
| #1 routes for the 40 orphans | Of the 20 marketing turns, **at least 8** invoke a `marketing-skills` skill that has NO route today (`ai-seo`, `programmatic-seo`, `schema`, `site-architecture`, `social`, `emails`, `analytics` and the rest of the 40). Fewer than 4 falsifies #1 as the primary cause and points at the namespace confounder below |
| #2 state-based triggers | Of the 20, **at least 10** of the turns phrased WITHOUT wording close to the old quote triggers invoke a marketing skill. If paraphrased turns still miss at the old rate, R2 did nothing |
| #3 verbs | Across the same 20, **at most 2** turns name a skill in the reply and then do the work without invoking it. This is the receipt-not-promise defect and it is countable per turn |
| #4 narrowed advisory | Across the same 20, **zero** replies substitute "the skill's principles", or any equivalent, for an invocation. One occurrence falsifies the denylist as sufficient |
| #5, #6 | **No firing prediction.** They remove ambiguity and a false claim. They are falsified by the validator failing on a shipped Flow, nowhere else |
| ALL, precision counter-measure | Firing precision over the same 20 turns **does not fall below 88%**, the conservative bound of the prior measured band. A firing gain bought with a precision fall below 88% is a REGRESSION and the cycle is reverted, starting with the banner clause |

**On the counter-signal.** An earlier draft said that if plain questions start invoking marketing
skills, the cause is "most likely R7 or the banner clause, in that order, not R1". That sentence
assigned the only disconfirming observation to two other causes before a single observation had
been made, which made R1 unfalsifiable by construction. It is deleted. **R1 and R2 are the
leading suspects for a false fire**, because they are what raise 40 skills from unmatched to
matched and widen every trigger while doing it. Attribution is decided by which turns fired and
against which triggers, not in advance.

## Risks

- **False fires. R2 AMPLIFIES this risk. It does not mitigate it.** R1 raises 40 skills from
  no-trigger to triggered, and R2 makes every one of those triggers match a SUPERSET of what a
  user-quote trigger would have matched. That superset is the stated benefit two sections up:
  "Let's improve the landing page" matches the state condition and misses the quote. Breadth cuts
  both ways. The same condition that catches the paraphrase also catches turns where no marketing
  skill was wanted. An earlier draft of this document claimed a state condition is "narrower than
  a keyword" and offered that as the mitigation. It is not narrower, and the Evidence section
  says the opposite. Phrasing cannot mitigate what phrasing causes.

  **The real mitigation is measurement, not phrasing.** Run the precision half of the existing
  harness alongside the firing half, and treat a firing gain bought with a precision fall as a
  regression. See "Out of scope" below: the harness already exists.
- **Token cost.** Routing 47 skills makes `growth-marketing` FLOW.md substantially longer. FLOW.md
  is read once per session by the model, not injected per prompt, so this is a session-start cost,
  not a per-prompt one. The per-prompt cost lives in FLOW-compact.md, which stays terse by design.
- **ultra-powers is public and downloadable.** A regression there is a regression in a shipped
  artifact. It goes after growth-marketing has proven the pattern.
- **The 97% figure is the founder's observation, not an instrumented measurement.** It is used
  here as a direction, never as a baseline to claim improvement against.

## Out of scope

- **BUILDING a firing-rate harness. One already exists, so this is a reuse, not a build.** An
  earlier draft said "any firing-rate harness" was out of scope because the founder "previously
  declined one". That misstates the decision on both halves.

  **The instrument exists.** `experiments/auto-invocation/{extract,judge,score,precision}.mjs` in
  the marketplace repo, with `*.test.mjs`, 16 tests green under `bun test`, merged at commit
  `18a3b2a` ("feat(auto-invocation): firing-precision harness + honest ~90% result (Phase 1)").
  `catalog.json` is the skill catalog the judge sees. The recorded founder decision, in
  `docs/OPEN-WORK.md` section 8, is **"do not BUILD one"**. Not building a second harness and not
  measuring are different commitments, and only the first one was made.

  **The cost of using it here is re-pointing one detector.** `extract.mjs` finds the routing
  banner to segment a transcript into turns; it is pointed at the superpowers-era banner. Pointing
  it at the `growth-marketing` banner is the entire change. Nothing else in `judge.mjs`,
  `score.mjs` or `precision.mjs` is Flow-specific.

  **Firing and precision trade against each other, so both must be measured.**
  `docs/handoffs/2026-07-12-auto-invocation-firing-precision-and-overlay-context.md` records this
  cycle as its own "next, ranked" item 1, the dictator-language experiment, and states the win
  condition: net correct firing up, precision does not crater, **measure BOTH dials with this
  harness**. It also records the prior result: activation on roughly 1 prompt in 4, precision
  ~88% (sonnet judge, conservative) to ~92% (opus peer-judge plus founder review), n=25, one
  person's sessions, a known auto/manual classifier bug. Internal-grade, never quoted publicly.
  Measuring firing alone would let a precision collapse read as a success, which is the exact
  failure this cycle's own R2 risk describes.
- `REINJECT_N` cadence changes. A knob worth having, unmeasured, and changing it at the same time
  as the content would confound both.
- The activator (`engine/skills/_activator/SKILL.md`). Already carries receipt-not-promise and is
  not implicated by the differential.
- Adding or removing skills from any Flow. This is a routing change, not a curation change.
