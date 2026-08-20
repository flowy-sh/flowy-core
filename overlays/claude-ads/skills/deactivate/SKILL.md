---
name: deactivate
description: Deactivate the Flowy claude-ads overlay for this session (clears its routing obligation).
---

# Deactivate the claude-ads overlay

Invoke `flowy-core:_activator` with the argument:  `deactivate claude-ads`

This forwards to the engine's DEACTIVATE path, which removes the `claude-ads` entry from
every state file under the out-of-repo state dir (both `state-PENDING.json` and any claimed
`state-<session_id>.json`), so the overlay cannot silently re-activate on a later turn.

If `flowy-core:_activator` cannot be invoked (the flowy-core engine plugin is not installed),
the overlay was never active — print `No Flowy engine installed; nothing to deactivate.` and stop.
