---
name: activate
description: Activate the Flowy vercel-plugin overlay for this session (auto-invokes vercel-labs/vercel-plugin skills at the right gate).
---

# Activate the vercel-plugin overlay

Compute this plugin's root: the "Base directory for this skill" with the trailing
`skills/activate` removed. That path is the OVERLAY plugin root.

Invoke `flowy-core:_activator` with the argument:  `overlay vercel-plugin <overlay-plugin-root>`
(substitute the computed overlay-plugin-root).

If `flowy-core:_activator` cannot be invoked (the flowy-core engine plugin is not
installed), print exactly:
> This overlay needs the Flowy engine. Install it:
> /plugin marketplace add flowy-sh/flowy-core
> /plugin install flowy-core
and stop. (When Claude Code >= v2.1.110 honors `dependencies`, the engine
auto-installs and this branch never runs.)
