# FLOW.md: pinecone-io/pinecone-claude-code-plugin

> Routes all 9 skills from `pinecone-io/pinecone-claude-code-plugin` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ does the request need a hosted, citation backed document question and answer layer created, fed with files, or chatted with?  → invoke pinecone:assistant   gate: a cited reply comes back from a named document collection
  ├─ is the user working from a terminal and needs a batch or vector operation against any index type, including ones a hosted tool integration cannot reach?  → invoke pinecone:cli   gate: a terminal command against a named index returns a result
  ├─ is the user writing integration code and needs the exact API parameter or record format looked up?  → invoke pinecone:docs   gate: a link to the right reference topic is handed back
  ├─ does the user want to build or run a lexical, keyword style preview index with dense or sparse fields over raw documents?  → invoke pinecone:full-text-search   gate: documents are ingested into a named preview index and a ranked hit list comes back
  ├─ is the user unsure which capability applies or what needs to be set up before starting?  → invoke pinecone:help   gate: a short list of available capabilities and prerequisites is shown
  ├─ does an agent need to know which hosted tool calls exist and what inputs they expect before invoking one?  → invoke pinecone:mcp   gate: a list of callable operations with their expected inputs is available to check against
  ├─ is the user building an automation workflow that needs a canvas node wired to a hosted vector or document chat backend?  → invoke pinecone:n8n   gate: a workflow node runs inside the automation canvas and returns a result from the backend
  ├─ is the user retrieving matches by plain text from an index that already has a built in embedding model attached, rather than building vectors by hand or using a standard index?  → invoke pinecone:query   gate: matches come back from a named integrated index with no vector built by the caller
  ├─ is this a brand new developer with nothing created yet who wants a guided first run, choosing between a database style path and a document chat style path?  → invoke pinecone:quickstart   gate: a first index or chat ready resource exists by the end of the walkthrough
```

**Drift:** every route above targets `pinecone:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **pinecone** (https://github.com/pinecone-io/pinecone-claude-code-plugin). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
