# FLOW.md: sneg55/agent-starter

> Routes all 8 skills from `sneg55/agent-starter` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to introduce these conventions into a codebase that already exists and already has its own layout?  → invoke agent-starter:adopt-project   gate: an audit lists proposals by invasiveness tier and only approved items land
  ├─ about to move finished local work all the way to a review request in one pass?  → invoke agent-starter:commit-push-pr   gate: a branch, a pushed ref and a pull request carrying a summary and test plan exist
  ├─ about to record the current changes into version history as a single entry?  → invoke agent-starter:commit   gate: one history entry exists whose message explains why rather than what
  ├─ about to run periodic upkeep on stored memory files that have grown sprawling or duplicated?  → invoke agent-starter:dream   gate: the memory files are merged, pruned and re-indexed in place
  ├─ about to start a codebase from nothing, with no directory tree or guidance file yet?  → invoke agent-starter:new-project   gate: a scaffolded tree, a root guidance file, hooks and a first history entry exist
  ├─ about to stop this codebase from repeating the same mistake across sessions?  → invoke agent-starter:reflect   gate: gated rule, threshold or decision record changes are proposed from the ledger
  ├─ about to decide which captured notes deserve promotion into durable guidance?  → invoke agent-starter:remember   gate: promotions are proposed and stale or conflicting entries are flagged
  ├─ about to hand over changed code that still carries duplication or dead weight?  → invoke agent-starter:simplify   gate: the changed files are reviewed for reuse and the findings are applied
```

**Drift:** every route above targets `agent-starter:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **agent-starter** (https://github.com/sneg55/agent-starter). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
