# Charta Health: Technical Internals, Implementation, and Operations

Scope and identity check: these notes cover Charta Health, Inc. (chartahealth.com), 600 Harrison Street Suite 110, San Francisco. It was founded in 2023 by Justin Liu (CEO) and Scott Morris (CTO), both formerly of Rockset, and is backed by Bain Capital Ventures. It is not "Carta Healthcare", a different company that shows up in search results. Research date: 2026-10-19. Each source is dated where the date was known.

Method note: job data comes from Charta's public Ashby job-board API at https://api.ashbyhq.com/posting-api/job-board/chartahealth?includeCompensation=true, which listed 19 open postings published between 2026-07-16 and 2026-09-30. Closed postings come from mirrors on the Madrona board, Built In, and freehire. All 136 pages in Charta's sitemap (https://www.chartahealth.com/sitemap.xml) were downloaded and read on 2026-10-19. The "observed" infrastructure findings come from public DNS records and the publicly served front-end bundles of app.chartahealth.com, retrieved on 2026-10-19. They are direct observations, not company statements.

---

## 1. Job postings: roles, tech stack, integration standards, model providers, and what they reveal about the workflow

### Takeaway
Charta runs on Palantir-style forward deployment. Forward-deployed engineers (FDEs) and "deployment strategists" build a custom EHR integration and custom AI "analyses" for each customer. Engineering is organized into pods that own specific accounts. The disclosed stack is Python, TypeScript and Node.js, Next.js/React, PostgreSQL, Docker, ECS/Kubernetes, and AWS. A closed AI-engineer posting adds fine-tuning, RAG and vector search, multi-agent orchestration and LLM evaluation tooling. No posting names a specific LLM vendor. FHIR and HL7 appear only as "nice to have" skills. Current postings describe a push to turn bespoke customer builds into a reusable platform and APIs.

### Cited Findings
**Open roles as of 2026-10-19 (19 postings, all San Francisco)**
- The open roles are: Staff Product Manager, Senior Product Manager, Forward Deployed AI Engineer, Software Engineer (Senior), Software Engineer (Staff), Tech Lead Manager, Software Engineer (FDE / Platform) Intern, Customer Engineer, Technical Success Manager, Technical Program Manager, Deployment Strategist, Payer Partnerships Lead (Value-Based Care), Enterprise SDR, SDR Manager, Account Executive, Sales Director, Product Marketing Manager, Content Strategist and Brand Designer — [Ashby job-board API](https://api.ashbyhq.com/posting-api/job-board/chartahealth?includeCompensation=true)
- None of the open postings is for a certified coder or clinical reviewer. The only coding-credentialed staff visible publicly are "CPC and CRC-certified engineers" and blog authors with "CPC" after their names, such as Rachel Lee, Will Mallonee and Taher Khambati — [Ashby API](https://api.ashbyhq.com/posting-api/job-board/chartahealth?includeCompensation=true); [Charta payer page](https://www.chartahealth.com/payer); [Charta blog, Rachel Lee CPC, 2026-07-09](https://www.chartahealth.com/resources/how-to-get-an-rcm-tool-approved-and-live-before-fall)
- The boilerplate company description in the postings reads: "We're building the operating system for modern healthcare organizations. Our AI platform streamlines critical workflows across revenue cycle, clinical operations, and administrative functions, helping providers and payers…" — [Staff Product Manager posting, published 2026-07-29](https://jobs.ashbyhq.com/chartahealth/0e2b8e22-e7d0-4ed8-9d19-0e60f599de27)

**Disclosed tech stack**
- The Senior and Staff Software Engineer and Tech Lead Manager postings ask for "Fluent in one or more backend languages such as Python, Node.js, Java or C/C++. Next.js and/or React experience is a plus", "Experience building, testing and deploying microservices", "Distributed systems development experience", and "Experience with AWS, PostgreSQL, Docker and ECS/Kubernetes is a plus." They also mention "modern generative AI technologies, including both proprietary and open-source large language models" — [Senior SWE, 2026-07-23](https://jobs.ashbyhq.com/chartahealth/8b09b002-9ff1-4209-8291-7673a1e51146); [Staff SWE, 2026-07-23](https://jobs.ashbyhq.com/chartahealth/445c6835-dc8e-4d66-997f-cb0052137938); [Tech Lead Manager, 2026-09-30](https://jobs.ashbyhq.com/chartahealth/50864962-2ba6-40fd-bfa4-afb9d4b98229)
- The intern posting asks for "Python and TypeScript" and says the work includes "core platform systems that power analyses, data pipelines, and AI workflows across all customers" and "reusable components that turn one-off solutions into durable product capabilities" — [SWE (FDE/Platform) Intern, 2026-08-27](https://jobs.ashbyhq.com/chartahealth/0c76d54d-0ca8-4ab6-b360-c2dbae7b17cf)
- The Customer Engineer posting asks candidates to be comfortable "reading code (Python and/or TypeScript), writing SQL, working through logs and data pipelines, and using AI coding tools." Nice-to-haves are "EHR/EMR integrations (HL7, FHIR, or vendor APIs), medical coding, or risk adjustment", "data pipelines, workflow orchestration, or ETL systems", "debugging LLM- or ML-driven products, including evaluating model output and prompt behavior", and "cloud infrastructure (AWS), observability tools" — [Customer Engineer, 2026-09-25](https://jobs.ashbyhq.com/chartahealth/92849d59-cbcc-4d37-b9a8-18f1fb374f58)
- The Deployment Strategist posting lists, as a nice-to-have only: "worked in healthcare, especially with provider systems, data standards (FHIR, HL7)" — [Deployment Strategist, 2026-07-16](https://jobs.ashbyhq.com/chartahealth/8c131996-3e35-4b66-bc1c-0dcf6785ca30)
- The Forward Deployed AI Engineer posting lists "Proficiency in Python" and "Experience with Large Language Models (LLMs) and prompt engineering" as nice-to-haves, at $90K–$140K — [FDE posting, 2026-07-23](https://jobs.ashbyhq.com/chartahealth/3088555d-de93-4236-add1-41005bf0933b)
- Internal tooling named in postings: Linear ("sources of truth (Linear, program reviews)"), Salesforce CRM, and Webflow plus Figma for the marketing site — [Technical Program Manager, 2026-09-30](https://jobs.ashbyhq.com/chartahealth/6f8fa9a2-cd35-491b-a8ab-5e9c0d09398a); [Account Executive](https://jobs.ashbyhq.com/chartahealth/d368ddbb-f72a-4871-b4db-ff50519d97b0); [Brand Designer, 2026-08-07](https://jobs.ashbyhq.com/chartahealth/bc8cf02e-4d9c-4854-a5fe-4a77a607d001)

**Closed or archived AI-engineering posting (the most technical document found)**
- The "Senior/Staff AI Engineer" posting is closed and shows as "6+ months ago" on 2026-10-19. It describes leading "a production medical-coding engine that assigns ICD-10, HCC, CDPS, and CRG codes", covering the model lifecycle "from labeling clinical data to serving high-throughput inference for value-based-care workflows". Its listed responsibilities are:
  - a "fine-tuning platform" with data pipelines, hyperparameter search and automated validation "to adapt foundation models to specialized domains"
  - automated evals (unit, regression, bias/robustness) plus "human-in-the-loop review workflows"
  - retrieval using "vector search, hybrid ranking, and metadata-aware indexing"
  - LLM "tool use, multi-agent orchestration, and function-calling chains"
  - MLOps covering data versioning, containerized training and a model registry
  - "GCP, AWS, or Azure"

  Nice-to-haves are Phoenix, Langfuse or LangSmith for evaluation and observability; Temporal, LangGraph or LangChain for orchestration; and FHIR, HL7 and claims/EHR data. Pay was $150K–$250K — [Madrona job board mirror](https://jobs.madrona.com/companies/charta-health/jobs/54875707-senior-staff-ai-engineer)
- "Senior / Staff Forward Deployed AI Engineer" (Req R12, closed, SF or NYC, $150K–$250K plus a bonus of up to 30%) asked for at least 4 years of experience and LLM/prompt-engineering interest. It names no specific stack — [Madrona job board mirror](https://jobs.madrona.com/companies/charta-health/jobs/68282470-senior-staff-forward-deployed-ai-engineer)
- "Software Engineer (NYC)" ($150K–$210K) carried the same AWS/PostgreSQL/Docker/ECS/Kubernetes stack line. Built In shows it was removed on 2026-05-16 — [Built In NYC](https://www.builtinnyc.com/job/software-engineer-nyc/9376013)
- An FDE listing also appeared on Harvard career services, dated July 2025 according to the search snippet. I did not fetch it — [Harvard FAS career services](https://careerservices.fas.harvard.edu/jobs/charta-health-forward-deployed-ai-engineer/)

**What the postings reveal about operations**
- Each customer account belongs to a specific engineering pod. The Customer Engineer posting says: "Every account is mapped to an owning engineering pod, so you will always know where an escalation goes." The TSM posting says TSMs route "deployment issues to oncall and product gaps to the owning pod" — [Customer Engineer](https://jobs.ashbyhq.com/chartahealth/92849d59-cbcc-4d37-b9a8-18f1fb374f58); [Technical Success Manager, 2026-08-19](https://jobs.ashbyhq.com/chartahealth/9754fa43-7399-4305-bf6d-933ca71b9818)
- The Tech Lead Manager manages "a team of up to five engineers" per pod and is expected to spend "a meaningful share of your time writing code" — [Tech Lead Manager](https://jobs.ashbyhq.com/chartahealth/50864962-2ba6-40fd-bfa4-afb9d4b98229)
- The Customer Engineer posting lists typical failure modes: "a chart that wasn't processed, a code that didn't appear, an integration that stopped sending data, an output that doesn't match what the clinician documented." Tier-1 work is to "Fix configuration, mapping, and data issues directly; re-run failed jobs; correct customer-specific setup; and answer 'did Charta do this?' questions with a definitive, evidence-backed yes or no." Issue classes include "unexpected model output." The posting also notes "healthcare data demands care… follow access and privacy practices" — [Customer Engineer](https://jobs.ashbyhq.com/chartahealth/92849d59-cbcc-4d37-b9a8-18f1fb374f58)
- The TSM posting says "Onboarding runs on documentation, not shadowing - new TSMs carry their own book of accounts within their first 30 days." TSMs run QBRs and own renewals and expansion — [Technical Success Manager](https://jobs.ashbyhq.com/chartahealth/9754fa43-7399-4305-bf6d-933ca71b9818)
- The TPM supports "customer implementations across multiple concurrent accounts — track delivery health across pods… surface at-risk go-lives before they slip." The TPM also helps run programs for "evaluation, onboarding, quality" and translates "complex technical and clinical status" for others — [Technical Program Manager](https://jobs.ashbyhq.com/chartahealth/6f8fa9a2-cd35-491b-a8ab-5e9c0d09398a)
- The Deployment Strategist leads "technical discovery during sales… scoping integrations," and after signature leads "onboarding, drive implementation design." The role pays $170K–$250K — [Deployment Strategist](https://jobs.ashbyhq.com/chartahealth/8c131996-3e35-4b66-bc1c-0dcf6785ca30)
- The platform push: the Senior PM posting says "We have a product motion that's working. The next phase is scale… building the platform, APIs, and internal tooling that take us from a handful of customers to hundreds, then thousands, without a linear increase in engineering and deployment effort". It also mentions "the legacy systems, data formats, and workflows our customers already run on." The Staff PM ("As our first PM") will "Define business models, pricing packages, and commercial standards for platform and API-driven offerings" and "Make build-vs-buy and build-vs-partner calls on infrastructure and integrations" — [Senior PM, 2026-07-16](https://jobs.ashbyhq.com/chartahealth/cdc427d4-3d93-4791-86db-abc4ec64196e); [Staff PM, 2026-07-29](https://jobs.ashbyhq.com/chartahealth/0e2b8e22-e7d0-4ed8-9d19-0e60f599de27)
- Payer expansion: a "Payer Partnerships Lead (Value-Based Care)" sells to health plans ($150K–$200K base, $300K–$400K OTE) — [Ashby posting, 2026-07-16](https://jobs.ashbyhq.com/chartahealth/77b1ed5b-8750-4fca-a362-4a22ab69d807)
- Work is in-person five days a week in San Francisco (SoMa); some postings also mention an NYC office — [Staff PM](https://jobs.ashbyhq.com/chartahealth/0e2b8e22-e7d0-4ed8-9d19-0e60f599de27); [Senior PM](https://jobs.ashbyhq.com/chartahealth/cdc427d4-3d93-4791-86db-abc4ec64196e)
- ATS: Charta uses Ashby under two slugs. The current board is `chartahealth`; an older `charta-health` board hosts the Security Reliability Engineer and Staff SWE links — [Ashby, current](https://jobs.ashbyhq.com/chartahealth/3088555d-de93-4236-add1-41005bf0933b); [Ashby, older slug](https://jobs.ashbyhq.com/charta-health/6b71a01f-a8c7-4fb3-a9e5-7394469cf14e)

### Inferences
- The integration, deployment and support roles (FDE, deployment strategist, customer engineer, TSM, pods) outnumber pure ML roles among open postings. This suggests the hard part of delivery is per-customer integration and configuration, not model training. The current ML roadmap is not public; the only detailed ML posting is closed.
- The CDPS and CRG codes in the AI-engineer posting are Medicaid risk-adjustment and grouping schemes. ICD-10 and HCC are Medicare Advantage risk adjustment. Together with the payer product line (section 7), this suggests a value-based-care and Medicaid coding engine was built or planned alongside the fee-for-service E/M and CPT coding product.
- The lack of coder or clinical-reviewer job postings, combined with the case study where "a team of human reviewers" vets AI-cited HCC codes (section 3), suggests human QA is done by credentialed in-house staff or by customers' own coders. I could not tell which, or how large the team is.
- "Proprietary and open-source large language models" in the postings suggests a multi-model or vendor-agnostic approach. The provider is not disclosed anywhere.

### Gaps
- No posting, current or archived, names a model provider (OpenAI, Anthropic, Google, AWS Bedrock, and so on) or a specific open-source model.
- I found no Greenhouse, Lever, Wellfound or YC Work at a Startup postings. Charta appears to use Ashby only, and no source reviewed shows a YC affiliation.
- I could not find a posting for a medical coder or clinical reviewer, so I cannot size or describe the human QA staff.
- The exact posting dates of the closed AI-engineer and Senior/Staff FDE roles are not shown on the mirror; it says only "6+ months ago."

---

## 2. Implementation: how a customer goes live, what the customer provides, timeline, and customization

### Takeaway
Charta's published process has eight steps: discovery, then a BAA and MNDA, scoping, contracting, a custom EHR integration, building "analyses" and "audit modules", a test batch with feedback, and go-live. The company says primary care, urgent care and behavioral health customers can go live in "as little as eight weeks." Building the analyses alone takes 2–8 weeks. Every integration is custom to the customer's EHR instance, including homegrown EMRs. Output is written back to the EHR or routed to work queues, and the customer chooses the level of human oversight. The integration method itself is not disclosed (API, FHIR, HL7, SFTP or browser automation). An intern blog mentions "agentic workflows to retrieve clinical documentation from electronic medical records systems."

### Cited Findings
**Published implementation steps** ([Charta "AI chart review: A buyer's guide", 2026-03-30](https://www.chartahealth.com/resources/ai-chart-review-buyers-guide))
- Timeline: "For primary care, urgent care, and behavioral health groups, getting from an initial discovery call to a live and fully operational implementation can take as little as eight weeks."
- Step 1, Discovery: "If there's a fit for your practice, we'll move to signing a BAA and MNDA."
- Step 2, Scoping: "You'll meet with a Charta implementations specialist to show us how your team has configured your EHR. A billing specialist from your practice will also guide us through your current workflows coding and billing." The call also covers chart review for payer compliance, provider performance and clinical quality.
- Step 3, Contracting: an initial scope of work with a timeline.
- Step 4, EHR integration: "our team will build a custom integration that adapts to the ways you've configured and use your specific instance of your EHR."
- Step 5, Analyses and workflow: "Charta configures chart review using two components: analyses and audit modules… Analyses are organized into audit modules, which are sets of analyses that you want to run simultaneously on a certain type of note. You can choose from our library of analyses built for similar practices, or work with your AI engineer to design additional analyses… typically between two and eight weeks." Analyses range from simple checks (timely provider signature) to complex ones (medical necessity given age and family history).
- Step 6, Feedback: "After our team is finished building and training your custom-designed AI chart review model, we'll test it with a batch of sample charts," then gather stakeholder feedback on "adjustments or additional training".
- Step 7, Go-live: they "shift from the testing environment to a fully live implementation… across your entire patient encounter population."

**A second published timeline (60-day framing)** ([Charta blog, Rachel Lee CPC, 2026-07-09](https://www.chartahealth.com/resources/how-to-get-an-rcm-tool-approved-and-live-before-fall))
- "Step 4: Get It Live (Week 4-8)" lists "EHR integration and chart access setup; Initial coding analysis and baseline benchmarking; Provider feedback loop configuration…; Go-live and first review cycle."
- The post claims a modern solution "runs on your existing charts and writes back to your EHR; it doesn't require a new workflow, a new system, or significant time from your clinical team", and that vendors "will work with you on payment timing."

**Customization and staffing model**
- "Every Charta implementation is built and maintained by a dedicated, CPC-certified AI engineer who customizes the integration to each practice's workflows and remains available to update the model as payer mix, payer rules, CMS guidelines, and state requirements change" — [Charta "Top 10 AI medical coding tools", 2026-07-31](https://www.chartahealth.com/resources/ai-medical-coding-tools-rcm-guide)
- On the FDE model, Charta writes that engineers "train LLM models to adapt AI chart review capabilities to local documentation realities", "train an AI model on your clinical data, integrating and updating coding guidelines and your organization's payer policies", and "retrain the model on a specific language pattern or coding problem." The post lists "Connecting legacy systems that resist simple API integrations" as a reason for FDE — [Charta blog "Forward-deployed engineering", 2026-04-10](https://www.chartahealth.com/resources/forward-deployed-engineering)
- "Customized integration also means your team gets to decide which decisions the system can make on its own, and which require human-in-the-loop review." For eCW, the AI "reads notes directly from eClinicalWorks as soon as a provider closes it, then pushes corrected or validated codes back into the billing workflow" — [Charta eCW guide](https://www.chartahealth.com/resources/ai-medical-coding-tool-eclinicalworks)
- In the home health case, the engine was "trained on the Medicare Benefit Policy Manual". "The provider could adjust the strictness by clinical element (e.g. skilled need or medication education) to match their own internal standards" — [Case study: optimizing clinical compliance (HomeCare HomeBase)](https://www.chartahealth.com/case-studies/optimizing-clinical-compliance)
- In the behavioral health case: "Charta's engineers built an integration with the practice's homegrown EMR, then custom-designed a dozen chart analyses… Charta automatically ran the 12 bespoke analyses every time a provider closed a note." Provider feedback messages are delivered "directly in the EMR." The customer produces more than 120,000 charts a month across 12,000 providers — [Case study: documentation compliance at nationwide scale](https://www.chartahealth.com/case-studies/documentation-compliance-nationwide-scale)
- An early proof point: per Bain Capital Ventures, a large primary care group said a prototype was built in about six days ("something I didn't know was possible in six days") — [BCV, 2025-07-22](https://baincapitalventures.com/insight/charting-a-new-era-how-charta-health-is-transforming-medical-chart-review/)

**Data access and integration mechanics (what is disclosed)**
- "Charta has successfully integrated with dozens of commercial and EHRs, as well as homegrown EMRs. If your practice uses a commercial EHR, it's likely we've already built an integration for it" — [Charta AI chart review FAQ](https://www.chartahealth.com/ai-chart-review)
- On athenahealth, Charta says a real integration should "connect through this marketplace [athenahealth Marketplace]" and "maintain ongoing API compatibility". In a true integration, the AI "reads clinical documentation directly from athenahealth, autonomously codes the note… and pushes accurately coded charts back into the billing" workflow — [Charta athenahealth guide](https://www.chartahealth.com/resources/ai-coding-tools-athenahealth-2026). Charta also says its "athenahealth integration is always custom-built for athenahealth users" — [Charta RCM tools guide, 2026-07-31](https://www.chartahealth.com/resources/ai-medical-coding-tools-rcm-guide)
- On ModMed (dermatology): "Built around your ModMed workflow, not on top of it. Charta works between the signed note and the claim… Your team doesn't have to log into another platform." The page also says "Charta's CPC-certified team translates your audit checklist into an autonomous AI engine" — [Charta dermatology page](https://www.chartahealth.com/for/dermatology)
- Intern posts describe the integration work directly. One says: "developing EMR integration workflows, scaling a note ingestion process from 720 to 4,000 notes a day" (Vibhor Gautam, FDE intern) — [Charta blog, 2026-04-24](https://www.chartahealth.com/resources/building-with-trust-interning-at-charta). Another: "I worked on building standardized agentic workflows to retrieve clinical documentation from electronic medical records systems and designed features to automate billing reconciliations directly within the EMR", and "custom EHR integrations" (Samantha Mac) — [Charta blog, 2026-04-24](https://www.chartahealth.com/resources/speed-and-structure-interning-at-charta)
- Charta's privacy policy (last updated June 1, 2025) says it collects data "provided by you to the Services whether directly by transferring such files, or indirectly by granting Charta access to your third party accounts where such files are stored". It also collects "user IDs, passwords… required for authentication and access to our users' accounts" — [Charta privacy policy](https://www.chartahealth.com/legal/privacy-policy)

**How results are delivered after go-live**
- Routing options: Charta "routes corrections via autocorrect in the EHR, automated provider notes, or a billing work queue, depending on how much human oversight a practice wants" — [Charta RCM tools guide, 2026-07-31](https://www.chartahealth.com/resources/ai-medical-coding-tools-rcm-guide). The autonomous coding page says Charta can "autonomously code every note, autocorrect coding mistakes directly in your EHR, or queue problem charts for human-in-the-loop intervention" — [Autonomous coding page](https://www.chartahealth.com/solutions/autonomous-coding)
- Reported latency:
  - In a 20+ clinic FQHC on athenahealth, it "audited roughly tens of thousands of charts a month… results were returned to the billing team within 24 hours" — [FQHC case study](https://www.chartahealth.com/case-studies/capturing-revenue-and-ensuring-compliance-for-a-20-clinic-fqhc-in-south-florida)
  - For home health: "Every chart is now reviewed within five minutes of submission" — [Home health case study](https://www.chartahealth.com/case-studies/optimizing-clinical-compliance)
  - The FQHC segment page says "within 24 hours of a patient note closing" — [FQHC page](https://www.chartahealth.com/for/fqhc)
- Inputs read: "structured EHR fields, narrative text, fax attachments, referral notes" — [Charta blog, 2026-05-27](https://www.chartahealth.com/resources/ai-chart-review-back-office-tech-stack). Also "handwritten notes, faxes, and images" — [AI chart review FAQ](https://www.chartahealth.com/ai-chart-review)

**EHRs and practice-management systems named in Charta case studies or pages**
- athenahealth (athenaOne): [FQHC case study](https://www.chartahealth.com/case-studies/capturing-revenue-and-ensuring-compliance-for-a-20-clinic-fqhc-in-south-florida); [primary care case study](https://www.chartahealth.com/case-studies/automated-revenue-discovery-primary-care)
- eClinicalWorks: [neighborhood FQHC](https://www.chartahealth.com/case-studies/audit-proof-compliance-for-neighborhood-fqhc); [urgent care E/M lift](https://www.chartahealth.com/case-studies/em-lift-urgent-care)
- Experity: [urgent care case study](https://www.chartahealth.com/case-studies/audit-proof-compliance-urgent-care)
- HomeCare HomeBase: [home health case study](https://www.chartahealth.com/case-studies/optimizing-clinical-compliance)
- inSync by Qualifacts (Family Care Center): [FCC case study](https://www.chartahealth.com/case-studies/compliance-assurance-behavioral-health)
- A homegrown EMR: [behavioral health case study](https://www.chartahealth.com/case-studies/documentation-compliance-nationwide-scale)
- ModMed is claimed on the dermatology page, without a case study: [dermatology page](https://www.chartahealth.com/for/dermatology)
- On Charta's own site, Epic, Cerner/Oracle Health, NextGen and Meditech appear only in descriptions of competitors (for example CodaMetrix, Nym and XpertCoding), not as Charta integrations — [Charta RCM tools guide](https://www.chartahealth.com/resources/ai-medical-coding-tools-rcm-guide)

### Inferences
- Integration seems to be per-EHR and often bespoke. That covers the athenahealth Marketplace API, write-back into eCW and Experity billing workflows, a homegrown EMR, and "agentic workflows to retrieve clinical documentation." Charta likely combines vendor APIs with UI or browser automation where no API exists. The phrase "legacy systems that resist simple API integrations" and the privacy policy's reference to accessing customers' "third party accounts" fit credential-based access. Charta does not explicitly confirm RPA or browser automation.
- The note-ingestion figure (720 to 4,000 notes per day, about early 2026), set against claims of "tens of thousands of charts a month" for one FQHC and more than 120,000 a month for the behavioral health customer, suggests throughput was still being scaled per integration in early 2026.
- The "analyses / audit modules" abstraction, along with a "library of analyses built for similar practices", is the reusable product layer. The 2026 PM postings aim to productize more of the integration layer as well.
- The "8 weeks" figure is a best case for outpatient groups. The 2–8 week range for building analyses suggests a typical span of about 8–14 weeks from discovery for more complex customers. This is an inference, not a stated number.

### Gaps
- No source states whether Charta uses FHIR, HL7v2 feeds, SFTP batch extracts, read-only EHR user accounts, or RPA for any given EHR.
- I found no listing or partnership evidence for Epic Showroom, eCW, NextGen or ModMed marketplaces. The athenahealth listing page (athenaconnect.athenahealth.com/marketplace/product/charta) renders client-side, so its integration details could not be read.
- Pricing structure is not public (per chart, per provider or percentage of uplift), apart from mentions of "guaranteed ROI" and "payment timing" flexibility.
- I found no data on staffing per implementation, such as FDE hours per customer.

---

## 3. AI approach: LLMs vs. rules, accuracy, auditability, and human-in-the-loop

### Takeaway
Charta presents itself as LLM-first and explicitly contrasts that with "rules-based engines that rely on natural language processing and user-generated rules." In practice the system is a set of per-customer, LLM-driven "analyses" that encode the customer's audit checklist and payer policies. Every finding comes with reasoning and document citations. Human review is configurable for provider and fee-for-service customers and built in for payer risk adjustment, where human reviewers vet each AI-cited code. A closed job posting shows fine-tuning, RAG and vector search, multi-agent orchestration and an eval harness. All accuracy figures are self-reported, and no methodology or independent benchmark was found.

### Cited Findings
**Architecture and model approach (company statements)**
- "Charta's AI chart review solutions are based on the most advanced large language models (LLMs), which can review any type of clinical documentation, extract meaning, and run sophisticated, custom-designed analysis modules on each type note. Unlike rules-based engines that rely on natural language processing and user-generated rules, each Charta implementation is custom built to replicate the types of reviews you'd ask a human reviewer to conduct" — [Charta AI chart review page](https://www.chartahealth.com/ai-chart-review)
- "Charta's AI chart review platform uses large language models trained on clinical documentation to analyze every patient encounter as soon as a provider closes a note… evaluates it simultaneously against coding standards, payer-specific coder and documentation requirements, clinical documentation integrity guidelines, and clinical quality measures" — [Charta blog, 2026-05-27](https://www.chartahealth.com/resources/ai-chart-review-back-office-tech-stack)
- The Series A post (2025-07-22) refers to "Charta's proprietary engine" and says the founders built "distributed systems and applied machine learning frameworks" at Rockset, Google and Salesforce — [Charta Series A post](https://www.chartahealth.com/resources/series-a)
- Charta advises buyers to "ask how the vendor's LLM was trained. Generic LLMs will not reliably succeed at coding or documentation analysis unless they're trained on clinical documentation from your specialty" — [Charta athenahealth guide](https://www.chartahealth.com/resources/ai-coding-tools-athenahealth-2026)
- From the closed AI-engineer posting: the coding engine covers ICD-10, HCC, CDPS and CRG. The posting describes a fine-tuning platform to "adapt foundation models", "vector search, hybrid ranking, and metadata-aware indexing", "tool use, multi-agent orchestration, and function-calling chains", automated eval suites and "human-in-the-loop review workflows" — [Madrona mirror of Senior/Staff AI Engineer](https://jobs.madrona.com/companies/charta-health/jobs/54875707-senior-staff-ai-engineer)
- Payer workflow: "Charta's AI-enhanced approach to retrospective chart review combines LLM-enabled claims matching with deep AI analysis of chart documentation. Charta AI surfaces incremental and unsupported codes to a team of human reviewers, who vet each code against the AI citations" — [Payer case study](https://www.chartahealth.com/case-studies/maximizing-hcc-capture-audit-readiness)
- Smart Scan, the payer product, "can ingest charts, parse them by date of service, and identify every chart segment that contains high-strength evidence for an incremental HCC code… flags any incremental codes that lack sufficient evidence or that aren't linked to a face-to-face encounter" — [Charta blog, 2026-07-29](https://www.chartahealth.com/resources/smart-scan-for-retro-coding-vendor-evaluation). It "analyzes charts at ingestion to identify encounters, clinical evidence, potential HCC opportunities, and record gaps before coding begins" — [Clinical chart intelligence page](https://www.chartahealth.com/products/clinical-chart-intelligence)
- The retrospective risk adjustment page describes "LLM-powered intake and evidence-based coding" and "an auditable trail of clinical evidence for every code" — [Retrospective risk adjustment page](https://www.chartahealth.com/products/retrospective-risk-adjustment)

**Auditability and evidence**
- "Every AI decision is backed by detailed reasoning and document citations" — [Charta RCM tools guide, 2026-07-31](https://www.chartahealth.com/resources/ai-medical-coding-tools-rcm-guide)
- Clinical leads can "trace trends back to individual encounters, with visual citations of the clinical documentation and AI reasoning provided as evidence" — [Charta outpatient team guide](https://www.chartahealth.com/resources/ai-medical-chart-review-for-outpatient-practices-team-guide)
- Charta tells buyers that an AI coding tool must "generate a detailed audit trail showing which codes were suggested, which were modified, by whom, and when." This is buyer guidance, not an explicit description of Charta's own audit log — [Charta eCW guide](https://www.chartahealth.com/resources/ai-medical-coding-tool-eclinicalworks)
- The RADV product refers to an "AI-powered validation engine [that] surfaces the highest-confidence evidence" — [RADV audit management page](https://www.chartahealth.com/products/radv-audit-management)

**Human-in-the-loop**
- For providers, oversight is configurable: autonomous coding, EHR autocorrect, or a work queue — [Autonomous coding page](https://www.chartahealth.com/solutions/autonomous-coding)
- For payer retrospective review, "98% HCC coding accuracy resulting from Charta's combined approach of AI evidence recall and human-in-the-loop validation." Human coders "apply your team's specific coding guidelines to validate incremental HCCs and flag unsupported codes for deletion" — [Retrospective risk adjustment page](https://www.chartahealth.com/products/retrospective-risk-adjustment)
- In home health, QA staff "now focus exclusively on high-risk variances flagged by AI" — [Home health case study](https://www.chartahealth.com/case-studies/optimizing-clinical-compliance)
- Madrona says the system "flags issues and explains its reasoning" while keeping "clinicians in control"; per Madrona, humans give final approval — [Madrona, 2025-07-22](https://www.madrona.com/charting-healthcares-ai-transformation-investing-in-charta-health/)
- In the urgent care case on eCW, the coding team went "from a team of 4 medical coders to 1" — [Case study](https://www.chartahealth.com/case-studies/em-lift-urgent-care)

**Accuracy and outcome metrics (all self-reported, no methodology published)**
- Series A post: "10.6x the chart coverage per FTE and a 72% improvement in accuracy over internal teams" and "up to 15.2% RVU improvement per chart in organizations with physician-led coding" — [Series A post, 2025-07-22](https://www.chartahealth.com/resources/series-a)
- Retrospective risk adjustment: "98% HCC coding accuracy" or "98% RAF accuracy" — [Retrospective risk adjustment page](https://www.chartahealth.com/products/retrospective-risk-adjustment)
- Payers: "Net RAF improvement per member following first pass review ranges from 0.015-0.0365" and "ROI… ranges from 12x to 29x" — [Payers page](https://www.chartahealth.com/for/payers). One payer case: 12.5% of charts had incremental codes on second pass and a 26x projected ROI — [Payer case study](https://www.chartahealth.com/case-studies/maximizing-hcc-capture-audit-readiness)
- Provider side: an "average 11%" revenue increase, "98% Reduction in cost per chart reviewed", and "1/50th the cost of manual chart review" — [athenahealth Marketplace PR on Charta site, 2026-06-09](https://www.chartahealth.com/resources/charta-health-athenahealth-marketplace); [AI chart review page](https://www.chartahealth.com/ai-chart-review); [About page](https://www.chartahealth.com/about)
- E/M lift from 3.08 to 3.30 in six months at an eCW urgent care — [Case study](https://www.chartahealth.com/case-studies/em-lift-urgent-care)
- Context on the customer side: before Charta, the behavioral health customer was "using generic commercial AI tools like Gemini to assess audit defensibility." This describes the customer's prior process, not Charta's stack — [Case study](https://www.chartahealth.com/case-studies/documentation-compliance-nationwide-scale)

### Inferences
- The system looks like LLM-driven extraction and reasoning, run as many configurable per-note "analyses", together with deterministic payer and CMS policy logic (payer-specific rules, NCCI-type modifier and bundling checks, face-to-face linkage). Charta contrasts itself with rules engines, but customer-specific "audit checklists" and payer rules are almost certainly encoded as configuration around the LLM calls. This is inference; Charta does not describe the split.
- "Training" in marketing copy likely covers prompt and analysis configuration, retrieval of payer policies, and, according to the closed posting, some fine-tuning of foundation models. The share of each is unknown.
- The 98% accuracy figure applies to the human-validated payer workflow, not to fully autonomous coding. No autonomous-coding accuracy figure, such as agreement with certified coders on E/M levels, was published.

### Gaps
- No model provider, model family or hosting route (for example Bedrock, Vertex, Azure OpenAI or self-hosted open weights) is disclosed.
- No public evaluation methodology, gold-standard dataset, inter-rater comparison, confidence-score thresholds or published benchmark was found.
- It is unclear whether confidence scores are shown to users. Only "highest-confidence evidence" (RADV) and "high-strength evidence" (Smart Scan) are mentioned.
- The size and credentials of the human reviewer team for payer work are not disclosed.

---

## 4. Security, compliance, hosting, and deployment model

### Takeaway
Charta claims to be "HIPAA, SOC 2 and GDPR compliant" and offers reports on request at compliance@chartahealth.com. It does not say whether its SOC 2 is Type I or Type II, and I found no public trust center. BAAs are signed early, at the discovery stage. Its product app and API are directly observable on AWS App Runner in us-east-2 (Ohio), consistent with the AWS-centric stack in job postings. HITRUST appears only as a framework a security hire would work toward; it is not a claimed certification. Deployment is a vendor-hosted SaaS web app, not on-premises.

### Cited Findings
**Compliance claims**
- "Yes, Charta is HIPAA, SOC 2 and GDPR compliant. You may request a copy of our compliance reports at any time by emailing compliance@chartahealth.com" — [Charta AI chart review FAQ](https://www.chartahealth.com/ai-chart-review); repeated on [Contact page](https://www.chartahealth.com/contact)
- A BAA and MNDA are signed after a fit is confirmed in discovery, before scoping — [Buyer's guide, 2026-03-30](https://www.chartahealth.com/resources/ai-chart-review-buyers-guide)
- The "Founding Security Reliability Engineer" posting (on the older Ashby slug, posted 2026-04-23 and updated 2026-08-02 per the aggregator, $150K–$250K):
  - Responsibilities: cloud security "mainly on AWS (IAM, encryption, network security, secrets)"; tools including "EC2, S3, RDS, Lambda, EKS/ECS, VPC, CloudWatch, GuardDuty, Security Hub, WAF, KMS, Secrets Manager"; Terraform and Ansible; CI/CD security gates; SIEM, CSPM, IDS/IPS, WAF, DLP and EDR; SAST, DAST, IaC scanning and secrets detection; pen testing; incident response.
  - Compliance against "HIPAA, HITECH, HITRUST, SOC 2, CCPA/CPRA, GDPR", plus NIST CSF, ISO 27001, CIS Benchmarks and MITRE ATT&CK.
  - Sources: [freehire mirror](https://freehire.me/jobs/founding-security-reliability-engineer-charta-health-r3k2sb3y); [Ashby original](https://jobs.ashbyhq.com/charta-health/6b71a01f-a8c7-4fb3-a9e5-7394469cf14e); the [Madrona mirror](https://jobs.madrona.com/companies/charta-health/jobs/76108113-founding-security-reliability-engineer) marks it closed and lists NIST CSF, ISO 27001 and SOC 2.
- Privacy policy (last updated June 1, 2025): it names Charta as "data controller" for its own site and services data. Retention is generic ("for the time period required to complete the purposes"). It says Charta may create "de-identified and aggregated information" for "research, internal analysis, analytics." Vendors are described generically ("IT, web hosting, and related services"). No subprocessor list is published — [Charta privacy policy](https://www.chartahealth.com/legal/privacy-policy)

**Observed infrastructure (direct observation on 2026-10-19, not company statements)**
- `app.chartahealth.com` is a CNAME to `mspmv89xbp.us-east-2.awsapprunner.com`, and `api.chartahealth.com` is a CNAME to `mmsxhbayac.us-east-2.awsapprunner.com`. That puts both on AWS App Runner in the US East (Ohio) region. The API returns `401 {"message":"Not authorized."}` with `server: envoy`, consistent with App Runner's front end — [Google DNS-over-HTTPS lookup for app](https://dns.google/resolve?name=app.chartahealth.com&type=CNAME); [lookup for api](https://dns.google/resolve?name=api.chartahealth.com&type=CNAME)
- The product web app at app.chartahealth.com is a Next.js application. Its public JavaScript bundles reference Clerk (authentication; ClerkProvider, api.clerk.com), Sentry (error monitoring) and PostHog (product analytics) — [app.chartahealth.com](https://app.chartahealth.com) (bundles under /_next/static/)
- The marketing site www.chartahealth.com is served through Cloudflare (from HTTP headers) and built in Webflow, according to the Brand Designer posting ("Own the visual design and Webflow architecture of our website") — [Brand Designer posting](https://jobs.ashbyhq.com/chartahealth/bc8cf02e-4d9c-4854-a5fe-4a77a607d001)
- Corporate email runs on Google Workspace (MX smtp.google.com). SPF includes Amazon SES and HubSpot, and there is a Rippling domain-verification record — [DNS TXT lookup](https://dns.google/resolve?name=chartahealth.com&type=TXT); [DNS MX lookup](https://dns.google/resolve?name=chartahealth.com&type=MX)
- trust.chartahealth.com and security.chartahealth.com did not connect when tested on 2026-10-19, and the site links to no Vanta, Drata or other trust portal. I found no public trust center.

### Inferences
- The hosting model is vendor-hosted, multi-customer SaaS on AWS, with customer data pulled into Charta's environment. "Every account is mapped to an owning engineering pod" and the per-customer integrations suggest per-tenant configuration. Whether data is physically isolated per tenant is unknown.
- App Runner hosts the web app and API tier. Batch, ingestion and LLM workloads plausibly run on ECS/EKS, Lambda or RDS, which the security posting lists. Model inference may go through a third-party API or AWS-hosted models; this is not confirmed.
- A "Founding" security engineer was being hired in April 2026, so Charta's dedicated security function was early-stage then, although it claimed SOC 2 compliance.
- Clerk is a third-party identity provider, so customer staff log in through it. The privacy policy's mention of collecting passwords for "access to our users' accounts" and "third party accounts where such files are stored" may mean Charta stores customers' EHR service credentials for integrations. That is an inference from ambiguous boilerplate.

### Gaps
- SOC 2 type (I or II), auditor, report period and scope are not public.
- There is no HITRUST certification claim, and no ISO 27001 claim.
- Data retention for PHI, deletion on termination, and whether customer PHI is used to train shared models are not stated publicly. The privacy policy covers only de-identified aggregate use.
- LLM data-handling terms (zero-retention, BAA with the model provider) are not disclosed.
- No breach history or security incidents were found, though I did not specifically search HHS OCR breach records.

---

## 5. Founder and engineer talks, podcasts, blogs, GitHub, and patents

### Takeaway
Public technical commentary from the founders is thin. I found no podcasts or conference talks by Liu or Morris. The best founder material is a short Stedi "Spotlight" Q&A with Justin Liu from July 2025 and the investor posts from Bain Capital Ventures and Madrona. The most revealing engineering detail is in Charta's 2026 intern blog posts. I found no patents or public GitHub organization.

### Cited Findings
- Stedi Spotlight Q&A with Justin Liu (2025-07-29):
  - Liu calls charts "essentially the data layer of the entire healthcare system."
  - He says Charta "sits between clinical documentation and claim submission" running pre-bill audits.
  - Payer and provider feedback guides "model training and feature priorities."
  - He plans to extend automation "across the rest of the revenue cycle."
  - The founders earned coding credentials and interviewed more than 100 healthcare professionals; Dr. Caesar Djavaherian (ex-CMO of Carbon Health) invested and joined as CMO.

  The page names no models or EHR integrations — [Stedi blog](https://www.stedi.com/blog/spotlight-justin-liu-charta)
- Bain Capital Ventures (2025-07-22): Liu and Morris worked together at Rockset from 2020 and started building Charta in 2023. Each spent about a year earning the CPC credential. Cold outreach to hundreds of practices produced "several six-figure contracts." The AI checks "visit notes, labs, and medical history against coding and audit protocols specific to each practice" — [BCV](https://baincapitalventures.com/insight/charting-a-new-era-how-charta-health-is-transforming-medical-chart-review/)
- Madrona (2025-07-22): Charta is "AI-native"; LLMs "reason across complex, unstructured data" in place of rules-based NLP; it scans "EHRs, unstructured notes, and PDFs." Madrona lists Tam Pham as VP and former chief product officer at Chirok Health. Separately, Charta's webinar listings describe Tam Pham as a "former VP at Agilon and SCAN Health Plan" — [Madrona](https://www.madrona.com/charting-healthcares-ai-transformation-investing-in-charta-health/); [Charta payer page](https://www.chartahealth.com/payer)
- Series A post: the founders "built the AI infrastructure behind… Rockset (OpenAI's first ever product acquisition), Google, Salesforce", and the platform was built alongside operators from "Carbon Health, Optum, and SCAN Health Plan" — [Charta Series A post, 2025-07-22](https://www.chartahealth.com/resources/series-a)
- Intern engineering blog posts:
  - Vibhor Gautam: a note-ingestion pipeline scaled from 720 to 4,000 notes per day, and Charta "literally doubled in size" during his roughly four-month internship (Jan–Apr 2026). Mentors named: "Qingyuan" and "Alex." — [2026-04-24](https://www.chartahealth.com/resources/building-with-trust-interning-at-charta)
  - Samantha Mac: "standardized agentic workflows to retrieve clinical documentation from electronic medical records systems", billing-reconciliation automation inside the EMR, and "refactoring our infrastructure to support growing partnerships." — [2026-04-24](https://www.chartahealth.com/resources/speed-and-structure-interning-at-charta)
  - Mekhael Thaha: interns ship features and "demo my work directly to our customers." — [2026-04-24](https://www.chartahealth.com/resources/thoughtful-engineering-interning-at-charta)
  - Joshua Kao: a 12-week forward-deployed internship; he is staying on as a co-op "deployment strategist intern" and pursuing a CPC. — [2026-09-08](https://www.chartahealth.com/resources/client-first-engineering)
  - A fifth post, "Initiative-driven engineering" by Aarav Borthakur, is linked from the payer page — [Charta payer page](https://www.chartahealth.com/payer)
- Company FDE essay (2026-04-10): it attributes the FDE concept to Palantir's Alex Karp and describes model retraining loops and change management — [Charta FDE blog](https://www.chartahealth.com/resources/forward-deployed-engineering)
- Customer webinar: Vanessa Miller, VP of revenue operations at Family Care Center, discusses vendor evaluation and implementation, quoted as saying "If you're leveraging a platform that's not flexible… your organization is going to start to bend to the processes that fit the software" — [Charta FDE blog quoting the webinar](https://www.chartahealth.com/resources/forward-deployed-engineering); [Webinar page](https://www.chartahealth.com/webinars/scaling-rcm-operations-with-ai-lessons-from-an-early-adopter)
- Seed-deck commentary (secondary source): an $8.1M seed closed in February 2025, led by BCV with SV Angel, South Park Commons, SpringRock Ventures, Refract and angels. The commentary says Charta reached about $500K in revenue within 60 days of cold outreach and was profitable before leaving stealth in June 2024; these are the commentator's claims, not slide text — [vip.graphics deck teardown](https://vip.graphics/charta-health-pitch-deck/)

### Inferences
- The founders come from Rockset, a real-time indexing and search database. That background fits the retrieval-heavy design in the AI-engineer posting (hybrid ranking, metadata-aware indexing), but no founder has publicly described Charta's architecture.
- Charta's public technical output is marketing-led (CPC-authored SEO and buyer guides) rather than engineering-led. There is no engineering blog, open-source code or conference talk.

### Gaps
- No podcasts, YouTube talks or conference presentations by Liu or Morris were found.
- No patents assigned to Charta Health were found. Google Patents could not be queried directly from my environment, and web searches turned up nothing.
- I found no public GitHub organization. Web search found only an unrelated "charta" repo, and direct org lookup was not available to me.
- I did not review LinkedIn posts by the founders or engineers, because LinkedIn content was not retrievable.

---

## 6. Partnerships: EHR vendors, RCM companies, clearinghouses, AI model providers

### Takeaway
The only formal technology partnership I could confirm is the athenahealth Marketplace listing, announced June 9, 2026. Charta also says its software works with eCW, Experity, HCHB, Qualifacts inSync and ModMed environments, but I found no marketplace agreements for those. I found no announced partnership with OpenAI, Anthropic, Google, AWS (beyond hosting) or any clearinghouse or RCM company. The Stedi connection is an interview, not a confirmed integration.

### Cited Findings
- athenahealth (2026-06-09, PRNewswire): Charta "announced an agreement with athenahealth, Inc. through the company's… athenahealth® Marketplace program." The newly integrated platform lets provider organizations "increase revenue by an average of 11% by automating pre-billing chart audits". The release lists five solutions: autonomous coding, revenue discovery, payer compliance, clinical quality measures and provider feedback — [Charta press release](https://www.chartahealth.com/resources/charta-health-athenahealth-marketplace); listing at [athenahealth Marketplace](https://marketplace.athenahealth.com/product/charta), which redirects to athenaconnect and renders client-side. The deal was also reported by [Becker's](https://www.beckershospitalreview.com/healthcare-information-technology/ai/charta-health-joins-athenahealth-marketplace-with-ai-chart-review/), which returned 403 to my fetch.
- Stedi, a clearinghouse API company, ran a "Spotlight" interview with Liu (2025-07-29). The page does not say whether Charta uses Stedi's APIs — [Stedi blog](https://www.stedi.com/blog/spotlight-justin-liu-charta)
- Investors and healthcare-operator affiliations: Series A investors were BCV (lead), Madrona, SV Angel, Refract Ventures and South Park Commons, for more than $30M total funding. Operator backgrounds cited are Carbon Health, Optum and SCAN Health Plan — [Charta Series A post](https://www.chartahealth.com/resources/series-a)
- Named customers in 2025: Eventus WholeHealth, Family Care Center, Preventive Measures and KidsCare Home Health — [Charta Series A post](https://www.chartahealth.com/resources/series-a)

### Inferences
- The athenahealth Marketplace listing is probably the most standardized integration Charta has, using the athenahealth API. Other EHRs appear to be handled case by case by FDEs.
- The Staff PM posting's "build-vs-partner calls on infrastructure and integrations" suggests Charta was considering, but had not announced, integration-platform partnerships (for example with interoperability vendors) as of mid-2026.

### Gaps
- I found no evidence of partnerships with Epic (Showroom/App Orchard), Oracle Health, NextGen, eCW (marketplace), ModMed (marketplace) or Qualifacts.
- No model-provider partnership or enterprise agreement (OpenAI, Anthropic, Google, AWS Bedrock) was found.
- No clearinghouse (Stedi, Availity, Waystar) or RCM-outsourcer partnership was found.

---

## 7. Product announcements and launches, 2025–2026

### Takeaway
Between 2025 and 2026 Charta went from a pre-bill compliance and chart-review tool to a five-part provider platform: autonomous coding, revenue discovery, payer compliance, clinical quality and provider feedback. It listed on the athenahealth Marketplace in June 2026. In 2026 it launched a separate payer and risk-adjustment line built on "Smart Scan" (clinical chart intelligence, second-pass QA, retrospective and prospective risk adjustment, RADV audit management, HEDIS and quality). It is also building toward a platform/API offering and "agentic" EHR retrieval.

### Cited Findings
- February 2025: an $8.1M seed led by BCV, according to secondary commentary — [vip.graphics](https://vip.graphics/charta-health-pitch-deck/)
- 2025-07-22: a $22M Series A led by BCV, total funding above $30M. Features named then were "AI-powered documentation review" of progress notes, face-to-face assessments and visit logs, plus "100% chart coverage" — [Charta Series A post](https://www.chartahealth.com/resources/series-a)
- 2026-03-30: the buyer's guide publishes the 8-step and 8-week implementation process — [Buyer's guide](https://www.chartahealth.com/resources/ai-chart-review-buyers-guide)
- 2026-06-09: the athenahealth Marketplace launch, listing the five provider solutions — [Press release](https://www.chartahealth.com/resources/charta-health-athenahealth-marketplace)
- Mid-2026, payer product line. Product pages exist for:
  - "Clinical chart intelligence" (Smart Scan at ingestion): [link](https://www.chartahealth.com/products/clinical-chart-intelligence)
  - "Automated second-pass & QA": [link](https://www.chartahealth.com/products/automated-second-pass-qa)
  - "Retrospective risk adjustment": [link](https://www.chartahealth.com/products/retrospective-risk-adjustment)
  - "Prospective risk adjustment" (evidence-backed suspecting with "source citations"): [link](https://www.chartahealth.com/products/prospective-risk-adjustment)
  - "RADV & audit management" (retrieval, record completeness, HCC validation, best-record selection, attestations, submission tracking): [link](https://www.chartahealth.com/products/radv-audit-management)
  - "HEDIS & quality analytics": [link](https://www.chartahealth.com/products/hedis-quality-analytics)
  - The Smart Scan vendor-QA explainer is dated 2026-07-29: [link](https://www.chartahealth.com/resources/smart-scan-for-retro-coding-vendor-evaluation)
- An upcoming payer platform demo webinar, "The intelligence layer for risk adjustment: Charta platform demo", is scheduled for November 19, 2026. RADV webinars with Tam Pham are on November 17, 2026 — [Charta payer page](https://www.chartahealth.com/payer)
- New verticals: a dermatology page for ModMed users (date not shown) — [Dermatology page](https://www.chartahealth.com/for/dermatology). Segment pages also exist for behavioral health, FQHC, home health and hospice, hospitals and health systems, MSOs, primary care and urgent care — [Charta sitemap](https://www.chartahealth.com/sitemap.xml)
- "Agentic" work: intern-built "standardized agentic workflows to retrieve clinical documentation" from EMRs, as of April 2026 — [Charta blog](https://www.chartahealth.com/resources/speed-and-structure-interning-at-charta). The closed AI-engineer posting covers "multi-agent orchestration" — [Madrona mirror](https://jobs.madrona.com/companies/charta-health/jobs/54875707-senior-staff-ai-engineer)
- Platform and API direction: PM postings in July 2026 describe "platform and API-driven offerings" and "self-serve tooling" — [Staff PM posting](https://jobs.ashbyhq.com/chartahealth/0e2b8e22-e7d0-4ed8-9d19-0e60f599de27)

### Inferences
- The payer line reuses the same engine (evidence extraction with citations) but adds a human-validation layer and RADV workflow tooling. Charta is positioning one "clinical intelligence layer" across provider and payer use cases. The Payer Partnerships Lead hire (July 2026) and the November 2026 platform-demo webinar suggest the payer go-to-market was still early in Q3–Q4 2026.
- The move toward "self-serve" platform and API offerings would mark a shift from the current FDE-heavy, bespoke delivery model. Its timing and form are unannounced.

### Gaps
- I found no dated launch press release for Smart Scan or the payer product pages. Their go-live dates are unknown.
- I found no public product changelog, API documentation or developer portal. api.chartahealth.com exists but requires authorization, and I found no public docs.
- I found no announcements of new LLM capabilities, model upgrades or third-party AI partnerships in 2025–2026.
