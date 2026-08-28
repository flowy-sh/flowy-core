# FLOW.md: superset-sh/superset

> Routes all 11 skills from `superset-sh/superset` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ the user wants a personalized audit of which advanced features, like automations, parallel agents, multi host configurations, or custom commands, they are not using yet?  → invoke superset:10x   gate: a personalized list of unused advanced features is produced
  ├─ the user wants a recurring chore turned into a scheduled agent that runs on its own on a daily or weekly cadence?  → invoke superset:automate   gate: a scheduled job is created through the command line and its first run is reviewed together
  ├─ the user wants an agent to open, screenshot, click through, or read the console of a web page?  → invoke superset:browser   gate: the requested browser action ran against a real pane and returned its result
  ├─ the user wants an agent to drive their real desktop apps or windows rather than a browser pane?  → invoke superset:computer   gate: the desktop action ran through the accessibility driver and the resulting state was confirmed
  ├─ the user wants to fork this open source project, clone it locally, and prepare a merge ready pull request?  → invoke superset:contribute   gate: local development is running and a pull request following the repo contribution rules is ready
  ├─ the user reports something broken or misbehaving in the tool itself, such as connection failures, offline hosts, or terminals not attaching, before any report gets sent to the maintainers?  → invoke superset:doctor   gate: the reported problem is diagnosed and resolved
  ├─ the user wants to report a bug, request a feature, or send a note to the maintainers either privately or as a public issue?  → invoke superset:feedback   gate: the bug report or feature request is submitted to the team or filed as a public issue
  ├─ the user wants to delegate or parallelize coding work across multiple isolated terminal agents and collect their structured results?  → invoke superset:orchestrate   gate: isolated workspaces are created, workers are launched, and their results are collected
  ├─ the user wants a report, dashboard, or analysis published as a shareable self-contained HTML page, or comments on one already published answered?  → invoke superset:page   gate: a new version is published and pinned comments are answered
  ├─ the user wants a repository prepared so every new workspace boots already configured with initialization, teardown, and run scripts?  → invoke superset:setup   gate: a real workspace boots configured using the authored scripts
  ├─ the user returns after being away and asks what their agents did, or wants a summary of finished, blocked, and needs review work?  → invoke superset:standup   gate: a digest sweeping workspaces, tasks, and terminals reports finished, blocked, and needs review items
```

**Drift:** every route above targets `superset:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **superset** (https://github.com/superset-sh/superset). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
