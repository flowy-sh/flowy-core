# FLOW.md: drobins25/craft

> Routes all 11 skills from `drobins25/craft` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is this a small, targeted fix or tweak that does not need a full planning process?  → invoke craft:adhoc   gate: the change ships directly without a formal planning stage
  ├─ is the agent about to write or modify a file while the write gate is closed?  → invoke craft:approve   gate: a scoped write permission is granted before any file changes
  ├─ does the task require navigating a live web page, clicking elements, or filling in forms?  → invoke craft:browser   gate: a live web page is opened and the interaction is performed
  ├─ is a story structure already defined while its content remains undecided?  → invoke craft:content-spark   gate: content items are split into resolved versus assumed lists
  ├─ did the user ask to explore multiple creative directions before committing to one?  → invoke craft:creative-spark   gate: several distinct options are generated before one is chosen
  ├─ does the user want to define or refine the aesthetic feel and mood of the product?  → invoke craft:design-vibe   gate: a written description of the visual language or mood exists
  ├─ did the user just accept a choice and ask for it to become the standard going forward?  → invoke craft:lock-decision   gate: the decision is written into a permanent standards record
  ├─ does a story need to be broken into implementation steps before building starts?  → invoke craft:plan-chunks   gate: a detailed breakdown of implementation steps exists
  ├─ did a validation step report build, lint, or type errors that need surgical fixes?  → invoke craft:refine-chunk   gate: the reported errors are resolved and the check is rerun
  ├─ did a validation step report failing tests specifically?  → invoke craft:test-fix   gate: the failing tests pass after the fix
  ├─ has an implementation step just finished and does it need a pass or fail verdict before proceeding?  → invoke craft:validate-chunk   gate: a verdict is recorded and failures are routed to a fix step
```

**Drift:** every route above targets `craft:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **craft** (https://github.com/drobins25/craft). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
