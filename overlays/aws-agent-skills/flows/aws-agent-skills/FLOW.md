# FLOW.md: itsmostafa/aws-agent-skills

> Routes all 18 skills from `itsmostafa/aws-agent-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ exposing an HTTP surface, or is a request failing before it ever reaches the handler?  → invoke aws-agent-skills:api-gateway   gate: the route, integration and authorizer are configured
  ├─ invoking a foundation model, or building retrieval on top of one?  → invoke aws-agent-skills:bedrock   gate: model access is configured and the call returns
  ├─ should this infrastructure be declared as a template rather than clicked into existence?  → invoke aws-agent-skills:cloudformation   gate: the stack deploys from the template with no drift
  ├─ setting up alarms and dashboards, or querying logs to find where something failed?  → invoke aws-agent-skills:cloudwatch   gate: the alarm fires on a real condition, or the query returned the failure
  ├─ does the application need user sign-in, pools, or a social identity provider?  → invoke aws-agent-skills:cognito   gate: the sign-in flow completes end to end
  ├─ designing keys and indexes for a NoSQL table, or chasing a slow access pattern on one?  → invoke aws-agent-skills:dynamodb   gate: the access patterns are listed and the key design serves them
  ├─ launching, resizing or automating virtual machines and their storage?  → invoke aws-agent-skills:ec2   gate: the instance is reachable with its security group scoped
  ├─ running containers as a managed service, with task definitions?  → invoke aws-agent-skills:ecs   gate: the service is running its desired count
  ├─ running Kubernetes, with node groups and workload identity?  → invoke aws-agent-skills:eks   gate: the cluster serves workloads with roles bound
  ├─ routing events between services, or scheduling something to fire on its own?  → invoke aws-agent-skills:eventbridge   gate: the rule matches the event pattern it is meant to
  ├─ writing a policy, granting cross-account access, or debugging a denied call?  → invoke aws-agent-skills:iam   gate: the permission is scoped and the denial resolved
  ├─ running code on an event, with no server to manage?  → invoke aws-agent-skills:lambda   gate: the function is invoked by its trigger and returns
  ├─ provisioning or tuning a managed relational database?  → invoke aws-agent-skills:rds   gate: reachable, with backups and replicas as intended
  ├─ storing objects, serving them, or setting lifecycle and replication rules?  → invoke aws-agent-skills:s3   gate: the bucket policy grants exactly the access intended
  ├─ storing a credential that ought to rotate rather than be pasted somewhere?  → invoke aws-agent-skills:secrets-manager   gate: the secret is retrieved by the app and rotation is configured
  ├─ fanning one message out to many subscribers?  → invoke aws-agent-skills:sns   gate: the topic delivers to its subscriptions with filtering as intended
  ├─ decoupling two services with a queue, or handling messages that keep failing?  → invoke aws-agent-skills:sqs   gate: the queue drains and failures land in a dead-letter queue
  ├─ orchestrating several steps with retries and branching, as one workflow?  → invoke aws-agent-skills:step-functions   gate: the state machine completes and its failures are handled
```

**Drift:** every route above targets `aws-agent-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **aws-agent-skills** (https://github.com/itsmostafa/aws-agent-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
