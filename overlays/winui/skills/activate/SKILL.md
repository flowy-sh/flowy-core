---
name: activate
description: Activate the Flowy winui overlay for this session (auto-invokes microsoft/win-dev-skills skills at the right gate).
---

# Activate the winui overlay

Compute this plugin's root: the "Base directory for this skill" with the trailing
`skills/activate` removed. That path is the OVERLAY plugin root.

Invoke `flowy-core:_activator` with the argument:  `overlay winui <overlay-plugin-root>`
(substitute the computed overlay-plugin-root).

If `flowy-core:_activator` cannot be invoked (the flowy-core engine plugin is not
installed), print exactly:
> This overlay needs the Flowy engine. Install it:
> /plugin marketplace add flowy-sh/flowy-core
> /plugin install flowy-core
and stop. (When Claude Code >= v2.1.110 honors `dependencies`, the engine
auto-installs and this branch never runs.)
