# FLOW.md: jananthan30/resume-builder

> Routes all 9 skills from `jananthan30/Resume-Builder` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ multiple job description files are waiting to be processed together instead of one at a time?  → invoke resume-builder:batch-resume   gate: one application package per job description file exists, each with its own pass or fail fit result
  ├─ the user only wants a one page application letter for a job description, with no resume requested?  → invoke resume-builder:cover-letter   gate: a single one page DOCX letter file exists and no resume file was produced
  ├─ the user wants to discover open roles that match their background instead of reacting to one posting they already have?  → invoke resume-builder:find-jobs   gate: a ranked list of live postings with fit scores exists
  ├─ the user wants a go or no go verdict on one specific posting before any drafting begins?  → invoke resume-builder:job-fit   gate: a go or no go verdict is recorded and no draft file has been created yet
  ├─ drafting is about to be handed off to separated researcher, writer, auditor and editor roles rather than written directly?  → invoke resume-builder:resume-team   gate: a verified Markdown draft exists carrying a provenance note from each role
  ├─ the user pasted one job description and wants the full application package, both documents, in one pass?  → invoke resume-builder:resume   gate: two DOCX files and an updated tracker row exist from a single request
  ├─ dependencies or the config file are missing, or this is the first run right after installing?  → invoke resume-builder:setup   gate: the config file exists and required packages import without error
  ├─ the user wants a single document adapted to one posting, explicitly without an accompanying letter?  → invoke resume-builder:tailor-resume   gate: one adapted document exists as a DOCX and the tracker row is updated, with no letter file produced
  ├─ an existing draft reads as robotic or generic AI-sounding prose that needs a human voice pass?  → invoke resume-builder:writing-coach   gate: the revised draft has fewer flagged AI-sounding phrases than the version it replaced
```

**Drift:** every route above targets `resume-builder:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **resume-builder** (https://github.com/jananthan30/Resume-Builder). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
