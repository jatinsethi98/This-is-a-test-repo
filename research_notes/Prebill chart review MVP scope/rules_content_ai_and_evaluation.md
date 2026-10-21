# Rules content, AI/ML approach, evaluation and unit cost for a pre-bill AI chart review product (US outpatient professional coding)

Research date: 2026-10-21. Scope: US only. Peer-reviewed or preprint evidence is kept separate from vendor claims. Where a source page could not be fetched directly and a figure comes from a search-result snippet, the note says so.

---

## 1. Code sets, rules content and licensing: what the system needs, where to get it, what it costs

### Takeaway
Almost all the government rule content is free and machine-readable: ICD-10-CM, HCPCS Level II, NCCI edits/MUEs, the Medicare Coverage Database and the Physician Fee Schedule RVU files. CPT is the exception. The AMA owns it, licenses it per user (2026: $18.50 per user per year for the CPT data file, plus a base fee for internal use), and since 2025–2026 has an AI Addendum. The addendum allows retrieval-based AI but bans training or fine-tuning models on the CPT data file and bans uploading it to public AI systems. The other paid items are AHA Coding Clinic (ICD-10/HCPCS guidance), AMA CPT Assistant (CPT guidance, about $143 per user) and commercial encoders/APIs (Optum, Find-A-Code, AAPC). Commercial payer policies are public PDFs scattered across each payer's website. No free central feed of them was found.

### Cited Findings

