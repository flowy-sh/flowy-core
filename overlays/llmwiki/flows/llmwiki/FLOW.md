# FLOW.md: pratiyush/llm-wiki

> Routes all 6 skills from `Pratiyush/llm-wiki` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ has the user just dropped a new document, PDF, or URL and asked for it to be processed into the knowledge base?  → invoke llmwiki:llmwiki-ingest   gate: a new page exists referencing that source file
  ├─ is the user asking what they decided or built before, instead of asking for new work?  → invoke llmwiki:llmwiki-query   gate: the answer cites a specific stored page rather than being invented from memory
  ├─ would answering this question rely on recent sessions that have not been pulled in yet?  → invoke llmwiki:llmwiki-sync   gate: recent session transcripts appear as new or updated pages
  ├─ is the user checking overall project health or a recurring milestone rather than asking for one new page?  → invoke llmwiki:project-maintainer   gate: a status report covers the whole project, not a single page
  ├─ have recent sessions surfaced a repeatable pattern worth folding back into the working method itself?  → invoke llmwiki:self-learn   gate: a proposed change to the working method is written up and held for approval before anything is edited
  ├─ does the user want the entire knowledge base rebuilt from history rather than one incremental step?  → invoke llmwiki:wiki-all   gate: every stage from setup through serving completes in one run
```

**Drift:** every route above targets `llmwiki:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **llmwiki** (https://github.com/Pratiyush/llm-wiki). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
