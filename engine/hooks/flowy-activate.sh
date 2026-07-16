#!/usr/bin/env sh
# =============================================================================
# flowy-activate.sh — write a fresh single-flow state-PENDING.json for activation.
#
# Invoked by the _activator skill with the flow ALREADY resolved. Deterministic,
# SILENT on success. Reuses hooks/flowy-paths.sh (the canonical key helper) so the
# activator and the hook agree on the out-of-repo state dir byte-for-byte.
#
# Usage: flowy-activate.sh <plugin-root> <flow-name> <flow-ref> [<location>] [<flow-plugin-root>]
#   <plugin-root>       CLAUDE_PLUGIN_ROOT (carries /plugins/) or a /.claude home
#   <flow-name>         kebab-case slug, e.g. superpowers-flow
#   <flow-ref>          plugin-root-relative ref, e.g. flows/superpowers-flow/FLOW.md
#   <location>          "plugin" (default), "project", or "overlay"
#   <flow-plugin-root>  REQUIRED for location=overlay: the overlay flow's OWN plugin root
#                       (a sibling plugin under the same /plugins/ tree). Empty otherwise.
#
# Project dir: prefer $CLAUDE_PROJECT_DIR (exact match with the hook where the
# shell exposes it); else $(pwd). The canonical helper folds /e/ <-> E:\ to one
# key, so pwd's MSYS form resolves to the hook's Windows-form key.
#
# Output contract: success => exit 0, NOTHING on stdout. Failure => non-zero and
# a one-line reason on stderr. Fail-loud, never a wrong key. FLOW_NAME and
# FLOW_REF are charset-validated below before being written into the JSON
# (the hook's read-side strip only sanitizes display, not a structural breakout).
# =============================================================================

set -u 2>/dev/null || true

PLUGIN_ROOT="${1:-}"
FLOW_NAME="${2:-}"
FLOW_REF="${3:-}"
LOCATION="${4:-plugin}"
FLOW_PLUGIN_ROOT="${5:-}"   # the overlay flow's OWN plugin-root (overlay activations only)

[ -n "$PLUGIN_ROOT" ] || { printf 'flowy-activate: missing plugin root\n' >&2; exit 2; }
[ -n "$FLOW_NAME" ]   || { printf 'flowy-activate: missing flow name\n' >&2; exit 2; }
[ -n "$FLOW_REF" ]    || { printf 'flowy-activate: missing flow ref\n' >&2; exit 2; }
# Charset-validate name + ref BEFORE interpolating them into the state JSON below:
# a crafted name/ref could otherwise break out of the JSON string and inject a
# second activeFlows entry that the hook's line-oriented parser would resolve.
case "$FLOW_NAME" in
  -* | *[!a-z0-9-]*) printf 'flowy-activate: invalid flow name: %s\n' "$FLOW_NAME" >&2; exit 2 ;;
esac
case "$FLOW_REF" in
  *..* | *[!A-Za-z0-9_./-]*) printf 'flowy-activate: invalid flow ref: %s\n' "$FLOW_REF" >&2; exit 2 ;;
esac
case "$LOCATION" in plugin | project | overlay) : ;; *) LOCATION="plugin" ;; esac
# An overlay activation MUST carry the flow's own plugin-root; without it the hook
# cannot resolve the overlay FLOW.md, so activating would be a silent no-op. Refuse.
if [ "$LOCATION" = "overlay" ] && [ -z "$FLOW_PLUGIN_ROOT" ]; then
  printf 'flowy-activate: location overlay requires a flow-plugin-root arg\n' >&2; exit 2
fi
# Normalize Windows separators FIRST (mirrors flowy-resolve.sh's _flowpr handling), then
# traversal + charset-guard the flow-plugin-root before it reaches the resolver or the state
# file (empty for plugin/project, a no-op there). FIX A (P0): a root containing `"` or `,`
# (legal Windows filename chars) would otherwise break out of the hand-rolled JSON string in
# the heredoc below and inject a phantom activeFlows entry the hook would fire as authoritative
# routing. This is the WRITE-SITE half of a deliberate two-site guard; the resolver-side copy
# is flowy_charset_ok_pluginroot (flowy-resolve.sh). Keep this `case` BYTE-IDENTICAL to that
# helper if the allowed charset ever changes (both are exercised by their own tests).
FLOW_PLUGIN_ROOT="$(printf '%s' "$FLOW_PLUGIN_ROOT" | tr '\\' '/')"
case "$FLOW_PLUGIN_ROOT" in
  *..* | *[!A-Za-z0-9_./:\ \(\)-]* )   # keep identical to flowy_charset_ok_pluginroot
    printf 'flowy-activate: invalid flow-plugin-root\n' >&2; exit 2 ;;
