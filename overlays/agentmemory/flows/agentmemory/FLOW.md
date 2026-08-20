# FLOW.md: rohitg00/agentmemory

> Routes all 17 skills from `rohitg00/agentmemory` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ wiring this into a specific host agent, or did a connect adapter write config to a path the host does not read?  → invoke agentmemory:agentmemory-agents   gate: the adapter wrote to the config path the host actually reads
  ├─ need to reason about how an observation gets from a live session into storage and back out again?  → invoke agentmemory:agentmemory-architecture   gate: the storage and retrieval path is described end to end
  ├─ is a feature off, a port wrong, or a key unset?  → invoke agentmemory:agentmemory-config   gate: the setting changed, and the reason it defaults off is stated
  ├─ are observations not being captured at all, or is far too much being recorded?  → invoke agentmemory:agentmemory-hooks   gate: the capture points are named and the recording scope tuned
  ├─ unsure which memory tool to call, or what arguments it takes?  → invoke agentmemory:agentmemory-mcp-tools   gate: the tool chosen by name, with its parameters
  ├─ talking to the memory server over HTTP, or is MCP unavailable in this host?  → invoke agentmemory:agentmemory-rest-api   gate: the call was made against the documented HTTP surface
  ├─ looking at one specific file, function or line and asking why this code is here?  → invoke agentmemory:commit-context   gate: that location traced back to the session that produced it
  ├─ want the list of what has actually shipped, each commit with the session behind it?  → invoke agentmemory:commit-history   gate: commits listed with their linked sessions
  ├─ does specific stored data need scrubbing, because it is private or because it is wrong?  → invoke agentmemory:forget   gate: the matching observations were shown and confirmed before anything was deleted
  ├─ starting with no context and needing to pick up exactly where the last session stopped?  → invoke agentmemory:handoff   gate: the last session resumed, unanswered question first
  ├─ did the user just correct your approach, or state a rule meant to hold next time too?  → invoke agentmemory:lesson   gate: the correction stored as a weighted rule that resurfaces before similar work
  ├─ beginning a nontrivial task, or just settled a decision, and unsure whether it belongs in memory at all?  → invoke agentmemory:memory-discipline   gate: recall ran before the work, and the decision point was saved after it
  ├─ is there likely prior work on this topic that nobody has looked for yet?  → invoke agentmemory:recall   gate: the hybrid search ran and its results were read
  ├─ does someone want a rollup across a period rather than the detail of one session?  → invoke agentmemory:recap   gate: a dated rollup with highlights per session
  ├─ did the user ask for an insight or a decision to be preserved for later?  → invoke agentmemory:remember   gate: saved to long-term storage with concept tags
  ├─ want to see what earlier sessions on this project actually did, in order?  → invoke agentmemory:session-history   gate: a timeline of prior sessions on this project
  ├─ about to add a new skill to this plugin, or restructure one that exists?  → invoke agentmemory:write-agentmemory-skill   gate: the skill follows the house format
```

**Drift:** every route above targets `agentmemory:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **agentmemory** (https://github.com/rohitg00/agentmemory). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
