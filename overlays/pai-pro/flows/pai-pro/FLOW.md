# FLOW.md: utopai-research/pai-pro

> Routes all 6 skills from `Utopai-Research/pai-pro` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ are related canvas nodes about to stay scattered instead of grouped into a labeled frame?  → invoke pai-pro:groups-compose   gate: a titled frame now encloses the related nodes
  ├─ about to call a raw image generation script before a canvas image step exists?  → invoke pai-pro:image-compose   gate: a canvas image node exists before any raw script call
  ├─ has the user just handed over screenplay, story, or concept text that has not been triaged yet?  → invoke pai-pro:script-compose   gate: a final note with a title is saved, and shot notes appear only after an explicit split command
  ├─ does the user want a finished video from a story or script and the next concrete step is unclear?  → invoke pai-pro:story-to-video-workflow   gate: one next step is named before any downstream canvas action runs
  ├─ about to turn a shot note, storyboard frame, or reference image into a rendered clip?  → invoke pai-pro:video-compose   gate: a rendered or animated clip node now exists on the canvas
  ├─ about to call the narration CLI without a chosen voice or timbre reference first?  → invoke pai-pro:voice-compose   gate: a voice or narration node is attached to the character before the raw CLI runs
```

**Drift:** every route above targets `pai-pro:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **pai-pro** (https://github.com/Utopai-Research/pai-pro). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
