# FLOW.md: vercel-labs/vercel-plugin

> Routes all 40 skills from `vercel-labs/vercel-plugin` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ writing new scenarios meant to stress test skill injection for this plugin against advanced platform features such as durable resumable processes, cross provider ai routing, mcp servers, or multi agent orchestration?  → invoke vercel-plugin:benchmark-agents   gate: a scenario set exercising the advanced platform features exists
  ├─ about to run an unattended end to end test pass that launches dev servers and produces an improvement report for overnight self improvement of this plugin?  → invoke vercel-plugin:benchmark-e2e   gate: an improvement report from the end to end run exists
  ├─ about to run this plugin evaluation scenarios inside ephemeral cloud micro vms instead of local terminal panels?  → invoke vercel-plugin:benchmark-sandbox   gate: a coverage report generated from the cloud vm runs exists
  ├─ about to spin up isolated test projects and install this plugin before launching terminal sessions with crafted prompts to exercise it?  → invoke vercel-plugin:benchmark-testing   gate: isolated test project directories with the plugin installed exist
  ├─ about to check how this plugin behaves on real world projects against actual conversation logs rather than synthetic test scenarios?  → invoke vercel-plugin:plugin-audit   gate: a coverage gap or cache staleness report from real conversation logs exists
  ├─ about to ship a new version of this plugin itself?  → invoke vercel-plugin:release   gate: gates pass and the version bump commit is pushed
  ├─ about to run a live terminal session to verify hook behavior, skill injection, dedup correctness, and coverage for this plugin?  → invoke vercel-plugin:vercel-plugin-eval   gate: a structured coverage report from the live session exists
  ├─ hitting a login or protection page instead of real content while trying to reach a protected preview or production url?  → invoke vercel-plugin:access-protected-vercel-deployment   gate: the protected deployment responds with real content instead of 401 or 403
  ├─ about to configure model routing, provider failover, or cost tracking across multiple ai providers through one unified endpoint?  → invoke vercel-plugin:ai-gateway   gate: requests flow through the unified provider routing endpoint
  ├─ about to build an ai powered feature like chat generation, structured output, tool calling, or streaming into an app?  → invoke vercel-plugin:ai-sdk   gate: the feature streams tokens and calls tools through the shared ai library
  ├─ about to build a new resumable process that must survive restarts, pause for external events, or retry on failure?  → invoke vercel-plugin:upstream   gate: the process resumes correctly after a simulated restart
  ├─ about to implement user sign in and sign up for a web application?  → invoke vercel-plugin:auth   gate: sign in and sign up flows work through the configured identity provider
  ├─ setting up or repairing a repository that depends on linked databases, identity providers, or other managed integrations?  → invoke vercel-plugin:bootstrap   gate: linking, environment pulls, and first run dev commands complete without manual steps
  ├─ debugging why a deployment serves stale content or shows an unexpected cache hit rate?  → invoke vercel-plugin:cdn-caching   gate: the per request cache reason and prerender state are identified
  ├─ about to build a bot that must work across slack, telegram, discord, or another chat platform from one codebase?  → invoke vercel-plugin:chat-sdk   gate: the bot is implemented with a shared adapter based chat library
  ├─ about to deploy, promote, roll back, or inspect a build, or configure a continuous integration pipeline definition file?  → invoke vercel-plugin:deployments-cicd   gate: the deployment or ci pipeline completes in the expected state
  ├─ working with dotenv files, command line environment pulls, oidc tokens, or environment specific configuration values?  → invoke vercel-plugin:env-vars   gate: the configuration value is present in the correct deployment environment
  ├─ creating, editing, or debugging a durable ai agent that needs a filesystem first runtime with durable sessions?  → invoke vercel-plugin:eve   gate: the agent session persists across a restart using the durable runtime
  ├─ starting a new session that may rely on outdated knowledge of current platform products?  → invoke vercel-plugin:knowledge-update   gate: the session context reflects the corrected or newly introduced products
  ├─ an app needs an external capability like commerce or storage with no dedicated skill already covering it?  → invoke vercel-plugin:marketplace   gate: the integration is installed and managed through a dedicated command line tool
  ├─ splitting an app across teams or composing multiple frontends under one deployment?  → invoke vercel-plugin:microfrontends   gate: cross app routing between the split zones works
  ├─ implementing partial prerendering, a cache directive, cache lifetimes, or cache tags, or migrating away from an older caching api?  → invoke vercel-plugin:next-cache-components   gate: the route uses the newer cache primitives instead of the deprecated caching api
  ├─ scaffolding or editing a production grade turborepo monorepo saas starter project?  → invoke vercel-plugin:next-forge   gate: the change respects the repo workspace package boundaries
  ├─ about to upgrade the app router framework to a newer major version?  → invoke vercel-plugin:next-upgrade   gate: the official codemods have been run and the migration guide steps are complete
  ├─ building, debugging, or architecting an app router based react application meant to deploy on this platform?  → invoke vercel-plugin:nextjs   gate: the routing or server component pattern matches app router conventions
  ├─ just finished editing multiple tsx component files?  → invoke vercel-plugin:react-best-practices   gate: a condensed quality checklist covering structure, hooks, accessibility, and performance has run
  ├─ intercepting a request before the cache layer for rewrites, redirects, or personalization at the platform level?  → invoke vercel-plugin:routing-middleware   gate: the interception runs before the cache layer as expected
  ├─ needing a per region ephemeral key value store with tag based invalidation shared across functions and builds, beyond what the framework level cache already covers?  → invoke vercel-plugin:runtime-cache   gate: the cached value is invalidated correctly by its tag
  ├─ initializing a component library, adding a pre built ui component, or building a custom design system registry with tailwind css?  → invoke vercel-plugin:shadcn   gate: the component installs cleanly through the command line tool into the project
  ├─ configuring the bundler, optimizing hot module reload, or debugging a build issue tied to the newer rust based bundler option?  → invoke vercel-plugin:turbopack   gate: the build or hot reload behavior is confirmed under the new bundler
  ├─ configuring ai powered pull request review or incident investigation tooling for the platform?  → invoke vercel-plugin:vercel-agent   gate: the review or investigation tool is installed and analyzing real prs or incidents
  ├─ deploying, managing configuration values, linking a project, or querying logs and metrics from the command line?  → invoke vercel-plugin:vercel-cli   gate: the command line action completes against the linked project
  ├─ wiring up scoped third party api access such as a chat platform, a code host, or a remote tool server on behalf of an app or user?  → invoke vercel-plugin:vercel-connect   gate: a scoped access token is obtained through the platform identity layer
  ├─ configuring platform level security like custom firewall rules, ip blocking, rate limiting, or responding to an active attack?  → invoke vercel-plugin:vercel-firewall   gate: the security rule is active and applied to matching requests
  ├─ configuring, debugging, or optimizing serverless or edge compute, cron jobs, or fluid compute behavior?  → invoke vercel-plugin:vercel-functions   gate: the function runs with the intended runtime and streaming configuration
  ├─ about to execute untrusted user generated or ai generated code and need strong isolation?  → invoke vercel-plugin:vercel-sandbox   gate: the code runs inside an ephemeral isolated micro vm
  ├─ composing a multi service application in one project with service targeted rewrites or bindings?  → invoke vercel-plugin:vercel-services   gate: the service definitions and bindings are declared in the project configuration
  ├─ choosing or configuring blob storage, a managed key value config store, or partner hosted database and cache storage for an app?  → invoke vercel-plugin:vercel-storage   gate: data reads and writes succeed against the chosen storage backend
  ├─ the user reports something is not working, or a dev server just started, and the full flow needs an end to end check?  → invoke vercel-plugin:verification   gate: the flow is confirmed working from browser through api and data to response
  ├─ building a long running api route or agent that needs crash safe, step based orchestration with pause and resume?  → invoke vercel-plugin:workflow   gate: the route or agent completes its steps correctly after a crash and resume
```

**Drift:** every route above targets `vercel-plugin:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **vercel-plugin** (https://github.com/vercel-labs/vercel-plugin). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
