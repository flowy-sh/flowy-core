---
name: deactivate
description: Deactivate the Flowy test-automation-skills-agents overlay for this session (clears its routing obligation).
---

# Deactivate the test-automation-skills-agents overlay

Invoke `flowy-core:_activator` with the argument:  `deactivate test-automation-skills-agents`

This forwards to the engine's DEACTIVATE path, which removes the `test-automation-skills-agents` entry from
every state file under the out-of-repo state dir (both `state-PENDING.json` and any claimed
`state-<session_id>.json`), so the overlay cannot silently re-activate on a later turn.

If `flowy-core:_activator` cannot be invoked (the flowy-core engine plugin is not installed),
the overlay was never active — print `No Flowy engine installed; nothing to deactivate.` and stop.
