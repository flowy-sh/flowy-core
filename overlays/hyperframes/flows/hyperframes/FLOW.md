# FLOW.md: HyperFrames Flow

> Routes the 20 HyperFrames skills (HTML-to-video compositions, animation, captions, audio and ready-made video workflows) so the right one fires at the right phase: the agent cannot skip them and improvise.
> Skills by HeyGen (https://github.com/heygen-com/hyperframes, Apache-2.0). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill BEFORE doing the task yourself: do not write code, run a tool, or claim "done" until you have READ this FLOW.md and invoked every matched skill. Doing the work, or claiming "done", without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  ├─ any request to make, edit, animate or render a video?  → invoke hyperframes:hyperframes   gate: entry point read first
  ├─ building one renderable composition?                   → invoke hyperframes:hyperframes-core   gate: timing attributes and tracks correct
  ├─ motion, transitions or scene blueprints needed?        → invoke hyperframes:hyperframes-animation
  ├─ palette, typography, narration or beat plan needed?    → invoke hyperframes:hyperframes-creative
  ├─ punch-in, zoom, reframe or Ken Burns effect?           → invoke hyperframes:hyperframes-keyframes
  ├─ named visual about to be hand-built?                   → invoke hyperframes:hyperframes-registry   gate: registry searched first
  ├─ audio placed and needs fades or mixing?                → invoke hyperframes:hyperframes-audio
  ├─ using init, lint, check, snapshot or render commands?  → invoke hyperframes:hyperframes-cli
  ├─ working with a person inside Studio?                   → invoke hyperframes:hyperframes-studio
  ├─ music, SFX, image, icon or LUT needed?                 → invoke hyperframes:media-use
  ├─ product or marketing URL to turn into a promo?         → invoke hyperframes:product-launch-video
  ├─ GitHub pull request to explain as video?               → invoke hyperframes:pr-to-video
  ├─ article or notes to turn into an explainer?            → invoke hyperframes:faceless-explainer
  ├─ music track to turn into beat-synced video?            → invoke hyperframes:music-to-video
  ├─ talking-head video needs graphic overlays?             → invoke hyperframes:talking-head-recut
  ├─ captions for a single-subject video?                   → invoke hyperframes:embedded-captions
  ├─ short kinetic graphic or data count-up?                → invoke hyperframes:motion-graphics
  ├─ slides or interactive deck?                            → invoke hyperframes:slideshow
  ├─ Figma content to import?                               → invoke hyperframes:figma
  ├─ no specialised workflow fits?                          → invoke hyperframes:general-video
  ├─ scope changed mid-task (brief or reqs changed)?  → re-enter the earliest invalidated phase (hyperframes:hyperframes or hyperframes:hyperframes-creative)
  ├─ blocked / waiting on an external dependency?  → park: record the blocker and resume condition; do not fake progress
  └─ question, not work (advise / explain)?  → answer only; no files change
```

**Drift:** every route above targets `hyperframes:<slug>` in the separately-installed heygen-com/hyperframes plugin (always-latest, not bundled). If `<slug>` no longer exists there because upstream renamed or removed it, that route is a silent no-op: never substitute a nearby-sounding skill. Treat a broken route as this overlay needing an update, not as license to improvise.

## Priority on collision

When more than one branch matches, resolve top-down:

1. **Entry**: every video request passes hyperframes first.
2. **Specialised workflow**: a matching workflow skill beats general-video.
3. **Registry**: named visuals come from hyperframes-registry before hand-building.
4. **Contract**: composition structure follows hyperframes-core.
5. Everything else in lifecycle order.

## Phases

1. **Brief**: hyperframes:hyperframes. Gate: the right workflow chosen.
2. **Direction**: hyperframes:hyperframes-creative. Gate: design spec written.
3. **Build**: hyperframes:hyperframes-core with hyperframes:hyperframes-animation. Gate: composition lints clean.
4. **Sound**: hyperframes:hyperframes-audio. Gate: levels mixed.
5. **Render**: hyperframes:hyperframes-cli. Gate: output file exists.

**Shortcuts:** Promo -> product-launch-video -> hyperframes-audio. Explainer -> faceless-explainer. Edit existing composition -> hyperframes-core -> hyperframes-cli.

## You are rationalizing if you think…

- "It is just a small animation." → hyperframes first. Video requests have an entry point.
- "I will hand-build this title card." → hyperframes-registry. Search before building.
- "No workflow matches, so general-video." → Check the specialised skills first.
- "It rendered, so it is right." → Run the lint and check commands in THIS message.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills by HeyGen, Apache-2.0 (https://github.com/heygen-com/hyperframes). FLOW.md routing by Flowy, CC-BY-SA-4.0.
