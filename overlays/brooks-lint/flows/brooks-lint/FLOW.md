# FLOW.md: hyhmrright/brooks-lint

> Routes all 9 skills from `hyhmrright/brooks-lint` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to change this plugin and need its manifests and documentation kept in sync afterward?  → invoke brooks-lint:brooks-harness   gate: manifests, translated readmes, and the changelog all match the current version after the run
  ├─ about to scaffold a fresh analysis skill for this plugin starting from nothing?  → invoke brooks-lint:new-skill   gate: a fresh skill folder with its main doc and guide file exists and passes validation
  ├─ about to cut and publish a new version of this plugin?  → invoke brooks-lint:release   gate: version is bumped everywhere, a changelog entry is written, a tag is pushed, and the new version is published on github
  ├─ about to examine a codebase and map its module boundaries or dependency structure for architectural problems?  → invoke brooks-lint:brooks-audit   gate: a dependency map and a layering violation list are produced
  ├─ about to identify and prioritize maintainability problems for a refactoring roadmap?  → invoke brooks-lint:brooks-debt   gate: a ranked list of debt items with rationale is produced
  ├─ about to give one overall quality score covering several dimensions of a codebase at once?  → invoke brooks-lint:brooks-health   gate: a single report scoring the codebase across all four dimensions exists
  ├─ about to scrutinize a pull request or pasted diff for design and maintainability issues?  → invoke brooks-lint:brooks-review   gate: findings are listed as symptom, source, consequence and remedy
  ├─ about to run one pass that both analyzes a codebase and applies fixes directly to it?  → invoke brooks-lint:brooks-sweep   gate: safe fixes are committed and risky fixes are listed awaiting confirmation
  ├─ about to judge whether an existing test suite is structurally sound or brittle?  → invoke brooks-lint:brooks-test   gate: a report names specific brittleness or structural weaknesses in the suite
```

**Drift:** every route above targets `brooks-lint:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **brooks-lint** (https://github.com/hyhmrright/brooks-lint). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
