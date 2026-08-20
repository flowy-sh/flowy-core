# FLOW.md: ai-builder-club/skills

> Routes all 10 skills from `AI-Builder-Club/skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ unsure whether the instructions and tool descriptions inside a repo are helping the agent or overconstraining it?  → invoke skills:agent-context-audit   gate: a written audit lists overconstrained or conflicting instructions found across the repo docs and tool descriptions
  ├─ running several agents in parallel and worried they will collide on the same local ports or database?  → invoke skills:crabbox-setup   gate: each agent has its own isolated cloud dev box with its own database and dev server running
  ├─ a codebase has no single command to start all its services locally?  → invoke skills:dev-local-setup   gate: one script starts, stops, and reports status for every local service in one session
  ├─ a repo has no reliable end-to-end tests gating its pull requests?  → invoke skills:e2e-setup   gate: a per-PR test suite exists using real flows, a shared auth helper, and recorded video or trace evidence
  ├─ starting to track a new knowledge domain that has no home yet in the file-based knowledge base?  → invoke skills:new-loop   gate: a domain folder exists with a charter README, a Timeline, a LOG.md, and one recorded real test run
  ├─ needing to delegate a task to a different CLI coding agent running in its own terminal session?  → invoke skills:open-agent-teams   gate: a detached session runs the other agent and signals completion without a race condition
  ├─ deciding where to invest limited SEO effort rather than how to write a specific page?  → invoke skills:seo-growth   gate: a prioritized list names which pages or clusters get the next round of investment and why
  ├─ starting on a repo that has no map-like docs, one-command dev stack, or verify-before-ship gate at all?  → invoke skills:setup-codebase-harness   gate: the repo now has map style docs, a one-command dev stack, and a verify-before-ship gate all in place
  ├─ about to ship engineering work without a proven way to check it actually works first?  → invoke skills:verifier-setup   gate: a chosen verification path, local or sandboxed, is confirmed with its driver installed
  ├─ asked to turn a written process description into an animated diagram?  → invoke skills:visual-flow-gif   gate: a static image and an animated diagram file are both generated from a JSON specification
```

**Drift:** every route above targets `skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **skills** (https://github.com/AI-Builder-Club/skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
