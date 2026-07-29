# Growth Marketing — routing refresh (compact)

Agent-state triggers. When one matches, INVOKE the skill with the Skill tool BEFORE producing the
artifact. Producing it without invoking is a VIOLATION, not a shortcut. Naming a skill is not
invoking it.

- no positioning doc for this product → `invoke marketing-skills:product-marketing` FIRST
- no research brief for this audience → `invoke marketing-skills:customer-research` FIRST (3 pains + 5 quotes)
- about to write words a user reads → `invoke marketing-skills:copywriting` (or `copy-editing`, `offers`, `marketing-psychology`)
- rankings flat, cause unknown → `invoke marketing-skills:seo-audit` · LLM citation → `ai-seo` · pages from a dataset → `programmatic-seo` · structured data → `schema` · URL/nav shape → `site-architecture`
- about to contact people who did not ask → `invoke marketing-skills:cold-email` (or `prospecting`, `public-relations`)
- about to spend on attention → `invoke marketing-skills:ads` (or `ad-creative`)
- borrowing someone else's audience → `invoke marketing-skills:directory-submissions` (or `co-marketing`, `community-marketing`, `referrals`, `aso`)
- deciding what to say or where → `invoke marketing-skills:content-strategy` (or `social`, `emails`, `sms`, `video`, `image`)
- a live surface must convert → `invoke marketing-skills:cro` (or `signup`, `onboarding`, `paywalls`, `popups`, `lead-magnets`, `free-tools`)
- price, plan, or position → `invoke marketing-skills:pricing` (or `marketing-plan`, `marketing-ideas`, `marketing-loops`, `competitor-profiling`, `competitors`, `sales-enablement`, `marketing-council`)
- about to ship publicly → `invoke marketing-skills:launch` (dated checklist + owned-channel capture)
- about to define or trust a number → `invoke marketing-skills:analytics` (or `revops`, `churn-prevention`)
- about to claim "this worked" → `invoke marketing-skills:ab-testing` FIRST (hypothesis + metric + baseline + sample size; no win before significance)

Collision: Blocked > Scope-changed (re-Intake) > Done-check (ab-testing) > Intake > funnel order > advisory.
Advisory means answer only; no files change. Never answer from a skill's principles instead of invoking it.
Drift: a slug that no longer resolves is a Flow to fix, never licence to substitute a nearby-sounding skill.
