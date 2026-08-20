# FLOW.md: recomby-ai/recomby-geo

> Routes all 9 skills from `recomby-ai/recomby-geo` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is a piece of content about to go live and does it need a thorough readiness check against trust and expertise signals first?  → invoke recomby-geo:content-quality-auditor   gate: a scored checklist with any veto flags and a fix plan is produced for that piece
  ├─ does the user want an entirely new long-form page or post drafted from a topic or brief, or an existing page rewritten in full?  → invoke recomby-geo:content-writer   gate: a complete draft or full rewrite of the page exists, not just an outline
  ├─ does the task call for building an actual visual interface or page layout, not written copy or a strategy document?  → invoke recomby-geo:frontend-design   gate: working markup or component code renders a distinctive interface, not a text document
  ├─ is the request to run or advance a client through the whole staged workflow, from intake through to a finished draft, rather than one isolated task?  → invoke recomby-geo:geo-pipeline   gate: the client folder shows progress markers across the staged workflow, not just one file
  ├─ does a non-technical stakeholder need a friendly, clickable way to fill in missing slots or leave feedback on a brief or draft, rather than editing raw files?  → invoke recomby-geo:geo-review-html   gate: a single self-contained HTML file opens in a browser with fillable slots for that reviewer
  ├─ is the concern how pages on the same site connect to each other, like orphaned pages or how link value flows between them?  → invoke recomby-geo:internal-linking-optimizer   gate: a map of on-site connections with orphan pages and anchor text suggestions is produced
  ├─ is the task to figure out which terms are worth targeting before any page gets written, based on demand and competition?  → invoke recomby-geo:keyword-research   gate: a prioritized term list with clusters or a content calendar is produced
  ├─ does an existing page need its search results snippet or social share preview rewritten to earn more clicks?  → invoke recomby-geo:meta-tags-optimizer   gate: several character-counted title and description variants with a results preview are produced
  ├─ does visibility need to be checked broadly across classic search, AI chat answers, and voice assistants all at once, not just one channel?  → invoke recomby-geo:seo-geo-optimizer   gate: a single report scores visibility across multiple discovery channels together
```

**Drift:** every route above targets `recomby-geo:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **recomby-geo** (https://github.com/recomby-ai/recomby-geo). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
