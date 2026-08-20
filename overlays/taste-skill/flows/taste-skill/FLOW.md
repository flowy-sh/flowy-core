# FLOW.md: leonxlnx/taste-skill

> Routes all 13 skills from `Leonxlnx/taste-skill` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to generate a brand-guidelines board, logo system, or identity deck as images?  → invoke taste-skill:brandkit   gate: a set of guideline-board and identity-deck images in the chosen visual style exists
  ├─ about to design a dashboard or portfolio in a raw, mechanical, terminal-like aesthetic?  → invoke taste-skill:brutalist-skill   gate: a rigid-grid layout with high type-scale contrast and utilitarian color exists
  ├─ about to build a heavily animated page with strict scroll-triggered motion and bento-grid structure?  → invoke taste-skill:gpt-tasteskill   gate: a page with GSAP ScrollTrigger sequencing and a gapless bento grid exists
  ├─ about to implement a website in code to match a generated design image as closely as possible?  → invoke taste-skill:image-to-code-skill   gate: implemented code that visually matches the generated design image exists
  ├─ about to generate premium mobile app screen concepts for iOS or Android as images?  → invoke taste-skill:imagegen-frontend-mobile   gate: a set of mobile app screen concept images with consistent hierarchy exists
  ├─ about to generate premium website design reference images rather than mobile screens?  → invoke taste-skill:imagegen-frontend-web   gate: one separate horizontal reference image per landing-page section exists
  ├─ about to design an interface in a clean, monochrome, editorial style with no gradients?  → invoke taste-skill:minimalist-skill   gate: a flat bento layout in a muted monochrome palette with no gradients or heavy shadows exists
  ├─ about to generate a long code file or exhaustive output that risks truncation or placeholder text?  → invoke taste-skill:output-skill   gate: a complete output with no placeholder or truncated section exists
  ├─ about to upgrade an existing live site or app without breaking its current functionality?  → invoke taste-skill:redesign-skill   gate: an audit of the current design with identified generic patterns and a fix list exists
  ├─ about to choose the fonts, spacing, shadows, or card structure that decide whether a design feels expensive or cheap?  → invoke taste-skill:soft-skill   gate: a defined set of fonts, spacing, and shadow tokens replacing the common cheap defaults exists
  ├─ about to produce a DESIGN.md specification for a Google Stitch design system rather than a live page?  → invoke taste-skill:stitch-skill   gate: an agent-friendly DESIGN.md file with typography and color rules exists
  ├─ about to work on a project that requires the original v1 design behavior for backward compatibility?  → invoke taste-skill:taste-skill-v1   gate: an explicit v1 install name pinned by the project for backward compatibility exists
  ├─ about to build or redesign a landing page, portfolio, or general frontend from a brief?  → invoke taste-skill:taste-skill   gate: an interface shipped after reading the brief and running the pre-flight check exists
```

**Drift:** every route above targets `taste-skill:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **taste-skill** (https://github.com/Leonxlnx/taste-skill). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
