# flowy-core

The shared **Flowy enforcement engine** (a Claude Code plugin) plus its per-plugin
**overlays**. One engine hook injects a mandatory routing banner every prompt; each overlay
is a thin plugin that supplies only a `FLOW.md` (a routing tree) and declares a dependency on
this engine, so installing an overlay auto-installs the engine.

- `engine/` — the plugin (`flowy-core`): the `UserPromptSubmit` hook, the compaction re-read
  hook, the `_activator` skill, the shared resolver, and the `bun` test harness.
- `overlays/superpowers/`, `overlays/ultra-powers/` — thin overlay plugins
  (`flowy-superpowers`, `flowy-ultra-powers`). Their skills forward to `flowy-core:_activator`.

Install (until Claude Code honors `dependencies` auto-install, add the engine first):

```
/plugin marketplace add flowy-sh/flowy-core
/plugin install flowy-core
/plugin install flowy-ultra-powers   # or flowy-superpowers
```

Run the tests: `cd engine && bun test` (requires Git Bash on Windows — the hooks are POSIX sh).

## The on-disk state contract — `flowy-state-v2`

The `_activator` (via `hooks/flowy-activate.sh`) WRITES a per-session state file to an
out-of-repo dir (`<claude-home>/flowy-state/<project-key>/state-*.json`); the hooks READ it.
**Three independently-versioned Flowy engines can be installed at once and share this one file**
(they all anchor the state root at the `/plugins/` boundary), so the wire format is a contract
across repos with no shared package. If you maintain a sibling engine, match this shape:

```json
{
  "schema": "flowy-state-v2",
  "sessionId": "PENDING",
  "createdAtEpoch": 1749800000,
  "activeFlows": [
    { "name": "superpowers-flow", "flowRef": "flows/superpowers-flow/FLOW.md", "location": "plugin",  "pluginRoot": "" },
    { "name": "some-overlay",     "flowRef": "flows/some-overlay/FLOW.md",     "location": "overlay", "pluginRoot": "<overlay-plugin-root>" }
  ]
}
```

- **Line-oriented:** each `"name"`, `"flowRef"`, `"location"`, `"pluginRoot"` on its own line
  (no jq — the hooks parse with grep/sed). The four fields are zipped POSITIONALLY by line
  index, so **every entry must carry all four** (`pluginRoot` empty `""` for plugin/project).
- **`location`:** `plugin` (resolve `flowRef` under the engine root), `project` (under
  `$CLAUDE_PROJECT_DIR/.flowy/flows/<name>/FLOW.md`), or `overlay` (under the entry's own
  `pluginRoot`, a sibling plugin under the same `/plugins/` tree).
- **`schema`:** readers gate on a known-schema allowlist; an unknown value is a no-op (so a
  future breaking shape degrades safely instead of being mis-parsed by an old reader).

## Security invariants (do not regress — each has a test)

These were hardened in 0.2.0 after an execute-the-code review found reproduced exploits. See
`engine/tests/`.

- **Overlay containment fails CLOSED.** `flowy_resolve_flowmd` re-verifies an overlay's
  resolved FLOW.md is inside the `/plugins/` tree by canonicalizing with `realpath`. If
  `realpath` cannot canonicalize either path, the overlay is **refused** — a mid-path junction
  otherwise escapes the string-prefix check (reproduced). The overlay is the only
  untrusted-root branch, so refusing costs only re-activation without `realpath`.
- **Positional-zip parity.** `flowy_parity_ok` counts the VALUE lines the zip consumes (not
  key tokens) across all four fields; a non-string value (`"pluginRoot": null`) or a dropped
  key that shifts the zip refuses the whole state. Applied by BOTH readers (inject + recompact).
- **Ownership gate.** The hook warns only about a flow this engine owns (a project flow; an
  overlay entry with a non-empty `pluginRoot`; a plugin flow with a matching `flows/<name>/`
  dir). A flow another installed engine owns is left silent — otherwise it spams a
  contradictory "unreadable / run /flowy deactivate" into the enforcement channel.
- **Charset allowlist on `pluginRoot`** at both the write site and the resolver
  (`flowy_charset_ok_pluginroot`) blocks a value breaking out of the hand-rolled JSON.

## Migrating from a standalone Flowy engine (coexistence hazard)

If a pre-overlay Flowy engine is installed ALONGSIDE flowy-core + an overlay, both hooks fire
every prompt and read the shared state file. The old engine cannot resolve a `location:overlay`
entry, so it degrades to a benign "unreadable" warning — **except** when its own bundled flow
name collides with the overlay's flow name (e.g. a standalone `ultra-powers` plugin that bundles
`flows/ultra-powers/FLOW.md`, and the `flowy-ultra-powers` overlay whose flow is also named
`ultra-powers`). Then the old engine wrong-fires ITS stale FLOW.md as authoritative routing.

**Before relying on an overlay, retire (`/plugin uninstall`) any pre-overlay Flowy engine that
bundles a same-named flow.** The overlay + the shared engine then own routing cleanly.
