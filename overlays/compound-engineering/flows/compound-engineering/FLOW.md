# FLOW.md: everyinc/compound-engineering-plugin

> Routes all 32 skills from `everyinc/compound-engineering-plugin` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does an already open pull request need continuous monitoring across its full review cycle rather than a single pass?  → invoke compound-engineering:ce-babysit-pr   gate: the pr history shows agent responses to multiple separate review or ci events before merge
  ├─ does a vague idea already exist that needs to be scoped into requirements before planning?  → invoke compound-engineering:ce-brainstorm   gate: a requirements only unified plan document exists
  ├─ is code ready for structured review before a pull request is opened?  → invoke compound-engineering:ce-code-review   gate: a review report listing bugs regressions and standards issues exists
  ├─ is finished work ready to be committed pushed and opened as a pull request?  → invoke compound-engineering:ce-commit-push-pr   gate: a pull request exists on the remote with a written description
  ├─ are staged or unstaged changes ready to be saved as a commit only with no push planned?  → invoke compound-engineering:ce-commit   gate: a new git commit exists with a clear value communicating message
  ├─ might previously stored learnings be stale overlapping or drifted from the current code?  → invoke compound-engineering:ce-compound-refresh   gate: an audit report of the learnings store exists with stale entries flagged
  ├─ was a problem just solved that should become a durable learning or vocabulary entry?  → invoke compound-engineering:ce-compound   gate: a new learning entry or concepts file update exists
  ├─ is there a bug error or failing test whose root cause is still unknown?  → invoke compound-engineering:ce-debug   gate: a root cause is identified before any fix is applied
  ├─ does an existing requirements plan or spec document need review before work starts?  → invoke compound-engineering:ce-doc-review   gate: role specific review feedback on the document exists
  ├─ does the active branch need hands off autonomous browser testing across mapped user flows?  → invoke compound-engineering:ce-dogfood   gate: a durable dogfood report exists covering the diff scoped flows
  ├─ does something worth learning need a durable visual teaching artifact rather than a plain explanation?  → invoke compound-engineering:ce-explain   gate: a durable visual teaching artifact exists
  ├─ must work continue in a separate session with no access to this conversation history?  → invoke compound-engineering:ce-handoff   gate: a handoff document exists or a prior continuity source was read
  ├─ do new idea options need to be generated rather than an existing idea refined into scope?  → invoke compound-engineering:ce-ideate   gate: a list of generated and evaluated ideas exists
  ├─ is there a measurable outcome like relevance speed or quality that needs improving through repeated experiments?  → invoke compound-engineering:ce-optimize   gate: an experiment loop produced a measured metric improvement
  ├─ do requirements already exist and need to become an ordered multi step plan?  → invoke compound-engineering:ce-plan   gate: a structured plan document with ordered steps exists
  ├─ is a feature functionally complete and ready for interactive visual polish in a live browser?  → invoke compound-engineering:ce-polish   gate: the dev server is running and the feature was inspected and adjusted in browser
  ├─ does the request need one decisive grounded verdict rather than a menu of options?  → invoke compound-engineering:ce-pov   gate: a graded verdict or decisive position is recorded
  ├─ is a time windowed report needed from already configured signal sources?  → invoke compound-engineering:ce-product-pulse   gate: a report covering a defined time window exists
  ├─ has a feature just shipped and does it need launch or promotion copy?  → invoke compound-engineering:ce-promote   gate: draft launch or promotion copy exists
  ├─ does a spec plan or draft need to be published or shared through the proof platform?  → invoke compound-engineering:ce-proof   gate: the document exists as a link on the proof platform
  ├─ does an open pull request have specific review comments needing a one time resolution pass?  → invoke compound-engineering:ce-resolve-pr-feedback   gate: review threads are marked resolved with the feedback addressed
  ├─ does a skill corpus need retuning for a new model against a measured baseline?  → invoke compound-engineering:ce-retune   gate: a pre registered quality bar clears against a benchmark harness
  ├─ is a feedback capture bundle or recording file present that needs analysis?  → invoke compound-engineering:ce-riffrec-feedback-analysis   gate: a feedback analysis of the recording capture exists
  ├─ does the repo local automation setup and config need a health check?  → invoke compound-engineering:ce-setup   gate: a health check report of the local config exists
  ├─ is recently changed code settled and ready to simplify before review?  → invoke compound-engineering:ce-simplify-code   gate: the code is simplified with behavior unchanged and tests still passing
  ├─ does downstream ideation or planning lack upstream product direction to ground it?  → invoke compound-engineering:ce-strategy   gate: a strategy document exists or is updated
  ├─ do configured feedback sources like slack or issues need to be swept for new unaddressed items?  → invoke compound-engineering:ce-sweep   gate: an actionable plan formatted for the autonomous shipping step is emitted from newly acknowledged items
  ├─ do pages affected by the current branch or pull request need automated browser test runs?  → invoke compound-engineering:ce-test-browser   gate: browser tests ran and reported results for the affected pages
  ├─ does an ios app need to be built and tested on a simulator?  → invoke compound-engineering:ce-test-xcode   gate: the app built and tests ran on the ios simulator
  ├─ does a plan document spec path or clear build request already exist and need direct end to end execution?  → invoke compound-engineering:ce-work   gate: the plan or work prompt is fully implemented end to end
  ├─ does new or existing work need an isolated workspace set up before starting?  → invoke compound-engineering:ce-worktree   gate: an isolated worktree exists for the branch or ref
  ├─ did the request explicitly ask for one fully autonomous hands off run from planning through an open pull request with no check ins?  → invoke compound-engineering:lfg   gate: an open pull request exists with ci green and no manual check ins occurred
```

**Drift:** every route above targets `compound-engineering:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **compound-engineering** (https://github.com/everyinc/compound-engineering-plugin). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
