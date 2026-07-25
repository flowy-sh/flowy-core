# Receipt-Not-Promise Routing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the model from discharging its routing obligation by *writing* `Routing: X` instead of *invoking* the skill — the failure mode that makes skills silently stop firing on Opus 5.

**Architecture:** The promise-then-act ordering appears in TWO places — the per-prompt hook banner (`engine/hooks/flowy-inject.sh`) and the durable activator instruction (`engine/skills/_activator/SKILL.md`). Both are changed, because fixing only one leaves the other contradicting it. No change to state, resolution, GC, compaction, or the fail-open contract. The banner stays ONE line.

**Tech Stack:** POSIX `sh` (Git Bash on Windows), `bun test`, Claude Code plugin hooks.

## Global Constraints

- **FAIL-LOUD, NEVER FAIL-CLOSED.** The hook ALWAYS exits 0, NEVER blocks (never exit 2), degrades to a silent no-op on any error. Do not add a path that can exit non-zero.
- **The banner is ONE line.** Tests assert it. Do not split it or drop a clause.
- **POSIX `sh` only** — no bashisms.
- **⚠️ TARGET EDITS BY ANCHOR STRING, NEVER BY LINE NUMBER.** The first draft of this plan had every line number wrong by ~36 (they were read off a concatenated `curl` output, not the source file) and would have told a worker to overwrite `flowy-inject.sh:511-515` — which is **not a comment**, it is the `flowy_plugins_base` containment guard that stops a cloned repo's planted `.flowy/flows/<name>/FLOW-compact.md` from being `cat`'d into the agent's authoritative context. Deleting it is a security regression in the enforcement core. Anchor on exact strings.
- **Token cost is real.** The banner is injected on EVERY prompt of EVERY session. Measured: current ~470 bytes, new ~590 bytes (~30-35% larger). Prefer replacing words over appending.
- **Overlays depend on this.** `plugin.json` says so. A regression here regresses every Flow we ever ship.
- **Repo:** `C:\Users\User\flowy-core`, branch off `main`. Tests: `cd engine && bun test` (baseline: **120 pass, 0 fail, 8 files, ~99s**).
- **Windows write hazard:** `.gitattributes` forces `*.sh text eol=lf` and the file currently has ZERO CR bytes. A CRLF write produces `bad interpreter: sh\r`, silently killing enforcement for every user. Use the Edit tool, never PowerShell redirection (this project's memory records PS 5.1 mojibaking UTF-8), then verify.

---

## The problem, stated precisely

Current banner (anchor: `printf '%s\n' "⚑ Flowy routing ACTIVE:`):

> ⚑ Flowy routing ACTIVE: `<names>`. MANDATORY, not advisory: before any other tool, and before you write code or answer, you MUST have READ the FLOW.md in full (path below) and invoked every YES skill. Per its phase, commit each candidate skill (`'Routing: <skill> = YES,<reason>'` / `'NO,<reason>'`) and invoke each YES. FLOW.md (re-read after compaction): `<refs>`

It asks for **a written commitment** and, separately, for **an action**. Writing the line is cheap, feels like compliance, and discharges the obligation. **The ritual substitutes for the act.**

**The same ordering is in the activator** (`engine/skills/_activator/SKILL.md`, "Routing obligation" step 3 → step 4): *"State the routing decision out loud: `Routing [...]`"* and then, separately, *"If a skill should fire, invoke it."* That is the durable instruction the model reads at activation — arguably the more load-bearing of the two.

**Evidence this is structural, not a wording-strength problem:** the last two commits on `main` (`1decca8`, released as `2282c30` / 0.3.0) were already a *"dictatorial MANDATORY framing"* pass. The banner is ALREADY maximally emphatic and still failed — observed by the founder across two independent Opus 5 sessions, and self-confirmed in a third where the agent emitted `Routing: test-driven-development` and then wrote tests from memory with no Skill call. **More capitals is the approach that already lost. Change the ORDER OF OPERATIONS.**

Secondary defect: "invoked" reads equally as "made the tool call" and "followed that skill's guidance" — and following-from-memory is exactly the failure.

## The change

1. **Receipt, not promise.** The `Routing:` line records something already done, so it cannot be written *instead of* acting.
2. **Name the anti-pattern.** A named, described failure is avoided more reliably than an abstract rule is followed.
3. **Bind "invoke" to the mechanism** — the Skill tool call — closing the ambiguous reading.
4. **Apply 1-3 in BOTH places** (banner + activator), or they contradict each other.

**Rejected deliberately: requiring the model to quote the skill's first line as unforgeable proof.** Strongest option; costs output tokens on every routed turn and invites a new ritual ("quote a plausible-looking line"). Revisit only if the receipt framing measurably fails.

---

## Task 1: Rewrite the banner as a receipt

**Files:**
- Modify: `engine/hooks/flowy-inject.sh` — the `printf` anchored on `⚑ Flowy routing ACTIVE:` and the comment block immediately above it
- Modify: `engine/tests/flowy-inject.test.ts` — the assertion `expect(res.stdout).toContain("commit each candidate skill");`

**Interfaces:**
- Produces: the banner on stdout; Claude Code injects hook stdout into context on exit 0.
- Unchanged: exit code (always 0), one-line shape, `$LIVE_NAMES` / `$LIVE_REFS` interpolation (the only expansions; already sanitized upstream), the FLOW.md ref, the compaction hint.

> **MUST CONTINUE TO PASS — six further assertions pin the banner grammar in a block this plan does not otherwise touch** (`flowy-inject.test.ts` "forced-commitment"): `toContain("Routing:")`, `toContain("YES,<reason>")`, `toContain("NO,<reason>")`, `toMatch(/invoke/i)`, `toMatch(/before any other tool|non-compliant/i)`, and a non-empty-line count of exactly 1. The new text retains all of these — verify, don't assume. A future trim that drops the `<reason>` grammar breaks them.

- [ ] **Step 1: Replace the one outdated assertion**

In `engine/tests/flowy-inject.test.ts`, find `expect(res.stdout).toContain("commit each candidate skill");` and replace that single line with:

```ts
    // RECEIPT-NOT-PROMISE (2026-07-25). The banner previously asked for a
    // written commitment ("Routing: X = YES") and separately for an invoke, so
    // writing the line discharged the obligation and the skill never fired.
    // Case-insensitive on purpose: the banner shouts ALREADY for emphasis.
    expect(res.stdout).toMatch(/already invoked/i); // the Routing line is a RECEIPT
    expect(res.stdout).toMatch(/Skill tool/i); // "invoke" bound to the MECHANISM
    expect(res.stdout).toMatch(/violation/i); // the anti-pattern is NAMED
    expect(res.stdout).toContain("Routing:"); // per-skill decision record kept
```

Keep the existing `expect(res.stdout).toMatch(/invoke/i);` assertion above it.

- [ ] **Step 2: Run the tests to verify they FAIL**

Run: `cd "C:/Users/User/flowy-core/engine" && bun test tests/flowy-inject.test.ts`
Expected: FAIL on `/already invoked/i` (the current banner has no such phrase).

These tests are gated on `HAVE_GIT_BASH`, computed from `existsSync` over two candidate paths. Git Bash IS present at `C:\Program Files\Git\bin\bash.exe`, so the block RUNS. **If it SKIPS instead of failing, stop** — a skipped test proves nothing and this must not land unverified.

- [ ] **Step 3: Rewrite the banner**

In `engine/hooks/flowy-inject.sh`, find the line beginning `  printf '%s\n' "⚑ Flowy routing ACTIVE: $LIVE_NAMES.` and replace **that one line** with:

```sh
  printf '%s\n' "⚑ Flowy routing ACTIVE: $LIVE_NAMES. MANDATORY, not advisory: before any other tool, and before you write code or answer, you MUST have READ the FLOW.md in full (path below). Invoke = an actual Skill tool call; following a skill from memory or describing it is NOT invoking. Write 'Routing: <skill> = YES,<reason>' ONLY for skills you have ALREADY invoked this turn, and 'NO,<reason>' for the rest — the line is a RECEIPT, never a plan. Printing a YES you did not invoke is a VIOLATION, not compliance. FLOW.md (re-read after compaction): $LIVE_REFS"
```

Verified safe in POSIX `sh`: single quotes inside the double-quoted argument are literal; `<skill>`/`<reason>` are not redirections inside quotes; `=`, `;`, `—` are inert; no backticks, no `$(`, and **no `%`** (so the format-injection guard `not.toContain("%s")` still holds).

Then replace the comment block **immediately above that printf** (it currently begins `# HARDENED track: MAX enforcement.`) with:

```sh
  # HARDENED track: MAX enforcement, RECEIPT framing. ONE line carrying every measured
  # lever — it forces the FLOW.md READ (38%->100%), binds "invoke" to the Skill TOOL CALL,
  # makes the 'Routing:' line a RECEIPT for an already-made call (never a promise), and
  # NAMES the violation. The receipt ordering is the fix for the 2026-07-25 Opus 5
  # regression: the previous wording asked for a written commitment and separately for an
  # invoke, so writing the line discharged the obligation and the skill never fired. More
  # capitals had already been tried (0.3.0) and did not work. Keep it ONE line (tests
  # assert this); do not split or drop a clause. $LIVE_NAMES/$LIVE_REFS sanitized upstream.
```

**Do NOT touch the `_pluginsbase` / `flowy_plugins_base` block further down** — that is the compact-table containment guard, not a comment.

- [ ] **Step 4: Run the tests to verify they PASS**

Run: `cd "C:/Users/User/flowy-core/engine" && bun test tests/flowy-inject.test.ts`
Expected: PASS.

- [ ] **Step 5: Syntax gate + line endings (catches what Step 6 cannot)**

```bash
cd "C:/Users/User/flowy-core/engine"
sh -n hooks/flowy-inject.sh; echo "syntax_exit=$?"
grep -c $'\r' hooks/flowy-inject.sh
```
Expected: `syntax_exit=0` and a CR count of **0**. A botched quote gives `syntax_exit=2`; a CRLF write gives a non-zero CR count and would ship `bad interpreter: sh\r` to every user.

- [ ] **Step 6: Full suite — the banner is shared surface**

Run: `cd "C:/Users/User/flowy-core/engine" && bun test`
Expected: **120 pass, 0 fail.** If `flowy-inject`'s planted-content or routing-refresh tests fail, the edit hit more than the banner string — revert and redo by anchor.

- [ ] **Step 7: Fail-open contract (the no-Flow no-op path)**

```bash
cd "C:/Users/User/flowy-core/engine"
echo '{"session_id":"x","prompt":"hi"}' | sh hooks/flowy-inject.sh; echo "exit=$?"
```
Expected: **no output, `exit=0`.**

**Know what this does and does not prove.** With `CLAUDE_PROJECT_DIR`/`CLAUDE_PLUGIN_ROOT` unset, the script exits early — hundreds of lines before the banner — and an `EXIT` trap forces status 0. So a *syntactically broken* script also passes this. It is a real regression test for the no-op path and nothing more; **Step 5 is the syntax gate and Step 6 is what actually exercises the banner.**

- [ ] **Step 8: Commit**

```bash
cd "C:/Users/User/flowy-core"
git add engine/hooks/flowy-inject.sh engine/tests/flowy-inject.test.ts
git commit -m "fix(inject): make the Routing line a receipt, not a promise"
```

---

## Task 2: Fix the same ordering in the activator

**Why:** the banner is ~40 tokens per prompt; the activator is the DURABLE instruction read at activation. It currently says *state the routing decision* (step 3) and then, separately, *if a skill should fire, invoke it* (step 4) — the exact promise-then-act ordering Task 1 removes from the banner. Leaving it would have the two directly contradicting each other, and it is the half most likely to be blamed when a follow-up measurement comes back null.

**Files:**
- Modify: `engine/skills/_activator/SKILL.md` — the "Routing obligation" steps 3 and 4

**Interfaces:** prose only; no parser depends on this text (the state-file contract is elsewhere in the same file and is untouched).

- [ ] **Step 1: Read the current block**

Run: `cd "C:/Users/User/flowy-core" && grep -n "State the routing decision out loud" engine/skills/_activator/SKILL.md`
Note the surrounding numbered steps before editing so the list stays coherent.

- [ ] **Step 2: Invert the ordering**

Replace the step that begins `3. State the routing decision out loud:` with:

```markdown
3. **Invoke FIRST, record SECOND.** If the Flow routes to a skill, invoke it now via the Skill tool (Step 4 below decides HOW). Only AFTER the call has been made, record it: `Routing [<flow-name>]: <skill-name> — <reason>`, or `Routing [<flow-name>]: none — <reason>` when nothing routes. That line is a RECEIPT for a call you have already made, never a plan to make one. Invoke = an actual Skill tool call; following a skill from memory, paraphrasing it, or describing what it says is NOT invoking. Writing a `Routing:` line naming a skill you did not invoke is a VIOLATION, not compliance — it is the single most common way routing silently fails.
```

Keep step 4 (the namespaced-vs-bare invocation rule) as-is; step 3 now points at it.

- [ ] **Step 3: Verify nothing asserted on that prose**

Run: `cd "C:/Users/User/flowy-core/engine" && bun test`
Expected: **120 pass, 0 fail.**

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/User/flowy-core"
git add engine/skills/_activator/SKILL.md
git commit -m "fix(activator): invoke first, record second — the routing line is a receipt"
```

---

## Task 3: Release 0.4.0 across ALL FOUR manifests, and record the decision

**Why:** every overlay pins the engine `^0.3.0`, which under semver means `>=0.3.0 <0.4.0`. Bumping ONLY the engine to 0.4.0 makes all three overlay constraints **unsatisfiable**. The precedent is commit `2282c30` (the 0.3.0 release), which bumped four manifests together and said why.

**Files:**
- Modify: `engine/.claude-plugin/plugin.json` (version `0.3.0` → `0.4.0`, description)
- Modify: `overlays/superpowers/.claude-plugin/plugin.json` (own version → `0.4.0`, dependency → `^0.4.0`)
- Modify: `overlays/ultra-powers/.claude-plugin/plugin.json` (same)
- Modify: `overlays/growth-marketing/.claude-plugin/plugin.json` (same)
- Create: `docs/decisions/2026-07-25-receipt-not-promise.md`

- [ ] **Step 1: Bump the engine**

In `engine/.claude-plugin/plugin.json`, set `"version": "0.4.0"` (a behavioral change to the enforcement contract, not a patch) and the description to:

```
The Flowy enforcement engine (hook + activator). Overlays depend on this. 0.4.0: RECEIPT-framed routing — the 'Routing:' line records skills already invoked, so writing it can no longer substitute for invoking them.
```

- [ ] **Step 2: Bump all three overlays and their dependency pins**

In each of `overlays/superpowers`, `overlays/ultra-powers`, `overlays/growth-marketing` (`.claude-plugin/plugin.json`): set the overlay's own `"version"` to `"0.4.0"` and its dependency entry to `{ "name": "flowy-core", "version": "^0.4.0" }`.

- [ ] **Step 3: Verify no pin was missed**

```bash
cd "C:/Users/User/flowy-core"
grep -rn '"flowy-core", "version"' overlays/*/.claude-plugin/plugin.json
grep -rn '\^0\.3\.0' . --include=*.json
```
Expected: three `^0.4.0` hits, and the second command returns **nothing**.

- [ ] **Step 4: Note the pre-existing drift (do not silently fix)**

`engine/package.json` reads `0.2.0` while the plugin manifest reads `0.3.0` — it drifted at the last release and nothing validates it. It is `"private": true` and test-harness only, so it does not affect installs. Bump it to `0.4.0` for tidiness and say so in the commit; do NOT let it become a silent fifth version source.

- [ ] **Step 5: Write the decision record**

Create `docs/decisions/2026-07-25-receipt-not-promise.md`:

```markdown
# Receipt-not-promise routing (2026-07-25)

**Status:** shipped in flowy-core 0.4.0.

## Problem
Skills stopped auto-invoking on Opus 5 despite an active FLOW.md — observed by the founder
across two independent sessions and self-confirmed in a third, where the agent printed
`Routing: test-driven-development` and then wrote the tests from memory with no Skill call.

## Root cause
The instruction asked for a WRITTEN COMMITMENT (`Routing: X = YES`) and, separately, for an
ACTION (invoke). Writing the line is cheap, feels like compliance, and discharges the felt
obligation. The ritual substitutes for the act. Secondary: "invoked" reads equally as "made
the tool call" and "followed the guidance", and following-from-memory is the failure.

It appeared in TWO places: the per-prompt hook banner AND the activator's routing-obligation
steps ("state the decision" then "invoke"). Both were changed; fixing one alone would have
left them contradicting each other.

## Why not just make it louder
0.3.0 was already a "dictatorial MANDATORY framing" pass. The banner was maximally emphatic
and still failed. Emphasis was the approach that had already been tried.

## Decision
Change the ORDER OF OPERATIONS rather than the volume:
1. The `Routing:` line is a RECEIPT for a skill ALREADY invoked, never a plan.
2. `invoke` is bound to the mechanism: an actual Skill tool call.
3. The anti-pattern is NAMED: printing a YES you did not invoke is a violation.

## Rejected
Requiring the model to quote the skill's first line as unforgeable proof. Strongest option,
but it costs output tokens on every routed turn and invites a new ritual (quoting a
plausible-looking line). Revisit only if the receipt framing measurably fails.

## Cost
The banner grows ~470 → ~590 bytes, injected on every prompt of every session. Accepted: a
banner that does not fire has an effective cost of infinity. If token pressure bites, cut the
compaction hint before the receipt clause.

## How we will know it worked
UNMEASURED at ship time — diagnosed from one reproducible instance and reasoning, not an A/B.
Re-measure firing precision on Opus 5 (the existing ~90% predates it) AND on the prior model:
a fix that only helps one is not a fix.
```

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/User/flowy-core"
git add engine/.claude-plugin/plugin.json engine/package.json overlays/*/.claude-plugin/plugin.json docs/
git commit -m "chore(release): flowy-core 0.4.0 — receipt-framed routing across engine + overlays"
```

---

## Self-Review

**1. Spec coverage.** The finding named three vocabulary changes; Task 1 applies all three to the banner and Task 2 applies them to the activator (the second location, which the first draft missed entirely). The fourth idea (quote-the-first-line) is rejected with a reason. Release + decision record are Task 3.

**2. Placeholder scan.** No TBD/TODO. Banner string, activator replacement, and test assertions are verbatim. Every check is an exact command with exact expected output.

**3. Type consistency.** No types (shell + prose + JSON). The only shell expansions are `$LIVE_NAMES` / `$LIVE_REFS`, the same two the current line uses — no new sanitization surface. The version `0.4.0` and pin `^0.4.0` are used consistently across all four manifests.

**Review record (adversarial pass — this plan was NOT safe as first written):**

| # | Finding | Fix |
|---|---|---|
| **B1** | Every line number wrong by ~36 (read off a concatenated `curl` output). `511-515` is the `flowy_plugins_base` **security guard**, not a comment — following the plan would have deleted it. | Anchor-string targeting; explicit "do not touch" warning |
| **B2** | `toContain("already invoked")` vs banner `"ALREADY invoked"` — my own test failed my own banner | `toMatch(/already invoked/i)` |
| **B3** | All three overlays pin `^0.3.0`; bumping only the engine to 0.4.0 makes them unsatisfiable | Task 3 bumps all four, per the `2282c30` precedent |
| **B4** | Step 6's "non-negotiable" check provably passes a syntactically broken script (env guard exits early; `EXIT` trap forces 0) | Added `sh -n` + CR check as the real gate; documented what the no-op check does and does not prove |
| **R1** | Six further grammar assertions exist in a block the plan claimed didn't exist | Listed as must-still-pass |
| **R2** | The activator carried the identical promise-then-act ordering | **Promoted to Task 2** — the fix is incomplete without it |
