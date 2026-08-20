# FLOW.md: microsoft/azure-skills

> Routes all 37 skills from `microsoft/azure-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ starting from a bare AKS cluster and need AI Runway installed end to end to serve a model?  → invoke azure:airunway-aks-setup   gate: AI Runway is running a model on the cluster
  ├─ shipping a webapp and need production visibility into requests, exceptions, and performance?  → invoke azure:appinsights-instrumentation   gate: the App Insights SDK is installed and telemetry configuration is in place
  ├─ building a feature that needs full text search, speech conversion, or document data extraction?  → invoke azure:azure-ai   gate: the AI Search, Speech, or Document Intelligence call returns results
  ├─ about to front AI models or MCP tools with a governance or gateway layer?  → invoke azure:azure-aigateway   gate: the APIM AI Gateway policy is applied and the backend responds
  ├─ about to start Azure infrastructure work before checking if the app is deployment ready?  → invoke azure:azure-app-onboard-prereq   gate: a prerequisite readiness report exists covering build health and dependencies
  ├─ taking an app or idea all the way to a running Azure deployment in one flow?  → invoke azure:azure-app-onboard   gate: a cost estimate was approved before the deployment ran
  ├─ holding a validated prepare-plan.json and scaffold-manifest.json ready to execute against Azure?  → invoke azure:deploy   gate: deploy-result.json is written to the session folder
  ├─ about to map app components to specific Azure services with cost and quota checks?  → invoke azure:prepare   gate: prepare-plan.json is written to the session folder
  ├─ have an architecture plan and need generated infrastructure code before any deployment?  → invoke azure:scaffold   gate: scaffold-manifest.json exists and passed adversarial self review
  ├─ migrating a workload from another cloud provider onto Azure?  → invoke azure:azure-cloud-migrate   gate: a migration report and converted code exist for the source workload
  ├─ about to audit an Azure environment for compliance or security posture?  → invoke azure:azure-compliance   gate: an azqr scan report and Key Vault expiration check both completed
  ├─ provisioning or sizing a virtual machine or scale set on Azure?  → invoke azure:azure-compute   gate: a VM or VMSS SKU recommendation was produced before provisioning
  ├─ asked to explain, forecast, or reduce an Azure bill?  → invoke azure:azure-cost   gate: a cost breakdown or forecast with concrete numbers was produced
  ├─ an existing azure deployment-plan.md and infrastructure files are already on disk and ready to execute?  → invoke azure:azure-deploy   gate: azd up or terraform apply ran against the existing plan
  ├─ an Azure production service is failing or degraded and needs triage?  → invoke azure:azure-diagnostics   gate: a resource health or AppLens diagnostic finding names the root cause
  ├─ designing a multi-resource enterprise Azure topology across networking, identity, and security?  → invoke azure:azure-enterprise-infra-planner   gate: Bicep or Terraform is generated to match the WAF-aligned design
  ├─ planning or standing up a production AKS cluster from scratch?  → invoke azure:azure-kubernetes   gate: the Day-0 checklist is complete and the cluster SKU and networking are chosen
  ├─ checking whether an existing AKS Standard workload can move to AKS Automatic?  → invoke azure:azure-kubernetes-automatic-readiness   gate: a readiness report lists incompatibilities and generated fixes
  ├─ digging through large volumes of logs or telemetry to find a pattern or anomaly?  → invoke azure:azure-kusto   gate: a KQL query ran against the ADX cluster and returned results
  ├─ a message queue or event hub client is throwing connection or auth errors and needs SDK level debugging?  → invoke azure:azure-messaging   gate: the SDK connection or auth error is identified and resolved
  ├─ the project already uses azd, or the user explicitly asked for the azd workflow, and needs infrastructure scaffolded?  → invoke azure:azure-prepare   gate: azure.yaml, infrastructure files, and a Dockerfile exist for azd
  ├─ need to confirm quota or capacity is available before provisioning in a region?  → invoke azure:azure-quotas   gate: current quota usage against limits is reported for the target region
  ├─ reviewing whether a PaaS app can survive a zone or region failure?  → invoke azure:azure-reliability   gate: a reliability checklist with staged remediation steps was produced
  ├─ need to find or list what Azure resources already exist in a subscription?  → invoke azure:azure-resource-lookup   gate: a resource list was returned for the target subscription or group
  ├─ need a visual diagram of how resources in a resource group relate to each other?  → invoke azure:azure-resource-visualizer   gate: a Mermaid diagram of the resource group was generated
  ├─ deciding where and how to persist files, objects, or structured data with the right cost tier?  → invoke azure:azure-storage   gate: a storage service and tier were selected and justified for the data pattern
  ├─ moving an Azure workload to a newer plan, tier, SKU, or SDK version?  → invoke azure:azure-upgrade   gate: the workload runs on the new plan, tier, or SDK version
  ├─ about to deploy to Azure and need a final readiness check first?  → invoke azure:azure-validate   gate: a preflight check confirms config, RBAC, and identity permissions pass
  ├─ an autonomous agent needs its own Entra identity and token exchange setup?  → invoke azure:entra-agent-id   gate: an Agent Identity Blueprint and its token exchange configuration exist in Entra
  ├─ an application needs to authenticate against Microsoft Entra ID for the first time?  → invoke azure:entra-app-registration   gate: an app registration exists with the required API permissions and a working MSAL sign-in
  ├─ building and shipping a Foundry hosted agent through its full lifecycle?  → invoke azure:microsoft-foundry   gate: agent.yaml exists and the agent deployed and passed an evaluation run
  ├─ training a custom model variant with supervised, preference, or reinforcement fine tuning?  → invoke azure:finetuning   gate: a training job completed and the resulting model was deployed and evaluated
  ├─ need to deploy an Azure OpenAI model and unsure whether to go quick or fully custom?  → invoke azure:deploy-model   gate: the model deployment exists and is callable in the target region
  ├─ need to know which region has capacity before deploying an Azure OpenAI model?  → invoke azure:capacity   gate: a capacity comparison across regions names a recommended location
  ├─ deploying an Azure OpenAI model and need to control every setting step by step?  → invoke azure:customize   gate: the deployment reflects the explicitly chosen version, SKU, capacity, and content filter policy
  ├─ want the fastest reasonable Azure OpenAI deployment without manually comparing regions?  → invoke azure:preset   gate: the model deployed automatically to the best available region
  ├─ deploying a Flask, Django, or FastAPI app specifically to Azure App Service on Linux?  → invoke azure:python-appservice-deploy   gate: the Python app responds live on its App Service Linux URL
```

**Drift:** every route above targets `azure:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **azure** (https://github.com/microsoft/azure-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
