# FLOW.md: datadog/pup

> Routes all 11 skills from `DataDog/pup` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is the question about traces, service dependencies, or where the latency is actually going?  → invoke pup:dd-apm   gate: the slow span or dependency is named
  ├─ should this become code inside the application rather than a one-off command?  → invoke pup:dd-code-generation   gate: generated code is integrated rather than pasted at a prompt
  ├─ do you need the real runtime values a function receives, without redeploying to get them?  → invoke pup:dd-debugger   gate: a probe captured live values from the running service
  ├─ is a product detail unclear and worth reading rather than recalling?  → invoke pup:dd-docs   gate: the answer cites the documentation page it came from
  ├─ is the fault in the tooling itself rather than in the service being observed?  → invoke pup:dd-file-issue   gate: the issue is filed against the right repository
  ├─ searching logs, or is the log volume itself the cost problem?  → invoke pup:dd-logs   gate: the query returned, or the pipeline and retention were adjusted
  ├─ creating, changing or silencing an alert?  → invoke pup:dd-monitors   gate: the alert exists with a threshold somebody can defend
  ├─ about to run the CLI, or is authentication not established yet?  → invoke pup:dd-pup   gate: authenticated, with token refresh working
  ├─ need to know which methods a service actually exposes before probing one?  → invoke pup:dd-symdb   gate: the symbol was found and is probe-able
  ├─ is one specific test failing intermittently rather than consistently?  → invoke pup:dd-triage-flaky-test   gate: its history and failure pattern classified, with an action chosen
  ├─ is a pull request blocked by CI with the cause not yet attributed?  → invoke pup:dd-unblock-pr   gate: each failure attributed as flaky, infra or regression
```

**Drift:** every route above targets `pup:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **pup** (https://github.com/DataDog/pup). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
