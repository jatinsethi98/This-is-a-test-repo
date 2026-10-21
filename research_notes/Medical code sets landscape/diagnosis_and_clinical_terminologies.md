# US Diagnosis Code Sets, Clinical Terminologies, and the Grouping/Risk Systems Built on Them (as of 2026-10-21)

Research method note: wherever possible I downloaded the actual government files (CDC FTP, CMS zips, NLM pages, NUCC CSV) and counted or read them directly instead of relying on summaries. Figures marked "computed from file" are my own counts from the file at the cited URL. A source is marked **[secondary]** when it is a vendor, news, or trade-press page and not the owner of the code set. loinc.org and several cdc.gov pages blocked direct fetching (HTTP 403). LOINC facts therefore come from loinc.org search-result snippets, and ICD-11 status partly from snippets. Both are flagged where used.

---

## 1. ICD-10-CM: what it is, who owns it, how it is structured, and how software gets it

### Takeaway
ICD-10-CM is the US diagnosis code set that HIPAA requires on every US claim. CDC's NCHS maintains it as a licensed adaptation of WHO's ICD-10, and CMS co-runs the update process. The FY2027 release took effect Oct 1, 2026. Its order file has **74,879 billable codes** plus 23,524 non-billable "header" entries, 98,403 lines in total. It is a free, anonymous download from the CDC FTP site and from CMS, in fixed-width TXT, XML (with XSD schemas), and PDF.

### Plain-English terms
- **Code set / classification:** a fixed list of codes, each with a meaning. ICD is a *classification*: it groups conditions into buckets so they can be counted and billed. A *terminology* such as SNOMED CT tries instead to name every clinical idea precisely.
- **ICD-10 (WHO) vs ICD-10-CM (US):** WHO publishes the international ICD-10. The US "Clinical Modification" (CM) adds much more detail, such as laterality (right/left) and encounter type, for US diagnosis coding.
- **ICD-10-PCS:** a separate US code set for *inpatient hospital procedures*, maintained by CMS. It is not used for diagnoses.
- **Billable code vs header:** only the most detailed level of the hierarchy (a "code") may go on a claim. Higher levels (categories and subcategories) are "headers", and a claim that uses one is rejected.
- **Fiscal year (FY):** the federal fiscal year runs Oct 1 to Sep 30. "FY2027 codes" apply to dates of service from Oct 1, 2026 to Sep 30, 2027.

