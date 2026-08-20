---
name: deactivate
description: Deactivate the Flowy vercel-plugin overlay for this session (clears its routing obligation).
---

# Deactivate the vercel-plugin overlay

Invoke `flowy-core:_activator` with the argument:  `deactivate vercel-plugin`

This forwards to the engine's DEACTIVATE path, which removes the `vercel-plugin` entry from
every state file under the out-of-repo state dir (both `state-PENDING.json` and any claimed
`state-<session_id>.json`), so the overlay cannot silently re-activate on a later turn.

If `flowy-core:_activator` cannot be invoked (the flowy-core engine plugin is not installed),
the overlay was never active — print `No Flowy engine installed; nothing to deactivate.` and stop.
