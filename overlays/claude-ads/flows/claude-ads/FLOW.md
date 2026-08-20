# FLOW.md: agricidaniel/claude-ads

> Routes all 33 skills from `AgriciDaniel/claude-ads` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to audit a confirmed Amazon Ads or Amazon PPC account?  → invoke claude-ads:ads-amazon   gate: an audit of the Amazon Ads account reporting ACOS or TACOS by campaign exists
  ├─ about to audit a confirmed Apple Search Ads or App Store ads account?  → invoke claude-ads:ads-apple   gate: an audit of the Apple Ads account citing Search Match or AdAttributionKit reconciliation exists
  ├─ about to reconcile conversion counts or windows across ad platforms and analytics?  → invoke claude-ads:ads-attribution   gate: an attribution audit naming the reporting window and reconciliation gap exists
  ├─ about to run a paid-ads health check across several platforms or before the platform is confirmed?  → invoke claude-ads:ads-audit   gate: a source-grounded audit report spanning the requested platforms exists
  ├─ about to allocate or pace spend across campaigns or platforms?  → invoke claude-ads:ads-budget   gate: a budget allocation with CPA, ROAS, or MER targets by platform exists
  ├─ about to research a rival paid-ad presence, creative, or ad-library listing?  → invoke claude-ads:ads-competitor   gate: a competitor research summary citing an ad-library source exists
  ├─ about to draft new campaign concepts, messaging, or ad copy from a brand profile?  → invoke claude-ads:ads-create   gate: a creative brief or campaign concept grounded in the brand profile exists
  ├─ about to audit existing live ad copy, images, or video for fatigue or message match?  → invoke claude-ads:ads-creative   gate: a creative audit scoring existing assets for fatigue or message match exists
  ├─ about to extract a brand voice, visual identity, or offer profile from a website?  → invoke claude-ads:ads-dna   gate: a public-safe brand and offer profile document exists
  ├─ about to generate new paid-ad image assets from an approved creative brief?  → invoke claude-ads:ads-generate   gate: generated ad images tied to a validated creative brief and configured provider exist
  ├─ about to audit a confirmed Google Ads or Performance Max account?  → invoke claude-ads:ads-google   gate: an audit of the Google Ads account covering Search, Shopping, or Performance Max settings exists
  ├─ about to audit the post-click landing page a paid ad sends traffic to?  → invoke claude-ads:ads-landing   gate: a landing-page audit covering message match, forms, and conversion friction exists
  ├─ about to push a drafted paid-ad campaign live or apply a launch through an adapter?  → invoke claude-ads:ads-launch   gate: a launch plan or an explicit capability-gated apply action exists
  ├─ about to audit a confirmed LinkedIn Ads or Campaign Manager account?  → invoke claude-ads:ads-linkedin   gate: an audit of the LinkedIn Ads account covering Insight Tag or Lead Gen Forms exists
  ├─ about to calculate a break-even, CPA, or ROAS number without pulling live account data?  → invoke claude-ads:ads-math   gate: a numeric calculation with the formula and inputs shown exists
  ├─ about to audit a confirmed Meta, Facebook, or Instagram Ads account?  → invoke claude-ads:ads-meta   gate: an audit of the Meta Ads account covering Pixel or Conversions API setup exists
  ├─ about to audit a confirmed Microsoft Advertising or Bing Ads account?  → invoke claude-ads:ads-microsoft   gate: an audit of the Microsoft Ads account covering UET tag setup exists
  ├─ about to run a recurring daily or weekly check on a live ad account rather than a full audit?  → invoke claude-ads:ads-monitor   gate: a monitoring pass flagging pacing or anomaly status exists
  ├─ about to diagnose an underperforming campaign and decide whether to change or pause it?  → invoke claude-ads:ads-optimize   gate: an optimization diagnosis with evidence and an explicit apply decision exists
  ├─ about to generate product photography variants from a source product image?  → invoke claude-ads:ads-photoshoot   gate: rights-cleared product photography variants from the source image exist
  ├─ about to audit a confirmed Pinterest Ads or shopping catalog account?  → invoke claude-ads:ads-pinterest   gate: an audit of the Pinterest Ads account covering catalog or Pinterest Tag readiness exists
  ├─ about to write a full paid-advertising strategy before any campaign exists?  → invoke claude-ads:ads-plan   gate: a strategy document covering objectives, platform selection, and rollout exists
  ├─ about to audit a confirmed Reddit Ads or promoted-post account?  → invoke claude-ads:ads-reddit   gate: an audit of the Reddit Ads account covering community targeting or Reddit Pixel exists
  ├─ about to turn a completed audit or plan run into a shareable document?  → invoke claude-ads:ads-report   gate: a Markdown, HTML, or PDF report built from a validated run bundle exists
  ├─ about to refresh platform, API, or policy evidence that may be past its refresh_due date?  → invoke claude-ads:ads-research   gate: an evidence refresh with updated source citations and dates exists
  ├─ about to audit server-side tag management or conversion API deduplication specifically?  → invoke claude-ads:ads-server-side-tracking   gate: a server-side tracking audit covering sGTM or CAPI deduplication exists
  ├─ about to connect a new client account, brand, or credential profile for the first time?  → invoke claude-ads:ads-setup   gate: an onboarding profile with connected data sources and guardrails exists
  ├─ about to audit a confirmed Snapchat Ads or Snap Pixel account?  → invoke claude-ads:ads-snapchat   gate: an audit of the Snapchat Ads account covering Snap Pixel or AR Lens formats exists
  ├─ about to design or evaluate a paid-ad experiment with a hypothesis and sample size?  → invoke claude-ads:ads-test   gate: an experiment design with hypothesis, sample size, and decision rule exists
  ├─ about to audit a confirmed TikTok Ads or TikTok Shop account?  → invoke claude-ads:ads-tiktok   gate: an audit of the TikTok Ads account covering Pixel or Events API setup exists
  ├─ about to check the Claude Ads tool contracts, run bundles, or install state for validity before relying on them?  → invoke claude-ads:ads-validate   gate: a validation pass over contracts, capabilities, or install state exists
  ├─ about to audit a confirmed X or Twitter Ads account?  → invoke claude-ads:ads-x   gate: an audit of the X Ads account covering X Pixel or conversation targeting exists
  ├─ about to audit a confirmed YouTube Ads, Shorts, or Demand Gen account?  → invoke claude-ads:ads-youtube   gate: an audit of the YouTube Ads account covering in-stream, Shorts, or CTV inventory exists
```

**Drift:** every route above targets `claude-ads:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **claude-ads** (https://github.com/AgriciDaniel/claude-ads). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
