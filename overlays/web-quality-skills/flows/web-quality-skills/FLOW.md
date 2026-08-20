# FLOW.md: addyosmani/web-quality-skills

> Routes all 6 skills from `addyosmani/web-quality-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is a screen reader user or keyboard-only user about to hit a barrier this change introduces?  → invoke web-quality-skills:accessibility   gate: a WCAG 2.2 criterion that previously failed now passes
  ├─ is new or changed code about to ship without a check for known security or compatibility pitfalls?  → invoke web-quality-skills:best-practices   gate: a list of flagged issues, each with a fix, exists before the change ships
  ├─ does a page change risk a slower largest paint, a sluggish response to input, or a visible layout jump?  → invoke web-quality-skills:core-web-vitals   gate: the LCP, INP, or CLS number improves in a lighthouse or field measurement
  ├─ is a page about to ship slower than it loaded before the change?  → invoke web-quality-skills:performance   gate: the measured load time is equal to or faster than the prior baseline
  ├─ is a page missing the meta tags, structured data, or sitemap entry it needs to be found in search results?  → invoke web-quality-skills:seo   gate: the page now has correct meta tags or structured data a crawler can read
  ├─ has the user asked for a full site health check rather than one narrow fix?  → invoke web-quality-skills:web-quality-audit   gate: a single report covers speed, WCAG compliance, search visibility, and code quality together
```

**Drift:** every route above targets `web-quality-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **web-quality-skills** (https://github.com/addyosmani/web-quality-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
