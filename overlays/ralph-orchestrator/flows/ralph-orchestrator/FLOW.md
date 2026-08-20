# FLOW.md: mikeyobrien/ralph-orchestrator

> Routes all 17 skills from `mikeyobrien/ralph-orchestrator` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to implement a code task and need guidance through explore, plan, code, and commit as one workflow?  → invoke ralph-orchestrator:code-assist   gate: each of the four phases, explore, plan, code, and commit, is completed in order
  ├─ about to turn a description or an existing design plan into a structured task file?  → invoke ralph-orchestrator:code-task-generator   gate: a .code-task.md file with Given-When-Then criteria exists
  ├─ about to validate a hat collection preset before it ships?  → invoke ralph-orchestrator:evaluate-presets   gate: a list of bugs or UX issues found in the preset exists
  ├─ about to look for pending work across the repository rather than start on one task?  → invoke ralph-orchestrator:find-code-tasks   gate: a list of pending items with status and dates exists
  ├─ about to turn a rough idea into a design document before any task file exists?  → invoke ralph-orchestrator:pdd   gate: a design document with an implementation plan exists
  ├─ about to automate a browser action against a persistent Chrome session?  → invoke ralph-orchestrator:playwriter   gate: a Playwright Page API call against the persistent session executes
  ├─ about to record a terminal session for a pull request demo?  → invoke ralph-orchestrator:pr-demo   gate: a GIF or SVG file embeddable on GitHub exists
  ├─ about to invoke a specific capability without knowing its exact interface first?  → invoke ralph-orchestrator:ralph-tools   gate: a tool reference is consulted before the call
  ├─ about to cut a new release after fixes are already committed?  → invoke ralph-orchestrator:release-bump   gate: the version number is incremented and committed
  ├─ about to review a pull request by number or URL?  → invoke ralph-orchestrator:review-pr   gate: a review result tied to a specific pull request exists
  ├─ about to enforce a strict test-first cycle directly from a spec, task, or description?  → invoke ralph-orchestrator:test-driven-development   gate: a failing test written first exists, using property tests where applicable
  ├─ about to interact with a terminal program that needs live keystrokes rather than one-shot commands?  → invoke ralph-orchestrator:tmux-terminal   gate: a tmux pane receives interactive input and its output is captured
  ├─ about to reproduce a garbled or corrupted terminal rendering issue by watching it run live in a split view?  → invoke ralph-orchestrator:tui-debug-in-pane   gate: a split pane captures the live output while the rendering issue reproduces
  ├─ about to confirm a terminal interface looks or reads correctly after a change, rather than diagnose why it broke?  → invoke ralph-orchestrator:tui-validate   gate: a screenshot or text capture is judged against the expected output
  ├─ about to explain how an internal mechanism of the orchestrator works, using its published reference?  → invoke ralph-orchestrator:ralph-docs   gate: an answer citing the published reference map exists
  ├─ about to create or debug a hat collection workflow file?  → invoke ralph-orchestrator:ralph-hats   gate: a hat collection YAML config is created, validated, or explained
  ├─ about to start, monitor, resume, or debug an active orchestrator run?  → invoke ralph-orchestrator:ralph-loop   gate: the run state changes to running, resumed, or merged
```

**Drift:** every route above targets `ralph-orchestrator:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **ralph-orchestrator** (https://github.com/mikeyobrien/ralph-orchestrator). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
