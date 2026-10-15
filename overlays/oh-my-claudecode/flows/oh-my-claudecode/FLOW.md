# FLOW.md: Oh My Claude Code Flow

> Routes the 20 Oh My Claude Code skills (interviews, consensus planning, autonomous execution, verification and review) so the right one fires at the right phase: the agent cannot skip them and improvise.
> Skills by the oh-my-claudecode contributors (https://github.com/Yeachan-Heo/oh-my-claudecode, MIT). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill BEFORE doing the task yourself: do not write code, run a tool, or claim "done" until you have READ this FLOW.md and invoked every matched skill. Doing the work, or claiming "done", without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  ├─ request vague, requirements not yet stateable?   → invoke oh-my-claudecode:deep-interview   gate: ambiguity gated before execution
  ├─ vague ralph, autopilot or team request?          → invoke oh-my-claudecode:ralplan   gate: consensus plan approved
  ├─ task needs a strategic plan?                     → invoke oh-my-claudecode:omc-plan   gate: plan approved
  ├─ asked for full autonomous idea-to-code?          → invoke oh-my-claudecode:autopilot
  ├─ approved task to carry to working code?          → invoke oh-my-claudecode:execute   gate: code verified
  ├─ task must loop until a reviewer is satisfied?    → invoke oh-my-claudecode:ralph
  ├─ several agents needed on a shared task list?     → invoke oh-my-claudecode:team
  ├─ multi-goal work needing a durable ledger?        → invoke oh-my-claudecode:ultragoal
  ├─ about to write implementation code?              → invoke oh-my-claudecode:tdd   gate: one failing test first
  ├─ root cause unclear, rival hypotheses?            → invoke oh-my-claudecode:trace   gate: competing hypotheses weighed
  ├─ about to write or change code?                   → invoke oh-my-claudecode:minimal-code-discipline   gate: shortest correct diff
  ├─ about to claim done, fixed or passing?           → invoke oh-my-claudecode:verify   gate: command output proves it
  ├─ finished work before it ships?                   → invoke oh-my-claudecode:omc-review   gate: defects and risk listed
  ├─ AI-generated code cluttered or sloppy?           → invoke oh-my-claudecode:ai-slop-cleaner   gate: deletion first, regression-safe
  ├─ about to write a PR body?                        → invoke oh-my-claudecode:pr
  ├─ cutting a release?                               → invoke oh-my-claudecode:release
  ├─ external docs or web lookup needed?              → invoke oh-my-claudecode:external-context
  ├─ open question needing sourced findings?          → invoke oh-my-claudecode:research
  ├─ issue or PR needs an isolated worktree session?  → invoke oh-my-claudecode:project-session-manager
  ├─ an active OMC mode must stop?                    → invoke oh-my-claudecode:cancel
  ├─ scope changed mid-task (brief or reqs changed)?  → re-enter the earliest invalidated phase (oh-my-claudecode:deep-interview or oh-my-claudecode:omc-plan)
  ├─ blocked / waiting on an external dependency?  → park: record the blocker and resume condition; do not fake progress
  └─ question, not work (advise / explain)?  → answer only; no files change
```

**Drift:** every route above targets `oh-my-claudecode:<slug>` in the separately-installed Yeachan-Heo/oh-my-claudecode plugin (always-latest, not bundled). If `<slug>` no longer exists there because upstream renamed or removed it, that route is a silent no-op: never substitute a nearby-sounding skill. Treat a broken route as this overlay needing an update, not as license to improvise.

## Priority on collision

When more than one branch matches, resolve top-down:

1. **Tracing**: a broken state is traced before anything else.
2. **Verification**: a pending "done" claim goes through verify.
3. **Test first**: code about to be written gets its failing test.
4. **Planning**: no plan means plan before building.
5. **Interview**: no clear requirement means interview before planning.
6. Everything else in lifecycle order.

## Phases

1. **Clarify**: oh-my-claudecode:deep-interview. Gate: ambiguity resolved.
2. **Plan**: oh-my-claudecode:ralplan or oh-my-claudecode:omc-plan. Gate: plan approved.
3. **Build**: oh-my-claudecode:execute, oh-my-claudecode:ralph or oh-my-claudecode:team, with oh-my-claudecode:tdd inside. Gate: tests green.
4. **Verify**: oh-my-claudecode:verify. Gate: fresh output proves each claim.
5. **Ship**: oh-my-claudecode:omc-review, then oh-my-claudecode:pr. Gate: findings resolved.

**Shortcuts:** bug -> trace -> tdd -> verify -> omc-review. Small feature -> omc-plan -> execute -> verify. Typo or config -> fix -> verify.

## You are rationalizing if you think…

- "This is clear enough to start." → deep-interview. Ambiguity is the cheapest bug to remove now.
- "I will write the tests after." → tdd. Failing test first, always.
- "It obviously works." → verify. Run the command in THIS message.
- "I can guess the cause." → trace. Hypotheses compete, evidence picks.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills by the oh-my-claudecode contributors, MIT (https://github.com/Yeachan-Heo/oh-my-claudecode). FLOW.md routing by Flowy, CC-BY-SA-4.0.
