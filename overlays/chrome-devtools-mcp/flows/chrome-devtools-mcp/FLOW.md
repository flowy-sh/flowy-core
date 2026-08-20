# FLOW.md: chromedevtools/chrome-devtools-mcp

> Routes all 6 skills from `ChromeDevTools/chrome-devtools-mcp` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does a page need an accessibility check for aria labels focus states keyboard navigation or color contrast?  → invoke chrome-devtools-mcp:a11y-debugging   gate: an accessibility audit against published guidelines exists for the page
  ├─ does browser automation need to run as a shell script or cli command rather than interactive calls?  → invoke chrome-devtools-mcp:chrome-devtools-cli   gate: a shell script or cli command completes the browser automation task
  ├─ does a web page need interactive debugging performance analysis or network inspection through the browser inspector?  → invoke chrome-devtools-mcp:chrome-devtools   gate: the browser inspector returned debugging performance or network data for the page
  ├─ is a page slow to show its main content and does the largest contentful paint metric need debugging?  → invoke chrome-devtools-mcp:debug-optimize-lcp   gate: the lcp measurement improved after applying the guided optimization
  ├─ is memory usage climbing or has an out of memory error been reported for a javascript or node app?  → invoke chrome-devtools-mcp:memory-leak-debugging   gate: heap snapshots were captured and compared to isolate the leak
  ├─ did a browser connection or page navigation call fail to respond?  → invoke chrome-devtools-mcp:troubleshooting   gate: the connection or target issue is identified and resolved
```

**Drift:** every route above targets `chrome-devtools-mcp:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **chrome-devtools-mcp** (https://github.com/ChromeDevTools/chrome-devtools-mcp). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
