# FLOW.md: tencentedgeone/edgeone-pages-skills

> Routes all 10 skills from `tencentedgeone/edgeone-pages-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is the agent building a new AI agent endpoint on this platform using one of its supported frameworks?  → invoke edgeone-makers-tools:makers-agents   gate: the endpoint uses the platform-injected context objects and streams responses correctly
  ├─ does the user need the exact command-line syntax for a dev, build, deploy, or environment task on this platform?  → invoke edgeone-makers-tools:makers-cli   gate: the correct command-line instruction is run and its output confirms the action
  ├─ is the agent writing server-side backend logic or an API route as a cloud function?  → invoke edgeone-makers-tools:makers-cloud-functions   gate: a cloud function handles the request and returns a response
  ├─ is shipping or publishing the project to the live platform part of the current task, even as a secondary step?  → invoke edgeone-makers-tools:makers-deploy   gate: the project is live at a reachable deployed URL
  ├─ does the task need lightweight request handling running at the edge rather than in a full backend runtime?  → invoke edgeone-makers-tools:makers-edge-functions   gate: a lightweight function handles the request directly at the edge
  ├─ is the agent running inside a sandboxed or non-interactive coding environment where normal commands might hang?  → invoke edgeone-makers-tools:makers-env-adaption   gate: commands are adapted to the restricted environment instead of hanging
  ├─ does an incoming request need to be intercepted, redirected, rewritten, or auth-checked before it reaches its destination?  → invoke edgeone-makers-tools:makers-middleware   gate: the intercepting layer runs before the request reaches its final handler
  ├─ does an existing agent or API project built elsewhere need converting to run on this platform?  → invoke edgeone-makers-tools:makers-migration   gate: the converted project runs under the platform conventions instead of its original ones
  ├─ is the user starting a brand new project and does it need a standard starting structure?  → invoke edgeone-makers-tools:makers-recipes   gate: a scaffolded project structure matching a known template exists
  ├─ does the task need persisting key-value data or files or objects rather than using a database?  → invoke edgeone-makers-tools:makers-storage   gate: data is written to and read back from the storage service
```

**Drift:** every route above targets `edgeone-makers-tools:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **edgeone-makers-tools** (https://github.com/tencentedgeone/edgeone-pages-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
