# FLOW.md: ykdojo/claude-code-tips

> Routes all 9 skills from `ykdojo/claude-code-tips` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to investigate why a github actions workflow run failed?  → invoke dx:gha   gate: a root cause for the failing run is identified from its logs
  ├─ about to trim context moderately, keeping roughly the newer half of this conversation and dropping the rest?  → invoke dx:half-clone   gate: a new session starts containing only the newer half of prior work
  ├─ about to end this session and need the next agent to pick up with fresh context?  → invoke dx:handoff   gate: a document describing current state and next steps exists for the next agent to read
  ├─ about to condense hacker news front page stories, or one story together with its comment thread, into a short digest?  → invoke dx:hn-summarize   gate: a short digest of the stories and their comment threads is produced
  ├─ about to search across every repository a user owns, including private ones, for where something lives?  → invoke dx:private-github-search   gate: a local mirror is searched and matching files or lines are returned
  ├─ about to trim context aggressively, keeping only about the newest quarter of this conversation and dropping the rest?  → invoke dx:quarter-clone   gate: a new session starts containing only the newest quarter of prior work
  ├─ about to retrieve content from a reddit url, research a topic on reddit, or run into a block loading a reddit page?  → invoke dx:reddit-fetch   gate: reddit content is retrieved successfully after an initial block or 403
  ├─ about to look back over recent sessions to find improvements worth adding to a project instructions file?  → invoke dx:review-claudemd   gate: a list of proposed edits to the instructions file, drawn from recent sessions, is produced
  ├─ about to decide whether to update this cli tool or which release of it is safe to run?  → invoke dx:version-check   gate: a specific version recommendation with its rationale is given
```

**Drift:** every route above targets `dx:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **dx** (https://github.com/ykdojo/claude-code-tips). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
