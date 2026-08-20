# FLOW.md: aklofas/kicad-happy

> Routes all 11 skills from `aklofas/kicad-happy` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ several different vendor or fabrication lookups need to land in one unified parts list instead of staying scattered?  → invoke kicad-happy:bom   gate: one parts list holds part numbers, costs, and quantities pulled together from the separate vendor and fab lookups
  ├─ a component spec sheet PDF exists but its pinout and electrical characteristics have not been pulled into a structured, reusable form yet?  → invoke kicad-happy:datasheets   gate: a cached, structured extraction of pinouts and electrical characteristics exists for that project and component
  ├─ placing a prototype order and wanting the preferred, primary source for parts and their spec sheets?  → invoke kicad-happy:digikey   gate: pricing, stock, and a spec sheet are retrieved from the primary preferred source via its API
  ├─ sourcing parts and the right storefront depends on whether the order ships to the US, UK or EU, or APAC region?  → invoke kicad-happy:element14   gate: the same lookup returns pricing and stock from whichever of the three regional storefronts applies
  ├─ a board layout is done and needs a pre-compliance pass for electromagnetic compatibility before it goes to a compliance lab?  → invoke kicad-happy:emc   gate: a rule-by-rule report scores ground planes, filtering, routing, and radiation risk against the pre-compliance rule set
  ├─ a board design is ready for the default fabrication and assembly vendor, and its parts still need sorting into the basic and extended catalog tiers that vendor offers?  → invoke kicad-happy:jlcpcb   gate: fabrication files and a parts list are generated with each part classified as basic or extended for that vendor
  ├─ a schematic or PCB project needs its design checked for bugs, net-tracing errors, or rule violations before trusting it?  → invoke kicad-happy:kicad   gate: nets, footprints, and rule checks are cross-referenced between the schematic and the board layout with violations listed
  ├─ parts need to be chosen so they will already be stocked by the same catalog the default fabrication vendor assembles from?  → invoke kicad-happy:lcsc   gate: chosen parts resolve to catalog numbers drawn from the same stocked parts library that fabrication vendor uses
  ├─ the primary parts source came up short and a second source, or a whole list of part numbers to seed at once, is needed?  → invoke kicad-happy:mouser   gate: pricing and stock come back from the backup source, including for a batch-seeded list of part numbers
  ├─ some parts are not available through the default fabrication vendor, or the vendor itself should source parts turnkey rather than working from a supplied parts list?  → invoke kicad-happy:pcbway   gate: an order is placed with the alternative vendor sourcing parts itself by part number rather than from a supplied list
  ├─ a subcircuit like a filter, divider, or oscillator needs its behavior validated numerically before trusting the schematic values?  → invoke kicad-happy:spice   gate: a simulation run reports the measured frequency, ratio, or gain against what the design values predicted
```

**Drift:** every route above targets `kicad-happy:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **kicad-happy** (https://github.com/aklofas/kicad-happy). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
