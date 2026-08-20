# FLOW.md: volcengine/openviking

> Routes all 8 skills from `volcengine/openviking` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to schedule a reminder or a task that must run again later on its own?  → invoke openviking-memory:cron   gate: a scheduled entry with a specific time or recurrence is created
  ├─ about to clone or download from a remote code host while the direct connection here is slow or unreliable?  → invoke openviking-memory:github-proxy   gate: a proxy mirror address is used instead of the direct host and the transfer completes
  ├─ about to inspect or act on an issue, pull request, or continuous integration run on a hosted code repository?  → invoke openviking-memory:github   gate: a command line call against the hosting platform returns or updates the issue, pull request, or run
  ├─ about to check on or manage the status of a background coding agent job through its helper scripts?  → invoke openviking-memory:opencode   gate: a helper script reports or updates the running job status
  ├─ about to design, structure, or package a new or updated agent capability with its own scripts and references?  → invoke openviking-memory:skill-creator   gate: a capability definition file and its supporting scripts or references are created or edited
  ├─ about to condense or pull the key points out of a long url, recording, or transcript?  → invoke openviking-memory:summarize   gate: a short condensed version of the source material is produced
  ├─ about to remote control an interactive command line session running inside a persistent terminal multiplexer?  → invoke openviking-memory:tmux   gate: keystrokes are sent into the terminal pane and its output is read back
  ├─ about to answer a question about current outdoor conditions or an upcoming forecast?  → invoke openviking-memory:weather   gate: a current conditions or forecast result is returned without needing an api key
```

**Drift:** every route above targets `openviking-memory:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **openviking-memory** (https://github.com/volcengine/openviking). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
