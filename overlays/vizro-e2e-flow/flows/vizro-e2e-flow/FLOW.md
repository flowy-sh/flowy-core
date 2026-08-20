# FLOW.md: mckinsey/vizro

> Routes all 6 skills from `mckinsey/vizro` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is a design spec ready and does the user want a working dashboard built now?  → invoke vizro-e2e-flow:dashboard-build   gate: a running dashboard app exists against real data
  ├─ does the user want to plan or design a dashboard before writing any code?  → invoke vizro-e2e-flow:dashboard-design   gate: a written requirements, layout, and visualization plan exists
  ├─ is the agent defining a dashboard grid, page structure, or control placement?  → invoke vizro-e2e-flow:designing-vizro-layouts   gate: a grid or layout configuration decision is recorded
  ├─ does the user need to pick a chart type, color scheme, KPI card, or table for their data?  → invoke vizro-e2e-flow:selecting-vizro-charts   gate: a specific chart or table type is chosen and configured
  ├─ should clicking a chart or table trigger a filter, highlight, drill-through, or export?  → invoke vizro-e2e-flow:wiring-vizro-actions   gate: an interaction is wired between two dashboard elements
  ├─ is the agent writing or debugging a dashboard configuration file?  → invoke vizro-e2e-flow:writing-vizro-yaml   gate: the configuration file parses and runs without errors
```

**Drift:** every route above targets `vizro-e2e-flow:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **vizro-e2e-flow** (https://github.com/mckinsey/vizro). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
