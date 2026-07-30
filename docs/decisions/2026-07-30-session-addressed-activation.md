# Session-addressed activation (2026-07-30)

**Status:** implemented in `engine/hooks/flowy-activate.sh`; release pending.

## Problem

Two Claude Code sessions open on the same repo steal each other's activations. Reproduced live
today with hard evidence:

- The founder ran `/flowy-ultra-powers:activate` in session `914841d3`.
- Session `617c4564` — a second window running in `.claude/worktrees/all-lanes/apps/web`, which
  canonicalizes to the SAME project key — prompted first and claimed the activation.
- `914841d3` was left with no state file at all, so `flowy-inject.sh` took its no-op path
  (`[ -f "$STATE" ] || exit 0`) and the ⚑ banner never appeared. **For days, with no error.**

The symptom the founder reported was "Flowy keeps not invoking skills". Nothing in the chain
reports a failure, because from each component's point of view nothing failed.

## Root cause

`state-PENDING.json` carries no addressee. The hook claims it on behalf of whichever session
prompts first. The `mkdir` claim lock was built to stop two sessions claiming the SAME pending
concurrently — it does that correctly, and it is irrelevant here: the failure is not two sessions
racing, it is the WRONG session winning uncontested.

The existing code comment conceded the gap and mis-sized it: *"Leak cost … is rare for the
solo-founder case."* A solo founder with a worktree open is the reproducing case.

## Correcting the record

On 2026-07-30 an earlier session **falsified** this exact fix on the grounds that
`CLAUDE_CODE_SESSION_ID` "is not the hook's session id" — it had observed the env var holding
`914841d3` while the claimed state file was `state-617c4564.json`, and concluded the Bash tool
reports a different id (`CLAUDE_CODE_CHILD_SESSION=1` made that plausible).

That inference was wrong. `617c4564` was not this session under another name; it was a **different
live session**, with its own transcript and its own cwd. `CLAUDE_CODE_SESSION_ID` matches the
transcript filename and every `sessionId` field inside it. The falsification compared against a
value that never belonged to this session.

Worth keeping: a cheap test killed three hypotheses that day, and this is the one case where the
test itself was mis-read. **A control that is not what you think it is refutes nothing.** The
verification that settles it is end-to-end — activate, then confirm the banner arrives in the
session that asked.

## Decision

`flowy-activate.sh` reads `CLAUDE_CODE_SESSION_ID` and writes `state-<session_id>.json` directly.
No unaddressed envelope is created, so there is nothing for another session to claim and no race
to lose. The id is charset-guarded with the hook's own session_id allowlist
(`[A-Za-z0-9_-]{1,128}`); anything else degrades to the PENDING fallback rather than becoming a
path segment.

`flowy-inject.sh` is **unchanged**. It already reads `state-<session_id>.json` and still supports
the PENDING claim, so hosts that export no session id keep working exactly as before.

This also closes the second failure mode for free: an addressed state is never TTL-checked, so an
activation can no longer expire unclaimed while the user is distracted.

## Consequences

Stacking changes shape and the activator SKILL.md was updated in the same commit. Previously a
second activation wrote a PENDING the hook would not claim (the new Flow silently did nothing).
Now it writes the addressed path directly, which **replaces** the active Flow. Either way the
model-side merge is what makes stacking work; the instruction now says so explicitly, and orders
the merge BEFORE the script runs.

The stacking instructions also told the model to write a fresh `state-PENDING.json` alongside the
merged state. That is now removed: it would manufacture exactly the unaddressed envelope this
change exists to eliminate.

## Rejected

- **`CLAUDE_PID` as the correlator.** Unnecessary once the session id is known to be available,
  and it would need a matching process-tree walk on the hook side.
- **Shrinking the PENDING TTL.** Narrows the window; does not stop the wrong session claiming
  inside it. It treats a correctness bug as a timing bug.
- **A hook-side intent marker** (hook notices an activation-shaped prompt and marks the session,
  then claims only for a marked session). Works without any env var, but adds a second state file
  and a prompt-text heuristic to the enforcement path. Hold it in reserve for hosts that expose no
  session id.
- **Merging in the script.** Correct-looking, but reading back a state file and re-emitting it
  makes the activator parse untrusted JSON in shell. Left model-side, where it already lives.

## What this does NOT fix

- Hosts that export no `CLAUDE_CODE_SESSION_ID` still use PENDING and can still leak.
- An activation run from inside a **subagent** would address the subagent's session. The activator
  runs in the main session by design; no guard enforces that.
- **Adjacent latent bug, observed and not fixed:** the S1 containment check in
  `flowy_resolve_flowmd` compares the overlay `pluginRoot` against a prefix derived from
  `CLAUDE_PLUGIN_ROOT` as a raw string. `FIX D` normalizes backslashes but not drive-letter form,
  so a `/c/Users/...` engine root and a `C:/Users/...` overlay root fail to match and EVERY overlay
  degrades to "FLOW.md not found". Production passes the `C:`-rooted form, so this is not firing —
  it was reproduced only by a probe that set the env var by hand. Same class as ADR-021.

## How we will know it worked

The test is the seam, not the write: `engine/tests/flowy-activate.test.ts` activates as session A,
prompts the real hook as session B (must get nothing), then as session A (must get the banner).
Before the fix both halves failed. Asserting only on what the activator writes would not have
caught this — the file it produced looked correct in isolation.

The harness now sets `CLAUDE_CODE_SESSION_ID` explicitly on every case. These tests run inside
Claude Code, which exports a real one; inheriting it would have made unrelated cases green on CI
and red on a developer machine for reasons invisible in the test body.
