# FLOW.md: kotlin/kotlin-agent-skills

> Routes all 6 skills from `kotlin/kotlin-agent-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ is writing or reviewing persistence entity classes on a Kotlin backend that uses Spring Data and Hibernate?  → invoke kotlin-agent-skills:kotlin-backend-jpa-entity-mapping   gate: entity classes with identity, equality, and relationship mappings that avoid common ORM pitfalls
  ├─ has a Kotlin Multiplatform project failing to build after upgrading the Android Gradle Plugin to version 9 or newer?  → invoke kotlin-agent-skills:kotlin-tooling-agp9-migration   gate: the project building cleanly under the new plugin structure with modules split as required
  ├─ has a Kotlin Multiplatform project still wired to CocoaPods for iOS dependencies and needs it moved to Swift Package Manager?  → invoke kotlin-agent-skills:kotlin-tooling-cocoapods-spm-migration   gate: the Xcode project building with Swift package declarations and no remaining CocoaPods references
  ├─ has code calling older copy-returning method names from an earlier release of the Kotlin immutable collections library?  → invoke kotlin-agent-skills:kotlin-tooling-immutable-collections-0-5-x-migration   gate: call sites updated to the renamed method forms and the project compiling against the newer library release
  ├─ has an existing Java source file that needs to become idiomatic Kotlin rather than a line-by-line port?  → invoke kotlin-agent-skills:kotlin-tooling-java-to-kotlin   gate: a new Kotlin file replacing the Java source, preserving framework-specific behavior
  ├─ has a report of slow iOS or shared-framework compile and link times on a multiplatform project and needs the cause diagnosed?  → invoke kotlin-agent-skills:kotlin-tooling-native-build-performance   gate: a measured build-time improvement or an identified root cause for the slow native link step
```

**Drift:** every route above targets `kotlin-agent-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **kotlin-agent-skills** (https://github.com/kotlin/kotlin-agent-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
