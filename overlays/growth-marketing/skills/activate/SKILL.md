---
name: activate
description: Activate the Flowy growth-marketing overlay for this session (auto-invokes the right marketing-skills skill per funnel intent).
---

# Activate the growth-marketing overlay

Compute this plugin's root: the "Base directory for this skill" with the trailing
`skills/activate` removed. That path is the OVERLAY plugin root.

Invoke `flowy-core:_activator` with the argument:  `overlay growth-marketing <overlay-plugin-root>`
(substitute the computed overlay-plugin-root).

If `flowy-core:_activator` cannot be invoked (the flowy-core engine plugin is not
installed), print exactly:
> This overlay needs the Flowy engine. Install it:
> /plugin marketplace add flowy-sh/flowy-core
> /plugin install flowy-core
and stop. (When Claude Code >= v2.1.110 honors `dependencies`, the engine
auto-installs and this branch never runs.)

This overlay ROUTES to the separately-installed `marketing-skills` plugin. If the
routing later fails to find a `marketing-skills:<skill>`, install it:
> /plugin marketplace add coreyhaines31/marketingskills
> /plugin install marketing-skills
