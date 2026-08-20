# FLOW.md: cyberkaida/reverse-engineering-assistant

> Routes all 6 skills from `cyberkaida/reverse-engineering-assistant` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is this the first look at an unfamiliar binary and does the agent need a quick overview of what it does?  → invoke ReVa:binary-triage   gate: a summary of memory layout, strings, imports, and likely purpose exists
  ├─ does the challenge involve a custom or weak cryptographic scheme that needs breaking to recover a key or plaintext?  → invoke ReVa:ctf-crypto   gate: the cipher is identified and the key or plaintext is recovered
  ├─ does the challenge require exploiting a memory corruption bug to gain control of program execution?  → invoke ReVa:ctf-pwn   gate: a working exploit reads the flag through the vulnerability
  ├─ does the challenge require reconstructing an algorithm or validation logic to recover a hidden flag or password?  → invoke ReVa:ctf-rev   gate: the hidden value is recovered through program comprehension rather than exploitation
  ├─ is there one specific, narrow question about a function or behavior that needs a focused, iterative answer?  → invoke ReVa:deep-analysis   gate: the specific question is answered and the finding is saved back to the analysis database
  ├─ does answering the question require writing and running a custom script inside the attached analysis session?  → invoke ReVa:pyghidra-scripting   gate: a script executes inside the session and its output is captured
```

**Drift:** every route above targets `ReVa:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **ReVa** (https://github.com/cyberkaida/reverse-engineering-assistant). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
