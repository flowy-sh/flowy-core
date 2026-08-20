# FLOW.md: lum1104/understand-anything

> Routes all 9 skills from `lum1104/understand-anything` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does answering the current question require querying an existing codebase knowledge graph?  → invoke understand-anything:understand-chat   gate: a knowledge graph query result is quoted in the answer
  ├─ was a visual, browsable view of the knowledge graph requested?  → invoke understand-anything:understand-dashboard   gate: a dashboard URL or local server address is returned
  ├─ is a git diff or pull request being reviewed for what changed and its risk?  → invoke understand-anything:understand-diff   gate: the affected components and a risk note are both listed
  ├─ is the goal to extract business domain concepts and flows rather than technical structure?  → invoke understand-anything:understand-domain   gate: a domain flow graph file is generated
  ├─ was a deep explanation of one specific file, function, or module requested?  → invoke understand-anything:understand-explain   gate: the explanation names that exact file, function, or module
  ├─ does the request point at a Figma file rather than a code repository?  → invoke understand-anything:understand-figma   gate: a Figma file key or URL is passed to the Figma REST API
  ├─ is the input an LLM-generated wiki or notes collection rather than source code?  → invoke understand-anything:understand-knowledge   gate: extracted entities and topic clusters appear in the generated graph
  ├─ was an onboarding guide for a new team member requested?  → invoke understand-anything:understand-onboard   gate: an onboarding document is produced covering setup and key modules
  ├─ is a whole codebase being analyzed for the first time to map its architecture and components?  → invoke understand-anything:understand   gate: a knowledge graph covering the repo components and their relationships is generated
```

**Drift:** every route above targets `understand-anything:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **understand-anything** (https://github.com/lum1104/understand-anything). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
