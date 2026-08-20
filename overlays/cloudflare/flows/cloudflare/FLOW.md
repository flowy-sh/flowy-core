# FLOW.md: cloudflare/skills

> Routes all 13 skills from `cloudflare/skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ building something stateful at the edge: an agent, a durable workflow, a WebSocket app or a scheduled task?  → invoke cloudflare:agents-sdk   gate: state, RPC and lifecycle are configured on the agent class
  ├─ does the application need to send or receive transactional mail?  → invoke cloudflare:cloudflare-email-service   gate: a send or route path exists through the binding or REST API
  ├─ moving off an existing zero-trust, VPN or SASE stack rather than building a new one?  → invoke cloudflare:cloudflare-one-migrations   gate: policies mapped, with the parity gaps named
  ├─ designing, configuring or troubleshooting zero-trust access, gateway, tunnel or device posture?  → invoke cloudflare:cloudflare-one   gate: the deployment was checked against current documentation, not recall
  ├─ working across the platform generally, with the specific product not yet narrowed down?  → invoke cloudflare:cloudflare   gate: the right product surface is identified before configuring it
  ├─ does the work need per-object coordination that survives between requests?  → invoke cloudflare:durable-objects   gate: the object holds its own state, with alarms or sockets wired
  ├─ porting an existing sandbox app from the stable package onto the preview one?  → invoke cloudflare:sandbox-migrate-to-next   gate: the migration completed and the app runs on the preview package
  ├─ building a sandbox app against the preview SDK rather than the default package?  → invoke cloudflare:sandbox-next   gate: built against the preview API surface
  ├─ building a sandbox app against the default published package?  → invoke cloudflare:sandbox-stable   gate: built against the stable API surface, deprecated calls cleared
  ├─ does a form, endpoint or action need bot verification wired end to end?  → invoke cloudflare:turnstile-spin   gate: the widget exists and its verification is wired server side
  ├─ is a page slow, with the cause not yet measured?  → invoke cloudflare:web-perf   gate: core web vitals measured and the blocking resources named
  ├─ writing or reviewing edge function code that will run in production?  → invoke cloudflare:workers-best-practices   gate: reviewed against the production anti-pattern list
  ├─ about to run a CLI command against edge functions or their storage bindings?  → invoke cloudflare:wrangler   gate: the command syntax was confirmed before running it
```

**Drift:** every route above targets `cloudflare:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **cloudflare** (https://github.com/cloudflare/skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
