# The fork notice (2026-07-28)

**Status:** shipped. `engine/hooks/flowy-origin.sh` + the notice block in
`engine/hooks/flowy-inject.sh`, hardened the same day by the ce:review remediation.

## Problem

`ATTRIBUTION.md` states what reuse obliges. Nobody reads `ATTRIBUTION.md`.

CC BY-SA 4.0 wants forks, and so do we: the strategy is attribution rather than walls, because
a copy that credits us is distribution. But the obligation lives in a file at the root of a
repository a forker has no reason to open, and the moment they would most benefit from knowing
about it is the moment they are working inside the fork, not the moment they cloned it.

## Decision

When the engine is running from a fork or mirror, the hook prints a one-time notice naming the
fork, saying forking is allowed, and handing over the exact attribution line to paste.

Five properties, each with a test in `engine/tests/flowy-origin.test.ts` or
`engine/tests/flowy-inject.test.ts`.

**1. Local only. No network, ever.** Detection is a read of the marketplace clone's
`.git/config` at `<claude-home>/plugins/marketplaces/<name>/.git/config`, parsed with `awk`
rather than by shelling out to `git`, so it works with no git binary on `PATH` and spawns no
subprocess. A test scans every shell script in `engine/hooks/` and fails on a network-capable
command.

An enforcement hook that reported installs back to its author would be telemetry. Shipping that
inside an open-source plugin is a trust loss we would not get back, and it would poison the one
thing the notice is for: a forker has to believe the notice is a courtesy rather than a beacon.

The guard is a denylist over source text, which is a floor and not a proof. `PROVENANCE.md`
says so in those words rather than implying the test settles it.

**2. Once per project, never again.** A per-prompt nag gets the hook deleted, and deleting the
hook takes routing down with it, so the failure mode of nagging is not "mild annoyance", it is
"the product stops working". A marker file beside the state files records that the notice
fired.

The marker is written BEFORE the notice is emitted, and the notice is emitted only if the write
succeeded. The reverse order, which is what shipped first, produced exactly the failure the
code comment forbade: on an unwritable state dir the write failed, `|| true` swallowed it, and
the notice fired every prompt forever while leaking a shell error to stderr each turn. Emitting
only after a durable marker means the worst case is one MISSED notice rather than an unbounded
nag. The existence test is `[ ! -e ]`, not `[ ! -f ]`, because a directory at the marker path
read as absent.

**3. An origin we cannot determine is treated as CANONICAL.** Unknown layout, absent config, no
remote section, a tarball install, a vendored copy, a slug that fails the charset allowlist:
silence. `flowy_is_canonical_origin` answers "yes" to the empty string, so every failure path
collapses to the same quiet outcome.

A false fork accusation is worse than no notice. It nags our own users about forking a repo
they did not fork, and it is the fastest way to make the notice something people learn to
ignore. This also means the slug is REFUSED rather than sanitized when it contains anything
outside GitHub's own legal charset: the slug is printed into the agent's authoritative context
from a file a cloned install fully controls, and a refused slug is empty, which means silence.

The comparison is host-qualified. `gitlab.com/flowy-sh/flowy-core` is byte-identical in
owner and repo to our own origin, so discarding the host made every full mirror on somebody
else's infrastructure read as canonical, silent for precisely the case the notice exists to
catch.

**4. The marker is namespaced per marketplace.** `origin-notice-<marketplace>`, not
`origin-notice`. The README declares the state directory shared by three Flowy engines. An
unnamespaced marker means whichever engine gets there first silences the other two, so a forked
overlay installed beside a canonical core would never announce itself. `<marketplace>` is a
single path segment by construction, since `flowy_marketplace_name` splits on `/`, so it cannot
traverse out of the state dir.

**5. It is NOT enforcement, and is not presented as such.** Anyone forking in order to strip
attribution deletes the hook first. That is not a gap to be closed later; it is the shape of
the thing. A hook that runs inside the copier's own checkout can never bind the copier.

What the notice does is remove the work from compliance for the large majority who would comply
anyway and simply do not know what is required. The line is pasteable, the terms are one click
away, and the credit string in the notice is the same string `ATTRIBUTION.md`, `NOTICE`,
`README.md` and `flowy.sh/license` all mandate. If they copy, they attribute, and a copy that
attributes is distribution.

## What this added, and why each piece needs saying

Recorded because none of it was obvious from the diff, and no decision document existed for any
of it until this one.

- **A shell module contract.** `flowy-origin.sh` is SOURCED, never executed, and defines four
  functions. That is a new kind of file in `engine/hooks/`, where everything else is a hook
  entry point. Sourcing it also introduced a hazard: `.` is a POSIX special builtin, so
  `. helper || true` on a missing file aborts the whole script under the production shell, and
  it took the banner down with it. The existence test lives outside the builtin now.
- **A second line on the enforcement channel.** The routing banner is the one thing the hook
  prints, and its budget is guarded. The notice is a second line on the same stdout channel a
  copier's agent treats as authoritative, which is why the slug that reaches it is charset
  allowlisted, length capped, and refused rather than cleaned. A test asserts the routing
  banner is still exactly one line when the notice fires.
- **A new persistent on-disk artifact.** One more sidecar in a shared state directory that a
  garbage collector, a sibling engine, and a future migration all have to know about. It is
  documented in the README's state contract rather than left for somebody to find.
- **A security-adjacent file read.** The hook now reads a git config file, which is
  attacker-controlled in the vendored-copy case, and prints part of it into a context window.
  That is a trust boundary, and it is the reason for the allowlist rather than a denylist: the
  first version's whitespace check covered two codepoints, and U+00A0, `$(...)` and backticks
  all walked through it.

## Rejected

- **Blocking, or any exit code other than 0.** The hook's contract is fail-loud, never
  fail-closed. A licence notice is not worth a broken session, and a hook that can break a
  session gets uninstalled.
- **Calling the GitHub API to resolve the fork's parent.** It would give a better notice,
  naming the upstream precisely. It also makes the hook phone home, which costs more than the
  notice is worth. See property 1.
- **Firing once per session instead of once per project.** Cheaper to implement, since the
  session id is already in hand. It is also the nag, spread out.
- **Saying nothing and relying on `ATTRIBUTION.md`.** That is the status quo the notice
  exists to fix, and the review that produced this document found the file has no inbound path
  from anywhere a forker actually looks.
