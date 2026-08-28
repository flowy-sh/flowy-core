# FLOW.md: ultra-powers

> The everything-Flow for an indie founder building, shipping, and growing software. 40 real, hand-verified skills across validate → design → plan → build → debug → verify → review → ship → grow, composed from seven open-source suites (superpowers, compound-engineering, gstack, frontend-design, emil, marketing-skills, claude-seo) — with a routing tree that knows *which* of the overlapping skills to fire.
> Skills by their respective authors (MIT / Apache-2.0, see Attribution). Routing by Flowy.

<!-- The Flowy engine supplies the universal contract (announce, READ/invoke, host-wins,
     post-compaction re-read). This file carries only the routing + disambiguation. -->

## Routing

**The rule. MANDATORY, not advisory.** When a trigger matches, INVOKE the named skill with the
Skill tool BEFORE doing the task yourself. Do not write the code, patch the bug, design the
screen, or claim 'done' until you have READ this FLOW.md and invoked every matched skill.
**Producing the artifact when a trigger matched and you did not invoke is a VIOLATION, not a
shortcut.** Naming the skill in your reply is not invoking it: invoking means an actual Skill tool
call you can point at.

**The one rule that makes this Flow worth more than its skills.** Five suites overlap on purpose,
and the Flow's value is knowing which to fire:

- **superpowers = portable DISCIPLINES** — laws + gates, no tooling (brainstorming, writing-plans, TDD, systematic-debugging, verification, code-review, worktrees). Reach for these when you want the *guardrail*.
- **compound-engineering (the ce-\* skills) = end-to-end WORKFLOWS** — tooling, sub-agents, auto-fix, tracker ingestion. Reach for these when you want the *machine*.
- **gstack = founder-lens REVIEWS + ops** — review a plan/diff through a CEO/eng/DX persona, audit security, generate docs.
- **claude-seo owns SEO execution; marketing-skills owns GTM.**

**Never fire both halves of a pair on one task.** Pick the lane (discipline *or* workflow), and
route by the tiebreakers in Disambiguation.

