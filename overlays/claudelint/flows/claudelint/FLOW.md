# FLOW.md: pdugan20/claudelint

> Routes all 9 skills from `pdugan20/claudelint` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ do project files such as markdown, json, yaml, or shell scripts have style or lint issues that need auto fixing rather than a validation report?  → invoke claudelint:format-cc   gate: the files on disk change to the corrected style and a shell script quality note is produced
  ├─ has the main instructions file grown too large or disorganized, and does the user want an interactive walkthrough to split it into smaller imported pieces?  → invoke claudelint:optimize-cc-md   gate: the main instructions file shrinks and one or more imported files now hold the moved sections
  ├─ does the user want a single full sweep across every project file type at once, rather than checking one file type on its own?  → invoke claudelint:validate-all   gate: a combined report lists a pass or fail line for every file type in one run
  ├─ does the main instructions file alone need checking against its size limit, its import directives, and its structure, rather than as part of a full sweep?  → invoke claudelint:validate-cc-md   gate: a report names the instructions file specifically with a size number against the warning and error thresholds
  ├─ is an automation trigger config file not firing as expected, or does its event type, matcher pattern, or command shape need checking against the schema?  → invoke claudelint:validate-hooks   gate: a report names the specific event entry and matcher pattern that is malformed
  ├─ is an external tool server connection failing to load, or does its transport type and server name need checking against the schema?  → invoke claudelint:validate-mcp   gate: a report names the specific server entry and transport type that fails to match the schema
  ├─ does a manifest file fail to load, or does its required fields, version number, or declared feature list need checking against the schema?  → invoke claudelint:validate-plugin   gate: a report names the missing field or malformed version number in the manifest file
  ├─ does the main configuration file need checking for a bad model name, an unsafe permission rule, or an environment variable problem?  → invoke claudelint:validate-settings   gate: a report flags the specific permission rule or environment variable line that is unsafe or malformed
  ├─ does a capability definition file need checking for frontmatter problems, unsafe allowed tool entries, or a dangerous command pattern before it can load safely?  → invoke claudelint:validate-skills   gate: a report flags the frontmatter field or command pattern that is unsafe or malformed in that capability file
```

**Drift:** every route above targets `claudelint:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **claudelint** (https://github.com/pdugan20/claudelint). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
