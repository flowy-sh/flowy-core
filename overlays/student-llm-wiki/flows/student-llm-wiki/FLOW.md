# FLOW.md: issacw228/student-llm-wiki

> Routes all 6 skills from `IssacW228/student-llm-wiki` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is the user getting ready for a test and needs targeted practice on the concepts they know least well?  → invoke student-llm-wiki:exam-prep   gate: a practice question set exists, weighted toward the lowest-confidence concepts
  ├─ is any action about to touch a course knowledge vault before its operating rules have been loaded?  → invoke student-llm-wiki:wiki-core   gate: the vault structure and its ground rules are confirmed before any page is added or changed
  ├─ does a concept being written up describe a process, sequence, or structure that is easier to follow as a picture than as prose?  → invoke student-llm-wiki:wiki-diagram   gate: a diagram block renders alongside the written explanation
  ├─ has the user just dropped a new course file, such as a slide deck or PDF, that has not been turned into pages yet?  → invoke student-llm-wiki:wiki-ingest   gate: new source and concept pages exist for that file, with no duplicate created for a file already processed
  ├─ is it time to check the knowledge base for orphan pages, broken links, contradictions, or concepts that have gone stale?  → invoke student-llm-wiki:wiki-lint   gate: a report lists each issue found and confidence scores drop for concepts untouched past thirty days
  ├─ does the user want to be quizzed on a concept to test whether they can explain it, rather than just reread it?  → invoke student-llm-wiki:wiki-review   gate: the user answers questions on the concept and its confidence score updates based on those answers
```

**Drift:** every route above targets `student-llm-wiki:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **student-llm-wiki** (https://github.com/IssacW228/student-llm-wiki). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
