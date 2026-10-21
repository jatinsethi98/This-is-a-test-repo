# US Procedure / Service / Supply Code Sets: Ownership, Governance, Files, APIs and Licensing (as of 2026-10-21)

Scope note for the report writer: these notes cover the "what was done / what was supplied / where" side of a US claim. That means CPT (all categories), HCPCS Level II, modifiers, ICD-10-PCS, CDT, the NUBC/UB-04 institutional codes (revenue codes, type of bill, condition/occurrence/value codes), NDC with the NDC-to-HCPCS crosswalks, and Place of Service. Diagnosis codes (ICD-10-CM) are covered by a separate researcher.

Method notes:
- "(my analysis)" marks figures I computed by downloading and parsing the official file myself on 2026-10-21. The URL given is the file I parsed.
- "SECONDARY" marks claims that rest on a news article, law-firm alert, vendor or forum page, or a search-result snippet rather than the primary owner's document.
- Plain-English definitions are given inline the first time a term appears.

---

## Q0. Legal backbone: which procedure-side code sets HIPAA requires, and who is delegated to maintain them

### Takeaway
HIPAA's code-set rule (45 CFR 162.1002) names the code sets every electronic claim must use. On the procedure side these are CPT-4 with HCPCS for physician and other services, HCPCS Level II for supplies and equipment, CDT for dental, ICD-10-PCS for hospital inpatient procedures, and NDC for retail-pharmacy drugs. HHS has delegated maintenance of CPT (HCPCS Level I) to the AMA, a private association, and of HCPCS Level II to CMS. That split is why some of these code sets are free and others are licensed.

