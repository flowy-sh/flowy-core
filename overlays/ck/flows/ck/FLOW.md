# FLOW.md: juliusbrussee/cavekit

> Routes all 9 skills from `JuliusBrussee/cavekit` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ a bug was just found or a test just failed, and about to decide if the specification needs a new rule to catch it next time?  → invoke ck:backprop   gate: a new invariant is appended to the specification and traced back to the failure that caused it
  ├─ about to implement code directly against an existing specification, one step at a time?  → invoke ck:build   gate: the implementation matches the specification and any failure was traced into a new invariant before retrying
  ├─ about to write or edit the specification document and needing it to stay compact rather than prose?  → invoke ck:caveman   gate: the specification text is written in a terse compressed form instead of full prose, at a fraction of the token count
  ├─ wanting to know whether the code has drifted from the specification, without changing anything yet?  → invoke ck:check   gate: a read-only report lists violations grouped by severity, with nothing written to the specification or the code
  ├─ spare time or budget available and looking for a module whose design is shallower than it should be?  → invoke ck:deepen   gate: a proposed refactor shrinks an interface or hides a decision while tests stay green before and after
  ├─ an idea is still fuzzy and has not yet been turned into a specification?  → invoke ck:grill   gate: each answered question lands under a goal or a constraint, and every unknown is marked rather than guessed
  ├─ the specification depends on an external library or fact that has not been confirmed from a real source yet?  → invoke ck:research   gate: each finding in the log cites a source, and anything unsourced is flagged rather than stated as fact
  ├─ the specification is written and about to be trusted, before any code gets implemented from it?  → invoke ck:review   gate: a skeptical pass tries to refute the specification and each objection cites file and line evidence
  ├─ about to create, amend, or distill the specification document itself, the one place all sections get written?  → invoke ck:spec   gate: the specification document at the repo root is created or amended with the new section content
```

**Drift:** every route above targets `ck:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **ck** (https://github.com/JuliusBrussee/cavekit). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
