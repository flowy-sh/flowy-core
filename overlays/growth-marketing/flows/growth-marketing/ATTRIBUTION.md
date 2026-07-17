# Attribution

This overlay is a THIN routing layer. It bundles no skills; it routes to the
separately-installed `marketing-skills` Claude Code plugin.

- Skills author: **Corey Haines** — https://github.com/coreyhaines31/marketingskills, MIT.
- Install the upstream: `/plugin marketplace add coreyhaines31/marketingskills` then `/plugin install marketing-skills`.
- Invoked as `marketing-skills:<skill>` (plugin name `marketing-skills`, marketplace `marketingskills`, 47 skills).

## Core routed skills (the funnel spine)

- `marketing-skills:customer-research` — Phase 1 (Research)
- `marketing-skills:copywriting` — Phase 2 (Copy)
- `marketing-skills:seo-audit` — Phase 3 (Acquisition: SEO)
- `marketing-skills:cold-email` — Phase 4 (Acquisition: outbound)
- `marketing-skills:launch` — Phase 5 (Launch)
- `marketing-skills:cro` — Phase 6 (Optimize)
- `marketing-skills:ab-testing` — Phase 7 (Validate)

The remaining ~40 skills in the `marketing-skills` plugin (ads, social, emails,
pricing, product-marketing, analytics, and so on — see the FLOW.md index) are
available and fire as `marketing-skills:<name>` on their triggers.

The `FLOW.md` routing layer is original work by Flowy (CC-BY-SA-4.0); the skills
are unmodified and remain under their upstream MIT license. Listed for
attribution; the upstream author does not endorse Flowy.
