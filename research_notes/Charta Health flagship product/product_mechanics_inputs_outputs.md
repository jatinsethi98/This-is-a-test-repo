# Charta Health: Product Mechanics of the Flagship (Pre-Bill AI Chart Review / Autonomous Coding) and Other Modules

Research date: 2026-10-19. Entity check: this is Charta Health Inc. (chartahealth.com), the San Francisco AI chart-review company founded by Justin Liu and Scott Morris (ex-Rockset) and backed by Bain Capital Ventures. It is not Charter Communications, Chart Industries, or CHART. Unless a date is given, Charta website quotes come from the live site as fetched on 2026-10-19 (the footer reads "© 2026 Charta Health"). Most product detail comes from Charta's own marketing pages and case studies, which are vendor claims and not independently verified. Charta publishes no technical documentation, API docs or public demo video, and I found none.

---

## 1. Which product is the flagship?

### Takeaway
The flagship is the provider-side **AI pre-billing chart review platform**. It pulls every closed encounter note from the EHR, classifies the visit type, runs a configurable set of LLM "analysis modules", and then auto-corrects codes in the EHR, messages the provider, or queues the chart for a human, all before the claim goes out. As of late 2026 Charta sells it in three overlapping "solutions": **Autonomous coding** (listed first and now the lead framing), **Revenue discovery** and **Payer compliance**. A newer, separate **payer product line built on "Smart Scan"** (retrospective HCC coding, second-pass QA, RADV, HEDIS) has been added.

