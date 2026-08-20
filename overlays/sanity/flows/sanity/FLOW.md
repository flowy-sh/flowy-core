# FLOW.md: sanity-io/agent-toolkit

> Routes all 7 skills from `sanity-io/agent-toolkit` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ an experiment or A/B test needs to be designed on top of managed content, before any variant is built?  → invoke sanity:content-experimentation-best-practices   gate: a hypothesis, success metric, and required sample size are written down before a variant ships
  ├─ a content schema or type structure is being designed or reworked before any query or template is written against it?  → invoke sanity:content-modeling-best-practices   gate: the schema defines clear types, references, and reuse boundaries that the team agrees on before content is entered
  ├─ external HTML or Markdown content needs to become structured rich text blocks for storage, as an import or ingestion step?  → invoke sanity:portable-text-conversion   gate: the source document produces valid structured rich text blocks that pass validation
  ├─ stored structured rich text blocks need to be rendered or turned into an output format such as a page, a string, or a feed, as a display or export step?  → invoke sanity:portable-text-serialization   gate: the stored blocks render correctly in the target framework or output format
  ├─ a general development decision on the platform, such as a query, a studio customization, or a framework integration, needs guidance and no more specific skill covers it?  → invoke sanity:sanity-best-practices   gate: the implementation follows documented platform conventions rather than an improvised pattern
  ├─ an entire site or dataset is moving onto this platform from a different CMS or export format, as a replatforming project?  → invoke sanity:sanity-migration   gate: content from the source system is mapped field by field and a written plan or script exists for moving it across
  ├─ a page needs metadata, structured data, or crawlability improvements so it ranks or gets cited by search and AI answer surfaces?  → invoke sanity:seo-aeo-best-practices   gate: the page emits valid structured data and required metadata tags that a validator accepts
```

**Drift:** every route above targets `sanity:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **sanity** (https://github.com/sanity-io/agent-toolkit). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
