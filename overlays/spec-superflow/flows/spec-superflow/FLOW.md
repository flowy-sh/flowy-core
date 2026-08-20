# FLOW.md: magebyte-zero/spec-superflow

> Routes all 9 skills from `MageByte-Zero/spec-superflow` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ did a build step just hit an unexpected error, failing test, or blockage?  → invoke spec-superflow:bug-investigator   gate: the root cause is identified before any fix is proposed
  ├─ is an execution contract approved and does the user want disciplined, test-driven implementation work done?  → invoke spec-superflow:build-executor   gate: implementation proceeds batch by batch under the approved contract
  ├─ has an implementation batch just finished and does it need a quality and compliance check before merging?  → invoke spec-superflow:code-reviewer   gate: the batch is reviewed against the spec and a pass or fail verdict is recorded
  ├─ is the plan approved and does the user want to move from planning into implementation?  → invoke spec-superflow:contract-builder   gate: a formal execution contract document exists
  ├─ is the request vague, or is the user comparing options without a settled direction yet?  → invoke spec-superflow:need-explorer   gate: a stable, written definition of intent, scope, and success criteria exists
  ├─ is implementation complete and does the change need final verification and wrap-up?  → invoke spec-superflow:release-archivist   gate: a closing summary and archive record exist for the change
  ├─ does an in-progress change have local spec updates that still need folding into the main spec base?  → invoke spec-superflow:spec-merger   gate: the local updates are merged into the main spec with no drift remaining
  ├─ is the change understood well enough to put the plan into formal written artifacts?  → invoke spec-superflow:spec-writer   gate: proposal, spec, design, and task documents exist
  ├─ is the agent inside an active tracked change directory and does the user want to begin or resume the structured workflow?  → invoke spec-superflow:workflow-start   gate: the state machine identifies the current phase and proceeds from it
```

**Drift:** every route above targets `spec-superflow:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **spec-superflow** (https://github.com/MageByte-Zero/spec-superflow). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