```
USER MESSAGE
  │ — VALIDATE / IDEATE —
  ├─ is this NEW idea worth building? (demand, wedge, should-I)        → invoke ultra-powers:office-hours
  ├─ what should I build/improve NEXT in this project?                 → invoke ultra-powers:ce-ideate
  │ — DESIGN (spec) — pick ONE lane —
  ├─ refine a chosen idea into a design/architecture spec (TDD lane)?  → invoke ultra-powers:brainstorming        gate: approved design doc
  ├─ shape a chosen idea into a requirements doc (the WHAT; CE lane)?  → invoke ultra-powers:ce-brainstorm
  │ — DESIGN (UI) —
  ├─ design a NEW UI / page / visual identity (look, type, layout)?    → invoke ultra-powers:frontend-design
  ├─ make a UI FEEL right (animation, motion, micro-interactions)?     → invoke ultra-powers:emil-design-eng
  ├─ review existing animation / motion code?                          → invoke ultra-powers:review-animations
  │ — PLAN (create) — match the design lane —
  ├─ approved design → TDD implementation plan (code in every step)?   → invoke ultra-powers:writing-plans        gate: checkboxed tasks
  ├─ plan a broader / non-code / research-backed effort?               → invoke ultra-powers:ce-plan
  │ — PLAN (review) — harden a plan before building —
  ├─ stress-test a plan's scope / ambition ("think bigger")?           → invoke ultra-powers:plan-ceo-review
  ├─ stress-test a plan's architecture / edge cases / tests?           → invoke ultra-powers:plan-eng-review
  ├─ stress-test a dev-facing plan's DX (API/CLI/SDK)?                  → invoke ultra-powers:plan-devex-review
  ├─ run all the plan reviews at once?                                 → invoke ultra-powers:autoplan
  │ — BUILD —
  ├─ about to write implementation code (discipline)?                  → invoke ultra-powers:test-driven-development  gate: a failing test FIRST
  ├─ execute an approved plan end-to-end (CE machine)?                 → invoke ultra-powers:ce-work
  │ — DEBUG —
  ├─ something broken — want the root-cause guardrail?                 → invoke ultra-powers:systematic-debugging   gate: root cause written down
  ├─ bug tied to a tracker / want it diagnosed AND fixed end-to-end?   → invoke ultra-powers:ce-debug
  │ — VERIFY —
  ├─ about to claim done / fixed / passing?                            → invoke ultra-powers:verification-before-completion  gate: command output proves it
  │ — REVIEW —
  ├─ thorough pre-PR review with auto-fix (the system)?               → invoke ultra-powers:ce-review
  ├─ quick second-pair-of-eyes mid-task (one reviewer)?               → invoke ultra-powers:requesting-code-review
  ├─ received review feedback to address?                             → invoke ultra-powers:receiving-code-review  gate: every finding resolved
  ├─ pre-merge safety lens (SQL / LLM-trust / side-effects)?          → invoke ultra-powers:review
  │ — PROVE / SHIP —
  ├─ capture a GIF/screenshot proof of real usage for a PR?           → invoke ultra-powers:ce-demo-reel
  ├─ need parallel isolated branches?                                 → invoke ultra-powers:using-git-worktrees
  ├─ commit + push + open a PR with a value-first description?        → invoke ultra-powers:git-commit-push-pr
  ├─ land a finished branch (merge / integration choice)?             → invoke ultra-powers:finishing-a-development-branch  gate: tests pass
  │ — SECURE / CAPTURE / DOCS —
  ├─ security audit (secrets, supply chain, OWASP, STRIDE)?           → invoke ultra-powers:cso
  ├─ just solved something hard — capture it for reuse?               → invoke ultra-powers:ce-compound
  ├─ write user-facing docs from scratch (tutorial/how-to/ref)?       → invoke ultra-powers:document-generate
  ├─ "what did we ship" / weekly retrospective?                       → invoke ultra-powers:retro
  ├─ wrap a session / hand off to another agent?                      → handoff
  │ — GROW (set up once) —
  ├─ define positioning / ICP / who-this-is-for (do this FIRST)?      → invoke ultra-powers:product-marketing
  ├─ I don't know what growth move to make next?                      → invoke ultra-powers:marketing-ideas
  │ — GROW (GTM) —
  ├─ write page / landing / pricing copy?                             → invoke ultra-powers:copywriting
  ├─ a page isn't converting (layout, friction, trust, CTA)?         → invoke ultra-powers:cro
  ├─ set pricing / tiers / freemium?                                  → invoke ultra-powers:pricing
  ├─ plan a launch / Product Hunt / GTM moment?                       → invoke ultra-powers:launch
  ├─ decide WHAT content/topics to create?                           → invoke ultra-powers:content-strategy
  ├─ build-in-public / social posts / threads?                       → invoke ultra-powers:social
  │ — GROW (SEO — claude-seo owns this) —
  ├─ any SEO intent: rank / audit / schema / technical / AI-Overviews/ backlinks / pages-at-scale? → invoke ultra-powers:seo
  │ — META —
  ├─ ad-hoc parallel research / fan-out?                              → invoke ultra-powers:dispatching-parallel-agents
  ├─ scope changed mid-task?                                          → re-enter the earliest invalidated phase: invoke ultra-powers:office-hours, ultra-powers:brainstorming, or ultra-powers:writing-plans
  ├─ blocked on an external dependency?                               → park: record blocker + resume condition; don't fake progress
  └─ question, not work (advise / explain)?                           → answer only; no files change
```

**Drift:** every route targets a skill in a SEPARATELY INSTALLED plugin. If a slug no longer
resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill. A broken
route means this Flow needs an update, not that you may improvise.

## Disambiguation (the tiebreakers — why this Flow beats loose skills)

