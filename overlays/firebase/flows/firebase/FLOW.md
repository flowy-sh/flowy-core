# FLOW.md: firebase/skills

> Routes all 12 skills from `firebase/skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ an installed extension needs to become a standalone codebase or a publishable package instead of staying a black box extension?  → invoke firebase:extension-to-functions-codebase   gate: a standalone deployable codebase or npm package exists that no longer depends on the original extension install
  ├─ the app needs to call a generative AI model such as Gemini directly from client or server code?  → invoke firebase:firebase-ai-logic-basics   gate: a working call to the AI model returns a structured response from the app
  ├─ a server-rendered Next.js or Angular application needs a managed deployment pipeline rather than a plain static site?  → invoke firebase:firebase-app-hosting-basics   gate: the SSR app deploys successfully and its deployment config file is present in the repository
  ├─ the app needs users to sign in or needs access rules tied to who is signed in?  → invoke firebase:firebase-auth-basics   gate: a signed-in user session exists and protected data access respects it
  ├─ the command line tool is not yet installed, logged in, or pointed at a project?  → invoke firebase:firebase-basics   gate: the command line tool reports a logged-in account and an active selected project
  ├─ the app has no crash reporting wired up yet, or a crash needs to be captured and surfaced?  → invoke firebase:firebase-crashlytics   gate: a test crash appears in the crash reporting dashboard
  ├─ the app needs a relational schema with generated, type-safe queries against a managed PostgreSQL backend?  → invoke firebase:firebase-data-connect-basics   gate: a generated type-safe client function successfully runs a query against the schema
  ├─ the app needs a document style database with its own access rules and indexes rather than a relational schema?  → invoke firebase:firebase-firestore   gate: a document read or write succeeds through the SDK under the configured access rules
  ├─ a static site or single page app needs a public URL, custom domain, or redirect and rewrite rules?  → invoke firebase:firebase-hosting-basics   gate: the static site is reachable at its configured URL with the redirect and rewrite rules applied
  ├─ a value or feature flag needs to change for users without shipping a new app build?  → invoke firebase:firebase-remote-config-basics   gate: a fetched flag value changes app behavior without a new release
  ├─ existing database or storage access rules need a vulnerability pass before they are trusted in production?  → invoke firebase:firebase-security-rules-auditor   gate: an audit report lists each rule file with a pass or fail verdict per vulnerability class checked
  ├─ an iOS project file itself needs a new package dependency added and linked, not just a config value changed?  → invoke firebase:xcode-project-setup   gate: the project file lists the new package dependency and the app target links it
```

**Drift:** every route above targets `firebase:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **firebase** (https://github.com/firebase/skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
