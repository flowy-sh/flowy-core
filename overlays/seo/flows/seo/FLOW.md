# FLOW.md: SEO

> Flowy's search pipeline, from measuring to the done-check: the right SEO skill fires at each step, Flowy's gates hold at each step, and nothing is called indexed, ranked or winning until Google's own numbers say so. Built for the Flowy repository (flowy.sh) only.
> Skills by their authors under their own licenses. Routing by Flowy.

<!-- external-skills: claude-seo, openseo, marketing-skills, superpowers -->

## Routing

**The rule. MANDATORY, not advisory.** When a trigger matches, INVOKE the named skill with the Skill tool BEFORE producing anything: no audit, page, schema, plan or claim first. Producing it when a trigger matched and you did not invoke is a VIOLATION, not a shortcut, and naming a skill without calling it is not invoking.

It routes 39 skills, one owner per SEO job. Where two plugins ship a skill for the same job, one is routed here and the other is listed under "Not routed, on purpose".

```
USER MESSAGE
  ├─ NOT FLOWY. No SEO.md at the repository root.
  │    └─ say once that this Flow is Flowy's only, and route nothing from it.
  │
  ├─ MEASURE. Numbers before opinions.
  │    ├─ about to add, change or audit what is tracked (GA4 or PostHog events, UTMs, the Search Console property)? → invoke marketing-skills:analytics; gate: each metric defined with its source and what each event means
  │    └─ openseo's project context missing or stale (goals, rivals, key pages)? → invoke openseo:seo-project-setup; gate: context saved, the Search Console property linked
  │
  ├─ DIAGNOSE. Something is wrong or unknown.
  │    ├─ impressions, clicks or indexed pages moved and the cause is unknown? → invoke superpowers:systematic-debugging; gate: the root cause written with its probe before any fix; the audits below are its instruments
  │    ├─ whole-site health unknown (the default audit, free)? → invoke claude-seo:seo-audit; gate: a scored report, each top fix tied to a page class
  │    ├─ the founder wants the changes most likely to grow organic traffic, from search data, and has approved the credits? → invoke openseo:seo-audit; gate: the credit estimate he approved; each change tied to a query or a page
  │    ├─ one URL in question, any aspect? → invoke claude-seo:seo-page; gate: findings read from that URL's live HTML
  │    ├─ crawl, index, robots, canonical, rendering or Core Web Vitals in question across a page class or the site? → invoke claude-seo:seo-technical; gate: each finding with its URL and the live response
  │    ├─ pages crawled but not indexed, thin, or sounding machine-written? → invoke claude-seo:seo-content; gate: a verdict per page class, unique value on every page or noindex
  │    ├─ a page ranks for the wrong intent, or the results show another page type? → invoke claude-seo:seo-sxo; gate: the result page types named and the mismatch stated
  │    ├─ a sitemap in question (families, counts, lastmod, redirects, errors)? → invoke claude-seo:seo-sitemap; gate: every listed URL answers 200 and is indexable
  │    ├─ images in question (alt text, size, format, layout shift)? → invoke claude-seo:seo-images; gate: findings per template, not per image
  │    └─ links into Flowy in question? → invoke claude-seo:seo-backlinks; gate: referring domains with their free source named
  │
  ├─ RESEARCH. Demand and rivals. Most of it spends openseo credits: estimate, then ask.
  │    ├─ no demand data for a topic or a page class? → invoke openseo:keyword-research; gate: Search Console queries first (free); credits estimated and the founder's word given before any paid call
  │    ├─ keywords exist but no page owns each one? → invoke claude-seo:seo-cluster; gate: one page per cluster, no two pages chasing one query
  │    ├─ about to study one rival's organic footprint? → invoke openseo:competitor-analysis; gate: the founder's word on credits; every claim sourced
  │    ├─ about to map who ranks in a market? → invoke openseo:competitive-landscape; gate: the founder's word on credits; the gap list
  │    ├─ not known what people ask AI about the niche? → invoke openseo:ai-prompt-research; gate: the founder's word on credits; the prompt list
  │    └─ not known how AI answers mention Flowy? → invoke openseo:ai-visibility-audit; gate: the founder's word on credits; the few changes most likely to get Flowy cited
  │
  ├─ PLAN.
  │    ├─ about to change the SEO roadmap or its phases? → invoke claude-seo:seo-plan; gate: an amendment written beside the master plan, never its body
  │    ├─ picking what to write or build next? → invoke marketing-skills:content-strategy; gate: each topic tied to a query with measured demand
  │    ├─ about to propose a new page class or indexable surface? → invoke superpowers:brainstorming; gate: the founder's approved design, COST's size of it, SEO.md's page gate
  │    └─ an approved design has no plan? → invoke superpowers:writing-plans; gate: checkboxed tasks
  │
  ├─ BUILD.
  │    ├─ about to generate pages from a dataset (best-X, components, facets)? → invoke marketing-skills:programmatic-seo; gate: template, data source, dedup rule, and ranked data of its own on every page
  │    ├─ pages at scale exist or are about to ship? → invoke claude-seo:seo-programmatic; gate: a thin-content and index-bloat check, unlisted pages noindex and follow, a size gate
  │    ├─ about to write or rewrite a page's content? → invoke claude-seo:seo-content-brief; gate: the query, the result page type, a 40 to 60 word definition-first block
  │    ├─ about to build a vs or alternatives page? → invoke claude-seo:seo-competitor-pages; gate: every claim about a rival sourced and dated
  │    ├─ about to add or change structured data? → invoke claude-seo:seo-schema; gate: the type per page class, validated; no rating Flowy cannot prove
  │    ├─ about to change URLs, navigation, the footer or internal links? → invoke marketing-skills:site-architecture; gate: before and after trees, every indexable page linked from a hub and 2 siblings, orphans listed
  │    ├─ about to build a free tool to earn links? → invoke marketing-skills:free-tools; gate: standalone value and a path to a listing
  │    └─ about to change SEO code (metadata, robots, sitemaps, canonicals, schema, the component list)? → invoke superpowers:test-driven-development; gate: a failing guard test first
  │
  ├─ AI SEARCH.
  │    ├─ about to make pages quotable by AI answers? → invoke claude-seo:seo-geo; gate: per target query, the passage, the entity and the source
  │    └─ about to change llms.txt, AI crawler rules, the .md twins or agent access? → invoke claude-seo:seo-agentic; gate: what each crawler and agent sees, fetched live
  │
  ├─ AUTHORITY.
  │    ├─ about to look for sites that would link to Flowy? → invoke openseo:link-prospecting; gate: the founder's word on credits; no outreach sent without his word
  │    └─ about to submit Flowy to directories? → invoke marketing-skills:directory-submissions; gate: a description per site; the founder submits
  │
  ├─ SHIP AND WATCH.
  │    ├─ about to ship SEO-affecting code, or a deploy just landed? → invoke claude-seo:seo-drift; gate: a baseline before, a diff after, no unexplained title, canonical, robots or schema change
  │    ├─ an SEO change is complete? → invoke superpowers:requesting-code-review; gate: one fresh reviewer
  │    ├─ about to claim an SEO page or fix is indexed, shipped or live? → invoke superpowers:verification-before-completion; gate: the live body read, URL Inspection's word for indexed, what was NOT checked
  │    └─ no search report dated in the last 7 days, or the founder asks how search is doing? → invoke openseo:seo-report; gate: the same series every week, the period named
  │
  ├─ DONE-CHECK. Before any "it worked".
  │    ├─ about to claim an SEO change worked or won? → invoke superpowers:verification-before-completion; gate: the same series over equal windows before and after, past Google's lag, confounders named (a Google update, another deploy); at low volume say "directional, not significant"
  │    └─ about to change a template across many pages and want proof it helps (an SEO split test)? → invoke marketing-skills:ab-testing; gate: two comparable page groups with one changed, hypothesis, baseline, a window past Google's lag
  │
  ├─ SCOPE CHANGE. A new page class, audience or goal.
  │    └─ re-enter the earliest invalidated phase.
  ├─ BLOCKED. Credits, a key, a deploy, a merge, a submission, an outreach email.
  │    └─ name it and the resume condition, then stop. Never fake the artifact.
  └─ ADVISORY. A question, no artifact.
       └─ answer only; no files change.
```

