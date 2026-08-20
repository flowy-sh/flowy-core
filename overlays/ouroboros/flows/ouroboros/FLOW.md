# FLOW.md: q00/ouroboros

> Routes all 22 skills from `Q00/ouroboros` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ have a goal and want it taken all the way to an executed specification without stepping through each phase?  → invoke ouroboros:auto   gate: an A-grade specification exists and has been executed
  ├─ pointing this at an existing repository or worktree whose conventions should shape the questions?  → invoke ouroboros:brownfield   gate: the existing conventions were read before questioning began
  ├─ is an execution stuck or orphaned and still holding the session?  → invoke ouroboros:cancel   gate: the execution was terminated and the session released
  ├─ do the settings need changing rather than the work itself?  → invoke ouroboros:config   gate: the setting was changed and confirmed
  ├─ has an execution finished and not yet been verified?  → invoke ouroboros:evaluate   gate: all three verification stages reported
  ├─ does the work need to iterate toward a target rather than run once?  → invoke ouroboros:evolve   gate: an iteration loop is running with its target stated
  ├─ unsure which command or agent covers the situation in front of you?  → invoke ouroboros:help   gate: the applicable command was named from the reference
  ├─ are the requirements still vague, so any specification written now would encode a guess?  → invoke ouroboros:interview   gate: the vague requirement is now a written, specific one
  ├─ did the user type the bare launch word, or ask to start this system for the first time?  → invoke ouroboros:ooo   gate: onboarding started and the user knows the next step
  ├─ is a product requirements document the artifact being asked for?  → invoke ouroboros:pm   gate: a PRD exists with its questions classified
  ├─ does a finished specification need to become tracked work other people can pick up?  → invoke ouroboros:publish   gate: the specification exists as tracked issues
  ├─ is there an artifact of any kind sitting unjudged, needing a pass or fail?  → invoke ouroboros:qa   gate: a pass or fail verdict with its reasoning
  ├─ should the iteration run as background jobs owned by the MCP rather than inside this session?  → invoke ouroboros:ralph   gate: background jobs are running and their handles recorded
  ├─ did the connection drop, leaving sessions in flight and unreachable?  → invoke ouroboros:resume-session   gate: in-flight sessions listed with the commands to re-attach
  ├─ does a validated specification already exist and need executing?  → invoke ouroboros:run   gate: the specification ran through the workflow engine
  ├─ has an interview produced results that are not yet a validated specification?  → invoke ouroboros:seed   gate: a validated specification exists
  ├─ is the installation unconfigured, so nothing can run yet?  → invoke ouroboros:setup   gate: setup completed and the installation is usable
  ├─ unclear whether a session is progressing, or how far it has drifted from the goal?  → invoke ouroboros:status   gate: current status and measured goal drift reported
  ├─ does the user want to learn this by doing rather than by reading?  → invoke ouroboros:tutorial   gate: the user completed a hands-on pass
  ├─ has progress stalled, with the same approach producing the same result each time?  → invoke ouroboros:unstuck   gate: a different approach was produced by at least one persona
  ├─ is the installed version behind, or is a fix expected that is not present?  → invoke ouroboros:update   gate: the installed version was checked against the latest
  ├─ is this a brand new user who has not been oriented yet?  → invoke ouroboros:welcome   gate: the user has been oriented and knows where to start
```

**Drift:** every route above targets `ouroboros:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **ouroboros** (https://github.com/Q00/ouroboros). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
