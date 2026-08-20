# FLOW.md: zhanghandong/rust-skills

> Routes all 38 skills from `zhanghandong/rust-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to name a variable, function, or type, or format Rust code?  → invoke rust-skills:coding-guidelines   gate: a naming or formatting convention is cited before the suggestion is given
  ├─ does the current task explicitly require actionbook-backed selectors for documentation research?  → invoke rust-skills:core-actionbook   gate: the requesting step explicitly named actionbook selectors
  ├─ does completing the current research step require browser automation?  → invoke rust-skills:core-agent-browser   gate: a browser automation requirement was stated by the calling step
  ├─ was a crate-skill sync, clean, or update command just invoked?  → invoke rust-skills:core-dynamic-skills   gate: the invoking command is one of the three crate-skill management commands
  ├─ was a command to check or fix generated skill documentation just invoked?  → invoke rust-skills:core-fix-skill-docs   gate: the invoking command matches the skill-docs fix command
  ├─ about to design or implement a command line interface in Rust?  → invoke rust-skills:domain-cli   gate: an argument parser or subcommand structure is named in the plan
  ├─ about to design a containerized or microservice Rust deployment?  → invoke rust-skills:domain-cloud-native   gate: a container, orchestration, or service-mesh concern is named in the plan
  ├─ about to write firmware or no_std code for a microcontroller?  → invoke rust-skills:domain-embedded   gate: a target chip or peripheral is named before the code is written
  ├─ about to implement money, currency, or ledger arithmetic?  → invoke rust-skills:domain-fintech   gate: a decimal or fixed-point type is chosen over floating point
  ├─ about to design a sensor, telemetry, or device-gateway system?  → invoke rust-skills:domain-iot   gate: a device protocol or telemetry path is named in the plan
  ├─ about to implement model inference or training code in Rust?  → invoke rust-skills:domain-ml   gate: a tensor or inference crate is named before the code is written
  ├─ about to write an HTTP server, route handler, or middleware in Rust?  → invoke rust-skills:domain-web   gate: a web framework and route are named before the handler is written
  ├─ is the compiler reporting a move, borrow, or lifetime error?  → invoke rust-skills:m01-ownership   gate: the specific ownership error code is quoted before the fix
  ├─ is a choice between smart pointer types being made?  → invoke rust-skills:m02-resource   gate: the sharing and threading needs are stated before the pointer type is chosen
  ├─ is the compiler reporting a mutable borrow conflict?  → invoke rust-skills:m03-mutability   gate: the specific mutable-borrow error code is quoted before the fix
  ├─ is a generic, trait bound, or static-versus-dynamic dispatch choice being made?  → invoke rust-skills:m04-zero-cost   gate: static or dynamic dispatch is named before the function signature is written
  ├─ about to design types that should make an invalid state unrepresentable?  → invoke rust-skills:m05-type-driven   gate: a newtype, typestate, or sealed trait is named in the design
  ├─ is a choice being made between panicking and returning a Result or Option?  → invoke rust-skills:m06-error-handling   gate: the failure mode is named before unwrap, expect, or a Result type is chosen
  ├─ about to write threaded, async, or channel-based Rust code?  → invoke rust-skills:m07-concurrency   gate: a Send or Sync or deadlock risk is named before the concurrency primitive is chosen
  ├─ about to model entities, value objects, or business invariants?  → invoke rust-skills:m09-domain   gate: the invariant being protected is stated before the type is defined
  ├─ is code being optimized for speed or allocation count?  → invoke rust-skills:m10-performance   gate: a benchmark or profiling result exists before the optimization is applied
  ├─ is a crate dependency, feature flag, or FFI or wasm binding being chosen?  → invoke rust-skills:m11-ecosystem   gate: the candidate crate or binding tool is named before the manifest is edited
  ├─ about to design when a resource is created, pooled, or cleaned up?  → invoke rust-skills:m12-lifecycle   gate: the resource acquisition point and the release point are both named
  ├─ about to design an error hierarchy or a retry and fallback strategy?  → invoke rust-skills:m13-domain-error   gate: user-facing and internal error categories are both named before the hierarchy is written
  ├─ is the goal to build intuition for a Rust concept rather than fix specific code?  → invoke rust-skills:m14-mental-model   gate: an analogy or memory-layout picture is given before the technical definition
  ├─ is existing Rust code being reviewed for idiomatic style or common pitfalls?  → invoke rust-skills:m15-anti-pattern   gate: the specific pitfall is named before the idiomatic alternative is shown
  ├─ was a three-layer parallel analysis of the reasoning process explicitly requested?  → invoke rust-skills:meta-cognition-parallel   gate: the parallel-analysis command was invoked by name
  ├─ does the question ask which functions call or are called by a given function?  → invoke rust-skills:rust-call-graph   gate: a call-hierarchy lookup ran before the answer was given
  ├─ does the request ask where a symbol is defined or referenced?  → invoke rust-skills:rust-code-navigator   gate: a definition-or-reference lookup ran before the answer was given
  ├─ is the request asking for recent Rust ecosystem news or a periodic digest?  → invoke rust-skills:rust-daily   gate: a dated news source is cited in the report
  ├─ does the request ask to see the project dependency graph?  → invoke rust-skills:rust-deps-visualizer   gate: the project manifest was read before the graph was drawn
  ├─ is the question about a specific Rust or crate version, release, or API doc?  → invoke rust-skills:rust-learner   gate: a version number or changelog entry is cited in the answer
  ├─ is a rename, move, or extract refactor about to be performed?  → invoke rust-skills:rust-refactor-helper   gate: a reference lookup ran before the rename or move was applied
  ├─ has a new Rust-related question arrived with no specific skill chosen yet?  → invoke rust-skills:rust-router   gate: an intent category is picked before any other Rust skill runs
  ├─ was a request made to generate a new skill for a Rust crate or standard library module?  → invoke rust-skills:rust-skill-creator   gate: the target crate or module is named before the skill file is generated
  ├─ does the request ask for a list of the structs, traits, or functions in the project?  → invoke rust-skills:rust-symbol-analyzer   gate: a symbol-table query ran before the list was produced
  ├─ does the request ask which types implement a given trait?  → invoke rust-skills:rust-trait-explorer   gate: an implementation lookup ran before the list was produced
  ├─ is unsafe code, a raw pointer, or an FFI boundary being written or reviewed?  → invoke rust-skills:unsafe-checker   gate: a safety comment justifying the invariant is present before the unsafe block ships
```

**Drift:** every route above targets `rust-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **rust-skills** (https://github.com/zhanghandong/rust-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
