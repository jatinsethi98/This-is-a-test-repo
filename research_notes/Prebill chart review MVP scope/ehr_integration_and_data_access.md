# EHR / PM Integration and Data Access for a Pre-Bill AI Chart Review / Coding MVP (US outpatient)

Research date: 2026-10-21. Note: many of the most specific facts below (fees, endpoint names, timelines) come from integration-vendor blogs and API "explorer" sites rather than from the EHR vendors themselves, because the EHR vendors put partner terms behind NDAs/logins. Each such item is flagged "(secondary)" or "(anecdotal)". Official vendor/regulator sources are flagged "(official)".

## 1. Which ambulatory EHRs matter most (US market share 2024-2026), and which dominate by segment?

### Takeaway
By raw install counts, Epic (~19.5%), eClinicalWorks (~11.9%) and athenahealth (~6.9%) lead ambulatory, followed by Oracle Health, NextGen and ModMed. By clinicians reporting to CMS, Epic is ~63% (that data skews toward health-system-employed doctors). For independent outpatient practices (the likely buyer of a pre-bill coding startup), athenahealth and eClinicalWorks are the two most important targets; eCW dominates FQHCs, Experity dominates urgent care (~50%), ModMed dominates dermatology, and Qualifacts/Netsmart lead behavioral health.

