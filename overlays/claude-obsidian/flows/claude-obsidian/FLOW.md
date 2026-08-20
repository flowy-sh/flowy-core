# FLOW.md: agricidaniel/claude-obsidian

> Routes all 15 skills from `AgriciDaniel/claude-obsidian` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does the answer need bounded research against the public web, with its sources kept?  → invoke claude-obsidian:autoresearch   gate: a cited dossier exists, sources recorded
  ├─ does the thing being built belong on a visual board rather than inside a note?  → invoke claude-obsidian:canvas   gate: the board file carries the nodes and edges
  ├─ is a web page needed as readable text, stripped of its clutter, before anything else happens to it?  → invoke claude-obsidian:defuddle   gate: the page exists as clean Markdown, with network consent given
  ├─ does the vault need a database-like view over its notes, with filters or formulas?  → invoke claude-obsidian:obsidian-bases   gate: the definition file validates and renders a view
  ├─ unsure of the vault-specific syntax for a wikilink, callout, embed or block reference?  → invoke claude-obsidian:obsidian-markdown   gate: the syntax was checked rather than guessed
  ├─ did the user ask to preserve something from THIS conversation, rather than ingest a file?  → invoke claude-obsidian:save   gate: the selected content landed as one reviewed transaction
  ├─ is the decision consequential or ambiguous enough that a first answer would be a guess?  → invoke claude-obsidian:think   gate: the full reasoning loop ran before the answer
  ├─ reading from the vault and unsure which transport is even available here?  → invoke claude-obsidian:wiki-cli   gate: the transport was detected before any read
  ├─ have the recent log entries grown long enough to need compressing into a rollup?  → invoke claude-obsidian:wiki-fold   gate: a dry run was previewed before any apply
  ├─ is there supplied source material, a file or an approved URL, that should enter the vault?  → invoke claude-obsidian:wiki-ingest   gate: ingested with provenance and claims tracked
  ├─ is the health of the vault unknown, with possible orphans, dead links or missing frontmatter?  → invoke claude-obsidian:wiki-lint   gate: a read-only report naming each class of problem
  ├─ unclear which filing methodology this vault uses, or where new knowledge should land?  → invoke claude-obsidian:wiki-mode   gate: the mode is known and a destination proposed
  ├─ is the question answerable from the vault alone, with nothing to be changed?  → invoke claude-obsidian:wiki-query   gate: answered from vault evidence, vault unmodified
  ├─ does finding the relevant passages need ranking, because a plain search returns too much?  → invoke claude-obsidian:wiki-retrieve   gate: the index was built or queried and its diagnostics read
  ├─ is there no vault set up yet, or is it unclear which part of this the work belongs to?  → invoke claude-obsidian:wiki   gate: the vault is scaffolded and the work routed
```

**Drift:** every route above targets `claude-obsidian:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **claude-obsidian** (https://github.com/AgriciDaniel/claude-obsidian). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
