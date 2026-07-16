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

# --- Shared state-parsing + validation helpers (SINGLE SOURCE OF TRUTH) -------
# Sourced by flowy-inject.sh AND flowy-recompact.sh so the two readers cannot drift
# on the state contract, and by flowy-activate.sh (overlay write path) so the write
# site and the resolver share ONE charset definition instead of two hand-copied ones.

FLOWY_STATE_SCHEMAS="flowy-state-v1 flowy-state-v2"

# flowy_charset_ok_pluginroot VALUE -> returns 0 if VALUE is a safe absolute OS path,
# 1 otherwise. FIX A (P0): positive charset allowlist. A real OS path needs only alnum,
# /, ., -, _, : (drive), space, and (); anything else (in particular `"` `,` `{` `}`
# `` ` `` `$`, which could break out of the hand-rolled JSON state) is refused. Also
# rejects `..` traversal. Centralized so the write site and resolver cannot drift.
flowy_charset_ok_pluginroot() {
  case "$1" in
    *..* | *[!A-Za-z0-9_./:\ \(\)-]* ) return 1 ;;
    * ) return 0 ;;
  esac
}

# flowy_plugins_base ROOT -> echoes the prefix up to and including the LAST "/plugins/"
# segment of ROOT (normalized to forward slashes); echoes NOTHING if ROOT has no
# /plugins/ segment (callers must treat empty as "refuse", never as a match-all prefix).
# "%" (shortest-suffix, RIGHTMOST /plugins/) is load-bearing — same idiom as
# flowy-paths.sh's claude-home derivation; a home that itself contains a "plugins" dir
# must anchor on the LAST one. Used by the S1 containment guard and the reinject restrict.
flowy_plugins_base() {
  _fpb="$(printf '%s' "$1" | tr '\\' '/')"
  case "$_fpb" in
    */plugins/* ) printf '%s' "${_fpb%/plugins/*}/plugins/" ;;
    * ) : ;;
  esac
}

# flowy_extract_field CONTENT KEY -> echoes the VALUE of every `"KEY": "value"` line, one
# per line (line-oriented; the state is deliberately flat, no jq). Both readers parse the
# state through this ONE helper so the grep/sed pattern cannot drift between them.
flowy_extract_field() {
  printf '%s' "$1" \
    | grep -o "\"$2\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" \
    | sed 's/.*:[[:space:]]*"//; s/"$//' \
    | tr -d '\r'
}

# flowy_schema_ok CONTENT -> 0 if the state's top-level "schema" is one this reader
# understands (or absent — a pre-schema legacy state), 1 otherwise. F_SCHEMA: the schema
# marker was previously write-only dead data; gating on it means a FUTURE breaking shape
# (v3+) degrades via an intentional no-op here instead of being mis-parsed by an old reader.
flowy_schema_ok() {
  _fso="$(printf '%s' "$1" | grep -o '"schema"[[:space:]]*:[[:space:]]*"[^"]*"' | head -n 1 | sed 's/.*:[[:space:]]*"//; s/"$//')"
  [ -z "$_fso" ] && return 0   # schema-less legacy state: tolerate (the existing parser handled it)
  case " $FLOWY_STATE_SCHEMAS " in
    *" $_fso "* ) return 0 ;;
  esac
  return 1
}

# flowy_parity_ok CONTENT -> 0 if the positionally-zipped fields are aligned, 1 if the
# state is malformed (a caller that gets 1 must NOT resolve — fail loud, never wrong-fire).
# F2 (P1): NAMES/REFS/LOCATIONS/PLUGINROOTS are zipped by RAW LINE INDEX. The old guard
# counted "pluginRoot" KEY tokens, but the zip consumes VALUE lines — so a non-string
# value (`"pluginRoot": null`) counted as a key yet emitted NO value line and shifted
# every following entry's root (a REPRODUCED wrong-fire). Count VALUE LINES (what the zip
# actually consumes) for EVERY zipped field and require each to be absent (0) or present
# on every entry (== name count); a partial count (0 < c < n) means a shifted zip.
flowy_parity_ok() {
  _fpo_n="$(printf '%s' "$1" | grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' | grep -c .)"
  [ "$_fpo_n" -gt 0 ] || return 0   # no names -> nothing to zip; caller handles the empty case
  for _fpo_k in flowRef location pluginRoot; do
    _fpo_c="$(printf '%s' "$1" | grep -o "\"$_fpo_k\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | grep -c .)"
    if [ "$_fpo_c" -gt 0 ] && [ "$_fpo_c" -ne "$_fpo_n" ]; then
      return 1
    fi
  done
  return 0
}

# =============================================================================
flowy_resolve_flowmd() {
  _name="$1"; _ref="$2"; _loc="$3"; _pfd="$4"; _pr="$5"; _flowpr="${6:-}"
  _resolved=""
  # FIX D — normalize the ENGINE root ($5) too, same reasoning as _flowpr below: a
  # Windows-backslash-form CLAUDE_PLUGIN_ROOT has no literal "/" for
  # `${_pr%/plugins/*}` to split on, so S1's _plugbase (derived from $_pr just
  # below) would come out as garbage and EVERY overlay would silently resolve
  # empty. Production hands hooks POSIX paths already (see file header), so this
  # is defense-in-depth for any future/defensive caller, not an observed prod path.
  _pr="$(printf '%s' "$_pr" | tr '\\' '/')"
  # OVERLAY plugin-root guard: it comes from the per-session state's pluginRoot
  # (activator-written, not repo-committed). Normalize Windows separators FIRST, the
  # same way flowy-paths.sh does (a wrapper-reported "Base directory" can arrive in
  # C:\...\ form and would silently fail POSIX `[ -f ]`), THEN drop a root carrying
  # traversal so a hand-edited state can't escape; absolute-path chars (:, /) are fine.
  _flowpr="$(printf '%s' "$_flowpr" | tr '\\' '/')"
  # FIX A (P0) — traversal + positive charset allowlist via the shared helper (the same
  # definition flowy-activate.sh's write-site guard uses, so the two cannot drift). A
  # crafted root carrying `"` `,` `{` `}` etc. that could break out of the hand-rolled
  # JSON state is emptied here too, so a hand-edited/foreign state can't smuggle a phantom.
  flowy_charset_ok_pluginroot "$_flowpr" || _flowpr=""
  # S1: containment — the overlay root MUST live under the SAME /plugins/ tree as the
  # engine ($_pr = $CLAUDE_PLUGIN_ROOT). Derive the shared prefix up to and including
  # "/plugins/"; refuse any root that doesn't start with it (an absolute /tmp/evil or a
  # UNC path cannot smuggle an attacker-controlled FLOW.md into the injected banner).
  if [ -n "$_flowpr" ]; then
    _plugbase="$(flowy_plugins_base "$_pr")"
    if [ -n "$_plugbase" ]; then
      case "$_flowpr" in "$_plugbase"* ) : ;; * ) _flowpr="" ;; esac
    else
      _flowpr=""   # engine root has no /plugins/ segment -> no containment base -> refuse
    fi
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
    # FIX B (P0, hardened) — canonicalize + re-verify containment, and FAIL CLOSED when
    # realpath cannot canonicalize either path. S1 above is a STRING prefix check on the
    # uncanonicalized path; a directory junction/symlink in an INTERMEDIATE component of
    # $_flowpr (e.g. a "flows" junction) can physically escape the /plugins/ tree while
    # the string still starts with $_plugbase, and the leaf `[ ! -L ]` checks above only
    # reject a symlinked FLOW.md itself, not an escaping ancestor directory. realpath
    # resolves through any such reparse point; re-checking the CANONICAL resolved path
    # against the CANONICAL plugbase closes that gap. If EITHER cannot be canonicalized
    # (realpath absent, or it errors) we REFUSE (empty _resolved) rather than keep the
    # S1-only result: the string prefix alone is exactly what a mid-path junction defeats
    # (the reason FIX B exists), so failing open there re-opens a REPRODUCED escape.
    # Overlay is the only untrusted-root branch, so refusing costs only that overlays
    # won't resolve without realpath (the user re-activates) — never a silent out-of-tree
    # read into authoritative context. (Symmetric refusal also avoids the canonical-vs-raw
    # form mismatch that a raw-plugbase fallback would cause on partial realpath failure.)
    if [ -n "$_resolved" ]; then
      _rp="$(realpath "$_resolved" 2>/dev/null || true)"
      _pb="$(realpath "${_plugbase:-}" 2>/dev/null || true)"
      if [ -n "$_rp" ] && [ -n "$_pb" ]; then
        case "$_rp" in "$_pb"/* | "$_pb" ) : ;; * ) _resolved="" ;; esac
      else
        _resolved=""
      fi
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
