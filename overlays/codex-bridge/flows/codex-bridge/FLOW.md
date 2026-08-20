# FLOW.md: sateezg/codex-bridge

> Routes all 6 skills from `Sateezg/codex-bridge` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does the user want a quick outside opinion on a design call without launching a full subagent?  → invoke codex-bridge:ask-codex   gate: an inline answer attributed to the outside model is returned in the same turn
  ├─ does the project need a whole matching batch of image assets instead of a single graphic?  → invoke codex-bridge:asset-set   gate: multiple asset files sharing one visual style are written to disk in one pass
  ├─ is a large, repetitive, or asset-heavy task about to start that would burn significant context if done locally?  → invoke codex-bridge:codex-delegate   gate: a handoff offer is made before local work begins, and the heavy task runs outside the current context
  ├─ are the code changes finished and ready for an independent second opinion before merge?  → invoke codex-bridge:codex-review   gate: a findings list grouped by severity with file and line references is produced
  ├─ does the request change or vary an image file that already exists rather than start from a blank canvas?  → invoke codex-bridge:edit-image   gate: a modified image file is saved that keeps the original composition except for the requested change
  ├─ does the request ask for a brand new image built from a text description with no starting file?  → invoke codex-bridge:generate-image   gate: a new image file is written to disk that did not exist before the request
```

**Drift:** every route above targets `codex-bridge:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **codex-bridge** (https://github.com/Sateezg/codex-bridge). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
