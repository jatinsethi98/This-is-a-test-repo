# The Code-Content Industry and Access Infrastructure for US Medical Code Sets

Research date: 2026-10-21. US only. Every claim has a URL. Vendor claims, market-research estimates, and second-hand reports are flagged. "[search snippet]" means the page blocked direct fetching (for example, AMA's compliance site sits behind a Cloudflare challenge), so the figure comes from the search engine's extract of that URL and should be re-checked before anyone relies on it.

---

## 1. The money: what the AMA earns from CPT, the coding-book business, and the size of the encoder and coding-software market

### Terms in plain English
- **CPT (Current Procedural Terminology)**: the 5-character codes US doctors and outpatient facilities use to say *what they did* (an office visit, an MRI, a knee surgery). The American Medical Association (AMA) writes it, owns the copyright, and charges licence fees for using it electronically. [AMA licensing FAQ](https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs)
- **Royalty**: a fee paid to the copyright owner each time (or each year, or for each user) its content is used inside a product.
- **Encoder**: software that helps a human coder find the right code. It walks through the code book's index and rules ("is this the left or right side?") and checks edits. For example, Solventum's CodeFinder is described as a built-in encoder plus DRG grouping. [Solventum CodeFinder](https://www.solventum.com/en-ie/home/health-information-technology/solutions/codefinder) [search snippet]
- **Grouper**: software that takes a hospital stay's codes and assigns a payment category, such as a DRG (Diagnosis-Related Group) or APR-DRG (All Patient Refined DRG). The category drives what the hospital is paid.
- **CAC (computer-assisted coding)**: software, now usually NLP or AI, that reads clinical notes and suggests codes for a human to confirm.

### Takeaway
The AMA does not report CPT-only revenue, but its audited statements show about $296M in 2025 from the "Books and Digital Content" unit (CPT books, data files and royalties), with a contribution margin of about $268M. The broader "Royalties and credentialing products" line was $340.9M, about 64% of the AMA's $536.4M total revenue. That line has grown every year shown: $245M (2020) → $341M (2025). The biggest public "pure-ish" comparable in coding software is Solventum's Health Information Systems segment, at $1.36B of sales in 2025. Market-research sizings for coding software range from about $1.5B to $5B and do not agree on scope.

### Cited Findings
**AMA revenue (audited consolidated statements, the primary source)**
- 2025 vs 2024: total revenues $536.4M vs $513.2M. "Royalties and credentialing products" $340.9M vs $326.0M. "Books, newsletters and online product sales" $23.7M vs $22.1M. — [AMA 2025 Annual Report](https://www.ama-assn.org/system/files/2025-ama-annual-report.pdf)
- 2025 segment data: the "Books and Digital Content" unit (coding books and tools, workshops, licensed data files) had revenue of $296.4M (2024: $280.5M) and a contribution margin of $267.5M (2024: $251.1M). The AMA says "Royalties, coding book sales, and digital content sales drove a $15.9 million revenue increase, as the market for electronic use of digital coding products continues to expand. A three percent price increase as well as phasing in previous pricing model changes were also factors." — [AMA 2025 Annual Report](https://www.ama-assn.org/system/files/2025-ama-annual-report.pdf)
- The AMA defines the separate "Database Products" line as royalties from licensed data sales (for example, physician data) plus credentialing. It had 2025 revenue of $68.6M (2024: $68.2M) and a contribution margin of $51.4M. So "Royalties and credentialing products" mixes CPT with non-CPT data and credentialing products. — [AMA 2025 Annual Report](https://www.ama-assn.org/system/files/2025-ama-annual-report.pdf)
- 2024 vs 2023: total revenues $513.2M vs $495.1M. Royalties and credentialing products $326.0M vs $308.0M. Books, newsletters and online product sales $22.1M vs $23.8M. Membership dues $32.5M vs $33.3M. — [AMA 2024 Annual Report](https://www.ama-assn.org/system/files/2024-ama-annual-report.pdf)
- 2021 vs 2020: total revenues $459.7M vs $433.4M. Royalties and credentialing products $270.5M vs $245.1M. The Books and Digital Content unit's revenue rose $21.8M and its contribution margin rose $22.5M to $209.2M. The AMA said "A change in the pricing models and phasing in previous pricing models' changes were also key factors", that print coding-book sales were declining as users moved to digital, and that "AMA exited the retail print book business in mid-2021." — [AMA 2021 Annual Report](https://www.ama-assn.org/system/files/2021-ama-annual-report.pdf)
- A different accounting basis gives different totals. Paddock Post, using the AMA's IRS Form 990, reports 2024 total revenue of $546M (this includes about $93M of investment gains) and "royalties" of $301M (55%). It notes that dues were only about $33M (6%). — [Paddock Post](https://paddockpost.com/2026/05/23/executive-compensation-at-the-american-medical-association-ama-2024/). *Conflict note:* the $546M and $301M figures are Form 990 figures, not the audited GAAP figures above ($513.2M and $326.0M). The report writer should cite the audited figures.
- Press shorthand: "about $300 million a year" in CPT royalties, attributed to The Washington Post. — [Healthcare Dive, Aug 14 2026](https://www.healthcaredive.com/news/patient-rights-advocate-sues-ama-cpt-billing-codes-copyright/827830/); [Plagiarism Today, Aug 18 2026](https://www.plagiarismtoday.com/2026/08/18/the-copyright-fight-over-medical-billing-codes/)
- Senator Cassidy (chair of the Senate HELP Committee) wrote that in 2024 the "AMA generated total revenue of $513.2 million. $281.4 million of that" came from books and digital content. He said the AMA "does not provide transparency about how many millions in revenues it receives from licensing CPT products," and asked for CPT-specific revenue and 5-year trends (letter dated Oct 6 2025). — [Cassidy letter to AMA](https://www.help.senate.gov/imo/media/doc/cassidy_letter_to_ama_on_cpt_monopoly.pdf). *Minor discrepancy:* Cassidy's $281.4M differs from the $280.5M for 2024 shown in the AMA's 2025 report, probably a restatement.

**Coding books and reference tools**
- AMA's own book and online product sales are small next to royalties: $23.7M in 2025. In 2025 the AMA cited "improved coding book sales." — [AMA 2025 Annual Report](https://www.ama-assn.org/system/files/2025-ama-annual-report.pdf)
- Example retail price: a physical CPT codebook is cited at $137.89. — [Healthcare Dive](https://www.healthcaredive.com/news/patient-rights-advocate-sues-ama-cpt-billing-codes-copyright/827830/)
- AMA licence FAQ: CPT codebooks such as *CPT Professional Edition* "are for reference only." Buying a book does not license electronic use. — [AMA CPT licensing FAQ](https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs)

**Encoder and coding-software market**
- Solventum (the former 3M Health Information Systems, spun off from 3M with regular-way trading from April 1, 2024) reported Health Information Systems net sales of $1,360M (2025), $1,306M (2024) and $1,285M (2023). Segment operating income was $496M, a 36.5% margin. Growth was "driven by expanded adoption of our Solventum™ 360 Encompass™ and performance management solutions," while "clinician productivity solutions declined." The segment covers "computer-assisted physician documentation, direct-to-bill and coding automation, classification methodologies, speech recognition, and data visualization." That is broader than encoders alone. — [Solventum FY2025 Form 10-K](https://www.sec.gov/Archives/edgar/data/1964738/000196473826000007/solv-20251231.htm)
- **Market-research estimates (treat with caution; scopes differ and methods are opaque):**
  - Computer-assisted coding: USD 1.61B in 2025 → USD 3.00B by 2032 (9.3% CAGR). — [Report Prime](https://www.reportprime.com/computer-assisted-coding-r22619)
  - Computer-assisted coding: $4.2B in 2025 → $10.8B by 2034 (11.8% CAGR). — [Marketintelo](https://marketintelo.com/report/computer-assisted-coding-market)
  - "Medical computer assisted coding solutions": USD 5,073M in 2026 → USD 13,216M by 2035. — [Market Reports World](https://www.marketreportsworld.com/market-reports/medical-computer-assisted-coding-solutions-market-14728400)
  - One report splits "medical coding software" into integrated CAC vs **standalone encoder** software, but its figures sit behind a paywall. — [GII Research](https://www.giiresearch.com/report/coh2055106-medical-coding-software-market-by-product-type-by.html)

### Inferences
- The best public proxy for "CPT money" is the AMA's Books and Digital Content unit: about $296M of revenue in 2025 at roughly 90% contribution margin ($267.5M ÷ $296.4M). The AMA's own explanations of growth keep pointing to price increases and pricing-model changes rather than new products. This makes CPT the AMA's main financial engine; dues are about 6% of revenue.
- Market-research figures differ by roughly 3× for the "same" market. A founder's deck should anchor on audited numbers (Solventum's HIS segment, the AMA's statements) and use market-research figures only as clearly labelled ranges.
- CPT's revenue rides on regulation: every HIPAA-covered claim needs CPT (see Q6). That is why it draws political and legal challenges (Cassidy letters 2025, the CMS request for information and the PatientRightsAdvocate.org lawsuit in 2026). It is also why the licence cost is a near-certain line item for any billing startup for the foreseeable future.

### Gaps
- The AMA does not separately disclose CPT-only revenue, licensee counts, or user counts. Cassidy asked for these, and I found no public AMA answer.
- No reliable public figures for Optum's coding and encoder revenue: Optum360 is inside UnitedHealth's Optum Insight and is not broken out.
- No credible public sizing of the coding-*book* market (AAPC, Optum, Elsevier and AMA print) beyond the AMA's own $23.7M line.
- I did not research Elsevier's coding products (Buck's coding books and ICD-10/CPT training content). They are not covered here.

---

## 2. Commercial content and encoder vendors: what they sell, to whom, API availability, and public pricing

### Terms in plain English
- **Code content / data files**: licensed electronic files containing codes, descriptions, rules and fee values, refreshed on each release, that software vendors load into their products.
- **Clinical interface terminology**: a big dictionary of doctor-friendly phrases ("chest pain, left-sided, exertional") behind the clinician's search box, each pre-mapped to billing codes (ICD-10-CM) and clinical codes (SNOMED CT).
- **Terminology management / mapping platform**: software for hospitals, payers and vendors to load many code systems, keep them updated, and map local codes ("LAB123") to standard ones (LOINC).
- **Claims editing / claim scrubber**: rules software that checks a claim before it is sent (or, at a payer, before it is paid), for example code pairs that can't be billed together.
- **RBRVS / RVU**: Resource-Based Relative Value Scale, Medicare's point system for valuing physician services. RVUs (relative value units) × a dollar conversion factor = fee.

### Takeaway
Two kinds of business sit on top of the free government files and the AMA's CPT licence:
- **Encoder and coding-workflow vendors**, mostly sold to coders and hospitals: Optum EncoderPro, Solventum 360 Encompass/CodeFinder, TruCode, AAPC Codify and Find-A-Code.
- **Terminology, mapping and content vendors**, mostly sold to EHR and IT vendors, payers and health systems: IMO Health, Wolters Kluwer Health Language, Clinical Architecture and Apelon.

Public pricing exists only for individual-coder web subscriptions (about $10–$83/month). Data files, APIs and OEM licences are all "call sales." A newer wave of developer-focused APIs (OMOPHub, AutoICD, NLM Clinical Tables, ICD10api, Vitalware/Health Catalyst) mostly avoids CPT descriptors or leaves the CPT licence to the customer.

### Cited Findings
**Optum (UnitedHealth Group; "Optum360" / optumcoding.com)**
- EncoderPro.com is an annual per-user subscription in tiers. Optum's competitive comparison sheet lists 12-month single-user prices around Standard $299.95, Professional $549.95 and Expert $999.95, but other tables in the same sheet show different numbers. Optum says pricing is "for reference only" and subject to change. — [Optum EncoderPro competitive comparison](https://www.optumcoding.com/upload/docs/Optum360_EncoderPro.com_Competitive_Comparison_HR.pdf) [search snippet]
- A reseller (MicroMD) offers EncoderPro at 25% off Optum retail, about $224.96, $412.46 and $749.96 per user. — [MicroMD](https://www.micromd.com/encoderpro/) [search snippet]
- Optum sells "data files" (code, billing and fee data designed for payer and EMR systems), including Medicare fee files and CPT modifier crosswalks. — [Optum360 Data Files Brochure](https://optumcoding.com/upload/docs/Optum360_Data_Files_Brochure.pdf) [search snippet]
- "Essential RBRVS" data file: relative values for CMS-valued codes plus "gap" values for codes Medicare doesn't price, payment indicators (global days, multiple-procedure reductions), with multi-user licensing. — [Optum Essential RBRVS](https://www.optumcoding.com/product/17922/) [search snippet]
- Optum's public data-and-web-services pricing page shows every data file product as "CALL", with no dollar amounts. — [Optum data & web services pricing](https://www.optumcoding.com/data-and-web-services/pricing/)
- Claims Edit System (CES): automated claim editing for professional, facility, Medicare and Medicaid claims, sold to health plans. New rules are delivered quarterly, or more often for urgent regulatory changes. — [Optum CES](https://optum.com/business/health-plans/claims-payment-accuracy/claims-edit-system.html); [CES Professional Claims fact sheet](https://www.optum.com/content/dam/optum3/optum/en/resources/white-papers/CES_Professional_Claims.pdf) [search snippets]

**Solventum (formerly 3M Health Information Systems)**
- 360 Encompass is the hospital coding, CDI and CAC platform. CodeFinder is the encoder/"coding engine" for 360 Encompass, with built-in DRG grouping. — [Solventum CodeFinder](https://www.solventum.com/en-ie/home/health-information-technology/solutions/codefinder); [CodeFinder fact sheet](https://assets.solventum.com/is/content/mmmspinco/codefinder-software-fact-sheet-his-rc-en-sapdf) [search snippets]
- APR-DRG grouper: Solventum's proprietary classification, licensed by third parties. For example, Strata Decision added "Solventum APR DRGs" to its platform. — [Strata Decision](https://www.stratadecision.com/node/12941) [search snippet]
- Segment financials: $1.36B in 2025 sales (see Q1). — [Solventum FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1964738/000196473826000007/solv-20251231.htm)
- No public API or price list found.

**Wolters Kluwer Health Language**
- Data Quality Workbench is described as a "centralized terminology server and reference data management tool" for mapping local codes to standards and authoring value sets. Health IT vendors can use it "through an API or as an OEM component." — [WK Health Language Data Quality FAQ](https://www.wolterskluwer.com/en/solutions/health-language/data-quality/data-quality-faqs) [search snippet]
- Offered as a FHIR terminology server aligned with FHIR R4 (4.0.1), for payers, providers and health IT vendors (2023 announcement about Microsoft Azure). — [Wolters Kluwer news](https://www.wolterskluwer.com/es/news/wolters-kluwer-health-language-to-maximize-value-health-data-organizations-using-microsoft-azure) [search snippet]
- In 2015, its Epic-embedded search synonym content (mapped to SNOMED, ICD-9 and ICD-10) was used by "more than 2,000 hospital clients" (vendor claim, dated). — [WK 2015 press release](https://www.wolterskluwer.com/en/news/wolters-kluwer-to-showcase-health-language-terminology-management-solutions-at-epic-user-group-meeting) [search snippet]

**IMO Health (Intelligent Medical Objects)**
- Products: IMO Core (problem list and documentation terminology), IMO Core Procedure, IMO Core Periop, IMO Precision Normalize (data normalisation and NLP) and IMO Precision Sets (value-set management). Its terminology "maps to all major standardized coding systems," including ICD-10-CM, SNOMED CT, CPT, LOINC, RxNorm and NDC. Delivered through "APIs managed via the IMO Health Developer Portal"; "supports FHIR-based interoperability." — [IMO Health FAQ](https://imohealth.com/faq/)
- Vendor claims: "works with every major EHR in the US," naming Epic, Oracle, MEDITECH, NextGen, athenahealth, Veradigm and eClinicalWorks; a "library of over 5 million clinical terms"; updates "5x each year"; and a "92% accuracy in medical coding" AI claim with no stated methodology. — [IMO Health FAQ](https://imohealth.com/faq/)
- An older press release said "more than 2,500 hospitals" licensed IMO's terminology (dated vendor claim). — [FierceHealthcare](https://www.fiercehealthcare.com/it/leading-hospital-systems-accelerate-selection-intelligent-medical-objects-r-interface) [search snippet]
- IMO also resells CPT. Its CPT end-user terms say that clients not licensed directly with the AMA pay CPT royalties to IMO under AMA licensing models, and that "IMO Health will verify annually with the AMA that Client is appropriate[ly] licensed." — [IMO CPT Terms for End Users (updated 9/8/2024)](https://www.imohealth.com/wp-content/uploads/2023/04/CPT-Terms-End-Users.pdf)
- No public pricing.

**TruCode**
- Encoder delivered as web services ("Encoder Essentials") so partners can embed encoder functions "without separate interfaces or onsite software." Partners named in 2013 included ChartWise, BayScribe, Dolbey, M*Modal, Precyse and PlatoCode. — [Healthcare IT Today, 2013](https://www.healthcareittoday.com/2013/02/08/trucode-announces-new-encoder-web-services-for-integration-into-healthcare-it-applications/)
- Embedded in Prognosis ChartAccess EHR and RCM (2014) and in CPSI's Evident/Healthland EHRs (2017). — [Healthcare IT Today, 2014](https://www.healthcareittoday.com/2014/12/02/trucode-adds-prognosis-innovation-healthcare-to-its-roster-of-ehr-partners-for-full-clinical-coding-encoder-integration/); [BusinessWire, 2017](https://www.businesswire.com/news/home/20170411005049/en/TruCode-and-CPSI-Announce-Partnership)
- No current public API docs or pricing found (all sources dated).

**AAPC Codify**
- Web subscription tiers: from $10/month (Coder Search), $29 (Basic Coder), $40 (Pro Fee Coder) and $50 (Complete Coder). — [Capterra listing](https://www.capterra.ca/software/1038291/codify) [search snippet]. Another listing shows Basic Coder at "$416/yr ($36/mo)" billed annually. — [AAPC Codify](https://www.aapc.com/codes/) [search snippet]
- Includes a universal code search, CCI (NCCI) edits checker, MPFS/fee schedules, a claim scrubber and NCD/LCD lookups. CPT and ICD-10 are updated annually; HCPCS and NCCI quarterly. Licences are assigned to one named individual each. — [AAPC software & services](https://aapc.com/software-and-services) [search snippet]
- API: a third-party "agent-ready" index (snapshot 2026-05-08) says AAPC has public API docs at aapc.com/api/docs, no self-serve paid tier, and custom sales-only pricing. When I fetched that docs URL it returned only a loading shell, so this is **unverified**. — [xpay Agent-Ready Index](https://www.xpay.sh/agent-ready-index/codify/)

**Find-A-Code (innoviHealth)**
- A privately held Utah LLC formed in 2006 by innoviHealth. Covers ICD-10-CM/PCS, CPT, HCPCS, DRG, APC and NDC, plus Coding Clinic and Medicare manuals, with an NCCI validator and fee and RVU tools. — [Find-A-Code company info](https://www.findacode.com/aboutus/company-information.html) [search snippet]
- Launched an "online medical coding web service" in 2008 and describes a real-time data API and a white-label site option for EMR/EHR integration. No public API pricing. — [Find-A-Code 2008 news](https://www.findacode.com/news/month-summary-2008-july.html) [search snippet]; [Powered by FindACode](https://findacode.com/aboutus/powered-by-findacode.html)

**Clinical Architecture (Symedical)**
- A "vendor-neutral" terminology management platform: a mapping engine, semantic normalisation, value-set authoring, and a content portal with automatic updates for SNOMED CT, ICD-10, LOINC, RxNorm and others. Add-ons include SIFT (clinical NLP). — [Clinical Architecture Symedical](https://clinicalarchitecture.com/products/symedical/)

**Apelon**
- DTS (Distributed Terminology System) is an open-source terminology server with a desktop editor, web services and Java APIs. Apelon sells content subscriptions (ICD-10, SNOMED CT, LOINC, RxNorm) and has partnered with Clinical Architecture for large deployments. — [Apelon DTS](https://apelon.com/solutions/terminology-tooling/dts/); [Apelon history](https://apelon.com/?p=1077) [search snippets]

**Developer-focused code APIs (2024–2026)**
- NLM Clinical Table Search Service: a free search API for ICD-10-CM (2026, 74,719 records) and HCPCS Level II (January 2026, 8,791 records). Advised maximum is 25 requests/second; contact NLM above 50/second sustained; no availability guarantee. — [NLM Clinical Tables FAQ](https://clinicaltables.nlm.nih.gov/faq.html); [ICD-10-CM API doc](https://clinicaltables.nlm.nih.gov/apidoc/icd10cm/v3/doc.html); [HCPCS API doc](https://clinicaltables.nlm.nih.gov/apidoc/hcpcs/v3/doc.html)
- OMOPHub: a hosted terminology API over "120+ medical vocabularies" (OHDSI-based). Plans: Free ($0, 3,000 calls/month), Pro ($39, 50,000), Scale ($79, 125,000), Business ($149, 250,000), Private Cloud (custom). The page says nothing about CPT licensing. — [OMOPHub pricing](https://omophub.com/pricing)
- AutoICD API: "AI clinical coding platform for ICD-10 and SNOMED", plus an MCP server (Show HN, March 12 2026). — [Show HN: AutoICD API](https://news.ycombinator.com/item?id=47346296); [Show HN: autoicd-mcp](https://news.ycombinator.com/item?id=47346251)
- Vitalware "ICD Sherpa" developer APIs: ICD-10-CM/PCS search and CodeValidate for NCCI/MUE and LCD/NCD checks. The developer site now redirects to Health Catalyst ("Vitalware by Health Catalyst"). — [developer.vitalware.com → Health Catalyst](https://developer.vitalware.com/)
- Others: ICD10api.com (lightweight validation built on CMS GEM files) — [ICD10api](https://icd10api.com/); VBC Risk Analytics ICD-10 REST API with HCC mappings — [VBC Risk Analytics](https://www.vbcriskanalytics.com/icd10-rest-api-medical-coding-lookup); Verity MCP `lookup_code`, which claims CPT/HCPCS/ICD-10/NDC with RVUs and Medicare policies — [Glama listing](https://glama.ai/mcp/servers/@tylergibbs1/verity_mcp/tools/lookup_code) [search snippets]
- A public lookup site, datainsight.health, "excludes all copyrighted codes (AMA CPT, ADA)" from its public version. That is a common way to avoid CPT licensing. — [DataInsight code lookup](https://datainsight.health/code-lookup/) [search snippet]

### Inferences
- Pricing structure by customer type:
  - Individual coders: public per-seat web subscriptions (AAPC about $120–$600/year; EncoderPro about $300–$1,000/year).
  - Software vendors and payers: unpublished OEM, data-file and API deals (Optum, IMO, WK, Solventum).
  - AMA's CPT royalty: passed through underneath both.
- Newer developer APIs compete on ICD-10/SNOMED/LOINC, which are free or cheap to redistribute in the US. Almost none publish CPT-descriptor pricing, which suggests CPT is still the hard part for API startups.
- IMO resells CPT and polices its clients' AMA licensing. Content vendors in effect act as the AMA's collection agents inside EHRs.

### Gaps
- No public API docs or pricing confirmed for AAPC, Find-A-Code, TruCode, IMO, WK or Solventum.
- Elsevier coding products were not researched.
- I could not confirm whether Health Catalyst still sells the Vitalware developer APIs as standalone products.

---

## 3. How EHRs and revenue-cycle (RCM) systems embed codes in practice

### Terms in plain English
- **EHR (electronic health record)**: the clinical system doctors chart in (Epic, Oracle Health, athenahealth and others).
- **Practice management (PM) system**: scheduling, registration and billing software for clinics.
- **RCM (revenue-cycle management)**: everything from registration to getting paid.
- **Problem list**: the running list of a patient's diagnoses in the EHR.
- **Chargemaster / CDM (charge description master)**: a hospital's master price list. Each billable item (a "CBC lab test", an "MRI brain") carries its CPT/HCPCS code, revenue code and price.
- **Fee schedule**: the price list a payer pays, or a provider charges, per code.

### Takeaway
Codes reach EHRs and RCM systems in three layers:
1. Front-end terminology for clinicians (problem lists, procedure pick-lists). This is usually IMO or Wolters Kluwer content mapped to ICD-10-CM/SNOMED/CPT.
2. Back-office master files: the chargemaster, fee schedules and code tables, refreshed on government and AMA cycles (CPT on January 1, ICD-10 on October 1, HCPCS and NCCI quarterly) through a test-then-promote process.
3. Embedded encoders and claim editors, called as web services.

The vendor carries the AMA CPT royalty and typically passes it to customers as a per-provider fee. Under the AMA's "User Proxy" model, a PM system owes 1 × $18.50 per billing provider per year and an ambulatory EMR owes 4 × $18.50.

### Cited Findings
**Problem-list terminology inside EHRs**
- MEDENT (an EHR) integrates IMO. An IMO term may be "a 1:1 match to a code" in ICD-10 or SNOMED "or it may map to multiple codes". IMO also powers a problem-list "cleanup" screen that suggests lapsed or duplicate problems. — [MEDENT – IMO integration](https://medent.com/connect/imo/)
- IMO's terminology "integrates seamlessly into major EHRs like Epic®, Oracle, MEDITECH®, and NextGen®" (vendor claim). — [IMO Health FAQ](https://imohealth.com/faq/)
- IMO content in InterSystems TrakCare is tailored by region (spelling, language) and mapped to ICD-10 and the SNOMED CT extension. — [InterSystems partner listing](https://partner.intersystems.com/package/IMO-Core---precise-problem-terminology) [search snippet]

**Chargemaster and annual update process**
- Hospital revenue-integrity job descriptions: "Updates the CDM annually based on changes published by the AMA via CPT guidelines; updates quarterly based on CMS guidelines for HCPCS codes," working with IT so new and deleted codes are implemented correctly. — [Lurie Children's job posting](https://www.theladders.com/job/revenue-integrity-chargemaster-analyst-ann-robert-h-lurie-children-s-hospital-of-chicago-chicago-il_88123398) [search snippet]
- Optum white paper: hospitals "can no longer rely on one update per year"; coding changes arrive irregularly; "Monthly or semi-monthly CDM updates are ideal" (vendor view). — [Optum Chargemaster Maintenance Whitepaper](https://www.optumcoding.com/upload/docs/Optum_Chargemaster_Maintenance_Whitepaper.pdf) [search snippet]
- HealthStream recommends reviews around the January, April, July and October coding cycles. — [HealthStream](https://www.healthstream.com/resources/five-best-practices-for-chargemaster-maintenance) [search snippet]
- UT Southwestern audit report: Decision Support enters CDM updates into an Epic proof-of-concept (test) environment, and IT then promotes them to Epic production. — [UT System audit report (UTSW CDM)](https://WWW.UTSYSTEM.EDU/sites/default/files/documents/ut-system-reports/2023/utsw-hospital-billing-and-professional-billing-charge-description-master-report/utsw-hospital-billing-and-professional-billing-charge-description-master-report.pdf) [search snippet]

**Encoders and data files embedded in products**
- TruCode encoder web services are embedded in EHR and RCM products (CPSI, Prognosis and others). — [BusinessWire 2017](https://www.businesswire.com/news/home/20170411005049/en/TruCode-and-CPSI-Announce-Partnership)
- Optum data files are "designed for easy implementation with payer and EMR systems". Optum's pricing page lists a CPT data offering for Practice Fusion and Veradigm systems. — [Optum360 Data Files Brochure](https://optumcoding.com/upload/docs/Optum360_Data_Files_Brochure.pdf) [search snippet]

**How the CPT royalty is charged through software (AMA licensing models, as flowed down by IMO)**
- AMA licensing models: (1) Counting User, (2) User Proxy, (3) Health Plan, (4) Provider Health Analytics, (5) Telemedicine & Remote Patient Monitoring. "Determination of the appropriate licensing model is made by the AMA." — [IMO CPT Terms](https://www.imohealth.com/wp-content/uploads/2023/04/CPT-Terms-End-Users.pdf)
- Rates: $18.00 per user for the 2024 release, $18.50 for 2025, $9.00 for a previous release. — [IMO CPT Terms](https://www.imohealth.com/wp-content/uploads/2023/04/CPT-Terms-End-Users.pdf)
- A "CPT User" includes anyone who uses the product "to produce or enable an output … that could not have been created without the CPT Editorial Content … even though the CPT Editorial Content may not be visible or directly accessible," and anyone who uses such an output. — [IMO CPT Terms](https://www.imohealth.com/wp-content/uploads/2023/04/CPT-Terms-End-Users.pdf)
- User Proxy factors (users = factor × count):

  | Product category | Counted by | Factor |
  |---|---|---|
  | Practice Management (PM) | Billing providers (FTE) | 1 |
  | Ambulatory EMR | Billing providers (FTE) | 4 |
  | Hospital Patient Billing System | Staffed beds | 1 |
  | Clinical EMR | Staffed beds | 2 |
  | Integrated Ambulatory EMR | Staffed beds | 3 |

  — [IMO CPT Terms](https://www.imohealth.com/wp-content/uploads/2023/04/CPT-Terms-End-Users.pdf)
- 2026 AMA standard distribution schedule: CPT Standard data file $18.50 per user effective January 1 2026; prior annual releases $9.25 per user; an "Upfront Annual Royalty Fee" of $1,050 (waivable above $11,550 of prior-year royalties). — [AMA Standard CPT Distribution Pricing Schedule 2026](https://compliance.ama-assn.org/hc/en-us/articles/15166274293399-Notice-Standard-CPT-Distribution-Pricing-Schedule-2026) [search snippet; the page blocks automated fetch]
- Internal-use EULA for 2026–2027: a base (entity) fee plus $18.50 per user under the User Proxy Model. — [AMA Internal EULA Royalty Rates 2026–2027](https://compliance.ama-assn.org/hc/en-us/articles/16197630737431-Internal-End-User-License-Agreement-Royalty-Rates-for-2026-and-2027) [search snippet]. Press coverage cites "$82.50" as the annual provider entity fee plus per-user charges. — [Healthcare Dive](https://www.healthcaredive.com/news/patient-rights-advocate-sues-ama-cpt-billing-codes-copyright/827830/)
- Cassidy's December 1 2025 letter cites the 2025 schedule: $18.50 per user, an upfront annual royalty fee of $1,050, another $18.50 per user for RVUs, and "$13,000 as an 'Acquisition Royalty Fee due for Each Annual Release' for its CPT Link software." — [Cassidy follow-up letter](https://www.help.senate.gov/imo/media/doc/follow_up_letter_to_ama_on_cpt_coding.pdf)
- Real-world pass-through: SimplePractice charges $20 per clinician per year, of which $18.50 is the AMA's CPT royalty and $1.50 a processing fee. — [SimplePractice AMA fee FAQ](https://support.simplepractice.com/hc/en-us/articles/28804985196173-AMA-fee-FAQs) [search snippet]

### Inferences
- For a billing or PM startup selling to clinics, the AMA cost under User Proxy is about $18.50 per billing provider per year at factor 1. That is about $185/year for a 10-provider clinic, plus the vendor's own upfront/annual distribution fee (about $1,050). If the product is classed as an ambulatory EMR (factor 4), it is about $74 per provider. Classification therefore matters, and the AMA decides it.
- Because the "CPT User" definition reaches outputs that depend on CPT even when CPT is not shown, hiding descriptors does not by itself avoid royalties if the product depends on CPT content. (This is my reading of the IMO flow-down terms, not legal advice.)
- The practical update calendar a product must support:

  | When | What changes |
  |---|---|
  | January 1 | CPT; HCPCS; physician fee schedule |
  | April 1, July 1, October 1 | HCPCS / NCCI / MUE quarterly releases |
  | October 1 | ICD-10-CM / PCS |
  | Mid-cycle | CPT Category III codes, vaccine codes and others (assumption, not verified here; see Gaps) |

  Hospitals stage these updates in test and then promote them to production.

### Gaps
- No primary Epic, Oracle or athenahealth documentation (all proprietary) on how they ship annual code updates to customers.
- Could not read the full AMA 2026 distribution schedule or the internal EULA pages directly (Cloudflare). Figures come from search extracts plus the Cassidy letter.
- No source verified here for mid-cycle CPT releases (Category III codes, vaccine codes).

---

## 4. Terminology infrastructure: FHIR terminology services, servers, canonical URIs, and licensing implications

### Terms in plain English
- **FHIR**: HL7's modern web standard (REST/JSON) for exchanging health data.
- **CodeSystem**: a FHIR resource describing a code system (for example ICD-10-CM).
- **ValueSet**: a FHIR resource defining a chosen subset of codes ("diabetes diagnosis codes").
- **ConceptMap**: a FHIR resource mapping codes in one system to another.
- **Terminology server**: a service that answers questions like "is this code valid?", "what does it mean?" and "list all codes in this set".
- **Canonical URI**: the agreed global identifier string for a code system. It is used as a name and is not necessarily a web page.

### Takeaway
FHIR defines standard terminology operations:

| Operation | Works on | What it does |
|---|---|---|
| `$lookup` | CodeSystem | Details about a code |
| `$validate-code` | ValueSet | Is this code valid / in the set? |
| `$expand` | ValueSet | List the codes in a set |
| `$translate` | ConceptMap | Map a code to another system |
| `$subsumes` | CodeSystem | Is one code a sub-type of another? |

It also defines fixed URIs:
- CPT: `http://www.ama-assn.org/go/cpt` (version = year)
- ICD-10-CM: `http://hl7.org/fhir/sid/icd-10-cm`
- ICD-10-PCS: `http://www.cms.gov/Medicare/Coding/ICD10`
- HCPCS: `http://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets`
- SNOMED CT: `http://snomed.info/sct`
- LOINC: `http://loinc.org`

HL7 publishes CPT only as an empty "not-present" stub. Every server (open-source Snowstorm, HAPI or Hades; commercial Ontoserver, Aidbox, Medplum, WK or Snow Owl) loads licensed content itself. CPT almost never comes pre-loaded, because serving it needs an AMA licence.

### Cited Findings
**Operations and resources**
- A FHIR terminology service provides functions on CodeSystem, ValueSet and ConceptMap resources so apps can use codes "without needing deep knowledge of code system internals". The operations are as listed in the Takeaway, plus `$closure` (incremental closure tables). — [FHIR R4 Terminology Service](https://hl7.org/fhir/R4/terminology-service.html)
- Large external systems (SNOMED CT, LOINC, RxNorm) are not distributed as CodeSystem resources; servers are assumed to "know" them. Servers may authenticate clients "to track usage or enforce licensing agreements." — [FHIR R4 Terminology Service](https://hl7.org/fhir/R4/terminology-service.html)

**Canonical URIs**
- From FHIR R4's list of systems: CPT `http://www.ama-assn.org/go/cpt` (OID 2.16.840.1.113883.6.12); SNOMED CT `http://snomed.info/sct`; LOINC `http://loinc.org`; RxNorm `http://www.nlm.nih.gov/research/umls/rxnorm`; NDC `http://hl7.org/fhir/sid/ndc`; CVX `http://hl7.org/fhir/sid/cvx`; NUCC provider taxonomy `http://nucc.org/provider-taxonomy`. — [FHIR R4 terminologies-systems](https://hl7.org/fhir/R4/terminologies-systems.html)
- From US Core: ICD-10-CM `http://hl7.org/fhir/sid/icd-10-cm`; ICD-10-PCS `http://www.cms.gov/Medicare/Coding/ICD10`; HCPCS Level II `http://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets`. US Core "does not require a specific version of terminology." "HL7 recommends validators allow non-active codes with note on their status." VSAC value sets need "your own UMLS API Key." — [US Core Terminology](https://hl7.org/fhir/us/core/terminology.html)
- CPT in HL7: "The AMA holds the copyright for the CPT coding system and a license is required for use." "CPT versions are identified simply by the year of their release e.g. `2020`." Value sets containing CPT must carry "CPT © Copyright [year] American Medical Association. All rights reserved." — [HL7 THO – Using CPT](https://terminology.hl7.org/5.1.0/CPT.html)
- HL7's CPT CodeSystem resource has `content = not-present`: no CPT codes are included. — [THO CodeSystem v3-cpt-4](https://terminology.hl7.org/CodeSystem-v3-cpt-4.html) [search snippet]

**Servers**
- Snowstorm (SNOMED International): open source (Elasticsearch, Spring Boot, Docker). It can host "SNOMED CT, LOINC, ICD-10, ICD-10-CM and many other code systems" through FHIR. Snowstorm Lite is a SNOMED-only, low-memory server without Elasticsearch. The page lists other servers too: Hermes, Ontoserver, Snowray (B2i) and WCI. — [SNOMED terminology services](https://implementation.snomed.org/terminology-services); [GitHub IHTSDO/snowstorm-lite](https://github.com/IHTSDO/snowstorm-lite)
- Ontoserver (CSIRO, Australia): a commercial FHIR terminology server built on the HAPI FHIR library with Postgres/Lucene, with syndication-based content distribution. No public pricing. — [Ontoserver solutions](https://ontoserver.csiro.au/site/our-solutions/); [Ontoserver paper, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6142703) [search snippet]
- HAPI FHIR is a library that can act as a terminology server. In a 2022 FHIR chat thread, Grahame Grieve said Ontoserver is more capable than HAPI but there is no reason to switch unless you need something HAPI lacks (dated opinion). — [FHIR chat: HAPI as Terminology Server](https://chat-archive.fhir.org/stream/179167-hapi/topic/HAPI.20as.20Terminology.20Server.html) [search snippet]
- Health Samurai Aidbox Terminology Module: a FHIR terminology service supporting `$lookup`, `$validate-code`, `$expand`, `$translate` and subsumption. It runs in local, hybrid (falls back to external servers) or remote mode, and ICD-10 is loadable via `$import`. For SNOMED: "we can not redistribute it without making sure that other people have this license." No CPT mention found. — [Aidbox terminology module](https://www.health-samurai.io/docs/aidbox/terminology-module/overview); [Aidbox SNOMED loading](https://www.health-samurai.io/docs/aidbox/modules-1/terminology/fhir-terminology-repository/load-snomed-ct-into-aidbox) [search snippets]
- Medplum: imported UMLS 2026AA into its hosted environment, including the full SNOMED→ICD-10-CM map. It reworked `ConceptMap/$translate` for prioritised, grouped rules (example: SNOMED "viral fever" → B34.9 plus P81.9 for infants or R50.9 otherwise). The post does not mention CPT. — [Medplum Terminology 2026](https://www.medplum.com/blog/terminology-2026). In a community forum answer, Medplum said its CPT binding values "are just stubs" (forum, not official). — [Medplum community thread](https://linen.medplum.com/t/28489436/icd-and-cpt-mapping-data) [search snippet]
- Open-source landscape on GitHub (stars as of Oct 2026): Snow Owl (292★, now **archived**); wardle/hades (72★); IHTSDO/snowstorm-lite (38★). — [b2ihealthcare/snow-owl](https://github.com/b2ihealthcare/snow-owl); [wardle/hades](https://github.com/wardle/hades); [IHTSDO/snowstorm-lite](https://github.com/IHTSDO/snowstorm-lite)
- Wolters Kluwer offers a commercial FHIR R4 terminology server (see Q2). — [WK news](https://www.wolterskluwer.com/es/news/wolters-kluwer-health-language-to-maximize-value-health-data-organizations-using-microsoft-azure)

**UMLS as the usual loading route, and its CPT limits**
- UMLS licence Appendix 1: CPT (CPT2026) and CPT-within-HCPCS (HCPT2026) are **Category 3**. ICD-10-CM is Category 4 for US users. CPT's required notice: "CPT™ only Copyright … American Medical Association," and "No fee schedules, basic unit, relative values or related listings are included in CPT™." — [UMLS License Appendix](https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/license_agreement_appendix.html)
- Category 3 (§12.3) limits use to "internal use at the LICENSEE's site(s)" for "research, product development, and statistical analysis only." It excludes routine patient data creation, publishing, derivative works, and making material available to "any unauthorized party." For uses beyond the licence, "LICENSEE should contact the copyright holder directly." — [UMLS License Agreement](https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/license_agreement.html)
- OHDSI Athena (the OMOP vocabulary download) ships CPT-4 rows with empty names because OHDSI lacks a CPT distribution licence. Each user runs a bundled `cpt4.jar` with their own UMLS API key to fill in descriptions. — [OHDSI forum: download CPT4 with concept_name](https://forums.ohdsi.org/t/how-i-can-download-cpt4-with-concept-name/18340); [OHDSI forum: CPT without UMLS license](https://forums.ohdsi.org/t/load-cpt-code-and-description-into-omop-vocabulary-without-using-umls-license/14892) [search snippets]

### Inferences
- A UMLS licence is free and fine for development and analytics. It does **not** authorise a production billing SaaS to show CPT descriptors to customers, because Category 3 excludes routine patient data creation and use by unauthorised parties. Production use needs an AMA distribution licence (or a sub-licence through a reseller such as IMO or Optum).
- The cleanest architecture follows HL7's own pattern: treat CPT as an *identifier* (`system=http://www.ama-assn.org/go/cpt`, `version=2026`, `code=99213`) everywhere, and keep the licensed descriptor text in a separate store or service that is only reachable by licensed tenants. Non-CPT systems (ICD-10-CM, HCPCS, NDC, LOINC, US SNOMED) can be loaded into an off-the-shelf FHIR terminology server.

### Gaps
- No primary statement found on whether HL7's public validator server tx.fhir.org holds a CPT licence or exposes CPT displays.
- Ontoserver licence terms and pricing are not public.

---

## 5. Practical build patterns: versioning by date of service, updates, crosswalks, keeping CPT separate, developer practice, and CPT redistribution limits

### Terms in plain English
- **Date of service (DOS)**: the date care was given. The valid code set is the one in force on that date (or, for inpatient stays, the discharge date), not the date the claim is sent.
- **Crosswalk / map**: a table linking codes in one system to another.
- **GEMs (General Equivalence Mappings)**: CMS's ICD-9↔ICD-10 crosswalk files.
- **NCCI (National Correct Coding Initiative)**: CMS rules on which CPT/HCPCS code pairs can't be billed together (PTP edits) and maximum units per day (MUEs).
- **Order file**: CMS's master text file of ICD-10 codes and descriptions.

### Takeaway
Store every code with an effective-from and effective-to date and the release it came from, and validate against the release in force on the date of service. HIPAA itself says a code is valid within the dates set by its maintainer.

Plan for these cycles:

| Code set or file | Cycle |
|---|---|
| ICD-10-CM/PCS | Annual, October 1 |
| CPT | Annual, January 1 |
| HCPCS, NCCI, MUE, fee-schedule files | Quarterly |
| SNOMED→ICD-10-CM map | Twice a year |

Other rules of thumb:
- Don't build new logic on GEMs: they were frozen after FY2018.
- Keep CPT descriptors isolated and licensed.
- Using CPT to train AI is now expressly banned by the AMA's terms; retrieval-based use is the allowed route.

### Cited Findings
**Versioning and validity**
- "Each code set is valid within the dates specified by the organization responsible for maintaining that code set." — [45 CFR 162.1011](https://www.law.cornell.edu/cfr/text/45/162.1011)
- The FY2027 ICD-10-CM/PCS files on CMS's site apply to discharges and encounters from October 1 2026 through September 30 2027. The downloads include "Code Descriptions in Tabular Order", an addendum, a conversion table and POA-exempt codes. — [CMS ICD-10 codes page](https://www.cms.gov/medicare/coding-billing/ICD-10-codes); [NC Medicaid bulletin, Sep 21 2026](https://medicaid.ncdhhs.gov/blog/2026/09/21/icd-10-update-effective-oct-1-2026) [search snippets]
- One secondary source counts FY2027 ICD-10-CM changes as 190 new billable codes, 4 revised descriptors, 21 deletions and 15 codes demoted to headers (unverified against CMS). — [KZA alert](https://www.kzanow.com/alerts/fy-2027-icd-10)
- CMS order files give each code a five-digit order number and include non-billable header rows. Order numbers can change between releases, so they must not be used as stable keys. — [CMS ICD-10 order file documentation](https://www.cms.gov/files/document/icd10-2019-cm-pcs-order-files-pdf.pdf) [search snippet]
- CPT versions are identified by year. — [HL7 THO – Using CPT](https://terminology.hl7.org/5.1.0/CPT.html)
- NCCI PTP and MUE files update quarterly (January, April, July, October). One provider guide says the Q4 2026 MUE tables took effect October 1 2026, with the next release on January 1 2027. — [SwiftCare NCCI guide](https://swiftcarebilling.com/ncci-edits-in-medical-billing/) [search snippet]; CMS posts the Medicaid NCCI edit files. — [CMS Medicaid NCCI Edit Files](https://www.cms.gov/medicare/coding-billing/ncci-medicaid/medicaid-ncci-edit-files)
- An MUE is "the maximum units … reported for a HCPCS/CPT code on the vast majority of appropriately reported claims." NCCI "is not a prior authorization program." — [CMS NCCI FAQ library](https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-faq-library) [search snippet]
- Healthcare data sources note that the AMA asserts copyright over the CPT codes inside CMS's MUE data, so check licensing before redistributing it. — [CMS Medicaid NCCI Edit Files](https://www.cms.gov/medicare/coding-billing/ncci-medicaid/medicaid-ncci-edit-files) [search snippet]

**Mappings and crosswalks**
- GEMs were updated annually only for about three years after ICD-10 was adopted. The FY2018 GEMs (posted 08/03/2017) are the last in CMS's archive, and Find-A-Code says 2018 was the final year. — [CMS GEMs archive](https://www.cms.gov/medicare/coding/icd10/archive-icd-10-cm-icd-10-pcs-gems); [HHS GEMs archive](https://www.hhs.gov/guidance/document/icd-10-cm-and-icd-10-pcs-and-gems-archive); [Find-A-Code GEMs page](https://www.findacode.com/icd-10-cm/icd-10-cm-gems-rms.html) [search snippets]
- NLM's SNOMED CT→ICD-10-CM map is rule-based and updated with each SNOMED CT US Edition release (March and September), including the annual ICD-10-CM update. Rules sit in "map groups" evaluated in order using context such as age, and each group resolves to at most one ICD-10-CM code. — [NLM SNOMED CT to ICD-10-CM Map](https://www.nlm.nih.gov/research/umls/mapping_projects/snomedct_to_icd10cm.html); [SNOMED US Edition mapping spec, Mar 2025](https://conf.spaces.snomed.org/wiki/spaces/RMT/pages/131989958) [search snippets]

**AMA terms that shape architecture (2025–2026)**
- "Any entity using CPT content anywhere worldwide must have a license." Licensed activities include using CPT "to develop, test, maintain and service products." A distributor needs "a license for each product that contains CPT codes." Derivative works also need a licence. — [AMA CPT licensing for health IT vendors](https://www.ama-assn.org/practice-management/cpt/cpt-licensing-health-it-vendors)
- AI terms: "Using the CPT Standard Data File to train, fine-tune, or improve AI models is prohibited"; uploading it to public AI systems is prohibited. "Retrieval-based AI offers the clearest and most flexible way to enable AI features." AI outputs "are not a substitute for CPT content." — [AMA CPT licensing for health IT vendors](https://www.ama-assn.org/practice-management/cpt/cpt-licensing-health-it-vendors)
- End-user flow-down terms (as used by IMO): internal use only; no making CPT "publicly available"; no derivative works; no transfer to "any unauthorized party, including a subsidiary, affiliate." Any further distribution requires the client's own AMA distribution licence. The AMA is named "third-party beneficiary." Required notices state that CPT is AMA-copyrighted and that "Fee schedules, relative value units, conversion factors … are not part of CPT." — [IMO CPT Terms](https://www.imohealth.com/wp-content/uploads/2023/04/CPT-Terms-End-Users.pdf)

**What developers and startups actually do**
- A founder of a 2023 YC startup (Certainly Health) said the AMA "wanted a $15 fee per practice" and that this was "too cost prohibitive." The team had a surgeon write "a few hundred new codes" with their own titles as a "rosetta stone." — [HN comment, Aug 2023](https://news.ycombinator.com/item?id=36991278)
- A founder of a billing app (2014) said: "We had to pay a fee per user just so clerks could more easily process Medicare claims." — [HN comment, Mar 2014](https://news.ycombinator.com/item?id=7394338)
- Another HN commenter (2021): "Payers and well funded companies can afford licensing, otherwise they will strangle you." — [HN comment](https://news.ycombinator.com/item?id=25824421)
- The open-source ecosystem is thin. The most-starred "icd-10-cm" GitHub repos have under 100 stars:
  - bryand1/icd10-cm (97★). Its description wrongly attributes ICD-10-CM to WHO; US Core lists the CDC as the source of ICD-10-CM ([US Core Terminology](https://hl7.org/fhir/us/core/terminology.html)), and CMS distributes the files ([CMS ICD-10 codes page](https://www.cms.gov/medicare/coding-billing/ICD-10-codes)).
  - StefanoTrv/simple_icd_10_CM (92★).
  - JuliaHealth/ICD_GEMs.jl (17★).

  — [bryand1/icd10-cm](https://github.com/bryand1/icd10-cm); [simple_icd_10_CM](https://github.com/StefanoTrv/simple_icd_10_CM); [ICD_GEMs.jl](https://github.com/JuliaHealth/ICD_GEMs.jl)
- 2026 hobby and portfolio repos show a growing pattern: a deterministic NCCI/MUE edit engine with every finding "cited to versioned CMS rules", wrapped by LLM agents. — [Claim_Preflight](https://github.com/nishanth3112/Claim_Preflight)
- Hosted APIs are often preferred because self-hosting means re-importing every October (vendor argument, VBC Risk Analytics). — [VBC Risk Analytics](https://www.vbcriskanalytics.com/icd10-rest-api-medical-coding-lookup) [search snippet]

### Inferences
Recommended data model, derived from the sources above:
1. A `code_system` table (URI, e.g. `http://hl7.org/fhir/sid/icd-10-cm`).
2. A `code_release` table (system, version label such as "FY2027" or "2026", effective_start, effective_end, source file hash).
3. A `code` table (system, code, release, billable flag, short/long descriptor, status).
4. Rule tables for NCCI/MUE and fee schedules, each keyed by quarter or effective date.

Claim validation then picks the release by date of service (discharge date for inpatient ICD-10).

- Put CPT descriptors in a separate, access-controlled table or service that is enabled per tenant only when that tenant is covered by an AMA licence (yours, as distributor, or theirs). Codes alone travel freely through the system, but royalties may still apply (see Q3).
- For SNOMED→ICD-10-CM, use the NLM rule-based map (needs a UMLS or US SNOMED licence, free in the US), not GEMs.
- Avoid using CPT content for LLM fine-tuning. Design AI features as retrieval over licensed content, per the AMA AI terms.

### Gaps
- No authoritative public AMA statement on whether showing bare CPT *codes* (5-character numbers) without descriptors needs a licence. The AMA FAQ says royalties cover "CPT codes and descriptors" and does not separate them.
- No primary engineering blog from a well-known billing startup (Candid, Tebra and others) describing its code-versioning design was found.
- No AMA developer, evaluation or sandbox licence category was found on public pages.

---

## 6. HIPAA's legal framework: mandated code sets, why they are unavoidable, the DSMO process, and 2025–2026 challenges to CPT

### Terms in plain English
- **HIPAA Administrative Simplification**: the part of the 1996 HIPAA law under which HHS picks mandatory electronic formats and code sets for claims and other transactions.
- **Covered entity**: a health plan, clearinghouse, or provider who bills electronically. Covered entities must use the standards.
- **Code set maintaining organization**: the body that owns and updates a code set (AMA for CPT, CMS for HCPCS and ICD-10-PCS, CDC/NCHS for ICD-10-CM, ADA for dental codes).
- **DSMO (Designated Standard Maintenance Organization)**: a group HHS appointed to handle change requests to HIPAA standards.
- **RFI (request for information)**: a formal government invitation for public comment, used before writing new rules.

### Takeaway
45 CFR 162.1002 names ICD-10-CM (diagnoses), ICD-10-PCS (inpatient procedures), CPT-4 plus HCPCS (physician and other services), HCPCS (supplies and equipment), CDT (dental) and NDC (retail-pharmacy drugs) as the mandatory "medical data code sets." Any billing software must therefore handle all of them, including the AMA-owned CPT.

Code sets are adopted "as maintained" by their owners (§162.1011), so annual updates take effect without new federal rules. The DSMO process covers changes to the standards themselves and is little used.

CPT's protected status is under pressure:
- Cassidy letters (October and December 2025).
- CMS's RFI in the CY2027 physician fee schedule proposed rule asking about alternatives to CPT (published July 16 2026, comments closed September 14 2026).
- A lawsuit filed August 13 2026 asking a court to declare CPT uncopyrightable.

None of this has yet changed the obligation to use and license CPT.

### Cited Findings
- 45 CFR 162.1002(c), on or after October 1 2015:
  - ICD-10-CM: diagnoses and conditions.
  - ICD-10-PCS: inpatient hospital procedures.
  - HCPCS together with CPT-4: physician and other health services (therapy, radiology, lab, hearing and vision, ambulance).
  - HCPCS: other substances, equipment and supplies (non-drug).
  - NDC: retail pharmacy drugs.
  - ADA Code on Dental Procedures and Nomenclature (CDT): dental services.

  Earlier periods used ICD-9-CM Volumes 1–3. — [45 CFR 162.1002](https://www.law.cornell.edu/cfr/text/45/162.1002)
- Definitions: "Code set means any set of codes used to encode data elements, such as tables of terms," including their descriptions. A "code set maintaining organization" is "an organization that creates and maintains the code sets adopted by the Secretary." A DSMO is "an organization designated by the Secretary under § 162.910(a)." — [45 CFR 162.103](https://www.law.cornell.edu/cfr/text/45/162.103)
- Validity follows the maintainer's dates. — [45 CFR 162.1011](https://www.law.cornell.edu/cfr/text/45/162.1011)
- DSMOs: six organisations were named in 2000. Three are standards bodies (X12, HL7, NCPDP) and three are data-content committees (the ADA's Dental Content Committee, the NUBC and the NUCC). Anyone can file a change request. Each DSMO may opt in to review within 90 days, with a 45-day extension available, and a Steering Committee issues the final response. There are two paths: through the DSMO system, or directly to the standards body. NCVHS heard testimony about "misperceptions and lack of knowledge about the process." One 2013 report counted only 4 change requests that year. — [NCVHS letter 2011](https://www.ncvhs.hhs.gov/wp-content/uploads/2014/05/110922lt2.pdf); [NCVHS 2013 DSMO report](https://ncvhs.hhs.gov/wp-content/uploads/2014/05/130617p2b.pdf); [DSMO letter to NCVHS, Jan 2020](https://ncvhs.hhs.gov/Letter-to-NCVHS-DSMO-Change-Request-January-21-2020) [search snippets]
- Cassidy (Oct 6 2025): "In the implementing regulations (45 CFR § 162.1002), CPT codes … were selected as one of the standard code sets that must be used. As a result, the government has endorsed a coding monopoly for the AMA." — [Cassidy letter](https://www.help.senate.gov/imo/media/doc/cassidy_letter_to_ama_on_cpt_monopoly.pdf). A follow-up on December 1 2025 pressed for user counts, the definition of "user", and whether CPT Link is required. — [Cassidy follow-up letter](https://www.help.senate.gov/imo/media/doc/follow_up_letter_to_ama_on_cpt_coding.pdf)
- CMS's CY2027 physician fee schedule proposed rule (Federal Register, July 16 2026, CMS-1848-P; comments due September 14 2026) includes an RFI on CPT's role. It cites concern about relying on a private organisation with a conflict of interest and asks:
  - what harm comes from the AMA's control of CPT licences;
  - what objective alternatives to CPT and the RUC (the AMA committee that recommends how services are valued) exist;
  - whether physician procedures could instead be paid using ICD-10-PCS.

  It also proposes new HCPCS G codes that replace some CPT codes for Medicare payment. — [Federal Register CY2027 PFS proposed rule](https://www.federalregister.gov/documents/2026/07/16/2026-14327/medicare-and-medicaid-programs-cy-2027-payment-policies-under-the-physician-fee-schedule-and-other); [CASRAI summary](https://casrai.org/news/cms-cpt-rfi-cy-2027-physician-fee-schedule) [details from search summaries]
- PatientRightsAdvocate.org v. AMA (filed August 13 2026, Northern District of Illinois) seeks a declaratory judgment that CPT has lost copyright protection because it is incorporated into law ("no one can own the law"), or that publishing it is fair use. The AMA did not comment to Healthcare Dive. — [Healthcare Dive](https://www.healthcaredive.com/news/patient-rights-advocate-sues-ama-cpt-billing-codes-copyright/827830/); [Plagiarism Today](https://www.plagiarismtoday.com/2026/08/18/the-copyright-fight-over-medical-billing-codes/)
- Legal background:
  - In *Practice Management Information Corp. v. AMA* (9th Cir. 1997), the court found the AMA misused its copyright by requiring exclusivity from the government. It did not void the copyright; the AMA dropped the exclusivity clause.
  - *ASTM v. Public.Resource.Org* (D.C. Cir. 2023) found non-profit publication of standards incorporated into law to be fair use.
  - The PRO Codes Act (reintroduced June 2025) would require free public access to such codes, but not in ways software developers could readily use.

  — [Plagiarism Today](https://www.plagiarismtoday.com/2026/08/18/the-copyright-fight-over-medical-billing-codes/)

### Inferences
- For a builder in late 2026, HIPAA makes CPT a must-support code set for professional and outpatient claims, and an AMA licence remains required for electronic use. The lawsuit and the CMS RFI are signals to watch, especially Medicare's shift toward HCPCS G codes, but they are not yet relief.
- A design that keys on URIs and release versions (Q4/Q5) would absorb a future change, such as Medicare moving more services to HCPCS or ICD-10-PCS, without re-architecting.
- Since ICD-10-CM, ICD-10-PCS, HCPCS and NDC are government-published and free, while CPT and CDT are privately licensed, a startup's licensing cost for code content is mainly the AMA (and the ADA if it does dental claims). The other costs are optional value-added content (edits, fee gap-fills, crosswalks, encoder logic) from vendors like Optum.

### Gaps
- No AMA public response to Cassidy's questions, and no ruling yet in the PatientRightsAdvocate.org case (as of 2026-10-21).
- I found no final CY2027 physician fee schedule rule at research time, so the outcome of CMS's CPT RFI is unknown.
- The current DSMO website (hipaa-dsmo.org) was not checked directly; DSMO process details come from older NCVHS documents (2011–2020).
- CDT (dental) licensing costs from the ADA were not researched.
