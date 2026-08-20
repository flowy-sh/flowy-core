# FLOW.md: jtydhr88/comfyui-custom-node-skills

> Routes all 9 skills from `jtydhr88/comfyui-custom-node-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is a node being built that needs to dynamically match types, grow its own sockets, or accept a wildcard connection whose type is not known ahead of time?  → invoke comfyui-custom-nodes:comfyui-node-advanced   gate: a node instance changes its own socket count or type at graph build time based on what is connected
  ├─ is this the very first node class being written from scratch, needing the current schema shaped structure and registration to exist at all?  → invoke comfyui-custom-nodes:comfyui-node-basics   gate: a new node class is defined against the current schema and shows up registered in the node list
  ├─ does the work require picking or defining the right tensor or model kind, such as an image, latent, mask, or a brand new custom kind, for a socket to carry?  → invoke comfyui-custom-nodes:comfyui-node-datatypes   gate: a socket is declared with a specific, correct kind rather than a generic placeholder
  ├─ does the feature live in the browser interface itself, such as a custom widget, a sidebar tab, a toast, or a settings entry, rather than in the execution graph?  → invoke comfyui-custom-nodes:comfyui-node-frontend   gate: a javascript extension file registers a UI element that renders in the interface
  ├─ does a socket need a specific widget behavior, such as being hidden, optional, evaluated lazily, or forced to stay a socket instead of a widget?  → invoke comfyui-custom-nodes:comfyui-node-inputs   gate: the socket declaration carries the specific widget or laziness flag and the graph respects it at run time
  ├─ is a node re-running when it should be cached, skipping a check it should run, or executing in an order that does not match what the graph implies?  → invoke comfyui-custom-nodes:comfyui-node-lifecycle   gate: a change fingerprint or a validation hook now controls whether the node re-executes
  ├─ does an existing node still use the old, legacy api shape and need converting to the current one?  → invoke comfyui-custom-nodes:comfyui-node-migration   gate: the node now compiles and runs against the current api with no legacy shape remaining
  ├─ does a finished result need to be returned from a node, previewed inline in the graph, or saved to disk?  → invoke comfyui-custom-nodes:comfyui-node-outputs   gate: a preview or a saved file appears in the interface after the node runs
  ├─ is a whole project directory being laid out, or is a finished set of nodes being prepared for publishing to the registry?  → invoke comfyui-custom-nodes:comfyui-node-packaging   gate: the project folder has the expected init file, requirements list, and registry manifest and installs cleanly
```

**Drift:** every route above targets `comfyui-custom-nodes:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **comfyui-custom-nodes** (https://github.com/jtydhr88/comfyui-custom-node-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
