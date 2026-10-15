# FLOW.md: Caveman Flow

> Routes the 13 Caveman skills (terse output modes and scope-disciplined build, patch, refactor and verify work) so the right one fires at the right phase: the agent cannot skip them and improvise.
> Skills by Julius Brussee (https://github.com/JuliusBrussee/caveman, Apache-2.0). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill BEFORE doing the task yourself: do not write code, run a tool, or claim "done" until you have READ this FLOW.md and invoked every matched skill. Doing the work, or claiming "done", without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  ├─ user asks for terse, brief or low-token answers?              → invoke caveman:caveman   gate: mode stays on until told to stop
  ├─ failure with unknown or intermittent cause?                   → invoke caveman:investigate-first   gate: evidence-ranked hypotheses written
  ├─ fixing a bug or small behavior change?                        → invoke caveman:surgical-patch   gate: narrowest responsible layer
  ├─ new behavior with overbuilding risk?                          → invoke caveman:lean-build   gate: stop condition stated
  ├─ restructuring code, behavior must not change?                 → invoke caveman:safe-refactor   gate: verification brackets the edit
  ├─ schema, API, data or dependency migration?                    → invoke caveman:migration   gate: rollback and preservation proof
  ├─ validation-only task or last-mile completion check?           → invoke caveman:verify-and-stop   gate: acceptance conditions proven
  ├─ reviewing a diff or PR?                                       → invoke caveman:caveman-review   gate: one line per finding
  ├─ writing a commit message?                                     → invoke caveman:caveman-commit
  ├─ cold start, broad cross-file search or failed direct search?  → invoke caveman:caveman-explore   gate: read-only
  ├─ delegating a locate, small edit or diff review?               → invoke caveman:cavecrew
  ├─ memory file such as CLAUDE.md to shrink?                      → invoke caveman:caveman-compress   gate: backup kept
  ├─ asked about token usage this session?                         → invoke caveman:caveman-stats
  ├─ scope changed mid-task (brief or reqs changed)?  → re-enter the earliest invalidated phase (caveman:lean-build or caveman:investigate-first)
  ├─ blocked / waiting on an external dependency?  → park: record the blocker and resume condition; do not fake progress
  └─ question, not work (advise / explain)?  → answer only; no files change
```

**Drift:** every route above targets `caveman:<slug>` in the separately-installed JuliusBrussee/caveman plugin (always-latest, not bundled). If `<slug>` no longer exists there because upstream renamed or removed it, that route is a silent no-op: never substitute a nearby-sounding skill. Treat a broken route as this overlay needing an update, not as license to improvise.

## Priority on collision

When more than one branch matches, resolve top-down:

1. **Investigation**: an unknown cause is investigated before any edit.
2. **Verification**: a pending "done" claim goes through verify-and-stop.
3. **Scope**: new behavior goes through lean-build, small fixes through surgical-patch.
4. **Voice**: caveman applies on request, never delays the work above.
5. Everything else in lifecycle order.

## Phases

1. **Diagnose**: caveman:investigate-first. Gate: cause ranked by evidence.
2. **Change**: caveman:surgical-patch, caveman:lean-build, caveman:safe-refactor or caveman:migration. Gate: scope held.
3. **Prove**: caveman:verify-and-stop. Gate: command output proves each claim.
4. **Report**: caveman:caveman-review or caveman:caveman-commit. Gate: findings one line each.

**Shortcuts:** bug -> investigate-first -> surgical-patch -> verify-and-stop. Feature -> lean-build -> verify-and-stop. Refactor -> safe-refactor -> verify-and-stop.

## You are rationalizing if you think…

- "I will just edit and see." → investigate-first. Cause before edit.
- "While I am here I will tidy the neighbours." → lean-build and surgical-patch hold the scope. Do not.
- "It obviously works." → verify-and-stop. Run the command in THIS message.
- "Brief means skip the skill." → Brevity changes the voice, not the routing.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills by Julius Brussee, Apache-2.0 (https://github.com/JuliusBrussee/caveman). FLOW.md routing by Flowy, CC-BY-SA-4.0.
