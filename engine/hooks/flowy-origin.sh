#!/usr/bin/env sh
# =============================================================================
# flowy-origin.sh — is this engine running from the canonical repo, or a fork?
#
# Sourced (never executed). Defines flowy_marketplace_name, flowy_origin_slug,
# flowy_origin_slug_for, flowy_is_canonical_origin.
#
# WHY IT EXISTS
# ATTRIBUTION.md states what reuse obliges. This is how a good-faith forker
# finds out, in the place they are working, instead of in a file they never
# open. CC BY-SA 4.0 WANTS forks; the obligation is credit and share-alike, and
# the cheapest way to get compliance is to hand someone the exact line to paste.
#
# IT DOES NOT STOP A BAD ACTOR. Anyone forking to strip attribution deletes this
# hook first. It exists to make compliance effortless for people who would
# comply anyway. That is the whole claim; see docs/decisions/.
#
# THREE NON-NEGOTIABLES
#   1. NO NETWORK. Detection is a local read of the marketplace clone's
#      .git/config. Never a request to a remote host. An enforcement hook that
#      reported installs back to its author would be telemetry, and shipping
#      that in an open-source plugin is a trust loss we do not get back. A test
#      asserts no network-capable command appears in this file.
#   2. FAIL OPEN. Unknown layout, absent config, no remote, not a clone at all:
#      output NOTHING. A false fork accusation is worse than silence, and the
#      hook's contract is fail-loud, never fail-closed.
#   3. AN UNKNOWN ORIGIN IS TREATED AS CANONICAL. Silence is the default.
#
# LAYOUT NOTE. The plugin CACHE (plugins/cache/<marketplace>/<plugin>/<version>)
# is NOT a git clone. The MARKETPLACE dir (plugins/marketplaces/<marketplace>)
# is, and carries remote.origin.url. Verified 2026-07-28. Both are derived from
# the same /.claude home flowy-paths.sh already computes.
#
# We parse .git/config directly rather than shelling out, so this works with no
# git binary on PATH and spawns no subprocess.
#
# POSIX sh (Git Bash on Windows); every expansion quoted.
#
# SPDX-License-Identifier: Apache-2.0
# =============================================================================

FLOWY_CANONICAL_ORIGIN="flowy-sh/flowy-core"

# --- Marketplace name from a plugin root -------------------------------------
# $1 = CLAUDE_PLUGIN_ROOT (.../plugins/cache/<marketplace>/<plugin>/<version>).
# Echoes <marketplace>, or nothing(+1) when the path is not that shape.
flowy_marketplace_name() {
  _p="$1"
  [ -n "$_p" ] || return 1

  # Backslash -> slash first: the engine has already been bitten once by two
  # path forms producing two different keys (see flowy-paths.sh, Bug E).
  _p="$(printf '%s' "$_p" | tr '\\' '/')"

  case "$_p" in
    */plugins/cache/*) : ;;
    *) return 1 ;;
  esac

  _rest="${_p#*/plugins/cache/}"
  _name="${_rest%%/*}"
  [ -n "$_name" ] || return 1
  printf '%s' "$_name"
}

# --- Remote URL -> owner/repo slug -------------------------------------------
# $1 = a git remote URL in any common form. Echoes lowercase "owner/repo",
# or nothing(+1) when it cannot be read as one.
flowy_origin_slug() {
  _u="$1"
  [ -n "$_u" ] || return 1
  # A value with whitespace is not a remote URL.
  case "$_u" in *" "* | *"	"*) return 1 ;; esac

  # scheme://   then   user@   then   scp-style host:path
  _u="$(printf '%s' "$_u" | sed 's#^[A-Za-z][A-Za-z0-9+.-]*://##')"
  _u="$(printf '%s' "$_u" | sed 's#^[^/]*@##')"
  _u="$(printf '%s' "$_u" | tr ':' '/')"
  _u="$(printf '%s' "$_u" | sed -e 's#//*#/#g' -e 's#\.git$##' -e 's#/$##')"

  case "$_u" in */*) : ;; *) return 1 ;; esac

  _repo="${_u##*/}"
  _rest="${_u%/*}"
  _owner="${_rest##*/}"
  [ -n "$_repo" ] && [ -n "$_owner" ] || return 1

  # POSITIVE CHARSET ALLOWLIST, matching the SAFE_NAME strip in flowy-inject.sh.
  # This value is printed into the agent's AUTHORITATIVE context, from a file
  # (.git/config) a cloned or vendored install fully controls, so anything
  # outside GitHub's own legal charset is REFUSED rather than sanitized: a
  # refused slug is empty, and flowy_is_canonical_origin answers "yes" to empty,
  # which means silence. Silence is already the documented outcome for an origin
  # we cannot read, so refusing costs nothing and accuses nobody.
  #
  # A DENYLIST WAS THE BUG. The `case "$_u" in *" "*` guard above covers two
  # codepoints; U+00A0 walked straight through it, as did `$(...)` and backticks.
  # The length caps are GitHub's own (39 for an owner, 100 for a repo) and are
  # what stops a long path component being used to flood the banner.
  case "$_owner$_repo" in *[!A-Za-z0-9._-]* ) return 1 ;; esac
  [ "${#_owner}" -le 39 ] && [ "${#_repo}" -le 100 ] || return 1

  # Lowercase: GitHub owners and repos are case-insensitive, so Flowy-SH must
  # not read as a fork of flowy-sh.
  printf '%s/%s' "$_owner" "$_repo" | tr 'A-Z' 'a-z'
}

# --- Origin slug for an installed marketplace --------------------------------
# $1 = claude home (ending /.claude)   $2 = marketplace name.
# Echoes the lowercase slug, or nothing(+1) on ANY unreadable condition.
flowy_origin_slug_for() {
  _home="$1"
  _mp="$2"
  [ -n "$_home" ] && [ -n "$_mp" ] || return 1

  _cfg="$_home/plugins/marketplaces/$_mp/.git/config"
  [ -f "$_cfg" ] || return 1

  # The [remote "origin"] section specifically. Taking the first url in the file
  # would let a forker who adds an `upstream` remote read as canonical.
  _url="$(awk '
    /^[[:space:]]*\[/ { in_origin = ($0 ~ /\[remote "origin"\]/) ? 1 : 0; next }
    in_origin && /^[[:space:]]*url[[:space:]]*=/ {
      sub(/^[[:space:]]*url[[:space:]]*=[[:space:]]*/, "")
      print
      exit
    }
  ' "$_cfg" 2>/dev/null)"

  [ -n "$_url" ] || return 1
  flowy_origin_slug "$_url"
}

# --- Canonical? --------------------------------------------------------------
# $1 = slug. Echoes "yes" or "no". An EMPTY slug echoes "yes": an origin we
# could not determine must never produce an accusation.
flowy_is_canonical_origin() {
  _s="$1"
  if [ -z "$_s" ] || [ "$_s" = "$FLOWY_CANONICAL_ORIGIN" ]; then
    printf 'yes'
  else
    printf 'no'
  fi
}
