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
4. **The Flow Standard**: `templates/flow-standard/FLOW.md`, `engine/tools/validate-flow.mjs`,
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

1. Validator checks, written but not yet enforced, plus their tests
2. `growth-marketing` FLOW.md and compact
3. `ultra-powers` FLOW.md and compact
4. `superpowers` FLOW.md
5. Turn validator enforcement on; it must now pass on all three
6. Template and scaffold
7. Banner clause, last and separable

## Expected effect, per defect

The founder measures firing in real usage; no harness is built. Recording the expected effect
per defect is what makes that measurement mean something afterwards.

| Defect fixed | Expected observable |
|---|---|
| #1 routes for the 40 orphans | SEO and channel skills (`ai-seo`, `programmatic-seo`, `schema`, `site-architecture`, `social`, `emails`, `analytics`) begin firing at all. Currently a floor of zero |
| #2 state-based triggers | skills fire on paraphrased requests, not only on near-verbatim ones |
| #3 verbs | fewer "named the skill, then did the work myself" turns |
| #4 narrowed advisory | fewer advisory answers that should have been invocations |
| #5, #6 | no direct firing effect; they remove ambiguity and a false claim |

**Counter-signal to watch:** false fires. If plain questions start invoking marketing skills, the
cause is most likely R7 or the banner clause, in that order, not R1.

## Risks

- **False fires.** R1 raises 40 skills from no-trigger to triggered. The mitigation is R2: a
  state condition is narrower than a keyword, not broader.
- **Token cost.** Routing 47 skills makes `growth-marketing` FLOW.md substantially longer. FLOW.md
  is read once per session by the model, not injected per prompt, so this is a session-start cost,
  not a per-prompt one. The per-prompt cost lives in FLOW-compact.md, which stays terse by design.
- **ultra-powers is public and downloadable.** A regression there is a regression in a shipped
  artifact. It goes after growth-marketing has proven the pattern.
- **The 97% figure is the founder's observation, not an instrumented measurement.** It is used
  here as a direction, never as a baseline to claim improvement against.

## Out of scope

- Any firing-rate harness. The founder measures in real usage and previously declined one.
- `REINJECT_N` cadence changes. A knob worth having, unmeasured, and changing it at the same time
  as the content would confound both.
- The activator (`engine/skills/_activator/SKILL.md`). Already carries receipt-not-promise and is
  not implicated by the differential.
- Adding or removing skills from any Flow. This is a routing change, not a curation change.