### Cited Findings
- 45 CFR 162.1002(c), effective on and after Oct 1, 2015, adopts the following code sets. ICD-10-CM covers diseases and injuries. ICD-10-PCS covers "procedures for hospital inpatients, reported by hospitals". CDT covers dental services. "HCPCS with CPT-4" covers physician and other health care services (therapy, radiology, lab tests, diagnostics, hearing/vision, transportation including ambulance). NDC covers drugs and biologics reported by retail pharmacies. HCPCS covers "other substances, equipment, and supplies", meaning medical supplies, orthotics/prosthetics and DME. — [45 CFR 162.1002 (Cornell LII)](https://www.law.cornell.edu/cfr/text/45/162.1002)
- Since Oct 16, 2003 the NDC mandate covers retail pharmacy only. It does not cover drugs billed by physicians or hospitals, which use HCPCS "J" and similar codes. — [45 CFR 162.1002 (Cornell LII)](https://www.law.cornell.edu/cfr/text/45/162.1002)
- The code-set regulation was published Aug 17, 2000 (65 FR 50312). "The Secretary of HHS has delegated authority to the AMA and CMS to maintain and distribute HCPCS Level I and Level II codes, respectively." — [CMS, HCPCS Level II Coding Procedures (revised Oct 8, 2026)](https://www.cms.gov/medicare/coding/medhcpcsgeninfo/downloads/2018-11-30-hcpcs-level2-coding-procedure.pdf)
- "HCPCS" (Healthcare Common Procedure Coding System) has two levels. Level I is CPT, "a numeric coding system maintained by the American Medical Association". Level II is "a single letter followed by four numbers" and is used mainly for drugs, biologicals, ambulance, and DMEPOS (durable medical equipment, prosthetics, orthotics and supplies). — [CMS HCPCS Level II Coding Procedures](https://www.cms.gov/medicare/coding/medhcpcsgeninfo/downloads/2018-11-30-hcpcs-level2-coding-procedure.pdf)
- The HHS designation is described on the AMA's own page: "HHS designated CPT under HIPAA as the national coding set for physician and other health care professional services and procedures." — [AMA CPT overview](https://www.ama-assn.org/practice-management/cpt/cpt-code-set-overview)

### Inferences
- A US claims engine needs at minimum CPT plus HCPCS II (professional and outpatient lines), ICD-10-PCS (inpatient facility claims), CDT (dental claims), NDC (pharmacy claims, and the NDC fields many payers require on drug lines), and the non-HIPAA "claim-form" code lists: POS for professional claims and NUBC revenue/TOB/condition/occurrence/value codes for institutional claims.
- Revenue codes, type of bill and POS are not in the 162.1002 list. They are required through the X12 837 implementation guides and payer rules. I did not verify the X12 TR3 wording directly, so this is unconfirmed.

### Gaps
- I could not load eCFR directly (redirected to a federalregister "unblock" page), so the Cornell LII mirror was used.

---

## Q1. CPT: what it is, its categories and structure, how many codes, and example codes

### Takeaway
CPT (Current Procedural Terminology) is the AMA's copyrighted list of five-character codes and text descriptors for what clinicians do. Examples are an office visit, a colonoscopy, a lab panel or an MRI. It has four kinds of codes:
- **Category I** (five digits, e.g., 99213): established services.
- **Category II** (four digits + F): optional quality-measure tracking codes.
- **Category III** (four digits + T): temporary codes for emerging technology.
- **PLA** (four digits + U): codes for one company's proprietary lab test.

The AMA says "11,000+" codes are in use. CPT 2027 (effective Jan 1, 2027) makes 453 changes.

### Cited Findings
**Definition and structure**
- CPT is "a listing of terms and five-digit codes". All codes are five characters, numeric or alphanumeric depending on category. Category I codes range from 00100–99499, are grouped by type of procedure/service and anatomy, and correspond to a procedure or service. Category II codes are "alphanumeric supplemental tracking codes for performance measurement". Category III codes are "temporary alphanumeric codes for new and developing technology, procedures, and services". PLA codes are for proprietary lab tests, including ADLTs (Advanced Diagnostic Laboratory Tests) and CDLTs (Clinical Diagnostic Laboratory Tests) under PAMA 2014 (Protecting Access to Medicare Act). — [AMA CPT code set overview](https://www.ama-assn.org/practice-management/cpt/cpt-code-set-overview)
- Category II codes have four digits followed by the letter F. They are "used for performance measurement", and reporting them is optional and not required for correct coding. Ranges include Composite Measures 0001F–0015F, Patient History 1000F–1220F, Diagnostic/Screening 3006F–3573F and Patient Safety 6005F–6045F. — [AMA Category II codes](https://www.ama-assn.org/practice-management/cpt/category-ii-codes)
- Category III codes are "a set of temporary codes that allow data collection for emerging technologies, services, procedures, and service paradigms … intended to be used for data collection to substantiate widespread usage or to provide documentation for the FDA approval process". They need not meet Category I requirements such as FDA clearance of all devices. The codes listed in the AMA's public document (which it calls "an excerpt") run from 0100T to 1145T. The September 2026 Panel added 34 codes (1112T–1145T) and revised 0559T, 0560T and 0582T. — [AMA CPT Category III long descriptors PDF (updated Oct 2, 2026)](https://www.ama-assn.org/system/files/cpt-category3-codes-long-descriptors.pdf)
- PLA codes "describe proprietary clinical laboratory analyses and can be provided either by a single ('sole-source') laboratory or licensed or marketed to multiple providing laboratories". They have "no physician work component". To qualify, the test must be commercially available in the US and requested by the CLIA-certified lab or the IVD manufacturer. "When a PLA code is available … that PLA code takes precedence." The latest batch added 17 codes (0699U–0715U), deleted 11 and revised 5. — [AMA PLA long descriptors PDF](https://www.ama-assn.org/system/files/cpt-pla-codes-long.pdf)
- Example PLA codes:
  - 0699U, Phoenix Children's Rapid Whole Genome Sequencing (rWGS). Published Oct 1, 2026, effective Jan 1, 2027, printed in CPT 2028.
  - 0715U, Promarker®Eso (esophageal adenocarcinoma, liquid biopsy). Same dates.
  — [AMA PLA long descriptors PDF](https://www.ama-assn.org/system/files/cpt-pla-codes-long.pdf)

**Size**
- The AMA infographic claims "11,000+ CPT codes in use today", ">120 preventive codes", deliberations "3x/year", "1,000+ participants provide input on code creation per meeting", and "$0 cost to the U.S. government for development and maintenance". — [AMA infographic "CPT Codes: A Shared Language"](https://www.ama-assn.org/system/files/cpt-codes-infographic.pdf)
- Conflicting figure: TechTarget reports that "critics say the code set has grown to over 7,800 codes" (SECONDARY). Another secondary source reports 10,969 codes for CPT 2023 (SECONDARY, not opened). The definition of a "code" probably differs between counts (Category I only vs. all categories). — [TechTarget, Sep 10, 2026](https://www.techtarget.com/revcyclemanagement/news/366650230/New-2027-CPT-codes-released-as-AMA-faces-mounting-criticism)

**Annual change volume**
- CPT 2027 was released Sep 9, 2026 and takes effect Jan 1, 2027. It has 453 editorial changes: 299 new codes, 74 revisions and 80 deletions. Highlights:
  - Ten new AI-related codes, bringing the total to 43.
  - An updated Appendix S "Taxonomy for Artificial Intelligence in Medical Services and Procedures".
  - A new maternity-care framework replacing the "decades-old global maternity care bundle", released early.
  - Three new LVAD (left ventricular assist device) codes, nine diaphragmatic hernia repair codes and six unattended sleep-study codes.
  - New time-based biofeedback codes and a new head/neck MRA table.
  — [AMA press release, CPT 2027](https://www.ama-assn.org/press-center/ama-press-releases/ama-releases-cpt-2027-code-set)
- CPT 2026 was released Sep 11, 2025. It had 418 changes: 288 new, 84 deletions and 46 revisions. "CPT data products, including the CPT 2026 Standard Data File and CPT educational content, are available via the AMA Intelligent Platform." — [AMA press release, CPT 2026](https://www.ama-assn.org/press-center/ama-press-releases/ama-releases-cpt-2026-code-set)
- In CPT 2026, PLA codes made up 27% of new codes and Category III another 27%. — [TechTarget, CPT 2026](https://www.techtarget.com/revcyclemanagement/news/366630633/AMA-releases-CPT-2026-code-set-adds-codes-for-health-AI) (SECONDARY)

**Example Category I codes (E/M = evaluation and management, i.e., visits)**
- 99213 is an office or other outpatient visit for an established patient (low-complexity medical decision making, or 20–29 minutes total time on the date of the encounter). 99212 is 10–19 minutes, 99214 is moderate complexity at 30–39 minutes, and 99215 is high complexity at 40–54 minutes. — [AMA 2023 E/M descriptors & guidelines PDF](https://www.ama-assn.org/system/files/2023-e-m-descriptors-guidelines.pdf) (content taken from search snippet; PDF not opened by me)
- Category III example: 0559T/0560T (anatomic model 3D printing, "each additional individually prepared and processed component … (List separately in addition to code for primary procedure)"). An example parenthetical instruction is "(Report 0944T once per liver microwave ablation procedure)". — [AMA Cat III long descriptors PDF](https://www.ama-assn.org/system/files/cpt-category3-codes-long-descriptors.pdf)

**Descriptor variants**
- The AMA data files have offered three descriptor lengths (long, medium, short) plus "clinician descriptors" (what the clinician does at the point of care) and "consumer-friendly descriptors" (plain language for patients). The 2015 file was "fixed-field and tab-delimited". — [AMA, CPT 2015 Data File (2014 article)](https://www.ama-assn.org/practice-management/cpt/easily-import-codes-using-new-cpt-2015-data-file)
- Consumer-friendly descriptors (CFDs) are "already included in the CPT license for every code". Health plans and hospitals can use them for the price-transparency rule's "plain language description" requirement. — [AMA, CPT descriptors for Transparency Rule](https://www.ama-assn.org/practice-management/cpt/cpt-descriptors-comply-transparency-rule-health-plans-and-hospitals)
- The AMA's free Category III PDFs come in separate long, medium and short descriptor versions. — [AMA Category III page](https://www.ama-assn.org/practice-management/cpt/category-iii-codes)

### Inferences
- Code-format validation rules:
  - Category I: `^\d{5}$`
  - Category II: `^\d{4}F$`
  - Category III: `^\d{4}T$`
  - PLA: `^\d{4}U$`
  - These are derived from the AMA documents above (Cat II "four digits + F", Cat III 0100T–1145T, PLA 0029U–0715U). Note that leading zeros are significant, so codes must be stored as strings.
- A billing system has to keep several descriptor lengths. The short descriptor fits claim and statement fields, and the consumer-friendly descriptor goes on patient-facing estimates.

### Gaps
- I found no AMA primary source giving an exact 2026 or 2027 total count by category. The AMA's own "11,000+" is the best primary figure.
- I did not open the full 2026/2027 CPT Standard data file layout (it is behind the license), so current file names, columns and formats (TXT/XLSX/XML/JSON) are unverified. Secondary evidence points to tab/pipe-delimited text (see Q3).

---

## Q2. CPT governance: the Editorial Panel, application process, and the release/effective-date calendar (incl. early releases)

### Takeaway
An AMA-appointed CPT Editorial Panel meets three times a year. Anyone can apply for a code through the AMA "CPT Smart App". Category I changes become effective each Jan 1, but several streams release early on the AMA website on their own clocks:
- **Category III:** about three months after each Panel meeting, effective about three months after release.
- **PLA:** quarterly.
- **Vaccines:** on FDA timelines.

Software therefore needs effective-dated code tables that change more than once a year.

### Cited Findings
**Panel make-up and authority**
- The Panel is "an independent group of clinical expert volunteers appointed by the AMA Board of Trustees". It is supported by "CPT Advisors", physicians nominated by national medical specialty societies in the AMA House of Delegates and by the AMA Health Care Professionals Advisory Committee (HCPAC). — [AMA CPT overview](https://www.ama-assn.org/practice-management/cpt/cpt-code-set-overview)
- The Panel meets three times per year. Its advisors come from "over 100 societies". It "operates independently of any government agency", and the AMA Board of Trustees authorizes it to approve CPT content changes. — [AMA CPT Editorial Panel page](https://www.ama-assn.org/about/cpt-editorial-panel)
- The AMA says it convenes "190+ state and specialty medical societies". — [AMA CPT 2027 press release](https://www.ama-assn.org/press-center/ama-press-releases/ama-releases-cpt-2027-code-set)

**Meeting calendar (AMA process calendar, last updated Oct 8, 2026)**

| Panel meeting | Application due | Agenda posted | Interested-party comments due (5 p.m. PT) | Summary of Panel Actions posted |
|---|---|---|---|---|
| Sept 17–19, 2026 | – | – | – | Oct 2, 2026 |
| Feb 4–6, 2027 | Nov 2, 2026 | Dec 4, 2026 | Jan 4, 2027 | Feb 19, 2027 |
| May 6–8, 2027 | Feb 8, 2027 | March 5, 2027 | March 29, 2027 | May 21, 2027 |
| Sept 16–18, 2027 | June 9, 2027 | July 9, 2027 | Aug 9, 2027 | Oct 1, 2027 |

- "The submission due date for code applications is 12 weeks prior to the Panel meeting." The Summary of Panel Actions is posted "on or before two weeks after the close" of each meeting.
- Pathology/lab applications have extra deadlines. For the Feb 2027 meeting, the lab application listing is posted Nov 13, 2026 and written comments are due Dec 4, 2026.

— [AMA CPT Editorial Panel process calendar](https://www.ama-assn.org/about/cpt-editorial-panel/cpt-editorial-panel-process-calendar)
- 2026 meetings: Feb 5–7, 2026 (Palm Springs), Apr 30–May 2, 2026 (Boston), Sept 17–19, 2026 (Minneapolis). — [AMA Panel meetings overview](https://www.ama-assn.org/about/cpt-editorial-panel/cpt-panel-meetings-overview) (SECONDARY: from search snippet, page not opened)

**Category III early-release schedule (updated Aug 7, 2026)**

| CPT cycle | Panel meeting | Early release on AMA website | Effective date | Print book |
|---|---|---|---|---|
| 2028 | Feb 2026 | July 1, 2026 | Oct 1, 2026 | 2027 |
| 2028 | May 2026 | July 1, 2026 | Oct 1, 2026 | 2027 |
| 2028 | Sept 2026 | Oct 1, 2026* | Jan 1, 2027 | 2028 |
| 2029 | Feb 2027 | Apr 1, 2027 | July 1, 2027 | 2028 |
| 2029 | May 2027 | July 1, 2027 | Oct 1, 2027 | 2028 |
| 2029 | Sept 2027 | Oct 1, 2027* | Jan 1, 2028 | 2029 |

- *The fall release "may be delayed by up to 10 days".
- Codes approved for deletion "have an effective date of January 1".

— [AMA Category III Early Release Schedule PDF](https://www.ama-assn.org/system/files/category-3-early-release.pdf)
- The AMA's Category III document says releases are now "triannual" (previously "semiannual"). It also warns that "early availability does not imply that these codes are immediately reportable before the indicated implementation date". — [AMA Cat III long descriptors PDF](https://www.ama-assn.org/system/files/cpt-category3-codes-long-descriptors.pdf)

**PLA quarterly calendar (updated Sept 2026)**

| Cycle | Application deadline | Panel vote | Codes published | Codes effective | Printed in |
|---|---|---|---|---|---|
| Fall 2026 | Sept 8, 2026 | Nov 4, 2026 | Jan 1, 2027 | Apr 1, 2027 | CPT 2028 |
| Winter 2027 | Dec 1, 2026 | Feb 2027 | Apr 1, 2027 | July 1, 2027 | – |
| Spring 2027 | Mar 9, 2027 | May 2027 | July 1, 2027 | Oct 1, 2027 | – |
| Summer 2027 | June 8, 2027 | Aug 4, 2027 | Oct 1, 2027 | Jan 1, 2028 | CPT 2029 |

- All PLA applications go through the CPT Smart App. A PLA Technical Advisory Group reviews them before the Panel vote.

— [AMA CPT PLA calendar PDF](https://www.ama-assn.org/system/files/cpt-pla-calendar.pdf)

**Vaccine/immunization codes**
- Immunization codes approved at the Feb 2026 Panel were released to the AMA website on Apr 1, 2026 and became "effective on July 1, 2026 following the three-month implementation period". Examples are 90616 (mRNA vaccine, "TIRV VACC MRNA 37.5/0.38 IM") and 90639. An "FDA approval pending" symbol is removed when FDA approves; 90616 was approved on Aug 5, 2026. — [AMA immunization short descriptors PDF (updated Aug 14, 2026)](https://www.ama-assn.org/system/files/vaccine-short-descriptors.pdf)

**Category II and "most recent August release"**
- The AMA's Category II page refers to an annual CPT Data Files release and a "most recent August release", plus a "recently approved Category II codes" section for codes added between releases. — [AMA Category II](https://www.ama-assn.org/practice-management/cpt/category-ii-codes)

**Where guidelines and parentheticals live**
- Guidelines and parenthetical notes are part of the CPT content itself, in the codebook and the AMA descriptor documents. For example, the Category III document lists "guidelines, and parenthetical notes accepted by the CPT Editorial Panel" alongside codes. — [AMA Cat III long descriptors PDF](https://www.ama-assn.org/system/files/cpt-category3-codes-long-descriptors.pdf)
- The AMA also sells educational/interpretive content separately: CPT Assistant at $143 per user and the CPT Advanced Coding Pack at $195 per user (year of these fees unclear). — [Digital Health Insights, Jan 2, 2026](https://dhinsights.org/news/amas-cpt-codes-face-scrutiny-over-fees-politics-and-control) (SECONDARY)

### Inferences
- **Practical cadence for software.** A full annual CPT load (data file in late summer, effective Jan 1) is not enough. Builds also need:
  - quarterly PLA adds (Jan/Apr/Jul/Oct effective dates),
  - Category III adds about three times a year (Jan/Jul/Oct effective in the current schedule),
  - ad-hoc vaccine codes, some with FDA-pending flags,
  - Jan 1 deletions.
- **Pipeline lead time.** The Sept 2026 Panel meeting feeds CPT 2028 Category I, effective Jan 1, 2028, while its Category III codes become effective Jan 1, 2027. So a code can be billable more than a year before it appears in a printed codebook.

### Gaps
- I found no current primary statement of the Panel's exact headcount (often cited as 21 members); the AMA pages fetched did not state it.
- I did not verify the date the CPT 2027 data files were posted to the AMA Intelligent Platform.

---

## Q3. CPT data products and APIs: what software can actually fetch, from where, and in what format

### Takeaway
The AMA distributes machine-readable CPT through the **AMA Intelligent Platform** (platform.ama-assn.org). Its products include:
- the **CPT Standard Data File** (descriptor files),
- **CPT Link** (a richer, ontology-style file set with SNOMED CT maps),
- consumer-friendly data,
- an RVU file,
- AMA-packaged versions of HCPCS II and ICD-10.

Licensees download from a **Royalties Portal** or via a rate-limited **Zip API**. A free **CPT Developer Program** license allows build and test only. Public, free AMA PDFs exist only for recent Category III, PLA and vaccine codes.

### Cited Findings
- Licensees use the Royalties Portal (https://platform.ama-assn.org/ama/#/royalties-portal and https://royaltiesportal.ama-assn.org/) to "download licensed CPT content, manage royalty payments, and report usage". — [AMA CPT licensing page](https://www.ama-assn.org/practice-management/cpt-licensing)
- The product catalog is at https://platform.ama-assn.org/ama/#/products, linked from the CPT 2027 release. — [AMA CPT 2027 press release](https://www.ama-assn.org/press-center/ama-press-releases/ama-releases-cpt-2027-code-set)
- **Zip API.** The AMA added a "Zip API" serving the CPT Standard Data File through the Intelligent Platform, with files identical to Royalties Portal downloads. It has two endpoints (list releases; retrieve a release). Limits are "up to 10 calls across endpoints per day", 3 users with Production access, and unlimited users with sample-data Staging access. — [AMA compliance help center: "Zip API Option for CPT Standard Data File"](https://compliance.ama-assn.org/hc/en-us/articles/35491692760599-Zip-API-Option-for-CPT-Standard-Data-File) (SECONDARY: page returned HTTP 403 to my fetcher; details from search snippet)
- **CPT Developer Program.** It was launched in early 2022. Registration is free and gives a royalty-free license to build and test products before launch, valid 12 months with annual renewal. The AMA Intelligent Platform offers "application programming interfaces, web apps and data files". — [AMA press release on CPT Developer Program](https://www.ama-assn.org/press-center/ama-press-releases/ama-opens-doors-health-tech-innovators-cpt-developer-program) (SECONDARY: from search snippet). The AMA program page confirms the "royalty-free license" for "new organizations to access CPT content to build and test innovations", with sign-up at https://platform.ama-assn.org/ama/#/dev-program. — [AMA CPT Developer Program](https://www.ama-assn.org/practice-management/cpt/cpt-developer-program)
- **CPT Link** is "an ontology-based version of CPT". It is delivered as a zipped download with release notes (PDF) and five folders, including an HTML human-readable version and two CPT-to-SNOMED CT maps. Files are "tab" and "pipe" delimited, with a Concept ID per concept and a CPT_LEVEL field (PC = parent code, CC = child code). — [NLM UMLS CPT source documentation](https://nlm.nih.gov/research/umls/sourcereleasedocs/current/CPT/sourcerepresentation.html); [AMA CPT Implementation Guide: Component 8 CPT Link](https://cpt-international.ama-assn.org/cpt-implementation-guide-component-8-cptr-link) (SECONDARY: both via search snippets. The AMA URL now redirects and the NLM page is a JavaScript app my fetcher could not render.)
- No native XML/JSON CPT product was found. HL7 FHIR ValueSet pages for CPT exist but are not AMA data files. — search result review (SECONDARY)
- **Legacy format.** The 2015 CPT Data File shipped on CD-ROM via the AMA Store in fixed-field and tab-delimited formats. — [AMA 2015 Data File article](https://www.ama-assn.org/practice-management/cpt/easily-import-codes-using-new-cpt-2015-data-file)
- **Free public CPT content** (PDFs only):
  - Category III long/medium/short descriptors ([long](https://www.ama-assn.org/system/files/cpt-category3-codes-long-descriptors.pdf))
  - PLA long/medium/short ([long](https://www.ama-assn.org/system/files/cpt-pla-codes-long.pdf))
  - immunization codes ([short](https://www.ama-assn.org/system/files/vaccine-short-descriptors.pdf))
  - Category II descriptors (dated Jan 31, 2020, per the [Category II page](https://www.ama-assn.org/practice-management/cpt/category-ii-codes))
- The AMA does not offer a free downloadable list of each year's CPT changes. You must buy a book, subscribe to an encoder, or purchase a data download. — AAPC forum, summarized in search results (SECONDARY) [AAPC thread](https://www.aapc.com/discuss/threads/2026-cpt-and-hcpc-codes_new-revised-and-deletions.205098/)
- **How CMS exposes CPT.** CMS embeds CPT in its own files (e.g., Physician Fee Schedule RVU files) behind a click-through "End User Point and Click Agreement". The agreement says:
  - Use is "only as contained in the following authorized materials of CMS internally within your organization within the United States", and is "limited to use in Medicare, Medicaid or other programs administered by CMS".
  - It prohibits "creating any modified or derivative work of CPT, or making any commercial use of CPT".
  - Other uses need an AMA license.
  - "The AMA is a third party beneficiary to this agreement."
  — [CMS AMA license page](https://www.cms.gov/license/ama)
- The CMS HCPCS record layout says: "CPT-4 codes including both long and short descriptions shall be used in accordance with the CMS/AMA agreement. Any other use violates the AMA copyright." — [CMS HCPCS 2026 record layout, inside October 2026 HCPCS ZIP](https://www.cms.gov/files/zip/october-2026-alpha-numeric-hcpcs-file.zip) (my analysis)
- CMS's quarterly HCPCS Level II file contains only Level II codes and modifiers, with no CPT codes or CPT numeric modifiers (my analysis of the [October 2026 file](https://www.cms.gov/files/zip/october-2026-alpha-numeric-hcpcs-file.zip)). So a builder cannot get CPT descriptors from the free HCPCS file.

### Inferences
- For production use, plan on the AMA Zip API or a Royalties Portal download of the CPT Standard Data File, or a licensed distributor's data feed. The 10-calls-per-day API cap is fine for a release-check job but not for per-claim lookups, so CPT must be stored locally.
- Using CMS's click-through copy of CPT (for example in RVU files) in a commercial product is contractually prohibited. Commercial software must get CPT from a licensed source.

### Gaps
- I could not confirm the exact current CPT Standard Data File layout (file names, columns, whether XLSX/JSON are included), CPT Link schema, or Zip API endpoint URLs. Those documents sit behind the AMA login or returned 403.
- I found no evidence of a per-code lookup REST API for CPT from the AMA (as opposed to bulk file download).

---

## Q4. CPT licensing: license types, 2026–2027 royalty rates, AI terms

### Takeaway
Every electronic use of CPT needs a license. Internal users (providers, payers) pay roughly **$82.50 per entity plus $18.50 per user per year** for the 2026 CPT Standard file. Health plans pay **$0.24 per member** for core products, and labs pay about **$0.0004 per test**. Vendors who embed CPT in software sign a distribution agreement. It has a **$1,050 upfront annual fee** and per-user or per-usage royalties: **$18.50/user in 2027**, or metered models for telehealth, analytics, clearinghouses and health plans. The AMA's licenses now ban using the CPT Standard Data File to **train or fine-tune AI models**.

### Cited Findings
**Who needs a license**
- "Any entity using CPT content anywhere worldwide must have a license authorizing the use of CPT code set from the AMA or an authorized distributor." Codebooks are "for reference only", and having CPT codes in your system is not itself a license. — [AMA CPT licensing](https://www.ama-assn.org/practice-management/cpt-licensing)
- **License types:**
  - A private license for internal use (hospitals, clinics, payers), obtained through an AMA-authorized distributor for a specified product.
  - A distributor license for health-tech organizations: "Organizations across the globe must have a license for each product that contains CPT codes."
  - Applications: https://compliance.ama-assn.org/hc/en-us/requests/new?ticket_form_id=7268856900759&tf_7275193547287=new_dist.
  - Royalties "depend on the type of product in which the CPT content is used and the type of user of the product".
  — [AMA CPT licensing](https://www.ama-assn.org/practice-management/cpt-licensing)
- A separate internal-use agreement path exists for organizations with 26 or more users. — [AMA compliance: Internal Use License Agreement Request 26 or More Users](https://compliance.ama-assn.org/hc/en-us/articles/360061118074-Internal-Use-License-Agreement-Request-26-or-More-Users) (title only; page not opened)

**AI-specific terms**
- Permitted: traditional machine learning (e.g., predictive analytics) for internal use, and retrieval-based AI that references licensed CPT content at the point of use.
- Prohibited: "Using the CPT Standard Data File to train, fine-tune, or improve AI models is prohibited", and "Uploading the CPT Standard Data File into public, unrestricted, or open-market AI systems is prohibited."
- "AI-generated outputs are not a substitute for CPT content." Distributing outputs that reference CPT must follow the license.
- An AI-specific request form exists: https://compliance.ama-assn.org/hc/en-us/requests/new?ticket_form_id=28108580935319.

— [AMA CPT licensing](https://www.ama-assn.org/practice-management/cpt-licensing)

**Internal End User License rates, 2026 and 2027 annual releases (AMA PDF dated July 24, 2025)**

| Model | Data file | 2026 release | 2027 release |
|---|---|---|---|
| Counting Users / User Proxy | CPT Standard | $82.50 + $18.50 per User | "then-current Entity Fee" + $18.50 per User |
| Counting Users / User Proxy | CPT RVUs | $18.50 per User | $18.50 per User |
| Counting Users / User Proxy | AMA's Version of HCPCS Level II | $19.50 per User | N/A |
| Counting Users / User Proxy | AMA's Version of ICD-10-CM/PCS | $22.00 per User | N/A |
| Health Plan | CPT Standard, core products | $0.240 per Member | $0.240 per Member |
| Health Plan | CPT Standard, supporting products | $0.00546 per Member per electronic product | $0.00546 |
| Laboratory | CPT Standard | $0.0004167 per Laboratory Test | $0.0004167 |

- The Health Plan and Laboratory models each carry a $100 minimum.

— [AMA Internal End User License Agreement Royalty Rates for 2026 and 2027 (PDF)](https://compliance.ama-assn.org/hc/article_attachments/33699558348439) (article page: [compliance.ama-assn.org](https://compliance.ama-assn.org/hc/en-us/articles/16197630737431-Internal-End-User-License-Agreement-Royalty-Rates-for-2026-and-2027)). I extracted the text myself.

**Distribution license: CPT Data Files License Agreement, Appendix C (PDF created June 3, 2026; 2027 rates effective Jan 1, 2027)**
- Upfront Annual Royalty Fee is $1,050 (effective Jan 1, 2020). It is due at signing and by July 31 each year, and is waived if prior-year royalties exceeded $11,550.
- **Counting Users / User Proxy models:**
  - CPT Standard: $18.50 per User.
  - Each previous annual release of CPT: an extra $9.25 per User.
  - CPT RVUs: $18.50 per User on top of CPT Standard.
  - AMA's HCPCS Level II: $19.50.
  - AMA's ICD-10-CM/PCS: $22.00.
  - CPT Consumer Friendly Data: $111.00 per 10,000 unique Consumer Users.
- Print licensed products: $18.50 per Distributed Copy.
- Health Plan Model supporting products: CPT $0.00546, HCPCS $0.00579 and ICD-10 $0.00657 per Member.
- **Provider Health Analytics Model (CPT):**
  - Hospital/health system: $0.00163 (core) and $0.000272 (supporting) per Weighted Patient Interaction.
  - Ambulatory-only: $3.82 (core) and $0.65 (supporting) per Billing Provider.
  - $0.0109 per person in population (value-based care analytics).
  - Previous releases at 50%.
- Provider Clearinghouse (CPT): Tier 2 $0.65 and Tier 3 $1.30 per Billing Provider.
- Telemedicine/Remote Patient Monitoring (CPT): $0.053 per Countable Virtual Interaction, $0.053 per Quarterly Monitored Person and $0.079 per Quarterly Active Enrolled Person. Previous releases are half.

— [AMA CPT Data Files License Agreement Appendix C: Royalty Rates (PDF)](https://compliance.ama-assn.org/hc/article_attachments/40950238000663). I extracted the text myself.
- The 2026 distribution pricing schedule notice: [AMA compliance "Notice: Standard CPT Distribution Pricing Schedule 2026"](https://compliance.ama-assn.org/hc/en-us/articles/15166274293399-Notice-Standard-CPT-Distribution-Pricing-Schedule-2026). Not opened; a search snippet indicates $18.50 per User for 2026.

**Other reported fees (SECONDARY)**
- CPT Link content costs $13,000 per year, alongside the $1,050 upfront fee, a $195 per user Advanced Coding Pack and $143 per user CPT Assistant. The article ties these to a 2025 pricing schedule. — [Digital Health Insights](https://dhinsights.org/news/amas-cpt-codes-face-scrutiny-over-fees-politics-and-control)
- A print CPT codebook costs the public $137.89. Practices using CPT electronically pay "an extra $82.50 annual license fee, plus user-based fees". — [MedCity News, Aug 14, 2026](https://medcitynews.com/2026/08/american-medical-association-ama-cpt-code-lawsuit/)

### Inferences
- **Illustrative cost for a 50-user practice billing in-house on the 2026 release.** $82.50 + 50 × $18.50 = $1,007.50 per year for CPT. Add $975 if it also licenses the AMA's HCPCS II version, and $9.25 per user for each prior release kept for historical claims. This is my arithmetic from the AMA rate PDF.
- **Previous-release fees.** Distribution vendors pay extra for each "previous annual release". Supporting historical dates of service (for appeals and look-backs) therefore has a direct license cost.
- **Paying for free data.** The AMA charges per-user royalties for "AMA's Version" of HCPCS Level II and ICD-10, which CMS publishes free (see Q5 and Q7). A builder can avoid those fees by loading the CMS files directly.
- **AI products.** RAG-style retrieval over licensed CPT is permitted, but fine-tuning on the CPT file is not. AI coding products should keep CPT in a retrieval store and get written AMA approval.

### Gaps
- Retail AMA Store pricing for a small-practice CPT data file was not found.
- The 2027 internal "Entity Fee" amount is not stated in the AMA rate PDF ("then-current").
- Provider Clearinghouse tier definitions were not found.

---

## Q5. Why CPT is copyrighted yet legally mandated: history, revenue, litigation, and 2026 policy pressure

### Takeaway
CMS's predecessor HCFA adopted CPT in 1983 under a royalty-free license from the AMA. In 1997 the Ninth Circuit held that adoption into regulation did **not** strip CPT of copyright (PMIC v. AMA), although the AMA had misused it through an exclusivity clause. HIPAA then made CPT a national standard in 2000. CPT royalties are now the AMA's largest revenue line: about $285M in 2023, and $296.4M of "books and digital content" revenue in 2025. In 2026 the arrangement is under attack:
- PatientRightsAdvocate.org sued on Aug 13, 2026 (the AMA moved to dismiss on Oct 13).
- CMS's CY2027 physician fee schedule proposed rule asked for comment on alternatives to CPT.
- Sen. Cassidy has demanded fee data.

### Cited Findings
- **PMIC v. AMA, 121 F.3d 516 (9th Cir., decided Aug 6, 1997).**
  - Background: Congress in 1977 directed HCFA to set up a uniform code. The AMA gave HCFA a "non-exclusive, royalty free, and irrevocable license". In return HCFA agreed "not to use any other system", and it incorporated CPT via Federal Register notices in 1983 and 1985.
  - Holding 1: CPT did **not** enter the public domain by being required in regulation.
  - Holding 2: the AMA **misused** its copyright by conditioning the license on HCFA's exclusivity ("The controlling fact is that HCFA is prohibited from using any other coding system").
  - Remedy: misuse bars enforcement during the misuse period but does not invalidate the copyright.
  — [121 F.3d 516 (law.resource.org)](https://law.resource.org/pub/us/case/reporter/F3/121/121.F3d.516.94-56774.html)
- After the ruling, the AMA dropped the exclusivity requirement and the licensing status quo continued. — [Plagiarism Today, Aug 18, 2026](https://www.plagiarismtoday.com/2026/08/18/the-copyright-fight-over-medical-billing-codes/) (SECONDARY)
- CMS required CPT for Medicare Part B in 1983 and for state Medicaid in 1986. AMA royalty revenue rose from $65.8M (2011, about a quarter of revenue) to $284.8M (2023, more than half of revenue). — [STAT, June 13, 2025](https://www.statnews.com/2025/06/13/american-medical-association-lobbying-cpt-billing-codes-cme/) (SECONDARY, citing AMA filings)
- In 2025 the AMA reported $296.4M revenue and $267.5M profit from "books and digital content". The AMA does not break out CPT-only revenue. — [MedCity News](https://medcitynews.com/2026/08/american-medical-association-ama-cpt-code-lawsuit/) (SECONDARY, citing the PRA complaint)
- In 2024 AMA revenue exceeded $513M, of which more than $281M came from selling and licensing coding resources. — [Digital Health Insights](https://dhinsights.org/news/amas-cpt-codes-face-scrutiny-over-fees-politics-and-control) (SECONDARY)
- **PatientRightsAdvocate.org, Inc. v. American Medical Association**
  - Docket and court: No. 1:26-cv-09746, N.D. Ill., Judge Elaine E. Bucklo, filed Aug 13, 2026, counsel Consovoy McCarthy.
  - Relief sought: a declaration that the plaintiff may publish a copy of CPT.
  - Docket: the AMA filed a motion to dismiss on Oct 13, 2026, and the plaintiff's response is due Nov 13, 2026.
  — [Georgetown Litigation Tracker](https://litigationtracker.law.georgetown.edu/litigation/patientrightsadvocate-org-inc-v-american-medical-association/); [Complaint PDF](https://litigationtracker.law.georgetown.edu/wp-content/uploads/2026/08/patientrightsadvocate_2026.08.13_COMPLAINT.pdf) (not opened)
- **PRA's theories:**
  - CPT is incorporated into federal regulations and "at least 15 state laws".
  - Republication is fair use.
  - The AMA engaged in copyright misuse.
  - "No one can own the law", citing *Georgia v. Public.Resource.Org* (2020).
  - PRA bought a 2026 print CPT and wants to scan and post it.
  - The AMA says it will "vigorously defend" its IP.
  — [MedCity News](https://medcitynews.com/2026/08/american-medical-association-ama-cpt-code-lawsuit/); [Becker's](https://beckershospitalreview.com/legal-regulatory-issues/ama-sued-over-cpt-billing-code-copyright-8-things-to-know) (SECONDARY)
- **Related precedents:**
  - *ASTM v. Public.Resource.Org* (D.C. Cir. 2023): non-profit publication of incorporated standards was fair use.
  - *ICC v. UpCodes* (3d Cir.): re-uploading ICC codes incorporated into law was likely fair use.
  - The PRO CODES Act (introduced 2024, reintroduced June 2025) would require incorporated codes to be freely viewable, but not usable by software developers.
  — [Plagiarism Today](https://www.plagiarismtoday.com/2026/08/18/the-copyright-fight-over-medical-billing-codes/) (SECONDARY)
- **CY 2027 PFS proposed rule (CMS-1848-P).** Released July 14, 2026; comments were due Sept 14, 2026. It includes an RFI on "potential alternatives to the current CPT and RUC processes", including whether physician payment could be based on ICD-10-PCS procedure codes, and "whether the AMA's oversight of CPT licensing creates barriers to innovation or patient care". The alert notes CMS "is not proposing to replace CPT". — [Holland & Knight alert, July 20, 2026](https://www.hklaw.com/en/insights/publications/2026/07/cms-issues-cy-2027-medicare-physician-fee-schedule-proposed-rule) (SECONDARY law-firm summary)
- **Sen. Bill Cassidy** (chair, Senate HELP Committee) sent letters calling AMA CPT fees "exorbitant" and asking for revenue and pricing details, with a Dec 15, 2025 response deadline. The AMA's CEO responded in Oct 2025. — [Digital Health Insights](https://dhinsights.org/news/amas-cpt-codes-face-scrutiny-over-fees-politics-and-control) (SECONDARY); letter: [help.senate.gov PDF](https://www.help.senate.gov/imo/media/doc/cassidy_letter_to_ama_on_cpt_monopoly.pdf) (not opened)
- The AMA's position is that CPT is maintained "at no cost to the U.S. government" ($0). — [AMA infographic](https://www.ama-assn.org/system/files/cpt-codes-infographic.pdf)

### Inferences
- Through 2027, any CPT-dependent product should assume the license regime continues. PMIC is binding precedent in the Ninth Circuit only, and the PRA case is at the motion-to-dismiss stage in the Seventh Circuit's district court.
- The CMS RFI and the ICD-10-PCS idea are signals, not policy. A final CY2027 PFS rule, normally issued around November, would show whether CMS acted. That rule had not been checked as of these notes.

### Gaps
- I did not read the AMA's 2025 annual report directly. The revenue figures come via the PRA complaint and the press.
- I could not confirm the content of the AMA's motion to dismiss.

---

## Q6. HCPCS Level II (CMS): structure, sections, governance, quarterly files, temporary codes, and PDAC

### Takeaway
HCPCS Level II is CMS's free, public-domain code set of one letter plus four digits. It covers things CPT does not: drugs (J), DME (E), supplies (A), orthotics and prosthetics (L), ambulance (A0xxx), Medicare-specific professional services (G), hospital outpatient pass-through items (C), and temporary/payer-specific codes (K, Q, S, T, H). CMS decides changes:
- drugs and biologicals on a quarterly application cycle,
- other items on a biannual cycle with public meetings.

CMS publishes a quarterly ZIP with a fixed-width text file plus XLSX. The DME MAC contractor PDAC (Palmetto GBA) tells manufacturers which existing code their product falls under.

### Cited Findings
**Structure and size**
- Level II codes are "a single letter followed by four numbers". "Currently, there are national HCPCS Level II codes representing almost 8,000 separate categories of similar items or services." — [CMS HCPCS Level II Coding Procedures (rev. Oct 8, 2026)](https://www.cms.gov/medicare/coding/medhcpcsgeninfo/downloads/2018-11-30-hcpcs-level2-coding-procedure.pdf)
- **October 2026 file counts (my analysis):**
  - 8,770 distinct Level II code records, of which 7,448 have no termination date (active) and 1,322 are terminated codes kept for history.
  - 384 modifier records, of which 364 are active.
  - Active codes by first letter: A 861, B 50, C 382, E 666, G 1,276, H 94, J 1,112, K 142, L 935, M 451, P 58, Q 589, R 3, S 505, T 114, U 2, V 208.
  - No D (dental) codes and no CPT codes appear in the file.
  - All codes match `^[A-Z]\d{4}$`.
  — [CMS October 2026 Alpha-Numeric HCPCS File (ZIP)](https://www.cms.gov/files/zip/october-2026-alpha-numeric-hcpcs-file.zip)
- **Example codes from the October 2026 file (my analysis):**

| Code | Description in the file | Notes |
|---|---|---|
| A0428 | Ambulance service, basic life support, non-emergency transport (BLS) | |
| A4253 | Blood glucose test or reagent strips … per 50 | |
| C1713 | Anchor/screw for opposing bone-to-bone or soft tissue-to-bone (implantable) | |
| E0601 | Continuous positive airway pressure (CPAP) device | |
| G0439 | Annual wellness visit … subsequent | |
| G2211 | Visit complexity inherent to E/M | |
| J9271 | Injection, pembrolizumab, 1 mg | |
| J3490 | Unclassified drugs | a "not otherwise classified" code |
| K0001 | Standard wheelchair | |
| L3000 | Foot insert … UCB type, Berkeley shell | |
| M1212 | Glycemic status assessment … missing | a quality-measure code |
| Q4101 | Apligraf, per sq cm | skin substitute |
| S9083 | Global fee urgent care centers | |
| T1015 | Clinic visit/encounter, all-inclusive | |
| H0001 | Alcohol and/or drug assessment | |
| V2020 | Frames, purchases | |
| U0003 | COVID-19 high-throughput amplified probe | terminated 2023-05-11 |

  — [CMS October 2026 HCPCS ZIP](https://www.cms.gov/files/zip/october-2026-alpha-numeric-hcpcs-file.zip)
- **Code categories:**
  - Dental "D codes" are HCPCS Level II, but "determinations regarding the revision, deletion, or addition of CDT codes are made by the ADA, not CMS".
  - "Miscellaneous/not otherwise classified" (NOC) codes let suppliers bill new FDA-marketed items before a specific code exists.
  — [CMS HCPCS Level II Coding Procedures](https://www.cms.gov/medicare/coding/medhcpcsgeninfo/downloads/2018-11-30-hcpcs-level2-coding-procedure.pdf)
  - C codes implement BBRA 1999 §201 for drugs, biologicals and devices under the Hospital Outpatient PPS (prospective payment system), including pass-through items.
  - G codes identify professional services that would otherwise be in CPT but have no CPT code. CMS creates them internally with no application process, and non-Medicare insurers may also use them.
  — [CMS HCPCS Level II coding process page](https://www.cms.gov/Medicare/Coding/MedHCPCSGenInfo/hcpcscodingprocess)
- **Temporary codes:**
  - Q codes are assigned by CMS "on a temporary basis", then deleted and cross-referenced when a permanent code is assigned. CMS set up a quarterly update process for temporary K and Q codes. — [CMS Transmittal R2288CP](https://www.cms.hhs.gov/transmittals/downloads/R2288CP.pdf) (SECONDARY: via search snippet)
  - K codes are temporary DME codes (DME MACs).
  - S codes are created for private payers (non-Medicare).
  - T codes are for state Medicaid agencies.
  - H codes cover behavioral health and substance-use services.
  — [AUA HCPCS coding system explainer](https://auanet.org/leadership-and-business/institute-for-leadership-and-business/practice-management-and-coding/coding-resources-and-information/hcpcs-coding-system) (SECONDARY; sources disagree slightly on S-code ownership)

**Governance and calendar**
- CMS makes all additions, revisions and deletions. Applications are "reviewed by a group comprised of physicians, healthcare professionals and other staff within CMS". — [CMS HCPCS Level II Coding Procedures](https://www.cms.gov/medicare/coding/medhcpcsgeninfo/downloads/2018-11-30-hcpcs-level2-coding-procedure.pdf)
- Anyone may apply through MEARIS™ (https://mearis.cms.gov/public/home). The cycles are:

| Item type | Application deadline (first business day of) | Effective dates |
|---|---|---|
| Drugs and biologicals (quarterly) | Jan, Apr, Jul, Oct | Jan application → Jul 1; Apr → Oct 1; Jul → Jan 1; Oct → Apr 1 |
| Non-drug, non-biological (biannual) | Jan, Jul | Jan → Oct 1; Jul → Apr 1 of next year |

  - Off-cycle requests are allowed only for public health emergencies and urgent anti-infectives.
  - "A code's existence doesn't determine coverage."
  - Since Jan 1, 2026, HCT/P (human cells/tissue products) and 510(k)/PMA skin substitutes go through the biannual public-meeting process.
  — [CMS HCPCS Level II coding process page](https://www.cms.gov/Medicare/Coding/MedHCPCSGenInfo/hcpcscodingprocess)
- The second 2026 biannual public meeting is Nov 2, 2026, with an overflow (virtual) day on Nov 3. Final determinations are expected around Feb 2027 and will be effective Apr 1, 2027. — [CMS B2 2026 public meeting agenda](https://www.cms.gov/files/document/b2-2026-public-meeting-agenda-november-2-3-2026.pdf) (SECONDARY: via search snippet)
- Since 2020, CMS releases HCPCS Level II coding determinations quarterly at the quarterly-update page, "the official source for HCPCS Level II coding information". — [CMS HCPCS Level II Coding Procedures](https://www.cms.gov/medicare/coding/medhcpcsgeninfo/downloads/2018-11-30-hcpcs-level2-coding-procedure.pdf)

**Where the files live and their format**
- The quarterly update page lists ZIPs titled "<Month YYYY> Alpha-Numeric HCPCS File". The latest are October 2026 (posted 09/23/2026), July 2026 (06/17/2026), April 2026 (03/18/2026) and January 2026 (01/12/2026). They are a "public use file" and "the official update of the HCPCS code system". The page has no license click-through for Level II. — [CMS HCPCS Quarterly Update](https://www.cms.gov/medicare/coding/hcpcsreleasecodesets/hcpcs-quarterly-update)
- **Contents of the October 2026 ZIP (my analysis):**
  - `HCPC2026_OCT_ANWEB_09232026.txt`: fixed-width, 320-byte records, 16,900 lines.
  - The same data as `.xlsx`.
  - `HCPC2026_recordlayout.txt`: the record layout.
  - A transaction report (.xlsx) listing changes.
  - A corrections file (.xlsx).
  - `NOC codes_OCT2026.xlsx`.
  - `proc_notes_OCT2026.txt`: processing notes.
  — [CMS October 2026 HCPCS ZIP](https://www.cms.gov/files/zip/october-2026-alpha-numeric-hcpcs-file.zip)
- **Record layout fields (my analysis):**
  - Code (positions 1–5); modifier (positions 4–5 for modifier rows); sequence number.
  - Record ID: 3 = first line of a procedure, 4 = continuation of a long description, 7 = first line of a modifier, 8 = continuation.
  - Long description (80 characters per line, continued over multiple lines); short description (28 characters).
  - Pricing indicator; multiple pricing indicator; coverage code; ASC payment group; BETOS (Berenson-Eggers type of service); type of service; anesthesia base units.
  - Code-added date, action effective date and termination date.
  - Action code: A add, B both admin and long description change, C long description change, D discontinue, F admin field change, N no change, P payment change, R reactivate, S short description change, T miscellaneous.
  — [CMS HCPCS 2026 record layout (inside ZIP)](https://www.cms.gov/files/zip/october-2026-alpha-numeric-hcpcs-file.zip)
- The October 2026 quarter had 45 adds (e.g., A2046–A2050 skin substitutes, A9613 Pylarify TruVu), 15 discontinuations and 12 long-description changes, all effective Oct 1, 2026 (my analysis, action codes in the same file).
- CMS Transmittal 13784 (May 27, 2026) announced the October 2026 file, effective Oct 1, 2026 and implemented Oct 5, 2026. — [CMS Transmittal R13784CP](https://www.hhs.gov/guidance/sites/default/files/hhs-guidance-documents/CMS/r13784cp.pdf) (SECONDARY: via search snippet)

**PDAC (Pricing, Data Analysis and Coding contractor)**
- Existing non-drug codes for DME, prosthetics, orthotics and supplies are verified through the PDAC code verification process. — [CMS HCPCS coding process page](https://www.cms.gov/Medicare/Coding/MedHCPCSGenInfo/hcpcscodingprocess); [PDAC code verification](https://www.dmepdac.com/palmetto/PDACv2.nsf/DID/B5UJTD63)
- **How PDAC works (SECONDARY, from PDAC letters posted by manufacturers):**
  - PDAC is a CMS contract operated by Palmetto GBA.
  - It issues coding decisions based on DME MAC LCDs (local coverage determinations) and policy articles.
  - Its letters say which HCPCS code to use when billing DME MACs, but "is not an approval or endorsement … nor does it imply … reimbursement or coverage".
  - Reconsideration must be requested within 45 days.
  - Products are listed on the Product Classification List in DMECS (DME Coding System).
  - HCPCS helpline: (877) 735-1326.
  — [Sample PDAC coding verification letter](https://cdn.shopify.com/s/files/1/0694/8844/3636/files/PDAC_Coding_Verification_Letter_4822d411-42bf-42f0-a88e-0d32961b4a77.pdf)
- PDAC also publishes a separate NDC/HCPCS crosswalk for drugs paid under the DMEPOS benefit. The 2026 version was "Last Updated: 12/31/2025". — [PDAC 2026 NDC/HCPCS Crosswalk](https://dmepdac.com/palmetto/pdacv2.nsf/DIDC/0FEARUVOBV~NDCHCPCS%20Crosswalk) (SECONDARY: via search snippet)

### Inferences
- **Free and machine-loadable.** HCPCS Level II is the cleanest code set to ingest: free, quarterly, with a documented fixed-width layout and explicit add/termination dates and action codes. A loader should key on code + effective date and keep terminated codes for historical claims.
- **Stale vendor text.** The CMS record-layout text still says Level II is maintained by an "alpha-numeric editorial panel (consisting of CMS, the Health Insurance Association of America, and the Blue Cross and Blue Shield Association)" and refers to "CDT-2024". The current CMS procedures say CMS alone decides. Vendor-supplied documentation can lag.
- **Placeholder codes in rules.** Proposed CMS rules sometimes use placeholder codes, such as "GACP1/GACP2" for advance care planning in the CY2027 PFS proposal ([Holland & Knight](https://www.hklaw.com/en/insights/publications/2026/07/cms-issues-cy-2027-medicare-physician-fee-schedule-proposed-rule)). These are not valid billing codes, so parsers should not ingest codes from rule text.

### Gaps
- I did not find a current primary CMS page defining S, H and T code ownership. Secondary sources were used.
- The number of codes added and deleted for January 2027 is not yet published; the January 2027 file is expected in mid-December 2026.

---

## Q7. Modifiers: CPT (AMA) vs HCPCS Level II (CMS), where each list is defined, and how to fetch

### Takeaway
A modifier is a two-character suffix on a procedure code that says the service was altered without changing its definition. Examples are left side, professional component only, or a separate encounter. **CPT modifiers** are two digits (e.g., 25, 59, 26). They are AMA-copyrighted, defined in CPT Appendix A, and come only with a CPT license. **HCPCS Level II modifiers** are two letters or a letter plus a digit (e.g., LT, RT, TC, XE, JW, KX, GA). They are free in every CMS quarterly HCPCS file: 364 active in October 2026.

### Cited Findings
- **CMS's definition.** "A modifier provides the means by which the reporting physician or provider can indicate that a service or procedure that has been performed has been altered by some specific circumstance but not changed in its definition or code". Uses include professional/technical component splits, multiple physicians or locations, and increased or reduced services. — [CMS HCPCS 2026 record layout (inside ZIP)](https://www.cms.gov/files/zip/october-2026-alpha-numeric-hcpcs-file.zip)
- **CMS file contents (my analysis).** The October 2026 HCPCS file has 384 modifier records (364 without a termination date) and no numeric (CPT) modifiers. Examples with CMS descriptions:

| Modifier | CMS description |
|---|---|
| LT / RT | Left side / Right side |
| TC | Technical component |
| XE | Separate encounter |
| GA | Waiver of liability statement issued as required by payer policy |
| GY | Item or service statutorily excluded |
| KX | Requirements specified in the medical policy have been met |
| JW | Drug amount discarded/not administered |
| JZ | Zero drug amount discarded |
| QW | CLIA waived test |
| FQ | Service furnished using audio-only communication technology |
| GT | Via interactive audio and video telecommunication systems |
| CR | Catastrophe/disaster related |

  — [CMS October 2026 HCPCS ZIP](https://www.cms.gov/files/zip/october-2026-alpha-numeric-hcpcs-file.zip)
- CPT Appendix A is "a listing of all the modifiers applicable to CPT codes". Since 1999 it has also reprinted ASC-approved and Level II modifiers. — [CPT Assistant July 1999 (via FindACode)](https://findacode.com/newsletters/ama-cpt-assistant/appendices-july-1999-7.html) (SECONDARY, old)
- **Definitions of key CPT modifiers:**
  - 25: a significant, separately identifiable E/M service by the same physician on the same day as a procedure.
  - 59: a distinct procedural service, to be used only when no more specific modifier applies. CMS created XE/XS/XP/XU to reduce inappropriate use of 59.
  - 26: professional component only. It pairs with HCPCS TC for the technical component.
  — [ACCC, Appropriate use of modifiers in oncology coding](https://www.accc-cancer.org/view/appropriate-use-of-modifiers-in-oncology-coding) (SECONDARY)
- The CMS coding process page notes that Medicare Advantage plans may use payment modifiers such as PO and PN. — [CMS HCPCS coding process page](https://www.cms.gov/Medicare/Coding/MedHCPCSGenInfo/hcpcscodingprocess)

### Inferences
- A modifier table should hold both families with a "source" flag (AMA vs CMS), effective and termination dates, and a payer-specific validity layer. Payers decide which modifier and code pairs they accept, e.g., Medicare NCCI edits and the X{EPSU} rules.
- CPT modifier descriptors will come with the licensed CPT data file. The exact file is unverified (see Gaps).

### Gaps
- I did not confirm whether CPT modifiers ship as a separate file in the current CPT Standard Data File, or how many CPT modifiers exist in CPT 2026/2027.

---

## Q8. ICD-10-PCS: inpatient hospital procedure codes (brief)

### Takeaway
ICD-10-PCS is CMS's free procedure classification for **hospital inpatient** facility claims only. It is not used for physician or outpatient claims, which use CPT/HCPCS. Every code is exactly 7 alphanumeric characters. FY2027 has 79,256 codes, effective for discharges from Oct 1, 2026, with a possible April 1 update. CMS publishes free ZIPs: code tables, codes file, order file, addendum, conversion table and guidelines.

### Cited Findings
- HIPAA scope: ICD-10-PCS is used for "procedures for hospital inpatients, reported by hospitals". — [45 CFR 162.1002 (Cornell LII)](https://www.law.cornell.edu/cfr/text/45/162.1002)
- **FY2027 files on the CMS ICD-10 page:** Errata, Version Update Summary, Code Tables and Index, Codes File, Order File (long and abbreviated titles), Addendum, Conversion Table, and Official ICD-10-PCS Coding Guidelines (PDF). Use them "for discharges from October 1, 2026 through March 31, 2027". The latest April update listed is April 1, 2026 (FY2026). — [CMS ICD-10 codes page](https://www.cms.gov/medicare/coding-billing/icd-10-codes)
- **My analysis of the FY2027 codes file** ([2027 ICD-10-PCS Codes File ZIP](https://www.cms.gov/files/zip/2027-icd-10-pcs-codes-file.zip)):
  - `icd10pcs_codes_2027.txt` contains 79,256 codes, all exactly 7 characters long.
  - The addendum lists 101 additions, 38 deletions and 3 revised titles.
  - Examples:

| Code | Title |
|---|---|
| 0DTJ4ZZ | Resection of Appendix, Percutaneous Endoscopic Approach (laparoscopic appendectomy) |
| 02703ZZ | Dilation of Coronary Artery, One Artery, Percutaneous Approach |
| 0SR9019 | Replacement of Right Hip Joint with Metal Synthetic Substitute, Cemented, Open Approach |
| 10E0XZZ | Delivery of Products of Conception, External Approach |
| XW0E33B | Revised to "Introduction of Lunsotogene Parvec-cwha via Intracochlear Infusion…, New Technology Group 11" |

- **Counts conflict:** AHA/FindACode reports 101 new, 3 revised and 37 deleted. ACDIS reports 38 deletions, all in new-technology tables. My count of the CMS addendum gives 38 "Delete" lines. — [FindACode/AHA Coding Clinic](https://findacode.com/newsletters/aha-coding-clinic/icd/icd-10-pcs-new-revised-codes-I134034.html); [ACDIS](https://acdis.org/node/70368) (SECONDARY)
- CMS's CY2027 PFS RFI asked whether physician payment could someday use ICD-10-PCS instead of CPT. — [Holland & Knight](https://www.hklaw.com/en/insights/publications/2026/07/cms-issues-cy-2027-medicare-physician-fee-schedule-proposed-rule) (SECONDARY)
- The AMA sells "AMA's Version of ICD-10-CM and PCS" at $22.00 per user. — [AMA internal royalty rates PDF](https://compliance.ama-assn.org/hc/article_attachments/33699558348439)

### Inferences
- **Effective dates follow discharge.** The FY boundary is Oct 1, and a code is selected by **discharge date**, not service date. A stay that spans Oct 1 uses the new FY codes.
- **Free and unlicensed.** No click-through or license was encountered on the CMS ICD-10-PCS downloads.

### Gaps
- No April 1, 2027 PCS update has been announced yet; whether one will occur is unknown.

---

## Q9. CDT: dental procedure codes (ADA) (brief)

### Takeaway
CDT (Code on Dental Procedures and Nomenclature) is the ADA's copyrighted dental code set, made up of "D" plus four digits (e.g., D2390). It is HIPAA-mandated for dental claims and technically part of HCPCS Level II, but the ADA alone decides changes. It is updated annually, effective Jan 1. Commercial software needs an ADA commercial license, priced by negotiated template agreement.

### Cited Findings
- **Ownership:** "The Current Dental Terminology (CDT) is published, copyrighted, and licensed by the American Dental Association (ADA) … While the CDT codes are considered HCPCS Level II codes, determinations regarding the revision, deletion, or addition of CDT codes are made by the ADA, not CMS." — [CMS HCPCS Level II Coding Procedures](https://www.cms.gov/medicare/coding/medhcpcsgeninfo/downloads/2018-11-30-hcpcs-level2-coding-procedure.pdf)
- **CDT 2027:**
  - 67 changes: 28 new codes, 33 revisions and 6 editorial updates, all effective Jan 1, 2027.
  - Notable items: a healing cap placement code, fixed splint repair/removal codes, orofacial pain management codes, and a revision of D2390 (resin-based composite crown) to cover anterior and posterior teeth.
  — [ADA News, April 2026](https://adanews.ada.org/ada-news/2026/april/67-changes-coming-to-cdt-2027/)
- **Calendar:** The ADA Code Maintenance Committee (CMC) met March 13, 2026 for CDT 2027. The next meeting is March 4–5, 2027. — [ADA CDT page](https://www.ada.org/en/cdt). CDT 2028 change requests are due Nov 1, 2026. — [Becker's Dental](https://www.beckersdental.com/clinical-leadership-infection-control/ada-updates-cdt-codes-for-2027-5-notes/) (SECONDARY)
- **Licensing:**
  - Use of CDT "in any product or service" requires "a valid commercial user license from the ADA".
  - The ADA issues a template agreement with royalty fees "suited to your product or service", and codes must be bundled with other assets (no standalone redistribution).
  - Processing takes 2–4 weeks, up to 2 months.
  - Contact: CDT-SNODENT@ada.org.
  - SNODENT→ICD-10-CM→CDT map files are released annually in October.
  — [ADA Licensing for Commercial Users](https://www.ada.org/publications/ada-store-products/licensing-for-commercial-users)
- The CMS–ADA license for CMS programs is free (term from Oct 22, 2003). Click-through EULAs on government sites limit CDT to internal use in CMS-administered programs. — [ND HHS end-user agreement](https://hhs.nd.gov/healthcare/medicaid/provider/end-user-agreement) (SECONDARY: via search snippet)

### Inferences
- **No free CDT source.** Dental codes are absent from the free CMS HCPCS file (my analysis found no D codes). A dental-capable product must license CDT from the ADA.

### Gaps
- I found no published ADA royalty amounts, no CDT data-file format, and no total CDT code count.

---

## Q10. NUBC / UB-04 institutional codes: revenue codes, type of bill, condition/occurrence/value codes (brief)

### Takeaway
Hospital and other facility claims (the UB-04 paper form, or the X12 837I) carry code lists defined by the **National Uniform Billing Committee (NUBC)**, an AHA-chaired committee. These include:
- 4-digit **revenue codes**, which say which hospital department or cost center a charge belongs to (e.g., 0450 = emergency room),
- **type of bill** (e.g., 0131 = hospital outpatient, admit-through-discharge claim),
- condition, occurrence, value, discharge-status and point-of-origin codes.

Their only official source is the AHA-copyrighted **Official UB-04 Data Specifications Manual**. It is sold as an annual, per-user, PDF-only e-book subscription (July 1 – June 30). Electronic and data licensing is by contract via ub04@aha.org. The AHA is currently suing PatientRightsAdvocate.org over republication.

### Cited Findings
- **Manual and licensing:**
  - The manual is "the only official source of UB-04 billing information adopted by the National Uniform Billing Committee". The AHA holds copyright and distributes it through its subsidiary Health Forum.
  - NUBC is "a voluntary committee chaired by the AHA" of provider and payer organizations.
  - Format: a PDF e-book on the Tizra platform. Printing is limited to 20 pages at a time and 15 sessions per license period.
  - Use is limited to internal business purposes, with no derivative works.
  - Single-user and multi-user licenses are offered (more than 50 users via ub04@aha.org).
  - Subscriptions run 7/1–6/30 with no pro-rating. The 2027 edition expires June 30, 2027.
  - "To license an electronic version of the UB-04 code set for internal use or for integration into products and services, contact … ub04@aha.org."
  — [NUBC Subscription Information](https://www.nubc.org/subcription-information)
- The 2027 edition became available July 1, 2026, and the manual includes revenue codes. — [NUBC FAQs](https://www.nubc.org/nubc-faqs)
- 2025-edition prices on the AHA store ranged from $578 to $4,413 by user tier. — [NUBC subscription / AHA store via search snippet](https://www.nubc.org/subcription-information) (SECONDARY; 2027 prices not found)
- **Revenue code examples:** ER claims are identified by revenue center codes 0450–0459 plus 0981 (professional fees, emergency room). — [ResDAC: identifying ER visits](https://resdac.org/articles/how-identify-hospital-claims-emergency-room-visits-medicare-claims-data). The subcodes are 0450 general, 0451 EMTALA medical screening, 0452 ER beyond EMTALA screening, 0456 urgent care and 0459 other ER. — [CMS Program Memorandum AB-03-087](https://www.cms.gov/Regulations-and-Guidance/Guidance/Transmittals/downloads/AB03087.pdf) (SECONDARY: via search snippet). CMS also publishes a FHIR CodeSystem of revenue center codes for Blue Button claims data. — [CMS Blue Button CLM-REV-CNTR-CD](https://bluebutton.cms.gov/fhir/CodeSystem/CLM-REV-CNTR-CD/)
- **Type of bill (TOB):** a 4-digit code whose first digit is a leading zero used only on paper. The second digit is facility type, the third is classification, and the fourth is frequency within an episode. Example: 0131 = hospital outpatient, admit through discharge claim. — [CMS MLN web-based training, Loop 2300/FL 4](https://www.cms.gov/Outreach-and-Education/MLN/WBT/MLN7388180-MLN-WBT-1450/1450/lesson05/04/index.html) (SECONDARY: via search snippet)
- **Condition, occurrence and value codes:** Condition codes (UB-04 form locators 18–28) are situational and entered in numeric order. The code values themselves are "available from the NUBC … via the NUBC's Official UB-04 Data Specifications Manual". — [Medicare Claims Processing Manual, Ch. 25](https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c25.pdf)
- **Litigation:** *American Hospital Association and Health Forum LLC v. PatientRightsAdvocate.org, Inc.*, No. 1:25-cv-15137 (N.D. Ill., Judge Martha Pacold).
  - The AHA claims a registered copyright in the UB-04 manual.
  - It alleges licensees, including PRA, agreed not to share it or challenge the copyright (a no-contest clause).
  - The AHA argues that references to the manual in law do not destroy the copyright and that posting it in full is not fair use.
  — [Joint status report, Feb 6, 2026](https://litigationtracker.law.georgetown.edu/wp-content/uploads/2025/12/American-Hospital-Association-et-al-v.-PatientRightsAdvocate.org-Inc._2_6_2026_JOINT-STATUS-REPORT.pdf); [Plaintiffs' response to motion to dismiss, Mar 27, 2026](https://litigationtracker.law.georgetown.edu/wp-content/uploads/2025/12/American-Hospital-Association-et-al-v.-PatientRightsAdvocate.org-Inc_2026.03.27_PLAINTIFFS-RESPONSE-TO-MOTION-TO-DISMISS.pdf) (SECONDARY: via search snippet)

### Inferences
- **No clean data path.** There is no machine-readable public download of NUBC code lists. Institutional (837I) billing software needs a negotiated AHA electronic license or a licensed vendor feed. Fragments are visible in CMS manuals and Blue Button, but these are not a licensed complete source.
- **Mid-year changes.** NUBC changes can take effect mid-cycle (the manual is annual, but NUBC meeting decisions are effective on stated dates). I did not confirm the quarterly-update mechanism.

### Gaps
- I found no 2027 manual price, no electronic-license fee schedule, no counts of revenue codes or condition/occurrence/value codes, and no NUBC meeting calendar.

---

## Q11. NDC and the NDC↔HCPCS crosswalks (brief)

### Takeaway
The NDC (National Drug Code) is FDA's product-and-package identifier for drugs. It is free, updated daily, and downloadable as text/Excel ZIPs or via the openFDA JSON API (with a free key). It is currently 10 digits in three segments, padded to 11 digits (5-4-2) on claims. FDA finalized a move to a uniform 12-digit (6-4-2) format effective March 7, 2033. Physician and outpatient drug lines bill a HCPCS J/Q code in "billable units". CMS's free quarterly ASP NDC-HCPCS crosswalk maps NDCs to HCPCS codes and gives the units per package.

### Cited Findings
- **NDC Directory:**
  - It holds listings for finished and unfinished drugs submitted in SPL (structured product labeling) files. Each drug has "a unique, three-segment number", and the directory "is updated daily".
  - "Assignment of an NDC number does not in any way denote FDA approval", and inclusion "does not mean a product is covered or eligible for reimbursement by Medicare, Medicaid or other payers".
  - Excluded: animal drugs, blood products, contract-manufactured drugs, and kit-only components.
  - Downloads: `ndctext.zip`, `ndcxls.zip`, `ndc_unfinished.zip`, `ndc_excluded.zip` and `compounders_ndc_directory.zip`, all at accessdata.fda.gov/cder/.
  — [FDA National Drug Code Directory](https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory)
- **12-digit NDC rule:**
  - FDA's final rule "Revising the National Drug Code Format and Drug Label Barcode Requirements" adopts a uniform 12-digit NDC and takes effect March 7, 2033. — [FDA NDC Directory page](https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory); [Federal Register 2026-04368, Mar 5, 2026](https://www.federalregister.gov/documents/2026/03/05/2026-04368/revising-the-national-drug-code-format-and-drug-label-barcode-requirements)
  - The new format is a 6-digit labeler, 4-digit product and 2-digit package code, and existing 10-digit NDCs convert by adding leading zeros. — [Faegre Drinker](https://www.faegredrinker.com/en/insights/publications/2026/3/fda-finalizes-rule-requiring-12-digit-national-drug-code-ndc) (SECONDARY)
  - A 3-year labeling transition follows. The rule does not change the HIPAA 11-digit billing format. — [LexisNexis Reed Tech](https://www.reedtech.com/knowledge-center/fda-12-digit-ndc-final-rule/) (SECONDARY)
- **openFDA:**
  - The NDC endpoint returns NDC Directory data as JSON, updated daily.
  - The directory includes only final marketed drugs, and the information is not FDA-verified.
  — [openFDA NDC API](https://open.fda.gov/apis/drug/ndc/)
  - Rate limits: 240 requests/minute and 1,000/day per IP without a key; 240/minute and 120,000/day with a free key. — [openFDA authentication](https://open.fda.gov/apis/authentication/)
- **openFDA live check (my analysis, Oct 21, 2026):**
  - `https://api.fda.gov/download.json` lists the NDC bulk export dated 2026-10-20 with 138,202 records in a single file (`https://download.open.fda.gov/drug/ndc/drug-ndc-0001-of-0001.json.zip`).
  - A query `https://api.fda.gov/drug/ndc.json?search=product_ndc:"0006-3026"` returns KEYTRUDA (pembrolizumab), Merck Sharp & Dohme, BLA125514, with packages 0006-3026-02 (1 vial × 4 mL) and 0006-3026-04 (2 vials).
  — [openFDA download index](https://api.fda.gov/download.json)
- **CMS ASP crosswalks:**
  - Part B drugs are paid at 106% of ASP (average sales price), which manufacturers report quarterly at the 11-digit NDC level.
  - The crosswalks "are not intended to be a comprehensive list of all drugs/NDCs".
  - Fields: HCPCS code, short descriptor, dosage descriptor, labeler, 11-digit NDC (xxxxx-xxxx-xx), drug name, package size, package quantity, billable units per package, and billable units per NDC.
  — [Crosswalk introduction text inside October 2026 ZIP](https://www.cms.gov/files/zip/october-2026-ndc-hcpcs-crosswalk-final.zip) (my analysis)
- **October 2026 crosswalk (my analysis):**
  - Effective Oct 1–Dec 31, 2026.
  - Files: ASP (.xls plus a Section 508 CSV of about 7,400 lines), OPPS, AWP (vaccines/blood products at 95% AWP), PrEP crosswalks, and an introduction.
  - Example: J9271 "Inj pembrolizumab" 1 MG ↔ NDC 00006-3026-02 Keytruda, 100 billable units per package. The FDA's 10-digit "0006-3026-02" appears as 11-digit "00006-3026-02".
  — [CMS October 2026 NDC-HCPCS Crosswalk ZIP](https://www.cms.gov/files/zip/october-2026-ndc-hcpcs-crosswalk-final.zip)
- **Posting and revisions:** The CMS ASP page lists "October 2026 NDC-HCPCS Crosswalk – 09/17/2026 – Final file". Earlier 2026 quarters were revised after the fact (January and April 2026 crosswalks revised 03/30/2026; payment-limit files revised 09/15/2026). There is also a 2026–2027 seasonal vaccine crosswalk (08/27/2026). — [CMS ASP Pricing Files](https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files)

### Inferences
- **Store NDCs as text.** Keep the FDA 10-digit hyphenated NDC and a derived 11-digit 5-4-2 billing NDC, with leading-zero padding on whichever segment is short. Also plan a 12-digit field before 2033.
- **Unit conversion.** NDC↔HCPCS is a units problem: billed HCPCS units = dose given ÷ HCPCS dosage descriptor. Crosswalk files must be re-loaded quarterly, and corrected versions can appear months later.

### Gaps
- I did not verify the exact column layout of FDA `ndctext.zip` (product.txt/package.txt), or whether openFDA still publishes a single partition at all times.

---

## Q12. Place of Service (POS) codes (brief)

### Takeaway
POS codes are 2-digit codes on professional (CMS-1500/837P) claims that say where the service happened, e.g., 11 office, 21 inpatient hospital, 10 telehealth in the patient's home. CMS maintains them free as a web table plus PDF, with 52 assigned codes. Additions are rare (the latest is 66 PACE Center, Aug 2024), and payment rules for each code vary by payer.

### Cited Findings
- **Size and format:** The CMS POS code set page lists 52 assigned POS codes; the rest are "Unassigned" (e.g., 28–30, 35–40, 59, 82–98). It is a web table plus a downloadable PDF, "Place of Service Codes for Professional Claims". The database was updated May 2, 2024, and the page last modified 02/17/2026. — [CMS Place of Service Code Set](https://www.cms.gov/medicare/coding-billing/place-of-service-codes/code-sets)
- **Examples:**

| Code | Meaning | Dates |
|---|---|---|
| 11 | Office | – |
| 12 | Home | – |
| 02 | Telehealth provided other than in patient's home | effective Jan 1, 2017; description changed Jan 1, 2022 |
| 10 | Telehealth provided in patient's home | effective Jan 1, 2022; Medicare from Apr 1, 2022 |
| 19 | Off campus outpatient hospital | effective Jan 1, 2016 |
| 22 | On campus outpatient hospital | – |
| 21 | Inpatient hospital | – |
| 23 | Emergency room, hospital | – |
| 81 | Independent laboratory | – |
| 27 | Outreach site/street | effective Oct 1, 2023 |
| 66 | PACE center | effective Aug 1, 2024 |

  — [CMS POS Code Set](https://www.cms.gov/medicare/coding-billing/place-of-service-codes/code-sets)
- **Usage:** POS codes "should be used on professional claims to specify the entity where service(s) were rendered". Reimbursement policies vary by payer. — [CMS POS Code Set](https://www.cms.gov/medicare/coding-billing/place-of-service-codes/code-sets)

### Inferences
- **Manual load.** There is no CSV or API; the table is small enough to maintain by hand. POS drives facility vs. non-facility payment rates on the Medicare Physician Fee Schedule, so it interacts with CPT pricing.

### Gaps
- The CMS page does not name the body that maintains POS (often described as the CMS POS workgroup). I did not verify this.

---

## Q13. Cross-cutting summary for builders: source, cost and cadence at a glance

### Takeaway
The procedure-side code sets split into two groups.
- **Free government files (CMS/FDA):** HCPCS II, ICD-10-PCS, POS, NDC, and the ASP crosswalks.
- **Privately owned and licensed:** CPT (AMA), CDT (ADA), and the NUBC/UB-04 codes (AHA).

The licensed sets cost the most money and legal effort, and CPT has the most complex multi-stream update calendar.

### Cited Findings

| Code set | Owner | Cost | Format and access | Update cadence |
|---|---|---|---|---|
| CPT | AMA | Licensed: $82.50 + $18.50/user internal (2026); $1,050 upfront + $18.50/user distribution (2027); metered models for plans, labs, telehealth and analytics | Data files via the AMA Intelligent Platform / Royalties Portal / Zip API | Annual Jan 1 (Category I); Category III ~3×/yr; PLA quarterly; vaccines ad hoc |
| HCPCS Level II | CMS | Free | Quarterly ZIP: fixed-width TXT + XLSX | Quarterly (Jan/Apr/Jul/Oct) |
| ICD-10-PCS | CMS | Free | Annual ZIPs | Oct 1 (FY), possible Apr 1 update |
| CDT | ADA | Commercial license, negotiated | Not found | Annual, Jan 1 |
| UB-04 / NUBC codes | AHA / NUBC | Paid PDF e-book (7/1–6/30); electronic license by contract | PDF e-book; electronic via contract | Annual edition |
| NDC | FDA | Free | Daily text/Excel ZIPs + openFDA API | Daily |
| ASP NDC-HCPCS crosswalk | CMS | Free | Quarterly ZIP (XLS/CSV) | Quarterly, with later revisions |
| POS | CMS | Free | Web table + PDF | Rare changes |

Sources by row:
- CPT: [AMA licensing](https://www.ama-assn.org/practice-management/cpt-licensing); [internal rates](https://compliance.ama-assn.org/hc/article_attachments/33699558348439); [distribution rates](https://compliance.ama-assn.org/hc/article_attachments/40950238000663)
- HCPCS Level II: [CMS quarterly update](https://www.cms.gov/medicare/coding/hcpcsreleasecodesets/hcpcs-quarterly-update)
- ICD-10-PCS: [CMS ICD-10](https://www.cms.gov/medicare/coding-billing/icd-10-codes)
- CDT: [ADA licensing](https://www.ada.org/publications/ada-store-products/licensing-for-commercial-users)
- UB-04 / NUBC: [NUBC](https://www.nubc.org/subcription-information)
- NDC: [FDA](https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory); [openFDA](https://open.fda.gov/apis/authentication/)
- ASP crosswalk: [CMS ASP](https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files)
- POS: [CMS POS](https://www.cms.gov/medicare/coding-billing/place-of-service-codes/code-sets)

### Inferences
- **Effective-date versioning.** Every table should store codes as strings with "effective from" and "effective to" dates and a source-release ID. Claims are validated by date of service (date of discharge for ICD-10-PCS). Without this, mid-year CPT Category III, PLA and vaccine releases, quarterly HCPCS adds and terminations, and the Oct 1 PCS change will cause wrong-code denials.
- **Licensing budget.** The main legal and cost risks are CPT (per-user or per-usage royalties, previous-release fees, the AI-training ban), the NUBC electronic license, and CDT. The two pending N.D. Ill. cases (PRA v. AMA; AHA v. PRA) and CMS's CPT RFI could change this. Nothing had changed as of Oct 21, 2026.

### Gaps
- See the per-section gaps. The largest are the current CPT data file schema and API endpoints (behind the AMA login), NUBC electronic license pricing, and CDT royalty amounts.
