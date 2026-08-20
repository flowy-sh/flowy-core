# FLOW.md: timescale/pg-aiguide

> Routes all 10 skills from `timescale/pg-aiguide` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to lay out tables that store geographic or location coordinates?  → invoke pg:design-postgis-tables   gate: a schema with a geometry column and a spatial index defined
  ├─ about to create a new table or reshape an existing schema?  → invoke pg:design-postgres-tables   gate: a table definition with explicit types, constraints and indexes
  ├─ about to audit an existing schema for tables that grow by time or event?  → invoke pg:find-hypertable-candidates   gate: a ranked list of candidate tables with their growth pattern noted
  ├─ about to need a disposable database instance for a quick test or handoff?  → invoke pg:ghost-database   gate: a fresh, isolated instance is running and reachable by connection string
  ├─ about to convert an identified table into a time-partitioned form?  → invoke pg:migrate-postgres-tables-to-hypertables   gate: the converted table passes a row-count and sample-data validation check
  ├─ about to store or query embeddings for similarity search?  → invoke pg:pgvector-semantic-search   gate: a vector column and similarity index return nearest neighbours on a test query
  ├─ about to change a schema that a live application already depends on?  → invoke pg:postgres-database-migration   gate: the change ran clean against a forked copy before touching the live schema
  ├─ about to combine keyword matching with meaning-based ranking in one search?  → invoke pg:postgres-hybrid-text-search   gate: a single query returns results merged by reciprocal rank fusion
  ├─ unsure which specific database task this is and need the general starting point?  → invoke pg:postgres   gate: the broad database question is narrowed to one concrete task
  ├─ about to create a table that will receive a constant stream of timestamped inserts?  → invoke pg:setup-timescaledb-hypertables   gate: the new table is partitioned by time and insert throughput is measured before and after
```

**Drift:** every route above targets `pg:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **pg** (https://github.com/timescale/pg-aiguide). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
