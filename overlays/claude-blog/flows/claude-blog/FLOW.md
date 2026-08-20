# FLOW.md: agricidaniel/claude-blog

> Routes all 32 skills from `AgriciDaniel/claude-blog` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to score an existing blog post against a quality rubric?  → invoke claude-blog:blog-analyze   gate: a 100-point scorecard across the five categories exists
  ├─ about to turn a written post into narrated audio?  → invoke claude-blog:blog-audio   gate: an MP3 file with HTML5 audio embed code exists
  ├─ about to assess the health of the whole blog rather than one post?  → invoke claude-blog:blog-audit   gate: a prioritized action queue covering every post exists
  ├─ about to start blog work with no established brand or voice reference on file?  → invoke claude-blog:blog-brand   gate: BRAND.md and VOICE.md exist in the project
  ├─ about to hand off a topic to a writer before any outline exists?  → invoke claude-blog:blog-brief   gate: a content brief with keyword targets and word count exists
  ├─ about to plan what gets published over the coming month or quarter?  → invoke claude-blog:blog-calendar   gate: a publishing schedule with dated topics exists
  ├─ about to check whether existing posts compete against each other for the same keyword?  → invoke claude-blog:blog-cannibalization   gate: a list of posts flagged as targeting the same search intent exists
  ├─ about to add a data visualization to a post?  → invoke claude-blog:blog-chart   gate: an inline SVG chart with accessible markup exists in the post
  ├─ about to plan a hub-and-spoke set of posts around one topic rather than a single article?  → invoke claude-blog:blog-cluster   gate: a cluster map with a hub and its spoke posts exists
  ├─ about to check whether published posts are losing search traffic over time?  → invoke claude-blog:blog-decay   gate: a list of posts flagged with a refresh, consolidate, prune, or query-shift action exists
  ├─ about to find out what real people are currently saying about a topic before writing on it?  → invoke claude-blog:blog-discourse   gate: a summary of recent public discourse with source platforms exists
  ├─ about to publish a post that cites statistics or named sources?  → invoke claude-blog:blog-factcheck   gate: each cited claim is checked against its source URL
  ├─ about to run a post through the Find, Optimize, Win evidence-led workflow?  → invoke claude-blog:blog-flow   gate: a stage-specific FLOW prompt output exists for the post
  ├─ about to audit AI citation readiness only, without doing Google SEO work?  → invoke claude-blog:blog-geo   gate: an AI citation score with no Google-SEO edits exists
  ├─ about to pull live performance data from Google APIs rather than estimate it?  → invoke claude-blog:blog-google   gate: a report populated with real Google API response data exists
  ├─ about to add a visual image to a post rather than a data chart?  → invoke claude-blog:blog-image   gate: a generated image file exists for the post
  ├─ about to check the health of an entire multilingual content set rather than translate one post?  → invoke claude-blog:blog-locale-audit   gate: a translation coverage matrix with hreflang validation results exists
  ├─ about to adapt an already-translated post to local culture rather than translate it?  → invoke claude-blog:blog-localize   gate: brand examples, CTAs, and formality are adjusted for the target locale
  ├─ about to run the complete write-translate-localize pipeline in one command rather than each step separately?  → invoke claude-blog:blog-multilingual   gate: hreflang tags, sitemap entries, and a language map all exist for one run
  ├─ about to answer from user-uploaded source documents rather than general knowledge?  → invoke claude-blog:blog-notebooklm   gate: a citation-backed answer referencing a specific notebook source exists
  ├─ about to structure a post skeleton before any prose is written?  → invoke claude-blog:blog-outline   gate: an H2 and H3 heading hierarchy exists with no body prose
  ├─ about to define a reusable named voice profile rather than write one post?  → invoke claude-blog:blog-persona   gate: a persona definition with the four tone dimensions exists
  ├─ about to adapt a published post into other channel formats?  → invoke claude-blog:blog-repurpose   gate: at least one channel-specific variant of the post exists
  ├─ about to update an existing post for both Google ranking and AI citation together?  → invoke claude-blog:blog-rewrite   gate: fabricated statistics in the post are replaced with sourced data
  ├─ about to publish a post with no structured data markup yet?  → invoke claude-blog:blog-schema   gate: valid JSON-LD schema markup exists for the post
  ├─ about to run a pass or fail checklist on a finished draft before publishing?  → invoke claude-blog:blog-seo-check   gate: a pass or fail result exists for each checklist item
  ├─ about to set the long-term direction for the blog rather than plan one cluster or post?  → invoke claude-blog:blog-strategy   gate: a strategy document covering audience, competitors, and distribution channels exists
  ├─ about to infer a voice profile from a sample of existing posts rather than define one from scratch?  → invoke claude-blog:blog-style   gate: a voice profile derived from five or more sample posts exists
  ├─ about to sync tags or categories to a live CMS?  → invoke claude-blog:blog-taxonomy   gate: tags and categories are written to the CMS via its API
  ├─ about to convert a post into another language before any cultural adaptation pass?  → invoke claude-blog:blog-translate   gate: a translated post preserving markdown structure and schema exists
  ├─ about to draft an entirely new post with no prior draft to build on?  → invoke claude-blog:blog-write   gate: a full article draft with a Key Takeaways box exists
  ├─ unsure which specific blog sub-skill the request maps to?  → invoke claude-blog:blog   gate: the request is routed to one specific sub-skill
```

**Drift:** every route above targets `claude-blog:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **claude-blog** (https://github.com/AgriciDaniel/claude-blog). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
