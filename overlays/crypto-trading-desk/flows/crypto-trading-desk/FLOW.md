# FLOW.md: hugoguerrap/crypto-claude-desk

> Routes all 8 skills from `hugoguerrap/crypto-claude-desk` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does the user want a deep, multi-step read across several agents on a coin before deciding anything?  → invoke crypto-trading-desk:analyze   gate: a phased multi-agent report on the asset is produced
  ├─ is an open position finished and ready to be settled with a look back at what happened?  → invoke crypto-trading-desk:close-trade   gate: the position is marked settled with a post mortem note attached
  ├─ does the user want an entirely new server, agent, or skill added to extend this system rather than using what already exists?  → invoke crypto-trading-desk:create   gate: a new component scaffold appears in the project for that server, agent, or skill
  ├─ should the desk run unattended in the background, continuously watching open positions against their targets?  → invoke crypto-trading-desk:monitor   gate: a recurring background loop is checking positions and logging summaries on a schedule
  ├─ does the user want a snapshot of everything currently held and how it is performing right now?  → invoke crypto-trading-desk:portfolio   gate: a status snapshot listing current holdings and performance stats is shown
  ├─ does the user want a fast single pass read on a coin without the full multi-agent process?  → invoke crypto-trading-desk:quick   gate: a short single-agent readout on the asset returns
  ├─ is this the first time the desk is being installed and does the environment still need to be prepared and checked?  → invoke crypto-trading-desk:setup   gate: dependencies are installed and an environment check passes
  ├─ have earlier forecasts come due and does the outcome now need checking against what the market actually did?  → invoke crypto-trading-desk:validate-predictions   gate: pending forecasts are marked correct or incorrect against real market data
```

**Drift:** every route above targets `crypto-trading-desk:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **crypto-trading-desk** (https://github.com/hugoguerrap/crypto-claude-desk). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
