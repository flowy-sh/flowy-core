# FLOW.md: UI/UX Pro Max Flow

> Routes the 7 UI/UX Pro Max skills (UI/UX design intelligence, design systems, styling, brand and slides) so the right one fires at the right phase: the agent cannot skip them and improvise.
> Skills by Next Level Builder (https://github.com/nextlevelbuilder/ui-ux-pro-max-skill, MIT). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill BEFORE doing the task yourself: do not write code, run a tool, or claim "done" until you have READ this FLOW.md and invoked every matched skill. Doing the work, or claiming "done", without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  ├─ designing, building, reviewing or fixing an interface?  → invoke ui-ux-pro-max:ui-ux-pro-max   gate: style, palette and font choices come from its data
  ├─ need a design direction or UI styling decided?          → invoke ui-ux-pro-max:design   gate: one coherent direction chosen
  ├─ building UI with shadcn/ui, Radix or Tailwind?          → invoke ui-ux-pro-max:ui-styling   gate: accessible components
  ├─ tokens, spacing scale or component specs needed?        → invoke ui-ux-pro-max:design-system   gate: three-layer tokens defined
  ├─ brand voice, identity or messaging to apply?            → invoke ui-ux-pro-max:brand   gate: brand consistency checked
  ├─ banner, social, ad or hero image to design?             → invoke ui-ux-pro-max:banner-design   gate: several art directions offered
  ├─ presentation or slide deck requested?                   → invoke ui-ux-pro-max:slides   gate: HTML deck with design tokens
  ├─ scope changed mid-task (brief or reqs changed)?  → re-enter the earliest invalidated phase (ui-ux-pro-max:design or ui-ux-pro-max:design-system)
  ├─ blocked / waiting on an external dependency?  → park: record the blocker and resume condition; do not fake progress
  └─ question, not work (advise / explain)?  → answer only; no files change
```

**Drift:** every route above targets `ui-ux-pro-max:<slug>` in the separately-installed nextlevelbuilder/ui-ux-pro-max-skill plugin (always-latest, not bundled). If `<slug>` no longer exists there because upstream renamed or removed it, that route is a silent no-op: never substitute a nearby-sounding skill. Treat a broken route as this overlay needing an update, not as license to improvise.

## Priority on collision

When more than one branch matches, resolve top-down:

1. **Interface work**: any UI task passes ui-ux-pro-max first.
2. **Tokens**: no token system means design-system before components.
3. **Brand**: branded output checks brand before banner-design or slides.
4. Everything else in lifecycle order.

## Phases

1. **Direction**: ui-ux-pro-max:design. Gate: style, palette and type chosen.
2. **System**: ui-ux-pro-max:design-system. Gate: tokens written down.
3. **Build**: ui-ux-pro-max:ui-styling. Gate: accessible, responsive components.
4. **Review**: ui-ux-pro-max:ui-ux-pro-max in review mode. Gate: findings fixed.

**Shortcuts:** New page -> design -> design-system -> ui-ux-pro-max -> ui-styling. Restyle -> ui-ux-pro-max -> ui-styling. Banner or deck -> brand -> banner-design or slides.

## You are rationalizing if you think…

- "I know what a good card looks like." → Invoke ui-ux-pro-max. Chosen, not guessed.
- "Colours can be picked as I go." → design-system. Tokens first.
- "It is only a small tweak." → A small tweak is still interface work. Invoke it.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills by Next Level Builder, MIT (https://github.com/nextlevelbuilder/ui-ux-pro-max-skill). FLOW.md routing by Flowy, CC-BY-SA-4.0.