### Cited Findings
**Ownership and governance**
- NCHS is "responsible for the clinical modification of ICD-10 for use in the United States". WHO owns and publishes ICD-10 and authorized NCHS to develop ICD-10-CM. "All modifications to ICD-10 must conform to WHO's established ICD structure and conventions." — [CDC NCHS ICD-10-CM page](https://www.cdc.gov/nchs/icd/icd-10-cm/index.html)
- The official guidelines describe ICD-10-CM as "based on the ICD-10, the statistical classification of disease published by the World Health Organization (WHO)." — [FY2027 ICD-10-CM Official Guidelines (CDC FTP PDF)](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/ICD-10-CM-October-1-2026-FY27-Guidelines.pdf)
- The **ICD-10 Coordination and Maintenance (C&M) Committee** is "a Federal interdepartmental committee comprised of representatives from" CMS and CDC/NCHS, "responsible for approving coding changes, developing errata, addenda and other modifications." It holds public meetings twice a year. "CDC/NCHS has the lead on ICD-10-CM diagnosis code issues. CMS has the lead on ICD-10-PCS procedure code issues." Diagnosis-code meeting materials are posted by CDC/NCHS. — [CMS C&M Committee Meetings page](https://www.cms.gov/medicare/coding-billing/icd-10-codes/icd-10-coordination-maintenance-committee-meetings)
- Materials from the September 2026 C&M meeting (proposals for future updates) are posted as `september-2026-presentations.zip`, dated 9/30/2026. — [CDC FTP FY2027 folder listing](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/)
- The Official Guidelines "have been approved by the four organizations that make up the Cooperating Parties for the ICD-10-CM: the American Hospital Association (AHA), the American Health Information Management Association (AHIMA), CMS, and NCHS." "Adherence to these guidelines when assigning ICD-10-CM diagnosis codes is required under ... (HIPAA). The diagnosis codes (Tabular List and Alphabetic Index) have been adopted under HIPAA for all healthcare settings." "The instructions and conventions of the classification take precedence over guidelines." The FY2027 guidelines run 121 pages. — [FY2027 Guidelines PDF](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/ICD-10-CM-October-1-2026-FY27-Guidelines.pdf)
- "ICD-10 applies to all parties covered by HIPAA, not just providers who bill Medicare or Medicaid." The US switched from ICD-9 on Oct 1, 2015. — [CMS ICD-10 page](https://www.cms.gov/medicare/coding-billing/icd-10-codes)

**Structure (from the official guidelines)**
- "All categories are 3 characters... Subcategories are either 4 or 5 characters. Codes may be 3, 4, 5, 6 or 7 characters... A code that has an applicable 7th character is considered invalid without the 7th character." "For reporting purposes only codes are permissible, not categories or subcategories." — [FY2027 Guidelines](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/ICD-10-CM-October-1-2026-FY27-Guidelines.pdf)
- **Placeholder "X":** "used as a placeholder at certain codes to allow for future expansion... at the poisoning, adverse effect and underdosing codes, categories T36-T50. Where a placeholder exists, the X must be used." **7th character:** "If a code that requires a 7th character is not 6 characters, a placeholder X must be used to fill in the empty characters." — [FY2027 Guidelines](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/ICD-10-CM-October-1-2026-FY27-Guidelines.pdf)
- Example codes, verified in the FY2027 order file (codes are stored without the decimal point; it is displayed after the 3rd character) — [icd10cm-code-descriptions-2027.zip](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-code-descriptions-2027.zip):
  - `E11.22` = Type 2 diabetes mellitus with diabetic chronic kidney disease (billable)
  - `I10` = Essential (primary) hypertension (a 3-character category that is itself billable)
  - `T36.0X1A` = Poisoning by penicillins, accidental (unintentional), initial encounter (placeholder X plus 7th character "A")
  - `S72.001A` = Fracture of unspecified part of neck of right femur, initial encounter for closed fracture
  - `Z3A` = Weeks of gestation (header, not billable); `Z3A.20` = 20 weeks gestation of pregnancy (billable)
  - `U07.1` = COVID-19 (billable)

**Size of FY2027 (computed from file)**
- `icd10cm-codes-2027.txt` has **74,879 lines**, one per billable code. `icd10cm-order-2027.txt` has **98,403 lines**: 74,879 with header flag `1` (billable) and 23,524 with flag `0` (header/non-billable). — computed from [icd10cm-code-descriptions-2027.zip](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-code-descriptions-2027.zip)
- FY2027 changes, computed from `icd10cm-order-addenda-2027.txt` in the same zip: **190 new billable codes**, 63 new header lines, **30 billable codes deleted**, 6 header lines deleted, **4 title revisions** (L02.232, L03.312, L03.322, Z29.14). 15 of the 30 deleted billable codes come back as headers because they were expanded into children. For example, `I42.0` Dilated cardiomyopathy becomes a header over new `I42.00`, `I42.01` and `I42.09`. Other new codes include `I49.81` Brugada syndrome and `E89.830` Post bariatric hypoglycemia. — [icd10cm-code-descriptions-2027.zip](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-code-descriptions-2027.zip)
- Trade press counts differ by method. "190 new, 30 deleted, 4 revised" — [AMBA [secondary]](https://www.americanmedicalbillingassociation.com/icd-10-codes-fy-2027/); "238 new entries (190 billable + 48 headers), 21 deleted, 4 revised, 5 billable codes converted to headers" (AAPC figures) — [KZA [secondary]](https://www.kzanow.com/alerts/fy-2027-icd-10); [Physicians Practice [secondary]](https://www.physicianspractice.com/view/new-icd-10-codes-for-fiscal-year-2027-are-out-here-s-what-practices-need-to-know). My file-based counts match the 190/30/4 version.

**Effective dates and update cadence**
- CMS: FY2027 ICD-10-CM files are for "discharges occurring from October 1, 2026 – September 30, 2027 and for patient encounters occurring from October 1, 2026 – September 30, 2027". FY2027 **ICD-10-PCS** files apply only to discharges Oct 1, 2026 – Mar 31, 2027, which means an April 1, 2027 PCS update is planned. — [CMS ICD-10 page](https://www.cms.gov/medicare/coding-billing/icd-10-codes)
- The CMS page also lists **April 1, 2026 ICD-10-CM** files (code descriptions, addendum, tables/index, conversion table) "for discharges occurring from April 1, 2026 – September 30, 2026". So ICD-10-CM does receive mid-year April updates, though not every year. — [CMS ICD-10 page](https://www.cms.gov/medicare/coding-billing/icd-10-codes)
- CMS adopted "an April 1 implementation date, in addition to the annual October 1 update, beginning with April 1, 2022" (stated for PCS requests, FY2022 IPPS final rule 86 FR 44950-44956). — [CMS C&M Committee Meetings page](https://www.cms.gov/medicare/coding-billing/icd-10-codes/icd-10-coordination-maintenance-committee-meetings)

**Where the files live and their formats**
- CDC FTP folder `https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/` contains: `ICD-10-CM-CONVERSION-TABLE-FY2027.xlsx` (8/13/2026), `ICD-10-CM-October-1-2026-FY27-Guidelines.pdf` (6/8/2026), `icd10cm-addenda-2027.zip`, `icd10cm-code-descriptions-2027.zip`, `icd10cm-table-and-index-2027.zip` (6/16/2026), `POAexemptCodesFY27.zip` (6/8/2026) and `september-2026-presentations.zip` (9/30/2026). The folder downloads anonymously with no login. — [CDC FTP FY2027 folder](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/)
- The **code-descriptions zip** contains `icd10cm-codes-2027.txt` (code and long title), `icd10cm-order-2027.txt` (fixed-width: 5-digit order number, code without decimal, header flag 0/1, 60-character short title, long title), addenda TXT files, and format PDFs `icd10cmCodesFile.pdf` and `icd10OrderFiles.pdf`. — [icd10cm-code-descriptions-2027.zip](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-code-descriptions-2027.zip)
- The **table-and-index zip** contains XML plus XSD schemas and PDFs for: the **Tabular List** (`icd10cm-tabular_-2027.xml`, `icd10cm-tabular.xsd`), the **Alphabetic Index** (`icd10cm-index-2027.xml`), the **External Cause Index** (`icd10cm-eindex-2027.xml`), the **Table of Drugs and Chemicals** (`icd10cm-drug-2027.xml`) and the **Neoplasm Table** (`icd10cm-neoplasm-2027.xml`, schema `icd10cm-drug-neoplasm.xsd`). Note the underscore typo in the tabular XML file name. — [icd10cm-table-and-index-2027.zip](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-table-and-index-2027.zip)
- The addenda zip holds PDF addenda for the tabular, index, e-index, drug and neoplasm tables. — [icd10cm-addenda-2027.zip](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-addenda-2027.zip)
- CMS mirrors the same content under different file names: [2027 Code Descriptions in Tabular Order](https://www.cms.gov/files/zip/2027-code-descriptions-tabular-order.zip), [2027 Code Tables, Tabular and Index](https://www.cms.gov/files/zip/2027-code-tables-tabular-index.zip), [2027 Addendum](https://www.cms.gov/files/zip/2027-icd-10-addendum.zip), [2027 Conversion Table](https://www.cms.gov/files/zip/2027-conversion-table.zip), and [FY2027 Guidelines PDF](https://www.cms.gov/files/document/fy-2027-icd-10-cm-coding-guidelines.pdf) — [CMS ICD-10 page](https://www.cms.gov/medicare/coding-billing/icd-10-codes)
- CDC runs a free web **ICD-10-CM Browser Tool** at https://icd10cmtool.cdc.gov/, which includes every year's updates since launch. — [CDC NCHS ICD-10-CM page](https://www.cdc.gov/nchs/icd/icd-10-cm/index.html)

**ICD-10-PCS (for contrast)**
- "ICD-10-PCS codes are composed of seven characters. Each character is an axis of..." classification; "All seven characters must be specified to be a valid code." — [2027 ICD-10-PCS Official Guidelines](https://www.cms.gov/files/document/2027-official-icd-10-pcs-coding-guidelines.pdf)
- The FY2027 PCS codes file `icd10pcs_codes_2027.txt` has **79,256 codes** (computed from file). Example new code: `028F3Z0` Division of Aortic Valve, Percutaneous Approach, Native Leaflet. — [2027 ICD-10-PCS Codes File](https://www.cms.gov/files/zip/2027-icd-10-pcs-codes-file.zip)

### Inferences
- Data model: store codes without the decimal and add it for display only. Keep the header flag. Version every code by **effective date range**, not just by "FY". April 1 releases split a fiscal year into two code versions, so validation must use the claim's date of service, or the discharge date for inpatient claims.
- FY2026 (April 1, 2026 version) likely had about 74,719 billable codes (74,879 − 190 + 30). This is inferred from the addenda, not separately verified.
- Deleted codes do not disappear in practice. A claim for a Sept 30, 2026 service must still accept `I42.0`, while an Oct 1, 2026 claim must reject it and require `I42.00`, `I42.01` or `I42.09`. Keep every year's file and use the conversion table/addenda to suggest replacements.
- For parsing, the order file is the simplest machine-readable source. The tabular XML is needed for instructional notes and 7th-character rules (Section 2).

### Gaps
- I found no explicit statement on the pages I fetched that ICD-10-CM is "public domain". It is clearly free and needs no registration (anonymous FTP), but the exact copyright and permission language (WHO holds ICD-10 copyright) was not confirmed.
- I did not open the FY2027 conversion table to confirm its exact column layout.
- Whether an April 1, 2027 ICD-10-CM update will happen was unknown as of this research. CMS only signals a PCS April update through the Mar 31, 2027 end date.

---

## 2. Code-level annotations and edits that coding logic depends on (Excludes1/2, code first, use additional, 7th characters, POA, MCE, OCE)

### Takeaway
The rules that say which codes may appear together, which must be sequenced first, and which need extra characters are written inside the **Tabular List XML**. They are not in the flat code list, so software that loads only the TXT code file misses them. Medicare's claim-level edits ship separately from the code set: the **MCE** for inpatient claims (inside the MS-DRG grouper package) and the **I/OCE** for outpatient claims (quarterly). **POA** (present on admission) indicators are defined in the Official Guidelines, and the POA exempt list is a separate yearly file.

### Plain-English terms
- **Excludes1:** "NOT CODED HERE". The two codes should never be reported together.
- **Excludes2:** "not included here". The patient may have both conditions, so both codes can be reported.
- **Code first / Use additional code:** sequencing rules. Some codes must follow an underlying-cause code, and some require a second code that adds detail.
- **Code also:** two codes may be needed, and sequencing depends on circumstances.
- **POA indicator:** a one-letter flag on each inpatient diagnosis saying whether the condition existed when the patient was admitted. It matters for hospital-acquired-condition payment penalties.
- **MCE (Medicare Code Editor):** CMS software that checks inpatient claims for diagnosis and procedure inconsistencies, such as a male-only code on a female patient or an invalid principal diagnosis.
- **I/OCE (Integrated Outpatient Code Editor):** the outpatient counterpart. It edits hospital outpatient claims and assigns APCs.

### Cited Findings
- The FY2027 tabular XML explains its notations in its own introduction. Excludes1 "means 'NOT CODED HERE!' An Excludes1 note indicates that the code excluded should never be used at the same time as the code above the Excludes1 note... used when two conditions cannot occur together, such as a congenital form versus an acquired form." — [icd10cm-table-and-index-2027.zip → icd10cm-tabular_-2027.xml](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-table-and-index-2027.zip)
- Counts of XML elements in the FY2027 tabular file (computed from file): `<excludes1>` 2,648; `<excludes2>` 1,172; `<codeFirst>` 364; `<useAdditionalCode>` 847; `<codeAlso>` 333; `<includes>` 414; `<inclusionTerm>` 6,842; `<sevenChrDef>` 508 (definitions of valid 7th characters, attached at category or subcategory level). Example: category S72 Fracture of femur has notes such as "A fracture not indicated as open or closed should be coded to closed", an Excludes1 to "traumatic amputation of hip and thigh (S78.-)", and an Excludes2 to "fracture of lower leg and ankle (S82.-)". — [icd10cm-table-and-index-2027.zip](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/icd10cm-table-and-index-2027.zip)
- **POA reporting options:** "Y – Yes; N – No; U – Unknown; W – Clinically undetermined; Unreported/Not used – (Exempt from POA reporting)". Definitions: U = "documentation is insufficient to determine if condition was present on admission"; W = "provider is unable to clinically determine whether condition was present on admission or not". These are in Appendix I of the guidelines. — [FY2027 Guidelines](https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2027/ICD-10-CM-October-1-2026-FY27-Guidelines.pdf)
- CMS: "To group diagnoses into the proper MS-DRG, CMS needs to identify a Present on Admission (POA) Indicator for all diagnoses reported on claims involving inpatient admissions to general acute care hospitals." CMS publishes yearly POA exempt lists, e.g. [FY 2027 POA Exempt List (ZIP)](https://www.cms.gov/files/zip/fy-2027-present-admission-poa-exempt-list.zip). — [CMS HAC/POA Coding page](https://www.cms.gov/medicare/payment/fee-for-service-providers/hospital-aquired-conditions-hac/coding)
- **MCE v44 (FY2027)**, from *Definitions of Medicare Code Edits v44.0* (DOCX/PDF/TXT). Edits include: 1 Invalid diagnosis or procedure code; 2 External causes of morbidity codes as principal diagnosis; 3 Duplicate of PDX; 4 Age conflict; 5 Sex conflict (deactivated as of 10/01/2024); 6 Manifestation code as principal diagnosis; 8 Questionable admission; 9 Unacceptable principal diagnosis; 11 Non-covered procedure; 14–16 Invalid age/sex/discharge status; 17 Limited coverage; 18 Wrong procedure performed; 19 Procedure inconsistent with LOS; 20 Unspecified code. Several historical edits are marked discontinued. — [Definition of Medicare Code Edits v44 (ZIP)](https://www.cms.gov/files/zip/fy2027-fr-definition-mce-v44.zip), listed on the [CMS MS-DRG Classifications and Software page](https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/ms-drg-classifications-and-software)
- The MCE ships inside the same software packages as the MS-DRG grouper (e.g. "MS-DRG and MCE Version 44 Java" jars). — [CMS MS-DRG page](https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/ms-drg-classifications-and-software)
- **I/OCE:** "combines editing logic with the new Ambulatory Payment Classification (APC) assignment program". It "Edits a claim for accuracy of submitted data; Assigns APCs; Assigns CMS-designated status indicators; ... Determines a claim disposition based on generated edits". "Appendix A within the I/OCE Quarterly Release Files contains lists of codes associated with program edits for both OPPS and non-OPPS processing." — [CMS Integrated Outpatient Code Editor page](https://www.cms.gov/medicare/coding-billing/outpatient-code-editor)
- **AHA Coding Clinic** is the official Q&A guidance publication. It "represents a formal cooperative effort between" AHA, AHIMA, CDC/NCHS and CMS, and its advice is approved by those Cooperating Parties. — [AHA webinar page](https://www.aha.org/node/675972); [Coding Clinic Advisor (AHA Central Office) "About"](https://codingclinicadvisor.com/about-us). A third party resells archive access by subscription — [Find-A-Code [secondary]](https://findacode.com/newsletters/aha-coding-clinic/icd/disagreement-coding-clinic-advice-I044072.html).

### Inferences
- A rules engine needs three layers: (1) the code list for validity on the date of service; (2) tabular-XML annotations (excludes, sequencing, 7th characters, age/sex notes); (3) payer edits such as MCE, I/OCE, NCCI and payer policies. Layers 1 and 2 are free from CDC. MCE and I/OCE logic is free from CMS but versioned separately: MCE yearly with possible April versions, I/OCE quarterly.
- 7th-character validation must read `<sevenChrDef>`, which can be inherited from a parent category or subcategory, and must apply placeholder-X padding.
- Coding Clinic is copyrighted and paid. Software can build in links or references, but licensing is needed to embed its content.

### Gaps
- I did not retrieve AHA's own Coding Clinic subscription pricing or its terms for software licensing.
- I did not list the I/OCE quarterly release file URLs or confirm the current I/OCE version number for Q4 2026.

---

## 3. ICD-11: status and timeline for US adoption

### Takeaway
WHO's ICD-11 has been in effect internationally since Jan 1, 2022. As of the latest sources I found, the US still uses ICD-10 for mortality (death certificates) and ICD-10-CM for morbidity and billing. I found **no announced US morbidity/billing transition date**. Moving claims to ICD-11 would require HHS rulemaking under HIPAA, and the federal advisory committee (NCVHS) has repeatedly urged HHS to start preparing. Software should not plan for ICD-11 claims before about 2030 at the earliest; that date is an inference, not an official one.

### Cited Findings
- The World Health Assembly adopted ICD-11 on May 25, 2019, effective Jan 1, 2022. US adoption has two tracks. Mortality is led by NCHS with state vital records offices, as a condition of WHO membership. "Adoption for morbidity requires HHS rulemaking since ICD is a HIPAA-designated medical code set." — [NCVHS 2021 letter to HHS](https://ncvhs.hhs.gov/wp-content/uploads/2021/09/NCVHS-ICD-11-recommendations-for-HHS-Sept-10-2021-Final-508.pdf); [NCVHS 2019 letter](https://ncvhs.hhs.gov/wp-content/uploads/2019/12/Recommendation-Letter-Preparing-for-Adoption-of-ICD-11-as-a-Mandated-US-Health-Data-Standard-final.pdf)
- In April 2024 NCVHS urged HHS to "immediately identify leadership specific to all ICD-11 morbidity-related activities", i.e. to name a central coordinator. — [NCVHS 2024 ICD-11 letter](https://ncvhs.hhs.gov/wp-content/uploads/2024/05/NCVHS-ICD-11-Recommendation-Letter-for-website_508.pdf) (content via search summary)
- NCHS presented plans for ICD-11 mortality implementation to NCVHS in 2023. — [NCHS presentation to NCVHS, 2023](https://ncvhs.hhs.gov/wp-content/uploads/2023/05/Presentation-Day-1-Implementation-of-ICD-11-for-Mortality-Reporting-in-the-US-Anderson.pdf)
- NCHS *Health, United States* (reported as updated Sept 2026): "ICD–11 was adopted by the World Health Assembly in 2019 and became effective internationally on January 1, 2022, although the United States continues to use ICD–10 for mortality coding." — [CDC NCHS Health, US: ICD](https://www.cdc.gov/nchs/hus/sources-definitions/icd.htm). This came from a search-result snippet; direct fetching returned 403.
- The CDC ICD-10-CM page (dated July 2, 2026) does not mention ICD-11. — [CDC NCHS ICD-10-CM page](https://www.cdc.gov/nchs/icd/icd-10-cm/index.html)
- **ICD-11 licensing:** WHO licenses the ICD-11 classifications under **CC BY-ND 3.0 IGO**: "you are NOT permitted to make 'adaptations'... neither the Licensed Materials, nor any portion thereof, may be used for the purpose of developing or promulgating a different standard." — [WHO ICD-11 License PDF](https://icd.who.int/en/docs/icd11-license.pdf)
- **ICD-11 API:** after you register on WHO's ICD API site you "could get a client id and client secret". The token endpoint is `https://icdaccessmanagement.who.int/connect/token`, and responses are JSON-LD/JSON. — [WHO ICD-API documentation v2](https://icd.who.int/docs/icd-api/APIDoc-Version2/)
- Vendor blogs give conflicting ICD-11 dates (e.g. "2025–2027" vs "off the table") and should not be relied on. — e.g. [medicalbillinginfo.com [secondary]](https://medicalbillinginfo.com/icd-11-us-transition-status/)

### Inferences
- The ICD-9 to ICD-10 switch took years between the final rule and go-live, and no NPRM (proposed rule) for ICD-11 morbidity exists. A US ICD-11 claims mandate is therefore at least several years away. This is an inference.
- ICD-11's no-adaptations license would complicate a US "ICD-11-CM", because WHO would need to grant permission as it did for ICD-10-CM.

### Gaps
- I could not fetch the CDC NCHS ICD-11 page (403/404) to confirm current NCHS mortality-transition dates.
- I found no 2025–2026 HHS or Federal Register action on ICD-11 morbidity. This is likely because none exists, but that is unconfirmed.

---

## 4. Risk adjustment models built on ICD-10-CM (CMS-HCC V24/V28, RxHCC, ESRD, HHS-HCC, CDPS)

### Takeaway
Risk adjustment models map ICD-10-CM codes to condition categories (HCCs) and add up weights to predict a patient's cost. Health plans' payments depend on the result. CMS publishes the **ICD-10→HCC mapping (CSV/XLSX)** and **SAS model software** every year for Medicare Advantage. For **payment year 2027**, the 2024 CMS-HCC model (**V28, 115 payment HCCs**) is used at 100% for non-PACE plans; it was not recalibrated. The ACA marketplace HHS-HCC model has its own "DIY" software (SAS/Python). Medicaid's **CDPS+Rx** is licensed from UC San Diego.

### Plain-English terms
- **HCC (Hierarchical Condition Category):** a bucket of related diagnoses (e.g. "Diabetes with chronic complications"). "Hierarchical" means that if a patient has both a severe and a mild version, only the severe one counts.
- **Risk score:** the sum of demographic and HCC weights. A score of 1.0 means average expected cost.
- **Payment year (PY) vs dates of service:** PY2027 Medicare Advantage payments use diagnoses from **2026** dates of service.
- **V24 / V28 / V22:** version labels of the CMS-HCC model. V28 is the "2024 CMS-HCC model", V24 the "2020 model", and V22 the "2017 model".
- **Normalization factor:** a yearly scaling divisor CMS applies so that scores stay comparable over time.

### Cited Findings
**CMS-HCC (Medicare Advantage) and RxHCC (Part D)**
- The CMS Risk Adjustment hub links yearly "Model Software/ICD-10 Mappings" pages from 2006 to 2027, plus the Outpatient CPT/HCPCS excluded-services lists, the Risk Adjustment Eligible CPT/HCPCS codes, telehealth diagnosis guidance, and the acceptable physician specialty lists. — [CMS Risk Adjustment page](https://www.cms.gov/medicare/payment/medicare-advantage-rates-statistics/risk-adjustment)
- The 2027 page offers three downloads: **2027 Initial Model Software**, **PY 2027 Initial Model Software** and **2027 Initial ICD-10-CM Mappings**. — [CMS 2027 Model Software/ICD-10 Mappings](https://www.cms.gov/medicare/payment/medicare-advantage-rates-statistics/risk-adjustment/2027-model-software-icd-10-mappings); files: [2027-initial-icd-10-cm-mappings.zip](https://www.cms.gov/files/zip/2027-initial-icd-10-cm-mappings.zip), [2027-initial-model-software.zip](https://www.cms.gov/files/zip/2027-initial-model-software.zip), [py-2027-initial-model-software.zip](https://www.cms.gov/files/zip/py-2027-initial-model-software.zip)
- The mapping zip holds `2027 Initial ICD-10-CM Mappings.xlsx` and `.csv` (about 11,900 lines). The header says "ICD-10-CM Codes, ESRD, CMS-HCC and RxHCC Models" and "Includes ICD-10 codes valid in FY2025 and FY2026". Columns: Diagnosis Code; Description; CMS-HCC ESRD Model Category V21; CMS-HCC ESRD Model Category V24; CMS-HCC Model Category V22; CMS-HCC Model Category V28; RxHCC Model Category V08; then Yes/No/"--" flags for whether each code is in each model for the 2026 payment year. Codes without a decimal can appear on multiple rows when they map to multiple categories. — computed from [2027-initial-icd-10-cm-mappings.zip](https://www.cms.gov/files/zip/2027-initial-icd-10-cm-mappings.zip)
- Example rows from that file:
  - `E11.22` (T2DM with diabetic CKD) → V28 HCC **37**, V22 HCC 18, RxHCC 30
  - `E11.9` (T2DM without complications) → V28 HCC **38**, V22 HCC 19, RxHCC 31
  - `I10` (hypertension) → **no CMS-HCC**, RxHCC 187
  - `F32.9` (major depressive disorder, single episode, unspecified) → **no CMS-HCC**, RxHCC 132

  Source: [2027-initial-icd-10-cm-mappings.zip](https://www.cms.gov/files/zip/2027-initial-icd-10-cm-mappings.zip)
- The model-software zip contains seven nested zips: `CMS-HCC software V2826.115.T2`, `CMS-HCC software V2226.79.O2`, `ESRD software E2126.87.P2`, `ESRD software E2426.86.T2`, and `RxHCC software R0826.84.T2/.Y1/.Y2`. The V28 description file says: "overview of the software for the 2024 Version 28 CMS-HCC risk-adjustment model for Payment Year 2027. The software includes a SAS program – V2826T2P that calls several SAS Macros"; "The V28 Models include **115 payment HCCs**"; it "crosswalks diagnoses to Condition Categories (CCs) using SAS formats... Then... creates Hierarchical Condition Categories (HCCs) by imposing hierarchies"; it computes scores from 9 regression segments (community non-dual/full-dual/partial-dual × aged/disabled, institutional, new enrollee, C-SNP new enrollee). The programs ship as .TXT files: "Please rename them to have .sas extension before running." — [2027-initial-model-software.zip](https://www.cms.gov/files/zip/2027-initial-model-software.zip)
- **CY2027 model choice:** "For CY 2027, CMS will continue to use the 2024 CMS-HCC model to calculate risk scores" for organizations other than PACE. The ESRD model continues to be the 2023 ESRD model. Part D uses the "2027 RxHCC model (2023/2024 calibration)". PACE blends 50% 2024 CMS-HCC with 50% 2017 CMS-HCC. Normalization factor for the 2024 CMS-HCC model: **1.079**; for the 2023 ESRD dialysis model: 1.072 (Rate Announcement). — [CMS CY2027 Risk Adjustment Implementation memo, July 9, 2026](https://www.cms.gov/files/document/calendar-year-2027-risk-adjustment-implementation-information-g-pdf.pdf); [CMS CY2027 Rate Announcement](https://www.cms.gov/files/document/2027-announcement.pdf)
- For PY2027, diagnoses from **unlinked chart review records** with 2026 dates of service are excluded for non-PACE organizations, with an exception for members enrolled with the plan in the diagnosis year. — [CMS implementation memo](https://www.cms.gov/files/document/calendar-year-2027-risk-adjustment-implementation-information-g-pdf.pdf); see [Wakely summary [secondary]](https://www.wakely.com/wp-content/uploads/2026/04/Summary-of-CY-2027-Final-Rate-Announcement.pdf)
- CMS chose not to adopt a proposed recalibrated "2027 model" in the final Rate Announcement of April 6, 2026. — search summaries of [CMS 2027 Announcement](https://www.cms.gov/files/document/2027-announcement.pdf) and [American Action Forum [secondary]](https://www.americanactionforum.org/weekly-checkup/cy-2027-ma-rate-announcement-a-bigger-than-expected-increase-but-not-a-blank-check/)

**HHS-HCC (ACA individual/small-group market)**
- CMS (CCIIO) posts yearly "HHS-Developed Risk Adjustment Model Algorithm 'Do It Yourself (DIY)' Software", with Instructions (PDF) and Technical Details (XLSX), plus SAS and/or Python versions. On **July 31, 2026** it posted the **2026 Benefit Year** DIY software (Instructions PDF, Technical Details XLSX, and a Python version zip). 2025 BY has both SAS and Python versions. — [CMS Marketplace Regulations & Guidance page](https://www.cms.gov/marketplace/resources/regulations-guidance)

**CDPS / CDPS+Rx (Medicaid)**
- "The Chronic Illness and Disability Payment System (CDPS) is a diagnostic-based risk adjustment model that is widely used to adjust capitated payments for health plans that enroll Medicaid beneficiaries. CDPS uses ICD codes to assign CDPS Categories..." "Medicaid Rx (MRX) is a pharmacy-based system that uses National Drug Classification (NDC) codes" (sic). "CDPS+Rx is a combination." "CDPS 7.3 is now available." Licenses are requested by emailing CDPSlicense@ucsd.edu. — [UC San Diego CDPS page](https://hwsph.ucsd.edu/research/programs-groups/cdps.html)

### Inferences
- Gotcha: the "Initial" PY2027 mapping covers codes valid in FY2025 and FY2026, but 2026 dates of service also include Oct–Dec 2026 (**FY2027 codes**). Expect CMS to post an updated mapping that adds FY2027 codes, and re-check before final scoring. This is inferred from the file header plus how dates of service work.
- Software needs a year-keyed lookup: (payment year, model version, ICD-10-CM code) → HCC list. Hierarchies and interaction terms come from the SAS macros (e.g. `V28115H1` hierarchies). Porting from SAS to another language is common practice; CMS ships SAS only for Medicare, while HHS-HCC also comes in Python.
- Many common billing diagnoses (hypertension `I10`, unspecified depression `F32.9`) carry no CMS-HCC under V28. Coding specificity therefore changes risk scores.

### Gaps
- I did not verify the exact V24/V28 blend percentages for PY2024 and PY2025 from a CMS primary source in this session. Trade sources describe a phase-in completed by PY2026.
- I did not check the CDPS license cost. The UCSD page gives only an email contact.
- I did not open the HHS-HCC 2026 DIY technical tables to count HHS-HCCs.

---

## 5. Groupers: MS-DRG (inpatient), APR-DRG (proprietary), APC/OPPS (hospital outpatient)

### Takeaway
A **grouper** turns a claim's diagnosis and procedure codes into one payment group. **MS-DRG** (CMS, free) covers Medicare inpatient stays; **FY2027 = v44**, with 768 groups listed in Appendix A. **APR-DRG** (Solventum, formerly 3M) is proprietary and used by many state Medicaid programs. **APC** assignment for hospital outpatient claims happens inside CMS's free I/OCE software.

### Plain-English terms
- **DRG (Diagnosis Related Group):** one payment category per inpatient stay, based on principal diagnosis, secondary diagnoses (complications), procedures, age, sex and discharge status.
- **CC/MCC:** "complication or comorbidity" and "major CC". Secondary diagnoses that move a stay into a higher-paying DRG.
- **APC (Ambulatory Payment Classification):** Medicare's outpatient grouping. Unlike DRGs, one visit can get several APCs.

### Cited Findings
- "Cases are classified into MS-DRGs for payment under the IPPS based on... the principal diagnosis, up to 24 additional diagnoses, and up to 25 procedures performed during the stay. In a small number of MS-DRGs, classification is also based on the age, sex, and discharge status." The Act requires CMS to adjust DRG classifications and weights "at least annually". — [CMS MS-DRG Classifications and Software](https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/ms-drg-classifications-and-software)
- FY2027 (v44) downloads on that page:
  - [ICD-10 MS-DRG Definitions Manual Files V44 (ZIP)](https://www.cms.gov/files/zip/fy2027-fr-icd10-ms-drg-definitions-manual-files-v44.zip)
  - [HTML Definitions Manual v44](https://www.cms.gov/icd10m/FY2027-fr-v44-fullcode-cms/fullcode_cms/P0001.html)
  - [MS-DRG/MCE v44 Java jars](https://www.cms.gov/files/zip/ms-drg-mce-v44-java-jars.zip)
  - [mainframe package](https://www.cms.gov/files/zip/ms-drg-mce-v44-mainframe.zip)
  - [PC install and user guide](https://downloads.cms.gov/files/msgmce.v440.r0.pc.install.p_and_user_guide.zip)
  - [Definition of MCE v44](https://www.cms.gov/files/zip/fy2027-fr-definition-mce-v44.zip)
  - The prior mid-year version, [V43.1 effective April 1, 2026 (PDF)](https://www.cms.gov/files/document/icd-10-ms-drg-v43-1-effective-april-1-2026.pdf)

  Source: [CMS MS-DRG page](https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/ms-drg-classifications-and-software)
- The v44 definitions manual zip contains plain-text appendices (`appendix_A.txt` through `appendix_F_I.txt`) and MDC logic files (`mdcs_00_07.txt`, etc.). Appendix A "List of MS-DRGs Version 44.0" lists **768 MS-DRGs**, including 998 "Principal Diagnosis Invalid as Discharge Diagnosis" and 999 "Ungroupable". Examples: 291 Heart Failure and Shock with MCC; 637 Diabetes with MCC; 871 Septicemia or Severe Sepsis without MV >96 Hours with MCC. — computed from [definitions manual v44 zip](https://www.cms.gov/files/zip/fy2027-fr-icd10-ms-drg-definitions-manual-files-v44.zip)
- The grouper and MCE are Java. CMS announced moving to Java 17, with "Fiscal Year 2026 release... compiled with Java 17 and only the Java 17, 64-bit COBOL calling module" delivered. Requests to change MS-DRG classifications must go through **MEARIS** (https://mearis.cms.gov). — [CMS MS-DRG page](https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/ms-drg-classifications-and-software)
- The **APC/I/OCE** system "establishes groups of covered services so that the services within each group are comparable clinically and with respect to the use of resources... unlike the inpatient system that assigns a patient to a single DRG, multiple APCs can be assigned to 1 outpatient record." Hospitals bill outpatient services with HCPCS (Level I = AMA's CPT; Level II = CMS national codes). — [CMS I/OCE page](https://www.cms.gov/medicare/coding-billing/outpatient-code-editor); OPPS hub: [CMS Hospital Outpatient PPS](https://www.cms.gov/medicare/payment/prospective-payment-systems/hospital-outpatient)
- **APR-DRG:** owned by Solventum (formerly 3M HIS). States run it to pay Medicaid claims. Mississippi proposed adopting "Version 43 (V.43)" of the Solventum APR-DRG grouper effective July 1, 2026. — [Mississippi Medicaid public notice](https://medicaid.ms.gov/wp-content/uploads/2026/06/MS-SPA-26-0010-APR-DRG-Public-Notice-6.4.26.pdf). Providers are not required to buy the grouper, but many buy desktop software to check state assignments. — [MS Medicaid grouper settings](https://medicaid.ms.gov/wp-content/uploads/2025/02/MS-Medicaid-Grouper-Settings-2024-10-04.pdf); [Puerto Rico Plan Vital APR-DRG FAQ](https://docs.pr.gov/files/ASES/APR-DRG/PR%20Plan%20Vital%20APR%20DRG_%20FAQ%20rev%2002-03-2026.pdf) ("Pricing varies by hospital... dependent on volume"); [CA DHCS grouper settings FY26-27](https://www.dhcs.ca.gov/zh-tw/file/groupersettingsfy26-27a-260701-pdf/). "Use of APR-DRGs typically requires a commercial license" — [Tuva Project [secondary]](https://thetuvaproject.com/terminology/apr-drg)

### Inferences
- MS-DRG logic can be embedded for free: run the CMS Java jars, or re-implement from the plain-text definitions manual. APR-DRG cannot be reproduced without a Solventum license, so a product needing APR-DRG for Medicaid pricing must budget for it or rely on payer-returned DRGs.
- DRG versions change Oct 1 and sometimes Apr 1 (e.g. V43.1). Pick the grouper version by discharge date.

### Gaps
- I did not verify the FY2027 I/OCE quarterly version or the OPPS Addendum A/B file URLs; another researcher covering HCPCS/CPT/OPPS may have them.
- I found no public Solventum APR-DRG price list.

---

## 6. Clinical terminologies (SNOMED CT, LOINC, RxNorm): what they are, licensing, downloads, and how EHRs use them versus billing codes

### Takeaway
EHRs record clinical meaning with **SNOMED CT** (problems and findings), **LOINC** (lab tests and observations) and **RxNorm** (drugs). Claims use ICD-10-CM, CPT/HCPCS and NDC. All three are free for US use. SNOMED CT and full RxNorm require the free NLM UMLS license; LOINC requires a free Regenstrief account. NLM publishes an official **SNOMED CT→ICD-10-CM map** (over 142,000 source concepts, rule-based) to bridge the clinical side to billing.

### Plain-English terms
- **Terminology vs classification:** a terminology (SNOMED CT) gives a precise ID to each clinical idea, about 390k+ active concepts linked by relationships. A classification (ICD) groups ideas into fewer, mutually exclusive billing and statistics buckets.
- **RF2 (Release Format 2):** SNOMED's tab-delimited file format, with concept, description and relationship files.
- **RRF (Rich Release Format):** NLM's pipe-delimited format used by UMLS and RxNorm.
- **RXCUI:** RxNorm's concept ID for a drug.
- **Edition/extension:** the SNOMED International Edition plus country-specific additions. The US Edition is International plus the US Extension.

### Cited Findings
**SNOMED CT**
- Ownership: SNOMED CT was "originally created by the College of American Pathologists (CAP) and, as of April 2007, owned, maintained, and distributed by the International Health Terminology Standards Development Organisation (IHTSDO)" (now trading as SNOMED International). "The NLM is the U.S. Member of the IHTSDO and... distributes SNOMED CT at no cost." "Licensees of the UMLS Metathesaurus have free access to SNOMED CT." — [NLM SNOMED CT Licensing](https://www.nlm.nih.gov/healthit/snomedct/snomed_licensing.html)
- US Edition: "the official source of SNOMED CT for use in US healthcare systems... combines the content of both the US Extension and the International releases." The current release is **September 2026, version 20260901**, released Sept 1, 2026, with 286 new US Extension concepts, based on the July 2026 International Edition. "While the SNOMED CT International Edition has moved to monthly releases, the US Edition of SNOMED CT will remain on the current bi-annual release schedule of **March and September**." — [NLM SNOMED CT US Edition](https://www.nlm.nih.gov/healthit/snomedct/us_edition.html)
- Download URLs (UTS login required; note the `utsauth` path): `https://download.nlm.nih.gov/mlb/utsauth/USExt/SnomedCT_ManagedServiceUS_PRODUCTION_US1000124_20260901T120000Z.zip`; Transitive Closure; and `https://download.nlm.nih.gov/mlb/utsauth/ICD10CM/SNOMED_CT_to_ICD-10-CM_Resources_20260901.zip`. — [NLM SNOMED CT US Edition](https://www.nlm.nih.gov/healthit/snomedct/us_edition.html)
- Upcoming breaking change: FSN/synonym maximum length rises from 255 to **4,096 characters**. Records exceeding 255 characters first appear in the **March 2027 US Edition**, and "no further warnings regarding this change will be issued". — [NLM SNOMED CT US Edition](https://www.nlm.nih.gov/healthit/snomedct/us_edition.html)
- Size: a national edition that includes the June 2026 International Edition reports 396,147 active concepts. This is the Netherlands Edition, so it includes NL extension content. — [SNOMED Netherlands Edition release notes June 2026 [secondary for US purposes]](https://conf.spaces.snomed.org/wiki/spaces/RMT/pages/1030291500)

**SNOMED CT → ICD-10-CM map (NLM)**
- Purpose: "to support semi-automated generation of ICD-10-CM codes from clinical data encoded in SNOMED CT for reimbursement and statistical purposes." The current map is in the US Edition. Because of granularity differences, the map is "rule-based": each possible target is a "map rule", grouped into "map groups" evaluated in order using context (age, gender, co-morbidities). "Each map group will resolve to at most one ICD-10-CM code." Mapping is done by dual independent mappers with third-party adjudication. NLM's I-MAGIC demo and implementation guide show real-time use. — [NLM SNOMED CT to ICD-10-CM Map](https://www.nlm.nih.gov/research/umls/mapping_projects/snomedct_to_icd10cm.html)
- "Includes the SNOMED CT to ICD-10-CM reference set, with **over 142,000 SNOMED CT source concepts** mapped to ICD-10-CM targets." — [NLM SNOMED CT US Edition](https://www.nlm.nih.gov/healthit/snomedct/us_edition.html)

**LOINC** (loinc.org blocked direct fetching; facts below come from loinc.org search snippets)
- LOINC is published by the Regenstrief Institute. The license grants permission "in perpetuity, without payment of license fees or royalties" for commercial and non-commercial use, subject to attribution and notice terms. — [LOINC License](https://loinc.org/kb/license)
- **Version 2.83** was released Aug 19, 2026 with **112,405 total terms** and 3,080 new concepts. Version 2.82 (Feb 2026) had 109,325 total. — [LOINC Release Notes](https://loinc.org/kb/loinc-release-notes); [LOINC 2.83 Release Highlights](https://loinc.org/news/loinc-version-2-83-release-highlights)
- Downloads, SearchLOINC, RELMA and the FHIR server need a free LOINC account. The **FHIR Terminology Service** base is `https://fhir.loinc.org`, uses LOINC username and password (basic auth), and is labelled BETA (not recommended for production). — [LOINC FHIR Terminology Service](https://loinc.org/kb/api/fhir); [Create a LOINC account](https://loinc.org/join/); [LOINC Downloads](https://loinc.org/downloads). I confirmed that an unauthenticated `$lookup` on fhir.loinc.org returns a redirect (302) and does not return data.
- Example: `2345-7` = Glucose [Mass/volume] in Serum or Plasma (short name "Glucose SerPl-mCnc"), verified via [NLM Clinical Tables LOINC API](https://clinicaltables.nlm.nih.gov/api/loinc_items/v3/search?terms=2345-7&df=LOINC_NUM,text&maxList=1).

**RxNorm**
- RxNorm full monthly release is **October 5, 2026** (`RxNorm_full_10052026.zip`), with weekly updates. "RxNorm files are pipe-delimited text files in Rich Release Format (RRF)... UTF-8". A UMLS license is required for the full release, but the **"Current Prescribable Content"** subset (`RxNorm_full_prescribe_10052026.zip`) requires **no license**. Stable "current" URLs: `https://download.nlm.nih.gov/umls/kss/rxnorm/RxNorm_full_current.zip` and `.../RxNorm_weekly_current.zip`. Automated download with an API key is documented. — [NLM RxNorm Files](https://www.nlm.nih.gov/research/umls/rxnorm/docs/rxnormfiles.html); [UTS automating downloads](https://documentation.uts.nlm.nih.gov/automating-downloads.html)
- Monthly cadence: releases on 01/05, 02/02, 03/02, 04/06, 05/04, 06/01, 07/06, 08/03, 09/08 and 10/05 of 2026, typically the first Monday. — [NLM RxNorm Files](https://www.nlm.nih.gov/research/umls/rxnorm/docs/rxnormfiles.html)
- **RxNav REST API** works with no key. I tested `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=lisinopril`, which returned RXCUI `29046`, and `/REST/version.json`, which returned `{"version":"05-Oct-2026","apiVersion":"3.1.356"}`. — [RxNav rxcui endpoint](https://rxnav.nlm.nih.gov/REST/rxcui.json?name=lisinopril); [RxNav version](https://rxnav.nlm.nih.gov/REST/version.json)

### Inferences
- EHR vs billing: a clinician's problem list holds SNOMED CT concepts, lab results carry LOINC codes, and prescriptions carry RxNorm RXCUIs (pharmacy claims use NDC). The claim needs ICD-10-CM, so billing software either reads ICD-10-CM codes that the EHR already derived, or applies the NLM map. The map is rule-based and needs patient context; it is not a lookup table. A coder or clinician still has to confirm.
- SNOMED CT's 4,096-character description limit from March 2027 is a concrete schema migration item for any database that stores SNOMED descriptions in VARCHAR(255).

### Gaps
- I did not directly confirm on an NLM or SNOMED page fetched in this session that the US Edition is in RF2 format. It is standard SNOMED practice but was not verified here.
- No primary International Edition active-concept count for 2026 was found; the Netherlands Edition figure is used as a proxy.
- I did not find the exact LOINC release cadence stated by Regenstrief. The 2.82 (Feb) and 2.83 (Aug) release dates suggest twice yearly.

---

## 7. Aggregators and APIs: UMLS/UTS, VSAC (FHIR), NLM Clinical Tables, HL7 THO. Which are free APIs and which are downloads?

### Takeaway
NLM's **UMLS** combines about 195 vocabularies into one download (2026AA: 3.53M concepts) behind a free individual license. Its REST API (**UTS**) and **VSAC's FHIR API** both need a UMLS API key. NLM's **Clinical Tables Search Service** (ICD-10-CM, LOINC, HCPCS, NPI and more) and **RxNav** are **free, keyless** REST APIs suited to autocomplete and lookups, provided "as is". HL7 **THO** (terminology.hl7.org) publishes the code systems and value sets used by HL7/FHIR.

### Cited Findings
**UMLS**
- "UMLS licenses are issued only to individuals and not to groups or organizations." A UTS account is required "for access to the UMLS, terminology browsers, and related resources such as RxNorm and SNOMED CT." "There is no charge for licensing any part of the UMLS from NLM", but some source vocabularies impose their own restrictions or fees, and users must read the license before redistributing content. NLM approves license requests "within 5 business days". — [NLM: How to License and Access UMLS](https://www.nlm.nih.gov/databases/umls.html); license text: [UMLS Metathesaurus License PDF](https://uts.nlm.nih.gov/uts/assets/LicenseAgreement.pdf)
- Release **2026AA** (May 4, 2026). The full release `umls-2026AA-full.zip` is 5.3 GB compressed / 40.1 GB uncompressed and includes the Metathesaurus, Semantic Network, SPECIALIST Lexicon and MetamorphoSys. MetamorphoSys "requires a minimum of 40 GB of free hard disk and takes 2-10 hours to run". Ready-made subsets: Full Subset (5.4 GB), **Level 0 Subset** (1.9 GB, sources with no extra restrictions), and `MRCONSO.RRF` alone (492 MB). A download API is documented. — [UMLS Knowledge Sources: File Downloads](https://www.nlm.nih.gov/research/umls/licensedcontent/umlsknowledgesources.html)
- 2026AA statistics: **3,530,466 concepts**; 18,064,970 concept names (atoms); 176 source families; 195 sources contributing names; 31 languages. — [UMLS 2026AA Statistics](https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/statistics.html)
- UTS REST API: an unauthenticated call returns 401 "Missing Service Ticket or API Key", per the [UTS authentication docs](https://documentation.uts.nlm.nih.gov/rest/authentication.html) (tested `https://uts-ws.nlm.nih.gov/rest/search/current?string=diabetes`).

**VSAC (Value Set Authority Center) FHIR API**
- "A REST API service for accessing the VSAC value sets and supported code systems. This service requires a free UMLS Metathesaurus License." Authentication is HTTP Basic with username `apikey` (or blank) and your UMLS API key as the password. FHIR version 4.0.1. Base URI `https://cts.nlm.nih.gov/fhir/` (test server `https://uat-cts.nlm.nih.gov/fhir/`). Value sets are identified by **OID**, because "Value set names are not unique in VSAC". It supports `$expand`, `$validate-code`, `$lookup` and `$subsumes`, and returns at most 1,500 codes for most code systems. — [NLM VSAC FHIR API](https://www.nlm.nih.gov/vsac/support/usingvsac/vsacfhirapi.html)
- I tested `https://cts.nlm.nih.gov/fhir/metadata` (public CapabilityStatement), which returned 200. A ValueSet read without a key returned 401. — [VSAC CapabilityStatement](https://cts.nlm.nih.gov/fhir/metadata)

**NLM Clinical Tables Search Service (CTSS)**
- ICD-10-CM API base: `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search`. "This service is provided 'as is' and free of charge." Parameters: `terms` (required), `maxList` (default 7, max 500), `count`/`offset` paging with "offset + count" capped at **7,500**, `q` (Elasticsearch query string), `df`/`ef` for display and extra fields. The same data is available through FHIR `ValueSet/$expand`. — [CTSS ICD-10-CM API doc](https://clinicaltables.nlm.nih.gov/apidoc/icd10cm/v3/doc.html)
- Live test: `terms=brugada` returned `I49.81 Brugada syndrome`, a code new in FY2027, so CTSS had loaded FY2027 by Oct 21, 2026. `terms=E11.22` returned the expected title. Other live CTSS tables tested: `loinc_items`, `hcpcs` (e.g. `K0001 Standard wheelchair`) and `npi_idv`. — [CTSS ICD-10-CM search](https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=brugada); [CTSS HCPCS](https://clinicaltables.nlm.nih.gov/api/hcpcs/v3/search?terms=wheelchair)

**HL7 Terminology (THO)**
- terminology.hl7.org currently publishes "HL7 Terminology (v7.4.0: Release) based on FHIR v5.0.0". — [HL7 THO](https://terminology.hl7.org/)

**Free API vs download, summarized from the findings above**
- Keyless free APIs: CTSS (ICD-10-CM, LOINC items, HCPCS, NPI and others), RxNav/RxNorm API, CDC ICD-10-CM browser (web UI).
- Free APIs that need a UMLS API key: UTS REST, VSAC FHIR. Needs a free LOINC account: fhir.loinc.org (beta). Needs a WHO client ID and secret: ICD-11 API.
- Free downloads with no login: ICD-10-CM and PCS (CDC/CMS), MS-DRG/MCE, CMS-HCC mappings and software, HHS-HCC DIY, RxNorm Prescribable subset, NUCC taxonomy CSV (commercial use needs a license, see Section 8).
- Free downloads with a UMLS login: UMLS, SNOMED CT US Edition and its ICD-10-CM map, full RxNorm.
- Free download with a LOINC login: LOINC tables.
- Licensed for a fee: APR-DRG (Solventum), CDPS (UCSD license), AHA Coding Clinic. CPT (AMA) is outside this scope.

### Inferences
- For a billing or coding product, CTSS is fine for prototypes and UI autocomplete. But it is "as is", has no SLA, and caps results at 7,500. Production validation should load versioned CDC files locally.
- Because UMLS licenses are per individual, a company's engineering team needs each relevant person or the organization's designated licensee to manage compliance. Redistributing SNOMED or other restricted content inside a commercial product requires checking the license appendices and the annual reporting requirement mentioned on the license page.

### Gaps
- I did not fetch the UMLS release calendar to cite the twice-yearly AA (May) / AB (November) cadence directly. The naming suggests it.
- I did not test CTSS rate limits; the documentation fetched does not state any.
- I did not document THO's governance (HL7 Terminology Authority) from a primary page.

---

## 8. NUCC Health Care Provider Taxonomy and other administrative code sets (brief)

### Takeaway
The **NUCC Provider Taxonomy** is a 10-character code a provider self-selects to declare its specialty. It is used in HIPAA X12 transactions and NPI enumeration. NUCC maintains it, the AMA holds the copyright, and it updates twice a year (Jan 1 and Jul 1). The current version is **26.1 (7/1/2026)**, with 883 codes in the CSV. The CSV is downloadable, but commercial use requires a license.

### Cited Findings
- "Health Care Provider Taxonomy codes are self-selected by the provider... used to define area of specialty", not services rendered. It is "a unique alphanumeric code, ten characters in length" with three levels: Provider Grouping, Classification, Area of Specialization. It is used in ASC X12N transactions "including the transactions mandated under HIPAA" and in the NPI application. NUCC has administered it since 2001 through the NUCC Code Subcommittee. "Copyright 2026 American Medical Association." — [NUCC Provider Taxonomy](https://www.nucc.org/index.php/code-sets-mainmenu-41/provider-taxonomy-mainmenu-40)
- "Version 26.1 7/1/26"; previous versions follow a Jan 1 (x.0) / Jul 1 (x.1) pattern back to 2009. "For commercial use, including sales or licensing, a license must be obtained from this web site." — [NUCC Taxonomy CSV page](https://www.nucc.org/index.php/code-sets-mainmenu-41/provider-taxonomy-mainmenu-40/csv-mainmenu-57)
- The v26.1 CSV `nucc_taxonomy_261.csv` has columns Code, Grouping, Classification, Specialization, Definition, Notes, Display Name, Section, and **883 rows** (computed). Examples: `207Q00000X` Family Medicine; `207R00000X` Internal Medicine; `363L00000X` Nurse Practitioner. — [nucc_taxonomy_261.csv](https://www.nucc.org/images/stories/CSV/nucc_taxonomy_261.csv)
- CMS's coding-and-billing menu also lists Place of Service codes, HCPCS, I/OCE and NCCI as separate administrative and edit code sets. — [CMS ICD-10 page navigation](https://www.cms.gov/medicare/coding-billing/icd-10-codes)

### Inferences
- Taxonomy codes matter for claims routing and payer credentialing edits, such as billing-provider taxonomy on the 837. Store them versioned like other code sets, because codes get added or deactivated each Jan and Jul.

### Gaps
- I did not research other administrative code sets (Place of Service, CARC/RARC claim adjustment reason codes, NUBC revenue codes, condition/occurrence codes) in depth; they were out of scope or covered by other researchers.
- I did not retrieve NUCC's commercial license fee.
