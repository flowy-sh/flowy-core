# FLOW.md: leeroo-ai/superml

> Routes all 7 skills from `Leeroo-AI/superml` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ a training run is crashing, diverging or emitting NaN?  → invoke superml:ml-debug   gate: the symptom is reproduced and traced to one cause before any fix
  ├─ about to start or close out a training run worth remembering?  → invoke superml:ml-experiment   gate: a journal entry records the hypothesis, the config and the result
  ├─ the first results are in and the next move is unclear?  → invoke superml:ml-iterate   gate: a ranked list of next options exists with the reason for the order
  ├─ about to build a model or pipeline with no written steps agreed?  → invoke superml:ml-plan   gate: a written sequence of steps exists before any training code
  ├─ unsure how an approach works or which of two candidates to pick?  → invoke superml:ml-research   gate: a written comparison names the sources it read
  ├─ about to launch an expensive job or ship a model artifact?  → invoke superml:ml-verify   gate: shapes, config and math are checked and the check is recorded
  ├─ opening a conversation that touches machine learning at all?  → invoke superml:using-superml   gate: the knowledge base tools and the workflow order are loaded first
```

**Drift:** every route above targets `superml:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **superml** (https://github.com/Leeroo-AI/superml). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
