# FLOW.md: xbluesky/cortexes

> Routes all 6 skills from `XBlueSky/cortexes` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ has raw material just been distilled and do related existing pages now need to be updated to match it?  → invoke cortex:cortex-broadcast   gate: the related existing pages are updated and the pending queue is cleared
  ├─ does raw session material exist that still needs to be turned into refined, structured notes?  → invoke cortex:cortex-distill   gate: refined notes or project entries now exist, produced from the raw material
  ├─ has the user asked to save something to the external memory store, or did a save suggestion just fire, with nothing written yet?  → invoke cortex:cortex-evolve   gate: a new or updated note or project entry now exists in the store
  ├─ is the agent about to answer a non-trivial question about an ongoing project, or did the user ask to check saved notes, before the external memory store has been searched?  → invoke cortex:cortex-query   gate: the stored notes were searched and the answer references what was found
  ├─ is the current work thread ending before it is finished, in a way where the next session will need to pick this specific thread back up?  → invoke cortex:cortex-takeoff   gate: an ephemeral hand off note for that specific work thread now exists
  ├─ did the user refer to earlier work, an earlier session, or a topic that a startup listing named, in a way that has not yet been routed to a specific action?  → invoke cortex:using-cortex   gate: the request was routed to the matching specific action instead of answered from memory alone
```

**Drift:** every route above targets `cortex:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **cortex** (https://github.com/XBlueSky/cortexes). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
