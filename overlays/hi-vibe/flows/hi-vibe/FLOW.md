# FLOW.md: jx-hxxx/hi-vibe

> Routes all 6 skills from `jx-hxxx/hi-vibe` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to close out a work session or just made a decision that a future session needs to know about?  → invoke hi-vibe:docs-keeper   gate: the project context, module notes, handover log, or change history file now reflects it
  ├─ about to state a specific number, limit, price, or how an external library, API, or platform currently behaves, without having checked a source?  → invoke hi-vibe:grounded-answers   gate: the claim cites a checked source instead of being stated from memory
  ├─ about to configure or request lint, type checking, circular dependency detection, or CI enforcement for this project?  → invoke hi-vibe:guards-setup   gate: confirmation was requested before any config file was written, and the enforcement config now exists on disk
  ├─ about to answer a question about duplicate code, dead code, or the shape of this repository without having run a scanner first?  → invoke hi-vibe:repo-xray   gate: the answer quotes scanner output instead of a guess
  ├─ about to add a fallback, default value, or a catch block to make an error stop appearing without knowing why it happened?  → invoke hi-vibe:root-cause-first   gate: the underlying cause is written down before the fix is made
  ├─ about to create a new function, file, or helper, or has just finished a change that needs to be checked before being called done?  → invoke hi-vibe:write-gate   gate: an existing code search happened first, and the finished change was reviewed
```

**Drift:** every route above targets `hi-vibe:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **hi-vibe** (https://github.com/jx-hxxx/hi-vibe). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
