# Payment, Coverage, and Claim-Edit Rule Sets ("Rules About Codes") and Claim/Remittance Transaction Code Sets (US, as of 2026-10-21)

Method note: Besides fetching web pages, on 2026-10-21 I downloaded and opened the live CMS files below and called the live CMS Coverage API. Findings marked **[verified by download]** or **[verified by API call]** come from those raw files or responses, not from a page summary. Sources marked **(secondary)** are vendor, trade, or third-party pages, not the publisher. Dollar figures I computed myself are labeled **(my arithmetic)**.
- RVU26D zip: https://www.cms.gov/files/zip/rvu26d.zip
- NCCI 2026 Q4 practitioner MUE table: https://www.cms.gov/files/zip/medicare-ncci-2026-q4-practitioner-services-mue-table.zip
- NCCI practitioner PTP part 4 (v323r0): https://www.cms.gov/files/zip/medicare-ncci-2026q4-practitioner-ptp-edits-ccipra-v323r0-f4.zip
- October 2026 OPPS Addendum B: https://www.cms.gov/files/zip/October-2026-OPPS-Addendum-B.zip

---

## Q1. What separates a code's DEFINITION from the RULES about it, and what do the key terms mean in plain English?

### Takeaway
A code set (CPT, HCPCS, ICD-10-CM) only says what a code means. For example, 99214 is an "office or other outpatient visit, established patient, moderate complexity, 30 minutes". Separate rule sets, mostly published by CMS and by each payer, decide:
- whether the code is payable at all (PFS status indicator, OPPS status indicator);
- what it pays (RVUs × GPCI × conversion factor, APC rates, ASP, DMEPOS fees);
- what it may not be billed with (NCCI PTP edits);
- how many units are allowed per day (MUEs);
- which primary code it needs (add-on edits);
- which diagnoses justify it (NCD, LCD, and billing-and-coding article ICD-10 lists);
- how denials are explained back (CARC/RARC codes in the 835).

Billing software has to ingest both layers, and the rule layer is versioned by date of service.

### Cited Findings

