# FLOW.md: linxule/kimi-plugin-cc

> Routes all 12 skills from `linxule/kimi-plugin-cc` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does answering call for a prose explanation or conceptual reasoning about the repository rather than an edit?  → invoke kimi:kimi-ask   gate: a prose answer is returned with no files changed
  ├─ did the user explicitly ask to stop a run that is still in progress?  → invoke kimi:kimi-cancel   gate: the in-progress run is marked stopped and no further output follows from it
  ├─ does the user want their approach questioned and pushed back on rather than checked for defects?  → invoke kimi:kimi-challenge   gate: a response naming specific assumptions or tradeoffs being challenged is returned, with no files changed
  ├─ did the user explicitly hand over a multi-turn objective to run hands-off within a set budget?  → invoke kimi:kimi-pursue   gate: an autonomous multi-turn run starts against a stated budget and objective, with edits attributable to it
  ├─ did the user ask to see the recorded turn by turn log of a run that already finished?  → invoke kimi:kimi-replay   gate: the stored event log for a finished run is re-rendered in order
  ├─ did the user explicitly hand off a substantial fix or investigation for someone else to implement?  → invoke kimi:kimi-rescue   gate: a bounded write-capable run starts against a named scope and returns changed files
  ├─ did the user ask for the finished output of a run that already completed?  → invoke kimi:kimi-result   gate: the stored final artifact body for a completed run is returned verbatim
  ├─ does the user want a second, read-only opinion on defects or regressions in the current changes?  → invoke kimi:kimi-review   gate: a defect-focused findings list is returned with zero files changed
  ├─ did the user explicitly ask to install, check, enable, disable, or remove the companion integration itself?  → invoke kimi:kimi-setup   gate: a readiness or configuration state is reported for the integration, separate from any coding task
  ├─ did the user ask how a run already in flight or recently finished is progressing?  → invoke kimi:kimi-status   gate: the current progress or terminal state of a specific run is reported
  ├─ did the user ask for many separate, unrelated edits to be made in parallel and returned as one patch to review?  → invoke kimi:kimi-swarm-write   gate: a single reviewable patch covering many disjoint targets is produced, and nothing is applied or committed automatically
  ├─ did the user ask for a broad read-only review across many independent targets at once?  → invoke kimi:kimi-swarm   gate: one finding set per target is returned from a parallel read-only fan-out, with no files changed
```

**Drift:** every route above targets `kimi:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **kimi** (https://github.com/linxule/kimi-plugin-cc). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