esac

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
[ -n "$PROJECT_DIR" ] || { printf 'flowy-activate: no project dir\n' >&2; exit 3; }

# Overlay hard-gate. An overlay activation must resolve to a REAL FLOW.md that lives
# under the SAME /plugins/ tree as the engine (the S1 containment guard lives inside
# flowy_resolve_flowmd — Task 3). Enforce it HERE so a bad/out-of-tree overlay root is
# refused at activation time and never reaches a PENDING file the hook would claim.
# plugin/project activations skip this block entirely (they never source the resolver).
if [ "$LOCATION" = "overlay" ]; then
  . "$PLUGIN_ROOT/hooks/flowy-resolve.sh" 2>/dev/null || {
    printf 'flowy-activate: cannot source flowy-resolve.sh under %s\n' "$PLUGIN_ROOT" >&2
    exit 1
  }
  # 4th arg (project flows dir) is unused for overlay resolution — a safe placeholder.
  _FMD="$(flowy_resolve_flowmd "$FLOW_NAME" "$FLOW_REF" "overlay" "$PROJECT_DIR/.flowy/flows" "$PLUGIN_ROOT" "$FLOW_PLUGIN_ROOT")"
  [ -n "$_FMD" ] || {
    printf 'flowy-activate: overlay FLOW.md not resolvable (bad root/ref, or outside the plugins tree)\n' >&2
    exit 3
  }
fi

# Canonical state dir via the SINGLE source of truth (same as the hook + GC).
. "$PLUGIN_ROOT/hooks/flowy-paths.sh" 2>/dev/null || {
  printf 'flowy-activate: cannot source flowy-paths.sh under %s\n' "$PLUGIN_ROOT" >&2
  exit 4
}
STATE_DIR="$(flowy_state_dir "$PROJECT_DIR" "$PLUGIN_ROOT")"
[ -n "$STATE_DIR" ] || { printf 'flowy-activate: empty state dir (unexpected layout)\n' >&2; exit 5; }

mkdir -p "$STATE_DIR" 2>/dev/null || {
  printf 'flowy-activate: cannot mkdir %s\n' "$STATE_DIR" >&2
  exit 6
}

# A fresh activation supersedes any unclaimed PENDING. Claimed state-<id>.json
# files (this or other sessions) are left to the GC + TTL — not our job.
rm -f "$STATE_DIR/state-PENDING.json" 2>/dev/null || true

EPOCH="$(date +%s 2>/dev/null)"
case "$EPOCH" in '' | *[!0-9]*) printf 'flowy-activate: no epoch\n' >&2; exit 7 ;; esac

# Write atomically: tmp + mv, so the hook never claims a half-written file. We rm
# the real file above first, so the mv targets a non-existent path (avoids the
# Windows replace-over-existing quirk).
# F4: unique per-writer tmp ($$ = pid) so two concurrent same-project activations don't race
# on ONE shared tmp path (the loser would otherwise hit the mv-failed branch with a misleading
# "cannot write state" error). The failure cleanup below uses $TMP, so it stays consistent.
TMP="$STATE_DIR/state-PENDING.json.$$.tmp"
cat > "$TMP" <<EOF
{
  "schema": "flowy-state-v2",
  "sessionId": "PENDING",
  "createdAtEpoch": $EPOCH,
  "activeFlows": [
    { "name": "$FLOW_NAME", "flowRef": "$FLOW_REF", "location": "$LOCATION", "pluginRoot": "$FLOW_PLUGIN_ROOT" }
  ]
}
EOF
mv "$TMP" "$STATE_DIR/state-PENDING.json" 2>/dev/null || {
  rm -f "$TMP" 2>/dev/null || true
  printf 'flowy-activate: cannot write state file in %s\n' "$STATE_DIR" >&2
  exit 8
}

exit 0
