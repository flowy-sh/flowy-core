# FLOW.md: Agent Skills Flow

> Routes the 24 addyosmani/agent-skills so the right one fires at the right gate, and disambiguates the four rival `-driven-development` skills that otherwise compete for every single implementation task.
> Skills by Addy Osmani (https://github.com/addyosmani/agent-skills, MIT). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

<!-- external-skills: agent-skills -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Do not write the code, the spec or the commit first. Producing the artifact when a trigger matched and you did not invoke is a VIOLATION, not a shortcut, and naming a skill without calling it is not invoking.

```
USER MESSAGE
  │
  ├─ session start, or you cannot name which skill applies?  → invoke agent-skills:using-agent-skills     gate: the applicable skill is named
  ├─ output quality is degrading, or you are switching tasks? → invoke agent-skills:context-engineering    gate: the context is deliberately set
  │
  ├─ WHAT ARE WE BUILDING (stop here before any code)
  │    ├─ the idea is still vague and has no sharp shape?     → invoke agent-skills:idea-refine            gate: one actionable concept
  │    ├─ you are INFERRING what the user wants, not knowing? → invoke agent-skills:interview-me           gate: ~95% confidence, asked not assumed
  │    └─ requirements are clear and NO SPEC EXISTS yet?      → invoke agent-skills:spec-driven-development gate: a written spec
  │
  ├─ a spec exists and the work is not yet ordered tasks?     → invoke agent-skills:planning-and-task-breakdown  gate: ordered, implementable tasks
  │
  ├─ THE FOUR RIVAL `-driven-development` SKILLS. This is the fork this Flow exists to settle.
  │  They are not alternatives to pick by taste. Each answers a DIFFERENT question, and more
  │  than one can fire on the same task. Resolve them in this order:
  │    ├─ the decision is hard to REVERSE and correctness beats speed?  → invoke agent-skills:doubt-driven-development   gate: an adversarial review survived
  │    ├─ it depends on an external API or library you are RECALLING?   → invoke agent-skills:source-driven-development  gate: every claim cites official docs
  │    ├─ about to write logic, fix a bug, or change behaviour?         → invoke agent-skills:test-driven-development    gate: a FAILING test exists first
  │    └─ the change touches more than one file?                        → invoke agent-skills:incremental-implementation gate: shipped in reviewable slices
  │
  ├─ BUILDING A PARTICULAR THING
  │    ├─ designing a public API, module boundary or type contract?  → invoke agent-skills:api-and-interface-design     gate: the contract is written down
  │    ├─ building or changing a user-facing interface?              → invoke agent-skills:frontend-ui-engineering      gate: accessible and responsive
  │    ├─ it runs in a browser and you are guessing at its state?    → invoke agent-skills:browser-testing-with-devtools gate: observed in a real browser
  │    ├─ handling user input, auth, storage or a third party?       → invoke agent-skills:security-and-hardening       gate: the threat is named and closed
  │    ├─ a performance requirement exists, or you suspect a problem? → invoke agent-skills:performance-optimization    gate: measured before and after
  │    └─ shipping something whose production behaviour must be seen? → invoke agent-skills:observability-and-instrumentation gate: it is diagnosable in prod
  │
  ├─ tests fail, the build breaks, or behaviour surprises you?  → invoke agent-skills:debugging-and-error-recovery  gate: root cause written down
  │
  ├─ CODE EXISTS
  │    ├─ about to merge ANY change, yours or an agent's?     → invoke agent-skills:code-review-and-quality  gate: findings addressed
  │    └─ it works but is harder to read than it should be?   → invoke agent-skills:code-simplification      gate: behaviour identical, intent clearer
  │
  ├─ GETTING IT OUT
  │    ├─ committing, branching, or resolving a conflict?      → invoke agent-skills:git-workflow-and-versioning gate: history a reviewer can follow
  │    ├─ setting up or changing build and deploy pipelines?   → invoke agent-skills:ci-cd-and-automation       gate: the gate runs unattended
  │    ├─ about to deploy to production?                       → invoke agent-skills:shipping-and-launch        gate: pre-launch checklist cleared
  │    ├─ removing an old system, or moving users off one?     → invoke agent-skills:deprecation-and-migration  gate: a migration path exists
  │    └─ an architectural decision was made, or an API changed? → invoke agent-skills:documentation-and-adrs   gate: the decision is recorded with its why
  │
  ├─ SCOPE CHANGE. The goal or the inputs changed mid-stream.
  │    └─ re-enter the earliest invalidated phase. Stale inputs invalidate everything downstream.
  │
  ├─ BLOCKED. A gate needs an input you do not have.
  │    └─ name the missing input and the resume condition, then stop. Never fabricate the artifact to move on.
  │
  └─ ADVISORY. The user asked a question and no artifact is being produced.
       └─ answer only; no files change.
```

**Drift:** every route above targets `agent-skills:<slug>` in the separately-installed
addyosmani/agent-skills plugin. If a slug no longer exists there because upstream renamed or
removed it, that route is a silent no-op. Never substitute a nearby-sounding skill, and never
fall back to a same-named skill from another plugin. Treat a broken route as this overlay
needing an update, not as licence to improvise.

## Priority on collision

Resolve top-down.

1. **Blocked**: stop and name the missing input.
2. **Scope changed**: re-enter the earliest invalidated phase.
3. **Broken**: `debugging-and-error-recovery` before anything that builds on the broken thing.
4. **The `-driven-development` fork**: reversibility first, then sourcing, then tests, then slicing. They COMPOUND, they do not replace one another.
5. Otherwise lifecycle order: understand, then specify, then plan, then build, then review, then ship.
6. **Advisory** answers produce no files.

**The name collision that outranks all of this.** `test-driven-development` also exists in
obra/superpowers. If both plugins are installed, `test-driven-development` alone is ambiguous
and the host may resolve it either way. Every route here is plugin-qualified for that reason.
Write `agent-skills:test-driven-development`, never the bare slug.

## Phases

1. **Orient**: `using-agent-skills`, `context-engineering`. Gate: you can name the skill that applies.
2. **Understand**: `idea-refine`, `interview-me`. Gate: the goal is the user's, not your inference of it.
3. **Specify**: `spec-driven-development`. Gate: a written spec.
4. **Plan**: `planning-and-task-breakdown`. Gate: ordered, implementable tasks.
5. **Build**: the four `-driven-development` skills plus the domain skills. Gate: a failing test came first, and external claims cite sources.
6. **Review**: `code-review-and-quality`, `code-simplification`. Gate: findings addressed.
7. **Ship**: `git-workflow-and-versioning`, `ci-cd-and-automation`, `shipping-and-launch`, `deprecation-and-migration`, `documentation-and-adrs`. Gate: deployed, observable, and the decision recorded.

**Shortcut for a bug**: debugging then `agent-skills:test-driven-development` for the regression test, then review, then ship. Skip Understand and Specify.

## You are rationalizing if you think…

- "I already know which of the four `-driven-development` skills this is." → You are choosing by habit. Read the fork. They compound.
- "The test can come after; I can see it works." → `agent-skills:test-driven-development`. A test written after passes immediately and proves nothing.
- "I know this API." → `agent-skills:source-driven-development`. Recall is where outdated patterns enter, and you cannot tell recall from knowledge from the inside.
- "This decision is probably fine." → If it is hard to reverse, `agent-skills:doubt-driven-development`. Probably is not a gate.
- "It is one small file, I will just do it." → Invoke anyway. The cost is seconds and the habit is the product.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills routed by this Flow are by **Addy Osmani**, MIT licensed, at
https://github.com/addyosmani/agent-skills. This overlay bundles none of them: it installs the
routing only, and the skills come from that separately-installed plugin. Upstream publishes it
as the plugin named agent-skills inside its own marketplace, which is why every route above is
plugin-qualified.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
