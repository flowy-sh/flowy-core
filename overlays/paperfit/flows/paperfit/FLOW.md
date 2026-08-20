# FLOW.md: openraiser/paperfit

> Routes all 8 skills from `OpenRaiser/PaperFit` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ a document has passed other layout fixes but still shows inconsistent formatting patterns across pages or sections?  → invoke paperfit:consistency-polisher   gate: a fix pass reports which formatting-consistency issues were found and corrected across the document
  ├─ figures or tables in a document are floating to the wrong page or clashing with surrounding text?  → invoke paperfit:float-optimizer   gate: a fix pass reports which floating-object placements were adjusted and where they now land
  ├─ content is spilling past a page or column boundary, or elements are misaligned against the page grid?  → invoke paperfit:overflow-repair   gate: a fix pass reports which overflow or alignment problems were corrected and where
  ├─ a page has awkward gaps or wasted whitespace instead of an even use of the available space?  → invoke paperfit:space-util-fixer   gate: a fix pass reports which awkward space gaps were corrected and how evenly the page now fills
  ├─ diagnosing a page visually and unsure which defect category a symptom belongs to or how severe it is?  → invoke paperfit:taxonomy-vto   gate: the symptom is matched to a named defect category with a severity level and, where one exists, a matching compile log signal
  ├─ a document is being carried from one formatting template into another and picking up new layout defects along the way?  → invoke paperfit:template-migrator   gate: a fix pass reports which cross-template defects were found and corrected after the move
  ├─ a fix has been applied and the result needs to be seen page by page rather than trusted from the source alone?  → invoke paperfit:visual-inspector   gate: the document is rendered into page-by-page high-resolution images with a checklist ready for visual acceptance
  ├─ every layout-level fix has been tried and a stray orphan line or page-count overage can only be solved by tweaking the wording itself?  → invoke paperfit:writing-polish   gate: the smallest possible wording edit resolves the layout problem while the original meaning, data, and conclusions stay unchanged
```

**Drift:** every route above targets `paperfit:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **paperfit** (https://github.com/OpenRaiser/PaperFit). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
