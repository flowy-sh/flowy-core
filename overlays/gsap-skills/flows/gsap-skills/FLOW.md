# FLOW.md: GSAP Skills Flow

> Routes the 8 GSAP Skills skills (GSAP core, timelines, ScrollTrigger, plugins, utilities, React, other frameworks and performance) so the right one fires at the right phase: the agent cannot skip them and improvise.
> Skills by GreenSock (https://github.com/greensock/gsap-skills, MIT). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill BEFORE doing the task yourself: do not write code, run a tool, or claim "done" until you have READ this FLOW.md and invoked every matched skill. Doing the work, or claiming "done", without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  ├─ writing gsap.to, from, fromTo, easing or stagger code?     → invoke gsap-skills:gsap-core   gate: current API used, not remembered
  ├─ sequencing animations in a timeline?                       → invoke gsap-skills:gsap-timeline
  ├─ scroll-linked animation, pinning or scrub?                 → invoke gsap-skills:gsap-scrolltrigger
  ├─ using Flip, Draggable, ScrollSmoother or another plugin?   → invoke gsap-skills:gsap-plugins   gate: plugin registered
  ├─ using gsap.utils helpers such as clamp, mapRange or snap?  → invoke gsap-skills:gsap-utils
  ├─ animating in React?                                        → invoke gsap-skills:gsap-react   gate: useGSAP cleanup in place
  ├─ animating in Vue, Svelte or another framework?             → invoke gsap-skills:gsap-frameworks   gate: cleanup on unmount
  ├─ animation janky or slow?                                   → invoke gsap-skills:gsap-performance   gate: transforms preferred, layout thrash removed
  ├─ scope changed mid-task (brief or reqs changed)?  → re-enter the earliest invalidated phase (gsap-skills:gsap-core or gsap-skills:gsap-timeline)
  ├─ blocked / waiting on an external dependency?  → park: record the blocker and resume condition; do not fake progress
  └─ question, not work (advise / explain)?  → answer only; no files change
```

**Drift:** every route above targets `gsap-skills:<slug>` in the separately-installed greensock/gsap-skills plugin (always-latest, not bundled). If `<slug>` no longer exists there because upstream renamed or removed it, that route is a silent no-op: never substitute a nearby-sounding skill. Treat a broken route as this overlay needing an update, not as license to improvise.

## Priority on collision

When more than one branch matches, resolve top-down:

1. **Performance**: a janky animation goes to gsap-performance before new features.
2. **Framework**: React uses gsap-react, other frameworks gsap-frameworks, before generic core code.
3. **Core**: any GSAP code passes gsap-core.
4. Everything else in lifecycle order.

## Phases

1. **Tween**: gsap-skills:gsap-core. Gate: API calls match current GSAP.
2. **Sequence**: gsap-skills:gsap-timeline. Gate: timeline plays in order.
3. **Scroll**: gsap-skills:gsap-scrolltrigger. Gate: triggers behave on resize.
4. **Integrate**: gsap-skills:gsap-react or gsap-skills:gsap-frameworks. Gate: cleanup verified.
5. **Tune**: gsap-skills:gsap-performance. Gate: no layout thrash.

**Shortcuts:** Simple tween -> gsap-core. Scroll story -> gsap-core -> gsap-timeline -> gsap-scrolltrigger. React app -> gsap-react first.

## You are rationalizing if you think…

- "I know the GSAP API." → It changes between majors. Invoke gsap-core.
- "useEffect is fine in React." → gsap-react. useGSAP handles cleanup.
- "It animates, ship it." → gsap-performance. Check the cost.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills by GreenSock, MIT (https://github.com/greensock/gsap-skills). FLOW.md routing by Flowy, CC-BY-SA-4.0.
