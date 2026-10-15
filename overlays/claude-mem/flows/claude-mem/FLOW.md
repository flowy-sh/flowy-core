# FLOW.md: Claude-Mem Flow

> Routes the 15 Claude-Mem skills (cross-session memory search, phased plans, handoffs and codebase orientation) so the right one fires at the right phase: the agent cannot skip them and improvise.
> Skills by Alex Newman (https://github.com/thedotmack/claude-mem, Apache-2.0). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill BEFORE doing the task yourself: do not write code, run a tool, or claim "done" until you have READ this FLOW.md and invoked every matched skill. Doing the work, or claiming "done", without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  ├─ asked about earlier decisions, fixes or past work?  → invoke claude-mem:mem-search   gate: progressive disclosure, no guessing
  ├─ new or unfamiliar codebase?                         → invoke claude-mem:learn-codebase   gate: source read before changes
  ├─ structural code question, full file not needed?     → invoke claude-mem:smart-explore   gate: AST search first
  ├─ feature or multi-step task, no plan yet?            → invoke claude-mem:make-plan   gate: phased plan with doc discovery
  ├─ plan exists and must be executed?                   → invoke claude-mem:do   gate: phases run through subagents
  ├─ pull request awaiting reviews and CI?               → invoke claude-mem:babysit   gate: watch until ready to merge
  ├─ session ending, a fresh session will continue?      → invoke claude-mem:handoff   gate: HANDOFF.md written
  ├─ asked to compare worktrees, branches or PRs?        → invoke claude-mem:standup   gate: read-only
  ├─ codebase architecture to map and unify?             → invoke claude-mem:pathfinder
  ├─ design to audit against Rams' principles?           → invoke claude-mem:design-is
  ├─ plain-English breakdown of something technical?     → invoke claude-mem:what-the
  ├─ issue backlog to cluster by root cause?             → invoke claude-mem:oh-my-issues
  ├─ release or version bump for a plugin?               → invoke claude-mem:version-bump
  ├─ project history report requested?                   → invoke claude-mem:timeline-report
  ├─ knowledge base from past observations wanted?       → invoke claude-mem:knowledge-agent
  ├─ scope changed mid-task (brief or reqs changed)?  → re-enter the earliest invalidated phase (claude-mem:make-plan or claude-mem:learn-codebase)
  ├─ blocked / waiting on an external dependency?  → park: record the blocker and resume condition; do not fake progress
  └─ question, not work (advise / explain)?  → answer only; no files change
```

**Drift:** every route above targets `claude-mem:<slug>` in the separately-installed thedotmack/claude-mem plugin (always-latest, not bundled). If `<slug>` no longer exists there because upstream renamed or removed it, that route is a silent no-op: never substitute a nearby-sounding skill. Treat a broken route as this overlay needing an update, not as license to improvise.

## Priority on collision

When more than one branch matches, resolve top-down:

1. **Memory**: a question about past work is answered by mem-search, not recalled.
2. **Orientation**: an unfamiliar codebase is learned before a plan is made.
3. **Planning**: no plan means make-plan before do.
4. **Handoff**: a session that ends with open work gets a handoff.
5. Everything else in lifecycle order.

## Phases

1. **Recall**: claude-mem:mem-search. Gate: prior decisions cited.
2. **Orient**: claude-mem:learn-codebase or claude-mem:smart-explore. Gate: structure understood.
3. **Plan**: claude-mem:make-plan. Gate: phased plan written.
4. **Execute**: claude-mem:do. Gate: each phase verified.
5. **Close**: claude-mem:handoff. Gate: next steps recorded.

**Shortcuts:** Resume work -> mem-search -> do. Unknown repo -> learn-codebase -> make-plan -> do. Quick question about the past -> mem-search only.

## You are rationalizing if you think…

- "I remember how we did this." → mem-search. Memory in the context is not memory in the store.
- "I will skim one file to get oriented." → learn-codebase or smart-explore. Orientation first.
- "The plan is in my head." → make-plan. Written, phased, then do.
- "The next session can figure it out." → handoff. Write it now.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills by Alex Newman, Apache-2.0 (https://github.com/thedotmack/claude-mem). FLOW.md routing by Flowy, CC-BY-SA-4.0.
