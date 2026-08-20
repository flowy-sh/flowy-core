# FLOW.md: codenamev/ai-software-architect

> Routes all 7 skills from `codenamev/ai-software-architect` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ needs a full review of the current design from every team perspective at once, not just one angle?  → invoke ai-software-architect:architecture-review   gate: a combined report covering input from every team perspective
  ├─ just wants a status snapshot of how much decision documentation already exists, not a new review or a new decision?  → invoke ai-software-architect:architecture-status   gate: a summary of existing decision records, past reviews, and documentation gaps, with nothing new created
  ├─ has just made or is about to lock in a specific architectural choice that needs to be written down as a durable record?  → invoke ai-software-architect:create-adr   gate: a new record file capturing the choice, its context, and its consequences
  ├─ wants to know who or what is available to ask for a review, before actually requesting one?  → invoke ai-software-architect:list-members   gate: a printed roster of available reviewer roles and their specialties
  ├─ is being asked to turn on a standing check against over-engineering for the rest of the session?  → invoke ai-software-architect:pragmatic-guard   gate: a confirmed mode change that will challenge unnecessary complexity going forward
  ├─ is in a project that has never had this review framework installed and needs it bootstrapped for the first time?  → invoke ai-software-architect:setup-architect   gate: the framework files and configuration created in the project for the first time
  ├─ needs feedback from exactly one named kind of reviewer, such as a security or performance specialist, not the whole team?  → invoke ai-software-architect:specialist-review   gate: a report attributed to a single named specialist perspective
```

**Drift:** every route above targets `ai-software-architect:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **ai-software-architect** (https://github.com/codenamev/ai-software-architect). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