### Cited Findings
- The homepage headline reads: "Charta is the AI chart review platform that delivers 11% revenue uplift by scaling pre-billing chart review across 100% of patient encounters." — [Charta homepage](https://chartahealth.com/)
- The navigation lists six "Provider Solutions" in this order: Autonomous coding ("Implement autonomous coding for every patient encounter"), Revenue discovery, Payer compliance, Clinical quality, Risk adjustment, Provider feedback. Six "Payer Products" are also listed: Retrospective risk adjustment, Automated second-pass & QA, Clinical chart intelligence, RADV & audit management, Prospective risk adjustment, HEDIS & quality analytics. Clinical documentation improvement appears only in the footer. — [Charta homepage](https://chartahealth.com/)
- Earlier descriptions (2025) cast the product purely as pre-bill review or audit. Bain Capital Ventures (22 Jul 2025): "100% of charts are reviewed pre-billing", against about 1% reviewed post-billing under traditional audits; Charta reviews visit notes, labs and medical history against "coding and audit protocols specific to each practice." — [BCV](https://baincapitalventures.com/insight/charting-a-new-era-how-charta-health-is-transforming-medical-chart-review/)
- Business Insider (Feb 2025) reports that the seed pitch deck described the product as using LLMs to perform a "fully autonomous pre-bill review of every chart." — [Business Insider via AOL](https://www.aol.com/engineers-raised-8-1-million-140002032.html)
- 2026 case studies describe customers "adopting Charta as its primary coding tool to autonomously review and code 100% of patient charts". — [FL FQHC case study](https://chartahealth.com/case-studies/capturing-revenue-and-ensuring-compliance-for-a-20-clinic-fqhc-in-south-florida); [Urgent care E/M case study](https://chartahealth.com/case-studies/em-lift-urgent-care)
- HIT Consultant (Jul 2025) mentioned a "Proactive Documentation" feature that generates near-complete draft notes before a patient encounter, and a "diagnosis-first" approach. That feature does not appear anywhere on the current (Oct 2026) website. — [HIT Consultant](https://hitconsultant.net/2025/07/22/charta-health-secures-22m-ai-powered-automated-chart-review/)
- 2026 job postings describe the company more broadly as "building the operating system for modern healthcare organizations... across revenue cycle, clinical operations, and administrative functions, helping providers and payers." — [Ashby: Staff Product Manager, posted 2026-07-29](https://jobs.ashbyhq.com/chartahealth/0e2b8e22-e7d0-4ed8-9d19-0e60f599de27)

### Inferences
- The "flagship" is one platform (pull the chart, classify the encounter, run the analysis modules, then autocorrect, notify or queue). "Autonomous coding", "Revenue discovery" and "Payer compliance" look like marketing packages of analysis modules running on the same pipeline, not separate products. All three pages use the same "immediately after note submission" language and the same data flow.
- Positioning has drifted from pre-bill audit (2024–25) toward autonomous coding plus audit (2026). The core mechanic is unchanged: compare the codes against the documentation before billing. What is new is that Charta can also originate the codes.
- "Proactive Documentation" (pre-visit draft notes) appears to have been de-emphasized or dropped. It is not on any current product page.

### Gaps
- Charta does not publish revenue by module, so I cannot say which module produces most revenue. Ordering and case-study volume point to autonomous coding, revenue discovery and payer compliance on the provider side.
- I found no launch date for the payer product line (Smart Scan). The earliest dated evidence is a "Payer Partnerships Lead (Value-Based Care)" posting from 2026-07-16 ([Ashby](https://jobs.ashbyhq.com/chartahealth/77b1ed5b-8750-4fca-a362-4a22ab69d807)).

---

## 2. INPUTS: what data the flagship ingests, how, and when

### Takeaway
Charta pulls the full encounter chart directly from the customer's EHR or EMR (no manual uploads). That includes the provider's note plus labs, history, scanned forms, PDFs, faxes and handwritten images. Each customer's audit criteria, payer-specific rules and coding guidelines are configured in by a dedicated Charta engineer. Ingestion is triggered when a note closes or is signed. Stated turnaround ranges from "immediately" or "within five minutes" to "within 24 hours". A dashboard screenshot showing "last sync at 12:01 AM" suggests at least some deployments use scheduled (nightly) batch syncs. Charta names no integration method (FHIR, HL7, SFTP or API).

### Cited Findings
**Clinical data types**
- "Charta integrates with your EHR to read all provider-supplied documentation immediately after a note closes." — [Autonomous coding](https://chartahealth.com/solutions/autonomous-coding)
- Charta's LLMs "can review any type of clinical documentation". Charta "can read and analyze data from across file types, including handwritten notes, faxes, and images." It contrasts this with older rules engines that "read structured EHR data and apply if/then logic." — [What is AI Chart Review (FAQ)](https://chartahealth.com/ai-chart-review)
- Madrona (Jul 2025) says it ingests "clinical notes, labs, scanned forms, PDFs, and EMR entries" across EHRs, unstructured notes and PDFs. — [Madrona](https://www.madrona.com/charting-healthcares-ai-transformation-investing-in-charta-health)
- BCV says Charta reviews "visit notes, labs, and medical history." — [BCV](https://baincapitalventures.com/insight/charting-a-new-era-how-charta-health-is-transforming-medical-chart-review/)
- HIT Consultant (2025) says the AI draws on "chart data and patient conversations" (in the context of the Proactive Documentation feature). — [HIT Consultant](https://hitconsultant.net/2025/07/22/charta-health-secures-22m-ai-powered-automated-chart-review/)
- Home health: the AI cross-checks visit narratives against OASIS assessment data ("mismatched skill needs between narratives and OASIS") and medication lists ("conflicting medication frequencies"). — [Home health case study](https://chartahealth.com/case-studies/optimizing-clinical-compliance)
- Payer compliance: Charta "can read and interpret any document type, including handwritten notes" and assesses charts for "uniqueness, completeness, and payer compliance." — [Payer compliance](https://chartahealth.com/solutions/payer-compliance)

**Coded data (CPT, ICD-10, modifiers, E/M)**
- The product "confirms that billing codes are fully supported by provider documentation". It "validate[s] coding decisions, add[s] missing codes, and fix[es] codes and combinations that are out of payer compliance." — [Payer compliance](https://chartahealth.com/solutions/payer-compliance); [Compliance team page](https://chartahealth.com/teams/compliance)
- The dashboard screenshot alt text shows "a CPT code autocorrection from 99212 to 99213 with rationale and risk assessment details." — [Homepage](https://chartahealth.com/)

**Rules and criteria inputs (customer- and payer-specific)**
- "Charta's CPC-certified team translates your audit checklist into an autonomous AI engine for pre-billing chart review." — [Dermatology page](https://chartahealth.com/for/dermatology)
- "Your full audit criteria applied to 100% of patient charts... Reviewing every chart against payer-specific rules." — [FQHC page](https://chartahealth.com/for/fqhc)
- HIT Consultant says it audits 100% of charts against "client-specific billing and clinical guidelines." — [HIT Consultant](https://hitconsultant.net/2025/07/22/charta-health-secures-22m-ai-powered-automated-chart-review/)
- The dedicated engineer continuously adjusts the setup "based on new payer and CMS rules, new state guidelines, provider feedback." — [Homepage](https://chartahealth.com/)
- Home health deployment used "an AI engine trained on the Medicare Benefit Policy Manual, transforming static compliance rules into dynamic, configurable audit analyses". The customer could "adjust the strictness by clinical element (e.g. skilled need or medication education)." — [Home health case study](https://chartahealth.com/case-studies/optimizing-clinical-compliance)

**Integration method and EHRs**
- "Charta connects to your EHR to pull charts directly – no manual uploads or exports required. Your Charta AI engineer will configure this access." — [Homepage](https://chartahealth.com/)
- "Charta has successfully integrated with dozens of commercial and EHRs, as well as homegrown EMRs." A flowchart alt text names "athenahealth, Experity, and eClinicalWorks". — [AI chart review](https://chartahealth.com/ai-chart-review)
- EHRs named in case studies: eClinicalWorks (neighborhood FQHC; Pacific NW urgent care), Experity (Pacific NW urgent and primary care), athenahealth/"Athena" (primary care; 20+ site Florida FQHC), inSync by Qualifacts (Family Care Center, behavioral health), HomeCare HomeBase (home health and hospice), and a "Homegrown EMR" (national behavioral health org). — [Case studies index](https://chartahealth.com/case-studies), [neighborhood FQHC](https://chartahealth.com/case-studies/audit-proof-compliance-for-neighborhood-fqhc), [urgent care Experity](https://chartahealth.com/case-studies/audit-proof-compliance-urgent-care), [primary care athena](https://chartahealth.com/case-studies/automated-revenue-discovery-primary-care), [FL FQHC](https://chartahealth.com/case-studies/capturing-revenue-and-ensuring-compliance-for-a-20-clinic-fqhc-in-south-florida), [FCC/Qualifacts](https://chartahealth.com/case-studies/compliance-assurance-behavioral-health), [home health](https://chartahealth.com/case-studies/optimizing-clinical-compliance), [homegrown EMR](https://chartahealth.com/case-studies/documentation-compliance-nationwide-scale)
- ModMed (dermatology): "Built around your ModMed workflow, not on top of it. Charta works between the signed note and the claim, the same window your billers already work in. Providers keep charting the way they do today. Your team doesn't have to log into another platform." — [Dermatology page](https://chartahealth.com/for/dermatology)
- athenahealth Marketplace: Simplify reports Charta joined on 9 June 2026, opening access to athenahealth's 160,000+ providers. I could not find an athenahealth or Charta press release or the Marketplace listing itself, so this is unverified. — [Simplify](https://simplify.jobs/c/Charta-Health)
- Integration standards appear only as a "nice to have" in a job post: "data standards (FHIR, HL7)". — [Ashby: Deployment Strategist](https://jobs.ashbyhq.com/chartahealth/8c131996-3e35-4b66-bc1c-0dcf6785ca30)
- The Customer Engineer posting describes failure modes such as "a chart that wasn't processed, a code that didn't appear, an integration that stopped sending data". Duties include reading "logs and pipeline runs", "re-run failed jobs", and "Fix configuration, mapping, and data issues." — [Ashby: Customer Engineer, 2026-09-25](https://jobs.ashbyhq.com/chartahealth/92849d59-cbcc-4d37-b9a8-18f1fb374f58)
- The Senior PM is asked to "Deeply understand the technical landscape we're integrating into: the legacy systems, data formats, and workflows our customers already run on." — [Ashby: Senior PM](https://jobs.ashbyhq.com/chartahealth/cdc427d4-3d93-4791-86db-abc4ec64196e)
- In the FCC webinar, Miller said FCC has "different EHRs, EMRs, and clearinghouses." — [FCC resource page, dated Oct 8, 2026](https://chartahealth.com/resources/revenue-cycle-management-automation-family-care-center)

**Timing (real-time vs batch)**
- "Every time a provider closes a note in your EHR, Charta identifies the encounter type and runs the analysis modules." — [Homepage](https://chartahealth.com/)
- "Charta's AI reviews 100% of charts within 24 hours of a patient note closing." — [FQHC page](https://chartahealth.com/for/fqhc)
- FL FQHC: "audited roughly tens of thousands of charts a month... with results... returned to the billing team within 24 hours". "Charta's AI corrected claims the same day, before they reached billing." — [FL FQHC case study](https://chartahealth.com/case-studies/capturing-revenue-and-ensuring-compliance-for-a-20-clinic-fqhc-in-south-florida)
- Home health: "Every chart is now reviewed within five minutes of submission." — [Home health case study](https://chartahealth.com/case-studies/optimizing-clinical-compliance)
- The dashboard screenshot alt text reads "last sync at 12:01 AM, 7,847 charts pulled". — [Homepage](https://chartahealth.com/)

### Inferences
- The integration pattern is likely a per-customer connector: EHR APIs or marketplace apps where available (athenahealth Marketplace, ModMed), and other methods (possibly RPA, exports or database access) for homegrown EMRs. The connector is triggered by note sign or close events, or by scheduled syncs. The "12:01 AM last sync" and "within 24 hours" language suggest nightly batch pulls are common. "Immediately" and "within five minutes" suggest event-driven pulls in some deployments. Charta never states the method, so this is inference.
- To check "billing codes are fully supported," Charta must ingest the charge or superbill on the encounter (CPT/HCPCS, ICD-10-CM, modifiers, E/M level) as well as the note. In autonomous-coding mode it generates those codes itself.
- The "rules" input is mostly a customer's own audit checklist and payer policies, translated by CPC-certified engineers into LLM prompts or analyses. It is not a licensed, maintained edits database. NCCI and LCD/NCD are never named. "Bundling errors" and "codes and combinations out of payer compliance" imply NCCI-type logic exists in some form.

### Gaps
- No source names the integration protocol (FHIR, HL7 v2, SFTP, vendor APIs, RPA) for any EHR. Whether Charta writes back through APIs, through PM charge edits, or through a clearinghouse is not specified.
- No source confirms ingestion of payer contracts, fee schedules, prior claim history, remits or denials (835s), or clearinghouse data.
- No list of supported EHRs beyond the seven named above. "Dozens" is unquantified.
- I could not open the athenahealth Marketplace listing.

---

## 3. PROCESSING: what the AI checks, and how

### Takeaway
After a chart is pulled, Charta classifies the encounter type (for example, a primary care note) and runs a stack of customer-specific analysis modules. The example shows "10 coding analyses and 8 clinical quality analyses" on one note. The modules are built on LLMs and configured by Charta's forward-deployed AI engineers to replicate the reviews a human auditor would do. Documented checks include E/M leveling (MDM), missed CPT and add-on codes, modifiers (25, 59, telehealth), CPT documentation support, medical necessity, required note elements (CC/HPI), golden-thread integrity, bundling, psychotherapy add-on support, note uniqueness (cloning), HCC capture, and quality-measure or care-gap evidence. Coverage is 100% of encounters. Each decision carries reasoning, a risk assessment and document citations.

### Cited Findings
**Pipeline and method**
- "Every time a provider closes a note in your EHR, Charta identifies the encounter type and runs the analysis modules designed for that type of note, including modules designed for discovering missed revenue opportunities." — [Homepage](https://chartahealth.com/)
- The screenshot alt text shows "primary care note identified, 10 coding analyses and 8 clinical quality analyses running." — [Homepage](https://chartahealth.com/)
- "Charta's AI chart review solutions are based on the most advanced large language models (LLMs), which can review any type of clinical documentation, extract meaning, and run sophisticated, custom-designed analysis modules on each type note. Unlike rules-based engines that rely on natural language processing and user-generated rules, each Charta implementation is custom built to replicate the types of reviews you'd ask a human reviewer to conduct." — [AI chart review FAQ](https://chartahealth.com/ai-chart-review)
- "Your designated Charta AI engineer can configure analyses modules for each type of encounter note your practice generates." — [AI chart review FAQ](https://chartahealth.com/ai-chart-review)
- Example deployment: "Charta's engineers built an integration with the practice's homegrown EMR, then custom-designed a dozen chart analyses targeting the practice's known drivers of compliance risk. After implementation, Charta automatically ran the 12 bespoke analyses every time a provider closed a note." — [Behavioral health nationwide case study](https://chartahealth.com/case-studies/documentation-compliance-nationwide-scale)
- Madrona says Charta flags issues and explains its reasoning, "with humans retaining final approval", and contrasts this with "rules-based NLP" that "breaks under nuance and needs constant retraining." — [Madrona](https://www.madrona.com/charting-healthcares-ai-transformation-investing-in-charta-health)
- The tech stack per job postings is Python, TypeScript, Node.js, Next.js/React, microservices, AWS, PostgreSQL, Docker and ECS/Kubernetes, with "both proprietary and open-source large language models." — [Ashby: Senior SWE](https://jobs.ashbyhq.com/chartahealth/8b09b002-9ff1-4209-8291-7673a1e51146); [Ashby: Tech Lead Manager](https://jobs.ashbyhq.com/chartahealth/50864962-2ba6-40fd-bfa4-afb9d4b98229)
- A Senior/Staff AI Engineer listing (via search snippet; the page itself returned 403) mentions fine-tuning platforms, evaluation frameworks, retrieval systems and RAG workflows. — [Madrona job board listing](https://jobs.madrona.com/companies/charta-health/jobs/54875707-senior-staff-ai-engineer)
- The TPM role helps run cross-functional programs for "evaluation, onboarding, quality". — [Ashby: TPM, 2026-09-30](https://jobs.ashbyhq.com/chartahealth/6f8fa9a2-cd35-491b-a8ab-5e9c0d09398a)
- CEO Justin Liu (Outcomes Rocket, 22 Jan 2026, per episode summary) stresses provider-specific workflows and warns that "AI is only as effective as the humans who train it." I read only the summary, not the transcript. — [Outcomes Rocket episode listing](https://healthpodcastnetwork.com/episodes/outcomes-rocket/how-ai-turns-medical-charts-into-actionable-intelligence-with-justin-liu-ceo-of-charta-health/)

**Specific checks documented by Charta**
- E/M leveling. Charta "verifies that E/M codes are billed at the highest defensible level" and uses "AI that understands MDM complexity coding." — [Revenue discovery](https://chartahealth.com/solutions/revenue-discovery); [Revenue cycle team page](https://chartahealth.com/teams/revenue-cycle)
- Missed services and charges. Charta "ensur[es] you code every service delivered". At one FQHC, "a quarter of all encounter notes had not captured add-on codes supported by documentation." — [Homepage](https://chartahealth.com/); [Neighborhood FQHC case study](https://chartahealth.com/case-studies/audit-proof-compliance-for-neighborhood-fqhc)
- Under-documentation versus correct level. "38% of E/M codes were simply underleveled, while 16% were accurately leveled for the service, but associated documentation was insufficient to meet payer standards." — [Neighborhood FQHC case study](https://chartahealth.com/case-studies/audit-proof-compliance-for-neighborhood-fqhc)
- Over-coding is also flagged. One urgent care group "noticed persistent underdocumentation and overcoding among its providers... 1 in 3 encounters were flagged for underdocumentation." — [Urgent care E/M case study](https://chartahealth.com/case-studies/em-lift-urgent-care)
- Urgent and primary care analyses listed: "E/M leveling accuracy; Correct modifier use; Golden Thread integrity of documentation; Verification of documentation support for all CPT codes; Medical necessity assessments of tests, labs, and medications." — [Urgent care (Experity) case study](https://chartahealth.com/case-studies/audit-proof-compliance-urgent-care)
- Telehealth modifiers and required elements. "64% of telehealth encounters lacked appropriate billing modifiers and... 57% of notes had gaps in Chief Complaint or HPI documentation." — [FL FQHC case study](https://chartahealth.com/case-studies/capturing-revenue-and-ensuring-compliance-for-a-20-clinic-fqhc-in-south-florida)
- Dermatology: Charta "correct[s] undercoded E/M and missed modifiers, flag[s] documentation gaps, and fix[es] bundling errors". It checks that a biopsy has consent and a photo, that modifier 25 has "a separate, identifiable reason", and that 59s are placed correctly for multiple procedures. "Each payer has its own rules." — [Dermatology page](https://chartahealth.com/for/dermatology)
- Behavioral health: "64% of psychiatry notes used psychotherapy add-on codes without sufficient documentation support." Charta also publishes CPT 90832 and 90834 explainers, consistent with a psychotherapy time-code focus. — [Behavioral health nationwide case study](https://chartahealth.com/case-studies/documentation-compliance-nationwide-scale); [Resources index](https://chartahealth.com/resources)
- Note uniqueness and completeness. Charta assesses charts "for uniqueness, completeness, and payer compliance." — [Payer compliance](https://chartahealth.com/solutions/payer-compliance)
- Home health: checks Start of Care, Resumption of Care, Recertification and Discharge charts for "conflicting medication frequencies and mismatched skill needs between narratives and OASIS." — [Home health case study](https://chartahealth.com/case-studies/optimizing-clinical-compliance)
- Clinical quality and care gaps across every encounter (HEDIS and other measures). — [Clinical quality](https://chartahealth.com/solutions/clinical-quality)
- HCC capture for risk-bearing providers: "AI reviews 100% of patient visits for HCC recapture analysis." — [Risk adjustment](https://chartahealth.com/solutions/risk-adjustment)

**Coverage, explainability and human-in-the-loop**
- Coverage is 100% of encounters, compared with typical manual sampling of about 1% ([AIM Media House](https://aimmediahouse.com/leaders-opinion/charta-health-chose-to-scale-instead-of-just-sustaining-profits)), 1–2% ([Madrona](https://www.madrona.com/charting-healthcares-ai-transformation-investing-in-charta-health)), 10% at FCC ([FCC case study](https://chartahealth.com/case-studies/compliance-assurance-behavioral-health)) and 0.1% at a national behavioral health org ([case study](https://chartahealth.com/case-studies/documentation-compliance-nationwide-scale)).
- "AI decisions are backed by detailed reasoning and document citations." — [Payer compliance](https://chartahealth.com/solutions/payer-compliance)
- "Charta ensures each billing code is backed by sophisticated AI reasoning and direct document citations." Charta also keeps "an archive of clear, auditable rationales for each billing code and the corresponding documentation." — [Compliance team page](https://chartahealth.com/teams/compliance); [Revenue cycle team page](https://chartahealth.com/teams/revenue-cycle)
- Oversight is configurable: "customized to your practice's preferred level of human oversight". Charta "can autonomously code every note, autocorrect coding mistakes directly in your EHR, or queue problem charts for human-in-the-loop intervention." — [Autonomous coding](https://chartahealth.com/solutions/autonomous-coding)
- On the urgent care page, clinics choose which codes are auto-corrected and which notes go to human review (per page summary). — [Urgent care page](https://chartahealth.com/for/urgent-care)
- Charta says its engineers are "CPC- and CRC-certified". The founders each spent a year earning the CPC credential. — [Homepage](https://chartahealth.com/); [BCV](https://baincapitalventures.com/insight/charting-a-new-era-how-charta-health-is-transforming-medical-chart-review/)

### Inferences
- The architecture looks like: an encounter-type classifier, then a library of LLM-prompted "analysis modules" (each roughly one audit checklist item), each returning a finding, rationale, citation span and risk rating, then a policy layer that routes by code or finding type to autocorrect, provider message or human queue. This fits the screenshot ("10 coding analyses + 8 clinical quality analyses", "rationale and risk assessment"), the per-customer "12 bespoke analyses", and the "adjust the strictness by clinical element" configurability.
- Charta does not appear to depend on a licensed claim-edit engine (such as NCCI/MUE content). Its differentiation is LLM reading of unstructured documentation plus forward-deployed customization. Whether it also runs deterministic edits is unknown.
- Charta flags both under- and over-coding ("highest defensible level"), but marketing leans heavily toward undercoding and revenue uplift ("1 in 3 encounters undercoded").
- Customer-facing language is "autocorrect" and "autonomous". In practice, confidence and policy determine what is auto-applied, and humans handle the rest.

### Gaps
- No published accuracy, precision or recall figures for provider-side autonomous coding or E/M leveling. The only accuracy claim, 98%, applies to payer HCC coding with human validation.
- No information on which LLMs are used (vendor or model), whether models are fine-tuned on customer data, or how confidence thresholds are set.
- No explicit mention of NCCI, MUE, LCD/NCD, CCI bundling tables, or denial-prediction models (Charta claims denial prevention but does not describe a predictive model).
- Chart-level turnaround SLAs are not published beyond the case-study figures (5 minutes, same day, 24 hours).

---

## 4. OUTPUTS, who acts, and how the loop closes before claim submission

### Takeaway
Each chart produces one of three customer-configured actions: (1) **direct autocorrect of the code in the EHR**, for example 99212 to 99213 with rationale and risk assessment; (2) **automated messages to the provider** with specific remediation steps, delivered inside the EMR so the provider can fix documentation while the chart is open; or (3) **a queue for human review** by coders, billers or QA staff. Results also feed **dashboards** (RVU uplift, documentation compliance scores, provider rankings, quality measures), **provider scorecards**, and an **audit archive** of rationales and citations per code. The loop closes when corrected codes or documentation flow into the claim before submission. A Charta web app exists (app.chartahealth.com), but for some EHRs (ModMed) Charta says users do not need to log into a separate platform.

### Cited Findings
- "What happens when Charta detects coding or documentation errors? You decide: choose from direct autocorrect in your EHR, send automated notes to providers, or queue charts for human intervention." — [Homepage](https://chartahealth.com/)
- The flowchart alt text says Charta "writes corrections back to the EHR." — [AI chart review](https://chartahealth.com/ai-chart-review)
- The RCM implementation article (9 Jul 2026) says the solution "runs on your existing charts and writes back to your EHR." — [Charta resource](https://chartahealth.com/resources/how-to-get-an-rcm-tool-approved-and-live-before-fall)
- Provider messaging: "Charta implemented automated messages with specific feedback for documentation improvement. Providers now receive messages with actionable steps for remediating documentation directly in the EMR." Notes are flagged "for provider intervention at the pre-billing stage." — [Behavioral health nationwide case study](https://chartahealth.com/case-studies/documentation-compliance-nationwide-scale)
- Charta's framing of the loop: "Address issues while charts are still open, eliminating preventable denials and audit exposure." — [Homepage](https://chartahealth.com/)
- FL FQHC: results were "returned to the billing team within 24 hours". "Charta's AI corrected claims the same day, before they reached billing." — [FL FQHC case study](https://chartahealth.com/case-studies/capturing-revenue-and-ensuring-compliance-for-a-20-clinic-fqhc-in-south-florida)
- Home health: "clinical teams had the chance to correct errors before OASIS locked". QA staff "now focus exclusively on high-risk variances flagged by AI". Interventions happen "within the critical 7-10 day OASIS window." — [Home health case study](https://chartahealth.com/case-studies/optimizing-clinical-compliance)
- Dermatology: "Charta works between the signed note and the claim, the same window your billers already work in... Your team doesn't have to log into another platform." — [Dermatology page](https://chartahealth.com/for/dermatology)
- The "Client Login" link points to accounts.chartahealth.com, which redirects to app.chartahealth.com. — [Case studies page HTML](https://chartahealth.com/case-studies)
- Dashboards: the screenshot alt text shows "additional revenue captured with a 11.5% increase in RVUs per encounter, documentation compliance graph with average scores and provider performance rankings." — [Homepage](https://chartahealth.com/)
- Provider scorecards: clinical leaders can "compare care delivery across sites and providers, drill down into individual encounters and notes, and send automated scorecards to clinicians." — [Provider feedback](https://chartahealth.com/solutions/provider-feedback)
- Urgent care: the team "was able to see which clinic locations and specific providers had the greatest tendency to underdocument and overcode" and "used Charta's provider feedback capabilities to send individualized feedback." — [Urgent care E/M case study](https://chartahealth.com/case-studies/em-lift-urgent-care)
- Staff role shift: at FCC, staff focus "on exceptions and provider education". At the primary care customer, the offshore team was refocused "on documentation quality, shifting E/M leveling and CPT coding decisions to Charta". At the urgent care group, coders went "from a team of 4 medical coders to 1." — [FCC case study](https://chartahealth.com/case-studies/compliance-assurance-behavioral-health); [Primary care case study](https://chartahealth.com/case-studies/automated-revenue-discovery-primary-care); [Urgent care E/M case study](https://chartahealth.com/case-studies/em-lift-urgent-care)
- FCC's Vanessa Miller: Charta presents "clear, concise data" with supporting analysis, so staff don't have to read a 10-page chart. — [FCC resource page](https://chartahealth.com/resources/revenue-cycle-management-automation-family-care-center)

### Inferences
- The likely human decision-makers are: (a) coders or billers for queued charts, who accept or reject the AI's suggested code change; (b) providers, who amend or addend notes when messaged; and (c) compliance or clinical leaders, who use dashboards and scorecards for education. Autocorrect removes the human step for code classes the customer has whitelisted.
- The loop closes inside the EHR or PM before the claim is created or released. Charta does not appear to sit at the clearinghouse layer, and no source mentions claim-scrubber or clearinghouse integration.

### Gaps
- No description or screenshot of the human-review worklist UI (columns, accept or reject controls, bulk actions) beyond image alt text. I found no public demo video on YouTube or Vimeo.
- How provider messages are delivered (EHR inbox task, addendum request, email) is unspecified except "directly in the EMR."
- No data on override or acceptance rates for suggestions, or on how disagreements feed back into module tuning.

---

## 5. End-to-end workflow (step by step)

### Takeaway
Combining Charta's own statements gives this flow: implement (about 4–8 weeks, with a dedicated engineer), connect to the EHR, then on each note close pull the chart, classify the encounter, run the modules, generate findings with rationale and citations, route them, and correct the chart before the claim. Reporting and provider feedback follow, and the engineer keeps tuning against new payer, CMS and state rules.

### Cited Findings
1. **Discovery and baseline.** Charta often first analyzes a sample of historical charts. For example, "Charta analyzed a sample of the provider's charts and found that at least 12% contained underleveled E/M codes." — [Primary care case study](https://chartahealth.com/case-studies/automated-revenue-discovery-primary-care)
2. **Implementation phases** (Charta article, 9 Jul 2026): "EHR integration and chart access setup; initial coding analysis and baseline benchmarking; provider feedback loop configuration; and go-live with a first review cycle". The suggested go-live is weeks 4–8 of a roughly 60-day plan. — [Charta resource](https://chartahealth.com/resources/how-to-get-an-rcm-tool-approved-and-live-before-fall)
3. **Configuration.** "Your Charta AI engineer will configure this access and build AI workflows that mirror your team's existing processes and capabilities." — [Homepage](https://chartahealth.com/)
4. **Trigger.** A provider closes or signs a note, and Charta pulls it. — [Homepage](https://chartahealth.com/); [Autonomous coding](https://chartahealth.com/solutions/autonomous-coding)
5. **Classify and analyze.** Charta identifies the encounter type and runs the matching modules (for example, 10 coding and 8 quality analyses for a primary care note). — [Homepage](https://chartahealth.com/)
6. **Findings.** Each finding carries a code change or documentation gap, a rationale, a risk assessment and document citations. — [Homepage](https://chartahealth.com/); [Payer compliance](https://chartahealth.com/solutions/payer-compliance)
7. **Route.** Each finding goes to autocorrect in the EHR, an automated provider note, or a human queue. — [Homepage](https://chartahealth.com/)
8. **Correct before billing.** "Address issues while charts are still open." Claims are corrected the same day, before they reach billing. — [Homepage](https://chartahealth.com/); [FL FQHC](https://chartahealth.com/case-studies/capturing-revenue-and-ensuring-compliance-for-a-20-clinic-fqhc-in-south-florida)
9. **Report and educate.** Dashboards, scorecards and rankings, plus an auditable archive of rationales. — [Homepage](https://chartahealth.com/); [Provider feedback](https://chartahealth.com/solutions/provider-feedback); [Revenue cycle](https://chartahealth.com/teams/revenue-cycle)
10. **Ongoing tuning.** "You'll retain access to your dedicated Charta engineer... to continuously adjust your setup based on new payer and CMS rules, new state guidelines, provider feedback." After go-live a Technical Success Manager owns "deployment health", and "every account is mapped to an owning engineering pod." — [Homepage](https://chartahealth.com/); [Ashby: TSM](https://jobs.ashbyhq.com/chartahealth/9754fa43-7399-4305-bf6d-933ca71b9818)

### Inferences
- The operating model is forward-deployed engineering. Each customer gets a partly bespoke build, and 2026 product and engineering hiring explicitly aims to "turn bespoke customer builds into scalable, repeatable product" ([Ashby: Staff PM](https://jobs.ashbyhq.com/chartahealth/0e2b8e22-e7d0-4ed8-9d19-0e60f599de27)). Deployments are therefore heterogeneous today: integration method, modules and routing differ by customer.

### Gaps
- No pricing model is disclosed (per chart, per provider or percentage of lift). The RCM article says only that vendors may flex payment timing.

---

## 6. Use cases by specialty and setting

### Takeaway
Charta's core market is high-volume, low-reimbursement outpatient care: primary care, urgent care, behavioral health and FQHCs. It has expanded into dermatology (ModMed), home health and hospice, MSOs and health systems, and payers and risk-bearing groups (HCC). I found no oncology, cardiology, emergency medicine or ASC-specific material.

### Cited Findings
- Focus is "high-volume, low-reimbursement specialties such as primary care, urgent care, and behavioral health." — [AIM Media House (Mar 2025, updated Feb 2026)](https://aimmediahouse.com/leaders-opinion/charta-health-chose-to-scale-instead-of-just-sustaining-profits); [Business Insider via AOL](https://www.aol.com/engineers-raised-8-1-million-140002032.html)
- Specialty pages list Dermatology, Primary care, Urgent care and Behavioral health. Organization pages list FQHC, Provider groups, MSOs, Health systems and Payers. — [Homepage](https://chartahealth.com/)
- **Primary care (athenahealth):** a 5x ROI case. 12% of notes had underleveled E/M. The offshore coding team had added "seven days to the billing cycle." — [Primary care case study](https://chartahealth.com/case-studies/automated-revenue-discovery-primary-care)
- **FQHC, 20+ sites in SW Florida (Athena):** 25% of charts had unbilled billable CPT codes, 38% of E/M encounters were undercoded, 64% of telehealth encounters lacked modifiers, and 57% had CC/HPI gaps. Charta became the "primary coding tool." — [FL FQHC case study](https://chartahealth.com/case-studies/capturing-revenue-and-ensuring-compliance-for-a-20-clinic-fqhc-in-south-florida)
- **Neighborhood FQHC (eClinicalWorks; primary, urgent, behavioral and dental care):** 57% of notes had noncompliant documentation and 46% had underleveled or underdocumented E/M. The practice had two coders. — [Neighborhood FQHC case study](https://chartahealth.com/case-studies/audit-proof-compliance-for-neighborhood-fqhc)
- **Urgent care (Experity, Pacific NW):** replaced an offshore coding team. Clinical directors saved 7 hours per week. Reported ROI on costs alone was 1.25x. The page is inconsistent on the vendor cost: "$90k per year" in one place and "$90,000 per month" in another. — [Urgent care Experity case study](https://chartahealth.com/case-studies/audit-proof-compliance-urgent-care)
- **Urgent care (eClinicalWorks):** average E/M level rose from 3.08 to 3.30 in 6 months, coding time fell 75%, and the coding team went from 4 to 1. — [Urgent care E/M case study](https://chartahealth.com/case-studies/em-lift-urgent-care)
- **Behavioral health (FCC, inSync/Qualifacts):** grew from 5 to 50+ clinics and 750 providers across 5 states. Review coverage went from 10% to 100% and review costs fell 60%. — [FCC case study](https://chartahealth.com/case-studies/compliance-assurance-behavioral-health). (The homepage testimonial gives Miller's title as "VP of Revenue Cycle"; the case study says "VP of Revenue Operations".)
- **Behavioral health, national (homegrown EMR):** more than 120,000 charts per month across 12,000 providers, previously reviewed at 0.1% using "generic commercial AI tools like Gemini". Charta built 12 bespoke analyses, and risk on psychotherapy add-on codes fell 64%. — [Case study](https://chartahealth.com/case-studies/documentation-compliance-nationwide-scale)
- **Behavioral health, Guidelight Health:** a webinar on level-of-care standards across states, published 14 Oct 2026. No mechanics are described. — [Guidelight resource](https://chartahealth.com/resources/how-guidelight-health-expanded-across-states-without-losing-its-level-of-care-standards)
- **Dermatology (ModMed):** checks for modifiers 25 and 59, biopsy consent and photo, bundling, and payer-specific rules. — [Dermatology page](https://chartahealth.com/for/dermatology)
- **Home health and hospice (HomeCare HomeBase):** SOC, ROC, Recert and Discharge charts reviewed within 5 minutes against the Medicare Benefit Policy Manual, with OASIS consistency checks, positioned for ADR and TPE defense. — [Home health case study](https://chartahealth.com/case-studies/optimizing-clinical-compliance)
- **KidsCare pediatric home health:** 25% reduction in clinical-manager workflow duties and 10,000 hours saved per year. Clinical managers previously spent days "reviewing evaluations and pushing visit notes through." — [KidsCare case study](https://chartahealth.com/case-studies/kidscare-pediatric-home-health)
- **Value-based care, provider side:** "AI reviews 100% of patient visits for HCC recapture analysis and delivers immediate insights back to your provider engagement team". A 200+ location physician group reported 13x ROI on retrospective chart review. — [Risk adjustment](https://chartahealth.com/solutions/risk-adjustment)

### Inferences
- The product is general-purpose ("If your organization has a reason to audit medical charts, we can automate the process for you" — [AI chart review FAQ](https://chartahealth.com/ai-chart-review)), so specialty coverage depends on what a forward-deployed engineer builds rather than on pre-built specialty content.

### Gaps
- I found no published material on oncology, cardiology, emergency medicine, ASCs or inpatient/DRG review. Charta's focus is outpatient and professional-fee. SmarterDx is cited by Business Insider as an inpatient competitor.

---

## 7. Differentiation from post-bill audits, manual audits, rules engines and autonomous coding

### Takeaway
Charta's argument rests on three contrasts: **timing** (pre-bill rather than retrospective or post-bill), **coverage** (100% of charts rather than a 1–10% sample), and **method** (LLMs reading unstructured documentation with per-customer custom modules, rather than rules or NLP engines over structured data). It now markets itself as autonomous coding too. Its difference from pure autonomous-coding vendors is that the same pipeline also audits compliance, quality and documentation and drives provider feedback, with configurable human oversight.

### Cited Findings
- Post-bill versus pre-bill: "Retrospective sample chart audits allow you to detect audit risk, but not prevent it." — [Compliance team page](https://chartahealth.com/teams/compliance). BCV contrasts about 1% reviewed post-billing with 100% pre-billing. — [BCV](https://baincapitalventures.com/insight/charting-a-new-era-how-charta-health-is-transforming-medical-chart-review/)
- Manual audit cost: Charta claims a "98% reduction in cost per chart reviewed by switching from manual human review to AI." Case studies report smaller savings: 60% (FCC) and 20% ([behavioral health page](https://chartahealth.com/for/behavioral-health); [compliance team page](https://chartahealth.com/teams/compliance)). — [AI chart review](https://chartahealth.com/ai-chart-review); [FCC case study](https://chartahealth.com/case-studies/compliance-assurance-behavioral-health)
- Rules engines: "Older technology relied on rules-based engines that can read structured EHR data and apply if/then logic... Charta can read and analyze data from across file types." — [AI chart review FAQ](https://chartahealth.com/ai-chart-review)
- FQHCs "leverage a mix of manual chart audits and rules-based coding checks, but it leaves significant gaps." — [FQHC page](https://chartahealth.com/for/fqhc)
- Autonomous coding is now also a Charta offering: "fully autonomous medical coding, customized to your practice's preferred level of human oversight." — [Autonomous coding](https://chartahealth.com/solutions/autonomous-coding)
- Business Insider (Feb 2025) named SmarterDx (inpatient chart analysis) and CodaMetrix (notes-to-codes autonomous coding) as competitors. — [Business Insider via AOL](https://www.aol.com/engineers-raised-8-1-million-140002032.html)
- Replacing offshore coding teams is a recurring case-study pattern (primary care, urgent care). — [Primary care](https://chartahealth.com/case-studies/automated-revenue-discovery-primary-care); [Urgent care Experity](https://chartahealth.com/case-studies/audit-proof-compliance-urgent-care)
- On the payer side: "Most retrospective coding vendors deliver a file. Charta delivers insights." — [Retrospective risk adjustment](https://chartahealth.com/products/retrospective-risk-adjustment)

### Inferences
- Against autonomous-coding peers, the differences appear to be (a) post-encounter audit of provider-entered codes rather than only code generation, (b) bespoke, customer-defined audit criteria, (c) provider-facing documentation remediation and scorecards, and (d) an outpatient, mid-market focus (FQHCs, urgent care, behavioral health). The trade-off is heavier services per customer, which Charta is now trying to productize.

### Gaps
- Charta publishes no head-to-head accuracy or benchmark comparisons with autonomous-coding vendors or claim scrubbers.

---

## 8. UI, screenshots, demos and webinars

### Takeaway
Public UI evidence is limited to marketing-image alt text and dashboard descriptions. These show a sync and status panel (last sync, charts pulled, encounter type detected, analyses running), a code-change card (99212 to 99213 with rationale and risk), and analytics (RVU uplift, documentation compliance scores, provider rankings). I found no public product demo video. The webinars are customer fireside chats, not product walkthroughs.

### Cited Findings
- Screenshot alt texts include "Autonomous coding", "Revenue discovery", "Payer compliance", "Clinical quality", "Risk adjustment" and "Provider feedback" screenshots "from the Charta Health Platform". — [Homepage](https://chartahealth.com/); [Provider feedback](https://chartahealth.com/solutions/provider-feedback)
- Dashboard 1: "last sync at 12:01 AM, 7,847 charts pulled, primary care note identified, 10 coding analyses and 8 clinical quality analyses running, and a CPT code autocorrection from 99212 to 99213 with rationale and risk assessment details." — [Homepage](https://chartahealth.com/)
- Dashboard 2: "additional revenue captured with a 11.5% increase in RVUs per encounter, documentation compliance graph with average scores and provider performance rankings." — [Homepage](https://chartahealth.com/)
- Webinars:
  - "Guidelight" (upcoming 17 Nov 2026, behavioral health level of care)
  - "LocalMD in-house lab" (40% incremental monthly revenue; listed as 29 Oct 2026 with "Watch Replay", which conflicts with today's date of 19 Oct)
  - "M&A lessons from Carbon Health" with CMO Caesar Djavaherian (4 to 140 clinics)
  - FCC RCM automation (page dated 8 Oct 2026)
  — [Homepage](https://chartahealth.com/); [FCC resource](https://chartahealth.com/resources/revenue-cycle-management-automation-family-care-center)
- Podcasts: Outcomes Rocket (22 Jan 2026) and Wilshire IT Revcast (21 May 2025, "no transcript available"). — [Outcomes Rocket listing](https://healthpodcastnetwork.com/episodes/outcomes-rocket/how-ai-turns-medical-charts-into-actionable-intelligence-with-justin-liu-ceo-of-charta-health/); [Wilshire IT Revcast](https://wilshireitrevcast.podcast.show/episode/145606310)

### Gaps
- I found no YouTube or Vimeo product demo, conference talk (HIMSS, HFMA, MGMA) or podcast transcript. The Outcomes Rocket page redirected to a directory without the transcript.

---

## 9. Other Charta modules (brief mechanics)

### Takeaway
On the provider side, the other modules (Clinical quality, Risk adjustment, Provider feedback, CDI) reuse the same pull, classify, analyze and route pipeline with different analyses and audiences. The payer line is a separate workflow built on **Smart Scan**. It ingests charts that plans have already retrieved, parses them by date of service, extracts HCC and quality evidence with citations, and pre-screens out low-value charts. Human coders then validate the findings (98% RAF accuracy claimed). The same evidence powers second-pass QA, RADV management, HEDIS and prospective suspecting.

### Cited Findings
**Provider-side modules**
- **Revenue discovery:** captures missed services and pushes E/M to the "highest defensible level". Cited results include an 11% average RVU-per-encounter increase and "1 in 3 encounters undercoded". — [Revenue discovery](https://chartahealth.com/solutions/revenue-discovery)
- **Payer compliance:** "AI decisions are backed by detailed reasoning and document citations". It checks codes against "payer-specific guidelines" and cites a 64% reduction in documentation compliance risk. — [Payer compliance](https://chartahealth.com/solutions/payer-compliance)
- **Clinical quality:** extends quality review to 100% of encounters ("Charta's HEDIS software enables quality leads to scale chart review across every patient encounter, in real time"). "Automated care delivery and documentation feedback reaches clinicians immediately after each encounter, while aggregate metrics enable comparison across providers and sites." — [Clinical quality](https://chartahealth.com/solutions/clinical-quality)
- **Risk adjustment (risk-bearing providers):** "Charta's Smart Scan technology for HCC evidence detection". "AI reviews 100% of patient visits for HCC recapture analysis". It returns "provider-level coding performance, suspected diagnoses, and care gaps" with "direct citations to accelerate validation." — [Risk adjustment](https://chartahealth.com/solutions/risk-adjustment); [Homepage](https://chartahealth.com/)
- **Provider feedback:** "regular, standardized feedback across care delivery, documentation integrity, and coding accuracy". Leaders can drill down by provider and site and "send automated scorecards to clinicians." — [Provider feedback](https://chartahealth.com/solutions/provider-feedback)
- **Clinical documentation improvement:** "flagging inadequate documentation immediately after it's submitted", with "immediate feedback and recommendations for improving documentation quality". It references reducing provider "pajama time" at "one of the nation's largest urgent care providers". — [CDI](https://chartahealth.com/solutions/clinical-documentation-improvement)

**Payer products (Smart Scan)**
- **Clinical chart intelligence:** "Smart Scan analyzes clinical records before coding begins, extracting encounter and clinical information and identifying potential HCC evidence so teams can prioritize review". Charta says "About 20% of MA member charts contain no relevant HCC evidence." — [Clinical chart intelligence](https://chartahealth.com/products/clinical-chart-intelligence)
- **Retrospective risk adjustment:** "AI trained on clinical documentation surfaces HCC evidence directly to human coders who apply your team's specific coding guidelines to validate incremental HCCs and flag unsupported codes for deletion, resulting in 98% RAF accuracy". Smart Scan works by "parsing charts by DOS", "pre-screens your population to identify the charts with actual RAF potential", and uses "LLM-powered intake and evidence-based coding" with "an auditable trail of clinical evidence for every code." — [Retrospective risk adjustment](https://chartahealth.com/products/retrospective-risk-adjustment)
- **Automated second-pass & QA:** analyzes 100% of coded charts and surfaces "potential missed HCCs, unsupported diagnoses, and coding discrepancies" to human reviewers, giving "better visibility into coder and vendor performance." — [Automated second-pass & QA](https://chartahealth.com/products/automated-second-pass-qa)
- **Payer case study:** the plan processes more than 1M charts a year and runs on CMS-HCC V24, V28 and Rx HCC V08. "LLM-enabled claims matching with deep AI analysis of chart documentation". AI surfaces "incremental and unsupported codes to a team of human reviewers, who vet each code against the AI citations". Results: 12.5% of charts had incremental codes, projected ROI was 26x, and clinician- and site-level add/delete data was delivered. — [Payer case study](https://chartahealth.com/case-studies/maximizing-hcc-capture-audit-readiness)
- **RADV & audit management:** "brings retrieval, record completeness, HCC validation, best-record selection, attestations, and submission tracking into one workflow" across concurrent audits and payment years. Charta also mentions an "AI-powered validation engine" that "surfaces the highest-confidence evidence." — [RADV](https://chartahealth.com/products/radv-audit-management)
- **HEDIS & quality analytics:** "Smart Scan uses AI to extract HEDIS and quality-relevant clinical evidence from records already being reviewed for risk adjustment". Charta claims 60% of quality chart pursuits may be redundant to risk adjustment operations. — [HEDIS](https://chartahealth.com/products/hedis-quality-analytics)
- **Prospective risk adjustment:** "turns retrospective chart intelligence into evidence-backed prospective opportunities, giving teams the clinical evidence, source citations, and prioritization." — [Prospective](https://chartahealth.com/products/prospective-risk-adjustment)
- **Provider engagement (payer team page):** "encounter-level HCC documentation feedback and suspect intelligence, with citations back to the clinical evidence." — [Payer homepage](https://chartahealth.com/payer)

### Inferences
- The payer line inverts the provider flow. Input is retrieved charts (PDFs or records), not live EHR notes. Timing is retrospective, not pre-bill. Human coders are always in the loop, not optional autocorrect. The shared core is LLM evidence extraction with citations.
- "Smart Scan" seems to be the brand for the evidence-extraction engine shared between provider risk adjustment and the payer products.

### Gaps
- Payer-side input formats (PDF, CCD/C-CDA, fax) and the chart retrieval partner are not stated. Charta says it uses "the records you already retrieve".
- MEAT/TAMPER criteria are not mentioned explicitly. A V28 guide exists in Resources ([resources index](https://chartahealth.com/resources)).
- No dates for when individual payer products launched.
