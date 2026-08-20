# FLOW.md: worldwonderer/video-recap-skills

> Routes all 6 skills from `worldwonderer/video-recap-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ has narration audio, timing, and a source video ready and needs a final mixed cut with subtitles and normalized loudness?  → invoke video-recap-skills:video-assemble   gate: a finished cut with narration mixed over ducked source audio, attached subtitles, and normalized loudness
  ├─ has chosen which source intervals matter and needs the raw footage trimmed into an edited timeline before narration is written?  → invoke video-recap-skills:video-cut   gate: an edited source video plus a record of the selected intervals
  ├─ has been given a raw video and asked for a full narrated recap end to end, from upload to a finished voiced cut?  → invoke video-recap-skills:video-recap   gate: a finished narrated recap produced by running the full chain from analysis through final mix
  ├─ already has a video analysis and brief on disk and now needs a timestamped narration script planned, written, and checked?  → invoke video-recap-skills:video-script   gate: a validated timestamped narration script plus a story and clip plan
  ├─ has a raw video file and nothing yet analyzed, and needs scenes, transcript, and visuals indexed before any creative work?  → invoke video-recap-skills:video-understanding   gate: a structured index of scenes, transcript, per-scene observations, and silence windows
  ├─ has a finished, validated narration script with timestamps and needs it turned into spoken audio matched to those windows?  → invoke video-recap-skills:video-voiceover   gate: generated speech segments time-fitted to the narration windows plus loudness metadata
```

**Drift:** every route above targets `video-recap-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **video-recap-skills** (https://github.com/worldwonderer/video-recap-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