### Cited Findings
**Overall ambulatory share**
- Definitive Healthcare (data accessed Oct 2025) top 10 ambulatory EHR vendors by "installs": Epic 16,295 (19.5%); eClinicalWorks 9,966 (11.9%); athenahealth 5,801 (6.9%); Oracle Cerner 4,490 (5.4%); NextGen 3,510 (4.2%); ModMed 2,987 (3.6%); Veradigm 2,580 (3.1%); Practice Fusion 2,563 (3.1%); Nextech 1,892 (2.3%); Greenway 1,846 (2.2%). The page does not define what an "install" is (practice vs. site). — [Definitive Healthcare, Oct 15 2025](https://www.definitivehc.com/blog/top-ambulatory-ehr-systems)
- ONC/ASTP (official) count of clinicians reporting a certified product to CMS Promoting Interoperability, program year 2024 (268,652 clinicians; vendors overlap so % do not sum to 100): Epic 168,670 (62.8%); Oracle Health 28,157 (10.5%); athenahealth 20,887 (7.8%); NextGen 11,296 (4.2%); eClinicalWorks 10,819 (4.0%); Modernizing Medicine 9,741 (3.6%) plus ModMed Gastroenterology 3,016 (1.1%); Nextech 2,525 (0.9%); Veradigm 2,336 (0.9%). Greenway, Practice Fusion, AdvancedMD and Elation are not in the itemized top 25. Page last updated July 2026. — [ONC Health IT quickstats (official)](https://healthit.gov/data/quickstats/health-care-professional-health-it-developers/)
- Other sites claim Epic holds 37-44% of ambulatory share, conflicting with Definitive's 19.5%; counting methods differ (installs vs. providers vs. hospital-affiliated). — [EHRSource](https://www.ehrsource.com/articles/top-ehr-vendors/); [Relaymed](https://relaymed.com/blog/top-ambulatory-ehr-systems-2024-market-leaders-integrations/)
- Epic's acute-care (hospital) share rose to 43.7% in KLAS's 2025 report, with gains among small health systems; Epic Community Connect extends Epic to smaller affiliated practices. — [Fierce Healthcare](https://www.fiercehealthcare.com/health-tech/epic-continues-grow-ehr-market-share-it-makes-gains-small-health-systems)

**Independent practices / primary care**
- 2025 Best in KLAS, small practice (1-10 physicians) independent ambulatory EHR/PM: Elation Health won (85.3); eClinicalWorks 70.8; Greenway Intergy 63.1. — [KLAS 2025](https://klasresearch.com/best-in-klas-ranking/small-practice-ambulatory-ehr-pm-1-10-physicians-independent/2025/314-50)
- athenahealth (athenaClinicals / athenaOne) held top placement for independent practices with 11-75 physicians in both 2025 and 2026 Best in KLAS (EHR and PM). — [Healthcare IT News, Best in KLAS 2026](https://www.healthcareitnews.com/news/best-klas-2026-sees-positive-disruption-tangible-tech-improvements); [Healthcare IT News 2025](https://www.healthcareitnews.com/news/best-klas-2025-sees-industry-progress-and-vendor-momentum)
- KLAS 2024 mindshare: Epic and athenahealth garner the highest mindshare among independent ambulatory practices. — [KLAS Ambulatory EHR/PM Mindshare 2024](https://klasresearch.com/report/ambulatory-ehr-pm-mindshare-2024-which-vendors-are-seen-as-poised-for-market-share-growth/3314)

**FQHCs (community health centers)**
- eClinicalWorks said (March 2024) it is the EHR for 800+ health centers, roughly 60% of the national total (vendor claim relayed by secondary roundups); NextGen says 300+ community health centers; Epic reaches many health centers through OCHIN (43,000+ providers, 2,200+ sites). No independent FQHC share data found. — [Mindbowser FQHC roundup (secondary)](https://www.mindbowser.com/best-ehr-for-fqhc/); [BestMedicalBilling FQHC roundup (secondary)](https://bestmedicalbilling.com/blogs/fqhc-ehr-software-reviewed/)

**Urgent care**
- Experity (official press release, May 20 2026): serves 22 of the 25 largest enterprise urgent-care organizations and "nearly 50%" of US urgent care centers. — [Experity](https://www.experityhealth.com/news/experity-establishes-an-ai-driven-partner-ecosystem-designed-for-urgent-care/)
- A 2026 review puts Experity at ~50% share and 5,700+ clinics (secondary). — [MedicalRecords.com](https://www.medicalrecords.com/emr/experity)
- Total US urgent care centers: 14,382 as of July 2023. — [Urgent Care Association white paper](https://urgentcareassociation.org/wp-content/uploads/2023-Urgent-Care-Industry-White-Paper.pdf)
- Experity acquired Exdion Healthcare "to accelerate AI-driven revenue cycle management automation for on-demand care" (i.e., the dominant urgent-care EHR is building its own AI RCM/coding). — [PR Newswire](https://www.prnewswire.com/news-releases/experity-acquires-exdion-healthcare-to-accelerate-ai-driven-revenue-cycle-management-automation-for-on-demand-care-302815075.html)

**Dermatology**
- ModMed (EMA) is the dominant dermatology EHR; the most recent share claim found is a dated (2018) ModMed marketing statement that 40%+ of US dermatologists use EMA (vendor claim, dated). — [ModMed blog](https://www.modmed.com/resources/blog/heading-west-for-the-american-academy-of-dermatology)

**Behavioral health**
- A blog citing a 2024 federal facility survey reports Qualifacts/Credible as the most frequently reported behavioral-health EHR at 11.7% of facilities, Netsmart 10.5% (could not verify against the original survey). — [blueBriX (secondary)](https://bluebrix.health/blogs/best-patient-engagement-software-for-behavioral-health-practices)

### Inferences
- The CMS/ONC clinician numbers overweight Epic because large health systems report on behalf of many employed clinicians, while small independent practices are often exempt from MIPS reporting; Definitive install counts are a better proxy for "number of practices." For a startup selling to independent outpatient groups, athenahealth + eClinicalWorks likely cover the largest addressable set of independent practices, with NextGen, ModMed, Greenway, AdvancedMD, Tebra and Elation as long tail.
- Segment-specific beachheads: urgent care = Experity (but Experity is building in-house AI RCM via Exdion, so it may be a competitor rather than a partner); FQHC = eCW (plus NextGen, OCHIN-Epic); dermatology = ModMed; behavioral = Qualifacts/Netsmart.
- Epic-ambulatory practices are mostly health-system owned; selling there means selling to the health system, a longer enterprise sale.

### Gaps
- No authoritative 2025-2026 practice-count share data for Tebra/Kareo, AdvancedMD, DrChrono, Greenway, Elation, Practice Fusion (KLAS and Definitive full datasets are paywalled).
- No independent (non-vendor) current dermatology or FQHC share figures; HRSA UDS data would be the authoritative FQHC source but was not surfaced.
- Behavioral health share figure could not be traced to the original federal survey.

## 2. For the top EHRs: what programmatic READ (notes, problems/labs/meds, coded charges) and WRITE-BACK (corrected codes/charges, provider tasks/messages) access exists, how do you get it, and are there event hooks?

### Takeaway
athenahealth is the most startup-friendly major ambulatory EHR for a pre-bill coding product: its proprietary API can read encounter documentation and claims/charges and can create claims/charges, it has a self-serve sandbox, a Marketplace partner track, and polling-based "changed data" feeds (push webhooks still maturing). eClinicalWorks gives free certified FHIR reads (including notes) but write-back (incl. ChargeItem) requires a separate contract and there are no webhooks. Epic's charge write path is an HL7v2 "Incoming Financial Transactions" interface (customer-built), and Epic explicitly supports a charge-review/charge-update pattern for coding vendors. NextGen, ModMed, Experity and Qualifacts all gate write access behind partner programs; Experity publishes no API at all.

### Cited Findings

**athenahealth (athenaOne)**
- Access model: sandbox is self-serve/auto-provisioned; production access to many athenaOne (proprietary) APIs requires an athenahealth "Platform Services" contract and a BAA; requirements vary by endpoint/program (secondary). — [Cobalt EHR API Explorer: athenahealth](https://explorer.usecobalt.com/ehr/athenahealth)
- Production is a reviewed partner process, not instant self-serve; sandbox and production use separate client IDs/secrets (secondary). — [Nango docs](https://nango.dev/docs/api-integrations/athenahealth/connect)
- Certified (ONC) APIs are free to athenaOne Base customers; "other APIs may be subject to additional fees" (official athenaOne Service Description, Summer 2026 edition; quoted from search excerpt because PDF returned 403). — [athenaOne Service Description](https://www.athenahealth.com/sites/default/files/media_docs/athenaOne-Service-Description.pdf)
- Supergood (which sells unofficial API layers, so has a commercial interest) says proprietary non-FHIR APIs carry a per-call fee schedule, approval is "slow and opaque" with legal, security and usability reviews, and customers wait weeks for practice-side activation (secondary, conflicted source). — [Supergood report card, Oct 2026](https://supergood.ai/api-report-card/athenahealth)
- Read endpoints (secondary): encounters `GET /chart/{id}/encounters`, encounter documentation `GET /chart/encounter/{encounterid}/summary` (HPI, exam, A&P), documents `GET /chart/{id}/documents`, problems with ICD-10/SNOMED `GET /chart/{id}/problems`, meds, lab results; claims `GET /claims`, `GET /claimcharges`. — [Taction Software, Feb 2026](https://www.tactionsoft.com/blog/athenahealth-api-integration-guide/)
- Billing write: charge entry and claim creation via proprietary API (secondary). — [Cobalt: athenahealth](https://explorer.usecobalt.com/ehr/athenahealth)
- Concrete example of a coding write-back: an AI-coding tool posts biller-approved CPT/ICD-10/modifier/units "claimcharges" form-encoded to `POST /v1/{practiceid}/appointments/{appointmentid}/claim` after resolving the encounter's linked appointment (secondary, vendor doc). — [Nanonets athenahealth "add codes to encounter"](https://agents.nanonets.com/docs/tools/athenahealth-add-codes-to-encounter)
- athenaOne's own Rules Engine checks claims immediately after charge entry ("Claim Assistant" surfaces errors before claim creation); rules can hold claims, post warnings, or change format; practices can add custom rules (official help docs). — [athenahealth Claim Rules](https://help.athenahealth.com/Ohelp/Content/Features/Claim_Rules_A.htm); [Claim Assistant](https://help.athenahealth.com/Ohelp/Content/Features/PreClaimValidation_A.htm)
- Event hooks: legacy "Changed Data Subscriptions" are pull-based (subscribe, then poll `GET /changed/{datatype}`; suggested every 1-5 min for clinical, 15-30 min for financial); covers demographics, appointments, lab results, clinical documents, claim status (secondary). — [Taction](https://www.tactionsoft.com/blog/athenahealth-api-integration-guide/)
- Push webhooks: athenahealth's Event Subscription Platform follows FHIR R5 Subscriptions Backport, rest-hook channel with id-only payloads; webhooks must answer 2xx within 2 seconds (official GitHub README, v0.8, 2023). Cobalt (2026) describes FHIR push Event Subscriptions as "limited alpha (v0.13), not production-ready" and changed-data polling as the production option. — [athenahealth GitHub](https://github.com/athenahealth/aone-fhir-subscriptions/blob/main/README.md); [Cobalt](https://explorer.usecobalt.com/ehr/athenahealth)
- Maintenance: quarterly breaking changes with mandatory testing deadlines (secondary). — [Cobalt](https://explorer.usecobalt.com/ehr/athenahealth)
- Marketplace: 2017 official FAQ said no fee to clients for Marketplace use or connection, partner must have a signed contract with the client and client consent before connection, and partners had to complete a HITRUST self-assessment within 90 days of general availability (official but dated). — [athenahealth Marketplace FAQ](https://www.athenahealth.com/~/media/athenaweb/files/marketplace/pdfs/marketplacefaq040416.pdf)
- Revenue share: one 2026 guide claims athenahealth takes 15-30% of Marketplace-generated revenue and approval takes 6-12 weeks (secondary, unverified; no primary source found). — [Taction](https://www.tactionsoft.com/blog/athenahealth-api-integration-guide/)
- Direct competitor precedent: Charta Health (AI pre-bill chart review) is live on the athenahealth Marketplace (June 9 2026), reviewing every encounter pre-billing, assigning codes, correcting under-coding "directly in the EHR," flagging charts for human review, inside the athenaOne workflow (vendor announcement). — [Charta Health](https://www.chartahealth.com/resources/charta-health-athenahealth-marketplace)

**eClinicalWorks (eCW)**
- Certified FHIR APIs are available to third-party developers and customers "at no cost at this time," with 30 days' notice before any fees (official). — [eCW Certified EHR Technology](https://www.eclinicalworks.com/resources/certified-ehr-technology/)
- Two portals: eClinicalWorks Connect (provider SMART apps, backend services, bulk export, CDS Hooks) and healow Developer Portal (patient apps, scheduling, RPM). No published listing fee or revenue share; partner status not needed for certified APIs (secondary, reviewed Sept 2026). — [Nirmitee eCW guide, updated Oct 19 2026](https://nirmitee.io/blog/eclinicalworks-integration-fhir-hl7-api-guide/)
- Certified FHIR R4 reads cover US Core 6.1.0/3.1.1; the live CapabilityStatement declares 36 resource types including Claim (read) and ChargeItem; Group-level bulk `$export` available; some USCDI v3 reads require a recent cumulative patch (secondary). — [Nirmitee](https://nirmitee.io/blog/eclinicalworks-integration-fhir-hl7-api-guide/)
- Notes are readable via DocumentReference and DiagnosticReport (secondary). — [Cobalt: eCW](https://explorer.usecobalt.com/ehr/eclinicalworks)
- Write-back: certified server only declares QuestionnaireResponse create; ~30 contracted create/update/delete APIs (incl. Encounter, Condition, DocumentReference, ChargeItem, Procedure, Task, Coverage) are available only under a separate contract via interop@eclinicalworks.com; pricing unpublished; an "Encounter (paid API)" read exists (secondary). — [Nirmitee](https://nirmitee.io/blog/eclinicalworks-integration-fhir-hl7-api-guide/)
- Each practice must activate FHIR APIs individually ("On-Demand Activation"); practices must be on specific certified builds; no webhooks or FHIR Subscriptions; rate limit 250 calls/min per practice (since Oct 7 2025; exceeding returns 429 and blocks the app for the rest of the minute) (secondary). — [Cobalt: eCW](https://explorer.usecobalt.com/ehr/eclinicalworks); [Nirmitee](https://nirmitee.io/blog/eclinicalworks-integration-fhir-hl7-api-guide/)
- Conflicting fee report: an AI-scribe vendor's setup guide cites a $50/month eCW integration fee for FHIR API access, contradicting eCW's "no cost at this time" (anecdotal). — [DeepCura help center](https://deepcura.zendesk.com/hc/en-us/articles/34259920407444-eClinicalWorks-Integration-Full-Setup-Guide-Features)

**Epic (ambulatory, incl. Community Connect)**
- Programs (Jan 2025): open.epic (free docs for 99 HL7v2 and 46 X12 interfaces, no sandbox/support); Epic on FHIR (free FHIR/SMART/CDS Hooks); Vendor Services (paid, $1,700/yr membership plus support and transactional API fees; proprietary web-service APIs require an "Interoperability Request", Epic recommends first securing support from 2-3 customers); Showroom tiers Connection Hub ($500/yr, requires one live customer connection), Toolbox (requires Vendor Services, non-compete provisions, substantial API fees), Workshop (co-development, ~2 vendors per category). — [Brendan Keeler, "An Epic Tale," Jan 15 2025](https://healthapiguy.substack.com/p/an-epic-saga-the-startup-odyssey)
- 2026 guides put Vendor Services at ~$1,900/yr with a refundable 3-month trial and Connection Hub at $500/product/yr; App Orchard URLs now redirect to Vendor Services; Showroom launched Jan 2024 (secondary; conflicts with Keeler's $1,700, likely a price change). — [Nirmitee: How to get your app into Epic](https://nirmitee.io/blog/how-to-get-your-app-into-epic/); [Saga IT](https://saga-it.com/blog/epic-showroom-app-orchard-publishing); [Fierce Healthcare on Showroom launch](https://www.fiercehealthcare.com/health-tech/epic-launches-new-showroom-website-3rd-party-apps-services)
- Keeler's advice for startups: "go live with one Epic customer" (FHIR, HL7v2, web services or flat files all qualify) to earn a Connection Hub listing; Epic billing/payment APIs are mostly private; FHIR reads mostly require a patient ID; writeback is often a note or PDF; Kit offers SQL access to Caboodle, Clarity access is rare. — [Keeler](https://healthapiguy.substack.com/p/an-epic-saga-the-startup-odyssey)
- Charge write path (official): Epic's "Incoming Financial Transactions" HL7v2 interface receives charge/credit transactions for Hospital Billing and posts or voids charges on guarantor accounts in Professional Billing; "These charges are subject to charge entry checks." — [open.epic HL7v2 interfaces](https://open.epic.com/Interface/HL7v2)
- Note read path (official): "Outgoing Documentation" sends HL7 MDM messages with notes and transcriptions "as they are saved and modified," and can send a document summary when an encounter closes — effectively an event feed. — [open.epic HL7v2](https://open.epic.com/Interface/HL7v2)
- Epic documentation (per search excerpt; exact page not verified) describes an autonomous-coding pattern using paired interfaces: outgoing financial transactions in "charge review mode" to receive charges/placeholder charges for an encounter, and incoming financial transactions in "charge update mode" to send automated coded charges back to Professional/Hospital Billing. — [Epic on FHIR documentation (unverified page)](https://fhir.epic.com/Documentation?docId=oauth2)
- open.epic Coding page (official): Outgoing Claim Scrubber Query integrates scrubbers (Experian Health, Optum, RCxRules, etc.) into Resolute billing workflows; "Coding: Incoming Query and Response" lets coders send documentation queries to providers inside Epic (3M, Nuance, Optum, Solventum); "Coding: Bidirectional" connects encoders/computer-assisted coding systems via web services and back-end methods. — [open.epic Financial/Coding](https://open.epic.com/Financial/Coding)
- Inside Epic, after a provider signs an encounter, charges pass through the charge router (fatal-error edits) then charge-review workqueues (CCI/LCD and custom edits) (anecdotal, Epic trainer forum post). — [AAPC forum](https://forums.aapc.com/discuss/goto/post?id=471041)

**NextGen**
- Developer programs (official): Patient Access (free), Open Access (clients building internal apps, free), API Distributor Program (commercial; free to develop and use sandboxes but "may have associated fees based on the scope of data needs and/or other requirements"). — [NextGen Developer Program](https://www.nextgen.com/developer-program)
- Unverified third-party pricing: $2,400 one-time onboarding per API, then $50/month SMART App Launch and $100/month Bulk FHIR, per vendor per practice (secondary, unverified). — [apis.io NextGen pricing](https://apis.io/plans/nextgen-healthcare/nextgen-healthcare-plans-pricing/)
- In NextGen Enterprise, charges created in the EHR wait in a "pending charges holding tank" in the PM system where users accept/reject them per encounter, and encounters "pending approval" cannot have charges voided or financial info changed (official user docs) — a natural pre-bill review checkpoint. — [NextGen Knowledge Center: process EHR charges](https://docs.nextgen.com/en-US/help-guide-for-nextgenc2ae-enterprise-pm-8-3239701/process-nextgenc2ae-enterprise-ehr-charges-from-the-charge-posting-window-360694); [Limitations on encounters pending approval](https://docs.nextgen.com/en-US/help-guide-for-nextgenc2ae-enterprise-pm-8-3269693/limitations-on-encounters-with-pending-approval-396567)

**ModMed (EMA, dermatology/ophthalmology/ortho etc.)**
- Two tracks: certified FHIR API (free registration, read/search only) and proprietary EMA API (create/update) gated through ModMed's synapSYS partner program (secondary). — [Caesar Health](https://www.caesarhealth.com/integrations/modmed); [ModMed developer portal (official)](https://portal.api.modmed.com/docs/getting-started)
- Proprietary API: notes, encounters, labs, meds, conditions, appointments, document upload are partner-only; billing limited to ChargeItem create (no update); partner onboarding includes a proficiency demo before production; sandbox ~2 weeks; no webhooks (poll with `_lastUpdated`); 1,000 calls/min per key; proprietary API excludes ModMed GI (secondary). — [Cobalt: ModMed](https://explorer.usecobalt.com/ehr/modmed)
- ModMed requires partners to demonstrate reads and writes before go-live (vendor anecdote). — [Assort Health](https://www.assorthealth.com/blog/modmed-ehr-integration)

**Experity (urgent care)**
- Experity uses the Corepoint (Rhapsody) integration engine for HL7/X12 translation. — [Rhapsody case study](https://rhapsody.health/resources/experity/)
- Experity's May 2026 Partner Ecosystem names ChartSwap, Medallion, Flip, Master Clinicians; the announcement does not describe partner APIs or requirements and names no coding partners. — [Experity](https://www.experityhealth.com/news/experity-establishes-an-ai-driven-partner-ecosystem-designed-for-urgent-care/)

**Qualifacts (CareLogic / Credible / InSync, behavioral health)**
- CareLogic FHIR API: production access only for customers that licensed the CareLogic FHIR API (CareLogic Enterprise S3); developers register, get client ID/secret, sign a BAA; provider-facing or bulk apps need approval from the participating organization; sandbox available (official). — [Qualifacts CareLogic FHIR docs](https://documentation.qualifacts.com/platform/carelogic/carelogic-fhir.html)
- Qualifacts runs an integration marketplace (CareLogic, Credible, InSync), e.g., Inovalon for billing/eligibility. — [Qualifacts Marketplace](https://marketplace.qualifacts.com/)
- A third party describes the CareLogic partner path as formal (proposal, use-case review, partnership agreement) with no published approval timeline (secondary; conflicts with official sandbox statement). — [Integuru CareLogic guide](https://www.integuru.com/platform-api-guides/carelogic)

**Smaller / API-first EHRs (Elation, Canvas, Healthie, DrChrono, Tebra)**
- Elation: CPT and ICD-10 codes from the visit note become a "Superbill" in Elation Billing; only ICD-10 is sent to an integrated external PMS (official help). Third-party catalogs list `GET/POST/PATCH /bills/` and a "release-to-pms" action (secondary, unverified). — [Elation Help: Billing](https://help.elationhealth.com/articles/Elation-Billing-All-in-One); [apis.io Elation](https://apis.io/providers/elation-health/)
- Canvas Medical: billable notes create claims; creating an appointment via FHIR can auto-create the associated claim; a non-FHIR Note API exists (official docs). Third-party spec lists a FHIR `createClaim` operation (secondary). — [Canvas Note API](https://docs.canvasmedical.com/product-updates/note-api); [Canvas FHIR appointment claim creation](https://docs.canvasmedical.com/release-notes/fhir-apt-claim-creation/); [apis.io Canvas Claim](https://apis.io/apis/canvas-medical/canvas-medical-claim-api/)
- Healthie: GraphQL `createCms1500` takes CPT and ICD arrays; `CptCodesCms1500` carries fee, units, modifiers; automated CMS-1500 creation after appointment "Occurred" is in beta (official). — [Healthie createCms1500](https://docs.gethealthie.com/schema/createcms1500input.doc); [CptCodesCms1500](https://docs.gethealthie.com/schema/cptcodescms1500.doc); [Healthie billing automations](https://help.gethealthie.com/article/1096-insurance-billing-automations)
- DrChrono: API terms say it "may charge a fee" for API use/support; contact the company (official). — [DrChrono API terms](https://www.drchrono.com/api-development-terms-conditions/)
- Tebra: "API Partners will receive a monthly invoice from Tebra based on their usage of the API" (official partner terms, no rates). — [Tebra Partner Terms](https://www.tebra.com/tebra-partner-terms-and-conditions)

### Inferences
- Plain-English summary per EHR for the four MVP data needs:
  - athenahealth: (a) notes YES (encounter summary/documents API, FHIR DocumentReference); (b) problems/labs/meds YES; (c) coded charges pre-claim YES (claims/claimcharges reads; Claim Assistant checkpoint); (d) write corrected codes YES via proprietary claim/charge endpoints (contract required); (e) provider tasks: not confirmed in sources. Events: polling now, webhooks emerging.
  - eClinicalWorks: (a) YES via free certified FHIR; (b) YES; (c) PARTIAL (Claim read, ChargeItem declared; "paid" Encounter API); (d) contract-only ChargeItem create; (e) contract-only Task. No webhooks; 250 calls/min/practice means polling must be frugal.
  - Epic: (a) YES via FHIR DocumentReference or HL7 MDM feed; (b) YES via FHIR; (c) via outgoing financial transactions (customer-built HL7); (d) via Incoming Financial Transactions HL7 DFT, or Epic's charge-review/charge-update coding pattern; (e) coding query interface to message providers. Every step is per-health-system work by that system's Epic team.
  - NextGen/ModMed/Qualifacts: reads achievable via certified FHIR; any write needs partner program approval; ModMed charge write is create-only (no correction of an existing charge).
  - Experity: no public API; the realistic paths are HL7/flat files via the customer or partnering with Experity, which is building its own AI RCM.
- A pre-bill "correct the codes before submission" product needs a holding point. athenaOne (Claim Assistant/claim hold buckets), NextGen (pending charges holding tank) and Epic (charge review workqueues) all have native pre-claim holding points the product can slot into; the integration should aim to read at "note signed / charge created" and write before "claim created/released."
- Because ModMed's API reportedly only supports ChargeItem create (not update), "correction" there may have to be delivered as a flag/task for a biller rather than an automated edit.

### Gaps
- No primary-source confirmation of athenahealth partner fees (revenue share %, per-call fees) or official approval timelines; Marketplace partner page returned 403.
- Could not confirm athenahealth APIs for creating provider tasks/messages (e.g., patient case documents) from primary docs.
- Exact endpoint for modifying an existing (not-yet-submitted) charge in athenaOne vs. creating a new claim not confirmed.
- Experity API scope is undocumented publicly.
- NextGen Enterprise API endpoints for charges/encounter documents not found in public docs.
- The Epic page describing "charge review mode / charge update mode" for autonomous coding was seen only as a search excerpt; the precise fhir.epic.com/open.epic URL needs verification.

## 3. What do 21st Century Cures Act / ONC (g)(10) certified FHIR APIs actually let a third party read, do they expose billing codes, and do they allow write-back?

### Takeaway
(g)(10) APIs are read-only, standards-based FHIR APIs covering the USCDI clinical data set (problems, meds, labs, encounters, clinical notes) for single patients and bulk groups; they are free or near-free and are the fastest legal read path. They are not designed for billing: claims/charges are not part of US Core, write-back is explicitly excluded, and the only coded-visit data likely available is Encounter.type (which may carry a CPT E/M code) and encounter-diagnosis Conditions.

### Cited Findings
- (g)(10) "is limited to API-enabled 'read' services" and "specifically exclude[s] 'write' capabilities"; must support single-patient requests and multi-patient Bulk Data group export; system-level access uses SMART Backend Services; patient/user scopes use SMART App Launch 2.0.0; refresh tokens valid at least 3 months; base standard US Core 6.1.0 / USCDI v3, with US Core 7.0.0 and 8.0.1 approved via SVAP (official, test method updated May 15 2026). — [ONC (g)(10) test method](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services)
- Clinical note text must stay machine-readable (not converted to PDF) under the certification guidance (official). — [ONC (g)(10) test method](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services)
- HTI-2 proposed (2024) to add USCDI v4, SMART 2.2 and workflow capabilities such as subscriptions (proposed; final status not confirmed in this research). — [ONC HTI-2 task force slides](https://www.healthit.gov/sites/default/files/facas/2024-07-24_HTI-2_Proposed_Rule_TF_Group_2_Meeting_Slides_508.pdf)
- US Core servers SHALL support at least eight note types (Consultation, Discharge Summary, H&P, Procedures, Progress Note, Imaging, Lab, Pathology narratives) via DocumentReference (narrative notes such as progress notes) and DiagnosticReport; note content is returned as an attachment/URL (e.g., Binary). The guidance does not require linking notes to encounters. — [US Core 6.1 Clinical Notes](https://hl7.org/fhir/us/core/STU6.1/clinical-notes.html)
- US Core Encounter mandatory elements: status, class, type, patient; must-support: identifier, participant, period, reasonCode/reasonReference, dischargeDisposition, location; Encounter.diagnosis is not must-support (encounter diagnoses are exposed via the Condition Encounter Diagnosis profile); no billing guidance; Encounter.account not must-support. — [US Core 6.1 Encounter](https://hl7.org/fhir/us/core/STU6.1/StructureDefinition-us-core-encounter.html)
- The US Core Encounter Type value set includes SNOMED encounter procedures and CPT (including E/M 99201-99499) — so Encounter.type may carry the E/M code where the EHR populates it. — [US Core Encounter Type value set](https://hl7.org/fhir/us/core/STU6.1/ValueSet-us-core-encounter-type.html)
- Some vendors go beyond US Core: eCW's live CapabilityStatement declares Claim (read) and ChargeItem (secondary). — [Nirmitee](https://nirmitee.io/blog/eclinicalworks-integration-fhir-hl7-api-guide/)
- Separate certification criterion (b)(10) EHI Export requires certified products to export all electronic health information (EHI) for one patient or a population; EHI is tied to the HIPAA designated record set, which includes billing records. — [ONC Developer RoundTable slides, 2023 (official)](https://www.healthit.gov/sites/default/files/2023-07/ONC_Developer_RoundTable_7-12-2023_508.pdf); [Healthie (b)(10) explainer](https://help.gethealthie.com/article/1200-b10-electronic-health-information-export-on-healthie)
- ONC FAQ: a fee to perform a (b)(10) export for switching health IT or providing patients their EHI would not qualify for the information-blocking Fees Exception (official). — [ONC FAQ](https://healthit.gov/faq/are-contractual-fees-export-electronic-health-information-ehi-using-technology-not-certified-45/)
- Epic FHIR: most reads require a patient ID, no push for enrollment; write limited (Observation; DocumentReference.Create carries a warning) (secondary/expert). — [Keeler](https://healthapiguy.substack.com/p/an-epic-saga-the-startup-odyssey)

### Inferences
- For an MVP, (g)(10) FHIR is good for READ of signed notes, problems, meds, labs and the encounter shell, and is cheap to access on eCW, athena, ModMed and NextGen. It is not sufficient for (c) reading the actual billed CPT/ICD/modifier lines before claim submission (only partial: Encounter.type E/M and encounter-diagnosis Conditions, where populated) and gives no path for (d)/(e) write-back.
- Bulk FHIR ($export) is designed for population extracts (hours-to-daily cadence), not for intercepting each encounter in the hours between note signing and claim release; polling single-patient searches (e.g., Encounter by date, DocumentReference by date) is the near-real-time option, constrained by vendor rate limits (e.g., eCW 250/min/practice).
- (b)(10) EHI Export is a useful fallback for historical backfill/training data (including billing records), but it is a batch export, not a workflow integration.
- Information-blocking rules help a startup argue for access when a customer (the covered entity) requests it, but they do not oblige a vendor to provide write access.

### Gaps
- Did not verify the final HTI-2/HTI-4 status (e.g., whether FHIR Subscriptions became required) or exact USCDI version deadlines beyond the ONC test-method page.
- No primary data on how many ambulatory EHRs actually populate Encounter.type with CPT codes via FHIR.

## 4. Alternatives startups actually use: HL7v2 feeds, SFTP/flat files, reporting DBs, RPA/browser automation, and integration platforms/aggregators — costs and fitness for reading notes and writing back charges

### Takeaway
HL7v2 feeds (MDM for notes, DFT for charges, ADT for visits, ORU for results) are the long-standing workhorse for coding vendors and are how Epic explicitly supports coding write-back, but each interface is set up per customer and may carry EHR vendor interface fees. Integration platforms (Redox) normalize HL7/FHIR across EHRs (including Financial.Transaction and Notes models) at roughly $30K-$150K/yr. Network aggregators (Particle, Metriport, Health Gorilla) pull records via national exchanges but are built for treatment-purpose record retrieval, not for same-day pre-bill charge interception or charge write-back. RPA/unofficial APIs are fastest to build (days-weeks) but fragile and contractually risky.

### Cited Findings
**HL7v2 / interfaces**
- Epic open.epic lists 99 HL7v2 and 46 X12 interfaces documented for free; HL7v2 listings require a manual customer step (expert blog). — [Keeler](https://healthapiguy.substack.com/p/an-epic-saga-the-startup-odyssey)
- DFT (Detailed Financial Transaction, e.g., DFT^P03 "post detail financial transaction") is the HL7v2 message for charge capture (secondary). — [Nirmitee: Epic Bridges](https://nirmitee.io/blog/epic-bridges-integration/)
- Epic Outgoing Documentation sends MDM note messages as saved/modified (official). — [open.epic HL7v2](https://open.epic.com/Interface/HL7v2)
- athenahealth's certified health IT cost disclosure (for athenaPractice/athenaFlow) says if data comes from another system, "one-time interface configuration costs, and an annual maintenance fee will apply" (official, legacy products). — [athenahealth Certified Health IT Costs and Limitations](https://www.athenahealth.com/sites/default/files/media_docs/Certified%20Health%20IT%20Costs%20and%20Limitations%20athenaPractice%20and%20athenaFlow.pdf)
- eCW's ONC disclosure says HL7 interfaces "may" carry costs and require a statement of work; eCW publishes no public HL7v2 spec (secondary summary of eCW disclosure). — [Nirmitee](https://nirmitee.io/blog/eclinicalworks-integration-fhir-hl7-api-guide/); [eCW ONC cost disclosure PDF Nov 2025](https://www.eclinicalworks.com/wp-content/uploads/2025/12/ecw-onc-health-it-certification-details-and-additional-costs-disclosures-nov-2025.pdf)
- Anecdotes: eCW CEO historically said eCW does not charge doctors for interfaces but asks labs/dictation companies to pay (dated); an EyeMD practice note calls the eCW interface "VERY expensive" with a 4-5 month install estimate (anecdotal). — [Dark Daily](https://www.darkdaily.com/experts-say-vendors-charge-excessive-fees-to-interface-ehrs-with-clinical-); [EyeMD KB](https://kb.eyemdemr.com/?p=54)
- An integration consultancy estimates a one-direction HL7v2 interface at ~$8K-$15K build and $3K-$15K/yr maintenance per interface (secondary, commercial interest). — [Taction EHR integration cost guide](https://www.tactionsoft.com/ehr-integration-cost-guide/)
- HL7v2 ADT/lab feeds typically run through an engine like Mirth Connect and take days-weeks to set up (vendor blog). — [Integuru](https://www.integuru.com/blog/ehr-integration-healthcare-ai)

**Reporting database access**
- Epic Kit gives SQL access to Caboodle (normalized dataset); direct Clarity access is rare for vendors. — [Keeler](https://healthapiguy.substack.com/p/an-epic-saga-the-startup-odyssey)

**RPA / unofficial APIs using customer credentials**
- Browser automation (Puppeteer/Playwright/Selenium) builds in ~2-4 weeks but "most teams see it break within the same quarter"; athenahealth, eCW and NextGen change UIs via A/B tests and staged rollouts; session expiry and mid-session 2FA add failure points (vendor blog, Jun 17 2026). — [Integuru](https://www.integuru.com/blog/ehr-integration-healthcare-ai)
- Reverse-engineered internal HTTP APIs: claimed under one day to production with no vendor certification; example Penciled (PT scheduling) cut EHR actions from 30-40s to ~3s (vendor self-report; article does not address terms-of-service risk). — [Integuru](https://www.integuru.com/blog/ehr-integration-healthcare-ai)
- Some RCM vendors openly use browser automation: QuickRCM "logs into the EHR's web portal like a human when no API exists" (vendor self-description). — [QuickIntell](https://quickintell.com/ehr-integration)
- Supergood and Cobalt sell unofficial API layers for EHRs (e.g., athenahealth, ModMed, Availity, Waystar) (vendor pages). — [Supergood athenahealth](https://supergood.ai/api-report-card/athenahealth); [Supergood Waystar](https://docs.supergood.ai/waystar-api)

**Integration platforms / aggregators**
- Redox: no public pricing; Vendr transaction data median ~$52,500/yr (range ~$12K-$148K); ~$30K for 1-3 integrations up to $200K+ enterprise; priced on number of integrations, volume, support. — [Vendr: Redox](https://www.vendr.com/marketplace/redox)
- Sidebench (Jun 2026) lists Redox at ~$50K setup plus per-transaction pricing and Particle at ~$30K setup plus per-call (consultancy estimate). — [Sidebench](https://sidebench.com/ehr-integration-cost-bands-2026/)
- Redox reportedly averages 6-10 weeks kickoff to go-live (secondary). — [Taction: Redox](https://www.tactionsoft.com/blog/redox-integration/)
- Redox data models include Financial (Transaction, AccountUpdate), Notes (New, Replace, Delete, Query), Claim (SubmissionBatch, PaymentBatch), Clinical Summary, Results, PatientAdmin (official). — [Redox Data Models](https://developer.redoxengine.com/data-models/)
- Particle and Metriport require a HIPAA treatment purpose of use (acting for a covered entity with an NPI) to query national networks (Carequality/CommonWell); Health Gorilla production requires a negotiated paid contract, vetting and BAA. Particle reportedly ~$1/query with ~$60K/yr minimum (estimate from a competitor's comparison page). — [Medblocks comparison (competitor page)](https://medblocks.com/docs/comparisons/health-gorilla); [Metriport](https://www.metriport.com/medical)
- Metriport's launch: charges only for queries that return at least one record; no charge for sharing data back to the networks. — [HN: Launch HN Metriport](https://news.ycombinator.com/item?id=40456064)
- Health Gorilla: customers can push C-CDA or FHIR resources which it distributes via its QHIO (TEFCA) (official product documentation). — [Health Gorilla product documentation](https://healthgorilla.com/home/policies/product-documentation)

### Inferences
- For a pre-bill coding product the fit ranking is: (1) EHR-native partner API (athena) or customer-built HL7 MDM-out + DFT/financial-in (Epic-style) — both support read-notes and write-charges; (2) Redox as a normalizing layer when selling to multiple health systems on Epic/Cerner/NextGen where HL7 feeds exist; (3) FHIR (g)(10) for read-only pilots ("shadow mode" coding audits that show what would have changed); (4) RPA for long-tail EHRs or as a pilot bridge, with clear ToS/credential risk.
- Network aggregators (Particle/Metriport/Health Gorilla) are a poor fit: they return records shared to HIEs (often C-CDA summaries after the fact), cannot see the pending charge in the PM system, and cannot write back charges. They could supplement prior-history context (e.g., HCC-relevant chronic conditions).
- SFTP/flat-file exports (daily charge/encounter extracts) suit retrospective audit products and initial pilots, but add latency that conflicts with "fix before the claim drops" unless the practice holds claims for a review window.

### Gaps
- No public per-message or per-connection pricing for Redox's Financial/Notes models; Keragon, 1upHealth pricing and suitability were not researched in depth.
- No primary source on SFTP export capabilities per EHR (e.g., athenahealth data view/reporting extracts, eCW reporting DB).
- Legal/ToS analysis of RPA with customer credentials per EHR contract was not found in public sources.

## 5. Could the product intercept at the claim/clearinghouse stage instead of the EHR (Availity, Waystar, Change/Optum, Stedi, Office Ally)? Pros and cons

### Takeaway
Claim-stage interception is technically feasible (the 837 claim already carries CPT, ICD-10 and modifiers, and APIs like Stedi make submission and validation cheap) and it is an established insertion point (Epic integrates third-party claim scrubbers). But it loses the clinical note (the evidence needed for coding review), comes after the practice has "finalized" the charge, and is unavailable for athenaOne practices whose claims flow through athenahealth's own rules engine and clearinghouse. Best used as a complementary channel, not the primary MVP integration.

### Cited Findings
- Epic's Outgoing Claim Scrubber Query integrates third-party scrubbers (Experian Health, Optum, RCxRules, White Plume, Netwerkes) into Resolute billing workflows (official). — [open.epic Financial/Coding](https://open.epic.com/Financial/Coding)
- athenaOne runs its own Rules Engine at charge entry, can place claims in hold buckets, and athenahealth files claims through its integrated clearinghouse or directly to payers (official help + secondary review). — [athenahealth Claim Rules](https://help.athenahealth.com/Ohelp/Content/Features/Claim_Rules_A.htm); [Business News Daily (secondary)](https://www.businessnewsdaily.com/11113-best-medical-software-billing.html)
- Stedi: pay-as-you-go claim submission (837P/837I/837D), no monthly minimums or setup fees; cached pricing showed $0.30/claim at 1-500 claims/month down to $0.10 at 10,001+ (may be stale); enhanced edits before sending to payer; a "Validate Professional Claim (CMS-1500)" JSON endpoint; claims endpoints share a 100 req/s limit (official). — [Stedi pricing](https://www.stedi.com/pricing); [Stedi claims](https://www.stedi.com/claims); [Stedi CMS-1500 endpoints](https://www.stedi.com/blog/introducing-the-cms-1500-professional-claim-api-endpoints)
- Stedi eliminated its $500/month minimum for production API access (secondary, ~mid-2026). — [RevCycleAI](https://revcycleai.com/blog/stedi-pay-as-you-go-pricing-rcm-implications/)
- Waystar integrations span REST, web services, HL7, sFTP/batch, RPA and X12; API specs and sandbox sit behind registration and a signed partnership (secondary). — [apis.io Waystar](https://apis.io/providers/waystar/)
- Availity supports real-time (B2B/API) or batch EDI 837 submission (payer guide). — [Humana: Register for Availity](https://assets.humana.com/is/content/humana/Learn_how_to_register_for_Availitypdf)

### Inferences
- Pros of claim-stage: one integration (837 stream or clearinghouse partnership) covers any EHR whose practice uses that clearinghouse; codes are already structured; cheap APIs (Stedi). Cons: (1) no access to note text, so the AI cannot verify documentation support without a second EHR integration; (2) correcting a claim at the clearinghouse diverges the claim from the EHR/PM record (audit and reconciliation problem, payments post against a different charge); (3) clearinghouse choice is the practice's, and switching clearinghouses is a heavy sale; (4) athenaOne and other integrated PM/clearinghouse bundles (athena, Experity RCM, Tebra) block this path; (5) Change Healthcare-style concentration risk.
- A hybrid that may work: read notes via FHIR/EHR API + read the outbound 837 via a clearinghouse "pass-through" to catch discrepancies, and route corrections back to the biller as a hold/task rather than editing the 837 directly.

### Gaps
- No authoritative source on whether Availity/Waystar/Office Ally permit third parties to hold and modify claims in transit, or on their partner fees.
- No source quantifying how often small practices use stand-alone vs. EHR-bundled clearinghouses.

## 6. Typical integration timelines, costs, and contractual requirements (BAA, security reviews)

### Takeaway
A read-only integration to one EHR typically takes ~1-4 months and tens of thousands of dollars; bidirectional (write-back) integrations take ~3-9 months and $100K+, with vendor approval and per-customer security review/activation as the long poles. Expect a BAA with every customer and integration vendor, security questionnaires (often SOC 2/HITRUST evidence), and per-practice enablement even after vendor approval.

### Cited Findings
- Consultancy engagement bands (Jun 2026): read-only single EHR $80K-$200K, 8-16 weeks; bidirectional single EHR $200K-$500K, 14-24 weeks; multi-EHR with patient identity $400K-$1.2M, 24-40 weeks; Epic Connection Hub listing 8-16 weeks; athenahealth Marketplace certification 10-22 weeks; bidirectional Epic integration kickoff to first production data 6-9 months; health-system security review 3-12 weeks; BAA required for every vendor touching PHI and often the slowest customer-side step (consultancy estimates). — [Sidebench](https://sidebench.com/ehr-integration-cost-bands-2026/)
- eCW: certified read-only app ~5-9 weeks to first live practice; contracted writes 3-6 months (mostly contracting and per-practice activation); first production integration ~$35K-$110K (author estimates). — [Nirmitee eCW guide](https://nirmitee.io/blog/eclinicalworks-integration-fhir-hl7-api-guide/)
- athenahealth: Marketplace approval 6-12 weeks incl. technical, security, UX (embedded apps) and compliance review; integration projects $25K-$200K; hosting/monitoring $500-$3,000/month; per-practice field mapping $1K-$3K (author estimates). — [Taction](https://www.tactionsoft.com/blog/athenahealth-api-integration-guide/)
- Epic formal certification via the app program takes 3-6+ months (vendor blog). — [Integuru](https://www.integuru.com/blog/ehr-integration-healthcare-ai)
- Epic: Vendor Services ~$1,700-$1,900/yr plus transactional API fees; Connection Hub $500/yr; Toolbox adds non-competes and fees; App Orchard formerly took up to 30% revenue share. — [Keeler](https://healthapiguy.substack.com/p/an-epic-saga-the-startup-odyssey); [Nirmitee](https://nirmitee.io/blog/how-to-get-your-app-into-epic/)
- athenahealth (dated official): partners must hold a signed contract with the client plus client consent before connection; HITRUST self-assessment within 90 days of GA. — [athenahealth Marketplace FAQ](https://www.athenahealth.com/~/media/athenaweb/files/marketplace/pdfs/marketplacefaq040416.pdf)
- athenahealth production access needs Platform Services contract + BAA (secondary). — [Cobalt](https://explorer.usecobalt.com/ehr/athenahealth)
- Qualifacts CareLogic FHIR requires developer BAA and organization approval for provider-facing/bulk apps (official). — [Qualifacts](https://documentation.qualifacts.com/platform/carelogic/carelogic-fhir.html)
- ModMed requires partner onboarding and a proficiency demo before production; sandbox ~2 weeks (secondary). — [Cobalt: ModMed](https://explorer.usecobalt.com/ehr/modmed)
- Redox implementation 6-10 weeks; Redox annual median ~$52.5K (secondary). — [Taction: Redox](https://www.tactionsoft.com/blog/redox-integration/); [Vendr](https://www.vendr.com/marketplace/redox)
- RPA: 2-4 weeks to build; frequent breakage (vendor blog). — [Integuru](https://www.integuru.com/blog/ehr-integration-healthcare-ai)

### Inferences
- The startup's true gating items are (1) a first design-partner practice willing to sponsor access, sign a BAA and enable the app; (2) the EHR vendor's partner contract (athena Platform Services, eCW write contract, ModMed synapSYS, NextGen Distributor); (3) security evidence (SOC 2 Type I/II, pen test, HIPAA policies). Engineering is often not the critical path.
- Consultancy cost bands (Sidebench, Taction, Nirmitee) are sales estimates from firms that sell integration services and likely overstate cost for a capable in-house team building against one well-documented API; treat as ceilings.

### Gaps
- No first-hand startup post-mortems (HN/Reddit) with verified athenahealth or eCW timelines were found; data here is consultancy/vendor-reported.
- No public data on typical security-questionnaire scope for small independent practices (vs. health systems).

## 7. Synthesis: integration map and fastest path for a small-team MVP

### Takeaway
Fastest credible MVP path: start on athenahealth (sandbox now; Marketplace/Platform Services partner track for production; read encounter docs + claim charges; write charges via claim endpoints; poll changed-data feeds) with one or two athenaOne design-partner practices, and in parallel run read-only "shadow" audits on eClinicalWorks practices via free certified FHIR (notes, problems, encounter diagnoses) while negotiating eCW's write contract. Defer Epic (health-system sales, HL7 DFT/MDM per customer) and Experity (no API; building own AI RCM) until after product-market fit, using Redox if multiple Epic/NextGen customers arrive.

### Cited Findings
- A direct competitor (Charta Health) already operates a pre-bill AI chart review product inside athenaOne via the athenahealth Marketplace, writing corrections directly in the EHR, validating that the athena path supports this use case. — [Charta Health, Jun 2026](https://www.chartahealth.com/resources/charta-health-athenahealth-marketplace)
- athenahealth sandbox is auto-provisioned; billing write (charge entry, claim creation) exists in the proprietary API. — [Cobalt: athenahealth](https://explorer.usecobalt.com/ehr/athenahealth)
- eCW certified FHIR reads are free and partner status is not required; writes need a contract. — [eCW (official)](https://www.eclinicalworks.com/resources/certified-ehr-technology/); [Nirmitee](https://nirmitee.io/blog/eclinicalworks-integration-fhir-hl7-api-guide/)
- Epic supports coding-vendor write-back via Incoming Financial Transactions and coding interfaces but each is customer-implemented. — [open.epic HL7v2](https://open.epic.com/Interface/HL7v2); [open.epic Coding](https://open.epic.com/Financial/Coding)
- Experity is acquiring AI RCM capability (Exdion). — [PR Newswire](https://www.prnewswire.com/news-releases/experity-acquires-exdion-healthcare-to-accelerate-ai-driven-revenue-cycle-management-automation-for-on-demand-care-302815075.html)

### Inferences
**Integration map (MVP priority order)**

| Priority | EHR | Read notes/clinical | Read pre-claim codes | Write corrected codes | Provider task/message | Event trigger | Access path & cost signal |
|---|---|---|---|---|---|---|---|
| 1 | athenahealth | Proprietary API + FHIR | Claims/claimcharges API | Claim/charge create via API (contract) | Not confirmed | Changed-data polling; FHIR webhooks emerging | Self-serve sandbox; Platform Services/Marketplace contract + BAA; possible rev share/per-call fees (unverified) |
| 2 | eClinicalWorks | Free certified FHIR (DocumentReference) | Partial (Claim read, paid Encounter API) | ChargeItem create via write contract | Task via contract | None (poll; 250 calls/min/practice) | Free reads; write contract via interop@eclinicalworks.com |
| 3 | NextGen | Certified FHIR | Not public | Distributor program (fees TBD) | Unknown | Unknown | API Distributor Program; per-practice fees reported (unverified) |
| 3 | ModMed (derm) | Proprietary partner API | Not public | ChargeItem create only (no update) | Not mentioned | None (poll) | synapSYS partner + proficiency demo; ~2 wk sandbox |
| 4 | Epic (ambulatory/Community Connect) | FHIR DocumentReference or HL7 MDM | Outgoing financial transactions (charge review) | Incoming Financial Transactions (DFT) | Coding query interface | MDM on note save / encounter close | Per health system; Vendor Services ~$1.7-1.9K/yr; Connection Hub $500/yr after first live customer |
| 5 | Experity (urgent care) | No public API | No public API | No public API | No | No | Partner directly; HL7/files via customer; competitor risk |
| 5 | Qualifacts CareLogic (behavioral) | Licensed FHIR API | Not public | Not public | Not public | Not public | Customer must license FHIR API; BAA |
| Long tail | Elation, Canvas, Healthie, DrChrono, Tebra | Open APIs | Bills/CMS-1500 objects | Bills/CMS-1500 create/update (Healthie, Elation per 3rd party) | Varies | Varies | Usage-based or "may charge" fees |

**Fastest path for a small team (inference)**
1. Weeks 0-4: build against athenahealth sandbox and eCW FHIR sandbox; ship a read-only "shadow audit" (pull signed notes + encounter codes, show the coder what would change).
2. Weeks 4-16: sign 1-2 athenaOne design partners; apply for athenahealth partner/Platform Services access; implement write-back as "propose correction → biller approves → API writes claim charges" (mirrors the Nanonets dry-run/approve pattern), triggered by changed-data polling for signed encounters; use athenaOne claim holds so claims do not drop before review.
3. In parallel: negotiate eCW write contract (ChargeItem/Task); until then deliver corrections as reports/tasks to billers.
4. Later: Epic via HL7 (MDM out, DFT in) through each health system's interface team or Redox; specialty EHRs (ModMed, Experity, Qualifacts) by segment.
5. Avoid relying on RPA in production for write-back to the billing ledger (fragility + contractual risk); acceptable only as a temporary bridge for reads.

### Plain-English glossary (for non-healthcare readers)
- EHR (electronic health record): software where clinicians document visits (notes, problems, meds, labs). PM (practice management): the billing/scheduling side where charges become claims. Many outpatient products (athenaOne, eCW, NextGen) bundle both.
- Encounter / visit: one patient visit. Charge: a billable line (CPT procedure code + ICD-10 diagnosis codes + modifiers + units). Claim: the bill sent to the insurer, built from charges.
- CPT: procedure/service codes (e.g., 99213 office visit). ICD-10-CM: diagnosis codes. Modifier: 2-character add-on that changes how a CPT is paid (e.g., -25).
- Pre-bill review: checking/correcting codes after the doctor signs the note but before the claim is sent.
- FHIR: modern web API standard (JSON over HTTPS) for health data. US Core: the US profile of FHIR that certified EHRs must support. USCDI: the federal list of data elements those APIs must expose.
- (g)(10): the ONC certification rule requiring EHRs to offer read-only FHIR APIs (single patient and bulk). (b)(10): rule requiring a full data export of all electronic health info, incl. billing records.
- SMART on FHIR: OAuth-based way for apps to log in and launch inside an EHR. Backend Services: server-to-server access without a user.
- Bulk FHIR ($export): asynchronous export of data for a whole patient group.
- HL7v2: older pipe-delimited messaging standard used by interface engines. ADT = admit/visit events; ORU = results; MDM = documents/notes; DFT = financial transactions/charges.
- Clearinghouse: middleman that formats and routes claims (X12 837) to insurers and returns remittances (835). Claim scrubber: rules engine that checks claims for errors before sending.
- BAA (Business Associate Agreement): HIPAA contract required before a vendor can handle patient data for a provider.
- RPA: software robots that click through the EHR's web UI using a user's login.
- Marketplace/partner program: the EHR vendor's app store and contract that grants production API access.

### Gaps
- Whether athenahealth's Marketplace imposes revenue share/per-call fees on a pre-bill coding app (and amounts) must be confirmed directly with athenahealth partner team.
- Whether athenaOne APIs can modify an existing unsubmitted charge (vs. creating a claim) and create provider tasks needs confirmation in the athenahealth developer portal (login required).
- eCW write-contract pricing and turnaround are unpublished.
