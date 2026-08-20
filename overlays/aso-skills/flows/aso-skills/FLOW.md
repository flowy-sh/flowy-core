# FLOW.md: eronred/aso-skills

> Routes all 40 skills from `eronred/aso-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to compare two or more store page creative variants against each other in a controlled test?  → invoke aso-skills:ab-test-store-listing   gate: a named control and variant with a single conversion metric between them are defined
  ├─ about to optimize a listing on the Android storefront rather than the Apple one?  → invoke aso-skills:android-aso   gate: recommended copy respects the Android storefront field length limits
  ├─ about to set up or interpret tracking, events, or a funnel rather than read numbers already recorded?  → invoke aso-skills:app-analytics   gate: specific events or a funnel step are named in the recommendation
  ├─ about to design a no install instant entry point into the app?  → invoke aso-skills:app-clips   gate: an invocation point for the instant experience, such as a card or a link, is named
  ├─ about to choose between icon concepts before any test of them is run?  → invoke aso-skills:app-icon-optimization   gate: distinct icon concepts tied to tap through rate are described
  ├─ is the app not yet live, or about to ship a major update, and in need of a launch day plan?  → invoke aso-skills:app-launch   gate: a dated checklist covering the days before and the day of release exists
  ├─ is this the first task in a new engagement with no positioning document on file yet?  → invoke aso-skills:app-marketing-context   gate: a saved positioning document exists for later steps to read
  ├─ about to script or storyboard the autoplay video shown on the listing itself?  → invoke aso-skills:app-preview-video   gate: a shot list or script with timing for the autoplay video is produced
  ├─ did a store review process just reject the app or its update?  → invoke aso-skills:app-rejection-recovery   gate: the specific guideline cited in the rejection is identified and a fix is proposed
  ├─ is the goal editorial placement chosen by store staff rather than a general release plan?  → invoke aso-skills:app-store-featured   gate: a pitch angle tied to a current editorial theme is produced
  ├─ about to configure bidding, match types, or campaign structure on the Apple paid search platform specifically?  → invoke aso-skills:apple-search-ads   gate: a bid or match type recommendation tied to a named keyword is produced
  ├─ does the user want to see their own already recorded downloads or revenue rather than set up new tracking?  → invoke aso-skills:asc-metrics   gate: the summary cites specific recorded figures rather than estimates
  ├─ does the request need a full scored review of the whole listing rather than one isolated element of it?  → invoke aso-skills:aso-audit   gate: a scored review covering multiple listing elements with ranked fixes is produced
  ├─ has a store or app marketing topic just been raised before any specialist has been chosen yet?  → invoke aso-skills:aso-router   gate: the request is handed to exactly one specialist chosen from the library
  ├─ about to wire up or debug which channel gets credit for an install rather than read numbers already credited?  → invoke aso-skills:attribution-setup   gate: a specific mechanism or partner integration step is named
  ├─ is the decision at hand which storefront category or subcategory the app should be listed under?  → invoke aso-skills:category-positioning   gate: a primary or secondary category choice with a discoverability trade off is stated
  ├─ does the request need a one time comparative snapshot of named competitors rather than an ongoing watch on them?  → invoke aso-skills:competitor-analysis   gate: a comparison naming specific competitor gaps is produced
  ├─ does the user want a standing watch that alerts on changes to a named competitor over time rather than a single snapshot?  → invoke aso-skills:competitor-tracking   gate: a recurring check and an alert condition for a named signal are set up
  ├─ is the concern app stability or crash frequency rather than a listing or growth question?  → invoke aso-skills:crash-analytics   gate: crashes are ranked by a stated severity or frequency criterion
  ├─ does the growth channel under discussion involve creators or influencers making content about the app?  → invoke aso-skills:creator-ugc-marketing   gate: a brief naming a specific platform and creator type is produced
  ├─ about to build a page variant tied to one specific inbound link or campaign source rather than run a head to head test?  → invoke aso-skills:custom-product-pages   gate: a page variant is mapped to a specific inbound source
  ├─ about to design a time boxed activity card meant to appear in store search and browse as a live event?  → invoke aso-skills:in-app-events   gate: an event card concept with a start date and an end date is produced
  ├─ does the user need a ranked list of candidate search terms rather than the finished copy that would contain them?  → invoke aso-skills:keyword-research   gate: a term list ranked by volume or difficulty is produced
  ├─ about to adapt the listing for a specific non default country or language?  → invoke aso-skills:localization   gate: adapted copy for a named market or language is produced
  ├─ does the user want to know which specific apps are rapidly rising or falling in rank right now?  → invoke aso-skills:market-movers   gate: named apps are listed with their rank change
  ├─ does the user want one combined snapshot of overall market activity rather than a single signal on its own?  → invoke aso-skills:market-pulse   gate: the briefing combines at least two distinct market signals
  ├─ about to write the actual title, subtitle, or description text within a strict character limit?  → invoke aso-skills:metadata-optimization   gate: copy is produced that fits the stated character limit
  ├─ is the open question which revenue model or price tier to use before any specific paywall screen is designed?  → invoke aso-skills:monetization-strategy   gate: a revenue model or price tier recommendation is produced
  ├─ is the drop off happening in the first session itself rather than in ongoing use afterward?  → invoke aso-skills:onboarding-optimization   gate: a specific first run step is named as the drop off point with a fix proposed
  ├─ about to design or test the paywall screen itself, its layout, or its copy?  → invoke aso-skills:paywall-optimization   gate: a paywall layout or copy variant tied to a conversion metric is produced
  ├─ does the growth channel under discussion involve outside journalists or media outlets rather than store editorial staff?  → invoke aso-skills:press-and-pr   gate: a pitch or press asset naming a specific outlet or angle is produced
  ├─ is the task when or how to trigger the star rating request shown to users, rather than responding to reviews already written?  → invoke aso-skills:rating-prompt-strategy   gate: a specific trigger moment or frequency cap for the request is recommended
  ├─ does the growth mechanism involve existing users inviting new ones for a reward?  → invoke aso-skills:referral-program   gate: a reward structure and a fraud check are both defined
  ├─ is user drop off happening well after the first session rather than during it?  → invoke aso-skills:retention-optimization   gate: a churn driver is identified using a stated engagement metric
  ├─ does the task involve reading or replying to reviews that have already been submitted?  → invoke aso-skills:review-management   gate: a response draft or theme summary tied to specific submitted reviews is produced
  ├─ about to decide the static image sequence or overall visual story of the product page?  → invoke aso-skills:screenshot-optimization   gate: an image sequence or narrative order for the product page is produced
  ├─ is the change tied to a specific holiday, season, or dated cultural moment?  → invoke aso-skills:seasonal-aso   gate: a copy or creative change is scheduled around a named dated event
  ├─ is the focus what happens after trial signup, such as renewal or win back, rather than the paywall screen itself?  → invoke aso-skills:subscription-lifecycle   gate: a lifecycle stage such as renewal or win back is targeted with a specific tactic
  ├─ does the paid acquisition question span more than one ad network or an overall budget split, rather than bidding mechanics on a single network?  → invoke aso-skills:ua-campaign   gate: a budget split across more than one ad network is recommended
  ├─ does the user journey begin on a browser page rather than inside a storefront listing?  → invoke aso-skills:web-to-app-funnel   gate: a specific mechanism carrying session context from the browser into the installed app, such as a deferred link, is configured
```

**Drift:** every route above targets `aso-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **aso-skills** (https://github.com/eronred/aso-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
