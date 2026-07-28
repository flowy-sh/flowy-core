# FLOW.md: __TITLE__

> One sentence saying what this Flow gets done, and what it refuses to let you skip.
> Skills by their authors under their own licenses. Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce, READ/invoke, host-wins,
     post-compaction re-read). This file carries ONLY the routing.

     AUTHORING RULES (docs/decisions/2026-07-28-flow-authoring-rules.md). The mechanical
     ones are enforced by engine/tools/flow-rules.mjs; the other two are on you:
       R1 every skill you NAME has a route line. No passive "also available" index.
       R2 triggers are AGENT-STATE conditions ("about to X?"), never user quotes.
       R3 every route line carries the verb `invoke`.
       R4 the advisory escape is exactly "answer only; no files change".
       R5 Routing is the FIRST section.
       R6 no claimed count the file cannot back, and keep the drift clause.
       R7 imperative register; name the violation.

     R1 is binary: give a skill a trigger, or remove its name. There is no third
     option where it stays listed without one. That was the defect that stopped a
     whole Flow from firing. -->

<!-- external-skills: example-plugin -->

## Routing

**The rule. MANDATORY, not advisory.** When a trigger matches, INVOKE the named skill with the
Skill tool BEFORE producing anything. Do not draft the artifact first. Producing it when a
trigger matched and you did not invoke is a VIOLATION, not a shortcut, and naming a skill
without calling it is not invoking.

```
USER MESSAGE
  │
  ├─ about to do the thing this Flow exists for?   → invoke example-plugin:example-skill   gate: the artifact this produces
  │
  ├─ SCOPE CHANGE. The goal or inputs changed mid-stream.
  │    └─ re-enter the earliest invalidated phase. Stale inputs invalidate everything downstream.
  │
  ├─ BLOCKED. A gate needs an input you do not have.
  │    └─ name the missing input and the resume condition, then stop. Never fabricate the artifact to move on.
  │
  └─ ADVISORY. The user asked a question and no artifact is being produced.
       └─ answer only; no files change.
```

**Drift:** every route targets a skill in a separately installed plugin. If a slug no longer
exists there, that route is a silent no-op. Never substitute a nearby-sounding skill. A broken
route means this Flow needs an update, not that you may improvise.

## Priority on collision

Resolve top-down. 1. Blocked: stop and name the missing input. 2. Scope changed: re-enter the
earliest invalidated phase. 3. Otherwise lifecycle order. 4. Advisory answers without producing
files.

## Phases

Describe the lifecycle this Flow enforces, and the artifact each phase exits on.

## You are rationalizing if you think…

- "This one is too small to route." → Invoke it anyway. The cost is seconds and the habit is the product.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Routed skills belong to their authors under their own licenses; this Flow bundles none of them.
Replace this line with the real author, license, and source for every skill you route to.

Routing (this FLOW.md) by __TITLE__.
