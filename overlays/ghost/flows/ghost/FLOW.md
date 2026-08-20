# FLOW.md: ghostsecurity/skills

> Routes all 7 skills from `ghostsecurity/skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ need to watch or replay the real requests an app sends?  → invoke ghost:proxy   gate: captured traffic is listed for the scoped domain before any claim about it
  ├─ about to analyse a codebase whose layout has never been mapped?  → invoke ghost:repo-context   gate: a written repository map exists before the first scan
  ├─ several scans are done and the user wants one answer?  → invoke ghost:report   gate: one ranked write up names which scan produced each finding
  ├─ asked whether the source itself carries exploitable flaws?  → invoke ghost:scan-code   gate: each finding names a file, a line and the vulnerability class
  ├─ asked whether the third party packages carry known holes?  → invoke ghost:scan-deps   gate: lockfiles are read and every CVE is listed with a fixed version
  ├─ worried a live credential is committed somewhere in the tree?  → invoke ghost:scan-secrets   gate: every hit names the file and the credential kind, values redacted
  ├─ holding a flagged issue whose truth is not established yet?  → invoke ghost:validate   gate: a true or false positive verdict is written with the evidence for it
```

**Drift:** every route above targets `ghost:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **ghost** (https://github.com/ghostsecurity/skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
