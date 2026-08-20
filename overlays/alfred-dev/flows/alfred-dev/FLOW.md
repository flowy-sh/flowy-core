# FLOW.md: 686f6c61/alfred-dev

> Routes all 11 skills from `686f6c61/alfred-dev` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to verify whether a project meets european data protection or cyber resilience regulations?  → invoke alfred-dev:compliance-check   gate: a pass or fail status is reported against the named regulations
  ├─ about to add a brand new third party dependency to a project?  → invoke alfred-dev:evaluate-dependency   gate: the license, known vulnerabilities and transitive dependencies of the package are reported before install
  ├─ about to respond to a live production outage or a critical error that needs triage right now?  → invoke alfred-dev:incident-response   gate: a postmortem naming root cause and mitigation steps is produced
  ├─ about to record a design decision or recall a past project decision instead of guessing at history?  → invoke alfred-dev:memory   gate: the decision is written to, or read from, the persistent project decision store
  ├─ about to open a pull request and need it fully described with labels and reviewers attached?  → invoke alfred-dev:pr-workflow   gate: a pull request exists with a description, labels, and reviewers set
  ├─ about to produce a software bill of materials for supply chain compliance?  → invoke alfred-dev:sbom-generate   gate: a CycloneDX or SPDX bill of materials file is produced
  ├─ about to run an automated static analysis pass against a running quality scanner?  → invoke alfred-dev:sonarqube   gate: a static analysis report with coverage and code smells is produced
  ├─ about to pick a visual look and feel for an interface heavy project with a companion design tool?  → invoke alfred-dev:style-direction   gate: a local server runs and visual design artifacts are written to disk
  ├─ about to wrap up a phase of work on a project and need its living documentation brought up to date?  → invoke alfred-dev:sync-project-docs   gate: architecture, regulatory, and risk documentation are all updated together
  ├─ about to map attack vectors and exposure for a system using a structured risk assessment method?  → invoke alfred-dev:threat-model   gate: a document listing attack vectors by category is produced using a named methodology
  ├─ about to record or close out a decision about stack, persistence, auth, or architecture boundaries?  → invoke alfred-dev:write-adr   gate: an architecture decision record file exists in the decisions folder
```

**Drift:** every route above targets `alfred-dev:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **alfred-dev** (https://github.com/686f6c61/alfred-dev). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
