# FLOW.md: lucasduys/forge

> Routes all 10 skills from `LucasDuys/forge` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ did a bug surface at runtime that the written spec never anticipated?  → invoke forge:backpropagation   gate: the spec gains a new acceptance criterion and a regression test guarding the same failure
  ├─ is a rough idea being turned into a concrete, testable specification before any task breakdown?  → invoke forge:brainstorming   gate: a spec with numbered requirements and pass fail acceptance criteria exists
  ├─ is a handoff note, summary, or internal review note about to be written for another agent rather than for the user?  → invoke forge:caveman-internal   gate: the internal artifact is shorter and denser than an equivalent user-facing explanation would be
  ├─ are multiple people working the same event or sprint together and needing to claim separate tasks without colliding?  → invoke forge:collaborating   gate: a task is marked claimed by one contributor and stays visible to the rest of the group
  ├─ is a UI task about to start without having checked the recorded visual specification for this project first?  → invoke forge:design-system   gate: the UI choices made match values already recorded in the design reference rather than new ones invented on the spot
  ├─ does an ordered task list already exist and is it time to implement, test, and commit the next one in order?  → invoke forge:executing   gate: one task moves from queued to committed, with its own passing tests
  ├─ would knowing how the surrounding modules actually depend on each other change how a task should be broken down?  → invoke forge:graphify-integration   gate: the task breakdown cites specific dependency relationships pulled from the codebase rather than assumed ones
  ├─ is there a pull toward adding more than the task asked for, or quietly assuming an unstated requirement?  → invoke forge:karpathy-guardrails   gate: the scope stays limited to what was asked, with no unstated assumption left unflagged
  ├─ does an approved spec exist and does it now need to become an ordered sequence of buildable tasks?  → invoke forge:planning   gate: an ordered task list with stated dependencies and a rough size estimate per task exists
  ├─ is an implementation finished and ready to be checked against the spec it was built from?  → invoke forge:reviewing   gate: each requirement in the spec is marked matched or not by a named piece of the implementation
```

**Drift:** every route above targets `forge:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **forge** (https://github.com/LucasDuys/forge). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
