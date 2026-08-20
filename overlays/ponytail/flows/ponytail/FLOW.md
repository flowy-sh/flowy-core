# FLOW.md: dietrichgebert/ponytail

> Routes all 6 skills from `DietrichGebert/ponytail` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is the whole codebase suspected of over-engineering, with no particular diff in question?  → invoke ponytail:ponytail-audit   gate: a ranked list of what to delete, simplify, or replace with a standard library exists
  ├─ were shortcuts and deferrals left behind in comments that nobody is tracking?  → invoke ponytail:ponytail-debt   gate: a debt ledger collects every deferral marker found in the codebase
  ├─ did someone ask what this actually saves, in code, cost or speed?  → invoke ponytail:ponytail-gain   gate: a scoreboard of benchmark medians is displayed
  ├─ unsure which mode or command covers the situation in front of you?  → invoke ponytail:ponytail-help   gate: the applicable mode or command is named from the reference card
  ├─ is there a specific diff to review, and is over-engineering the only thing that matters in it?  → invoke ponytail:ponytail-review   gate: each finding names a location, what to cut, and what replaces it
  ├─ about to write code, and is the simplest thing that works not yet the plan?  → invoke ponytail:ponytail   gate: the task is questioned for necessity and the standard library is reached for before custom code
```

**Drift:** every route above targets `ponytail:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **ponytail** (https://github.com/DietrichGebert/ponytail). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
