# FLOW.md: lingfengqaq/webnovel-writer

> Routes all 8 skills from `lingfengqaq/webnovel-writer` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to open a read only overview of a novel project, showing its status, entity graph, and chapters?  → invoke webnovel-writer:webnovel-dashboard   gate: a read only dashboard displaying project status and an entity graph is opened
  ├─ about to run a read only check on a novel project, diagnosing whether its files, database, and config are intact?  → invoke webnovel-writer:webnovel-doctor   gate: a diagnostic report listing missing or broken files, database entries, or config is produced
  ├─ about to set up a brand new novel project from scratch through a staged interactive intake?  → invoke webnovel-writer:webnovel-init   gate: a project skeleton and constraint files are generated ready for planning and writing
  ├─ about to capture a successful writing pattern from this session so future chapters can reuse it?  → invoke webnovel-writer:webnovel-learn   gate: the project memory file is updated with a newly captured writing pattern
  ├─ about to break a high level novel outline down into volume, timeline, and chapter level outlines?  → invoke webnovel-writer:webnovel-plan   gate: volume, timeline, and chapter outlines are generated and new setting details are merged back into the setting collection
  ├─ about to look up details for an existing novel project, such as its characters, power system, factions, or planted foreshadowing?  → invoke webnovel-writer:webnovel-query   gate: the requested setting or character information is returned from the project records
  ├─ about to evaluate the quality of a drafted chapter and record quality metrics for it?  → invoke webnovel-writer:webnovel-review   gate: a quality report is generated and its metrics are written back to the chapter record
  ├─ about to produce a full publishable chapter end to end, from drafting through polish to backup?  → invoke webnovel-writer:webnovel-write   gate: a finished chapter is drafted, polished, and backed up in one pass
```

**Drift:** every route above targets `webnovel-writer:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **webnovel-writer** (https://github.com/lingfengqaq/webnovel-writer). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
