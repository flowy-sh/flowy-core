# FLOW.md: worldwonderer/novel-to-game

> Routes all 7 skills from `worldwonderer/novel-to-game` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ has an approved game design and now needs a concrete visual style, camera, and audio direction locked before art production starts?  → invoke novel-to-game:game-art-direction   gate: a written direction covering visual style, camera and composition, color and material rules, HUD feedback, and audio
  ├─ has an approved design and direction and needs to hand off a compact build brief to get a playable version running on the target runtime?  → invoke novel-to-game:game-build   gate: a build brief plus a working build produced through iterative runs and captured evidence
  ├─ has a deconstructed source bible and a product brief and must choose which playable direction to pursue before deeper design work begins?  → invoke novel-to-game:game-concept   gate: three distinct candidate directions with explicit trade-offs and one selected prototype direction
  ├─ has a built, runnable version on the target runtime and needs proof it actually works before anyone calls it done?  → invoke novel-to-game:game-qa   gate: a recorded run showing real rendering, input, the core loop, one outcome, a restart, and noted limitations
  ├─ has a chosen concept direction and must turn it into one concrete system of rules, loop, and levels before art or build work starts?  → invoke novel-to-game:game-world-design   gate: a single design document defining the core loop, systems, level pacing, feedback, and failure states
  ├─ has a raw novel or story source and needs it broken down into game-usable material before any concept can be proposed?  → invoke novel-to-game:novel-game-analyze   gate: a sourced breakdown citing textual evidence for world rules, verbs, spaces, and characters
  ├─ has been asked to turn an entire novel into a playable game end to end, spanning intake through a verified build?  → invoke novel-to-game:novel-to-game   gate: a completed run through every adaptation stage ending in a checked playable build
```

**Drift:** every route above targets `novel-to-game:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **novel-to-game** (https://github.com/worldwonderer/novel-to-game). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
