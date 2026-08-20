# FLOW.md: openzeppelin/openzeppelin-skills

> Routes all 11 skills from `OpenZeppelin/openzeppelin-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ wiring a ready-made token standard or access-control building block into a contract, chain not yet the deciding factor?  → invoke openzeppelin-skills:develop-secure-contracts   gate: the contract compiles importing the library building block rather than a hand-rolled version
  ├─ code written for the Sui chain already integrates the library and someone wants it checked before release?  → invoke openzeppelin-skills:review-sui-contracts   gate: a list of pattern deviations from the library conventions comes back against that existing code
  ├─ starting a brand-new project written in Cairo for Starknet with nothing scaffolded yet?  → invoke openzeppelin-skills:setup-cairo-contracts   gate: a fresh project builds with the dependency declared in its package manifest
  ├─ starting a brand-new project written in Solidity and the toolchain is not wired up yet?  → invoke openzeppelin-skills:setup-solidity-contracts   gate: a fresh Hardhat or Foundry project builds with the dependency importable
  ├─ starting a brand-new project on the Stellar network with no toolchain installed yet?  → invoke openzeppelin-skills:setup-stellar-contracts   gate: the CLI and Rust toolchain install and a fresh project builds
  ├─ starting a brand-new Rust-based project targeting Arbitrum with no WASM toolchain yet?  → invoke openzeppelin-skills:setup-stylus-contracts   gate: the WASM target installs and a fresh project builds
  ├─ starting a brand-new Move package for the Sui chain with nothing scaffolded yet?  → invoke openzeppelin-skills:setup-sui-contracts   gate: a fresh package builds with the dependency resolved through the registry
  ├─ an existing contract written in Cairo needs to become swappable to a new class hash after deployment?  → invoke openzeppelin-skills:upgrade-cairo-contracts   gate: the deployed contract accepts a class-hash replacement and keeps its state after the swap
  ├─ an existing contract written in Solidity needs a proxy pattern added so its logic can change after deployment?  → invoke openzeppelin-skills:upgrade-solidity-contracts   gate: the proxy deploys, and calling the initializer instead of a constructor sets up state correctly
  ├─ an existing contract on the Stellar network needs its compiled binary swapped without losing state?  → invoke openzeppelin-skills:upgrade-stellar-contracts   gate: the running contract accepts a new binary and existing state migrates atomically
  ├─ an existing Rust-based contract on Arbitrum needs its logic swappable after deployment?  → invoke openzeppelin-skills:upgrade-stylus-contracts   gate: the running contract reactivates new logic while keeping the same on-chain address and state
```

**Drift:** every route above targets `openzeppelin-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **openzeppelin-skills** (https://github.com/OpenZeppelin/openzeppelin-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
