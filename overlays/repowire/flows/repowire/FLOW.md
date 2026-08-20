# FLOW.md: prassanna-ravishankar/repowire

> Routes all 6 skills from `prassanna-ravishankar/repowire` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ has the mesh or its multi-backend messaging just changed and gone unverified?  → invoke repowire:integration-test   gate: a run across every supported agent-type combination completes and reports pass or fail
  ├─ is a nontrivial approach about to be chosen without a second opinion from a different model backend?  → invoke repowire:cross-agent-plan   gate: a plan authored by a different backend exists before building starts
  ├─ is a change about to be merged or committed on the strength of self-review alone?  → invoke repowire:cross-agent-review   gate: a review written by a different backend is attached before the change merges
  ├─ would this piece of work finish faster or better handed to a specific other agent peer than done here?  → invoke repowire:delegate   gate: a peer is assigned the work and its completion is tracked to a result
  ├─ is the multi-agent link missing or out of date on this machine?  → invoke repowire:repowire-install   gate: the CLI, hooks, and skill pack all report as installed and up to date
  ├─ is it unclear which coordination primitive fits, such as a direct request versus a broadcast?  → invoke repowire:repowire-patterns   gate: the chosen primitive is named before any peer message is sent
```

**Drift:** every route above targets `repowire:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **repowire** (https://github.com/prassanna-ravishankar/repowire). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
