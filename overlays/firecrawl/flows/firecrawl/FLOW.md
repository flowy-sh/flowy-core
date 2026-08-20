# FLOW.md: firecrawl/firecrawl-claude-plugin

> Routes all 10 skills from `firecrawl/firecrawl-claude-plugin` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ need structured JSON pulled from a site whose layout is too complex for one fixed selector?  → invoke firecrawl:firecrawl-agent   gate: the returned JSON matches the requested schema on a real page
  ├─ need every page under a section of a site, not just one page?  → invoke firecrawl:firecrawl-crawl   gate: a full set of pages under the target section comes back, not a single page
  ├─ need a site saved to local disk for offline reading rather than returned inline?  → invoke firecrawl:firecrawl-download   gate: files exist on disk, one per page, in the requested format
  ├─ need to click, submit or log in before the wanted content becomes visible?  → invoke firecrawl:firecrawl-interact   gate: the target content is visible only after the described actions run in sequence
  ├─ need the list of URLs a site has before deciding what to fetch from it?  → invoke firecrawl:firecrawl-map   gate: a URL list comes back before any page content is pulled
  ├─ need to know later if a page changes, rather than reading it once now?  → invoke firecrawl:firecrawl-monitor   gate: a watch is registered against the page with a notification channel attached
  ├─ holding a local document file that needs converting to clean text rather than a URL?  → invoke firecrawl:firecrawl-parse   gate: a markdown file exists on disk matching the source document content
  ├─ handed one URL and asked for its readable content?  → invoke firecrawl:firecrawl-scrape   gate: clean markdown comes back for that single URL, JS-rendered or not
  ├─ need to find sources on a topic rather than fetch a known address?  → invoke firecrawl:firecrawl-search   gate: a ranked set of results with extracted content, not just links, comes back
  ├─ the request is web-related but which specific mode is not yet clear?  → invoke firecrawl:firecrawl   gate: the request is routed to one concrete mode of web access
```

**Drift:** every route above targets `firecrawl:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **firecrawl** (https://github.com/firecrawl/firecrawl-claude-plugin). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
