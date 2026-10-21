# CPT Gates an Otherwise Free Code Universe

Every US outpatient claim answers four questions in code. **Why** was the patient seen: a diagnosis code from ICD-10-CM. **What** was done: a service code from CPT or HCPCS Level II, plus modifiers. **Where** did it happen: a place-of-service code. **What did the insurer decide**: reason codes on the remittance, the insurer's electronic payment explanation. A separate layer of rule sets decides whether, and how much, each code pays. Nearly all of this is published free as downloadable files by federal agencies: the Centers for Medicare & Medicaid Services (CMS, which runs Medicare, the federal insurance program for people 65 and older), the Centers for Disease Control and Prevention (CDC), the Food and Drug Administration (FDA) and the National Library of Medicine (NLM). The exception that matters is **CPT** (Current Procedural Terminology), the American Medical Association's (AMA) copyrighted list of service codes. HIPAA, the law that standardizes electronic claims, requires it on every physician claim. Any product containing CPT needs an AMA license, which for a software distributor costs **$1,050 a year plus $18.50 per user**. The AMA **bans training or fine-tuning AI models on its CPT data file** but allows retrieval at the point of use. Dental codes, hospital billing codes and claim-format manuals are also licensed, but an outpatient MVP can avoid them. The scarce input is labeled data, not codes: **no public dataset pairs outpatient office notes with visit-level CPT codes**. CPT's copyright is under live legal attack, but as of October 21, 2026 the duty to license it stands.

*Evidence labels.* Unlabeled claims rest on primary sources: regulations, government files and pages, AMA documents, or the research team's own counts from official files. **[Vendor]** marks a company's claim about itself. **[Secondary]** marks press, market-research, law-firm or search-snippet sourcing. **[Inference]** marks this report's own judgment.

## Federal agencies give away most code sets; four owners charge

