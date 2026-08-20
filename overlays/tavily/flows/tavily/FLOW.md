# FLOW.md: tavily-ai/skills

> Routes all 8 skills from `tavily-ai/skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is the task to write code that integrates this kind of web search capability into an application, rather than to run a search right now?  → invoke tavily:tavily-best-practices   gate: the implementation follows documented integration patterns rather than an ad hoc call
  ├─ could the very next step touch several of these web actions together through one general purpose tool rather than a single narrow one?  → invoke tavily:tavily-cli   gate: a single general purpose command handles the whole fetch in one call
  ├─ does the user want the content of many pages across a whole site or doc section pulled down together, not just one page?  → invoke tavily:tavily-crawl   gate: a local set of markdown files exists covering multiple pages from that site
  ├─ is a broad web look up needed as a background step, where raw page clutter should stay out of the main conversation?  → invoke tavily:tavily-dynamic-search   gate: a filtered, distilled result set returns without raw page markup in the transcript
  ├─ does the user already have one or more specific page addresses and just want their readable content pulled out?  → invoke tavily:tavily-extract   gate: clean readable text or markdown for those exact addresses is returned
  ├─ is the goal to see the shape of a site or locate where something lives on it, before reading any page content?  → invoke tavily:tavily-map   gate: a list of URLs for that site is produced with no page content fetched
  ├─ does the question need a sourced, multi-angle writeup comparing or explaining something thoroughly, not just a quick fact?  → invoke tavily:tavily-research   gate: a cited report with multiple sources answers the comparison or deep question
  ├─ does the user want a straightforward set of current web results on a topic, phrased like an everyday search request?  → invoke tavily:tavily-search   gate: a ranked list of current web results for that query is returned
```

**Drift:** every route above targets `tavily:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **tavily** (https://github.com/tavily-ai/skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
