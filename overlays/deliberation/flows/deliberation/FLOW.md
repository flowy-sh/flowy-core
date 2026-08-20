# FLOW.md: antonbabenko/deliberation

> Routes all 8 skills from `antonbabenko/deliberation` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is a system level design choice or structural tradeoff on the table before code gets written?  → invoke deliberation:architect   gate: the chosen structural approach is named along with the tradeoff it was picked over
  ├─ is a diff or file finished and ready to be checked for bugs, security holes, or maintainability problems?  → invoke deliberation:code-reviewer   gate: specific issues are listed against exact file locations, or a clean pass is explicitly stated
  ├─ does an observed failure have more than one plausible cause that needs ranking before touching any code?  → invoke deliberation:debugger   gate: candidate causes are ordered by likelihood and the smallest safe fix for the top one is proposed
  ├─ would this decision benefit from independent perspectives from more than one outside model before committing to an answer?  → invoke deliberation:deliberation   gate: the choice of which outside models to consult, and why, is stated before their input is used
  ├─ does a work plan exist and need a check that it can actually be executed before work starts on it?  → invoke deliberation:plan-reviewer   gate: each step of the plan is confirmed executable or flagged as blocked, before the first task begins
  ├─ does a claim about an external library, API, or accepted practice need to be checked against a real source before it is relied on?  → invoke deliberation:researcher   gate: the answer cites a specific external source rather than resting on recalled general knowledge
  ├─ before breaking a request into tasks, are there ambiguities or unstated requirements that have not been surfaced yet?  → invoke deliberation:scope-analyst   gate: a list of open questions or hidden requirements is produced before any task breakdown starts
  ├─ does a design or piece of code need to be checked for how it could be exploited by an attacker, not just for ordinary correctness bugs?  → invoke deliberation:security-analyst   gate: specific attack scenarios are named, each with a practical fix
```

**Drift:** every route above targets `deliberation:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **deliberation** (https://github.com/antonbabenko/deliberation). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
