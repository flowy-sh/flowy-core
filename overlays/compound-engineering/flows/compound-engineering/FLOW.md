# FLOW.md: everyinc/compound-engineering-plugin

> Routes 21 skills from `everyinc/compound-engineering-plugin` so the right one fires at the right phase.
>
> The plugin ships 40; the other 19 are not routed here.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does a vague idea already exist that needs to be scoped into requirements before planning?  → invoke compound-engineering:ce-brainstorm   gate: a requirements only unified plan document exists
  ├─ is code ready for structured review before a pull request is opened?  → invoke compound-engineering:ce-review   gate: a review report listing bugs regressions and standards issues exists
  ├─ is finished work ready to be committed pushed and opened as a pull request?  → invoke compound-engineering:git-commit-push-pr   gate: a pull request exists on the remote with a written description
  ├─ are staged or unstaged changes ready to be saved as a commit only with no push planned?  → invoke compound-engineering:git-commit   gate: a new git commit exists with a clear value communicating message
  ├─ might previously stored learnings be stale overlapping or drifted from the current code?  → invoke compound-engineering:ce-compound-refresh   gate: an audit report of the learnings store exists with stale entries flagged
  ├─ was a problem just solved that should become a durable learning or vocabulary entry?  → invoke compound-engineering:ce-compound   gate: a new learning entry or concepts file update exists
  ├─ is there a bug error or failing test whose root cause is still unknown?  → invoke compound-engineering:ce-debug   gate: a root cause is identified before any fix is applied
  ├─ does an existing requirements plan or spec document need review before work starts?  → invoke compound-engineering:document-review   gate: role specific review feedback on the document exists
  ├─ do new idea options need to be generated rather than an existing idea refined into scope?  → invoke compound-engineering:ce-ideate   gate: a list of generated and evaluated ideas exists
  ├─ do requirements already exist and need to become an ordered multi step plan?  → invoke compound-engineering:ce-plan   gate: a structured plan document with ordered steps exists
  ├─ does a spec plan or draft need to be published or shared through the proof platform?  → invoke compound-engineering:proof   gate: the document exists as a link on the proof platform
  ├─ does an open pull request have specific review comments needing a one time resolution pass?  → invoke compound-engineering:resolve-pr-feedback   gate: review threads are marked resolved with the feedback addressed
  ├─ does the repo local automation setup and config need a health check?  → invoke compound-engineering:ce-setup   gate: a health check report of the local config exists
  ├─ do pages affected by the current branch or pull request need automated browser test runs?  → invoke compound-engineering:test-browser   gate: browser tests ran and reported results for the affected pages
  ├─ does an ios app need to be built and tested on a simulator?  → invoke compound-engineering:test-xcode   gate: the app built and tests ran on the ios simulator
  ├─ does a plan document spec path or clear build request already exist and need direct end to end execution?  → invoke compound-engineering:ce-work   gate: the plan or work prompt is fully implemented end to end
  ├─ does new or existing work need an isolated workspace set up before starting?  → invoke compound-engineering:git-worktree   gate: an isolated worktree exists for the branch or ref
  ├─ did the request explicitly ask for one fully autonomous hands off run from planning through an open pull request with no check ins?  → invoke compound-engineering:lfg   gate: an open pull request exists with ci green and no manual check ins occurred
  ├─ has a UI or CLI change shipped whose observable behaviour a pull request description cannot convey in words?  → invoke compound-engineering:ce-demo-reel   gate: a GIF, terminal recording or screenshot set is attached
  ├─ is it unknown whether this same problem was already investigated in an earlier session?  → invoke compound-engineering:ce-sessions   gate: prior attempts were searched before a fresh one starts
  ├─ does the task turn on an organizational decision or constraint that was settled in Slack rather than in the repo?  → invoke compound-engineering:ce-slack-research   gate: a research digest citing the source threads
```

**Drift:** every route above targets `compound-engineering:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **compound-engineering** (https://github.com/everyinc/compound-engineering-plugin). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
