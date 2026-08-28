# FLOW.md: gmgnai/gmgn-skills

> Routes all 9 skills from `gmgnai/gmgn-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to create and launch a brand new coin on a bonding curve venue, or asked how many launches a venue has produced?  → invoke gmgn-cli:gmgn-cooking   gate: the user confirms in writing before any launch is broadcast
  ├─ about to judge whether one coin supply is concentrated in whale, sniper, bundler or insider wallets?  → invoke gmgn-cli:gmgn-holder-analysis   gate: a chip distribution and entry cost breakdown with a structural rating is on screen
  ├─ about to classify a token's candles into a named chart pattern and score it, rather than just pull the raw candle numbers?  → invoke gmgn-cli:gmgn-kline-pattern   gate: a named pattern with a 0-100 score and each point's stated reason is returned
  ├─ about to answer which coins are trending, newly launched or most searched, or to pull candlestick history for a chain?  → invoke gmgn-cli:gmgn-market   gate: a ranked board or an OHLCV series for the named chain is returned
  ├─ about to evaluate one address for holdings, realized and unrealized profit and loss, win rate or its launch history?  → invoke gmgn-cli:gmgn-portfolio   gate: per address performance stats for the given chain are printed
  ├─ about to place a buy, a sell, a limit order, a stop loss, a take profit or a batch order across several wallets?  → invoke gmgn-cli:gmgn-swap   gate: the user confirms in writing before any order is submitted
  ├─ about to research one specific contract address for live price, liquidity, security audit or social links?  → invoke gmgn-cli:gmgn-token   gate: a per contract report covering price, liquidity, honeypot and rug risk is returned
  ├─ about to surface live buy and sell activity from smart money, influencer or followed wallets for alpha signals?  → invoke gmgn-cli:gmgn-track   gate: a timestamped feed of recent trades by the watched wallets is returned
  ├─ about to decide whether a given trader is worth copying, and whether their edge survives latency, slippage and gas?  → invoke gmgn-cli:gmgn-wallet-score   gate: three ratings are reported: profitability, copy viability and launcher reputation
```

**Drift:** every route above targets `gmgn-cli:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **gmgn-cli** (https://github.com/gmgnai/gmgn-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
