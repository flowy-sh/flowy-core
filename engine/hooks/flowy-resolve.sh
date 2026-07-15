#!/usr/bin/env sh
# =============================================================================
# flowy-resolve.sh — shared FLOW.md resolution (SINGLE SOURCE OF TRUTH).
# Sourced (never executed) by flowy-inject.sh AND flowy-recompact.sh so the two
# hooks cannot drift on the per-flow "name/ref/location -> resolved FLOW.md"
# contract. POSIX sh; no jq/node.
#
#   flowy_resolve_flowmd NAME REF LOC PROJECT_FLOWS_DIR PLUGIN_ROOT [OVERLAY_PLUGIN_ROOT]
#     Echoes the resolved absolute FLOW.md path, or NOTHING (empty) if unresolvable.
#       location "project"      -> ONLY <PROJECT_FLOWS_DIR>/<name>/FLOW.md (no plugin
#                                  fallback; an explicit project entry must not be
#                                  silently rescued by a same-named bundled flow).
#       location "overlay"      -> <OVERLAY_PLUGIN_ROOT>/<ref> if valid, else auto-repair
#                                  <OVERLAY_PLUGIN_ROOT>/flows/<name>/FLOW.md. Lets the
#                                  shared engine resolve a FLOW.md that lives in a
#                                  DIFFERENT (per-flow overlay) plugin instead of the
#                                  engine's own PLUGIN_ROOT. The 6th arg is optional and
#                                  MUST live under the same /plugins/ tree as PLUGIN_ROOT
#                                  (S1 containment guard) or it is discarded.
#       location "plugin"/absent -> <PLUGIN_ROOT>/<ref> if valid, else auto-repair
#                                  <PLUGIN_ROOT>/flows/<name>/FLOW.md.
#     Drops a REF containing `..`, a disallowed char ([^A-Za-z0-9_./-]), a bare single
#     dot, or a backslash (falls through to name-based auto-repair, like a stale ref).
#     Guards NAME against disallowed chars / `..` / empty. Rejects a SYMLINKED resolved
#     file (RR3): `[ -f ]` follows symlinks, so a planted link could read an arbitrary
#     file into the agent's context.
# =============================================================================
flowy_resolve_flowmd() {
  _name="$1"; _ref="$2"; _loc="$3"; _pfd="$4"; _pr="$5"; _flowpr="${6:-}"
  _resolved=""
  # OVERLAY plugin-root guard: it comes from the per-session state's pluginRoot
  # (activator-written, not repo-committed). Normalize Windows separators FIRST, the
  # same way flowy-paths.sh does (a wrapper-reported "Base directory" can arrive in
  # C:\...\ form and would silently fail POSIX `[ -f ]`), THEN drop a root carrying
  # traversal so a hand-edited state can't escape; absolute-path chars (:, /) are fine.
  _flowpr="$(printf '%s' "$_flowpr" | tr '\\' '/')"
  case "$_flowpr" in *..* ) _flowpr="" ;; esac
  # S1: containment — the overlay root MUST live under the SAME /plugins/ tree as the
  # engine ($_pr = $CLAUDE_PLUGIN_ROOT). Derive the shared prefix up to and including
  # "/plugins/"; refuse any root that doesn't start with it (an absolute /tmp/evil or a
  # UNC path cannot smuggle an attacker-controlled FLOW.md into the injected banner).
  if [ -n "$_flowpr" ]; then
    _plugbase="${_pr%/plugins/*}/plugins/"
    case "$_flowpr" in "$_plugbase"* ) : ;; * ) _flowpr="" ;; esac
  fi

  # REF guard: drop traversal / disallowed chars / bare-dot / backslash.
  case "$_ref" in *..* ) _ref="" ;; esac
  case "$_ref" in
    *[!A-Za-z0-9_./-]* ) _ref="" ;;
    '.' ) _ref="" ;;
    *\\* ) _ref="" ;;
  esac

  if [ "$_loc" = "project" ]; then
    case "$_name" in
      *[!A-Za-z0-9_.-]* | *..* ) : ;;  # unsafe name → no resolution
      '' ) : ;;
      * )
        _pcanon="$_pfd/$_name/FLOW.md"
        if [ -f "$_pcanon" ] && [ ! -L "$_pcanon" ]; then _resolved="$_pcanon"; fi
        ;;
    esac
  elif [ "$_loc" = "overlay" ]; then
    # Resolve against the per-flow overlay root ($6), NOT the engine root ($5).
    # $_flowpr was normalized + traversal-guarded + containment-checked above.
    if [ -n "$_flowpr" ] && [ -n "$_ref" ] && [ -f "$_flowpr/$_ref" ] && [ ! -L "$_flowpr/$_ref" ]; then
      _resolved="$_flowpr/$_ref"
    else
      case "$_name" in
        *[!A-Za-z0-9_.-]* | *..* ) : ;;
        '' ) : ;;
        * )
          _ocanon="$_flowpr/flows/$_name/FLOW.md"
          if [ -n "$_flowpr" ] && [ -f "$_ocanon" ] && [ ! -L "$_ocanon" ]; then _resolved="$_ocanon"; fi
          ;;
      esac
    fi
  elif [ -n "$_ref" ] && [ -f "$_pr/$_ref" ] && [ ! -L "$_pr/$_ref" ]; then
    _resolved="$_pr/$_ref"
  else
    case "$_name" in
      *[!A-Za-z0-9_.-]* | *..* ) : ;;  # unsafe name → skip auto-repair
      '' ) : ;;
      * )
        _canon="$_pr/flows/$_name/FLOW.md"
        if [ -f "$_canon" ] && [ ! -L "$_canon" ]; then _resolved="$_canon"; fi
        ;;
    esac
  fi

  printf '%s' "$_resolved"
}
