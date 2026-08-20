# FLOW.md: readwiseio/readwise-skills

> Routes all 11 skills from `readwiseio/readwise-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ finished a book and want a long-form written critique built from what was actually highlighted in it?  → invoke readwise:book-review   gate: a full-length draft cites specific highlighted passages and connects them to other books already read
  ├─ another step needs a profile of reading habits and interests but none has been built yet?  → invoke readwise:build-persona   gate: a stored profile exists that a later step can read instead of recomputing from scratch
  ├─ returning after time away and needing a fast pass over what accumulated in a feed?  → invoke readwise:feed-catchup   gate: a single view surfaces the most-highlighted items first, then the rest below
  ├─ wanting to see how saved passages connect to each other rather than read them as a flat list?  → invoke readwise:highlight-graph   gate: an interactive node-and-edge view renders with the saved passages as nodes
  ├─ wanting a shareable public page showing what is currently being read?  → invoke readwise:now-reading-page   gate: a published webpage lists current in-progress titles pulled from the library
  ├─ wanting to check whether recently read material actually stuck rather than just skimming it again?  → invoke readwise:quiz   gate: a set of questions about recently read material gets answered and scored
  ├─ wanting a spoken-style briefing on recent reading activity rather than a raw data dump?  → invoke readwise:reader-recap   gate: a short conversational summary mentions what finished, what got highlighted, and any notes left
  ├─ needing highlights or documents pulled by running a shell command rather than calling a structured tool?  → invoke readwise:readwise-cli   gate: a terminal command returns the requested highlights or documents as output
  ├─ needing highlights or documents pulled by calling a structured tool interface rather than running a shell command?  → invoke readwise:readwise-mcp   gate: a tool call returns the requested highlights or documents as structured output
  ├─ wanting an unprompted, unexpected finding pulled from the whole reading history rather than a specific lookup?  → invoke readwise:surprise-me   gate: one unexpected finding comes back that was not the subject of any specific question asked
  ├─ facing an unsorted inbox of saved items and needing to decide keep-or-drop one at a time?  → invoke readwise:triage   gate: each inbox item gets a short personalized pitch and an explicit keep-or-drop decision
```

**Drift:** every route above targets `readwise:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **readwise** (https://github.com/readwiseio/readwise-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
