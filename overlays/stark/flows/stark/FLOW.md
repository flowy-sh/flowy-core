# FLOW.md: f0d010c/stark

> Routes all 8 skills from `f0d010c/stark` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is the deliverable specifically an Android app or Android-flavored UI, like Material 3 or a Play Store listing?  → invoke stark:android-design   gate: Material 3 components and Android platform conventions appear in the output
  ├─ is the deliverable for an Apple platform such as iOS, iPadOS, macOS, watchOS, or visionOS, expected to follow native Apple interface conventions?  → invoke stark:apple-design   gate: SF Symbols and native Apple interface conventions appear in the output
  ├─ does the same product need to work as one consistent experience across several platforms at once, like web, iOS, Android, and desktop together?  → invoke stark:cross-platform-design   gate: one shared design language is documented as translated across multiple platform surfaces
  ├─ has the user asked for an interface or product experience without yet saying which platform or surface it targets?  → invoke stark:design-router   gate: a specific platform track is chosen before any surface-specific work begins
  ├─ does the request center on the reusable color, type, spacing, or elevation values themselves rather than any one screen built from them?  → invoke stark:design-tokens   gate: a source file with named values for color, spacing, or elevation is produced or updated
  ├─ is the concern how a journey actually flows step by step, like onboarding, checkout, or navigation, rather than how any single screen looks?  → invoke stark:ux-design   gate: a step by step flow or wireframe sequence is produced showing the journey rather than final visual styling
  ├─ is the deliverable a website or web app meant to run in a browser, like a landing page or web dashboard?  → invoke stark:web-design   gate: browser-based markup or a web framework component is produced for that page
  ├─ is the deliverable a native Windows desktop application, like a Fluent-styled utility or Microsoft Store app?  → invoke stark:windows-design   gate: Fluent design system elements appear correctly in a Windows desktop layout
```

**Drift:** every route above targets `stark:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **stark** (https://github.com/f0d010c/stark). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
