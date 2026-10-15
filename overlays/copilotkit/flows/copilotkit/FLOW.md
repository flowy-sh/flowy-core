# FLOW.md: CopilotKit Flow

> Routes the 5 CopilotKit skills (CopilotKit app questions, CLI wiring checks and Slack or Teams Channels agents) so the right one fires at the right phase: the agent cannot skip them and improvise.
> Skills by CopilotKit (https://github.com/CopilotKit/CopilotKit, MIT). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill BEFORE doing the task yourself: do not write code, run a tool, or claim "done" until you have READ this FLOW.md and invoked every matched skill. Doing the work, or claiming "done", without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  ├─ any CopilotKit question, chat UI, tools, generative UI or shared state?  → invoke copilotkit:copilotkit   gate: docs and source searched, not recalled
  ├─ wiring broken or unverified, using the CopilotKit CLI?                   → invoke copilotkit:copilotkit-cli   gate: verify output shown
  ├─ building a first Channels agent for Slack or Teams?                      → invoke copilotkit:channels-setup
  ├─ customising the Channel code in a managed Intelligence Channel?          → invoke copilotkit:copilotkit-channels
  ├─ local Channels agent must answer in Slack?                               → invoke copilotkit:setup-slack-channel   gate: provider side configured
  ├─ scope changed mid-task (brief or reqs changed)?  → re-enter the earliest invalidated phase (copilotkit:copilotkit or copilotkit:channels-setup)
  ├─ blocked / waiting on an external dependency?  → park: record the blocker and resume condition; do not fake progress
  └─ question, not work (advise / explain)?  → answer only; no files change
```

**Drift:** every route above targets `copilotkit:<slug>` in the separately-installed CopilotKit/CopilotKit plugin (always-latest, not bundled). If `<slug>` no longer exists there because upstream renamed or removed it, that route is a silent no-op: never substitute a nearby-sounding skill. Treat a broken route as this overlay needing an update, not as license to improvise.

## Priority on collision

When more than one branch matches, resolve top-down:

1. **Broken wiring**: a failing CopilotKit setup is verified with copilotkit-cli before theory.
2. **Channels**: provider setup precedes Channel code.
3. **Docs**: any other CopilotKit question goes to copilotkit.
4. Everything else in lifecycle order.

## Phases

1. **Answer**: copilotkit:copilotkit. Gate: answer cites current docs or source.
2. **Verify**: copilotkit:copilotkit-cli. Gate: verify output shown.
3. **Provider**: copilotkit:setup-slack-channel. Gate: agent reachable in Slack.
4. **Code**: copilotkit:copilotkit-channels. Gate: Channel behaves as specified.

**Shortcuts:** Question -> copilotkit. Not working -> copilotkit-cli (verify) -> copilotkit. Slack agent -> channels-setup -> setup-slack-channel -> copilotkit-channels.

## You are rationalizing if you think…

- "I know the CopilotKit API." → It changes fast. Invoke copilotkit.
- "The wiring looks right." → copilotkit-cli verify. Run it.
- "I will code the Channel first." → Provider setup first: setup-slack-channel.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills by CopilotKit, MIT (https://github.com/CopilotKit/CopilotKit). FLOW.md routing by Flowy, CC-BY-SA-4.0.
