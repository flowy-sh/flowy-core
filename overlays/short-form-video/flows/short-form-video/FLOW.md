# FLOW.md: Short-Form Video

> Turns one GitHub repo into a vertical short that sells it: a hook a viewer would install it for, the README explained stop by stop, captions, a local render, checks before any post. It refuses invented numbers, unsourced statistics and posts nobody switched on.
> Skills by their authors under their own licenses. Routing by Flowy.

<!-- external-skills: marketing-skills, viral-video-master, remotion, superpowers -->

## Routing

**The rule. MANDATORY, not advisory.** When a trigger matches, INVOKE the named skill with the Skill tool BEFORE producing anything. Producing it when a trigger matched and you did not invoke is a VIOLATION, not a shortcut, and naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ no repo picked, or choosing what to feature? → invoke marketing-skills:content-strategy; gate: owner/repo named, not featured in the last 30 days
  ├─ facts missing or older than today? → invoke viral-video-master:viral-video-platform-algorithms; gate: stars, description and README read live today
  ├─ about to write the first spoken line? → invoke viral-video-master:viral-video-hooks-retention; gate: what the viewer gets or the problem that ends, from the README; no number; no question; never the repo name first
  ├─ hook written, first 3 seconds not planned? → invoke marketing-skills:video; gate: the line, what is on screen, what moves, drawn on frame 0
  ├─ about to write the lines after the hook? → invoke viral-video-master:viral-video-short-form; gate: one line per README section in order, each from that section's own text; the fixed closing line verbatim
  ├─ about to apply a persuasion move? → invoke marketing-skills:marketing-psychology; gate: the principle named; nothing the facts do not hold
  ├─ about to write on-screen words? → invoke marketing-skills:copywriting; gate: every line traced to the facts
  ├─ about to change the voice, or a new pipeline design? → invoke superpowers:brainstorming; gate: the owner's pick or approved design
  ├─ first Remotion step of the session? → invoke remotion:remotion-best-practices; gate: its "start Studio" line yields to the Hard rules
  ├─ about to write Remotion markup? → invoke remotion:remotion-markup; gate: every motion from the frame; nothing fetched at render time
  ├─ about to add or change captions? → invoke remotion:remotion-captions; gate: every spoken word shown in order at its time; estimated times said as estimated
  ├─ about to render? → invoke remotion:remotion-render; gate: local render; 1080x1920 h264 + aac; 6 stills looked at
  ├─ about to write post text? → invoke marketing-skills:social; gate: one text per platform, within its limit, the repo link
  ├─ about to read views or retention? → invoke marketing-skills:analytics; gate: source, population and period named
  ├─ about to say a version works better? → invoke marketing-skills:ab-testing; gate: hypothesis, metric, sample size; no win before significance
  ├─ an approved design has no plan? → invoke superpowers:writing-plans; gate: checkboxed tasks
  ├─ about to write pipeline code? → invoke superpowers:test-driven-development; gate: a failing test first
  ├─ a render, test or gate failed? → invoke superpowers:systematic-debugging; gate: the root cause written before the fix
  ├─ a change is complete? → invoke superpowers:requesting-code-review; gate: one fresh reviewer
  ├─ about to claim done? → invoke superpowers:verification-before-completion; gate: the command, its output, what was NOT checked
  ├─ SCOPE CHANGE. A new look, length or platform.
  │    └─ re-enter the earliest invalidated phase.
  ├─ BLOCKED. A key, a spend, an account or a post.
  │    └─ name it and the resume condition, then stop. Never fake the artifact.
  └─ ADVISORY. A question, no artifact.
       └─ answer only; no files change.
```

**Drift:** every route targets a skill in a separately installed plugin. If a slug no longer exists there, that route is a silent no-op. Never substitute a nearby-sounding skill. A broken route means this Flow needs an update, not that you may improvise.

## Priority on collision

1. Blocked. 2. Scope changed. 3. Verification before any claim; ab-testing before any "works better". 4. A failing test before pipeline code. 5. Lifecycle order: pick, hook, script, voice, look, captions, render, post text, weekly read. 6. Advisory answers without producing files.

## Hard rules (truth and money)

- Every number on screen or in the voice comes from a live read today. A viral skill's statistic ("1.3 seconds", "55 s gets 3x views") is a hypothesis, never a fact in a script or a post.
- Banned hooks: "Before this gets taken down", "What happened next shocked everyone", "The industry doesn't want you to know", "This is going away soon", and any urgency the facts do not prove.
- The closing line is fixed by the channel owner and never written by a model.
- Keys, spend, accounts and posting are the owner's word: paid voices, cloud renders, map keys. No preview server on a port someone else uses; no Studio in an unattended run.

## You are rationalizing if you think…

- "The stills look right in my head." → Render and look before anyone else does.
- "The summary says I already routed." → After compaction, re-read this file and restate the phase.

## Attribution

- `viral-video-master:*` by Josiah Siegel (https://github.com/JosiahSiegel/claude-plugin-marketplace), MIT.
- `marketing-skills:*` by Corey Haines (https://github.com/coreyhaines31/marketingskills), MIT.
- `remotion:*` by Remotion (https://github.com/remotion-dev/claude-code-plugin), skills MIT; Remotion itself under Remotion's licence.
- `superpowers:*` by Jesse Vincent (https://github.com/obra/superpowers), MIT.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0. The upstream authors do not endorse Flowy.
