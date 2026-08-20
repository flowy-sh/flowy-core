# FLOW.md: shzhao27208/aut_sci_write

> Routes all 9 skills from `ShZhao27208/Aut_Sci_Write` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does the user have a DOI, an arxiv id, or a citation and need the actual pdf file fetched from whichever publisher or repository actually hosts it?  → invoke academic-skills:sci-download   gate: a pdf file is saved locally, sourced from the publisher or repository matching the doi prefix
  ├─ has the user handed over a paper, whether a pdf, a link, or a doi, wanting its findings, method, diagrams, and a critical read pulled out in one pass?  → invoke academic-skills:sci-extract   gate: a structured summary with findings, method notes, and a critique section exists for that specific paper
  ├─ does a specific diagram or chart panel, including a labeled sub panel, need to be pulled out of a paper as its own image file?  → invoke academic-skills:sci-figure   gate: a standalone image file exists per diagram or sub panel, matching the numbering used in the source paper
  ├─ does the deliverable need to be a clickable, browser based slide deck or report rather than a static document?  → invoke academic-skills:sci-html   gate: a browser opens the deck and slides or sections are clickable rather than a flat scrolling page
  ├─ does an already drafted paper need its ai sounding traces reduced, or a structured pass over grammar, tone, coherence, and journal compliance, rather than new content written from scratch?  → invoke academic-skills:sci-polish   gate: a revised draft exists with the same claims but changed wording, scored lower on an ai detection check
  ├─ does the user need a slide deck file for a defense, seminar, or application built from a paper or outline, including its diagrams and formulas?  → invoke academic-skills:sci-ppt   gate: a slide deck file is produced with diagrams placed and formulas rendered, ready to open in a presentation program
  ├─ is the task drafting a survey of prior work with an identified research gap, or building a point by point rebuttal letter that responds to feedback from a journal referee?  → invoke academic-skills:sci-review   gate: an outline of prior work with a stated gap exists, or a rebuttal letter addressing each referee comment point by point exists
  ├─ does the user need to find papers on a topic across multiple academic databases at once, along with journal impact data, rather than fetch one paper already identified?  → invoke academic-skills:sci-search   gate: a results list spanning more than one academic database comes back with an impact factor value attached per venue
  ├─ does a citation need to be added to an existing reference manager library, or a pdf synced into it, rather than just cited inline in the draft?  → invoke academic-skills:sci-zotero   gate: the reference manager library shows the new entry or file after the sync completes
```

**Drift:** every route above targets `academic-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **academic-skills** (https://github.com/ShZhao27208/Aut_Sci_Write). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