**Plain-language glossary (for non-healthcare readers)**
- **CPT** (Current Procedural Terminology) is the 5-digit code set for what the clinician *did* (visits, procedures). The AMA owns it, and any software that ships it needs an AMA license. CMS builds its own edit logic on "coding conventions defined in the American Medical Association's Current Procedural Terminology (CPT) Manual." — [CMS NCCI](https://www.cms.gov/medicare/coding/ncci-coding-edits)
- **ICD-10-CM** is the diagnosis code set (*why* the patient was seen). It is hierarchical with about 72,000 billable "leaf" codes, and only the most specific leaf codes can be billed. — [Yuan et al., arXiv 2510.07629 (Amazon), Oct 2025](https://arxiv.org/pdf/2510.07629)
- **HCPCS Level II** codes (letter + 4 digits) cover supplies, drugs, DME and some services. CMS publishes them. — [CMS HCPCS Quarterly Update](https://www.cms.gov/medicare/coding/hcpcsreleasecodesets/hcpcs-quarterly-update)
- **E/M** (Evaluation and Management) codes are the office/outpatient visit codes, e.g. 99202–99215. Since 2021 (office) and 2023 (other settings), the level is chosen by **MDM (medical decision making)** or by total time. History and exam no longer drive the level. — [AAPC 2023 E/M changes](https://aapc.com/resources/evaluation-management-coding-changes-2023); [ACEP Now 2023](https://www.acepnow.com/article/2023-documentation-guideline-changes-for-ed-e-m-codes-99281-99285/)
- **MDM** has three elements: number/complexity of **problems** addressed, amount/complexity of **data** reviewed, and **risk** of patient management. The MDM level is set by meeting **2 of 3** elements. ProFees uses exactly this rule as a deterministic decision tree. — [ProFees, EMNLP 2025 Industry (arXiv 2510.25007)](https://arxiv.org/html/2510.25007v1); [CASRAI MDM table explainer](https://www.casrai.org/guides/medical-decision-making-mdm-table-explained)
- **NCCI** (National Correct Coding Initiative) has two edit types. **PTP edits** (procedure-to-procedure) "prevent improper payment when incorrect code combinations are reported." **MUEs** (medically unlikely edits) "prevent improper payments when services are reported with incorrect units of service." — [CMS NCCI](https://www.cms.gov/medicare/coding/ncci-coding-edits)
- **LCD/NCD**: Local and National Coverage Determinations. These are Medicare rules on when a service is "reasonable and necessary". Their billing/coding Articles list which diagnosis codes support a service. — [CMS MLN MCD guide, ch. 6](https://cms.gov/outreach-and-education/mln/educational-tools/mln901347-how-to-mcd/mcd/mcd/chapter_6_downloads)
- **Modifiers** are 2-character add-ons to a CPT/HCPCS code that change how it is paid, e.g. to signal a separately identifiable service on the same day. UnitedHealthcare publishes a dedicated "Procedure to Modifier" reimbursement policy. — [UHC Procedure-to-Modifier Policy](https://www.uhcprovider.com/content/dam/provider/docs/public/policies/comm-reimbursement/COMM-Procedure-to-Modifier-Policy.pdf)

**Free government content**
- **ICD-10-CM**: Free from CDC/NCHS and mirrored on CMS. The FY2027 release took effect Oct 1, 2026 and covers Oct 1, 2026–Sep 30, 2027. It includes the order file, tabular list, index, addenda, conversion table and the Official Guidelines for Coding and Reporting. — [CDC ICD-10-CM files](https://www.cdc.gov/nchs/icd/comprehensive-listing-of-icd-10-cm-files.htm); [CMS ICD-10 page](https://www.cms.gov/medicare/coding-billing/ICD-10-codes). Summaries disagree on the FY2027 change counts (21 vs 30 deletions). — [AMBA](https://www.americanmedicalbillingassociation.com/icd-10-codes-fy-2027/); [KZA](https://www.kzanow.com/alerts/fy-2027-icd-10)
- **HCPCS Level II**: Free quarterly "Alpha-Numeric HCPCS File" ZIP downloads from CMS, named by effective date. The latest seen in search was April 2026. — [CMS HCPCS Quarterly Update](https://www.cms.gov/medicare/coding/hcpcsreleasecodesets/hcpcs-quarterly-update); [HHS guidance – Alpha-numeric HCPCS](https://www.hhs.gov/guidance/document/alpha-numeric-hcpcs)
- **NCCI PTP, MUE and add-on code edits**: Published on CMS pages, with separate tables for practitioners and outpatient hospital. "NCCI updates the PTP and MUE files on a quarterly basis," plus off-cycle replacement files. The NCCI Policy Manual, which explains the rationale behind the edits, is updated annually. — [CMS NCCI](https://www.cms.gov/medicare/coding/ncci-coding-edits). The 2025 Q4 files took effect Oct 1, 2025. — [Healthesystems recap](https://healthesystems.com/?p=9510). (The fetched CMS page did not say outright that the files are free or name a click-through CPT license. It only says the files are "available". Treat licensing of the embedded CPT codes as a gap.)
- **Medicare Coverage Database (MCD)**: Bulk downloads of LCDs, Articles and NCDs as ZIPs. Each contains a data dictionary plus .mdb and .csv files. ICD-10 codes, bill types and revenue codes now sit in **Articles**. NCDs carry no billing codes. Attachments are not in the downloads. Local documents update weekly and national documents in real time, so downloads can lag. — [CMS MLN MCD guide ch. 6](https://cms.gov/outreach-and-education/mln/educational-tools/mln901347-how-to-mcd/mcd/mcd/chapter_6_downloads)
- **Physician Fee Schedule (PFS) RVU files**: Quarterly files named RVU{yy}{A–D}, e.g. RVU24D. October releases can be near-empty. — [CMS RVU24D](https://www.cms.gov/medicare/payment/fee-schedules/physician/pfs-relative-value-files/rvu24d); [CMS RVU23D](https://cms.gov/medicare/medicare-fee-service-payment/physicianfeesched/pfs-relative-value-files/rvu23d). CMS transmittal 13929 (Aug 27, 2026) set an October 2026 quarterly PFS update, implemented Oct 5, 2026. — [HHS/CMS transmittal r13929cp](https://www.hhs.gov/guidance/sites/default/files/hhs-guidance-documents/CMS/r13929cp.pdf). The PFS is what lets the product put a dollar value on each suggested correction.

**AMA CPT licensing (paid)**
- **2026 distribution pricing.** These figures come from search snippets of AMA compliance pages; the page returned HTTP 403 to direct fetch.
  - CPT Standard data file: **$18.50 per User**. Earlier releases add **$9.25 per User**.
  - CPT RVU file: an additional **$18.50 per user**.
  - AMA's versions of HCPCS Level II and ICD-10-PCS: **$19.50** and **$22.00**.
  - Internal-use agreements: **$82.50 base + $18.50 per User**.
  - CPT Assistant base content: **$143.00 per User**. Advanced Coding Pack: **$195.00 per User** (both listed for 2027).
  - The per-user CPT rate was **$18.00** for the 2024 release.
  - Sources: [AMA Notice: Standard CPT Distribution Pricing Schedule 2026](https://compliance.ama-assn.org/hc/en-us/articles/15166274293399-Notice-Standard-CPT-Distribution-Pricing-Schedule-2026); [AMA Internal Use License (26+ users)](https://compliance.ama-assn.org/hc/en-us/articles/360061118074-Internal-Use-License-Agreement-Request-26-or-More-Users)
- A secondary source reports a health-plan rate of $100 minimum plus $0.24 per member. Not confirmed against AMA. — [DHInsights](https://dhinsights.org/news/amas-cpt-codes-face-scrutiny-over-fees-politics-and-control)
- AMA offers a "user proxy" counting model as an alternative to counting named users. Details not read. — [AMA user-proxy model page](https://www.ama-assn.org/practice-management/cpt/ama-user-proxy-model); [AMA CPT licensing for health IT vendors](https://www.ama-assn.org/practice-management/cpt/cpt-licensing-health-it-vendors)
- **AMA AI-specific CPT licensing terms** (FAQ page updated **Jul 14, 2026**):
  - **Permitted** (only "as specified in the AI Addendum"): traditional ML for internal use, such as predictive analytics, and **retrieval-based AI**. AMA calls retrieval "the clearest and most flexible way" to add AI features. "Retrieval rights allow an AI system to reference licensed CPT content at the point of use."
  - **Prohibited**: "Using the CPT Standard Data File to train, fine-tune, or improve AI models is prohibited," and "Uploading the CPT Standard Data File into public, unrestricted, or open-market AI systems is prohibited."
  - **Outputs**: "AI-generated outputs are not a substitute for CPT content and should not be treated as authoritative CPT guidance." Outputs should be identified as AI-generated "where appropriate". Distributing or monetizing outputs that reference CPT must follow the license.
  - **Transition**: AMA has a framework for licensees to disclose and transition prior AI use.
  - **Fees**: no AI-specific fee is stated, and the Addendum text is not public on the page.
  - Source: [AMA Licensing CPT for AI FAQs](https://www.ama-assn.org/practice-management/cpt/licensing-cpt-ai-faqs)
- **E/M guidelines text** is AMA copyright and lives in the CPT codebook. Secondary sources link an AMA-hosted PDF of the 2023 E/M descriptors and guidelines (ama-assn.org/system/files/2023-e-m-descriptors-guidelines.pdf). Not fetched or verified. — [SC Workers' Comp memo referencing it](https://www.wcc.sc.gov/sites/wcc/files/Documents/Update.News/Advisory%20Notice/MSPM%20Memo%20Reports%20Jan%2023%202023.pdf); [AMA E/M webinar takeaways PDF](https://ama-assn.org/system/files/reporting-e-m-webinar-takeaways.pdf)

**AHA Coding Clinic (ICD-10-CM/PCS and HCPCS guidance, paid)**
- Health Forum (AHA) controls the content through license agreements; inquiries go to licensing@aha.org. Terms bar commercial, for-profit use or redistribution without AHA Central Office consent. — [Coding Clinic Advisor license page](https://www.codingclinicadvisor.com/license); [Terms](https://codingclinicadvisor.com/terms-and-conditions)
- The 2026 licensing application asks whether the product **uses AI components**, whether content is used in **machine-readable format**, and about reseller distribution. — [Coding Clinic licensing application (05-2026)](https://www.codingclinicadvisor.com/form/05-2026-coding-clinic-licensing); [CCA questionnaire](https://www.codingclinicadvisor.com/form/cca-questionnaire)
- Single-user, non-member unlimited ICD-10 subscription: **$1,300/yr** on one AHA pricing sheet versus **$1,336** in an FAQ. More than 20–50 users is quote-only. — [Coding Clinic pricing sheet](https://www.codingclinicadvisor.com/sites/default/files/CodingClinic_%20Annual%20PricingSubscriptions.pdf); [Coding Clinic FAQ](https://www.codingclinicadvisor.com/faqs?page=5)

**Commercial encoders and coding-content APIs**
- **Optum EncoderPro.com**, 12-month single-user list prices: Standard **$299.95**, Professional **$549.95**, Expert **$999.95**, Payer **$1,495.95**. Another Optum sheet shows Standard $199.95, Professional $599.95 and Expert $995.95, marked "for reference only". — [Optum EncoderPro competitive comparison](https://cdn.optumcoding.com/upload/docs/Optum_EncoderPro.com_Competitive_Comparison_HR.pdf); [Optum360 comparison](https://www.optumcoding.com/upload/docs/Optum360_EncoderPro.com_Competitive_Comparison_HR.pdf)
- **Find-A-Code** offers a real-time data API. Private-label terms: **$10,000 setup** plus a per-user annual fee that depends on features, plus **$150/hr** for extra development (page © 2024). — [Find-A-Code developer / private label](https://developer.findacode.com/private-label.php); [Powered by FindACode](https://findacode.com/aboutus/powered-by-findacode.html)
- **AAPC Codify** consumer tiers run about **$10–$50/month**. Sources conflict, e.g. Basic Coder at $29 vs $36. API pricing is custom or quote-only. — [Capterra Codify](https://www.capterra.ca/software/1038291/codify); [Techjockey](https://www.techjockey.com/detail/codify); [xpay.sh index (third-party)](https://www.xpay.sh/agent-ready-index/codify/)

**Commercial payer policies**
- UnitedHealthcare posts its full library of commercial reimbursement policies as public PDFs, including CCI editing, rebundling, procedure-to-modifier and age-based codes, plus monthly change bulletins. — [UHC COMM RPUB May 2025](https://ams-gateway.uhcprovider.com/content/dam/provider/docs/public/policies/comm-reimbursement/rpub/UHC-COMM-RPUB-May-2025.pdf); [UHC CCI Editing Policy](https://ams-gateway.uhcprovider.com/content/dam/provider/docs/public/policies/comm-reimbursement/COMM-CCI-Editing-Policy.pdf)
- A 2022 UHC guide says it applies coding edits "based primarily on" CMS NCCI and the Outpatient Code Editor. That guide is old and product-specific. — [UHC River Valley reimbursement guide 2022](https://www.uhcprovider.com/en/admin-guides/administrative-guides-manuals-2022/rv-entities-guide-supp-2022/rv-reimbursement-pol-guide-supp.html)

### Inferences
- **Rule engine data for an MVP**: NCCI PTP/MUE/add-on files, ICD-10-CM tabular data and guidelines, HCPCS, MCD Articles and PFS RVUs are all free, versioned by quarter or fiscal year, and should be loaded into a versioned rules store keyed by date of service. Dates of service near quarter boundaries need the right file version.
- **CPT licensing dominates content cost.** At $18.50 per user per year, the CPT royalty is small next to engineering cost. The real constraint is the **AI Addendum**: the design should use CPT descriptors only through retrieval at inference time and must not fine-tune on the CPT data file. Whether fine-tuning on a customer's own labeled charts counts as "CPT Standard Data File content" is not answered publicly and needs AMA confirmation (see Gaps).
- **Sequencing for an MVP**: start with NCCI, MUE, MDM-grid and ICD-10 specificity checks, which use free content, plus a CPT distribution license and the AI Addendum. Add Coding Clinic and CPT Assistant citations later because they are licensed per user and AHA's commercial/AI terms must be negotiated.
- Commercial payer rules are the hardest content to scale. They are public but unstructured PDFs that differ by payer. A pragmatic MVP uses Medicare rules as the baseline and lets each customer upload a few payer policies.

### Gaps
- Full text of the AMA AI Addendum, and whether it adds AI-specific royalties. AMA reviews AI products case by case.
- Whether LLM *outputs* that contain CPT codes or descriptors shown to end users are covered by a standard distribution license. The AMA FAQ only says such outputs "must follow your license agreement".
- Exact 2026 CPT distribution schedule. The AMA compliance page was 403 to direct fetch, so figures come from search snippets.
- Wolters Kluwer, Solventum (3M) and AAPC API pricing: no public figures found.
- Whether CMS NCCI downloads need a CPT click-through license. Not stated on the fetched page.
- Aetna, Cigna, Elevance and other payers' policy portals, and any vendor that aggregates payer policies into structured data: not found in this research.

---

## 2. Evidence on LLM accuracy for medical coding (peer-reviewed or preprint vs vendor claims)

### Takeaway
LLMs asked to "just output the code" are unreliable. The best GPT-4 in 2024 exactly matched only 34–50% of codes, and many errors are "near misses" in the ICD-10 hierarchy. Accuracy rises sharply when the LLM does narrower jobs and other components handle the code logic:
- grading the MDM elements and letting rules map them to the E/M level (ProFees: +37 points over a commercial system);
- retrieving candidate codes before choosing (Mount Sinai 2025: beat physicians on ED primary diagnoses);
- verifying among sibling codes (Amazon 2025: up to +16 F1).

The 2026 specialty CPT studies on newer models (Claude 4.x, Gemini 2.5/3, GPT-5.x) still report roughly 40–82% exact match, with no consistent winner. Human coders also disagree heavily on E/M levels, so labels are noisy. Vendor accuracy claims of 95%+ are self-reported.

### Cited Findings

**Peer-reviewed / preprint evidence**
- **Soroush et al., NEJM AI, Apr 2024** ("Large Language Models Are Poor Medical Coders"): Models got the *official description* of each code and had to output the code, a lookup task rather than coding from notes. Over 27,000 unique codes from Mount Sinai. GPT-4 exact match was **45.9% ICD-9-CM, 33.9% ICD-10-CM and 49.8% CPT**. GPT-3.5, Gemini Pro and Llama-2-70b were all below 50%. Authors note real-world performance could be worse. — [ScienceDaily summary of NEJM AI DOI 10.1056/AIdbp2300040](https://www.sciencedaily.com/releases/2024/04/240422120603.htm); [Medical Economics](https://www.medicaleconomics.com/view/study-ai-struggles-as-medical-coder)
- **Klang et al., NEJM AI 2025;2(10), DOI 10.1056/AIcs2401161** ("Assessing retrieval-augmented LLMs for medical coding"):
  - Method ("lookup-before-coding"): the model writes a plain-language diagnosis description, retrieves 10 similar ICD entries from more than 1M hospital records along with their frequencies, then picks the code.
  - Data: 500 ED visits, each run through 9 models, judged blind by emergency physicians and 2 AI systems.
  - Results: retrieval-enhanced models beat baseline LLMs and "often exceeded physician-assigned codes". Small open-source models with retrieval came close to large commercial models.
  - Limits: primary ED diagnosis only, and not approved for billing.
  - Source: [AJMC, Sep 25, 2025](https://www.ajmc.com/view/simple-retrieval-step-boosts-ai-accuracy-in-assigning-icd-codes); preprint with RAG over 1,038,066 ED visits: [medRxiv 2024.10.15.24315526](https://www.medrxiv.org/content/10.1101/2024.10.15.24315526.full.pdf)
- **ProFees (Oracle Health & AI), EMNLP 2025 Industry Track (peer-reviewed), outpatient CPT E/M**:
  - Data: 216 de-identified outpatient/preventive encounters across family practice, internal medicine, urology, hematology, oncology and cardiology. 117 dev, 99 test; average 434–543 words per note.
  - Model: Azure GPT-4o. The LLM classifies encounter type and **Problem/Data/Risk** complexity. An LLM critic (RCI) checks each MDM element. Self-consistency uses K=3 runs with majority vote. A **rule-based decision tree** applies the 2-of-3 rule and patient type (new vs established, from EHR data) to produce the CPT code.
  - Results: the full system scored **+36.85 points** CPT accuracy over a commercial E/M coder ("System A") and **+4.73 points** over the strongest single-prompt baseline. The paper's conclusion says "30.61%", which is inconsistent with its own table.
  - Ablations: the critic added **+4% CPT / +7.6 MDM**. K=3 self-consistency added only **+1.2% CPT at 3× cost**. Few-shot added about +2.3% CPT.
  - Absolute accuracy is not reported (only deltas), and the test set is private.
  - Source: [arXiv 2510.25007 / EMNLP 2025 industry.84](https://arxiv.org/html/2510.25007v1)
- **Yuan, Shing, Strong, Shivade (Cambridge/Amazon), arXiv Oct 2025 (preprint), outpatient ICD-10-CM**:
  - Dataset: a new benchmark of 207 outpatient notes from ACI-Bench (67 train / 20 dev / 120 test), double-annotated with arbitration.
  - Prompting: Claude Sonnet-3.5v1 exact-match F1 rose from **39.8 → 55.6** with detailed instructions plus chain-of-thought.
  - Near misses: many errors are hierarchical near misses (e.g. I11.0 vs I11.9). Sonnet-3.5v2 scored **43.0 exact-match vs 53.8 prefix-2 match**.
  - Fine-tuning: Haiku-3 fine-tuned on only 67 examples rose from **40.6 → 56.9**. Training on code-only targets collapsed to 0.
  - Verification: the "generate → expand to sibling/cousin codes → LLM verify" pipeline lifted Haiku-3 from 41.6 to 47.2 and fine-tuned Haiku to **57.6 F1**. The oracle upper bound was 67.3.
  - Inpatient models transfer poorly: the MIMIC-trained PLM-ICD scored 24.8 F1.
  - Source: [arXiv 2510.07629](https://arxiv.org/pdf/2510.07629)
- **medRxiv 2024 inpatient ICD-10-CM extraction benchmark**: GPT-4, Claude 2.1/3 and Gemini all showed poor concordance with a human coder. GPT-4 was best overall and Claude 3 best on primary diagnosis. — [medRxiv 2024.04.29.24306573](https://www.medrxiv.org/content/10.1101/2024.04.29.24306573.full.pdf)
- **"LLMs are good medical coders, if provided with tools" (arXiv 2024)**: retrieve-then-rank reached 100% top-1 on 100 single-term conditions versus 6% for vanilla GPT-3.5. The inputs were simplified. — [arXiv 2407.12849](https://arxiv.org/pdf/2407.12849)
- **2026 specialty CPT studies on newer models.** These figures come from abstracts or snippets.
  - **Spine** (NASS scenarios, 2026 CPT): Gemini 1.5 Pro 65%, ChatGPT-4o 55%, Claude 4.6 Sonnet 40% exact match. Differences were not significant, and bundling logic was weak. — [Spine J / ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1529943026006418)
  - **Orthopedic procedure notes** (preprint, 28 notes): Claude Opus 4.5 F1 65.9%, Gemini 3 Pro 62.1%, GPT-5.2 56.8%. No hallucinated codes. — [Research Square rs-8475390](https://www.researchsquare.com/article/rs-8475390/v1)
  - **Foot/ankle** (simple single-code CPT): Gemini 2.5 Flash 82.1%, Claude 4.0 Sonnet 72.6%, GPT-5 mini 59.5%. — [PubMed 42169810](https://pubmed.ncbi.nlm.nih.gov/42169810/)
  - **Hand surgery** (older models): CPT 91.5% vs ICD-10 23.9% correct. — [PubMed 42171370](https://pubmed.ncbi.nlm.nih.gov/42171370/)
- **Extraction tasks (adjacent evidence)**: a small open-source LLM extracting 16 signs and symptoms from ED reports reached 0.910–0.929 weighted accuracy versus 0.951–0.961 for physicians. — [JMIR Med Inform 2026 e81500](https://doi.org/10.2196/81500)

**Human baseline: coders disagree, and claims are often wrong**
- **OIG (report OEI-04-10-00181, 2014, on 2010 Medicare claims)**:
  - Sample: 657 E/M claims reviewed by certified coders.
  - **42%** were incorrectly coded, mostly upcoded; 19% lacked documentation; 55% had coding and/or documentation errors overall.
  - About **$6.7B** was paid in error, 21% of E/M payments.
  - Source: [HHS OIG report](https://oig.hhs.gov/reports/all/2014/improper-payments-for-evaluation-and-management-services-cost-medicare-billions-in-2010/)
- **Inter-coder agreement**:
  - 136 certified coders coding 6 hypothetical office notes agreed on the "correct" code **58.7%** of the time, with a per-case range of 50–70%. This is from a secondary report, and the response rate was low. — [Psychiatric News 2002](https://psychiatryonline.org/doi/10.1176/pn.37.7.0010)
  - In a 2000 pilot, 5 coders with more than 12 years' experience each coded 6 notes, and only 1 of 6 codes was agreed by all. — [J Am Board Fam Pract 2000;13(2):144](https://www.jabfm.org/content/13/2/144.full.pdf); summarized in [USPTO patent 8650148](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/8650148)
  - Kappa was 0.016 and 0.18 in a small hospitalist survey. — [SHM abstract](https://shmabstracts.org/?p=19221)
  - In the ProFees dev set, an expert agreed with the professional coder's E/M code on only **44%** of encounters and disagreed on **56%**. — [ProFees](https://arxiv.org/html/2510.25007v1)

**Vendor claims (self-reported, not independently verified)**
- **Fathom**: "~90% or more" of encounters coded autonomously *or* flagged for documentation gaps, with "96%+ accuracy" per ongoing audits. — [AVIA Marketplace listing](https://marketplace.aviahealth.com/compare/77276/79390). Fathom's press release says a KLAS spotlight validated its 90% automation rates. — [Fathom press release](https://www.silicon.co.uk/press-release/fathom-earns-100-high-customer-satisfaction-and-full-validation-of-90-coding-automation-rates-in-klas-spotlight-report)
- **CodaMetrix**: reported as #1 in 2026 Best in KLAS for autonomous coding. UMass Memorial reports an **86%** automation rate. — [OmniMD review](https://omnimd.com/blog/best-medical-coding-automation-tools/). Gartner's listing says low-confidence codes are flagged for manual review, with a full audit trail. — [Gartner](https://www.gartner.com/reviews/vendor/codametrix). Peer-reviewed accuracy studies are scarce. — [RFP.wiki](https://www.rfp.wiki/vendors/codametrix)
- **Nym**: claims >95% accuracy with "zero human intervention". — [CB Insights](https://www.cbinsights.com/compare/fathom-4-vs-nym-1). Also claims a 97% reduction in radiology coding denials. — [Nym blog](https://blog.nym.health/how-autonomous-medical-coding-reduces-audit-risk/)
- **Definitions differ.** "Automation rate" can count encounters flagged for deficiencies (Fathom) or only encounters coded with no human touch (CB Insights wording), so cross-vendor comparisons are unreliable. — [ToolRadar guide](https://toolradar.com/guides/best-ai-medical-coding-software); [AVIA](https://marketplace.aviahealth.com/compare/77276/79390)

### Inferences
- **What LLMs do well**: reading a note and pulling out structured facts with supporting text. Examples: which problems were addressed and how acute or chronic they are, which tests and outside records were reviewed, which drugs were managed, whether surgery was discussed, whether a procedure was separately documented. Also judging a small set of candidates once those candidates are retrieved.
- **What LLMs do poorly**: recalling exact codes from memory (hierarchy near misses, e.g. 4th–7th character specificity), multi-code bundling logic (NCCI-type rules; the spine study flagged this) and anything table-driven.
- **Implication for a pre-bill review product**: the system checks *assigned* codes against the note rather than generating codes from scratch, so it can frame each check as a verification question with retrieved candidates. That is exactly the setting where verification gave the largest lifts (Amazon, Mount Sinai 2025).
- Human inter-coder agreement of roughly 45–70% on E/M level caps any "accuracy versus a single coder" metric. Gold labels need adjudication, and the product should flag only where its evidence is strong.

### Gaps
- No peer-reviewed public benchmark of 2026 frontier models (Claude Opus/Sonnet 5.x, GPT-5.x, Gemini 3) on outpatient E/M leveling or on full professional-fee claim review (CPT + ICD-10 + modifiers) from notes was found.
- ProFees reports only relative gains, not absolute E/M accuracy.
- No recent (post-2021 guidelines) peer-reviewed inter-rater study of certified coders on MDM-based E/M levels was found. The older figures predate the 2021 MDM rules.
- No independent (non-vendor, non-KLAS-summary) audit of Fathom, CodaMetrix or Nym accuracy was found. The KLAS reports themselves were not accessed.
- Accuracy of LLMs specifically on modifier assignment (e.g. 25, 59/X{EPSU}) was not found in the literature.

---

## 3. Recommended architecture patterns

### Takeaway
The evidence points to a hybrid design:
1. **The LLM extracts structured, evidence-linked facts** (MDM elements, documented procedures, diagnoses with specificity cues).
2. **Deterministic rules and tables decide the code logic**: the MDM 2-of-3 grid, new vs established patient, NCCI PTP/MUE, LCD diagnosis lists, ICD-10 billability.
3. **Retrieval plus a verify step** chooses among candidate codes.
4. **A critic or self-consistency step plus confidence thresholds** sends uncertain items to a human, with every flag citing note spans.

Published systems (ProFees, Amazon, Mount Sinai) and vendors (Nym, CodaMetrix) describe versions of this pattern.

### Cited Findings
- **ProFees blueprint (E/M)**:
  - An encounter-type classifier uses note, age and patient type.
  - An MDM complexity classifier predicts Problem/Data/Risk levels, each with a critic checklist targeting common errors.
  - Dynamic few-shot retrieval pulls N=3 similar exemplars.
  - Self-consistency runs K=3 parallel calls with majority vote, at temperature 0.
  - A **rule-based decision tree** makes the final 2-of-3 MDM and CPT mapping and outputs a justification.
  - The paper lists real-world complexities: missing intermediate MDM labels, label noise (56% disagreement), the need for explainability, stochastic outputs, and breadth of guideline edge cases.
  - Source: [ProFees arXiv 2510.25007](https://arxiv.org/html/2510.25007v1)
- **Generate → expand → verify (ICD-10)**: the LLM proposes a code, the ICD-10-CM tabular tree supplies siblings and cousins, and an LLM verifier picks among them. Giving the verifier code *descriptions* (not just codes) gave the best verification accuracy, while chain-of-thought did not help verification. Broader expansion raises recall but adds near-miss distractors. — [Yuan et al. arXiv 2510.07629](https://arxiv.org/pdf/2510.07629)
- **Retrieval before coding**: a description is generated, then the top 10 codes are retrieved from historical coded encounters with their frequencies, then the code is selected. This lets small open-source models approach large commercial ones. — [AJMC on Klang et al. NEJM AI 2025](https://www.ajmc.com/view/simple-retrieval-step-boosts-ai-accuracy-in-assigning-icd-codes)
- **Confidence routing and audit trail (vendors)**:
  - Nym sends high-confidence encounters straight to billing with a full audit trail and routes below-threshold encounters to human coders. Its engine "identifies the actual phrases, values, and clinical findings that meet coding criteria." — [Nym blog: EHR roadmap](https://blog.nym.health/autonomous-medical-coding-on-your-ehrs-roadmap-what-to-ask-before-you-wait/); [Nym: transparent AI](https://blog.nym.health/transparent-ai-for-medical-coding); [Nym datasheet 2019](https://nym.health/wp-content/uploads/2019/09/nym_datasheet_07_2019-web.pdf)
  - CodaMetrix flags codes below a configured confidence level for manual review. Buyers set their own confidence cutoffs during implementation. — [Gartner](https://www.gartner.com/reviews/vendor/codametrix); [RFP.wiki](https://www.rfp.wiki/vendors/codametrix)
- **Evidence linking**:
  - LLM-codex has an LLM propose sentence-level evidence and a separate verifier model confirm it, with no training on annotated evidence. — [arXiv 2311.13735](https://arxiv.org/html/2311.13735v1)
  - AKASA describes a code-verification pipeline using attention-based multiple-instance learning to handle long records with interpretable, high-confidence predictions. — [AKASA blog](https://akasa.com/?p=8790)
- **Platform features that support this on Claude**:
  - The Messages API supports **Citations**, which return the exact cited text with character offsets into supplied documents, and **structured outputs**. Both are HIPAA-eligible; structured outputs is "qualified" because the JSON schema is cached for up to 24h.
  - Prompt caching is HIPAA-eligible.
  - Citations cannot be combined with structured-output format in the same request.
  - Source: [Anthropic API and data retention – feature eligibility](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention); [Anthropic Citations docs](https://platform.claude.com/docs/en/build-with-claude/citations)
- **Rules data for the deterministic layer**: quarterly NCCI PTP/MUE/add-on edits ([CMS](https://www.cms.gov/medicare/coding/ncci-coding-edits)), MCD Articles with ICD-10 lists ([CMS MLN](https://cms.gov/outreach-and-education/mln/educational-tools/mln901347-how-to-mcd/mcd/mcd/chapter_6_downloads)), the ICD-10-CM tabular list ([CDC](https://www.cdc.gov/nchs/icd/comprehensive-listing-of-icd-10-cm-files.htm)) and PFS RVUs for dollar impact ([CMS RVU](https://www.cms.gov/medicare/payment/fee-schedules/physician/pfs-relative-value-files/rvu24d)).
- **Licensing constraint on design**: CPT content may be used by retrieval at inference but not to train or fine-tune models. — [AMA AI FAQ](https://www.ama-assn.org/practice-management/cpt/licensing-cpt-ai-faqs)

### Inferences
Suggested MVP pipeline, synthesizing the above:
1. **Normalize inputs**: note text with sections, claim lines (CPT/HCPCS, units, modifiers, ICD-10 pointers), patient type, place of service and payer.
2. **Run deterministic pre-checks first.** They are cheap, certain and need no LLM: NCCI PTP pairs and modifier indicators, MUE units, ICD-10 billable-leaf validity, age/sex edits, LCD diagnosis-list match, add-on code without its primary code.
3. **Run LLM extraction calls with a fixed JSON schema**, each returning facts plus quoted spans:
   - MDM-Problems: each problem's status (acute uncomplicated, chronic stable, chronic with exacerbation, etc.)
   - MDM-Data: tests ordered or reviewed, external notes, independent historian, independent interpretation, discussion with another clinician
   - MDM-Risk: prescription drug management, decision about surgery, social determinants of health
   - Time documented
   - Procedures performed and whether the E/M is separately identifiable (modifier 25 support)
   - Diagnosis specificity cues: laterality, type, complications
4. **Apply rules**: the MDM grid gives the supported E/M level, which is compared with the billed level. Diagnosis-to-code comparison uses expand-and-verify against the ICD-10 tree.
5. **Run a critic/verify pass only on discrepancies**, using a stronger model, at least two samples, or both. This keeps cost proportional to flags.
6. **Score confidence and route**:
   - Inputs: extraction agreement across samples, rule certainty, and dollar impact from PFS RVUs.
   - High-confidence, high-impact flags go to a coder queue with evidence highlighted.
   - Low-confidence flags are suppressed or logged.
7. **Log versions** of every rule-file and model used, for audit defense.

Because thresholds are tuned for precision, a coder sees few false flags. The aim is acceptance rate, not raw recall.

### Gaps
- No public engineering write-up from Fathom, CodaMetrix, SmarterDx or Abridge describing LLM-plus-rules architecture in detail was found.
- No published guidance was found on how to set confidence thresholds for pre-bill flags (as opposed to autonomous coding).

---

## 4. Evaluation: datasets, labeling, agreement and metrics

### Takeaway
There is no public outpatient professional-fee dataset with notes + CPT/E/M + ICD-10 + modifiers. MIMIC and MDACE are inpatient/ICU-centric (MDACE has only 52 pro-fee charts). Amazon's ACI-Bench-derived outpatient set covers ICD-10 only. A builder must therefore build a private gold set:
- certified coders double-code a sample of real de-identified charts;
- disagreements go to an expert adjudicator;
- intermediate MDM element labels and evidence spans are captured, not just final codes.

Report per-element accuracy, flag precision and recall, hierarchical (near-miss) metrics, acceptance rate and dollar impact. Expect only about 44–70% raw agreement among human coders on E/M level.

### Cited Findings
- **Labeling approach in ProFees**: physician code plus professional coder code (used for billing), then an internal expert re-annotated E/M code, Problem/Data/Risk levels and free-text justifications. A "Platinum" subset (coders agreed, 44%) was used to tune prompts first, and labeling errors found during error analysis were corrected. — [ProFees](https://arxiv.org/html/2510.25007v1)
- **Labeling approach in the Amazon outpatient ICD-10 benchmark**: double expert annotation with arbitration, plus binary "valid code" verification labels, evaluated per note. The dataset is public at github.com/amazon-science/toward-clinical-coding-verification-adaptation. — [Yuan et al.](https://arxiv.org/pdf/2510.07629)
- **Metric design**: exact-match F1 hides near misses, so also report Prefix-1/Prefix-2 match F1 and a Prefix Overlap Ratio for hierarchical closeness. — [Yuan et al.](https://arxiv.org/pdf/2510.07629). ProFees reports CPT accuracy plus per-element MDM, Problem, Data and Risk accuracy, averaged over 5 runs with standard deviation to capture LLM randomness. — [ProFees](https://arxiv.org/html/2510.25007v1)
- **Public datasets**:
  - MIMIC-III/IV is ICU/inpatient, uses ICD-9 in older releases, and has codes spanning the whole encounter rather than one note. — [Yuan et al.](https://arxiv.org/pdf/2510.07629)
  - **MDACE** has 302 inpatient charts (3,934 evidence spans) and **52 pro-fee charts (5,563 evidence spans)** annotated by professional coders. It is built on MIMIC-III and requires a PhysioNet license. Code is MIT-licensed at github.com/3mcloud/MDACE. — [MDACE, ACL 2023](https://arxiv.org/pdf/2307.03859)
  - The ACI-Bench-derived outpatient ICD-10 set (207 notes) is public. — [Yuan et al.](https://arxiv.org/pdf/2510.07629)
  - The ProFees test set is private. — [ProFees](https://arxiv.org/html/2510.25007v1)
- **Human agreement benchmarks** (to set expectations): 58.7% agreement among 136 certified coders ([Psychiatric News](https://psychiatryonline.org/doi/10.1176/pn.37.7.0010)); expert vs professional coder 44% agree / 56% disagree ([ProFees](https://arxiv.org/html/2510.25007v1)); 1 of 6 notes unanimously coded by 5 experts ([JABFM 2000](https://www.jabfm.org/content/13/2/144.full.pdf)).
- **Financial-impact framing**: OIG found 21% of Medicare E/M dollars ($6.7B) paid in error in 2010, mostly upcoding. — [HHS OIG](https://oig.hhs.gov/reports/all/2014/improper-payments-for-evaluation-and-management-services-cost-medicare-billions-in-2010/). PFS RVU files let you price each corrected code. — [CMS RVU files](https://www.cms.gov/medicare/payment/fee-schedules/physician/pfs-relative-value-files/rvu24d)
- **Accuracy targets used in industry**: one coder job posting requires E/M audit accuracy of 95–100% as the standard. — [AAPC job posting](https://jobs.aapc.com/job/1035365/coder/)

### Inferences
**Gold set recipe for an MVP**
- **Size**: 300–500 de-identified charts across 3–5 target specialties.
- **Labels**: two CPC coders label each chart independently with final codes, MDM element levels, the note spans supporting each, and the modifier decision.
- **Adjudication**: an auditor (CPMA/CRC) resolves disagreements.
- **Splits**: keep an "agreement" subset and an "adjudicated-disagreement" subset, as ProFees did, and report both.
- **Cost**: at the human throughput in section 6 (roughly 6–20 charts/hour), double-coding plus adjudicating 400 charts is roughly 60–150 coder-hours. This is an estimate, not a sourced figure.

**Metrics to report**
1. Flag precision, i.e. the share of flags a coder accepts. This drives trust.
2. Flag recall against adjudicated errors.
3. Per-check precision and recall (E/M level, ICD specificity, NCCI, MUE, modifier 25/59, LCD).
4. Hierarchical ICD metrics.
5. Dollar impact per 100 charts (net of up- and down-coding).
6. Run-to-run stability. Repeat each eval about 5×, as ProFees did.

**Synthetic notes**: useful for unit-testing rule checks and adversarial cases (e.g. a note supports 99213 but 99215 was billed). They should not be the headline metric, because the Amazon paper showed inpatient-to-outpatient transfer failure, which suggests distribution shift matters.

### Gaps
- No public outpatient professional-fee dataset with E/M levels and CPT/modifier labels was found.
- No published 2024–2026 inter-rater study of coders under the 2021+ MDM rules was found.
- Synthetic-note generators specific to outpatient coding (e.g. Synthea-based), and evidence on how well synthetic-note evaluations predict real-chart performance: not researched or found.
- Published benchmarks for coder "acceptance rate" of AI pre-bill flags: none found.

---

## 5. HIPAA-eligible LLM access (BAAs, retention, open-source hosting)

### Takeaway
All major routes can be used with PHI under a BAA:
- **Anthropic first-party API**: self-serve BAA plus a HIPAA-ready organization, with automatic blocking of ineligible features.
- **AWS Bedrock**: HIPAA-eligible service under the AWS BAA.
- **Google Cloud generative AI / Gemini on Agent Platform**: covered by the GCP BAA; pre-GA features excluded.
- **Azure OpenAI**: covered under Microsoft's terms, per secondary sources.
- **OpenAI API**: BAA available, tied to zero or modified retention.

The key builder gotcha on Anthropic first-party is that the **Batch API (50% discount) and Files API are not HIPAA-eligible**. Prompt caching, citations and structured outputs are eligible.

### Cited Findings
- **Anthropic (Claude API)**:
  - With a signed BAA and a HIPAA-enabled org, supported features can process PHI. Eligible orgs can execute the BAA and enable HIPAA readiness **directly from the Claude Console**, or negotiate via sales.
  - Once enabled, it is **permanent**, and the API returns HTTP 400 for non-eligible features.
  - HIPAA readiness replaces the old ZDR requirement: "you do not also need ZDR".
  - Not covered: consumer plans; PHI processed through the Console UI; Claude Platform on AWS; Microsoft Foundry; Claude Code; beta features unless listed. Bedrock and Google Cloud are covered by those providers' own compliance terms.
  - Source: [Anthropic API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)
- **Anthropic feature eligibility table**:
  - Eligible: Messages API, prompt caching, citations, PDF support (inline), token counting, 1M context, adaptive thinking.
  - Structured outputs: "Yes (qualified)".
  - **Not eligible: Batch processing** ("29-day retention; async storage required") and **Files API**.
  - "Covered Models" (Claude Fable 5/5.1, Mythos 5/5.1) require 30-day retention and are unavailable under ZDR.
  - Source: [Anthropic API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)
- **AWS**: the HIPAA Eligible Services Reference (last updated Oct 15, 2026) lists **Amazon Bedrock** and Bedrock AgentCore. It also lists **Amazon SageMaker AI**, with exclusions such as Studio Lab and Ground Truth Plus, which is the route for self-hosting open-source models. — [AWS HIPAA Eligible Services Reference](https://aws.amazon.com/compliance/hipaa-eligible-services-reference/). The AWS BAA is accepted via AWS Artifact. — [Aptible](https://www.aptible.com/hipaa-compliant-ai-tools)
- **Google Cloud**: the BAA-covered list includes "Generative AI on Agent Platform", "Gemini Enterprise Agent Platform", Gemini Enterprise and Vertex AI Workbench. "Don't use pre-GA offerings ... with PHI." — [Google Cloud HIPAA compliance](https://docs.cloud.google.com/docs/security/compliance/hipaa). The consumer Gemini API (AI Studio) is reported to have no BAA. — [Aptible](https://www.aptible.com/hipaa-compliant-ai-tools)
- **Azure OpenAI**: reported as covered by Microsoft's BAA via the product terms/DPA, with no separate contract. This is a secondary source; the Microsoft page was not fetched. — [Aptible](https://www.aptible.com/hipaa-compliant-ai-tools); [Taction](https://www.tactionsoft.com/blog/baas-with-openai-anthropic-aws-bedrock/)
- **OpenAI API**: BAAs are offered for API healthcare workloads, requested via baa@openai.com. The healthcare addendum requires the org to be ZDR-approved before sending PHI to the Zero Retention API. Secondary sources conflict on whether "Modified Retention" is also an eligible path. — [OpenAI healthcare addendum (PDF)](https://cdn.openai.com/osa/healthcare-addendum.pdf); [AccountableHQ](https://www.accountablehq.com/post/is-openai-hipaa-compliant-current-status-baas-and-secure-alternatives). The OpenAI help-center BAA page returned 403 to direct fetch.
- **Open-source / on-prem**:
  - Retrieval-augmented small open-source models came close to large commercial models on ED ICD coding. — [AJMC on Klang 2025](https://www.ajmc.com/view/simple-retrieval-step-boosts-ai-accuracy-in-assigning-icd-codes)
  - A 2026 on-premises pilot evaluated 14 open-source 30–90B models (4/8-bit quantized) for EHR extraction. — [PMC13239439](https://pmc.ncbi.nlm.nih.gov/articles/PMC13239439/)
  - A BAA must cover the exact plan and configuration deployed. — [Aloa](https://aloa.co/ai/resources/deep-dive/how-to-make-any-ai-model-hipaa-compliant)

### Inferences
- **Default for a startup MVP**: Anthropic first-party API with HIPAA readiness, or Bedrock if the company is AWS-native. Bedrock keeps PHI inside the AWS account and may make customer security reviews easier. Cache-friendly prompts matter more than batching on Anthropic 1P because batching is not BAA-eligible there.
- **Batch discount for PHI**: if overnight pre-bill runs need it, check whether Bedrock batch inference is BAA-covered (not verified here) or de-identify before batching.
- **Separate orgs**: keep a separate non-HIPAA org for synthetic and dev data, because HIPAA readiness is org-wide and permanent.

### Gaps
- Bedrock batch inference HIPAA status, and Bedrock and Vertex pricing for Claude models (the partners publish their own pricing): not verified.
- Microsoft Azure OpenAI / Foundry BAA scope: not verified on a primary Microsoft page.
- OpenAI's current eligible-endpoint list: the help-center page was blocked.

---

## 6. Unit cost: note length, LLM inference cost per chart, human QA cost per chart

### Takeaway
A typical outpatient note is about 450–650 words. Inside a review prompt it is roughly 1–3K tokens, or about 3–8K tokens with claim lines, problem list and meds.

At October 2026 Anthropic list prices, a 10–20-check pipeline costs about:
- **$0.006–$0.03 per chart** on Haiku 5.5;
- **$0.11–$0.62** on Sonnet 5.5;
- **$0.21–$1.23** on Opus 5.5.

These figures assume the shared prefix (rules plus note) is cached across checks and include the 1.1× US-only multiplier at the top end. Output and thinking tokens dominate. Self-consistency (K=3) roughly triples the cost of the checks it is applied to.

Human coder review costs roughly **$1.20–$7 per outpatient chart**, based on a CPC wage of about $24–$40/hr loaded and 6–20 charts/hr. LLM cost is therefore a small fraction of human QA cost. The economics are driven by human review of flags.

### Cited Findings
- **Note length**:
  - OHSU, about 3M outpatient progress notes across 46 specialties: median length rose from **401 words (2009) to 642 words (2018)**. By 2018, 59% of text duplicated the patient's prior note and 71% came from templates or copy-paste. — [OHSU Research Week 2021 (Rule et al.)](https://digitalcollections.ohsu.edu/record/9251/files/Rule-Adam-OHSU-ResearchWeek-2021.pdf)
  - Epic Research (1.7B notes, all types): average note rose from **4,628 to 5,002 characters** (2020–2023). — [Healthcare IT News](https://cloudgate.healthcareitnews.com/news/epic-research-shows-note-bloat-increased-8)
  - ProFees outpatient notes averaged **434–543 words**. — [ProFees](https://arxiv.org/html/2510.25007v1)
- **Tokenizer**: Claude 4.7 and later models use a tokenizer that produces "approximately 30% more tokens for the same text". — [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- **Anthropic list prices** (per million tokens, Oct 2026; columns are input / 5-min cache write / cache read / output):

  | Model | Input | Cache write | Cache read | Output |
  |---|---|---|---|---|
  | Claude Opus 5.5 | $4 | $5 | $0.20 | $20 |
  | Claude Sonnet 5.5 | $2 | $2.50 | $0.10 | $10 |
  | Claude Sonnet 4.6 | $3 | — | $0.30 | $15 |
  | Claude Haiku 5.5 (prompts ≤100K) | $0.10 | $0.125 | $0.01 | $0.50 |
  | Claude Haiku 4.5 | $1 | — | — | $5 |

  Source: [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- **Price modifiers**:
  - Batch API: **50% off** input and output (not HIPAA-eligible on 1P; see section 5).
  - US-only inference (`inference_geo: "us"`): **1.1×** on all token categories.
  - Bedrock and Vertex set their own regional pricing.
  - Source: [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- **OpenAI pricing**: secondary sources conflict. One reports GPT-5.6 tiers at $5/$30, $2/$12 and $0.20/$1.20 per M input/output after a Jul 30, 2026 price cut, with cached input at 10% and Batch at 50% off. Unverified against openai.com. — [CloudZero](https://www.cloudzero.com/blog/openai-api-pricing/); [Morph (Jun 2026)](https://morphllm.com/openai-api-pricing)
- **Self-consistency cost**: in ProFees, K=3 gave +1.2% CPT and +2.7% MDM at **3× unit cost**, and K=5 gave +3.1% CPT and +6.8% MDM at more than 4× cost. — [ProFees](https://arxiv.org/html/2510.25007v1)
- **Human coder wages**:
  - AAPC salary page shows a CPC average of **$64,495** (labeled 2023; $60,712 in 2022). — [AAPC salary by credential](https://aapc.com/resources/salary-by-credential)
  - BLS median for medical records specialists was **$50,250/yr (May 2024)**: $45,620 in physician offices and $56,520 in hospitals. — [BLS OOH](https://www.bls.gov/ooh/healthcare/medical-records-and-health-information-technicians.htm)
- **Coder throughput** (anecdotal or employer-specific):
  - 12–20 E/M charts/hr, or 12–15 charts/hr required by one client. — [AAPC forum](https://www.aapc.com/discuss/threads/coding-productivity.155725)
  - A minimum of 10 charts/hr in an ED coding job posting. — [AAPC job](https://jobs.aapc.com/job/1035365/coder/)
  - 45 outpatient physician charts/day with diagnosis + CPT, versus 75/day for diagnosis only, in a 2020 university RFP. — [UNM Health RFP P427-20](https://fr.unmhealth.org/about/_files/_files-current-bids/rfp-p427-20-medical-coders-and-auditors-5th-amendment-10-6-20.pdf)

**Computed LLM cost per chart.** This is an inference built on the cited prices.

Assumptions:
- One shared cached prefix per chart (system rubric plus guideline excerpts plus the note and claim). It is written once at 1.25× and read by every later check at the cache-read rate.
- About 300 uncached tokens of check-specific instruction per check.
- Output includes thinking tokens.

| Scenario | Haiku 5.5 | Sonnet 5.5 | Opus 5.5 |
|---|---|---|---|
| Lean: 10 checks, 6K prefix, 800 output tokens/check | $0.006 (no cache $0.010) | $0.106 (no cache $0.206) | $0.213 (no cache $0.412) |
| Typical: 15 checks, 8K prefix, 1.5K output/check | $0.014 ($0.024) | $0.265 ($0.474) | $0.530 ($0.948) |
| Heavy: 20 checks, 11K prefix, 2.5K output/check | $0.029 ($0.048) | $0.560 ($0.952) | $1.121 ($1.904) |

Add 10% for US-only inference. For example, Typical on Sonnet 5.5 becomes $0.29 and Heavy on Opus 5.5 becomes $1.23.

### Inferences
- **Output tokens dominate cost**: in the Typical Sonnet case, about $0.225 of $0.265 is output. Keep extraction outputs terse (IDs plus short span quotes or character offsets rather than prose) and set effort or thinking lower on simple checks.
- **Tiered model routing**: deterministic checks cost about $0; Haiku-class for simple extraction; Sonnet-class for MDM grading; escalate only discrepancies to Opus-class or K=3 sampling. This plausibly lands at about **$0.05–$0.30 per chart**. That is an estimate that needs measurement on real notes.
- **Human QA per chart**:
  - Loaded hourly cost: $24.16 (BLS median ÷ 2,080 hours) to $31.01 (AAPC CPC average ÷ 2,080), or about $31–$40 with a 30% benefits load (the load is an assumption).
  - At 20 charts/hr and $24/hr: about **$1.20/chart**.
  - At 6 charts/hr (45/day) and $40/hr: about **$6.70/chart**.
  - Reviewing only a *flag* with highlighted evidence should be faster than a full chart audit, but no published timing was found.
- Even Opus-class pipelines at about $1/chart are below the cost of a human chart review. The binding cost is coder time per flag, so flag precision (fewer false positives) is the main lever on unit economics.

### Gaps
- No published token-count distribution specifically for US outpatient professional notes with EHR context. The figures above are word counts converted by assumption.
- No authoritative 2025–2026 AAPC salary figure was verified. The $64,495 is labeled 2023 on AAPC's page; blog claims that it is the "2025" figure are unverified.
- No published time-per-flag benchmark for coders reviewing AI pre-bill suggestions.
- Bedrock and Vertex Claude pricing and OpenAI official pricing were not verified from primary pages.