**The same code, two layers. Example: CPT 99214 in October 2026.**
- **Definition:** The PFS relative value file carries only a short descriptor, "Office o/p est mod 30 min". Full CPT descriptors are AMA-copyrighted. Every CMS file carries the notice "CPT codes and descriptions only are copyright 2026 American Medical Association" — [CMS RVU26D, PPRRVU2026_Oct_nonQPP.csv] (https://www.cms.gov/files/zip/rvu26d.zip) **[verified by download]**
- **Payment rule (physician fee schedule):** 99214 has status A (active, separately paid), work RVU 1.92, non-facility PE RVU 2.00, facility PE RVU 0.47, MP RVU 0.14, total 4.06 non-facility / 2.53 facility, global period "XXX" (global concept doesn't apply), and conversion factor 33.4009 (non-QP) — [RVU26D] (https://www.cms.gov/files/zip/rvu26d.zip) **[verified by download]**
- **Hospital (OPPS) rule:** In the OPPS Addendum B, 99214 has status indicator "B", meaning OPPS doesn't recognize it on an outpatient hospital bill type. Hospitals bill clinic visits with G0463 instead, which has SI "J2", APC 5012, and a payment rate of $136.02 — [October 2026 OPPS Addendum B] (https://www.cms.gov/files/zip/October-2026-OPPS-Addendum-B.zip) **[verified by download]**
- **Units rule (MUE):** 99214 has a practitioner MUE of 2 with MAI "3 Date of Service Edit: Clinical", rationale "Clinical: Data" — [NCCI MUE 2026 Q4 practitioner] (https://www.cms.gov/files/zip/medicare-ncci-2026-q4-practitioner-services-mue-table.zip) **[verified by download]**
- **Pairing rule (PTP):**
  - The 99214 (column 1) / 99212 (column 2) pair has an active edit effective 20201001 with no deletion date and modifier indicator 1 (a modifier may bypass it), rationale "Misuse of Column Two code with Column One code".
  - An older row for the same pair ran 20140701–20191231. The file keeps historical rows, so lookups must be filtered by date of service — [NCCI PTP practitioner v323r0 f4] (https://www.cms.gov/files/zip/medicare-ncci-2026q4-practitioner-ptp-edits-ccipra-v323r0-f4.zip) **[verified by download]**

**Glossary (plain English)**
- **NCCI (National Correct Coding Initiative):** CMS's rule tables that stop payment for code combinations or unit counts that shouldn't be billed. PTP edits "prevent inappropriate payment of services that should not be reported together" — [CMS PTP page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-procedure-procedure-ptp-edits)
- **PTP (procedure-to-procedure) edit:** A pair of codes. When both are billed for the same patient on the same date, the Column One code is paid and the Column Two code is denied, unless a clinically appropriate NCCI-associated modifier is reported — [CMS PTP page] (same URL as above)
- **Modifier:** A two-character suffix on a procedure code that changes how it is read. Examples: 26 = professional component, TC = technical component, 25/59/RT/LT used to bypass PTP edits — [CMS MLN NCCI ch. 2] (https://www.cms.gov/outreach-and-education/mln/educational-tools/mln901346-how-to-use-the-medicare-ncci/ncci-medicare/chapter_2_using_the_ncci_tools); [RVU26D README] (https://www.cms.gov/files/zip/rvu26d.zip)
- **MUE (Medically Unlikely Edit):** "The maximum units of service" reported for a HCPCS/CPT code on most appropriate claims, per patient per date of service. "Not all HCPCS/CPT codes have an MUE" — [CMS MUE page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-medically-unlikely-edits)
- **MAI (MUE Adjudication Indicator):** Says how an MUE is enforced:
  - 1 = per claim line
  - 2 = absolute per-day limit based on policy
  - 3 = per-day limit based on clinical data, which can be exceeded on appeal with documentation
  - Source: [CMS MLN NCCI ch. 2] (https://www.cms.gov/outreach-and-education/mln/educational-tools/mln901346-how-to-use-the-medicare-ncci/ncci-medicare/chapter_2_using_the_ncci_tools)
- **Add-on code (AOC):** A code that is only payable when a specific primary procedure is paid to the same practitioner, for the same patient, on the same date — [CMS AOC page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-add-code-edits)
- **RVU (relative value unit):** A unitless score for a service. There are three parts:
  - work (clinician effort)
  - practice expense (PE; non-facility vs facility)
  - malpractice (MP)
  - Each part is multiplied by a GPCI, then the sum by a dollar conversion factor — [RVU26D README] (https://www.cms.gov/files/zip/rvu26d.zip)
- **GPCI (geographic practice cost index):** A locality multiplier for each RVU component. Example: Manhattan PW 1.064 / PE 1.162 / MP 1.586 vs Alabama 1.000 / 0.875 / 0.566 — [GPCI2026.csv in RVU26D] (https://www.cms.gov/files/zip/rvu26d.zip) **[verified by download]**
- **Conversion factor (CF):** Dollars per RVU. For 2026 the file carries 33.4009 (non-qualifying-APM) and 33.5675 (qualifying APM participant, "QP") — [PPRRVU2026_Oct nonQPP / QPP] (https://www.cms.gov/files/zip/rvu26d.zip) **[verified by download]**
- **Global period:** The number of days of routine follow-up bundled into a surgery's payment. Values:
  - 000 = endoscopic/minor, same day
  - 010 = minor, 10 days
  - 090 = major, 1-day pre-op + 90 days post
  - MMM = maternity
  - XXX = not applicable
  - YYY = carrier decides
  - ZZZ = add-on included in another code's global
  - Source: [RVU26D README] (https://www.cms.gov/files/zip/rvu26d.zip)
- **PC/TC:** Professional component (the physician's interpretation, modifier 26) vs technical component (equipment and staff, modifier TC) of diagnostic tests — [RVU26D README] (same)
- **NCD / LCD / Billing & Coding Article:** Coverage rules (whether Medicare pays for a service, and for which conditions).
  - NCDs are national.
  - LCDs are written by individual MACs (regional Medicare contractors).
  - Billing & Coding Articles hold the code lists, including ICD-10 codes that "support medical necessity".
  - Source: [CMS Coverage API spec] (https://api.coverage.cms.gov/docs/v1/coverage-api.json) **[verified by API call]**
- **MAC (Medicare Administrative Contractor):** A private company that processes Medicare claims for a region. Example: the same topic, "Billing and Coding: Vitamin D Assay Testing", exists as separate articles from CGS (A56798), Wellpoint Federal (A57736), WPS (A57484), Noridian (A57718), First Coast (A56841), and Palmetto (A59170) — [Coverage API /v1/reports/local-coverage-articles/] (https://api.coverage.cms.gov/v1/reports/local-coverage-articles/) **[verified by API call]**
- **APC / OPPS status indicator (SI):** Hospital outpatient payment groups (APC = Ambulatory Payment Classification). The SI tells whether and how a code is paid, e.g., packaged vs separately paid — [OPPS Addendum B] (https://www.cms.gov/files/zip/October-2026-OPPS-Addendum-B.zip)
- **CARC / RARC:** Codes in the electronic remittance (835) that explain why a payment differs from the billed charge (CARC), with extra explanation from remark codes (RARC). Example: CARC 97 = "benefit for this service is included in the payment/allowance for another service/procedure" (a bundling denial) — [X12 CARC list] (https://x12.org/codes/claim-adjustment-reason-codes)
- **Group code:** Assigns financial responsibility for an adjustment: CO (contractual obligation), PR (patient responsibility), OA (other adjustment), PI (payer-initiated), and CR (corrections; not for 005010 and later) — [X12 CARC list] (same)

### Inferences
- A code-set database alone can't answer "will this get paid?" The rule layer needs its own data model, keyed by (code, modifier, payer/MAC/locality, setting = professional vs hospital outpatient vs DME, date of service).
- The 99214 example shows the setting split well. The same CPT code is payable for a physician but status "B" for a hospital outpatient bill, where G0463 is used instead. Software must branch by claim type (837P vs 837I).

### Gaps
- I didn't retrieve the AMA's own CPT 99214 long descriptor. It's licensed content and outside this scope.

---

## Q2. Medicare NCCI (PTP, MUE, add-on edits, Policy Manual, Medicaid NCCI): structure, cadence, location, format, cost, gotchas

### Takeaway
CMS publishes NCCI free as quarterly ZIPs (effective Jan 1, Apr 1, Jul 1, Oct 1, usually posted about a month ahead) on predictable cms.gov/files/zip URLs, containing tab-delimited TXT + XLSX (PTP) or CSV + XLSX (MUE).

The files are split three ways:
- PTP: practitioner vs hospital outpatient (no Medicare DME PTP file).
- MUE: practitioner, outpatient hospital, and DME supplier.
- Medicaid NCCI: a parallel set; its public copy can't be used by states for adjudication.

The download links route through an AMA CPT license click-through. The Policy Manual (the rationale text) updates annually on Jan 1.

### Cited Findings

**PTP edits: files, versions, and sizes**
- The page offers practitioner PTP and hospital (OPPS) PTP files, four ZIPs each per quarter, split by code range. No Medicare DME PTP files are listed — [CMS PTP page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-procedure-procedure-ptp-edits)
- Current version is 2026 Q4, v323r0, effective Oct 1, 2026, posted Sept 2, 2026. The prior version is 2026 Q3 v322r0, effective July 1, 2026, posted June 1, 2026. No 2027 Q1 files were posted as of the fetch — [CMS PTP page] (same)
- Record counts for 2026 Q4 (my arithmetic from page figures):
  - Practitioner f1–f4: 675,157 / 674,914 / 675,035 / 612,539, about 2.64 million rows total.
  - Hospital f1–f4: 475,042 / 474,962 / 475,041 / 443,837, about 1.87 million rows — [CMS PTP page] (same)
- File naming pattern, e.g., `medicare-ncci-2026q4-practitioner-ptp-edits-ccipra-v323r0-f4.zip` (practitioner = "ccipra", hospital = "ccioph") — [CMS PTP page] (same)

**PTP edits: row layout**
- **[verified by download]** The f4 ZIP contains `ccipra-v323r0-f4.txt` (tab-delimited, 44 MB) and `ccipra-v323r0-f4.xlsx` (17 MB). Header columns:
  - Column 1
  - Column 2
  - "*=in existence prior to 1996"
  - Effective Date (YYYYMMDD)
  - Deletion Date ("*=no data")
  - Modifier ("0=not allowed, 1=allowed, 9=not applicable")
  - PTP Edit Rationale
- Example row: `64483	77003		20110101	*	1	HCPCS/CPT procedure code definition`
- Modifier indicator distribution in f4: 0 = 167,807; 1 = 379,184; 9 = 65,548 — [practitioner PTP f4] (https://www.cms.gov/files/zip/medicare-ncci-2026q4-practitioner-ptp-edits-ccipra-v323r0-f4.zip)
- Modifier indicator meanings (CMS MLN): "0 (Not Allowed)… only the Column 1 code is paid"; "1 (Allowed)… You can use NCCI-associated modifiers with this PTP code pair when appropriate"; "9 (Not Applicable)… There is no active edit for this PTP code pair" — [CMS MLN NCCI ch. 2] (https://www.cms.gov/outreach-and-education/mln/educational-tools/mln901346-how-to-use-the-medicare-ncci/ncci-medicare/chapter_2_using_the_ncci_tools)
- How sources describe "9": Medicaid NCCI guidance calls it "the edit has been deleted". Palmetto GBA (a MAC, secondary to CMS) frames it as "no longer bundled and no modifier is needed" — [CMS Medicaid NCCI MLN ch. 2] (https://www.cms.gov/outreach-and-education/mln/educational-tools/mln9018659-how-to-use-the-medicaid-ncci/ncci-medicaid/chapter-2_using-the-medicaid-ncci-tools/); [Palmetto GBA] (https://palmettogba.com/jmb/admin/tools/ncci)

**MUEs: files, layout, and enforcement**
- Three tables per quarter: Practitioner Services, Facility Outpatient Hospital Services, and DME Supplier Services. 2026 Q4 tables are effective Oct 1, 2026, posted Sept 1, 2026. Separate "quarterly additions, deletions, and revisions" ZIPs are also posted — [CMS MUE page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-medically-unlikely-edits)
- Not all values are public: "Although CMS publishes most MUE values on its website, other MUE values are confidential… Confidential MUE values are not releasable… The confidential status of MUEs is subject to change" — [CMS MUE page] (same)
- **[verified by download]** The practitioner MUE ZIP holds `MCR_MUE_PractitionerServices_Eff_10-01-2026.csv` + `.xlsx`. Columns: "HCPCS/CPT Code, Practitioner Services MUE Values, MUE Adjudication Indicator, MUE Rationale". Example rows:
  - `27447,1,2 Date of Service Edit: Policy,CMS Policy`
  - `J9271,400,3 Date of Service Edit: Clinical,Prescribing Information`
  - `82306,1,2 Date of Service Edit: Policy,Code Descriptor / CPT Instruction`
- MAI counts in the practitioner file: MAI 1 = 41, MAI 2 = 5,493, MAI 3 = 9,678 — [practitioner MUE table] (https://www.cms.gov/files/zip/medicare-ncci-2026-q4-practitioner-services-mue-table.zip)
- MAI definitions:
  - "MAI 1 indicates a value adjudicated by claims processing systems at the claim line level."
  - MAI 2 = absolute date-of-service edit based on "policy, such as anatomic considerations".
  - "MAI 3 indicates a value adjudicated by claims processing systems at the date of service level". MACs may pay above it on appeal with documentation.
  - Source: [CMS MLN NCCI ch. 2] (https://www.cms.gov/outreach-and-education/mln/educational-tools/mln901346-how-to-use-the-medicare-ncci/ncci-medicare/chapter_2_using_the_ncci_tools)
- Secondary sources add that MAI 2 cannot be bypassed with a modifier or appealed — [AAOS resident guide (secondary)] (https://www.aaos.org/globalassets/quality-and-practice-resources/coding-and-reimbursement/resident-guide/resident-guide-coding-reference-tools_what-is-ncci-mue_050125.pdf)

**Add-on code (AOC) edits**
- Type 1 = the CR lists identifiable primary codes, and contractors must ensure the AOC is "never paid" unless a listed primary is paid. Type 2 = no primary list given (contractors build their own). Type 3 = some primaries listed but "not exclusive" — [CMS AOC page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-add-code-edits)
- Format: since Q2 2026 the AOC file is fixed-width text plus an Excel version in one ZIP. Latest is "Add-On Code Edits for Medicare Effective 10012026", posted Sept 1, 2026.
- Cadence: quarterly updates possible Apr 1, Jul 1, Oct 1; annual "on or by Jan. 1". Files are complete replacements, and "If there are no changes… there is no quarterly update" — [CMS AOC page] (same)

**NCCI Policy Manual**
- The 2026 Medicare NCCI Policy Manual is "Effective Jan. 1, 2026", posted Dec. 24, 2025, and updated "once a year". Revisions are shown in red. It comes as a full PDF plus 13 chapter PDFs (Ch. 1 General Correct Coding Policies; Ch. 2–13 by CPT/HCPCS range, e.g., Ch. 11 Medicine/E&M 90000–99999, Ch. 12 HCPCS Level II, Ch. 13 Category III). Archives go back to 2015 — [CMS NCCI Policy Manual page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-policy-manual)

**Versioning guidance and CPT license**
- CMS says to replace the tables quarterly and use the current version, and to check the "Quarterly PTP and MUE Version Update Changes" page for current files — [CMS MLN NCCI ch. 2] (https://www.cms.gov/outreach-and-education/mln/educational-tools/mln901346-how-to-use-the-medicare-ncci/ncci-medicare/chapter_2_using_the_ncci_tools)
- Download links on the PTP page route through `/license/ama?file=...`, an AMA CPT license acceptance step — [CMS PTP page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-procedure-procedure-ptp-edits)
- **[verified by download]** A plain HTTPS GET to `https://www.cms.gov/files/zip/<filename>.zip` returned the ZIP directly (HTTP 200, application/zip) with no click-through. The files themselves embed "CPT only copyright 2025 American Medical Association. All rights reserved." The click-through is a web UI step; the legal license terms still apply.

**Page quality issues**
- The PTP page's announcement entries carry title attributes reading "Medicare NCCI 2025Q2", and the AOC page shows "Page Last Modified 09/10/2024" despite listing 2026 files. Page metadata is not a reliable change signal — [CMS PTP page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-procedure-procedure-ptp-edits); [CMS AOC page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-add-code-edits)

**Medicaid NCCI**
- Files are posted quarterly and replace the prior quarter. 2026 Q4 was posted Sept 1, 2026 (change report effective Oct 1, 2026). There are six files: PTP and MUE, each for Practitioner, Outpatient Hospital, and DME. Unlike Medicare, Medicaid has a DME PTP file. Each ZIP holds text + Excel — [CMS Medicaid NCCI Edit Files] (https://www.cms.gov/medicare-medicaid-coordination/national-correct-coding-initiative-ncci/ncci-medicaid/medicaid-ncci-edit-files)
- "States cannot use the files posted here for processing and paying Medicaid claims". States get operational edits from RISSNET. Presence in an edit "doesn't necessarily indicate that the code is covered by any or all state Medicaid programs" — [CMS Medicaid NCCI Edit Files] (same)
- A separate 2026 Medicaid NCCI Policy Manual and a Technical Guidance Manual (dated 02/28/2026) exist — [2026 Medicaid NCCI Policy Manual intro (search result)] (https://www.cms.gov/files/document/2026-medicaid-ncci-introduction-policy-manual.pdf); [2026 Medicaid NCCI Technical Guidance Manual (search result)] (https://www.cms.gov/files/document/2026-medicaid-ncci-technical-guidance-manual-02282026.pdf)

### Inferences
- Effective/deletion dates are inside each PTP row, and quarterly files keep historical rows. A single current PTP file therefore answers "was this pair edited on date X" for past dates of service, as long as the row hasn't been physically removed. Because "9" rows can appear with a deletion date, software should evaluate (effective ≤ DOS ≤ deletion) together with the indicator, not the indicator alone.
- MUE files carry no per-row effective dates (only the file-level "Eff_10-01-2026" in the filename). To adjudicate by date of service, software has to archive every quarter's MUE table (CMS keeps an MUE archive).
- 2027: following the observed pattern (Q3 posted June 1, Q4 posted Sept 1–2), the 2027 Q1 files are likely to post around Dec 1, 2026, effective Jan 1, 2027, alongside a 2027 Policy Manual. That is an inference from cadence, not a published date.

### Gaps
- I didn't fetch the AOC "file structure document (PDF)", so the exact AOC column layout isn't confirmed.
- I couldn't confirm whether the NCCI quarterly correction files ("r1"/"r2" revisions within a quarter, e.g., v323r1) were posted for Q4 2026. The naming convention "r0" implies revisions are possible.
- I didn't verify the exact AMA license text behind `/license/ama`.

---

## Q3. Medicare Physician Fee Schedule (PFS) RVU files: structure, indicators, cadence, tools/APIs

### Takeaway
The quarterly RVU ZIPs (RVU26A Jan, RVU26B Apr, RVU26C Jul, RVU26D Oct 2026) are the canonical machine-readable PFS rule set. Each contains:
- PPRRVU (one row per code + modifier, with RVUs and about 20 policy-indicator columns), as CSV/TXT/XLSX;
- GPCI;
- the locality-to-county crosswalk;
- anesthesia conversion factors;
- the OPPS imaging cap file;
- a PDF/DOCX record layout.

They're free and directly downloadable. The PFS Look-Up Tool is a web UI with no documented API. For 2027, the proposed CFs are $33.1693 (QP) and $32.8409 (non-QP); the final rule is expected in early November 2026.

### Cited Findings

**Releases and file inventory**
- RVU26A, RVU26B, RVU26C, and RVU26D are posted for 2026, with archives back to 2003. RVU27 wasn't posted as of the fetch — [CMS PFS Relative Value Files] (https://www.cms.gov/medicare/payment/fee-schedules/physician/pfs-relative-value-files)
- RVU26D is the "Physician Fee Schedule - October 2026 release", "Updated 08/26/2026", 6 MB. It has "-QP" and "-nonQP" files because "a differential conversion factor applies when services are furnished by an eligible clinician" who is a Qualifying APM Participant — [CMS RVU26D page] (https://www.cms.gov/medicare/payment/fee-schedules/physician/pfs-relative-value-files/rvu26d)
- **[verified by download]** RVU26D.zip contains:
  - `PPRRVU2026_Oct_nonQPP` and `PPRRVU2026_Oct_QPP` (each .csv/.txt/.xlsx)
  - `GPCI2026` (.csv/.txt/.xlsx)
  - `26LOCCO` (locality-county)
  - `ANES2026` (anesthesia CF by locality)
  - `OPPSCAP_Oct` (OPPS-capped payment amounts by carrier/locality)
  - `RVU26D.pdf` (documentation)
  - The PPRRVU header says "RELEASED 08/26/2026".
  - Source: [rvu26d.zip] (https://www.cms.gov/files/zip/rvu26d.zip)

**Cadence, record layout, and payment formula**
- Cadence per README: "Updated 2026 files will be available on April 1, July 1 and October 1". Naming is RVU26A (Jan), RVU26AR (Jan correction "If Required"), RVU26B (Apr), RVU26C (Jul), and D (Oct). Initial source is the November 2025 Federal Register PFS final rule — [RVU26D.pdf README] (https://www.cms.gov/files/zip/rvu26d.zip)
- Record layout per README: "one record for each unique combination of procedure code and modifier", 200-character fixed-width TXT. Fields include Status Code (pos 58), Non-Facility NA Indicator, Facility NA Indicator, PC/TC Indicator (pos 103), Global Surgery (104–106), Pre/Intra/Post-op percentages, Multiple Procedure (Modifier 51), Bilateral Surgery (pos 117), Assistant at Surgery (118), Co-surgeons (119), Team Surgery (120), Pricing Indicator (121), Endoscopic Base Code (128–132), Conversion Factor (133–140), Physician Supervision of Diagnostic Procedures, Diagnostic Imaging Family Indicator, and OPPS-capped PE/MP amounts — [RVU26D README] (same)
- Payment formula: "Non-Facility Pricing Amount = [(Work RVU × Work GPCI) + (Non-Facility PE RVU × PE GPCI) + (MP RVU × MP GPCI)] × Conversion Factor". Facility pricing uses the facility PE RVU. The imaging technical component is capped at the OPPS amount, with the lower amount used.
- Limiting charge: the README states "multiply the fee schedule amount by a factor of 1.0925" for nonparticipating physicians — [RVU26D README] (same)
- Worked example **(my arithmetic)** from the verified rows, before any MAC-level adjustments such as sequestration:
  - 99214 national non-facility = 4.06 × 33.4009 = $135.61; facility = 2.53 × 33.4009 = $84.50.
  - Manhattan non-facility = (1.92×1.064 + 2.00×1.162 + 0.14×1.586) × 33.4009 = $153.27.
  - Alabama = $125.23.
  - Source rows: [RVU26D] (https://www.cms.gov/files/zip/rvu26d.zip)

**How the indicator fields drive billing rules (from the README)**
- **Status code:**
  - A = Active, paid separately ("does not mean that Medicare has made a national decision regarding coverage")
  - B = Bundled
  - C = Contractor-priced
  - E = Excluded by regulation
  - G / I = Not valid for Medicare purposes; Medicare uses another code (G has a 90-day grace period, I does not)
  - J = Anesthesia
  - M = Measurement
  - N = Non-covered
  - P = Bundled/excluded
  - R = Restricted coverage
  - T = Injections
  - Source: [RVU26D README] (https://www.cms.gov/files/zip/rvu26d.zip). Note that a status "I" row appears in the file for 0001F **[verified by download]**.
- **Multiple procedure (mod 51):**
  - 0 = no reduction
  - 2 = standard: rank by fee, pay 100%/50%/50%/50%/50%, then by report
  - 3 = special endoscopy family rules (uses Endobase)
  - 4 = diagnostic imaging family reductions
  - 9 = N/A
  - Source: [RVU26D README] (same)
- **Bilateral (mod 50):** 0 = 150% adjustment doesn't apply; 1 = 150% applies; 2 = already priced as bilateral (RVUs based on bilateral); 3 = each side paid at 100%; 9 = N/A — [RVU26D README] (same)
- **Assistant at surgery:** 0 = paid only with documentation; 1 = statutory restriction, "may not be paid"; 2 = may be paid; 9 = N/A — [RVU26D README] (same)
- **Co-surgeons (mod 62) and team surgery (mod 66):** 0 = not permitted; 1 = with documentation; 2 = permitted — [RVU26D README] (same)
- **PC/TC:** 0 = physician service; 1 = diagnostic test with PC/TC split; 2 = professional-only code (e.g., 93010); 3 = technical-only; 4 = global-only; 5 = incident-to; 6 = lab physician interpretation; 7 = PT service not payable; 8 = physician interpretation codes; 9 = N/A — [RVU26D README] (same)
- **Example of indicators in use** **[verified by download]**:
  - 27447 (total knee) has global 090, mult proc 2, bilateral 1, assistant 2, co-surgeon 1, team 0.
  - 71046 has PC/TC indicator 1, with separate "26" and "TC" rows.
  - G2211 (complex E/M add-on) has global "ZZZ".
  - Source: [PPRRVU2026_Oct_nonQPP.csv] (https://www.cms.gov/files/zip/rvu26d.zip)

**PFS Look-Up Tool**
- Shows pricing, RVUs, and payment policies for more than 10,000 services by code, range, or list, national or by MAC/locality, plus policy checks (assistant at surgery, modifiers, supervision). It "doesn't display MAC priced codes or Medicare Part B non-payable codes". Disclaimer: "For the official and definitive CMS PFS payment files, contact your MAC." The page mentions no API — [CMS PFS Look-Up Tool overview] (https://www.cms.gov/medicare/physician-fee-schedule/search/overview)

**2027 proposed rule**
- Proposed CY 2027 CFs are $33.1693 (QP, −1.19%) and $32.8409 (non-QP, −1.68%), mainly because the one-year 2.5% 2026 statutory bump expires. Released July 14, 2026; comments due Sept 14, 2026; final rule expected early November — [Ventra Health (secondary)] (https://ventrahealth.com/blog/cms-releases-cy-2027-medicare-physician-fee-schedule-proposed-rule/); [ASIPP fact sheet (secondary)] (https://asipp.org/fact-sheet-2027-medicare-physician-fee-schedule-proposed-rule/); [LeadingAge (secondary)] (https://leadingage.org/cy27-physician-fee-schedule-proposed-rule-includes-payment-cuts-and-major-medicare-policy-changes/)

### Inferences
- The 2026 file CF of 33.4009 (non-QP) compared with the 2027 proposed 32.8409 matches the secondary sources' "-1.68%" (33.4009 × 0.9832 ≈ 32.84). That cross-check supports the secondary figures.
- RVU27A should appear with the CY 2027 final rule (expected November 2026) for January 1, 2027 dates of service, possibly followed by an "RVU27AR" correction. Software should key PFS data by (year, release letter) and by date of service.
- The README's naming oddity matters for scrapers. RVU26D's description says "October 2026 release", the file was "Updated 08/26/2026", and the README lists RVU26A as six files while RVU26D actually ships about 19 files (CSV/TXT/XLSX variants plus QPP/nonQPP). Don't hard-code file lists.

### Gaps
- I didn't confirm a formal CMS PFS API. The PFS Look-Up Tool page lists none; any data.cms.gov dataset wasn't checked.
- The National Payment Amount File and MAC-specific fee schedule files (MACs publish locality fee schedules) weren't examined.
- The CY 2027 PFS final rule wasn't yet released as of the fetches, so final 2027 CFs are unknown.

---

## Q4. Medicare coverage policies (NCDs, LCDs, Billing & Coding Articles): Medicare Coverage Database (MCD) downloads and Coverage API

### Takeaway
Coverage rules (which diagnoses justify a service) live in the CMS Medicare Coverage Database. It has two machine paths:
1. Weekly ZIP downloads (MS Access .MDB + CSV with embedded HTML, refreshed Thursdays). These require accepting AMA CPT, ADA CDT, and AHA UB-04 license terms.
2. A free JSON REST API at api.coverage.cms.gov. It needs no API key, but a one-hour "license token" (from accepting the same terms via an endpoint) is required for LCD/Article endpoints.

LCDs and articles differ by MAC jurisdiction, so the same service can have six different covered-ICD-10 lists.

### Cited Findings

**MCD downloads**
- Six datasets, each a ZIP: Current LCD (~40 MB), Current+Retired LCD (~40 MB), Current Article (~50 MB), Current+Retired Article (~55 MB), Current NCD (~2 MB), and Download All (~185 MB). "Data as of" 10/11/2026, released 10/15/2026.
- Formats: each ZIP includes MDB and CSV, a Read Me, and a Data Dictionary. "Microsoft Access files (.MDB) are the recommended format. CSV files contain raw data and embedded HTML."
- Cadence: "Datasets are updated weekly on Thursdays." LCD datasets hold only the latest version of each document; older versions are in the MCD Archive.
- Source: [CMS MCD Downloads] (https://www.cms.gov/medicare-coverage-database/downloads/downloads.aspx)
- License gate for downloads: AMA CPT ("for your personal use only"; other uses require an AMA license), ADA CDT (which prohibits "distributing to commercial third-parties outputs in which the CDT is embedded… includ[ing] Artificial Intelligence outputs"), and AHA NUBC UB-04 (internal use only) — [CMS MCD Downloads] (same)

**Coverage API: access**
- "Anyone can access the Coverage API, and without an API key" (no key needed since Feb 8, 2024). The throttle limit is 10,000 requests per second, responses are JSON only, and Swagger docs are at /docs/swagger/index.html — [CMS Coverage API] (https://api.coverage.cms.gov/)
- License token: "Generates a new token, valid for one hour, that grants access to endpoints requiring acceptance of the AMA, ADA, and AHA license agreements. The token must be included in requests as a Bearer token" — [Coverage API OpenAPI spec v1.6] (https://api.coverage.cms.gov/docs/v1/coverage-api.json) **[verified by API call]**
- **[verified by API call]** Calling `/v1/data/article/icd10-covered` without the token returned status 401 "UNAUTHORIZED – the request did not include a valid authentication token". After `GET /v1/metadata/license-agreement/`, which returned a 36-character token, the same call succeeded — [Coverage API] (https://api.coverage.cms.gov/v1/metadata/license-agreement/)

**Coverage API: endpoints (OpenAPI spec titled "Coverage API 1.6")**
- **Reports (no token):** `/v1/reports/local-coverage-final-lcds/`, `/v1/reports/local-coverage-proposed-lcds/`, `/v1/reports/local-coverage-articles/`, `/v1/reports/local-coverage-sad-exclusion-list/`, `/v1/reports/whats-new/local/`, `/v1/reports/whats-new/national/`, `/v1/reports/national-coverage-ncd/`, and others.
- **LCD data (token):** `/v1/data/lcd/`, `/v1/data/lcd/hcpc-code`, `/v1/data/lcd/revision-history`, `/v1/data/lcd/related-documents`, and others.
- **Article data (token):** `/v1/data/article/icd10-covered`, `icd10-covered-group`, `icd10-noncovered`, `hcpc-code`, `hcpc-modifier`, `revenue-code`, `bill-codes`, `icd10-pcs-code`, `revision-history`, and others.
- **NCD/NCA/CAL data:** `/v1/data/ncd/`, `/v1/data/ncd/other-versions/`, and others.
- **Metadata:** `/v1/metadata/update-period/`, `/v1/metadata/local-data-schedule/`, `/v1/metadata/license-agreement/`.
- Source: [Coverage API OpenAPI spec] (https://api.coverage.cms.gov/docs/v1/coverage-api.json) **[verified by download]**
- Release history: Release 1.5 (June 17, 2025) added the Local Coverage Article endpoints, and 1.4 added the SAD exclusion list — [Coverage API release notes] (https://api.coverage.cms.gov/docs/release_notes)

**Coverage API: sample responses** **[verified by API call]**
- `/v1/metadata/update-period/` returns weekly periods, e.g., `{"period_id":1222,"begin_date":"20261005","end_date":"20261012"}`. This confirms the weekly local data refresh — [Coverage API] (https://api.coverage.cms.gov/v1/metadata/update-period/)
- `/v1/data/article/icd10-covered?articleid=56798&ver=29` (CGS, "Billing and Coding: Vitamin D Assay Testing"). Fields: article_id, article_version, icd10_code_id, icd10_code_version, icd10_covered_group, range, sort_order, description, asterisk, last_updated. Example row: `{"article_id":56798,"article_version":29,"icd10_code_id":"E20.0","icd10_covered_group":1,"description":"Idiopathic hypoparathyroidism","last_updated":"07/27/2026"}`. Pagination is via `next_token`. The paired `/hcpc-code` call returns 82306 "VITAMIN D; 25 HYDROXY, INCLUDES FRACTION(S), IF PERFORMED" — [MCD article A56798] (https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=56798&ver=29)
- `/v1/reports/local-coverage-final-lcds/` rows include document_display_id (e.g., "L36089"), document_version, contractor_name_type, effective_date, retirement_date, and note ("Retired"). Example: L36089 (Palmetto MolDX) was retired 10/11/2026 — [Coverage API report] (https://api.coverage.cms.gov/v1/reports/local-coverage-final-lcds/)
- The articles report returned 2,148 rows, with six separate MAC articles titled "Billing and Coding: Vitamin D Assay Testing" or similar, each with a different effective date (e.g., CGS 08/06/2026, Wellpoint 04/01/2026, WPS 10/01/2024, Noridian 08/14/2025) — [Coverage API report] (https://api.coverage.cms.gov/v1/reports/local-coverage-articles/)

**Lab NCDs**
- National lab NCD code lists (e.g., NCD 190.20 Blood Glucose Testing) are distributed as quarterly coding spreadsheets via change requests. CMS states coding updates contain "No policy-related changes". A CR for the January 2027 lab edit module adds ICD-10-CM codes to NCD 190.20A/B, effective Oct 1, 2026, with the spreadsheet at cms.gov/files/zip/January-2027.zip — [CMS transmittal R13952CP (from search summary, not opened)] (https://www.cms.gov/files/document/r13952cp.pdf)

### Inferences
- For claim scrubbing, Billing & Coding Articles (not LCDs) are the machine-useful layer. They carry the CPT/HCPCS list, the covered and non-covered ICD-10 lists, and the "groups" logic (e.g., ICD-10 group 1 must pair with HCPCS group 1). The `*-group` paragraph endpoints hold the human-readable pairing rules that the code lists alone don't express.
- To pick the right article, software must map provider → MAC jurisdiction (via contractor/state endpoints) → article version effective on the date of service. The weekly cadence and retroactive "effective_date" values (e.g., an article updated 07/27/2026 effective 08/06/2026, another updated 02/11/2026 effective 10/01/2024) mean a weekly sync is needed. Version history must also be retained.
- The ADA CDT clause banning AI outputs embedding CDT is a notable constraint for AI-based coding products that use MCD data.

### Gaps
- I didn't open the MCD Data Dictionary PDFs, so the MDB/CSV table names aren't listed here.
- I didn't verify the NCD manual (IOM 100-03) to NCD-dataset mapping in detail.

---

## Q5. Other Medicare payment-system files relevant to outpatient: OPPS addenda, CLIA waived list (QW), ASP drug pricing, DMEPOS fee schedule, and IOM manuals

### Takeaway
Each Medicare payment system ships its own quarterly rule files, all free on cms.gov:
- **OPPS Addendum A/B** (APC and status indicator per HCPCS; XLSX + TXT; AMA license routing).
- **ASP "Payment Limit Files"** and the NDC-HCPCS crosswalk (quarterly ZIPs, frequently revised retroactively).
- **DMEPOS fee schedule** (quarterly, DME26-A to D).
- **CLIA waived-test list** (delivered via quarterly change requests; QW modifier).

The IOM manuals (100-02 Benefit Policy, 100-04 Claims Processing, and others) are the narrative rule text. They change via numbered transmittals/change requests.

### Cited Findings

**OPPS Addendum A/B**
- Addenda A and B are a quarterly "snapshot" of HCPCS codes, status indicators, APC groups, and OPPS payment rates, updated in January, April, July, and October. The latest is October 2026, "Updated 10/15/2026"; July 2026 was updated July 21, 2026. Addendum Q is also posted, and an RSS feed is available — [CMS OPPS Addendum A and B Updates] (https://www.cms.gov/medicare/payment/prospective-payment-systems/hospital-outpatient/addendum-a-b-updates)
- The October 2026 Addendum B ZIP is `October-2026-OPPS-Addendum-B.zip`, routed via `/apps/ama/license.asp` — [CMS Oct 2026 Addendum B page] (https://www.cms.gov/medicare/payment/prospective-payment-systems/hospital-outpatient-pps/quarterly-addenda-updates/october-2026-addendum-b)
- **[verified by download]** The ZIP contains `2026_October_Web_Addendum_B.10.14.26.xlsx` and a 508-compliant tab-delimited `.txt`. Columns:
  - HCPCS Code
  - Short Descriptor
  - SI
  - APC
  - Relative Weight
  - Payment Rate
  - National Unadjusted Copayment
  - Minimum Unadjusted Copayment
  - IRA Coinsurance Percentage
  - Adjusted Beneficiary Copayment
  - Drug and Device Pass-Through Expiration during Calendar Year
  - Note
  - "* Indicates a Change"
- Example rows:
  - `27447 Total knee arthroplasty J1 5115 143.4859 $13,116.76 … "Copayments capped at inpatient deductible of $1,736.00."`
  - `71046 X-ray exam chest 2 views Q3 5521 0.9726 $88.91`
  - `J9271 Inj pembrolizumab K 1490 $62.253 … *`
  - `36415 … Q4`
  - `99214 … B`
- The file header warns: "The existence or absence of a HCPCS code does not mean that an item or service is covered or non-covered". It lists SIs subject to the 340B remedy offset ratio 0.9951: "J1, J2, P, Q1, Q2, Q3, R, S, S1, T, U, V" — [Oct 2026 Addendum B] (https://www.cms.gov/files/zip/October-2026-OPPS-Addendum-B.zip)
- SI definitions are in Addendum D1 of each annual OPPS rule ("Addendum D1.— OPPS Payment Status Indicators for CY 2026") — [CMS CY 2026 OPPS final rule addenda table of contents (search result)] (https://www.cms.gov/files/document/2026-nfrm-opps-addenda-table-contents.pdf)
- Common meanings from MAC/older CMS addenda: N = packaged into the APC payment; S = significant procedure, not discounted when multiple; T = significant procedure, multiple-procedure reduction applies; V = clinic/ED visit; Q1–Q4 = conditionally packaged. A secondary study guide says CY 2026 added S1 for separately paid sheet-form skin substitutes (unverified) — [FCSO (MAC) OPPS addenda page] (https://medicare.fcso.com/claims/institutional-billing-resources-addendums-b-d1-and-e); [CMS 2005 AddD1 (historical)] (https://www.cms.gov/Medicare/Medicare-Fee-for-Service-Payment/HospitalOutpatientPPS/Downloads/CMS-1404-P_AddD1.pdf)

**CLIA waived tests (QW modifier)**
- CMS edits lab claims against the lab's CLIA certificate level. Newly waived tests "must have the modifier QW to be recognized as a waived test". The most recent CR found was CR 14273 (two new waived tests effective Jan 1, 2026) — [CMS MLN MM14273] (https://www.cms.gov/files/document/mm14273-new-waived-tests.pdf)
- Some codes don't need QW: 81002, 81025, 82270, 82272, 82962, 83026, 84830, 85013, 85651 — [CMS MLN MM10958] (https://www.cms.gov/outreach-and-education/medicare-learning-network-mln/mlnmattersarticles/downloads/mm10958.pdf)
- The waived list is distributed to contractors quarterly via Recurring Update Notifications. Older lists were attachments titled "Tests Granted Waived Status Under CLIA" — [CMS transmittal R642CP (historical)] (https://cms.gov/regulations-and-guidance/guidance/transmittals/downloads/r642cp.pdf)

**ASP drug pricing**
- Quarterly. The 2026 files are relabeled "Medicare Part B Payment Limit Files" (2025 used "ASP Pricing File" and "NOC Pricing File"). October 2026 Payment Limit Files and NDC-HCPCS Crosswalk were posted 09/17/2026, plus a 2026–2027 Seasonal Vaccine Price File (08/27/2026). All are ZIP.
- Retroactive revisions are common: the January, April, and July 2026 Payment Limit Files were all "revised 09/15/2026", and the Jan/Apr 2026 crosswalks were revised 03/30/2026.
- "CMS may not publish a payment limit or crosswalk for all drugs", and presence in a file doesn't indicate coverage.
- Source: [CMS ASP Pricing Files] (https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files)

**DMEPOS fee schedule**
- Quarterly files DME26-A (Jan), B (Apr), C (Jul), and D (Oct 2026). They contain "the fee schedule amounts, floors, and ceilings for all procedure codes" by payment category and jurisdiction. Archives go back to 1998, there's an RSS feed, and no January 2027 file was posted at fetch time — [CMS DMEPOS Fee Schedule] (https://www.cms.gov/medicare/payment/fee-schedules/dmepos/dmepos-fee-schedule)

**IOM manuals**
- The Internet-Only Manuals are "a replica of the Agency's official record copy". They include 100-02 Medicare Benefit Policy Manual, 100-03 NCD Manual, 100-04 Medicare Claims Processing Manual, 100-08 Program Integrity Manual, 100-12 State Medicaid Manual, 100-16 Managed Care, and others — [CMS IOMs] (https://www.cms.gov/medicare/regulations-guidance/manuals/internet-only-manuals-ioms)
- They change through numbered transmittals/CRs. Example: Transmittal 13791 / CR 14492 is a "Recurring Update Notification" applying to Pub. 100-04, Chapter 22 — [CMS R13791CP] (https://www.cms.gov/files/document/r13791cp.pdf)

### Inferences
- OPPS SI is the hospital-side counterpart to PFS status codes. A hospital claim scrubber needs Addendum B (or the I/OCE data files) keyed by quarter, plus Addendum D1 for SI meaning.
- ASP files are revised retroactively months later. A drug-pricing module must re-pull prior quarters, not just the newest file.
- The IOMs are prose PDFs, not structured data. Turning them into machine rules is manual work, or NLP work, which is why commercial content vendors exist (see Q7).

### Gaps
- I couldn't find the current canonical CMS URL for the consolidated CLIA waived-test list. Several guessed URLs returned 404, and the cms.gov/clia/downloads/waivetbl.pdf link comes from a secondary source and is unverified.
- I didn't download the DMEPOS file to confirm columns (e.g., state-level rural/non-rural fee columns, KU/KE modifiers).
- I didn't download the full ASP Payment Limit File columns.
- The CY 2027 OPPS final rule (typically early November) wasn't yet checked.

---

## Q6. Integrated Outpatient Code Editor (I/OCE): what it is and how to get it

### Takeaway
The I/OCE is CMS's own claim-editing and APC-assignment program for hospital outpatient and other institutional outpatient claims. CMS releases it quarterly as free software (mainframe, PC, and Java JAR) plus data files and specifications, behind an AHA/AMA license gate. It's effectively the reference implementation of the hospital outpatient edit rules.

### Cited Findings
- The quarterly release files provide "the draft and final quarterly Integrated OCE (I/OCE) instructions and specifications". They apply to hospital outpatient departments, CMHCs, all non-OPPS providers, and limited home health and hospice services.
- Each release has four downloads: Quarterly Data Files, MF (mainframe) Software Package, PC Software Package, and Java Standalone Jar. The latest is October 2026, V273.R0 (page modified 09/29/2026). Downloads route via `/apps/aha/license.asp`.
- Source: [CMS I/OCE Quarterly Release Files] (https://www.cms.gov/medicare/coding-billing/outpatient-code-editor-oce/quarterly-release-files)
- Function per CMS overview (via search summary): the I/OCE edits claim data for accuracy, assigns APCs, assigns status and payment indicators, computes discounts, determines claim disposition, applies packaging, and determines payment adjustments. Lists of codes tied to program edits are in Appendix A of the release files — [CMS I/OCE overview (search result)] (https://www.cms.gov/Medicare/Coding/OutpatientCodeEdit)
- Specifications are issued as quarterly Pub 100-04, Ch. 4, §40.1 transmittals (e.g., I/OCE Specifications v26.2, July 2025) — [CMS transmittal (search result)] (https://www.hhs.gov/guidance/sites/default/files/hhs-guidance-documents/CMS/r13256cp.pdf)

### Inferences
- For hospital outpatient billing software, running or embedding the CMS I/OCE Java JAR (or replicating its logic from the spec) is the most faithful way to reproduce Medicare's outpatient edits. The I/OCE also applies NCCI hospital PTP and MUE edits.
- Version label "V273.R0" likely means version 27.3, revision 0, in step with the NCCI "v323r0" convention. That reading is an inference.

### Gaps
- I didn't open the I/OCE spec PDF to list edit numbers or dispositions (e.g., line rejection vs claim return to provider).

---

## Q7. Commercial payer rules, commercial claim-editing content vendors, and price transparency files

### Takeaway
Commercial payers publish their own "reimbursement policies" (billing/coding rules, often NCCI-like but with proprietary additions) and "clinical/medical policies" (coverage criteria) as HTML/PDF pages. They provide no structured feeds or APIs. Policy changes are announced in monthly bulletins.

Payers actually enforce these rules through licensed claim-editing engines and content. The major ones:
- Optum Claims Editing System (CES; UHC uses a customized "iCES")
- Lyric (formerly ClaimsXten, carved out of Change Healthcare)
- Cotiviti Payment Policy Management

These are sold to payers and TPAs (not to providers). Pricing isn't public.

Price-transparency machine-readable files (MRFs) are the only public, machine-readable source of payer-specific codes and rates:
- **Payer MRFs (Transparency in Coverage):** JSON, monthly. A 2026 final rule changes the schema, with v3.0 around Feb 1, 2027.
- **Hospital MRFs:** CMS template, CSV/JSON.

### Cited Findings

**UnitedHealthcare**
- Lists about 100 commercial reimbursement policy PDFs, e.g., "Global Days Policy, Professional", "Maximum Frequency Per Day Policy, Professional", "Modifier Reference Policy", "Procedure to Modifier Policy", "CCI Editing Policy, Professional", and the facility "Outpatient Hospital Maximum Frequency Per Day Policy".
- Monthly "Reimbursement Policy Update Bulletin" PDFs run from November 2024 through October 2026. Each policy shows only a "Last Published" date (e.g., 09.20.2026).
- Policies are "generally based on national reimbursement determinations" using "CPT, CMS or other coding methodologies". UHC "uses a customized version of the Ingenix Claims Editing System known as iCES Clearinghouse (v 2.5.1)".
- Source: [UHCprovider.com commercial reimbursement policies] (https://www.uhcprovider.com/en/policies-protocols/commercial-policies/commercial-reimbursement-policies.html)

**Aetna, Cigna, Elevance**
- Aetna Clinical Policy Bulletins are coverage/medical-necessity documents created by a national review team from medical literature and technology assessments. They're publicly indexed — [Aetna CPB index] (https://www.aetna.com/cpb/medical/data/cpb_num.html)
- Cigna's reimbursement policies are partly gated to registered providers. Elevance/Anthem policies are selected by state. Some payers require provider-portal registration, and policies differ by line of business (Commercial vs Medicare Advantage vs Medicaid) — [AAP payer resources (secondary)] (https://www.aap.org/en/practice-management/child-health-finance-payment-strategy/payment-and-financial-resources/payer-resources/)

**Optum Claims Editing System (CES)**
- Content sources: AMA guidelines, CMS program memoranda, NCCI, Medicare fee schedule data, local medical review policies, and specialty society input. More than 80 payers use it. The rules engine allows "user-defined rules and contractual reimbursement policies" — [Optum CES Professional Claims (vendor)] (https://www.optum.com/content/dam/optum3/optum/en/resources/white-papers/CES_Professional_Claims.pdf)
- Library size: cited as 132 million code-to-code relationships in one Optum sheet and 250 million Medicaid code-editing combinations on another page. The figures aren't reconciled — [Optum CES EDI messaging (vendor)] (https://Optum.Com/content/dam/optum3/optum/en/resources/PDFs/ces-edi-messaging.pdf); [Optum preadjudication suite (vendor)] (https://business.optum.com/en/operations-technology/program-operations/preadjudication-suite.html)
- A health plan's go-live notice says providers can look up claims and see edits with sourced citations — [Health Plan of San Joaquin notice] (https://www.hpsj.com/claims-editing-system-ces-go-live-may-17/)

**Lyric (formerly ClaimsXten)**
- Clinical content "KnowledgePacks" are updated quarterly, with a Policy Management Module for plan-specific customization. The company claims more than 180 million edits and over 100 health-plan clients. It was carved out from Change Healthcare (TPG profile). Primary editing integrates with TriZetto QNXT — [Lyric KnowledgePacks (vendor)] (https://www.lyric.ai/knowledge-packs); [Lyric About (vendor)] (https://lyric.ai/about-us); [Cognizant TriZetto QNXT partners (secondary)] (https://www.cognizant.com/us/en/trizetto/partners/qnxt); [TPG profile (secondary)] (https://healthcare.tpg.com/?p=1195)

**Cotiviti**
- Sells prepay "Payment Policy Management" (SaaS claim editing) plus "Coding Validation" (clinical coder/nurse review) to health plans and TPAs. It launched an enhanced Dental Claim Accuracy offering on PPM on Aug 4, 2026 — [Cotiviti TPA page (vendor)] (https://www.cotiviti.com/solutions/payment-accuracy/prepay-claim-integrity-for-tpas); [BusinessWire, Aug 4, 2026 (vendor PR)] (https://www.businesswire.com/news/home/20260804345268/en/)

**Transparency in Coverage (payer) MRFs**
- Plans and issuers must update the files monthly. File types: in-network rate files, out-of-network allowed amount files, table-of-contents (index) files, and provider reference files. Billing code types include CPT, HCPCS, DRG, and NDC; custom codes are CSTM-ALL and CSTM-00.
- Compliance has been assessed against schema 2.0 since Feb 2, 2026. Schemas are at https://github.com/CMSgov/price-transparency-guide/tree/master/schemas.
- Source: [CMS TiC technical clarification] (https://www.cms.gov/initiatives/healthplan-price-transparency/overview/resources/technical-clarification)
- 2026 TiC Final Rules were published Oct 6, 2026, effective Dec 7, 2026. Changes include:
  - one In-network Rate File per provider network
  - new Utilization, Taxonomy, and Text MRFs
  - schema 3.0 for In-network/Allowed Amount around Feb 1, 2027
  - schema 1.0 for the new files around June 1, 2027
  - Source: [DOL ACA FAQs Part 75] (https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/faqs/aca-part-75); [King & Spalding Health Headlines, Oct 12, 2026 (secondary; gives Oct 5 as the finalization date)] (https://www.kslaw.com/Insights/Newsletters/Health-Headlines/Health-Headlines-October-12,-2026)

**Hospital price transparency MRFs**
- One file per hospital in a CMS template (JSON or CSV) with gross charges, discounted cash price, payer-specific negotiated charges, and min/max — [CMS MLN Hospital Price Transparency] (https://cms.gov/files/document/mln7215754-hospital-price-transparency.pdf)
- The CY 2026 OPPS final rule replaced "estimated allowed amount" with median and 10th/90th percentile allowed amounts derived from 835 data, and added NPIs and attestation — [CMS fact sheet, Nov 21, 2025] (https://www.cms.gov/newsroom/fact-sheets/cy-2026-opps-ambulatory-surgical-center-final-rule-hospital-price-transparency-policy-changes)
- One secondary source says enforcement of the updated requirements began April 1, 2026 — [HFMA (secondary)] (https://www.hfma.org/price-transparency/cmss-latest-transparency-rule-aims-to-make-price-estimates-more-exact/)

### Inferences
- Commercial payer "rules about codes" aren't available as structured data from payers. The realistic options for a software builder are:
  1. Use NCCI/MUE as a proxy, since most payers start from these and UHC has an explicit "CCI Editing Policy".
  2. Scrape or curate payer policy PDFs and their monthly bulletins.
  3. License a commercial editing knowledge base. Vendors historically license this mainly to payers; licensing terms for provider-side or startup use aren't public.
- TiC MRFs give payer-specific allowed rates and which codes appear in contracts. They don't give edit or bundling logic. Remittance 835 data (CARC 97, 45, etc.) is the empirical signal of how a payer actually applies its rules.

### Gaps
- I found no public pricing for Optum CES, Lyric, or Cotiviti content, and no confirmation of whether they license content to provider-side or RCM software vendors.
- I didn't fetch Cigna or Elevance policy pages directly. Their access model (public vs portal-gated) comes from a secondary AAP list.
- I didn't verify the current status of Change Healthcare's own editing products after Optum's acquisition.

---

## Q8. Transaction and administrative code sets: X12 837P/837I/835, CARC/RARC, Claim Status codes, HIPAA 45 CFR 162.1002, and DSMOs

### Takeaway
Claims (837P professional = 005010X222; 837I institutional = 005010X223) and remittances (835) are X12 standards mandated by HIPAA. The implementation guides (TR3s) are copyrighted and licensed by X12, e.g., $180/yr per user via the "Glass" viewer, $3,600/yr internal-use, $1,200/yr development, and commercial pricing by agreement.

The CARC, RARC, and Claim Status code lists are viewable free on x12.org. They're updated about three times a year: CARCs by an X12-hosted committee, RARCs by CMS as maintainer. CMS implements each update via change requests.

45 CFR 162.1002 adopts the *medical* code sets (ICD-10-CM/PCS, NDC, CDT, HCPCS/CPT). Six DSMOs (X12, HL7, NCPDP, NUBC, NUCC, ADA DeCC) maintain the transaction standards. A move from 5010 to X12 version 8020 has been recommended since 2022, but I found no adopted rule.

### Cited Findings

**X12 transaction versions**
- 005010 TR3 identifiers: 005010X222 = 837 Health Care Claim: Professional; 005010X223 = 837 Health Care Claim: Institutional — [AHCCCS-hosted X12N errata status report (2010, secondary host)] (https://www.azahcccs.gov/Resources/Downloads/HIPAA/5010/2010/May/X12NActual005010TR3ErrataStatusReport.pdf)
- In the 835, a CAS segment carries group code, CARC, and amount, e.g., `CAS*CO*45*350.00~` and `CAS*PR*2*20.00~`. It can sit at claim level or service-line level (loop 2110). X12 interpretations say secondary payers should use OA 23 rather than CO 45 to show prior-payer impact — [X12 RFI 2143] (https://x12.org/resources/requests-for-interpretation/rfi-2143-secondary-claim-reporting-cob); [AccountableHQ 835 example (secondary)] (https://www.accountablehq.com/post/hipaa-835-file-format-example-sample-era-x12-835-with-segments-and-loops-explained)

**X12 licensing**
- Commercial Use Partner: annual fee "based on terms of Partner Agreement". Internal Use Partner: $3,600/yr. Licensed User (includes Glass access to the EDI Standard, Guidelines, and Technical Reports): $180/yr. Development Licensing: $1,200/yr.
- "All X12 work products are copyrighted", and to access X12 IP "online, internally, or in a commercial service or product, you'll need to license that use from X12".
- Code-list licensing (CARC/RARC) isn't spelled out; the page says to contact licensing@x12.org.
- Source: [X12 Licensing Program] (https://x12.org/products/licensing-program)

**CARC list**
- Hosted at x12.org with status filters (Current / To Be Deactivated / Deactivated) and per-code start/stop dates. The newest code seen is CARC 308 (start 11/01/2025). Usage notes restrict group codes.
- Examples: CARC 1/2/3 = deductible/coinsurance/copay; 16 = "Claim/service lacks information or has submission/billing error(s)" (needs a RARC); 45 = "Charge exceeds fee schedule/maximum allowable or contracted/legislated fee arrangement" (PR or CO only); 50 = not "medical necessity"; 97 = bundled into another adjudicated service.
- Group codes: CO, CR (not for 005010+), OA, PI, PR. The EDI Standard itself is published once a year in January.
- Source: [X12 CARC] (https://x12.org/codes/claim-adjustment-reason-codes)

**RARC list**
- Examples: M15 "Separately billed services/tests have been bundled as they are considered components of the same procedure"; N130 "Consult plan benefit documents/guidelines…"; MA01 appeal-rights alert — [X12 RARC] (https://x12.org/codes/remittance-advice-remark-codes)
- CMS is "the national maintainer of the remittance advice remark code list", and a separate national code maintenance committee maintains CARCs. Both lists post three times a year — [CMS transmittals surfaced by search, e.g., MM6229 (not opened; flagged)] (https://cms.gov/Outreach-and-Education/Medicare-Learning-Network-MLN/MLNMattersArticles/Downloads/MM6229.pdf); consistent with the HL7 CARIN value set named "X12ClaimAdjustmentReasonCodes / CMSRemittanceAdviceRemarkCodes" (https://hl7.org/fhir/us/carin-bb/en/ValueSet-X12ClaimAdjustmentReasonCodesCMSRemittanceAdviceRemarkCodes.html)

**CMS implementation of CARC/RARC updates (CR 14492, Transmittal 13791, May 27, 2026)**
- "CMS instructs contractors to conduct code updates three times per year (approximately March 1, July 1, and November 1)". "Date discrepancies may occur as the ASC X12 website is only updated three times per year". MACs "must obtain complete CARC and RARC lists from the official ASC X12 website".
- The CR is effective Oct 1, 2026 and implemented Oct 5, 2026, based on lists "published July 1, 2026". Some modifications "may become effective at a future date".
- Source: [CMS R13791CP] (https://www.cms.gov/files/document/r13791cp.pdf) **[verified by download, PDF text extracted]**
- A separate CR 14490 (Transmittal 13789, May 27, 2026) implements the CAQH CORE 360 CARC/RARC/CAGC combination rules. These are business scenarios that constrain which CARC+RARC+group combinations payers may use — [CMS R13789CP (search summary)] (https://www.cms.gov/files/document/r13789cp.pdf)

**Claim Status codes**
- Codes "convey the status of an entire claim or a specific service line", e.g., 20 "Accepted for processing", 21 "Missing or invalid information" (requires another status code), 65 "Claim/line has been paid". The newest seen is code 808 (start 11/01/2024).
- Category codes (A1, F1, and so on) are on a separate list that wasn't retrieved. These lists are used in 276/277 claim status transactions.
- Source: [X12 Claim Status Codes] (https://x12.org/codes/claim-status-codes)

**HIPAA code set regulations**
- 45 CFR 162.1002 adopted medical data code sets in three periods. From Oct 1, 2015 onward:
  - ICD-10-CM for diagnoses
  - ICD-10-PCS for inpatient hospital procedures
  - NDC for retail pharmacy drugs
  - the ADA Code on Dental Procedures and Nomenclature (CDT)
  - HCPCS with CPT-4 for physician and other services
  - HCPCS for other items (supplies, DME)
  - Source: [45 CFR 162.1002 (Cornell LII)] (https://www.law.cornell.edu/cfr/text/45/162.1002)
- 45 CFR 162.103 defines a "code set" broadly as any set of codes used to encode data elements, including codes and descriptors — [45 CFR 162.103 (via chanrobles mirror, secondary)] (https://chanrobles.com/usa/uslaws/cfr/title45/45-1.0.1.3.68.1.33.2.php)
- CMS: under HIPAA, payers must use reason and remark codes approved by X12-recognized maintainers instead of proprietary codes — [CMS transmittal R13293CP (search summary)] (https://www.hhs.gov/guidance/sites/default/files/hhs-guidance-documents/CMS/r13293cp.pdf)

**DSMOs**
- HHS named six DSMOs on Aug 17, 2000 (45 CFR 162.910): X12, HL7, NCPDP (standards organizations), and the ADA Dental Content Committee, NUBC, and NUCC (data content committees). A Steering Committee has one vote each, with a non-voting CMS liaison. Change requests go through the DSMO Change Request System — [Federal Register, Aug 17, 2000] (https://www.govinfo.gov/content/pkg/FR-2000-08-17/pdf/00-20821.pdf); [NCVHS DSMO material] (https://ncvhs.hhs.gov/Letter-to-NCVHS-DSMO-Change-Request-January-21-2020)
- In October 2022, DSMO members objected that X12 hadn't sent its proposed 8020 claim/remittance standards through the DSMO process — [NUBC letter on behalf of DSMOs, Oct 3, 2022] (https://www.nubc.org/system/files/media/file/2022/10/Letter%20to%20NCVHS%20on%20behalf%20of%20DSMOs%2010-3-22.pdf)

**Version 8020 status**
- In June 2022 X12 asked NCVHS to review version 008020 of the 837P, 837I, 837D, and 835. 5010 was balloted in 2003, adopted in 2009, and implemented in 2012 — [X12 request to NCVHS, June 8, 2022] (https://ncvhs.hhs.gov/wp-content/uploads/2022/09/X12-Request-for-review-of-8020-transactions-060822-to-NCVHS-508.pdf); [X12 news] (https://www.x12.org/news-and-events/news/x12-submits-recommendations-advancing-hipaa-mandate-national-committee-vital)

### Inferences
- For software:
  - **CARC/RARC/claim-status lists:** need a thrice-yearly sync (about March, July, November) from x12.org, honoring per-code start/stop dates.
  - **TR3 implementation guides:** must be licensed from X12 for commercial products. The Commercial Use Partner tier covers software embedding X12 IP, and its price is negotiated.
  - **Payer companion guides:** free documents that narrow the TR3 per payer. They're a further per-payer rule layer.
- CARCs are the "rule outcome" vocabulary. Mapping a denial (e.g., CO-97 + M15) back to the rule that triggered it (an NCCI PTP pair) is a core analytics task. The CORE 360 combination list constrains the valid combinations.
- The next CARC/RARC posting would be expected around Nov 1, 2026, with a Medicare CR effective around Jan/Apr 2027. That's an inference from the stated three-per-year cycle.

### Gaps
- I didn't retrieve the Claim Status Category Code list (A0–A8, F0–F4, P0–P5, etc.).
- I found no evidence that HHS has published an NPRM adopting 8020 as of October 2026. 5010 appears to remain the HIPAA standard, but I didn't confirm against the Federal Register.
- I didn't confirm whether CARC/RARC lists can be bulk-downloaded (e.g., CSV) free, or whether bulk use requires an X12 license. The X12 page shows only on-page filters.
- I didn't find X12 retail prices for individual TR3s (one 2011 forum figure of $530 is obsolete).

---

## Q9. State Medicaid rules (fee schedules, policies): how fragmented?

### Takeaway
Each of the roughly 50 state Medicaid programs (plus DC and territories) sets its own fee schedule and coverage and billing policies, published on its own website in its own format and cadence. There's no national machine-readable feed. Medicaid managed care plans add a further layer. The only national overlay is Medicaid NCCI, which states must apply, and even then states get operational files via RISSNET, not the public site.

### Cited Findings
- States "have broad flexibility to determine payments for physician services". Some use Medicare RVUs with their own conversion factors, others a percentage of Medicare. As of November 2016, 23 states used RBRVS — [MACPAC Medicaid Physician FFS Payment Policy (2017)] (https://www.macpac.gov/wp-content/uploads/2017/02/Medicaid-Physician-Fee-for-Service-Payment-Policy.pdf); [MACPAC state compendium] (https://www.macpac.gov/publication/states-medicaid-fee-for-service-physician-payment-policies/)
- A vendor says 47 state Medicaid agencies each publish a physician fee schedule "in their own format, on their own cadence". It reports a median 99214 Medicaid non-facility rate of $95.92, ranging from $37.50 (California) to $236.62 (Alaska). These figures are unverified — [PayerPrice (vendor, secondary)] (https://payerprice.com/medicaid-fee-schedule-lookup)
- Medicaid NCCI public files can't be used by states for claims, and code presence doesn't imply coverage in any state — [CMS Medicaid NCCI Edit Files] (https://www.cms.gov/medicare-medicaid-coordination/national-correct-coding-initiative-ncci/ncci-medicaid/medicaid-ncci-edit-files)
- IOM 100-12 (State Medicaid Manual) is still paper-based and "under development" online — [CMS IOMs] (https://www.cms.gov/medicare/regulations-guidance/manuals/internet-only-manuals-ioms)

### Inferences
- Medicaid support needs a per-state ingestion adapter (scraping PDF/XLSX fee schedules and provider manuals) plus per-MCO policies. It's the most fragmented rule layer and a likely place to rely on commercial aggregators.

### Gaps
- MACPAC's state-by-state physician compendium is from 2017. I found no current authoritative national inventory of state Medicaid fee schedule formats or URLs.

---

## Q10. Cross-cutting: how software actually fetches these, and the versioning gotchas (including 2027 changes)

### Takeaway
Almost all federal rule data is free. It's distributed as quarterly ZIPs (NCCI, PFS RVU, OPPS addenda, ASP, DMEPOS, I/OCE) or weekly ZIPs/REST (MCD).

The download links pass through AMA/AHA license click-through pages. The underlying `https://www.cms.gov/files/zip/...` URLs were directly fetchable in testing, but the license terms still apply.

The main engineering hazards:
- Effective-date versioning by date of service.
- Retroactive revisions (ASP revised months later; RVU "AR" corrections; LCD articles with backdated effective dates).
- MAC jurisdiction differences for LCDs.
- Unreliable page metadata.
- Licensing of CPT/CDT/UB-04/X12 content in commercial products.

### Cited Findings

**Fetch summary**

| Rule set | Publisher | Cadence | Location / access | Format | Cost / license |
|---|---|---|---|---|---|
| NCCI PTP (practitioner, hospital) | CMS | Quarterly (Jan/Apr/Jul/Oct 1; posted about 1 month prior) | cms.gov PTP page → `/files/zip/medicare-ncci-2026q4-...-v323r0-f1..f4.zip` | ZIP: tab-delimited TXT + XLSX | Free; AMA CPT click-through |
| NCCI MUE (practitioner, OPH, DME) | CMS | Quarterly | cms.gov MUE page → `/files/zip/medicare-ncci-2026-q4-*-mue-table.zip` | ZIP: CSV + XLSX | Free; some MUEs confidential |
| NCCI AOC | CMS | Annual Jan 1 + possible quarterly | cms.gov AOC page | ZIP: fixed-width TXT + XLSX | Free |
| NCCI Policy Manual | CMS | Annual (Jan 1) | cms.gov | PDF | Free |
| Medicaid NCCI | CMS | Quarterly | cms.gov Medicaid NCCI (public); RISSNET (states) | ZIP: TXT + XLSX | Free |
| PFS RVU (RVU26A–D) | CMS | Quarterly + correction releases | `/files/zip/rvu26d.zip` | ZIP: CSV, TXT, XLSX, PDF | Free; CPT notice |
| MCD (NCD/LCD/Articles) | CMS + MACs | Weekly (Thursdays) | MCD Downloads; api.coverage.cms.gov | ZIP: MDB + CSV; REST JSON | Free; AMA/ADA/AHA license token |
| OPPS Addendum A/B | CMS | Quarterly | `/files/zip/October-2026-OPPS-Addendum-B.zip` | ZIP: XLSX + TXT | Free; AMA license route |
| I/OCE | CMS | Quarterly | I/OCE release files page | ZIP: data files, PC/MF software, Java JAR | Free; AHA license route |
| ASP Payment Limits | CMS | Quarterly + revisions | ASP pricing files page | ZIP | Free |
| DMEPOS fee schedule | CMS | Quarterly | DMEPOS page | ZIP | Free |
| CARC / RARC / Claim Status | X12 committee / CMS (RARC) | About 3×/year | x12.org/codes | Web list | Viewable; X12 IP policy applies |
| X12 TR3 (837P/I, 835) | X12 | 5010 frozen; standard annual | X12 Glass / licensing | Licensed docs | $180/yr user to commercial partner |
| Payer reimbursement policies | Each payer | Monthly bulletins | Payer portals | PDF/HTML | Free to view; some portal-gated |
| TiC payer MRFs | Each payer (CMS schema) | Monthly | Payer sites; schema on GitHub | JSON | Free |
| State Medicaid | Each state | Varies | State sites | PDF/XLSX/CSV | Free |

Sources for each row are cited in Q2–Q9 above.

**Gotchas**
- **Effective-date versioning:**
  - PTP rows carry effective/deletion dates.
  - MUE and AOC files carry only file-level effective dates, so archives must be kept.
  - CARC/RARC have per-code start/stop dates, and some modifications "may become effective at a future date".
  - Sources: [NCCI PTP f4] (https://www.cms.gov/files/zip/medicare-ncci-2026q4-practitioner-ptp-edits-ccipra-v323r0-f4.zip); [NCCI MUE] (https://www.cms.gov/files/zip/medicare-ncci-2026-q4-practitioner-services-mue-table.zip); [CMS R13791CP] (https://www.cms.gov/files/document/r13791cp.pdf)
- **Retroactive changes:**
  - ASP Jan/Apr/Jul 2026 files were all revised 09/15/2026 — [CMS ASP] (https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files)
  - The RVU naming includes "AR" correction releases — [RVU26D README] (https://www.cms.gov/files/zip/rvu26d.zip)
  - MCD articles can carry effective dates earlier than their update dates (e.g., WPS A57484 updated 02/11/2026, effective 10/01/2024) — [Coverage API articles report] (https://api.coverage.cms.gov/v1/reports/local-coverage-articles/)
- **MAC jurisdiction:** The same service has distinct LCD/article versions by MAC (six Vitamin D billing articles) — [Coverage API articles report] (same)
- **Unreliable page metadata:** The CMS AOC page says "Page Last Modified 09/10/2024" while listing 2026 files, and the DMEPOS page says "12/17/2024" while listing DME26-D. Software should detect changes by file hash or filename, not page dates — [CMS AOC page] (https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-add-code-edits); [CMS DMEPOS page] (https://www.cms.gov/medicare/payment/fee-schedules/dmepos/dmepos-fee-schedule)
- **Licensing:** CPT content in CMS files is AMA-copyrighted. MCD/API access requires accepting AMA CPT ("personal use only"; other uses need an AMA license), ADA CDT (no AI outputs embedding CDT), and AHA UB-04 terms — [CMS MCD Downloads] (https://www.cms.gov/medicare-coverage-database/downloads/downloads.aspx)

**2027 changes to plan for**
- **PFS:** CY 2027 final rule expected early November 2026. Proposed CFs are $33.1693 (QP) / $32.8409 (non-QP) — [Ventra (secondary)] (https://ventrahealth.com/blog/cms-releases-cy-2027-medicare-physician-fee-schedule-proposed-rule/)
- **Lab NCDs:** January 2027 lab NCD edit module (ICD-10 additions to NCD 190.20 effective Oct 1, 2026) — [CMS R13952CP (search summary)] (https://www.cms.gov/files/document/r13952cp.pdf)
- **TiC:** schema 3.0 around Feb 1, 2027; new MRF types schema 1.0 around June 1, 2027 — [DOL ACA FAQs Part 75] (https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/faqs/aca-part-75)
- **CORE 360:** combination rules being implemented by Medicare (CR 14490) — [CMS R13789CP (search summary)] (https://www.cms.gov/files/document/r13789cp.pdf)

### Inferences
- A minimal rules-ingestion pipeline for a US billing product would be:
  - **Quarterly jobs:** NCCI (Medicare + Medicaid), RVU, OPPS addenda/I-OCE, ASP, DMEPOS, CLIA CR.
  - **Weekly job:** MCD/Coverage API.
  - **Thrice-yearly job:** CARC/RARC/claim status.
  - **Monthly jobs:** payer policy bulletins and TiC MRFs.
  - **Annual jobs:** NCCI Policy Manual and PFS/OPPS final rules.
  - All data stored bitemporally (effective date × ingestion date) so claims can be re-adjudicated against the rules in force on the date of service.
- 2027 Q1 NCCI, RVU27A, January 2027 OPPS addenda, I/OCE (likely v28.0), DME27-A, and January 2027 ASP files should all post between roughly late November and December 2026 for Jan 1, 2027 effectiveness. This timing is an inference from observed cadence; none were posted at fetch time.

### Gaps
- I didn't verify whether CMS enforces the license click-through for automated (non-browser) downloads in a way that would change. Direct ZIP URLs worked on 2026-10-21.
- I didn't find official statements on CMS bulk-download rate limits for cms.gov/files.
