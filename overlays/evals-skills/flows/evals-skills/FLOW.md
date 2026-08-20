# FLOW.md: hamelsmu/evals-skills

> Routes all 7 skills from `hamelsmu/evals-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does reviewing raw traces and collecting structured human feedback need a purpose-built browser tool rather than an ad hoc method?  → invoke evals-skills:build-review-interface   gate: a working browser-based tool exists that displays this specific data and records structured feedback
  ├─ is this the start of a new evaluation effort, a point after a significant pipeline change, a drop in production metrics, or the aftermath of an incident, with failure modes not yet categorized?  → invoke evals-skills:error-analysis   gate: traces were read and failure modes are written down as named categories
  ├─ has an evaluation system been inherited, or is it unclear whether the existing evals can be trusted, with no prior systematic check of the eval setup itself?  → invoke evals-skills:eval-audit   gate: gaps such as missing failure categorization, unverified judges, or vanity metrics are listed for that setup, not the underlying product
  ├─ does a retrieval-augmented pipeline specifically need its retrieval quality and generation faithfulness measured?  → invoke evals-skills:evaluate-rag   gate: retrieval quality and generation faithfulness are each reported as separate measured numbers for that pipeline
  ├─ is real user data too sparse to build an eval set, or does a specific failure hypothesis need dedicated test cases invented to stress it?  → invoke evals-skills:generate-synthetic-data   gate: a diverse set of invented test inputs now exists, produced across defined dimensions rather than by hand
  ├─ has an automated grader just been created for a subjective criterion, and does it still need to be checked against human labels before its verdicts are trusted?  → invoke evals-skills:validate-evaluator   gate: the grader agreement rate against a human-labeled split is measured and reported, not assumed
  ├─ does a failure mode require subjective interpretation, such as tone, faithfulness, or completeness, that a deterministic code check cannot decide?  → invoke evals-skills:write-judge-prompt   gate: a new automated grader exists that scores that specific subjective criterion the way a person would rate it
```

**Drift:** every route above targets `evals-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **evals-skills** (https://github.com/hamelsmu/evals-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
