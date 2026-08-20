# FLOW.md: uipath/coder_eval

> Routes all 6 skills from `UiPath/coder_eval` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ has an evaluation run just finished with failures that have not been looked into yet?  → invoke coder-eval:analyze   gate: a written diagnostic covering failure patterns and concrete fixes exists for that run
  ├─ is it unknown whether a skill actually fires when it should and stays quiet when it should not?  → invoke coder-eval:check-skill   gate: a suite of trigger and non-trigger cases runs and reports a pass or fail per case
  ├─ should new changes be blocked automatically when they fail the evaluation gate, instead of someone running it by hand?  → invoke coder-eval:ci   gate: a GitHub Actions workflow file runs the suite on a schedule or on each change and reports a score
  ├─ is this the first time an evaluation setup is being created in a repository that has none yet?  → invoke coder-eval:init   gate: a directory with one real passing or failing example and its exact run command now exists
  ├─ do existing evaluation entries need a quality pass for criteria that can never fail or prompts that reveal the answer?  → invoke coder-eval:lint-tasks   gate: each existing example gets a severity rating and a concrete fix, with nothing rewritten automatically
  ├─ has the user described what should be true of the output in plain language, with no formal evaluation file yet?  → invoke coder-eval:task   gate: a new YAML file with weighted criteria exists and passes validation
```

**Drift:** every route above targets `coder-eval:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **coder-eval** (https://github.com/UiPath/coder_eval). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
