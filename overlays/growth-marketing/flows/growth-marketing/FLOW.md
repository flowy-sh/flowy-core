# FLOW.md: Growth Marketing

> Grow a product across the funnel, from customer research to a measured experiment, firing the right marketing skill per intent and refusing to call a result a win until a number moves.

> Skills by Corey Haines (the `marketing-skills` plugin, MIT — install separately). Routing by Flowy. See ATTRIBUTION.md.

<!-- Thin overlay. The Flowy engine supplies the universal contract (announce, READ/invoke,
     host-wins, post-compaction re-read). This file carries the funnel spine + per-intent
     routing; every route target is a skill in the SEPARATELY-INSTALLED marketing-skills
     plugin, fired as `marketing-skills:<skill>` via the Skill tool. Record each gate's
     artifact before moving on. -->

## Routing

**The rule. MANDATORY, not advisory.** When a trigger below matches, INVOKE the named skill with
the Skill tool BEFORE producing anything. Do not draft the copy, the audit, the sequence, the
plan, or the post first and invoke afterwards. **Producing the artifact when a trigger matched
and you did not invoke is a VIOLATION, not a shortcut.** Naming the skill in your reply is not
invoking it: invoking means an actual Skill tool call you can point at.

All **47** installed skills are routed below. Every one carries a state-based trigger, because a
skill worth naming is worth a condition, and a name without a condition is an index entry with
nothing to match against.

