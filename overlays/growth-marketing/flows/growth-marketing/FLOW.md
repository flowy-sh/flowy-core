# FLOW.md: Growth Marketing

> Grow a product across the funnel, from customer research to a measured experiment, firing the right marketing skill per intent and refusing to call a result a win until a number moves.

> Skills by Corey Haines (the `marketing-skills` plugin, MIT — install separately). Routing by Flowy. See ATTRIBUTION.md.

<!-- Thin overlay. The Flowy engine supplies the universal contract (announce, READ/invoke,
     host-wins, post-compaction re-read). This file carries the funnel spine + per-intent
     routing; every route target is a skill in the SEPARATELY-INSTALLED marketing-skills
     plugin, fired as `marketing-skills:<skill>` via the Skill tool. Record each gate's
     artifact before moving on. -->

## Phases

Run in funnel order. Each phase exits on a named artifact; later phases read it. You can enter mid-funnel when the earlier artifacts already exist, but never skip a gate you have not actually met.

1. **Research**: entry: a new product, audience, or "why do they buy/churn" question. Gate: a research brief listing the top 3 customer pains plus 5 or more verbatim quotes in the customer's own words.
2. **Copy**: entry: a page needs writing or rewriting. Gate: a drafted page with one primary headline, a subheadline, and one primary CTA, each grounded in a research quote.
3. **Acquisition: SEO**: entry: organic traffic is flat or a page is not ranking. Gate: an SEO audit naming the top 5 prioritized fixes, each tagged with its target keyword or page.
4. **Acquisition: outbound**: entry: you need replies from named prospects. Gate: a cold-email sequence (first touch plus 2 or more follow-ups) with a documented personalization signal per prospect.
5. **Launch**: entry: something is about to ship publicly. Gate: a launch plan with a dated channel checklist and one owned-channel capture mechanism (waitlist or email list).
6. **Optimize**: entry: a live page has traffic but is not converting. Gate: a CRO teardown naming the top 3 conversion blockers ranked by impact, each with a proposed fix.
7. **Validate**: entry: you are about to claim a change worked. Gate: an experiment design with a single hypothesis, a primary metric, a measured baseline, and a pre-computed sample size.

After launch, cycle Research, Optimize, and Validate continuously.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches, INVOKE the named `marketing-skills:<skill>` via the Skill tool BEFORE producing the asset yourself — do not draft the asset or claim 'done' until you have READ this FLOW.md and invoked every matched skill. Writing the copy, the audit, or claiming 'done' without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  │
  ├─ INTAKE (always first): classify the intent and the funnel stage before acting.
  │    └─ new product / new audience / "who is this for?" / "why do they buy or churn?"
  │         → marketing-skills:customer-research   Gate: research brief, top 3 pains + 5+ verbatim quotes. (Phase 1)
  │
  ├─ COPY: a page needs words.
  │    ├─ "write/rewrite the homepage / landing / pricing page" / "this copy is weak"
  │    │    → marketing-skills:copywriting        Gate: a draft with 1 headline + subheadline + 1 primary CTA, each tied to a quote. (Phase 2)
  │    └─ no research brief exists yet → marketing-skills:customer-research first   Gate: research brief (Phase 1) before drafting.
  │
  ├─ ACQUISITION: get traffic.
  │    ├─ "why am I not ranking?" / "SEO audit" / "organic traffic dropped"
  │    │    → marketing-skills:seo-audit          Gate: top 5 prioritized fixes, each tagged with a target keyword or page. (Phase 3)
  │    └─ "cold outreach" / "nobody replies to my emails" / "prospecting sequence"
  │         → marketing-skills:cold-email         Gate: a sequence (first touch + 2+ follow-ups) with a personalization signal per prospect. (Phase 4)
  │
  ├─ LAUNCH: something ships publicly.
  │    └─ "Product Hunt" / "feature announcement" / "go-to-market" / "we're about to ship"
  │         → marketing-skills:launch             Gate: a dated channel checklist + one owned-channel capture (waitlist or list). (Phase 5)
  │
  ├─ OPTIMIZE: a live page underperforms.
  │    └─ "this page isn't converting" / "improve conversions" / "form abandonment"
  │         → marketing-skills:cro                Gate: top 3 conversion blockers ranked by impact, each with a proposed fix. (Phase 6)
  │
  ├─ DONE-CHECK (before ANY "this worked / it converts better / it's an improvement" claim):
  │    └─ about to claim a change won → marketing-skills:ab-testing   Gate: hypothesis + primary metric + measured baseline + pre-computed sample size; no win claimed until the result clears significance. (Phase 7)
  │
  ├─ ADVISE-ONLY: the user asks you to explain or critique, not to produce an asset.
  │    └─ answer from the relevant skill's principles; do NOT run the full phase or claim a gate was met.
  │
  ├─ SCOPE CHANGE: the audience, product, or offer changed mid-stream.
  │    └─ re-enter Phase 1 (marketing-skills:customer-research); a stale research brief invalidates downstream copy and tests.
  │
  ├─ BLOCKED: a gate needs an input you do not have (no traffic, no prospect list, no analytics access).
  │    └─ name the missing input, note the resume condition, and stop; do not fabricate the artifact to move on.
  │
  ├─ REVIEW-LOOP: feedback came back on a draft or a test result.
  │    └─ re-enter that phase's skill, redline against the gate, and re-verify the artifact before shipping.
  │
  └─ DEFAULT (no branch fits): say Routing: none, ask one scoping question, do NOT guess a phase.
