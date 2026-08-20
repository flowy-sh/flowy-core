# FLOW.md: anombyte93/prd-taskmaster

> Routes all 10 skills from `anombyte93/prd-taskmaster` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ did the user type the specific branded slash entry point or explicitly say they want to start building?  → invoke prd:atlas   gate: control passes straight to the underlying objective-to-tasks engine
  ├─ does the user want to change how this plugin behaves for future runs, in their own words?  → invoke prd:customise-workflow   gate: their stated preferences are written to a persisted configuration file
  ├─ is this the very first phase of a new objective, before any requirements have been gathered?  → invoke prd:discover   gate: adaptive brainstorming questions are answered or auto-resolved into a constraint set
  ├─ was a multi-worktree, fleet-based execution mode selected for this project?  → invoke prd:execute-fleet   gate: isolated worktrees each report verified results before one final merge
  ├─ is there a single next ready task that needs to be implemented and verified one at a time?  → invoke prd:execute-task   gate: the task is marked done only after verification evidence is captured
  ├─ have tasks just been parsed from a spec and do they need deep research before any coding begins?  → invoke prd:expand-tasks   gate: research findings are written back onto each task before implementation starts
  ├─ has the initial requirements phase finished and does its output need turning into a formal spec and task list?  → invoke prd:generate   gate: a validated specification document and a parsed set of tasks both exist
  ├─ did the user state any kind of objective, whether a software project, a security test, a business plan, or a learning target, and want it turned into a plan and tasks?  → invoke prd:go   gate: a validated spec and a parsed task list both exist
  ├─ is planning complete and does the project need a recommended execution mode before implementation starts?  → invoke prd:handoff   gate: one execution mode is recommended with a stated justification
  ├─ is this the very first run in a new project before any backend or provider has been configured?  → invoke prd:setup   gate: the backend and provider stack are verified working without overwriting any existing configuration
```

**Drift:** every route above targets `prd:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **prd** (https://github.com/anombyte93/prd-taskmaster). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
