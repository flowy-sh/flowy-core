# FLOW.md: fugazi/test-automation-skills-agents

> Routes all 9 skills from `fugazi/test-automation-skills-agents` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is building or debugging accessibility checks in a Playwright and TypeScript stack, covering keyboard, ARIA, or contrast rules?  → invoke test-automation-skills-agents:a11y-playwright-testing   gate: automated accessibility checks running against real pages in that stack with a pass or fail per rule
  ├─ is validating accessibility compliance in a Java Selenium WebDriver project rather than a Playwright one?  → invoke test-automation-skills-agents:accessibility-selenium-testing   gate: an automated accessibility scan running through Selenium in Java with a compliance report
  ├─ needs to verify a REST or GraphQL endpoint contract directly, with no browser or UI involved?  → invoke test-automation-skills-agents:api-testing   gate: passing request-level tests asserting schema, auth, status codes, and pagination against the live endpoint
  ├─ has a test strategy, framework choice, or automation rollout plan that needs to be challenged before anyone starts building it?  → invoke test-automation-skills-agents:grill-me-qa   gate: a completed interview surfacing weaknesses in the proposed approach before implementation begins
  ├─ needs to poke at a live page from the command line right now, without writing a lasting test file?  → invoke test-automation-skills-agents:playwright-cli   gate: an interactive browser session with a captured snapshot, screenshot, or trace
  ├─ is authoring or fixing one versioned browser spec covering a real user flow, meant to live in the repo long term?  → invoke test-automation-skills-agents:playwright-e2e-testing   gate: a committed test file exercising the flow end to end with assertions on the resulting UI state
  ├─ is managing how a large existing set of browser specs runs and reports as a whole, rather than writing a single new one?  → invoke test-automation-skills-agents:playwright-regression-testing   gate: a suite configuration showing tiering, tagging, or sharding applied across many existing specs
  ├─ has a set of requirements and needs written test plans, cases, or bug reports produced by hand rather than automated?  → invoke test-automation-skills-agents:qa-manual-istqb   gate: a documented test plan or case set traceable back to the source requirements
  ├─ is authoring or fixing a versioned browser spec in a Java and Selenium project rather than a Playwright one?  → invoke test-automation-skills-agents:webapp-selenium-testing   gate: a committed Selenium test class using explicit waits and page objects, running under a Java test runner
```

**Drift:** every route above targets `test-automation-skills-agents:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **test-automation-skills-agents** (https://github.com/fugazi/test-automation-skills-agents). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
