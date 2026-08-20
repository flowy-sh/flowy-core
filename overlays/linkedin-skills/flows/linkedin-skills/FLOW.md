# FLOW.md: sergebulaev/linkedin-skills

> Routes all 11 skills from `sergebulaev/linkedin-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ did the user share a link to a post that belongs to someone else and ask for a comment or a repost of it, rather than a fresh post of their own?  → invoke linkedin-skills:linkedin-comment-drafter   gate: a small set of comment or repost variants tied to that specific post is returned
  ├─ does the user want a multi-day publishing calendar rather than one piece of copy?  → invoke linkedin-skills:linkedin-content-planner   gate: a day by day schedule naming format, hook type, and posting time for each entry is produced
  ├─ is the ask about getting a whole team of people posting on their own profiles, rather than managing the account of a single person?  → invoke linkedin-skills:linkedin-employee-advocacy   gate: a team-level launch plan with governance rules and a time budget per contributor is produced
  ├─ does the user want to know who interacted with a specific post and how promising each of them is?  → invoke linkedin-skills:linkedin-engager-analytics   gate: a list of the people who engaged, grouped by fit tier, is returned
  ├─ did the user point at a high performing post from someone else and ask why its opening line worked?  → invoke linkedin-skills:linkedin-hook-extractor   gate: the opening line pattern behind that specific post is named and explained
  ├─ does an existing draft need its robotic sounding phrasing scrubbed, or does a finished post need a pass fail authenticity check?  → invoke linkedin-skills:linkedin-humanizer   gate: either a rewritten draft or a pass fail checklist result is returned for the same text supplied
  ├─ does the user want a brand new update composed from a blank page rather than reworked from something that already exists?  → invoke linkedin-skills:linkedin-post-writer   gate: a single new post built around a chosen opening style is produced
  ├─ does the request target the whole profile page owned by the user, rather than a single post?  → invoke linkedin-skills:linkedin-profile-optimizer   gate: specific rewrites are proposed for named profile sections such as the headline or the About area
  ├─ did the user point at one specific existing comment and ask for a reply to it?  → invoke linkedin-skills:linkedin-reply-handler   gate: a reply addressed to that exact comment thread is drafted
  ├─ does the source material already exist somewhere else, such as a video, thread, or article, and just need a native rebuild?  → invoke linkedin-skills:linkedin-repurposer   gate: a rebuilt post derived from the named outside source is produced, with links moved out of the main body
  ├─ does the user want to know which of their own past comments the original poster replied to, and when to follow up?  → invoke linkedin-skills:linkedin-thread-monitor   gate: past comments are classified by reply warmth and the ones worth a follow up are flagged
```

**Drift:** every route above targets `linkedin-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **linkedin-skills** (https://github.com/sergebulaev/linkedin-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
