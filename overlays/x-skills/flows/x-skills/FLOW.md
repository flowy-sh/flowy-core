# FLOW.md: sergebulaev/x-skills

> Routes all 9 skills from `sergebulaev/x-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does the user want to understand what is actually working for an account or a niche by pulling real engagement numbers and reply data rather than guessing?  → invoke x-skills:x-audience-insights   gate: a set of real posts with their like, reply, and view counts is pulled and compared to spot which formats and hooks perform
  ├─ does the user need a full week laid out day by day, with a format and posting time chosen for each day, rather than a single piece written right now?  → invoke x-skills:x-content-planner   gate: a seven day calendar exists naming a format and a time slot for each day
  ├─ has the user pasted a link to a viral post from another account and want to know which opening formula and structure made it work?  → invoke x-skills:x-hook-extractor   gate: the post is matched to one of the ten named formulas with the specific structural beats pointed out
  ├─ does a drafted post or thread read like it came from an ai, with predictable rhythm or telltale vocabulary, and need those tells scrubbed before it goes out?  → invoke x-skills:x-humanizer   gate: the flagged vocabulary and uniform sentence rhythm are gone and the draft passes a final tell check
  ├─ does a single, ready to publish post or a short thread need drafting from scratch around a specific engagement goal, right now?  → invoke x-skills:x-post-writer   gate: a draft exists within the character limit with an opening line chosen for the stated goal
  ├─ does the account page itself, meaning the bio, display name, header image, or pinned post, need auditing and rewriting rather than a piece of content?  → invoke x-skills:x-profile-optimizer   gate: a rewritten bio, display name, and pinned post recommendation exist for that one account
  ├─ does the user have the url of one specific post and want a direct response or an added value quote written for that exact post, rather than a whole new original piece?  → invoke x-skills:x-reply-drafter   gate: one to three response variants exist, each addressed to that specific post
  ├─ does content that already exists somewhere else, such as a post from a different platform, a blog, or a video script, need converting into a native post or thread here rather than written from a blank page?  → invoke x-skills:x-repurposer   gate: the source material is adapted into a native format with off platform artifacts stripped out
  ├─ does the user want a full long form, multi post sequence built out beat by beat with an opening promise and a payoff at the end, rather than one single post?  → invoke x-skills:x-thread-builder   gate: a numbered sequence of posts exists with the first framed as a promise and each later one advancing one beat
```

**Drift:** every route above targets `x-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **x-skills** (https://github.com/sergebulaev/x-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
