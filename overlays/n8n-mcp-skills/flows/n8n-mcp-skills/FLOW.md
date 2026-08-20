# FLOW.md: czlonkowski/n8n-skills

> Routes all 15 skills from `czlonkowski/n8n-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ building or editing an AI agent node, an LLM chain, or a tool-calling setup?  → invoke n8n-mcp-skills:n8n-agents   gate: the agent node is configured with its system prompt and tools
  ├─ does this workflow move files, images or PDFs rather than plain JSON?  → invoke n8n-mcp-skills:n8n-binary-and-data   gate: the binary property is named and carried through correctly
  ├─ writing JavaScript inside a Code node?  → invoke n8n-mcp-skills:n8n-code-javascript   gate: the code runs against the node input syntax rather than guessed globals
  ├─ did the user specifically ask for Python inside a Code node?  → invoke n8n-mcp-skills:n8n-code-python   gate: written against the Python variable syntax, limitations acknowledged
  ├─ writing code an LLM will invoke as a tool, rather than code the workflow itself runs?  → invoke n8n-mcp-skills:n8n-code-tool   gate: the query input is parsed and a usable value returned
  ├─ would a silent failure on this path quietly drop work someone is waiting on?  → invoke n8n-mcp-skills:n8n-error-handling   gate: failures surface structured and recoverable
  ├─ writing an inline expression, or is one returning the wrong value?  → invoke n8n-mcp-skills:n8n-expression-syntax   gate: the expression was validated rather than eyeballed
  ├─ unsure which tool searches, validates or manages the thing you need?  → invoke n8n-mcp-skills:n8n-mcp-tools-expert   gate: the tool was chosen from the map, with its parameters
  ├─ does this account target more than one instance, or did a call come back ambiguous?  → invoke n8n-mcp-skills:n8n-multi-instance   gate: the target instance was resolved before the call
  ├─ setting up a node and unsure which fields the chosen operation actually requires?  → invoke n8n-mcp-skills:n8n-node-configuration   gate: required fields and their dependencies confirmed
  ├─ deploying this onto a server the user owns rather than onto the hosted service?  → invoke n8n-mcp-skills:n8n-self-hosting   gate: reachable over HTTPS behind the reverse proxy
  ├─ is this past roughly ten nodes, or is the same logic being repeated across workflows?  → invoke n8n-mcp-skills:n8n-subworkflows   gate: the shared logic lives in one reusable workflow
  ├─ did validation report an error or a warning whose meaning is unclear?  → invoke n8n-mcp-skills:n8n-validation-expert   gate: the error class was identified and the fix applied
  ├─ starting a new workflow with its overall shape not yet decided?  → invoke n8n-mcp-skills:n8n-workflow-patterns   gate: a named pattern chosen before nodes were placed
  ├─ about to build, edit, validate or debug a workflow through the MCP server?  → invoke n8n-mcp-skills:using-n8n-mcp-skills   gate: the applicable sub-skill was named before work started
```

**Drift:** every route above targets `n8n-mcp-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **n8n-mcp-skills** (https://github.com/czlonkowski/n8n-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
