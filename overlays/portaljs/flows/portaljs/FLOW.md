# FLOW.md: datopian/portaljs

> Routes all 14 skills from `datopian/portaljs` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is a whole existing hub site being moved across, layers and all, rather than one dataset?  → invoke portaljs:arcgis-to-portaljs   gate: the inventory was harvested and every layer exported
  ├─ does a registered dataset need a visual series in its showcase?  → invoke portaljs:portaljs-add-chart   gate: the chart renders in the views section
  ├─ is there a new data file to register so the catalog renders it?  → invoke portaljs:portaljs-add-dataset   gate: the catalog entry exists and routes to its source
  ├─ does this portal need to be harvestable by a national or EU open-data catalog?  → invoke portaljs:portaljs-add-dcat   gate: the feeds emit at build and pass their profile check
  ├─ is the incoming file geospatial and not yet normalised into render and query tiers?  → invoke portaljs:portaljs-add-geo   gate: projection normalised and both tiers derived
  ├─ is a registered dataset geographic and currently shown without a map?  → invoke portaljs:portaljs-add-map   gate: the map renders for that dataset
  ├─ does a dataset that already exists need a second file alongside it?  → invoke portaljs:portaljs-add-resource   gate: the showcase renders a section per file
  ├─ is a new portal being started with its architecture not yet decided?  → invoke portaljs:portaljs-architect   gate: storage, catalog, access and hosting each chosen
  ├─ is a tabular file about to be published without anyone having checked its columns?  → invoke portaljs:portaljs-check-data-quality   gate: a read-only report on schema, nulls, types and duplicates
  ├─ should the catalog read from a live backend instead of from a static file?  → invoke portaljs:portaljs-connect-ckan   gate: search and showcase both served from the backend
  ├─ does a dataset render untyped, with no field table and no metadata profile?  → invoke portaljs:portaljs-define-schema   gate: a schema written into the catalog entry
  ├─ is the portal ready to be published, or republished, to a live URL?  → invoke portaljs:portaljs-deploy   gate: a live URL returned by the deploy
  ├─ are the datasets coming from another open-data platform rather than from local files?  → invoke portaljs:portaljs-migrate   gate: the source catalog was read and written to this one
  ├─ is there no portal here yet at all?  → invoke portaljs:portaljs-new-portal   gate: the template is scaffolded with its tokens substituted
```

**Drift:** every route above targets `portaljs:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **portaljs** (https://github.com/datopian/portaljs). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
