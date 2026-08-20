---
name: deactivate
description: Deactivate the Flowy comfyui-custom-nodes overlay for this session (clears its routing obligation).
---

# Deactivate the comfyui-custom-nodes overlay

Invoke `flowy-core:_activator` with the argument:  `deactivate comfyui-custom-nodes`

This forwards to the engine's DEACTIVATE path, which removes the `comfyui-custom-nodes` entry from
every state file under the out-of-repo state dir (both `state-PENDING.json` and any claimed
`state-<session_id>.json`), so the overlay cannot silently re-activate on a later turn.

If `flowy-core:_activator` cannot be invoked (the flowy-core engine plugin is not installed),
the overlay was never active — print `No Flowy engine installed; nothing to deactivate.` and stop.
