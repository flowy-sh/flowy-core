# FLOW.md: avdlee/xcode-build-optimization-agent-skill

> Routes all 6 skills from `AvdLee/Xcode-Build-Optimization-Agent-Skill` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ package dependencies, plugins, or the dependency graph shape are suspected of slowing the build rather than the source code itself?  → invoke xcode-build-skills:spm-build-analysis   gate: specific packages or plugins are identified as contributing measurable build overhead
  ├─ a repeatable timing baseline is needed before comparing build performance across a change?  → invoke xcode-build-skills:xcode-build-benchmark   gate: a timestamped benchmark artifact records clean and incremental build times
  ├─ an optimization change has already been approved and now needs to be applied and reverified?  → invoke xcode-build-skills:xcode-build-fixer   gate: the approved change is applied and a fresh benchmark confirms the improvement
  ├─ the developer wants a full optimization pass end to end rather than one specific analysis or fix?  → invoke xcode-build-skills:xcode-build-orchestrator   gate: a prioritized set of findings is presented for explicit approval before any fix is applied
  ├─ individual source files or type-checking are suspected of causing slow compilation, rather than dependencies or project settings?  → invoke xcode-build-skills:xcode-compilation-analyzer   gate: specific source-level hotspots are ranked with a recommend-first plan tied to compiler diagnostics
  ├─ project configuration, build settings, schemes, or script phases are suspected of causing slow builds, rather than the source code or its dependencies?  → invoke xcode-build-skills:xcode-project-analyzer   gate: a project-level finding names a specific setting, scheme, or script phase with an approval gate before it changes
```

**Drift:** every route above targets `xcode-build-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **xcode-build-skills** (https://github.com/AvdLee/Xcode-Build-Optimization-Agent-Skill). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
