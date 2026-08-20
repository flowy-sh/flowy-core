# FLOW.md: deepaksinghcs14/deadeye-cc

> Routes all 8 skills from `deepaksinghcs14/deadeye-cc` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to write or modify implementation code and wanting to keep the change as lean and minimal as possible?  → invoke deadeye:deadeye-coder   gate: the diff uses standard library first and stays as short as the task allows
  ├─ is it time to see the running list of every intentional shortcut left behind across the codebase so far?  → invoke deadeye:deadeye-debt   gate: a ledger listing each shortcut marker and its location is produced
  ├─ does the user want to see the actual measured payoff of past decisions, not just a description of what changed?  → invoke deadeye:deadeye-gain   gate: a scoreboard shows real before and after numbers pulled from the decision log
  ├─ is a set of changes about to ship and does it need a check for injection risks, exposed secrets, access control, crypto misuse, or unsafe dependencies?  → invoke deadeye:deadeye-guard   gate: a security finding list covering those specific risk categories is produced for the diff
  ├─ is the user unsure what commands or settings this toolkit offers and asking for a rundown?  → invoke deadeye:deadeye-help   gate: a reference card listing every command and setting is shown
  ├─ has a diff just been written and does it need a check for unnecessary complexity that should be cut or replaced with something simpler?  → invoke deadeye:deadeye-review   gate: a list pairing what to delete with its simpler replacement is produced for the diff
  ├─ does the user want a full repository pass hunting for the largest opportunities to cut complexity, not just the current diff?  → invoke deadeye:deadeye-sweep   gate: a repo-wide list of cuts ranked from biggest to smallest is produced
  ├─ is the codebase still unfamiliar and does it call for building an overview first before reading any file in full?  → invoke deadeye:explore   gate: an index and signature summary exist before any full file read happens
```

**Drift:** every route above targets `deadeye:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **deadeye** (https://github.com/deepaksinghcs14/deadeye-cc). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
