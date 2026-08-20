# FLOW.md: baodq97/tencentdb-agent-memory

> Routes all 8 skills from `baodq97/tencentdb-agent-memory` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is a contributor study underway with raw extracted atoms already in hand, ready to roll into a fuller persona?  → invoke tencentdb-agent-memory:contrib-consolidate   gate: an 11-dimension persona file exists for the contributor
  ├─ about to turn a GitHub contributor raw activity history into structured starter facts?  → invoke tencentdb-agent-memory:contrib-ingest   gate: a set of raw atom records exists for that GitHub handle
  ├─ has the user handed over a GitHub handle or repo link and asked to study or learn from that engineer?  → invoke tencentdb-agent-memory:contrib-profile   gate: an end to end persona and playbook run has started for that handle
  ├─ with several personas already built, ready to turn them into a learnable playbook or a side by side comparison?  → invoke tencentdb-agent-memory:contrib-synthesize   gate: a playbook or comparison document exists across personas
  ├─ has a pile of raw session atoms built up and is it time to roll them into scenes and a persona?  → invoke tencentdb-agent-memory:memory-consolidate   gate: L2 scene blocks and an updated persona exist
  ├─ about to comb past conversation history for durable facts worth keeping?  → invoke tencentdb-agent-memory:memory-seed   gate: new atom records appear in the store
  ├─ is it unclear whether the store is healthy, and would a visual check of its current state help?  → invoke tencentdb-agent-memory:memory-view   gate: a health report for the store renders in the browser
  ├─ need to directly query or manage the local store, like counting entries or searching by keyword?  → invoke tencentdb-agent-memory:tmem-cli   gate: a command line session returns store counts or search results
```

**Drift:** every route above targets `tencentdb-agent-memory:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **tencentdb-agent-memory** (https://github.com/baodq97/tencentdb-agent-memory). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