**The superpowers ↔ compound-engineering pairs (the law: discipline vs workflow):**
- **ultra-powers:office-hours vs ultra-powers:ce-ideate** — ultra-powers:office-hours validates whether a NEW idea is worth building (demand, wedge). ultra-powers:ce-ideate *generates + ranks* what to build/improve next in an EXISTING project. Validate a bet → ultra-powers:office-hours; "what's next" → ultra-powers:ce-ideate.
- **ultra-powers:brainstorming vs ultra-powers:ce-brainstorm** — same job, different lane + handoff. `ultra-powers:brainstorming` bakes architecture into a design spec and hands to **ultra-powers:writing-plans → TDD**. `ultra-powers:ce-brainstorm` produces a requirements doc (the WHAT only) and hands to **ultra-powers:ce-plan → ultra-powers:ce-work**. Pick the lane and stay in it.
- **ultra-powers:writing-plans vs ultra-powers:ce-plan** — same name, different jobs. `ultra-powers:writing-plans` = a TDD-first implementation plan for **code** (actual code + failing-test-first in every step). `ultra-powers:ce-plan` = general structured planning (non-code, research-backed, "deepen" mode). Code you'll TDD → ultra-powers:writing-plans; anything else → ultra-powers:ce-plan.
- **ultra-powers:systematic-debugging vs ultra-powers:ce-debug** — `ultra-powers:systematic-debugging` is the portable root-cause *guardrail* you overlay on any failure (no tooling). `ultra-powers:ce-debug` is the full *workflow* — pulls the issue from gh/Linear/Jira, reproduces, fixes end-to-end. ultra-powers:ce-debug already contains the discipline; **don't stack them.** Tracker-tied / fix-it-all → ultra-powers:ce-debug; stray failure → ultra-powers:systematic-debugging.
- **ultra-powers:ce-review vs ultra-powers:requesting-code-review** — `ultra-powers:ce-review` is a 17-persona orchestrated *system* with a confidence gate + auto-fix + headless mode. `ultra-powers:requesting-code-review` dispatches ONE reviewer, fast, mid-task. Pre-PR gate / want auto-fix → ultra-powers:ce-review; quick eyes → ultra-powers:requesting-code-review.
- **ultra-powers:verification-before-completion has NO CE twin** — keep it as the done-gate. (CE's proof skill is a markdown editor, not verification; `ultra-powers:ce-demo-reel` makes *visual PR proof*, a different job. Written without backticks on purpose: a backticked bare slug reads as a routed skill to the rule engine, and this one must NOT be routed.)

**Plan create vs plan review (a whole phase, not a duplicate):**
- superpowers/CE **create** plans (ultra-powers:brainstorming/ultra-powers:writing-plans, ultra-powers:ce-brainstorm/ultra-powers:ce-plan). gstack's **ultra-powers:plan-ceo-review / ultra-powers:plan-eng-review / ultra-powers:plan-devex-review** *review an existing plan* through a persona lens. Different stage of the same loop — create first, then review.

**Design triad (overlap only on "motion"):**
- **ultra-powers:frontend-design** = the *look* (aesthetic direction, palette, typography, layout, the signature). **ultra-powers:emil-design-eng** = the *feel* (animation craft, easing, springs, micro-interactions). **ultra-powers:review-animations** = reviewing motion code (won't auto-fire — only a Flow naming it surfaces it). New UI → ultra-powers:frontend-design; make it feel right → emil; audit motion → ultra-powers:review-animations.

**Grow — who owns "SEO":**
- **`ultra-powers:seo` (claude-seo) owns ALL SEO execution** (audit, technical, schema, AI-Overviews/GEO, backlinks, pages-at-scale) — it's a 25-skill suite behind one router. `marketing-skills` owns broader GTM (positioning, copy, launch, channels). An SEO-specific verb → `ultra-powers:seo`; growth strategy where SEO is one channel → marketing. `ultra-powers:content-strategy` (marketing, decides *what* to write) and `ultra-powers:seo` (is it *optimized*) are complementary, not duplicate.

## Priority on collision

Top-down: 1. **Debug** a broken state. 2. **Verify** a pending "done" claim. 3. **TDD** before writing code. 4. **Plan** before building. 5. **Design** before planning (and **validate/ideate** before design if the bet itself is unsettled). 6. Everything else in lifecycle order. A scope change re-enters the earliest invalidated phase.

## Phases

Validate (ultra-powers:office-hours / ultra-powers:ce-ideate) → Design (ultra-powers:brainstorming|ultra-powers:ce-brainstorm + ultra-powers:frontend-design/emil) → Plan (ultra-powers:writing-plans|ultra-powers:ce-plan, then plan-*-review) → Build (TDD|ultra-powers:ce-work) → Verify (ultra-powers:verification-before-completion) → Review (ultra-powers:ce-review / ultra-powers:requesting-code-review / ultra-powers:review) → Ship (worktrees / ultra-powers:git-commit-push-pr / ultra-powers:finishing-a-development-branch) → Secure & capture (ultra-powers:cso / ultra-powers:ce-compound / ultra-powers:document-generate / ultra-powers:retro / handoff) → Grow (ultra-powers:product-marketing first, then GTM + ultra-powers:seo).

**Shortcuts:** bug → ultra-powers:systematic-debugging → TDD (regression test) → verify. UI feel → ultra-powers:emil-design-eng → verify. Ship → ultra-powers:git-commit-push-pr. Typo/config → fix → verify.

## You are rationalizing if you think…

- "I'll just design the screen / write the copy myself." → The taste is in the skill (ultra-powers:frontend-design / emil / ultra-powers:copywriting). Invoke it.
- "ultra-powers:ce-debug and ultra-powers:systematic-debugging are the same." → One is the machine, one is the guardrail. Pick the lane; don't stack.
- "I know which design skill." → New UI is ultra-powers:frontend-design; *feel* is emil; *reviewing* motion is ultra-powers:review-animations.
- "I'll verify after." → ultra-powers:verification-before-completion. Run the command in THIS message.
- "I'll just ship it." → ultra-powers:git-commit-push-pr / ultra-powers:finishing-a-development-branch. The PR description and the integration choice matter.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

All 40 skills are vendored and published as one installable plugin at
https://github.com/MaximoCorrea1/ultra-powers (MIT) — the repository this routing resolves
against. Composed skills (each retains its upstream LICENSE + attribution; nothing here is
claimed as original — the routing is the original work). Each skill's ORIGINAL upstream
source, credited below, is where its content was authored before being vendored into that
repo:
- **superpowers** — Jesse Vincent (obra), MIT — `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `using-git-worktrees`, `finishing-a-development-branch`, `dispatching-parallel-agents`
- **compound-engineering** — EveryInc, MIT — `ce-ideate`, `ce-brainstorm`, `ce-plan`, `ce-work`, `ce-debug`, `ce-review`, `ce-demo-reel`, `git-commit-push-pr`, `ce-compound`
- **gstack** — Garry Tan, MIT — `office-hours`, `plan-ceo-review`, `plan-eng-review`, `plan-devex-review`, `autoplan`, `review`, `cso`, `document-generate`, `retro` (pure-markdown skills only; gstack's daemon-bound skills are excluded)
- **frontend-design** — Apache-2.0 (NOTICE retained)
- **emilkowalski/skills** — Emil Kowalski, MIT — `emil-design-eng`, `review-animations`
- **marketing-skills** — Corey Haines, MIT — `product-marketing`, `marketing-ideas`, `copywriting`, `cro`, `pricing`, `launch`, `content-strategy`, `social`
- **claude-seo** — AgricIDaniel, MIT — `seo` (router over its ~7-skill indie subset)
- **`handoff`** — standalone skill, **NOT bundled** (no upstream LICENSE found); the FLOW routes to your INSTALLED `handoff`. Pin its license/ownership before redistributing ultra-powers wider.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
