# FLOW.md: yanhua1010/self-media-content-workflow

> Routes all 9 skills from `yanhua1010/self-media-content-workflow` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does the user have real performance numbers, screenshots, or exported tables for posts already published and want them turned into a decision about what to do next?  → invoke self-media-suite:self-media-content-analytics   gate: a decision label such as double down, repackage, or stop comes out backed by a comparison against a same platform baseline
  ├─ has the user given only a one line topic, a raw link, or a vague ask with the audience, angle, tone, and no go zones still unconfirmed?  → invoke self-media-suite:self-media-content-brief   gate: a written creative outline exists with audience, angle, tone, and boundaries the user can confirm or correct
  ├─ is a finished draft, storyboard, or final version ready to be saved as a durable, versioned file rather than a throwaway tweak?  → invoke self-media-suite:self-media-content-delivery   gate: a new version file exists on disk and the running index of saved pieces is updated
  ├─ does the ask involve positioning a whole account, planning a content mix across weeks or months, or dividing work across platforms, rather than writing one piece?  → invoke self-media-suite:self-media-content-strategy   gate: a dated calendar or topic pool with a stated content ratio exists
  ├─ is a new self media request coming in whose type is not yet identified, or does an in progress piece still need its direction, title, final draft, or publish authorization confirmed?  → invoke self-media-suite:self-media-content-workflow   gate: a request type is chosen, the matching module is invoked, and a publish authorization checkpoint is logged before anything ships
  ├─ is the core theme, evidence, and outline already confirmed, and does each destination platform need its own independently designed headline and opening rather than one shared draft copied everywhere?  → invoke self-media-suite:self-media-platform-copywriting   gate: separate native drafts exist per destination, each with its own headline and opening rather than a single reused body
  ├─ does a confirmed theme need turning into a shootable vertical clip plan, meaning a voiceover script, an opening hook, a storyboard, and a recording checklist, rather than a finished edited cut?  → invoke self-media-suite:self-media-short-video   gate: a shot list with an opening hook line, a subtitle draft, and a cover concept exists
  ├─ does the user want public, read only research into what is gaining traction, what a competitor is doing, or what a timing window looks like, without logging in or interacting on their behalf?  → invoke self-media-suite:self-media-trend-radar   gate: a set of original topic angles with a supporting evidence package comes back, sourced only from public pages
  ├─ is a confirmed official account final draft in markdown ready to be formatted and placed into the draft box rather than sent out to readers?  → invoke self-media-suite:self-media-wechat-publisher   gate: a draft appears in the draft box with cover and inline images uploaded, and nothing is sent to subscribers
```

**Drift:** every route above targets `self-media-suite:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **self-media-suite** (https://github.com/yanhua1010/self-media-content-workflow). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
