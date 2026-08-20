# FLOW.md: polyarch/humanize

> Routes all 6 skills from `PolyArch/humanize` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to get an independent second opinion on a coding question or task by running it through a separate coding agent?  → invoke humanize:ask-codex   gate: a response from the separate coding agent is returned and available to read
  ├─ about to get an independent answer backed by fresh web research for a question that needs current outside information?  → invoke humanize:ask-gemini   gate: a research backed response citing outside sources is returned
  ├─ about to turn a rough draft document into a full structured implementation plan with acceptance criteria?  → invoke humanize:humanize-gen-plan   gate: a plan file with acceptance criteria is generated from the draft after validation
  ├─ about to turn an annotated, commented implementation plan into a clean comment free version plus a QA ledger?  → invoke humanize:humanize-refine-plan   gate: a comment free plan and a separate QA ledger are produced from the annotated input
  ├─ about to wire up an automatic stop hook so an external coding agent keeps looping revision until a condition is met?  → invoke humanize:humanize-rlcr   gate: the stop hook is configured and the loop runs without manual restarts
  ├─ about to start a full iterative build cycle that alternates between implementation and an ai review pass?  → invoke humanize:humanize   gate: at least one full implement then review then revise cycle completes
```

**Drift:** every route above targets `humanize:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **humanize** (https://github.com/PolyArch/humanize). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