```
USER MESSAGE
  │
  ├─ INTAKE. Nothing downstream is trustworthy without these. Check BOTH first.
  │    ├─ no positioning doc exists for this product yet?      → invoke marketing-skills:product-marketing    gate: .agents/product-marketing.md written
  │    └─ no research brief exists for this audience yet?      → invoke marketing-skills:customer-research     gate: 3 pains + 5 verbatim quotes
  │
  ├─ WORDS. About to write or change words a user will read.
  │    ├─ about to write page, landing, or feature copy?       → invoke marketing-skills:copywriting           gate: headline + subhead + 1 CTA, each tied to a quote
  │    ├─ copy already exists and needs tightening?            → invoke marketing-skills:copy-editing          gate: a redline against the original
  │    ├─ about to define what is actually being sold?         → invoke marketing-skills:offers                gate: the offer stated with its risk reversal
  │    └─ about to apply persuasion or social proof?           → invoke marketing-skills:marketing-psychology  gate: the principle named, and honestly applied
  │
  ├─ SEARCH. About to change how the site gets found. All five are DISTINCT, see Disambiguation.
  │    ├─ rankings flat or dropping and the cause is unknown?  → invoke marketing-skills:seo-audit             gate: top 5 fixes, each tagged with its keyword or page
  │    ├─ about to optimise for LLM citation or AI answers?    → invoke marketing-skills:ai-seo                gate: a citable-passage plan per target query
  │    ├─ about to generate pages at scale from a dataset?     → invoke marketing-skills:programmatic-seo      gate: template + data source + the dedup rule
  │    ├─ about to add or change structured data?              → invoke marketing-skills:schema                gate: the JSON-LD type and its required fields
  │    └─ about to change URLs, nav, or internal linking?      → invoke marketing-skills:site-architecture     gate: before/after tree with the canonical rule
  │
  ├─ OUTBOUND. About to contact people who did not ask.
  │    ├─ about to write B2B outbound to named prospects?      → invoke marketing-skills:cold-email            gate: first touch + 2 follow-ups + a per-prospect signal
  │    ├─ no qualified list exists to send to yet?             → invoke marketing-skills:prospecting           gate: the qualifying criteria, written
  │    └─ about to pitch press or a journalist?                → invoke marketing-skills:public-relations      gate: the angle, and why it is news NOW
  │
  ├─ PAID. About to spend money on attention.
  │    ├─ about to plan or change a paid campaign?             → invoke marketing-skills:ads                   gate: audience + budget + the kill metric
  │    └─ about to produce or iterate ad creative?             → invoke marketing-skills:ad-creative           gate: 3 variants against ONE hypothesis
  │
  ├─ BORROWED AUDIENCE. Reaching people someone else gathered.
  │    ├─ about to submit to directories or listing sites?     → invoke marketing-skills:directory-submissions gate: the per-site description variants
  │    ├─ about to partner for a shared audience?              → invoke marketing-skills:co-marketing          gate: what each side gives and gets
  │    ├─ about to post into a community you did not build?    → invoke marketing-skills:community-marketing   gate: the 90/10 contribution record
  │    ├─ about to ask existing users to bring others?         → invoke marketing-skills:referrals             gate: the two-sided incentive
  │    └─ about to write or fix an app-store listing?          → invoke marketing-skills:aso                   gate: title, subtitle, keyword set
  │
  ├─ CONTENT AND CHANNELS. About to decide what to say, or where.
  │    ├─ no topic plan exists, or picking what to write next? → invoke marketing-skills:content-strategy      gate: topics tied to funnel stage
  │    ├─ about to write a social post or thread?              → invoke marketing-skills:social                gate: the hook and the ONE idea
  │    ├─ about to write an email sequence or campaign?        → invoke marketing-skills:emails                gate: subject, one CTA, the segment
  │    ├─ about to send SMS or MMS?                            → invoke marketing-skills:sms                   gate: the consent basis + the single CTA
  │    ├─ about to script or produce video?                    → invoke marketing-skills:video                 gate: the first 3 seconds, written
  │    └─ about to brief or generate a marketing image?        → invoke marketing-skills:image                 gate: the message the image has to carry
  │
  ├─ CONVERSION. A surface exists, or is about to, and has to convert.
  │    ├─ a live page underperforms and you are about to edit? → invoke marketing-skills:cro                   gate: top 3 blockers ranked, each with a fix
  │    ├─ about to design or change signup or trial start?     → invoke marketing-skills:signup                gate: the field list, and why each survives
  │    ├─ about to change post-signup activation?              → invoke marketing-skills:onboarding            gate: the activation moment, named
  │    ├─ about to gate a feature behind payment?              → invoke marketing-skills:paywalls              gate: what stays free, and why
  │    ├─ about to add a popup, modal, or banner?              → invoke marketing-skills:popups                gate: trigger, frequency cap, exit
  │    ├─ about to build something that captures emails?       → invoke marketing-skills:lead-magnets          gate: the promise and the capture
  │    └─ about to build a free tool for acquisition?          → invoke marketing-skills:free-tools            gate: standalone value + the path to the product
  │
  ├─ PRICE, PLAN, POSITION.
  │    ├─ about to set or change price, tiers, or packaging?   → invoke marketing-skills:pricing               gate: the value metric
  │    ├─ about to plan a quarter, a budget, or channels?      → invoke marketing-skills:marketing-plan        gate: channels with owners and numbers
  │    ├─ out of ideas for the next growth move?               → invoke marketing-skills:marketing-ideas       gate: a ranked shortlist
  │    ├─ about to design a compounding, repeatable loop?      → invoke marketing-skills:marketing-loops       gate: the loop drawn, with its cycle time
  │    ├─ about to research a NAMED rival?                     → invoke marketing-skills:competitor-profiling  gate: a profile from primary sources
  │    ├─ about to build a vs / alternative PAGE?              → invoke marketing-skills:competitors           gate: the claim, sourced
  │    ├─ about to arm sales with material?                    → invoke marketing-skills:sales-enablement      gate: the objection list, with answers
  │    └─ want several expert lenses on one decision?          → invoke marketing-skills:marketing-council     gate: the decision restated, dissent recorded
  │
  ├─ LAUNCH.
  │    └─ about to ship or announce something publicly?        → invoke marketing-skills:launch                gate: dated channel checklist + one owned-channel capture
  │
  ├─ MEASURE AND KEEP.
  │    ├─ about to define, read, or trust a growth number?     → invoke marketing-skills:analytics             gate: the metric defined, with its source
  │    ├─ about to change the funnel model or lead lifecycle?  → invoke marketing-skills:revops                gate: the stage definitions
  │    └─ about to address churn, cancels, or failed payments? → invoke marketing-skills:churn-prevention      gate: the churn reason, evidenced
  │
  ├─ DONE-CHECK. Before ANY "this worked / converts better / is an improvement" claim.
  │    └─ about to claim a change won?                         → invoke marketing-skills:ab-testing            gate: hypothesis + primary metric + measured baseline + pre-computed sample size. No win is claimed before significance.
  │
  ├─ SCOPE CHANGE. Audience, product, or offer changed mid-stream.
  │    └─ re-enter INTAKE. A stale positioning doc or research brief invalidates every asset built on it.
  │
  ├─ BLOCKED. A gate needs an input you do not have.
  │    └─ name the missing input and the resume condition, then stop. Never fabricate the artifact to keep moving.
  │
  └─ ADVISORY. A question was asked and no artifact is being produced.
       └─ answer only; no files change.
```

