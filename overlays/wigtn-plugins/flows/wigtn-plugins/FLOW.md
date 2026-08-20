# FLOW.md: wigtn/wigtn-plugins

> Routes all 7 skills from `wigtn/wigtn-plugins` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to judge a change past surface correctness, at design depth?  → invoke wigtn-plugins:code-review-levels   gate: the depth applied is stated before any finding is listed
  ├─ about to write or restyle front end UI with no style contract loaded?  → invoke wigtn-plugins:design-system-reference   gate: the anti pattern checklist is open before the first markup is written
  ├─ asked for a sketch style picture of the architecture to commit into docs?  → invoke wigtn-plugins:handdrawn-diagram   gate: an SVG and a PNG land in the repo with legible labels
  ├─ holding a lesson from this session that the team should keep?  → invoke wigtn-plugins:knowledge-wiki   gate: the entry clears every redaction gate and lands only under the configured path
  ├─ a requirements doc is approved and the interface is undefined?  → invoke wigtn-plugins:screen-spec   gate: all five definition documents exist and the wireframe carries no brand styling
  ├─ about to hand work to a parallel build that needs the same context?  → invoke wigtn-plugins:team-memory-protocol   gate: the shared context file is updated and linked to the plan ledger
  ├─ asked for a branded deck rather than a generic one?  → invoke wigtn-plugins:wigtn-ppt   gate: one self contained HTML file carries the house marks on every slide
```

**Drift:** every route above targets `wigtn-plugins:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **wigtn-plugins** (https://github.com/wigtn/wigtn-plugins). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
