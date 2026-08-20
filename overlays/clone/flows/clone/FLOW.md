# FLOW.md: harkro753/claude-copy

> Routes all 9 skills from `HarKro753/claude-copy` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to build a browser extension with manifest-based permissions?  → invoke clone:chrome-development   gate: the manifest declares only the permissions the extension actually uses
  ├─ holding a full-site capture and asked to reproduce it as static pages?  → invoke clone:html   gate: each rendered page is pixel-diffed against its captured reference and passes
  ├─ handed a single picture with no source markup and asked to rebuild it?  → invoke clone:image   gate: a rendered screenshot of the rebuild matches the source picture side by side
  ├─ asked to turn a site capture into reusable framework components rather than flat pages?  → invoke clone:react   gate: each component renders every captured state gated against its own reference shot
  ├─ about to write or rework persuasive page text rather than markup or layout?  → invoke clone:copywriting   gate: the page text reads as a finished draft a marketer would ship
  ├─ choosing spacing, sizing or type-weight numbers for a compact interface?  → invoke clone:dense-ui-metrics   gate: the chosen values map to a named density regime rather than a guess
  ├─ about to package a skill or agent into an installable, distributable bundle?  → invoke clone:plugin-creator   gate: the manifest validates and the bundle installs cleanly in a fresh environment
  ├─ about to add, style or debug a component from a shared UI kit?  → invoke clone:shadcn   gate: the component is added or fixed and renders without console errors
  ├─ about to write, edit or benchmark a skill definition itself?  → invoke clone:skill-creator   gate: an eval run produces a before-and-after performance comparison
```

**Drift:** every route above targets `clone:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **clone** (https://github.com/HarKro753/claude-copy). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
