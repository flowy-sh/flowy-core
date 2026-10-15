# FLOW.md: Matt Pocock Skills Flow

> Routes the 18 Matt Pocock Skills skills (grilling, specs and tickets, TDD, diagnosis and review) so the right one fires at the right phase: the agent cannot skip them and improvise.
> Skills by Matt Pocock (https://github.com/mattpocock/skills, MIT). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill BEFORE doing the task yourself: do not write code, run a tool, or claim "done" until you have READ this FLOW.md and invoked every matched skill. Doing the work, or claiming "done", without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  ├─ plan or design to stress-test, repo keeps docs?             → invoke mattpocock-skills:grill-with-docs   gate: glossary and ADRs updated as you go
  ├─ plan or design to stress-test, no docs needed?              → invoke mattpocock-skills:grill-me   gate: every open branch questioned
  ├─ design settled in conversation, not yet in the tracker?     → invoke mattpocock-skills:to-spec   gate: spec published, no interview
  ├─ spec exists, work not yet sliced?                           → invoke mattpocock-skills:to-tickets   gate: tracer-bullet tickets with blocking edges
  ├─ work too big for one session?                               → invoke mattpocock-skills:wayfinder   gate: map of decision tickets
  ├─ spec and tickets from to-spec / to-tickets ready to build?  → invoke mattpocock-skills:implement-spec
  ├─ other spec or ticket set ready to build?                    → invoke mattpocock-skills:implement
  ├─ building a feature or fix test-first?                       → invoke mattpocock-skills:tdd   gate: a failing test exists FIRST
  ├─ bug, failure, or slowdown reported?                         → invoke mattpocock-skills:diagnosing-bugs   gate: feedback loop built, cause proven
  ├─ design question prose cannot settle?                        → invoke mattpocock-skills:prototype   gate: throwaway answers the question
  ├─ designing or reshaping a module interface?                  → invoke mattpocock-skills:codebase-design
  ├─ terminology unclear, glossary or ADR to write?              → invoke mattpocock-skills:domain-modeling
  ├─ hunting architecture deepening opportunities?               → invoke mattpocock-skills:improve-codebase-architecture
  ├─ changes ready for review since a fixed point?               → invoke mattpocock-skills:code-review   gate: standards and spec axes checked
  ├─ about to write a PR body?                                   → invoke mattpocock-skills:pr
  ├─ topic needs primary-source research?                        → invoke mattpocock-skills:research   gate: findings captured in the repo
  ├─ issues or external PRs to move through triage?              → invoke mattpocock-skills:triage
  ├─ session ending, another agent will continue?                → invoke mattpocock-skills:handoff
  ├─ scope changed mid-task (brief or reqs changed)?  → re-enter the earliest invalidated phase (mattpocock-skills:grill-with-docs or mattpocock-skills:to-spec)
  ├─ blocked / waiting on an external dependency?  → park: record the blocker and resume condition; do not fake progress
  └─ question, not work (advise / explain)?  → answer only; no files change
```

**Drift:** every route above targets `mattpocock-skills:<slug>` in the separately-installed mattpocock/skills plugin (always-latest, not bundled). If `<slug>` no longer exists there because upstream renamed or removed it, that route is a silent no-op: never substitute a nearby-sounding skill. Treat a broken route as this overlay needing an update, not as license to improvise.

## Priority on collision

When more than one branch matches, resolve top-down:

1. **Diagnosis**: a broken state is diagnosed before anything is built.
2. **Test first**: code about to be written gets its failing test.
3. **Review**: finished changes are reviewed before a PR body is written.
4. **Specs**: no spec means spec before tickets, no tickets means tickets before building.
5. **Grilling**: no stress-tested design means grill before spec.
6. Everything else in lifecycle order.

## Phases

1. **Grill**: mattpocock-skills:grill-with-docs. Gate: open branches resolved.
2. **Spec**: mattpocock-skills:to-spec, then mattpocock-skills:to-tickets. Gate: tickets published.
3. **Build**: mattpocock-skills:implement-spec with mattpocock-skills:tdd inside. Gate: tests green.
4. **Review**: mattpocock-skills:code-review. Gate: findings addressed.
5. **Ship**: mattpocock-skills:pr, then mattpocock-skills:handoff if work continues.

**Shortcuts:** bug -> diagnose -> tdd (regression test) -> code-review. Small change -> tdd -> pr. Typo or config -> fix -> verify by running it.

## You are rationalizing if you think…

- "I understand the plan, no need to grill it." → Grill. Unspoken assumptions are the bugs.
- "I will write the tests after." → tdd. Failing test first, always.
- "I can see the cause already." → diagnosing-bugs. Build the loop, prove the cause.
- "The PR body is obvious." → Invoke pr. Thirty seconds.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills by Matt Pocock, MIT (https://github.com/mattpocock/skills). FLOW.md routing by Flowy, CC-BY-SA-4.0.
