---
name: status
description: Report whether the Flowy compound-engineering overlay is active and whether the enforcement hook is live this session.
---

# Status of the compound-engineering overlay

Invoke `flowy-core:_activator` with the argument:  `status`

This forwards to the engine's STATUS path, which reports (a) what the state file says is active
and (b) whether the enforcement hook has claimed this session (enforcement LIVE vs not-yet-confirmed)
— the two signals a user cannot otherwise tell apart.

If `flowy-core:_activator` cannot be invoked (the flowy-core engine plugin is not installed),
print `No Flowy engine installed; routing is not active.` and stop.
