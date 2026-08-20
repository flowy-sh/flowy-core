# FLOW.md: atlassian/forge-skills

> Routes all 6 skills from `atlassian/forge-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to scaffold a new app, add a module or manifest change, or implement backend or UI code for this platform?  → invoke forge-skills:forge-app-builder   gate: the implementation matches the current official platform documentation, not assumed or remembered behavior
  ├─ is an app about to be released and does it need a broad readiness pass across its manifest, architecture, dependencies, tests, and deploy steps?  → invoke forge-skills:forge-app-review   gate: a readiness checklist covering manifest, architecture, dependencies, tests, and deploy steps was completed, with obvious smells noted
  ├─ does the user want to build or deploy an app that pulls external data into the workspace search and chat graph?  → invoke forge-skills:forge-connector   gate: the ingestion app is wired to that graph and its content becomes searchable there
  ├─ is the goal specifically to reduce this platform runtime cost, invocation count, compute seconds, or storage and log usage of an existing app?  → invoke forge-skills:forge-cost-optimizer   gate: a measured before and after consumption number backs the change, using the official cost guidance for that platform
  ├─ is an app on this platform erroring, crashing, showing a blank UI, failing to deploy, missing after installation, or hitting a permission problem?  → invoke forge-skills:forge-debugger   gate: the specific failure was reproduced and traced to a cause before any fix was applied
  ├─ has the user asked specifically for a security audit, vulnerability assessment, or an authorization and tenant isolation review, rather than a general release check?  → invoke forge-skills:forge-security-review   gate: each finding cites the specific code evidence and the security rule it violates
```

**Drift:** every route above targets `forge-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **forge-skills** (https://github.com/atlassian/forge-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