A **code set** is a fixed list of codes with meanings. HIPAA names the sets every electronic claim must use, and a code is valid only within the dates its maintainer sets ([45 CFR 162.1002](https://www.law.cornell.edu/cfr/text/45/162.1002); [45 CFR 162.1011](https://www.law.cornell.edu/cfr/text/45/162.1011)). The top seven rows matter for an outpatient product. The rest serve hospital, dental or EHR (electronic health record, the clinical charting software) workflows.

| Code set | Answers | Owner | Where it lives / how to fetch | Cost / license | Updates | Example |
|---|---|---|---|---|---|---|
| **ICD-10-CM** | Why: the diagnosis | CDC's National Center for Health Statistics, adapting the World Health Organization's (WHO) ICD-10 | CDC FTP and CMS ZIPs (text; XML tabular list); free NLM Clinical Tables API | Free, no login | Oct 1; some Apr 1 | E11.22 type 2 diabetes with kidney disease |
| **CPT** and its 2-digit modifiers | What the clinician did | AMA CPT Editorial Panel | AMA Intelligent Platform: Royalties Portal or Zip API. Free PDFs cover only a few new-code categories | Licensed per product and user | Jan 1; emerging-tech (Category III) and lab (PLA) codes several times a year | 99214 office visit; modifier 25 |
| **HCPCS Level II** and its letter modifiers | Supplies, drugs, Medicare-only services | CMS | Quarterly ZIP (fixed-width text + XLSX) | Free | Quarterly | G2211 visit-complexity add-on; RT right side |
| **Place of service (POS)** | Where | CMS | Web table + PDF | Free | Rare | 11 office; 10 telehealth at home |
| **NDC** (National Drug Code) | Which drug package | FDA | Daily ZIPs; openFDA JSON API | Free | Daily | 0006-3026-02 Keytruda vial |
| **CARC / RARC / claim status** (adjustment reason and remark codes) | Why the insurer paid less | Committee hosted by X12, the electronic-claim standards body (CARC); CMS (RARC) | Web lists on x12.org | Viewable free; X12 IP terms | ~3×/yr | CARC 97 bundled into another service |
| **NUCC provider taxonomy** | Clinician's specialty | National Uniform Claim Committee (AMA copyright) | CSV | Commercial use licensed | Jan 1, Jul 1 | 207Q00000X family medicine |
| **ICD-10-PCS** | Inpatient hospital procedures | CMS | ZIP | Free | Oct 1; Apr 1 | 0DTJ4ZZ laparoscopic appendectomy |
| **CDT** | Dental procedures | American Dental Association (ADA) | Commercial license only | Negotiated | Jan 1 | D2390 |
| **NUBC / UB-04 codes** | Hospital charge details (revenue center, bill type) | National Uniform Billing Committee, chaired by the American Hospital Association (AHA) | PDF e-book; data by contract | $578–$4,413/yr, 2025 edition **[Secondary]** | Annual, Jul 1 | 0450 emergency room |
| **SNOMED CT, LOINC, RxNorm** | Clinical meaning inside the EHR: problems, lab tests, medications | SNOMED International via NLM; Regenstrief; NLM | UMLS-login download; free LOINC account; keyless RxNav API | Free in the US | Mar/Sep; ~2×/yr; monthly | RxNorm 29046 lisinopril |

Sources: [CDC FY2027 files](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/); [NLM Clinical Tables](https://clinicaltables.nlm.nih.gov/apidoc/icd10cm/v3/doc.html); [AMA CPT overview](https://www.ama-assn.org/practice-management/cpt/cpt-code-set-overview); [AMA licensing](https://www.ama-assn.org/practice-management/cpt-licensing); [CMS HCPCS](https://www.cms.gov/medicare/coding/hcpcsreleasecodesets/hcpcs-quarterly-update); [CMS POS](https://www.cms.gov/medicare/coding-billing/place-of-service-codes/code-sets); [FDA NDC](https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory); [X12 CARC](https://x12.org/codes/claim-adjustment-reason-codes); [NUCC](https://www.nucc.org/index.php/code-sets-mainmenu-41/provider-taxonomy-mainmenu-40/csv-mainmenu-57); [CMS ICD-10](https://www.cms.gov/medicare/coding-billing/icd-10-codes); [ADA](https://www.ada.org/publications/ada-store-products/licensing-for-commercial-users); [NUBC](https://www.nubc.org/subcription-information); [NLM SNOMED CT](https://www.nlm.nih.gov/healthit/snomedct/us_edition.html); [NLM RxNorm](https://www.nlm.nih.gov/research/umls/rxnorm/docs/rxnormfiles.html).

The sets are large and churn constantly. Fiscal-2027 ICD-10-CM (live Oct 1, 2026) has **74,879 billable codes**, 190 new and 30 deleted, by the research team's count of CDC's file ([CDC](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-code-descriptions-2027.zip)). CPT holds "11,000+" codes, and CPT 2027 makes **453 changes**, including 10 new AI-related codes ([AMA](https://www.ama-assn.org/press-center/ama-press-releases/ama-releases-cpt-2027-code-set)). Office visits are **E/M (evaluation and management)** codes: 99202–99205 for new patients, 99211–99215 for established ones. The level is set by **medical decision making (MDM)**, graded on problems, data and risk with two of three required, or by the clinician's total time ([AMA E/M guidelines](https://www.ama-assn.org/system/files/2023-e-m-descriptors-guidelines.pdf)). WHO's ICD-11 has no US adoption date ([NCVHS](https://ncvhs.hhs.gov/wp-content/uploads/2021/09/NCVHS-ICD-11-recommendations-for-HHS-Sept-10-2021-Final-508.pdf)).

## One visit code passes through three separate layers

A code set only **defines**. Separate **rule sets** decide payment, and **transaction code sets** carry the claim and the answer. CPT 99214 in October 2026 shows all three.

| Layer | Source (owner) | What it says about 99214 |
|---|---|---|
| 1. Definition | CPT (AMA) | Established-patient office visit, moderate MDM or 30+ minutes. CMS files show only "Office o/p est mod 30 min" |
| 2a. Price | Physician Fee Schedule (Medicare's price list) RVU file (CMS) | Paid separately. 4.06 relative value units (RVUs: work, practice expense, malpractice) × $33.4009 = **$135.61** in an office, $84.50 in a hospital setting; $153.27 in Manhattan after the local cost index (GPCI) |
| 2b. Units | National Correct Coding Initiative (NCCI, CMS's edit tables): medically unlikely edit (MUE) | Maximum 2 per patient per day; appealable clinical limit |
| 2c. Code pairs | NCCI procedure-to-procedure (PTP) edit | With 99212 the same day, 99212 is denied unless a modifier applies (active since Oct 1, 2020) |
| 2d. Setting | Hospital outpatient file (OPPS Addendum B) | Not payable on a hospital bill; hospitals bill G0463 ($136.02) instead |
| 2e. Coverage | Medicare Coverage Database | Visits rarely listed; tests are. Vitamin D test 82306 has six regional versions of its covered-diagnosis list |
| 2f. Commercial insurers | Insurer policy PDFs | UnitedHealthcare posts ~100 reimbursement policies, updated by monthly bulletins, enforced by a licensed edit engine |
| 3. Transaction | X12 837P (electronic professional claim); 835 remittance | The claim line carries 99214, modifiers, units, diagnosis pointers and POS. The 835 explains cuts, e.g., CARC 45 (above contracted fee) or CARC 97 with remark M15 (bundled) |

Sources: [CMS RVU26D](https://www.cms.gov/files/zip/rvu26d.zip); [NCCI MUE](https://www.cms.gov/files/zip/medicare-ncci-2026-q4-practitioner-services-mue-table.zip); [NCCI PTP](https://www.cms.gov/files/zip/medicare-ncci-2026q4-practitioner-ptp-edits-ccipra-v323r0-f4.zip); [OPPS Addendum B](https://www.cms.gov/files/zip/October-2026-OPPS-Addendum-B.zip); [Coverage API](https://api.coverage.cms.gov/v1/reports/local-coverage-articles/); [UHC policies](https://www.uhcprovider.com/en/policies-protocols/commercial-policies/commercial-reimbursement-policies.html); [X12 RARC](https://x12.org/codes/remittance-advice-remark-codes).

A code table alone cannot answer "will this get paid?" The rule layer must be keyed by code, modifier, insurer, region, setting and **date of service** **[Inference]**. Medicare's rule files are free and each runs on its own clock; other insurers' rules arrive as documents:

| Rule set | What it decides | Format | Cadence |
|---|---|---|---|
| NCCI PTP, MUE and add-on edits; Policy Manual | Forbidden pairs, unit caps, add-ons needing a primary code | ZIP (TXT/CSV + XLSX); ~2.64M practitioner PTP rows | Quarterly; manual yearly |
| Physician Fee Schedule RVU files | Medicare price; surgery and bilateral flags | ZIP (CSV/TXT/XLSX) | Quarterly + corrections |
| National and local coverage determinations (NCDs, LCDs) and billing articles | Which diagnoses justify a service, per Medicare Administrative Contractor (MAC, the regional claims processor) | Weekly ZIP; JSON Coverage API (no key; one-hour license token) | Weekly |
| Average sales price (ASP) drug crosswalk | Drug billing units, prices | ZIP | Quarterly, revised later |
| Commercial insurers; state Medicaid (low-income coverage) | Insurer- and state-specific rules | PDF/HTML; ~50 state formats | Monthly; varies |

Sources: [CMS PTP](https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-procedure-procedure-ptp-edits); [RVU files](https://www.cms.gov/medicare/payment/fee-schedules/physician/pfs-relative-value-files); [MCD downloads](https://www.cms.gov/medicare-coverage-database/downloads/downloads.aspx); [Coverage API](https://api.coverage.cms.gov/); [ASP](https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files); [PayerPrice](https://payerprice.com/medicaid-fee-schedule-lookup) **[Vendor]**.

Three traps recur: MUE files carry only a file date, so archive every quarter; files are revised retroactively (all three earlier 2026 ASP files were re-posted Sept 15, 2026); and CMS page dates are unreliable, so detect changes by file hash ([CMS ASP](https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files); [CMS add-on page](https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-add-code-edits)).

## Products load free files, license CPT, and buy extras later

| Route | Examples | Cost | Use it for | Catch |
|---|---|---|---|---|
| Government bulk files | CDC ICD-10-CM; CMS HCPCS, NCCI, RVU; FDA NDC | Free | Production source of truth | You build loaders and date versioning |
| Free lookup APIs | NLM Clinical Tables; RxNav; openFDA; CMS Coverage API | Free | Prototypes, search boxes | No service guarantee; Clinical Tables caps results at 7,500 |
| NLM UMLS (merged vocabulary bundle) / VSAC (curated code lists) | 3.53M concepts from ~195 vocabularies | Free individual license + key | SNOMED CT, RxNorm, value sets | Its CPT copy is development-only |
| AMA directly | CPT Developer Program; distribution license | Free 12-month build-and-test, then fees | CPT | Zip API reportedly 10 calls/day **[Secondary]**: store locally |
| FHIR terminology server (validates codes over the FHIR health-data web standard) | Snowstorm, HAPI, Ontoserver, Aidbox, Medplum | Open source to commercial | Lookups, validation | Bring your own content; the official FHIR (HL7) CPT entry holds no codes |
| Commercial content vendors | Optum, IMO Health, Wolters Kluwer, Find-A-Code, AAPC Codify | Seats ~$10–$83/month **[Vendor]**; data "call sales" | Encoders, crosswalks | Opaque pricing; CPT royalty passed through |

Sources: [Clinical Tables FAQ](https://clinicaltables.nlm.nih.gov/faq.html); [UMLS statistics](https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/statistics.html); [AMA Developer Program](https://www.ama-assn.org/practice-management/cpt/cpt-developer-program); [AMA Zip API](https://compliance.ama-assn.org/hc/en-us/articles/35491692760599-Zip-API-Option-for-CPT-Standard-Data-File); [HL7 CPT](https://terminology.hl7.org/5.1.0/CPT.html); [Optum pricing](https://www.optumcoding.com/data-and-web-services/pricing/); [Capterra Codify](https://www.capterra.ca/software/1038291/codify).

**Recommended outpatient MVP stack [Inference]:**

| Need | Source | Cost |
|---|---|---|
| Diagnoses, plus Excludes1, "code first" and 7th-character rules (only in the XML) | ICD-10-CM order file + tabular XML (CDC) | Free |
| Visit levels and procedures | CPT Standard Data File, starting under the Developer Program | $1,050/yr + $18.50/user |
| Medicare-only codes, letter modifiers | HCPCS Level II file | Free |
| Pair, unit, add-on checks | NCCI practitioner PTP, MUE, add-on files | Free |
| Dollar impact | Fee Schedule RVU + GPCI files | Free |
| Diagnosis-to-service coverage | Coverage API billing articles | Free |
| Denial vocabulary | CARC/RARC lists | Free to view |
| Insurer specifics | Medicare baseline; customer-uploaded policy PDFs | Manual |
| Later | SNOMED→ICD-10-CM map; CMS-HCC map (diagnoses that raise payments to private Medicare Advantage plans; 115 categories in model V28); AHA Coding Clinic and AMA CPT Assistant (official coding Q&A) | Free; ~$1,300 and $143/user/yr |
| Skip | ICD-10-PCS, CDT, NUBC, hospital payment groupers | — |

Sources: [CDC tabular XML](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-table-and-index-2027.zip); [AMA distribution rates](https://compliance.ama-assn.org/hc/article_attachments/40950238000663); [NLM map](https://www.nlm.nih.gov/research/umls/mapping_projects/snomedct_to_icd10cm.html); [CMS-HCC](https://www.cms.gov/files/zip/2027-initial-model-software.zip); [Coding Clinic](https://www.codingclinicadvisor.com/sites/default/files/CodingClinic_%20Annual%20PricingSubscriptions.pdf); [CPT Assistant](https://dhinsights.org/news/amas-cpt-codes-face-scrutiny-over-fees-politics-and-control) **[Secondary]**.

Store each code with its system, release and effective dates, and validate against the release in force on the date of service. Keep CPT text in a separate, access-controlled store that AI prompts reach only by retrieval **[Inference]**. The calendar is dense: CPT on January 1, HCPCS, NCCI and fee files quarterly, ICD-10-CM on October 1, coverage data weekly, denial codes three times a year, and new CPT emerging-tech, lab and vaccine codes mid-year ([AMA Category III schedule](https://www.ama-assn.org/system/files/category-3-early-release.pdf); [CMS R13791CP](https://www.cms.gov/files/document/r13791cp.pdf)).

## Five licensing landmines, and a live fight over CPT

| Owner / content | Key terms | Consequence for an AI coding product |
|---|---|---|
| **AMA: CPT fees** | A license for "each product that contains CPT codes." Internal users pay $82.50 + $18.50/user (2026); distributors $1,050 + $18.50/user (2027), plus $9.25/user per prior year kept. "User Proxy" counts a billing system as 1 user per billing provider and an ambulatory EHR as 4. A "CPT user" includes anyone using an output that depends on CPT, even invisibly | Low thousands of dollars a year at MVP scale; the AMA chooses the model **[Inference]**. Hiding descriptors does not avoid royalties |
| **AMA: AI terms** (FAQ, July 14, 2026) | Retrieval permitted. "Using the CPT Standard Data File to train, fine-tune, or improve AI models is prohibited." No upload to public AI | Build on retrieval. Whether charts containing CPT numbers count is unanswered: ask in writing |
| **AMA: CPT in CMS files** | Click-through limits CPT in RVU, NCCI and coverage files to internal use in CMS programs; no commercial use | Never source CPT text from CMS files |
| **NLM UMLS: CPT is "Category 3"** | Internal research, product development and statistics only; no routine patient-data use, publishing or outside parties | UMLS CPT is for building, not production |
| **ADA: CDT** | Commercial license required; coverage-data terms bar distributing AI outputs that embed CDT | Exclude dental |
| **AHA: NUBC** | PDF manual, internal use, no derivative works; data by contract | Exclude hospital claims |
| **X12** | Claim-format guides copyrighted: $180/yr per user, $1,200 development, commercial by agreement | Let a clearinghouse (the intermediary that routes claims to insurers) format claims **[Inference]** |

Sources: [AMA licensing](https://www.ama-assn.org/practice-management/cpt-licensing); [AMA internal rates](https://compliance.ama-assn.org/hc/article_attachments/33699558348439); [AMA distribution rates](https://compliance.ama-assn.org/hc/article_attachments/40950238000663); [IMO CPT flow-down terms](https://www.imohealth.com/wp-content/uploads/2023/04/CPT-Terms-End-Users.pdf); [AMA AI FAQ](https://www.ama-assn.org/practice-management/cpt/licensing-cpt-ai-faqs); [CMS AMA license](https://www.cms.gov/license/ama); [UMLS license](https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/license_agreement.html); [UMLS appendix](https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/license_agreement_appendix.html); [MCD terms](https://www.cms.gov/medicare-coverage-database/downloads/downloads.aspx); [NUBC](https://www.nubc.org/subcription-information); [X12](https://x12.org/products/licensing-program).

CPT's status rests on *PMIC v. AMA* (9th Cir. 1997): adoption into regulation did not strip the copyright, though the AMA had misused it by demanding exclusivity ([121 F.3d 516](https://law.resource.org/pub/us/case/reporter/F3/121/121.F3d.516.94-56774.html)). Four live challenges test that settlement:

| Challenge | Status, Oct 21, 2026 | Next |
|---|---|---|
| *PatientRightsAdvocate.org v. AMA* (N.D. Ill., filed Aug 13, 2026) seeks the right to publish CPT: "no one can own the law," fair use, misuse | AMA moved to dismiss Oct 13 | Response due Nov 13 |
| CMS's 2027 fee-schedule proposal asks about alternatives to CPT, including paying physicians on ICD-10-PCS | Comments closed Sept 14; no proposal to replace CPT **[Secondary]** | Final rule expected early November |
| Sen. Bill Cassidy (Senate health committee chair) wrote in Oct and Dec 2025 that HIPAA gave the AMA a government-endorsed "coding monopoly" and demanded revenue data | No public AMA answer found | — |
| *AHA v. PatientRightsAdvocate.org* over the UB-04 manual | Pending | — |

Sources: [Georgetown Litigation Tracker](https://litigationtracker.law.georgetown.edu/litigation/patientrightsadvocate-org-inc-v-american-medical-association/); [Healthcare Dive](https://www.healthcaredive.com/news/patient-rights-advocate-sues-ama-cpt-billing-codes-copyright/827830/); [Federal Register](https://www.federalregister.gov/documents/2026/07/16/2026-14327/medicare-and-medicaid-programs-cy-2027-payment-policies-under-the-physician-fee-schedule-and-other); [Holland & Knight](https://www.hklaw.com/en/insights/publications/2026/07/cms-issues-cy-2027-medicare-physician-fee-schedule-proposed-rule) **[Secondary]**; [Cassidy letter](https://www.help.senate.gov/imo/media/doc/cassidy_letter_to_ama_on_cpt_monopoly.pdf); [AHA v. PRA](https://litigationtracker.law.georgetown.edu/wp-content/uploads/2025/12/American-Hospital-Association-et-al-v.-PatientRightsAdvocate.org-Inc._2_6_2026_JOINT-STATUS-REPORT.pdf).

Until a court or CMS acts, plan on the license regime lasting through 2027 **[Inference]**.

## A $296 million royalty engine feeds a layered content industry

The AMA does not break out CPT revenue, but its audited 2025 statements show the unit selling CPT books, data files and royalties earned **$296.4M at a $267.5M contribution margin**, about 90%. Price increases and pricing-model changes drove part of the growth ([AMA 2025 Annual Report](https://www.ama-assn.org/system/files/2025-ama-annual-report.pdf)).

| Layer | Who | Sells to | Public price |
|---|---|---|---|
| Encoders (lookup tools that walk coders to a code) | Optum EncoderPro, Solventum, TruCode, AAPC Codify, Find-A-Code | Coders, hospitals, EHR vendors | EncoderPro ~$300–$1,000/user/yr **[Vendor]** |
| Terminology and mapping | IMO Health (5M+ terms **[Vendor]**), Wolters Kluwer, Clinical Architecture | EHR vendors, health systems | "Call sales" |
| Insurer edit engines | Optum CES (80+ insurers **[Vendor]**), Lyric (180M+ edits **[Vendor]**), Cotiviti | Insurers | Not public |
| EHR and billing software | Epic, athenahealth, SimplePractice | Practices | SimplePractice: $20/clinician/yr, $18.50 of it the AMA royalty **[Secondary]** |

Sources: [Optum EncoderPro](https://www.optumcoding.com/upload/docs/Optum360_EncoderPro.com_Competitive_Comparison_HR.pdf); [IMO](https://imohealth.com/faq/); [Optum CES](https://www.optum.com/content/dam/optum3/optum/en/resources/white-papers/CES_Professional_Claims.pdf); [Lyric](https://lyric.ai/about-us); [SimplePractice](https://support.simplepractice.com/hc/en-us/articles/28804985196173-AMA-fee-FAQs).

The largest audited comparable, Solventum's Health Information Systems segment (formerly 3M's), booked **$1.36B in 2025**, though it spans more than coding ([Solventum 10-K](https://www.sec.gov/Archives/edgar/data/1964738/000196473826000007/solv-20251231.htm)). Market sizings of computer-assisted coding span **$1.6B to $5.1B** **[Secondary]** ([Report Prime](https://www.reportprime.com/computer-assisted-coding-r22619); [Market Reports World](https://www.marketreportsworld.com/market-reports/medical-computer-assisted-coding-solutions-market-14728400)). Two structural facts matter **[Inference]**. Content vendors act as the AMA's collection agents; IMO verifies clients' AMA licensing yearly ([IMO terms](https://www.imohealth.com/wp-content/uploads/2023/04/CPT-Terms-End-Users.pdf)). And insurers' edit libraries are sold only to insurers, so a provider-side product sees them through NCCI as a proxy and through denial codes.

## No public dataset pairs office notes with E/M codes

| Dataset | Kind | What it holds | License / commercial use | Usefulness |
|---|---|---|---|---|
| Amazon ACI-Bench ICD-10 (2025) | Notes + codes | 207 outpatient-style notes, double-coded ICD-10-CM; no CPT | Non-commercial (CC-BY-NC) | High for diagnoses, internal only |
| MDACE (3M/Solventum) | Notes + codes | 52 professional-fee + 302 inpatient charts with coder evidence spans; E/M excluded | MIT-licensed labels; text needs MIMIC access | Medium–high for evidence |
| MIMIC-III (de-identified Boston hospital database) | Notes + codes | Intensive-care (ICU) notes plus CPT, incl. hospital and critical-care E/M | Research-only data use agreement (DUA) | Medium |
| ProFees (Oracle, 2025) | Notes + codes | 216 outpatient E/M encounters with MDM sub-levels | Not released | Design reference |
| ACI-Bench | Notes only | 207 role-played clinic visits | CC BY 4.0: commercial OK | High seed for labeling |
| MTS-Dialog; PriMock57 | Notes only | ~1.7k note sections; 57 mock primary-care visits | CC BY 4.0 | Medium |
| MTSamples (Kaggle) | Notes only | 4,999 multi-specialty transcriptions | CC0 on Kaggle; site terms unverified | Medium–high seed |
| CMS synthetic Medicare claims | Codes only | 8,671 synthetic patients; 1.12M physician claims | Unrestricted | Low–medium (edit tests) |
| CMS Physician/Supplier Procedure Summary (PSPS); Physician & Other Practitioners | Reference | Counts by code, modifier, specialty, setting | Free public versions | High as baselines |
| Truveta; Mayo Clinic Platform | Commercial | Hundreds of millions to billions of notes **[Vendor]** | Negotiated; Mayo data stays in its cloud | Unverified |

Sources: [Amazon repo](https://github.com/amazon-science/toward-clinical-coding-verification-adaptation); [MDACE](https://arxiv.org/pdf/2307.03859); [MIMIC-III](https://physionet.org/content/mimiciii/1.4/); [ProFees](https://arxiv.org/html/2510.25007v1); [ACI-Bench](https://github.com/wyim/aci-bench); [MTS-Dialog](https://github.com/abachaa/MTS-Dialog); [PriMock57](https://raw.githubusercontent.com/babylonhealth/primock57/main/LICENSE.md); [MTSamples](https://search.r-project.org/CRAN/refmans/clinspacy/html/dataset_mtsamples.html) **[Secondary]**; [CMS synthetic claims](https://data.cms.gov/sites/default/files/2023-05/d51e1218-68c3-4c7c-9598-0b81f22fe903/User%20Guide%20-%20CMS%20Synthetic%20RIF%20Files%20May%202023_AM508_v2.pdf); [CMS PSPS](https://www.cms.gov/data-research/cms-data/limited-data-set-lds-files/physician/supplier-procedure-summary-psps); [Truveta](https://truveta.com/truveta-data); [Mayo](https://www.mayoclinicplatform.org/2022/03/16/mayo-clinic-platform_discover/).

The only real notes tied to E/M codes, MIMIC-III's, are hospital and ICU visits. The ProFees authors confirm that public CPT E/M datasets do not exist. In their data, an expert agreed with the billing coder on only **44%** of encounters ([ProFees](https://arxiv.org/html/2510.25007v1)). PhysioNet, which hosts MIMIC, limits use to research by each credentialed individual, with hosted AI allowed only under zero data retention ([PhysioNet FAQ](https://physionet.org/about/faqs/)).

What to do instead **[Inference]**: build a 300–500-chart gold set. Seed it with the commercially licensed notes, then add design-partner charts under a BAA (business associate agreement, the HIPAA contract that lets a vendor handle patient data). Two certified coders label each chart independently, recording codes, each MDM element's level and the supporting text, and an auditor adjudicates. Keep restricted sets for internal benchmarks and CMS files for baselines. HIPAA's "Safe Harbor" de-identification (removing identifiers so data no longer counts as patient data) strips all dates except the year ([45 CFR 164.514](https://www.law.cornell.edu/cfr/text/45/164.514)). That breaks the three-year new-versus-established-patient test and some time checks, so a formal "Expert Determination" (a statistician certifying low re-identification risk) may be worth its quoted **$50K–$200K** **[Vendor]** ([Nirmitee](https://nirmitee.io/blog/healthcare-data-deidentification-ai-safe-harbor-expert-determination)).

## Corrections to the earlier MVP research

| Earlier statement | Updated finding |
|---|---|
| ~72,000 billable ICD-10-CM codes; fiscal-2027 deletions 21 or 30 | 74,879 billable; 30 billable codes deleted, 15 of them turned into headers over more specific codes. The "21" figure uses a different trade-press method ([CDC file](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-code-descriptions-2027.zip)) |
| Unclear whether NCCI files carry a CPT click-through | They do, and the terms bar commercial use of the embedded CPT ([CMS](https://www.cms.gov/license/ama)) |
| Coverage data is free; downloads lag | Refreshed weekly; the API needs a one-hour license token; CDT terms bar AI outputs embedding CDT ([MCD](https://www.cms.gov/medicare-coverage-database/downloads/downloads.aspx)) |
| Amazon outpatient ICD-10 set is "public" | Its repository license is non-commercial ([repo](https://github.com/amazon-science/toward-clinical-coding-verification-adaptation)) |
| MDACE is at github.com/3mcloud/MDACE | That URL returned 404 on Oct 21, 2026 |
| AMA prices rested on search snippets; no free AMA sandbox mentioned | Confirmed from AMA rate PDFs; a free Developer Program build-and-test license exists ([AMA](https://www.ama-assn.org/practice-management/cpt/cpt-developer-program)) |

## Conclusion

The license fee is not the binding constraint; the reach of the AMA's terms is. They cover outputs that never display CPT, forbid training on the data file, and stop the free UMLS copy at the development stage. Treating CPT as a bare identifier with a separately licensed text layer is both the compliant design and a free hedge on the 2026 challenges.

The real scarcity sits at the pipeline's two ends. Insurers' rules are locked in engines sold only to insurers, so remittance denial codes become the best evidence of how they apply. And outpatient E/M-labeled notes do not exist publicly, so a few hundred adjudicated charts, recording the reasoning behind each level, would be both the product's test harness and its most defensible asset.
