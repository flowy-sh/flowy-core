# FLOW.md: beefiker/superloopy

> Routes all 9 skills from `beefiker/superloopy` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is Korean language prose being rewritten to sound naturally written by a person while keeping every fact and protected term unchanged?  → invoke superloopy:humanize-korean   gate: the Korean text reads as natural prose with the same facts and protected terms intact
  ├─ did the user just explicitly invoke the attention friendly output mode by name, rather than write in a rushed or fragmented style?  → invoke superloopy:i-have-adhd   gate: the response format itself changes for this reply only, with no note added about typing style
  ├─ did the user just explicitly invoke the direct rewrite command on a specific piece of prose?  → invoke superloopy:say-it-straight   gate: the same facts and protected text survive, with hedging and padding removed
  ├─ did the user point at an existing website or page and ask for it to be rebuilt as a new implementation?  → invoke superloopy:superloopy-clone   gate: a new implementation reproducing the named source page is produced under the governance rules for this project
  ├─ is something about the plugin installation itself, such as a stale version, a broken hook, or a missing cache entry, suspected of being broken?  → invoke superloopy:superloopy-doctor   gate: a health report naming the specific installation component that is or is not working is returned
  ├─ did the user just explicitly invoke the screen UI build command for a specific application surface?  → invoke superloopy:superloopy-frontend   gate: interface work proceeds against the conventions defined for the named application surface
  ├─ does the task need durable, checkable progress toward a finish line rather than a single one shot answer?  → invoke superloopy:superloopy-loop   gate: each step is logged against a stated completion criterion before the next one starts
  ├─ did the user just explicitly invoke the research command, or start the request with the exact leading keyword that requests one?  → invoke superloopy:superloopy-research   gate: a sourced research writeup is returned as a standalone deliverable
  ├─ does the deliverable need to be an exportable slide deck or presentation rather than a document?  → invoke superloopy:superloopy-slides   gate: a slide file organized into discrete slides, exportable or shareable on its own, is produced
```

**Drift:** every route above targets `superloopy:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **superloopy** (https://github.com/beefiker/superloopy). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
