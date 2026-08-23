# FLOW.md: mem0ai/mem0

> Routes all 17 skills from `mem0ai/mem0` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to start a task or switch topic where an earlier decision or preference could change the answer?  → invoke mem0:context-loader   gate: matching memories were searched and injected before any task work began
  ├─ do search results keep returning near-identical or contradicting entries?  → invoke mem0:dream   gate: duplicates merged and contradictions resolved
  ├─ about to back up, migrate, or hand over everything retained for this project?  → invoke mem0:export   gate: a portable Markdown file exists on disk
  ├─ does one specific stored fact need removing because it is wrong, expired, or sensitive?  → invoke mem0:forget   gate: the target was located and its removal confirmed before anything was deleted
  ├─ are calls erroring, returning nothing, or has the MCP connection dropped?  → invoke mem0:health   gate: connectivity, key validity and a read/write round trip were each reported
  ├─ is there an exported file or an existing MEMORY.md whose contents should be brought in?  → invoke mem0:import   gate: the file was parsed and its entries written
  ├─ is it unknown which projects hold anything, or how it is spread across repos?  → invoke mem0:list-projects   gate: projects listed with counts and last activity
  ├─ about to add persistent personalization to an app through the hosted platform SDK?  → invoke mem0:mem0   gate: the platform SDK reference was consulted before any integration code
  ├─ about to consolidate, and is it unknown whether the stored set is actually healthy?  → invoke mem0:memory-reviewer   gate: a quality report with actionable recommendations exists
  ├─ is this the first run in this project, or is the key or MCP auth unconfigured?  → invoke mem0:onboard   gate: key, auth, project import and categories each configured
  ├─ could this project hold content that must never be extracted, such as keys, customer data or unreleased strategy?  → invoke mem0:policy   gate: mem0.md states what to extract and what to ignore, BEFORE anything is stored
  ├─ is one quick lookup enough, such as resolving a citation id or confirming a fact was recorded?  → invoke mem0:peek   gate: the one-line result, or the record by id, was returned
  ├─ must one fact survive the next consolidation pass untouched?  → invoke mem0:pin   gate: its protected flag was set or cleared before consolidation runs
  ├─ did the user explicitly ask for something to be recorded for later?  → invoke mem0:remember   gate: stored verbatim with a category
  ├─ is the size, age spread, or category distribution of what is retained unknown?  → invoke mem0:stats   gate: counts by category and age reported
  ├─ does the work need context belonging to a different project, or to every user?  → invoke mem0:switch-project   gate: the scope override or global flag was set before the next read
  ├─ picking up a session cold and need to see everything currently retained?  → invoke mem0:tour   gate: all entries displayed grouped by category
```

**Drift:** every route above targets `mem0:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **mem0** (https://github.com/mem0ai/mem0). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
