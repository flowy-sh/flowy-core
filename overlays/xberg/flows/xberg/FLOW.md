# FLOW.md: kreuzberg-dev/kreuzberg

> Routes all 7 skills from `kreuzberg-dev/kreuzberg` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to extract data from a large batch of files at once and need shared config with bounded parallelism?  → invoke xberg:batch-extraction   gate: a batch command runs with concurrency limits and per file overrides applied
  ├─ about to split extracted text into sized pieces for a context window or a retrieval pipeline?  → invoke xberg:chunking   gate: piece size and overlap settings are chosen and applied to the text
  ├─ about to pull keywords, detect a language, or build embeddings from extracted text?  → invoke xberg:extracting-keywords   gate: a keyword list, detected language tag, or embedding vectors are produced
  ├─ about to pull tabular data out of a pdf, spreadsheet, or image?  → invoke xberg:extracting-tables   gate: the extracted table is rendered as markdown or structured json cells
  ├─ about to read text out of a scanned or photographed page that has no embedded text layer?  → invoke xberg:extracting-with-ocr   gate: an ocr backend and language pack are selected before the run
  ├─ about to decide which output format an extraction should produce for its downstream consumer?  → invoke xberg:picking-a-format   gate: the chosen output flag matches the stated downstream consumer
  ├─ about to write code that calls into this document extraction tool through its api in python, node, rust, or via the cli?  → invoke xberg:xberg   gate: an install step and a working extraction call appear in the code
```

**Drift:** every route above targets `xberg:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **xberg** (https://github.com/kreuzberg-dev/kreuzberg). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
