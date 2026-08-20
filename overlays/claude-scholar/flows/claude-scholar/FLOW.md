# FLOW.md: galaxy-dawn/claude-scholar

> Routes all 45 skills from `Galaxy-Dawn/claude-scholar` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to create or edit a Claude Code agent definition and its frontmatter?  → invoke claude-scholar:agent-identifier   gate: an agent file with frontmatter fields exists
  ├─ about to add a new ML component that must register through a Factory or Registry pattern?  → invoke claude-scholar:architecture-design   gate: the component is wired into a Factory or Registry, not hardcoded
  ├─ hit an error or unexplained failure and need to find its root cause before fixing anything?  → invoke claude-scholar:bug-detective   gate: a root cause is named before any fix is applied
  ├─ about to finalize a manuscript and need to confirm every cited reference actually exists and is accurate?  → invoke claude-scholar:citation-verification   gate: each citation is checked against a real source
  ├─ about to review a diff or pull request and write review comments or set review standards?  → invoke claude-scholar:code-review-excellence   gate: review comments or a review standard exist for the diff
  ├─ about to create or configure a Claude Code slash command and its arguments?  → invoke claude-scholar:command-development   gate: a command file with frontmatter and arguments exists
  ├─ about to write or modify ordinary application source code as a routine task?  → invoke claude-scholar:daily-coding   gate: source files are changed to complete the task
  ├─ about to produce a recurring digest of newly published papers on a topic?  → invoke claude-scholar:daily-paper-generator   gate: a structured digest of the selected papers exists
  ├─ about to convert a raw web page into clean Markdown as part of ingesting a source?  → invoke claude-scholar:defuddle   gate: a clean Markdown copy of the page exists with page chrome removed
  ├─ about to co-draft a substantial document like a proposal, spec, or RFC with the user through iterative rounds?  → invoke claude-scholar:doc-coauthoring   gate: a decision doc or RFC exists after a round of reader feedback
  ├─ about to send the user a report or summary that should lead with the conclusion and cite evidence?  → invoke claude-scholar:expression-skill   gate: the response states its conclusion first and backs it with evidence
  ├─ about to build a new production-grade frontend interface or component from scratch?  → invoke claude-scholar:frontend-design   gate: new interface code for the requested component exists
  ├─ about to commit, branch, merge, or open a pull request in git?  → invoke claude-scholar:git-workflow   gate: a commit, branch, or pull request follows the project conventions
  ├─ about to add a PreToolUse, PostToolUse, or Stop hook to automate around tool calls?  → invoke claude-scholar:hook-development   gate: a hook script registered in the plugin config exists
  ├─ about to research how past Kaggle competition winners solved a similar modeling problem?  → invoke claude-scholar:kaggle-learner   gate: a technique cited is traced to an actual winning solution
  ├─ holding a messy conference-provided LaTeX template zip that needs a clean Overleaf-ready structure?  → invoke claude-scholar:latex-conference-template-organizer   gate: the reorganized template compiles cleanly in Overleaf
  ├─ about to add or configure an MCP server connection for a plugin?  → invoke claude-scholar:mcp-integration   gate: an mcp.json entry pointing at the new server exists
  ├─ about to draft a submission-ready ML paper for a venue like NeurIPS, ICML, or ICLR from a research repo?  → invoke claude-scholar:ml-paper-writing   gate: a LaTeX manuscript using the target venue template exists
  ├─ about to prepare or audit the data availability statement and repository plan for a manuscript?  → invoke claude-scholar:nature-data   gate: a data statement naming a repository and accession details exists
  ├─ have an already-drafted manuscript paragraph that needs journal-style English polish rather than new content?  → invoke claude-scholar:nature-polishing   gate: the wording changes but the claims and results stay the same
  ├─ revising a Nature-family manuscript and holding an editor decision letter with reviewer comments to respond to?  → invoke claude-scholar:nature-response   gate: a point-by-point letter addressing each reviewer comment exists
  ├─ have raw claims, results, or notes for a Nature-family manuscript that still need to become drafted prose?  → invoke claude-scholar:nature-writing   gate: a drafted section such as the abstract or results narrative exists
  ├─ already know where content belongs in the vault and just need it correctly formatted, with working wikilinks or canvas files?  → invoke claude-scholar:obsidian-kb-artifacts   gate: the vault file formatting is correct and its links resolve
  ├─ about to run a review across already-ingested papers and synthesize them into the knowledge base?  → invoke claude-scholar:obsidian-literature-workflow   gate: a synthesis note and a literature map covering the papers exist
  ├─ unsure where a new note belongs in the project knowledge base, or the project vault is not yet set up?  → invoke claude-scholar:obsidian-project-kb-core   gate: the note lands under the right folder and the index reflects it
  ├─ about to file a newly found external paper, webpage, doc, dataset, or interview into the knowledge base?  → invoke claude-scholar:obsidian-source-ingestion   gate: a source note exists under the matching subfolder
  ├─ about to self-audit a paper draft for completeness and whether its claims are actually supported before submitting?  → invoke claude-scholar:paper-self-review   gate: each claim is checked against the result that supports it
  ├─ starting a non-trivial multi-step task whose plan should persist on disk rather than live only in context?  → invoke claude-scholar:planning-with-files   gate: a plan file on disk tracks progress across the task steps
  ├─ about to scaffold a new Claude Code plugin or reorganize how its commands, agents, skills, and hooks are laid out?  → invoke claude-scholar:plugin-structure   gate: a plugin.json and the expected component folders exist
  ├─ a paper was just accepted and now needs conference presentation materials like slides, a poster, or social promotion?  → invoke claude-scholar:post-acceptance   gate: a slide deck, poster file, or promotional draft exists
  ├─ already have the results data and need a publication-quality figure or its companion table for a results section?  → invoke claude-scholar:publication-chart-skill   gate: a paper-ready figure and its companion table exist for one result
  ├─ at the very start of a project and need to brainstorm questions or find gaps in the existing literature?  → invoke claude-scholar:research-ideation   gate: a research question and an identified gap exist before any experiment
  ├─ holding raw experiment results and need rigorous statistical analysis or significance checks before writing anything up?  → invoke claude-scholar:results-analysis   gate: a significance test or ablation result backs the comparison made
  ├─ the experiment analysis is already done and now needs to become a structured, decision-oriented writeup?  → invoke claude-scholar:results-report   gate: the writeup states a decision or recommendation, not just numbers
  ├─ received reviewer comments on a paper submission and need to analyze them before drafting a general rebuttal?  → invoke claude-scholar:review-response   gate: a rebuttal draft addresses each reviewer comment identified
  ├─ about to author a new Claude skill or repair an existing one so its trigger description actually fires?  → invoke claude-scholar:skill-development   gate: the skill file description and structure change, not just wording
  ├─ holding a quality report or improvement plan for a skill and need to apply its recommendations?  → invoke claude-scholar:skill-improver   gate: the skill file is edited to match a plan recommendation
  ├─ about to evaluate an existing skill and produce a quality report rather than edit it directly?  → invoke claude-scholar:skill-quality-reviewer   gate: a report scoring description, organization, and structure exists
  ├─ about to choose a color palette, typography, or design system before or while building an interface?  → invoke claude-scholar:ui-ux-pro-max   gate: a documented color and typography system backs the choices
  ├─ setting up dependencies or a virtual environment for a Python project using uv?  → invoke claude-scholar:uv-package-manager   gate: a uv lockfile and virtual environment exist for the project
  ├─ about to open a pull request and need one pass that runs build, type check, lint, tests, and a security scan together?  → invoke claude-scholar:verification-loop   gate: build, type check, lint, and tests all run and are recorded
  ├─ have a website running locally or remotely and need to visually inspect it for design or responsive defects?  → invoke claude-scholar:web-design-reviewer   gate: specific visual defects are listed against the site with a fix
  ├─ about to functionally test a local web application by automating clicks and reading browser logs with Playwright?  → invoke claude-scholar:webapp-testing   gate: a Playwright run against the local app produces a screenshot or log
  ├─ have AI-generated prose that reads robotic and needs to sound naturally human before it ships?  → invoke claude-scholar:writing-anti-ai   gate: the rewritten text no longer shows the flagged patterns
  ├─ Zotero is the source of truth for references and its entries need to reach the knowledge base as source notes?  → invoke claude-scholar:zotero-obsidian-bridge   gate: a source note under Sources/Papers links back to its Zotero entry
```

**Drift:** every route above targets `claude-scholar:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **claude-scholar** (https://github.com/Galaxy-Dawn/claude-scholar). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
