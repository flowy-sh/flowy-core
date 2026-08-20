# FLOW.md: heurema/signum

> Routes all 6 skills from `heurema/signum` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does an approved change proposal exist with tasks that now need to be implemented or continued?  → invoke signum:openspec-apply-change   gate: tasks from the proposal are being checked off as they are completed
  ├─ has implementation of a change finished and does it now need to be closed out for the permanent record?  → invoke signum:openspec-archive-change   gate: the completed change is moved into the finalized record
  ├─ is the user thinking out loud about an idea, a problem, or an unclear requirement rather than ready to commit to a plan?  → invoke signum:openspec-explore   gate: open questions were surfaced and discussed before any proposal was drafted
  ├─ has the user described something they want built and do they need a full proposal, design, and task breakdown generated from that description?  → invoke signum:openspec-propose   gate: a complete proposal with design, specs, and tasks was produced in one pass
  ├─ have the tasks in a change been implemented while the authoritative specs still reflect the old behavior instead of the new one?  → invoke signum:openspec-sync-specs   gate: the main specs now match the new behavior from the change, and the change proposal remains open rather than closed out
  ├─ does an existing change proposal need its plan revised or new decisions folded in without touching any code?  → invoke signum:openspec-update-change   gate: the planning artifacts were revised and remain consistent with each other, with no source code edited
```

**Drift:** every route above targets `signum:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **signum** (https://github.com/heurema/signum). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
