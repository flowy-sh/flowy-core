# FLOW.md: heliohq/ship

> Routes all 11 skills from `heliohq/ship` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ facing a new system and need to reason about scale, failure modes and trade-offs before any doc exists?  → invoke ship:arch-design   gate: a written note of components, contracts and failure modes exists before code starts
  ├─ asked for the entire raw-to-merge pipeline to run without stopping at each phase?  → invoke ship:auto   gate: every phase from planning through merge-ready completes in one unattended pass
  ├─ holding a coding task in an existing codebase and need to investigate it before committing to an approach?  → invoke ship:design   gate: a spec-and-plan document exists and a peer has signed off before code starts
  ├─ holding an approved plan and ready to turn it into working code story by story?  → invoke ship:dev   gate: each story is built, tested and committed with a second set of eyes checking it first
  ├─ need proof that a real user flow works through the whole running app, not just one unit in isolation?  → invoke ship:e2e   gate: a durable test drives the real running app through the flow and stores evidence it passed
  ├─ the work is finished locally and now needs to reach an open, merge-ready pull request?  → invoke ship:handoff   gate: a pull request is open, checks are green, and outstanding feedback is resolved
  ├─ need to actually run the app and poke at a finished change rather than just read the diff?  → invoke ship:qa   gate: the running app is exercised against acceptance criteria and edge cases with evidence captured
  ├─ the code already works correctly but reads messy or repeats itself and needs cleanup, not new behavior?  → invoke ship:refactor   gate: the same behavior verifies as before, and duplication or smell is measurably reduced
  ├─ a diff exists and needs its logic scrutinized for bugs before anyone runs it?  → invoke ship:review   gate: a written list of concrete issues cites exact file and line locations in the diff
  ├─ a delivery request is vague about which phase or how much of the pipeline it needs?  → invoke ship:use-ship   gate: the vague request maps to one named step or a short bundle rather than staying unresolved
  ├─ reference material, a guide or a decision record needs creating or updating in the documentation tree?  → invoke ship:write-docs   gate: a doc file exists under the documentation folder with correct frontmatter and the index regenerated
```

**Drift:** every route above targets `ship:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **ship** (https://github.com/heliohq/ship). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