**Drift:** every route targets a skill in a separately installed plugin. If a slug no longer exists there, that route is a silent no-op. Never substitute a nearby-sounding skill. A broken route means this Flow needs an update, not that you may improvise.

## Priority on collision

1. Not Flowy, or blocked. 2. Scope changed. 3. Cause unknown: systematic-debugging first; the audits are its instruments, not rivals. 4. Verification before any claim: indexed, shipped, live or worked. 5. A failing test before SEO code. 6. Two audits: claude-seo's free audit is the default; openseo's runs only on the founder's word for its credits. One URL takes the page route; a page class or the site takes the technical route. 7. Lifecycle order: measure, diagnose, research, plan, build, AI search, authority, ship and watch. 8. Advisory answers without producing files.

**With growth-marketing:** an SEO session activates superpowers and this Flow; growth-marketing is not needed. If it is active too, its SEARCH branch, and its sentence giving SEO execution to marketing-skills, yield to the routes above; its other branches stand. Where both Flows route the same skill there is no conflict.

## Hard rules (Flowy's)

- The repository's own docs win over this Flow: CLAUDE.md; SEO.md (the page classes, the gate for a new indexable page); docs/seo/SEO_MASTER_PLAN.md (the founder's strategy, never edit its body); docs/SEO-MAP.md.
- claude-seo's umbrella skill, the one named just seo, is never invoked while this Flow is active: it re-dispatches inside its own plugin, around these routes.
- A page class costs per page: COST sizes it before it is built. A page indexes only with data of its own. "Best" is never decided by stars alone. Money buys position, never merit (ADR-085), and paid rows are labelled.
- openseo credits are the founder's money: estimate, then ask, before research, AI checks or rank tracking. Search Console, URL Inspection and GA4 reads are free.
- The SEO lane never deploys; DESIGN batches deploys. A deploy, a merge to main, SQL on production, a key, a Search Console or IndexNow submission: the founder's word each time. Never print a key.
- A check that cannot run here is reported as NOT VERIFIED with its reason. Never faked, never a reason to stall.
- Every number carries its probe, population, unit and period. Zero em dashes. No fabricated data.

