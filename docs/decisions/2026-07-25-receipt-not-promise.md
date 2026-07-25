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
left them contradicting each other, and the activator is the more load-bearing — the banner
is ~40 tokens per prompt, the activator is the durable instruction read at activation.

## Why not just make it louder
0.3.0 was already a "dictatorial MANDATORY framing" pass (`1decca8`, released `2282c30`). The
banner was maximally emphatic and still failed. Emphasis was the approach that had already
been tried, so volume was not the lever left to pull.

## Decision
Change the ORDER OF OPERATIONS rather than the volume:
1. The `Routing:` line is a RECEIPT for a skill ALREADY invoked, never a plan.
2. `invoke` is bound to the mechanism: an actual Skill tool call.
3. The anti-pattern is NAMED: printing a YES you did not invoke is a violation.

## Rejected
Requiring the model to quote the skill's first mandatory line as unforgeable proof. It is the
strongest option — you can only produce that string by actually loading the skill — but it
costs output tokens on every routed turn and invites a NEW ritual (quoting a plausible-looking
line). Revisit only if the receipt framing measurably fails.

## Cost
The banner grows ~470 → ~590 bytes, injected on every prompt of every session. Accepted: a
banner that does not fire has an effective cost of infinity. If token pressure bites, cut the
compaction hint before the receipt clause.

## Release scope
Shipped across ALL FOUR manifests, matching the `2282c30` precedent. Every overlay pins the
engine with a caret (`^0.3.0` = `>=0.3.0 <0.4.0`), so bumping the engine alone would have made
all three overlay constraints unsatisfiable. Engine `0.4.0`, all three overlays `0.4.0`, all
three dependency pins `^0.4.0`. `engine/package.json` (private test harness) had drifted at
0.2.0 and was brought to 0.4.0 in the same change — nothing validates version consistency
across these files, which is why it drifted silently.

## How we will know it worked
**UNMEASURED at ship time** — diagnosed from one reproducible instance and reasoning, not an
A/B. Re-measure firing precision on Opus 5 (the existing ~90% figure predates it) AND on the
prior model: a fix that only helps one is not a fix. Until that runs, do not quote the ~90%
number anywhere public.