**Drift:** every route targets `marketing-skills:<slug>` in the separately installed
marketing-skills plugin. If a slug no longer resolves there, that route is a silent no-op. Never
substitute a nearby-sounding skill. A broken route means this Flow needs an update, not that you
may improvise.

## Priority on collision

Top-down. 1. **Blocked** beats everything: never fabricate a gate artifact. 2. **Scope changed**,
re-enter INTAKE before building on a stale brief. 3. **Done-check**, `ab-testing` before any claim
that something worked. 4. **Intake** before any asset. 5. Otherwise funnel order as listed.
6. **Advisory** only when no file changes.

## Disambiguation

**The five SEARCH skills are not interchangeable.** `seo-audit` DIAGNOSES an existing site
(rankings flat, cause unknown). `ai-seo` targets LLM citation, a different corpus and a different
unit (a citable passage, not a ranking page). `programmatic-seo` generates pages at scale from a
dataset. `schema` is structured data only. `site-architecture` is URL, nav and internal-link
shape. Diagnose first, then pick the specific one; do not fire `seo-audit` for work whose shape
you already know.

**If the claude-seo plugin is also installed you have two SEO namespaces in one session.** Under
THIS Flow, marketing-skills owns SEO execution and the routes above are the ones to take. Do not
split one SEO task across both namespaces. (Deliberately written without backticks: a backticked
bare slug reads as a routed skill to the rule engine, and this one must NOT be routed here.)

**Copy trio.** `copywriting` writes new copy. `copy-editing` improves copy that exists. `offers`
defines what is being sold, which sits upstream of both and is often the real problem when copy
"is not working".

**Conversion set.** `cro` is the DIAGNOSIS skill for a live underperforming page. `signup`,
`onboarding`, `paywalls` and `popups` are specific surfaces. Fire `cro` when the problem is "this
page does not convert"; fire the specific one when you already know which surface changes.

**Competitors.** `competitor-profiling` RESEARCHES a rival. `competitors` builds a public
comparison PAGE. Research before publishing a claim.

**`ab-testing` is the done-gate, not a channel.** It has no twin here, and it is the only thing
that turns "I changed it" into "it worked".

## Phases

Intake (product-marketing, then customer-research) → Words → Search / Outbound / Paid / Borrowed
→ Content → Conversion → Price-plan-position → Launch → Measure → Done-check (ab-testing).

Each phase exits on its gate artifact and later phases read it. Enter mid-funnel only when the
earlier artifacts already exist. After launch, cycle Conversion, Measure and Done-check
continuously.

**Shortcuts:** page does not convert → cro → ab-testing. New page copy → copywriting → cro.
Shipping something → launch → analytics. Question only → answer, no files change.

## You are rationalizing if you think…

- "I'll just write the copy, I know the product." → The positioning doc and the research brief are what make copy true. Invoke INTAKE.
- "This is a small tweak, not worth a skill." → Every route has a gate precisely because small tweaks are where unmeasured claims get in.
- "I'll invoke it after I draft." → Producing first IS the violation. The skill shapes the artifact; it does not review it.
- "SEO is SEO, any of the five will do." → They target different corpora and produce different artifacts. See Disambiguation.
- "The change is obviously better." → Then `ab-testing` costs nothing to run and settles it.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

- Core routed skills — `customer-research`, `copywriting`, `seo-audit`, `cold-email`, `launch`, `cro`, `ab-testing` — plus the full 47-skill set, by **Corey Haines** (https://github.com/coreyhaines31/marketingskills), MIT. Distributed as the `marketing-skills` Claude Code plugin (marketplace `marketingskills`); this overlay routes to it and bundles none of it.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