```

## Priority on collision

1. **Blocked**: if a gate's input is missing, stop and name it; never fabricate the artifact.
2. **Scope changed**: a new audience/product/offer re-enters Research before anything downstream.
3. **Done-check**: any "this worked" claim routes to `marketing-skills:ab-testing` first; a win is measured, not asserted.
4. **Lifecycle order**: do not start a later phase while an earlier gate it depends on is unmet.
5. **Advisory**: an explain/critique request answers from principles without running the phase.
6. **Default**: nothing fits: ask one scoping question, do not guess.

## You are rationalizing if you think…

- "Ship the copy, it reads great, skip the test." → A headline that reads great is a hypothesis, not a result. Route to `marketing-skills:ab-testing` and measure the new copy against the baseline before claiming a lift.
- "Write the page now, I already know the customer." → Memory is not a research brief. Run `marketing-skills:customer-research` for the verbatim quotes first; copy grounded in real language outconverts copy grounded in assumption.
- "Conversions went up after launch, the change worked." → Up versus what, over what sample? Without a measured baseline and a pre-computed sample size, that is noise. Done-check through `marketing-skills:ab-testing`.
- "Just blast the cold email to the whole list." → Outbound with no per-prospect personalization signal is spam and tanks reply rates. The `marketing-skills:cold-email` gate requires a documented signal per prospect.

## Additional skills (also available)

The core routing above sequences the funnel lifecycle. The full `marketing-skills` set (47 skills) is available in the installed plugin; fire any as **`marketing-skills:<name>`** when its trigger matches. Index by intent (see the installed skill's own description for the full trigger list):

- **Acquisition / traffic:** `ads`, `ad-creative`, `ai-seo`, `programmatic-seo`, `directory-submissions`, `public-relations`, `prospecting`, `co-marketing`, `community-marketing`, `referrals`
- **Conversion / on-page:** `signup`, `onboarding`, `paywalls`, `popups`, `offers`, `lead-magnets`, `free-tools`, `marketing-psychology`
- **Content / channels:** `content-strategy`, `social`, `emails`, `sms`, `video`, `image`, `copy-editing`
- **Positioning / planning:** `product-marketing` (do this FIRST — writes `.agents/product-marketing.md` the others read), `marketing-ideas`, `marketing-plan`, `pricing`, `competitors`, `competitor-profiling`, `sales-enablement`
- **Ops / measurement:** `analytics`, `revops`, `churn-prevention`, `schema`, `site-architecture`, `aso`

## Attribution

- Core routed skills — `customer-research`, `copywriting`, `seo-audit`, `cold-email`, `launch`, `cro`, `ab-testing` — plus the full 47-skill set, by **Corey Haines** (https://github.com/coreyhaines31/marketingskills), MIT. Distributed as the `marketing-skills` Claude Code plugin (marketplace `marketingskills`); this overlay routes to it and bundles none of it.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
