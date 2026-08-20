# FLOW.md: okx/onchainos-skills

> Routes all 9 skills from `okx/onchainos-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is being asked to sign the user up for one specific named trading hackathon event?  → invoke onchainos-skills:okx-activity   gate: a confirmed registration entry for that named hackathon
  ├─ just received a payment-required response or needs to open, fund, or close a machine-to-machine payment channel?  → invoke onchainos-skills:okx-agent-payments-protocol   gate: a completed payment handshake with a signed payment header or a channel state change
  ├─ needs to check a balance, fetch a deposit address, log into an account, or move funds for the user, with no competition or hackathon involved?  → invoke onchainos-skills:okx-agentic-wallet   gate: a wallet read or transfer executed and confirmed in account state
  ├─ is registering, searching, or updating an agent identity, or moving a task through a marketplace lifecycle such as an offer, delivery, or dispute?  → invoke onchainos-skills:okx-ai   gate: an identity record or task listing with a confirmed status change
  ├─ has a user naming one specific third-party protocol or its token and needs the request routed to that protocol integration?  → invoke onchainos-skills:okx-dapp-discovery   gate: the request handed off to the matching named protocol integration
  ├─ wants to deposit, withdraw, claim, or view positions through the aggregated product, without naming any specific third-party protocol?  → invoke onchainos-skills:okx-defi   gate: an aggregator-side deposit, withdrawal, claim, or position view completed with no named protocol involved
  ├─ wants read-only on-chain price or market data for a token pair, with no named protocol and no prediction-market question involved?  → invoke onchainos-skills:okx-dex-market   gate: returned market data with no trade or protocol handoff executed
  ├─ wants to see, join, or claim rewards from an ongoing trading competition or leaderboard, as opposed to a one-time event signup?  → invoke onchainos-skills:okx-growth-competition   gate: a competition entry, leaderboard position, or claimed reward confirmed
  ├─ is a first-time or unsure user asking what this product is or how to use it, before any specific action intent is clear?  → invoke onchainos-skills:okx-guide   gate: the user handed off to the correct specific flow once their intent was classified
```

**Drift:** every route above targets `onchainos-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **onchainos-skills** (https://github.com/okx/onchainos-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
