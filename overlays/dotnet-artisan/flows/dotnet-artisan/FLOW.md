# FLOW.md: novotnyllc/dotnet-artisan

> Routes all 9 skills from `novotnyllc/dotnet-artisan` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ the request is confirmed to be .NET work and still needs to be routed to the right specialty before any of it begins?  → invoke dotnet-artisan:dotnet-advisor   gate: one specialty skill is selected and the shared coding standards are loaded before any code is written
  ├─ a backend service, web endpoint, or server side data access layer needs to be built or changed?  → invoke dotnet-artisan:dotnet-api   gate: an endpoint or backend service responds correctly and its data access layer is wired up
  ├─ C# code is about to be written or changed on any code path, before any domain specific guidance applies?  → invoke dotnet-artisan:dotnet-csharp   gate: the written code follows the shared language and style conventions before a domain skill adds its own layer
  ├─ a running or crashed process needs its state inspected, such as a hang, deadlock, or crash dump?  → invoke dotnet-artisan:dotnet-debugging   gate: a root cause is identified from a dump or live process inspection rather than guessed from source alone
  ├─ a build, release, container image, or package needs to be defined or automated rather than run once by hand?  → invoke dotnet-artisan:dotnet-devops   gate: a pipeline, container definition, or package artifact exists and can be rerun without manual steps
  ├─ a test needs to be planned or written for a piece of .NET behavior?  → invoke dotnet-artisan:dotnet-testing   gate: a test exists that exercises the behavior and reports pass or fail on its own
  ├─ the build itself, the SDK setup, or a low level performance primitive is the problem rather than application logic?  → invoke dotnet-artisan:dotnet-tooling   gate: a measured build time, startup time, or profiling number improves after the change
  ├─ a user facing screen or desktop or mobile interface needs to be built or changed?  → invoke dotnet-artisan:dotnet-ui   gate: a screen renders and responds to user input in the target application framework
  ├─ a new request might be about C# or the .NET platform but that has not been confirmed yet from wording or repository files?  → invoke dotnet-artisan:using-dotnet   gate: a project file or C# source file is confirmed present, or .NET keywords are confirmed in the request, before any domain skill loads
```

**Drift:** every route above targets `dotnet-artisan:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **dotnet-artisan** (https://github.com/novotnyllc/dotnet-artisan). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