## Data sources (named, not routed)

openseo's connection (Search Console, URL Inspection, GA4 are free; keyword, SERP, backlink and AI-visibility research spend credits). PostHog (on-site traffic, landing pages, bots). Vercel (request logs, crawler hits, firewall). Supabase, read-only (catalog counts to size a page class).

## Not routed, on purpose

From claude-seo: the umbrella skill (it re-dispatches around this Flow), the FLOW-framework skill (this file is the loop, and the name clashes), the Google API and DataForSEO skills (no keys here; openseo reads the same Google data free), hreflang (Flowy is English only), image generation (Flowy draws its OG images in code), local, maps and ecommerce (Flowy is not a local business or a store). From openseo: keyword clustering (claude-seo's cluster skill does the job with free search), local SEO, the coach (this Flow sequences the work). From marketing-skills: its SEO audit, schema, AI SEO and competitor-page skills (claude-seo owns those jobs here) and competitor profiling (positioning research, growth-marketing's job).

## You are rationalizing if you think…

- "It answers 200, so it is indexed." → A 200 is not an index. Ask URL Inspection.
- "The deploy went out, so the fix worked." → Google's numbers decide, over a named period.
- "It has the most stars, so it is the best." → Stars are not merit. Rank with data of its own.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

- `claude-seo:*` by AgriciDaniel (https://github.com/AgriciDaniel/claude-seo), MIT.
- `openseo:*` by OpenSEO (https://github.com/every-app/open-seo), MIT.
- `marketing-skills:*` by Corey Haines (https://github.com/coreyhaines31/marketingskills), MIT.
- `superpowers:*` by Jesse Vincent (https://github.com/obra/superpowers), MIT.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0. The upstream authors do not endorse Flowy.
