# FLOW.md: microsoft/win-dev-skills

> Routes all 8 skills from `microsoft/win-dev-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to commit changes to a WinUI 3 app?  → invoke winui:winui-code-review   gate: a quality pass covering MVVM, bindings, accessibility, theming, security, and performance ran on the changed files
  ├─ about to author new XAML or plan a WinUI 3 layout?  → invoke winui:winui-design   gate: a layout and control plan exists covering Fluent alignment, theming, typography, and accessibility before XAML is written
  ├─ about to build or run a WinUI 3 project, or diagnosing a build error?  → invoke winui:winui-dev-workflow   gate: the project builds and launches, or the build error has a diagnosed cause
  ├─ about to produce a release build, sign it, or submit it to the Store?  → invoke winui:winui-packaging   gate: a signed MSIX package exists with a trusted certificate and a release build artifact
  ├─ asked to explain or diagnose what the agent did during a recent build session?  → invoke winui:winui-session-report   gate: a written diagnostic summary of that session exists
  ├─ setting up a new machine or fixing a reported missing prerequisite?  → invoke winui:winui-setup   gate: the SDK, CLI, templates, and Developer Mode are all verified installed
  ├─ about to verify UI behavior automatically instead of by hand?  → invoke winui:winui-ui-testing   gate: a batch UI automation script ran and produced pass or fail results per element
  ├─ porting an existing WPF application toward WinUI 3?  → invoke winui:winui-wpf-migration   gate: namespaces, controls, threading calls, and imaging types are all mapped to their WinUI 3 equivalents
```

**Drift:** every route above targets `winui:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **winui** (https://github.com/microsoft/win-dev-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
