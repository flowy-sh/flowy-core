# FLOW.md: wotai-dev/woterclip

> Routes all 7 skills from `wotai-dev/woterclip` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does the user want a summary or analysis of past automated work cycles rather than to start a new one?  → invoke woterclip:heartbeat-log   gate: a summary is produced from the recorded history of past runs, with no new run started
  ├─ does the user want a new pass started right now that picks up open issues, assigns them to a role, does the work, and reports back?  → invoke woterclip:heartbeat   gate: issues were picked up, worked, and a report of what happened was produced
  ├─ is this repository being prepared for the first time, with no configuration, role directories, or issue labels set up yet?  → invoke woterclip:init   gate: the configuration file, role directories, and issue labels now exist in the repository
  ├─ does the user want to define a brand new agent role that does not exist yet?  → invoke woterclip:persona-create   gate: a new role folder exists containing an identity file, a tool list, and a config file
  ├─ does the user have agent role definitions in an incompatible, differently formatted tool that need to be converted into this format?  → invoke woterclip:persona-import   gate: the converted role definition now matches this format and reads correctly
  ├─ does the user want to see every agent role currently configured rather than change or inspect one in depth?  → invoke woterclip:persona-list   gate: every configured role appears in the listing along with its runtime settings
  ├─ does the user want to know what is happening right now, including the open queue and anything stuck, rather than history or starting new work?  → invoke woterclip:status   gate: the current queue and any blocked items are displayed as of this moment
```

**Drift:** every route above targets `woterclip:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **woterclip** (https://github.com/wotai-dev/woterclip). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
