# FLOW.md: vercel/next.js

> Routes 4 skills from `vercel/next.js` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to flip the `cacheComponents` flag, or staring at a flood of blocking-prerender and instant-validation errors after flipping it?  → invoke nextjs:next-cache-components-adoption   gate: every blocking route resolved and `next build` completes clean
  ├─ Cache Components or PPR is already on and a route still navigates slowly on hard load or soft navigation?  → invoke nextjs:next-cache-components-optimizer   gate: a failing @next/playwright instant() e2e now passes
  ├─ just edited app code and about to claim the change works?  → invoke nextjs:next-dev-loop   gate: behaviour observed in a running `next dev`, not just a clean type-check
  ├─ about to turn on Partial Prefetching, or auditing which routes and `<Link prefetch>` calls should opt in?  → invoke nextjs:next-partial-prefetching-adoption   gate: routes carry `export const prefetch = 'partial'` and every surfaced insight is resolved
```

**Drift:** every route above targets `nextjs:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **nextjs** (https://github.com/vercel/next.js). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
