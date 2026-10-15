# FLOW.md: Obsidian Skills Flow

> Routes the 6 Obsidian Skills skills (Obsidian Markdown, Bases, Canvas, CLI, templates and clean web extraction) so the right one fires at the right phase: the agent cannot skip them and improvise.
> Skills by Steph Ango (https://github.com/kepano/obsidian-skills, MIT). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce ritual, invoke/READ,
     host-wins, post-compaction re-read). This file carries only the routing. -->

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill BEFORE doing the task yourself: do not write code, run a tool, or claim "done" until you have READ this FLOW.md and invoked every matched skill. Doing the work, or claiming "done", without first invoking is the failure this Flow exists to stop.

```
USER MESSAGE
  ├─ creating or editing Markdown in an Obsidian vault?                 → invoke obsidian:obsidian-markdown   gate: wikilinks, embeds, callouts and properties valid
  ├─ working with .base files or database-like note views?              → invoke obsidian:obsidian-bases   gate: views, filters and formulas valid
  ├─ working with .canvas files, mind maps or flowcharts?               → invoke obsidian:json-canvas   gate: nodes and edges valid
  ├─ reading, searching or managing vault notes from the command line?  → invoke obsidian:obsidian-cli
  ├─ turning JSON or CSV data into notes from templates?                → invoke obsidian:knap
  ├─ need clean Markdown from a web page?                               → invoke obsidian:defuddle
  ├─ scope changed mid-task (brief or reqs changed)?  → re-enter the earliest invalidated phase (obsidian:obsidian-markdown or obsidian:obsidian-cli)
  ├─ blocked / waiting on an external dependency?  → park: record the blocker and resume condition; do not fake progress
  └─ question, not work (advise / explain)?  → answer only; no files change
```

**Drift:** every route above targets `obsidian:<slug>` in the separately-installed kepano/obsidian-skills plugin (always-latest, not bundled). If `<slug>` no longer exists there because upstream renamed or removed it, that route is a silent no-op: never substitute a nearby-sounding skill. Treat a broken route as this overlay needing an update, not as license to improvise.

## Priority on collision

When more than one branch matches, resolve top-down:

1. **File type**: .base files go to obsidian-bases, .canvas files to json-canvas, before generic Markdown.
2. **Vault writes**: notes written by hand follow obsidian-markdown, not plain Markdown habits.
3. **Scripted batches**: generated notes go through knap, not ad-hoc loops.
4. Everything else in lifecycle order.

## Phases

1. **Capture**: obsidian:defuddle. Gate: clean Markdown extracted.
2. **Write**: obsidian:obsidian-markdown or obsidian:knap. Gate: syntax valid for Obsidian.
3. **Structure**: obsidian:obsidian-bases or obsidian:json-canvas. Gate: file opens in Obsidian.
4. **Manage**: obsidian:obsidian-cli. Gate: vault state confirmed by command output.

**Shortcuts:** Web page to note -> defuddle -> obsidian-markdown. Dataset to notes -> knap -> obsidian-bases. Diagram -> json-canvas.

## You are rationalizing if you think…

- "It is just Markdown." → Obsidian Markdown has wikilinks, callouts and properties. Invoke it.
- "I will write the .base YAML from memory." → obsidian-bases. The format is strict.
- "I can paste the page text." → defuddle. Strip the clutter first.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

Skills by Steph Ango, MIT (https://github.com/kepano/obsidian-skills). FLOW.md routing by Flowy, CC-BY-SA-4.0.
