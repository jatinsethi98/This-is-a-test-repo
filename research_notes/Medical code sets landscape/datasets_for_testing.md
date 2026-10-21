# Datasets for Building and Testing a US Outpatient Pre-Bill AI Chart Review / Medical Coding Product

Research date: 2026-10-21. Scope: US, English-language datasets that pair clinical notes with billing codes (CPT/HCPCS, E/M levels, modifiers, ICD-10-CM), plus notes-only, synthetic, claims and aggregate reference data, licensed real-world data, de-identification tooling and licensing traps. Non-English sets are noted briefly.

Method note: Some primary pages could not be fetched (n2c2 portal 403, data.cms.gov is JavaScript-rendered, PMC/medRxiv/HHS 403, the MDACE GitHub link returned 404). Where that happened, the finding is either cited to a secondary source and flagged, or moved to Gaps. For MIMIC-III, MIMIC-IV and eICU, I downloaded the **open demo subsets** from PhysioNet and counted the code types directly; those counts are cited to the demo files.

---

## Q1. Plain-language glossary: what do these coding terms mean?

### Takeaway
An outpatient "pre-bill" checker reviews a visit note before the claim goes out. It checks four things: the diagnosis codes (ICD-10-CM), the service and procedure codes (CPT/HCPCS), the visit level (an E/M code such as 99213 vs 99214), and any modifiers. Almost all public research data is **inpatient or ICU** and labels **diagnoses only**. That mismatch is the main reason public data fits this product poorly.

### Cited Findings
- **Inpatient vs. outpatient coding.** Inpatient coding covers hospital admissions and uses ICD diagnosis (CM) and ICD procedure (PCS) codes. Outpatient coding covers visits where the patient stays less than 24 hours. It splits into **professional fee ("Profee")** coding, which bills the clinician's work, and **facility** coding, which bills the hospital or clinic — [MDACE paper, Appendix A](https://arxiv.org/pdf/2307.03859)
- **CPT** codes are maintained by the American Medical Association (AMA). They are used for outpatient facility and professional-fee billing in the US, and there are roughly 10,000 CPT-4 codes. ICD codes are also attached to Profee claims to show medical necessity — [MDACE paper §3.1](https://arxiv.org/pdf/2307.03859)
- **E/M (Evaluation and Management)** codes are the CPT range 99201–99499. The MDACE authors excluded them from their annotations because they "require a decision making calculator to arrive at the correct CPT codes rather than simply depending on the clinical text" — [MDACE paper, footnote 3](https://arxiv.org/pdf/2307.03859)
- **Medical decision-making (MDM).** Under current AMA rules, the E/M level is driven by MDM, which is graded on three elements: problem complexity, data complexity and risk complexity. Production data usually holds only the final CPT code, not these intermediate levels — [ProFees, Oracle Health & AI, arXiv 2510.25007](https://arxiv.org/html/2510.25007v1)
- **HCPCS** is the umbrella code system used on Medicare Part B data. CMS public files are organized by NPI (clinician ID) × HCPCS code × place of service. **Facility ("F")** rows generally reflect only the professional fee. **Non-facility ("O", usually office)** rows reflect the complete payment — [CMS Physician & Other Practitioners Methodology](https://data.cms.gov/resources/medicare-physician-other-practitioners-methodology)
- **De-identified data under HIPAA** can be produced in one of two ways. Under **Safe Harbor**, you remove 18 identifier types, including all date elements except year, ZIP codes beyond 3 digits (and those 3 digits only where the area has more than 20,000 people), and ages over 89, and you must have no actual knowledge that the rest could identify someone. Under **Expert Determination**, a qualified expert documents that re-identification risk is "very small" — [45 CFR 164.514 (Cornell LII)](https://www.law.cornell.edu/cfr/text/45/164.514)
- **Credentialed access** on PhysioNet means three things. The user must be a credentialed user, must complete the CITI "Data or Specimens Only Research" training, and must sign the Data Use Agreement (DUA) — [MIMIC-IV v3.1 page](https://physionet.org/content/mimiciv/3.1/)

### Inferences
- "Notes + codes" datasets need to be checked on three separate axes. (a) Which code types are labeled: diagnosis, procedure or E/M. (b) What setting they come from: ICU/inpatient, ED or office. (c) Whether the label was assigned from the same note the model sees, or from the whole stay. Most public sets fail on (b) and (c).

### Gaps
- None material for definitions. Modifier definitions (for example 25 and 59) were out of scope for this dataset research and were not sourced here.

---

## Q2. Which credentialed datasets pair real clinical notes with billing codes (MIMIC family, eICU, MDACE, n2c2, CodiEsp)?

### Takeaway
MIMIC-III is the only large public source of real notes linked to **CPT E/M codes**. Those E/M codes are **inpatient and ICU professional services** (hospital visits, critical care, consults), not office visits. MDACE adds coder-annotated evidence spans for 52 professional-fee charts but **excludes E/M codes**. MIMIC-IV has ICD-9 and ICD-10 diagnoses and an HCPCS table, but its notes are only discharge summaries and radiology reports. All of these are research-only under the PhysioNet DUA.

### Cited Findings

**MIMIC-III v1.4 (MIT LCP / Beth Israel Deaconess Medical Center, BIDMC)**
- Covers more than 40,000 critical-care (ICU) patients at BIDMC, 2001–2012. Notes include discharge summaries, ECG and imaging reports, and progress notes (NOTEEVENTS). Billing data includes ICD-9 codes and **CPT codes (CPTEVENTS)** — [PhysioNet MIMIC-III 1.4](https://physionet.org/content/mimiciii/1.4/)
- Access requires credentialing, CITI training and the PhysioNet Credentialed Health Data Use Agreement 1.5.0. Approval takes at least a week — [PhysioNet MIMIC-III 1.4](https://physionet.org/content/mimiciii/1.4/)
- CPTEVENTS has two cost centers. "ICU" rows are procedures billed by the ICU team, and "Resp" rows are ventilation billed by respiratory therapists. Descriptions are filled in only for Resp rows. Section and subsection headers come from D_CPT — [MIMIC-III CPTEVENTS docs](https://mimic.mit.edu/docs/iii/tables/cptevents)
- **Verified by counting the open 100-patient demo.** 1,150 of 1,579 CPTEVENTS rows are E/M codes (99201–99499): 739 "Hospital inpatient services" (e.g., 99231/99233), 326 "Critical care services" (99291), 77 "Consultations" and 4 deleted follow-up consult codes. The remaining rows are pulmonary (Resp), dialysis and surgery codes — [MIMIC-III demo CPTEVENTS.csv](https://www.physionet.org/files/mimiciii-demo/1.4/CPTEVENTS.csv)

**MIMIC-IV v3.1 (hosp + icu modules)**
- Released Oct 11, 2024. It covers 364,627 patients, 546,028 hospitalizations and 94,458 ICU stays from 2008–2022. The `hosp` module includes `diagnoses_icd`, `procedures_icd`, `hcpcsevents`, `d_hcpcs` and `drgcodes`. The `omr` table holds outpatient and inpatient vitals (BP, height, weight, BMI, eGFR). License is PhysioNet Credentialed Health Data License 1.5.0 — [PhysioNet MIMIC-IV 3.1](https://physionet.org/content/mimiciv/3.1/); [MIMIC-IV hosp module docs](https://mimic.mit.edu/docs/iv/modules/hosp/)
- `hcpcsevents` columns are subject_id, hadm_id, chartdate, hcpcs_cd (5-char), seq_num and short_description. Each row is a "coded event" linked to a hospitalization — [MIMIC-IV hcpcsevents docs](https://mimic.mit.edu/docs/iv/modules/hosp/hcpcsevents.html)
- **Verified by counting the open demo (ODbL-licensed).** The demo's 61 hcpcsevents rows are dominated by hospital observation codes: G0378 "Hospital observation per hr" (29), 99219 and 99218 "Hospital observation services" (12), C9600 stent, and procedure codes such as 92921, 93454 and 43276. No office E/M codes (99202–99215) appear. `diagnoses_icd` in the demo has 2,193 ICD-9 rows and 2,313 ICD-10 rows — [MIMIC-IV demo hosp files](https://physionet.org/content/mimic-iv-demo/2.2/)

**MIMIC-IV-Note v2.2**
- Contains 331,794 discharge summaries (145,915 patients) and 2,321,355 radiology reports (237,427 patients). Notes are included only if they occur within one year of an ED or hospital stay. Credentialed access; published Jan 6, 2023 — [PhysioNet MIMIC-IV-Note 2.2](https://physionet.org/content/mimic-iv-note/2.2/)
- An Amazon-affiliated team argues that MIMIC is poorly suited to outpatient coding research. Its notes are ICU-centric while its codes span the whole encounter, so a code often cannot be verified from the note alone. It is also mainly inpatient — [Yuan et al., EMNLP 2025 Industry, arXiv 2510.07629](https://arxiv.org/html/2510.07629)

**MIMIC-IV-ED v2.2**
- Has about 425,000 ED stays (2011–2019) across six tables (edstays, diagnosis, medrecon, pyxis, triage, vitalsign). The diagnosis table holds ICD-9 or ICD-10 billing codes, up to 9 per stay, assigned after discharge for the ED stay only. Triage includes a free-text chief complaint. Clinical notes and CPT/E&M levels are not described — [PhysioNet MIMIC-IV-ED 2.2](https://physionet.org/content/mimic-iv-ed/2.2/)

**eICU-CRD v2.0 (Philips eICU / MIT)**
- Covers more than 200,000 ICU admissions at 208 hospitals and 335 units in 2014–2015 (more than 139,000 patients). Access is credentialed under the PhysioNet DUA 1.5.0 — [PhysioNet eICU-CRD 2.0](https://physionet.org/content/eicu-crd/2.0/)
- **Verified by inspecting the open demo.** The `diagnosis.icd9code` column actually holds paired ICD-9 and ICD-10 strings (e.g., "401.9, I10"). The `note` table is structured template fields (notepath/notevalue such as "Include Past Medical History"), not narrative notes — [eICU demo diagnosis/note files](https://physionet.org/files/eicu-crd-demo/2.0.1/)

**MDACE — MIMIC Documents Annotated with Code Evidence (3M, now Solventum; ACL 2023)**
- Annotated by professional medical coders on a subset of MIMIC-III: 302 inpatient charts (604 documents, 3,934 evidence spans) and **52 Profee charts (588 documents, 5,563 evidence spans; Profee counts include CPT codes)** — [MDACE paper, Table 3](https://arxiv.org/pdf/2307.03859); [ACL Anthology](https://aclanthology.org/2023.acl-long.416/)
- Coders annotated in **ICD-10**, and the codes were auto-mapped to ICD-9 through CMS General Equivalence Mappings. Profee coders annotated complete evidence, while inpatient coders annotated sufficient evidence. Two separate teams of two coders each did inpatient and Profee. **E/M codes (99201–99499) were ignored** — [MDACE paper §3.1–3.2 and footnote 3](https://arxiv.org/pdf/2307.03859)
- The dataset and software are under the MIT license. Annotations are released as offsets plus scripts that merge with MIMIC-III NOTEEVENTS, so MIMIC-III credentialed access is still needed for the text. The original repo is github.com/3mcloud/MDACE — [MDACE paper §1](https://arxiv.org/pdf/2307.03859). (A fetch of that GitHub URL on 2026-10-21 returned 404; see Gaps.)
- Discharge summaries hold most inpatient coding evidence but are "insufficient for Profee coding". Physician and radiology notes are also needed — [MDACE paper §4](https://arxiv.org/pdf/2307.03859)

**n2c2 / i2b2 NLP challenge datasets (Harvard DBMI)**
- They are free for research under a DUA, and each user must apply individually through the DBMI Data Portal. Copies may not be passed on or posted anywhere, including GitHub. There are separate academic and **corporate** DUAs. The corporate form allows "evaluation and testing of a natural language processing tool or technology" but does "not extend to proposals that include or incorporate the Data / Datasets into such product" — [n2c2 Data Use Agreement page](https://n2c2.dbmi.hms.harvard.edu/data-use-agreement) (quoted via search snippet; page returned 403 to direct fetch); [n2c2 data sets](https://n2c2.dbmi.hms.harvard.edu/data-sets)

**CodiEsp (Spanish; Barcelona Supercomputing Center, CLEF eHealth 2020)**
- Has 1,000 Spanish clinical case reports (500 train / 250 dev / 250 test) coded in CIE10, the Spanish ICD-10-CM and ICD-10-PCS. License is CC BY 4.0. Machine-translated English versions (`text_files_en`) are included — [Zenodo CodiEsp](https://zenodo.org/records/3837305)

**MIMIC-derived benchmarks**
- **MIMIC-IV-ICD** (2023) is an ICD-10 extreme multi-label benchmark built from MIMIC-IV. Its code is public but it needs MIMIC-IV access — [arXiv 2304.13998](https://arxiv.org/pdf/2304.13998); [GitHub](https://github.com/thomasnguyen92/MIMIC-IV-ICD-data-processing)
- **CliBench** (2024) is built from MIMIC-IV. Diagnoses map to ICD-10-CM, procedures to ICD-10-PCS, labs to LOINC and medications to ATC — [arXiv 2406.09923](https://arxiv.org/html/2406.09923v1)
- **CliniBench** (EACL 2026) predicts discharge diagnoses from admission notes in MIMIC-IV — [ACL Anthology 2026.eacl-long.247](https://aclanthology.org/2026.eacl-long.247)
- **Asclepius** also has a MIMIC-III discharge-summary variant hosted on PhysioNet, which is credentialed — [HF Asclepius card](https://huggingface.co/datasets/starmpcc/Asclepius-Synthetic-Clinical-Notes)

### Inferences
- **MIMIC-III CPTEVENTS + NOTEEVENTS is the only large public corpus where real notes and real E/M codes coexist.** The E/M codes are inpatient subsequent-care, critical-care and consult codes (the 9922x/9923x/9925x/9929x ranges), and they are assigned per hospital stay, not tied to a specific note. That makes it **low-to-medium** value for an *office/outpatient* E/M checker. It could test MDM reasoning on daily progress notes and critical-care time rules, but not 99202–99215 office leveling.
- MIMIC-IV hcpcsevents appears to be mostly **facility-side** HCPCS (observation hours, procedures), based on the demo. It is not a source of professional E/M levels. This is a 100-patient sample, so the full table may contain other codes.
- **MDACE Profee (52 charts)** is the closest public analog to professional-fee chart review with coder-grade evidence spans. It is valuable for testing **evidence highlighting and ICD-10-CM/CPT procedure capture**, but E/M was explicitly excluded, and it is inpatient-stay documentation.
- None of the PhysioNet datasets contain primary-care or specialty **office visit notes**.

### Gaps
- The MDACE GitHub (github.com/3mcloud/MDACE) returned 404 on 2026-10-21. It may have moved after 3M Health Information Systems became Solventum, but I could not confirm the current location.
- I could not fetch the full n2c2 dataset list (403). From the visible snippets, the catalog starts with 2006 de-identification and smoking. I found no evidence that any n2c2 set carries CPT or E/M labels, but this is not fully verified.
- Exact MIMIC-III NOTEEVENTS note counts and the full MIMIC-IV hcpcsevents code distribution were not retrieved (only demo subsets were inspected).

---

## Q3. Which public datasets have outpatient-style notes but no billing codes (usable for synthetic labeling)?

### Takeaway
There are several small, permissively licensed doctor–patient conversation → note corpora: ACI-Bench (207), MTS-Dialog (~1.7k), PriMock57 (57) and MTSamples (~5k transcription samples). These are the best raw material for **having certified coders label E/M, CPT and ICD-10** in-house. The larger synthetic note sets (Asclepius 158k; augmented-clinical-notes 30k) are mostly case-report / discharge style and carry license caveats.

### Cited Findings
- **ACI-Bench** (Microsoft/Nuance/UW; *Scientific Data* 2023) has 207 doctor–patient conversations with notes: train 67, valid 20, three test sets of 40. License is **CC BY 4.0**, distributed via Figshare and GitHub — [GitHub wyim/aci-bench](https://github.com/wyim/aci-bench)
- ACI-Bench encounters are role-played or written by clinicians. They were originally built for marketing demos and are fictitious: 112 "aci", 55 "virtassist" and 40 "virtscribe". Notes follow four SOAP-like sections (subjective, objective exam, objective results, assessment and plan), and the visits are general clinic encounters — [Yim et al., Sci Data 2023 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10482860/)
- **MTS-Dialog** (Ben Abacha et al., EACL 2023) has about 1.7k short dialogue–note-section pairs (1,201 train / 100 val / 2×200 test) with 20 normalized section headers (CC, HPI, ROS, assessment, plan, etc.). There are also 3,603 back-translated augmented pairs. License is **CC BY 4.0** — [GitHub abachaa/MTS-Dialog](https://github.com/abachaa/MTS-Dialog)
- **PriMock57** (Babylon Health) has 57 mock primary-care consultations with 7 clinicians: audio, manual transcripts, clinician-written notes and human evaluation data — [GitHub babylonhealth/primock57](https://github.com/babylonhealth/primock57). License is **CC BY 4.0** (no non-commercial clause) — [PriMock57 LICENSE.md](https://raw.githubusercontent.com/babylonhealth/primock57/main/LICENSE.md)
- **MTSamples (Kaggle "medicaltranscriptions")** has 4,999 rows and 6 variables, including `medical_specialty`. It was scraped from mtsamples.com by Tara Boyle, and Kaggle lists it as **CC0** — [clinspacy R docs](https://search.r-project.org/CRAN/refmans/clinspacy/html/dataset_mtsamples.html) (secondary source; the Kaggle page did not render). [Kaggle page](https://www.kaggle.com/datasets/tboyle10/medicaltranscriptions)
- **Asclepius-Synthetic-Clinical-Notes** has 158,114 synthetic discharge summaries generated with GPT-3.5 from PMC-Patients case reports, plus instruction–answer pairs. License is **CC-BY-NC-SA 4.0 (non-commercial)** — [HF starmpcc/Asclepius-Synthetic-Clinical-Notes](https://huggingface.co/datasets/starmpcc/Asclepius-Synthetic-Clinical-Notes)
- **augmented-clinical-notes** (EPFL) has 30,000 note–dialogue–summary triplets. The notes come from PMC-Patients (open-access case reports), the dialogues from NoteChat (GPT-3.5) and the summaries from GPT-4. License is **MIT** — [HF AGBonnet/augmented-clinical-notes](https://huggingface.co/datasets/AGBonnet/augmented-clinical-notes)
- **Synthea notes.** Synthea can export FHIR `DocumentReference` "for clinical notes", but only with FHIR R4 and US Core enabled (`exporter.fhir.use_us_core_ig`, default false) — [Synthea HL7 FHIR wiki](https://github.com/synthetichealth/synthea/wiki/HL7-FHIR). Community discussion indicates the note is base64-embedded templated text — [FHIR chat](https://chat-archive.fhir.org/stream/179190-united-states/topic/USCore.20for.20clinical.20notes.html) (secondhand, not documented)
- **SHIELD** (Stanford, 2026 preprint) has 1,394 notes with 10,505 gold PHI spans across 9 categories. It is useful for evaluating de-identification, not coding — [alphaXiv 2605.03301](https://www.alphaxiv.org/abs/2605.03301)

### Inferences
- **ACI-Bench + MTS-Dialog + PriMock57** (all CC BY 4.0) are the cleanest commercially usable seed notes in an outpatient style. Having 2 certified coders assign E/M level + CPT + ICD-10-CM + modifiers, with adjudication, would create a small, shareable gold set. The Amazon team took this approach for ICD-10 only (see Q4).
- MTSamples covers many specialties, including procedure and operative notes, which makes it useful for CPT procedure testing. However, the mtsamples.com site terms were not verified, and a CC0 tag on a scraped Kaggle copy may not reflect the original rights holder's terms.
- Asclepius and augmented-clinical-notes are discharge or case-report style. They are poor proxies for 99213/99214 office notes. Asclepius's NC license also blocks commercial training use.

### Gaps
- I could not verify mtsamples.com's own terms of use.
- I could not verify the exact Synthea note template or whether the notes vary meaningfully by encounter type.

---

## Q4. Which public or synthetic datasets include billing codes, and what do the 2024–2026 coding benchmarks release?

### Takeaway
The only public **outpatient notes + expert ICD-10-CM codes** set is Amazon's 207-note ACI-Bench annotation (2025). It is diagnosis-only, and its repo license is **CC-BY-NC-4.0**. **No public dataset of outpatient notes labeled with CPT E/M levels was found.** Oracle's ProFees paper (2025) explicitly says none exists, and its own data is private. Synthetic claims sets (Synthea, CMS synthetic PUFs, DE-SynPUF) have codes but no notes.

### Cited Findings

**Notes + codes (public or semi-public)**
- **Amazon / ACI-Bench ICD-10-CM verification benchmark** (Yuan, Shing, Strong, Shivade; EMNLP 2025 Industry). It has 207 outpatient ACI-Bench notes, each double-annotated by experts with ICD-10-CM codes and arbitrated (67 train / 20 dev / 120 test). There are **no CPT codes** — [arXiv 2510.07629](https://arxiv.org/html/2510.07629); [ACL Anthology 2025.emnlp-industry.12](https://aclanthology.org/2025.emnlp-industry.12/)
- The repo releases only the annotations plus `merge_aci_annotations.py`, which joins them with ACI-Bench to produce train/valid/test JSONL with dialogue, note and ICD-10 codes. **License is CC-BY-NC-4.0** — [GitHub amazon-science/toward-clinical-coding-verification-adaptation](https://github.com/amazon-science/toward-clinical-coding-verification-adaptation). This **conflicts** with the paper's Limitations section, which says release would be under MIT "upon notification and approval" — [arXiv 2510.07629](https://arxiv.org/html/2510.07629). The repo license is the operative one.
- **MedCodER** (Deloitte, 2024) is a dataset of records annotated with diagnoses, ICD-10-CM codes and supporting evidence. Its framework reports micro-F1 of 0.60 (v1) or 0.62 (later version) — [arXiv 2409.15368](https://arxiv.org/html/2409.15368v1). Zenodo files are diagnosis.csv, supporting_evidence.csv, text.csv and holdouts (text.csv is 505.7 kB). License is **CC BY-NC-ND 4.0** — [Zenodo 13308316](https://zenodo.org/records/13308316)
- The Amazon authors judged MedCodER's annotations "locally scoped and less consistent" than their own — [arXiv 2510.07629](https://arxiv.org/html/2510.07629)
- **MedSynth** (2025) has 10,240 synthetic dialogue–SOAP-note pairs: 5 per ICD-10 code across 2,000 codes, with columns ICD10, ICD10_desc, Note and Dialogue. It was generated by multi-agent LLMs seeded from IQVIA PharMetrics Plus claims statistics and ACI-Bench. There are no CPT codes, and the license was not visible on the card — [HF Ahmad0067/MedSynth](https://huggingface.co/datasets/Ahmad0067/MedSynth); [arXiv 2508.01401](https://arxiv.org/html/2508.01401v1)
- **Hugging Face "CPT" datasets are thin.** `CJJones/Medical_Coding_Synthetic_Sample` is a 10-record ICD-10/CPT synthetic sample (cc-by-sa-4.0), and its 100k-record version is sold on Gumroad — [HF card](https://huggingface.co/datasets/CJJones/Medical_Coding_Synthetic_Sample/blob/main/README.md). `toolevalxm/MediSynth-ClinicalNotes-Raw` has ICD-10 fields with no license metadata — [HF](https://huggingface.co/datasets/toolevalxm/MediSynth-ClinicalNotes-Raw)

**2024–2026 E/M- and CPT-specific research (data mostly private)**
- **ProFees** (Oracle Health & AI, Oct 2025) uses 216 de-identified outpatient and preventive encounters (SOAP note + EHR data) across family practice, internal medicine, urology, hematology, oncology and cardiology, split 117 dev / 99 test. It follows the 2024 AMA CPT MDM guidelines. The expert annotator agreed with the professional coder on only 44% of encounters. **The test set is not public.** The authors note the field lacks public CPT E/M datasets and plan a synthetic release. The paper reports a >36% CPT-accuracy gain over a commercial system, though its conclusion says 30.61% (internally inconsistent) — [arXiv 2510.25007](https://arxiv.org/html/2510.25007v1)
- A 2023 medRxiv study built NLP E/M level-of-service classifiers on about 31,115 outpatient notes from one health system's subspecialties. Search-result summaries report best accuracy of about 75%, dropping to about 48% on de-identified notes. The data is not public — [medRxiv 2023.07.07.23292367](https://medrxiv.org/content/10.1101/2023.07.07.23292367v1) (primary page returned 403; figures from search summary, verify before quoting)
- **Soroush et al., NEJM AI 2024, "Large Language Models Are Poor Medical Coders — Benchmarking of Medical Code Querying"** found GPT-4's best exact-match rates were ICD-9-CM 45.9%, ICD-10-CM 33.9% and CPT 49.8% on code querying — [NEJM AI](https://ai.nejm.org/doi/full/10.1056/AIdbp2300040)
- **arXiv 2603.23515 (Mar 2026)** fine-tuned Llama 3-70B on privacy-preserving synthetic notes with gold ICD-10-CM and CPT codes from EHR-grounded templates. Exact-code F1 rose from 0.18 (zero-shot) to above 0.70. Dataset release is not stated — [arXiv 2603.23515](https://arxiv.org/abs/2603.23515)
- **MAX-EVAL-11** (Oct 2025) is a benchmark of 10,000 synthetic notes for **ICD-11** coding. It is not US ICD-10 — [medRxiv 2025.10.30.25339130](https://www.medrxiv.org/content/10.1101/2025.10.30.25339130.full.pdf)

**Synthetic records and claims with codes but no real notes**
- **Synthea** (MITRE) is licensed Apache 2.0 and outputs FHIR R4/STU3/DSTU2, Bulk FHIR, C-CDA, CSV and CPCDS — [GitHub synthetichealth/synthea](https://github.com/synthetichealth/synthea)
- In the Synthea CSV export, encounters, conditions, procedures and claims diagnoses all use **SNOMED-CT**. There is no ICD-10 or CPT in the CSV. claims_transactions procedure codes are "SNOMED-CT or other code (e.g. CVX)" — [Synthea CSV data dictionary](https://github.com/synthetichealth/synthea/wiki/CSV-File-Data-Dictionary)
- **CMS Synthetic Medicare Enrollment, FFS Claims and PDE PUFs** (May 2023) were generated with Synthea for **8,671 synthetic beneficiaries**. They contain 1,120,655 carrier (Part B professional) claims, 574,861 outpatient, 58,030 inpatient and 515,520 Part D events, dated about Mar 2015 to Mar 2023. The data is in RIF format, which requires **ICD-10-CM, HCPCS and NDC**. Synthea's SNOMED, RxNorm and LOINC codes are mapped, and unmappable events are dropped. The files are "released publicly without restrictions" but have "very limited inferential research value" — [CMS Synthetic RIF User Guide (May 2023)](https://data.cms.gov/sites/default/files/2023-05/d51e1218-68c3-4c7c-9598-0b81f22fe903/User%20Guide%20-%20CMS%20Synthetic%20RIF%20Files%20May%202023_AM508_v2.pdf)
- **CMS DE-SynPUF (2008–2010)** has about 2.33M (2008) beneficiaries across Beneficiary Summary, Inpatient, Outpatient, Carrier and PDE files, split into 20 samples. It is described as "claims data in the public domain" with "very limited inferential research value" — [CMS DE-SynPUF page](https://www.cms.gov/data-research/statistics-trends-and-reports/medicare-claims-synthetic-public-use-files/cms-2008-2010-data-entrepreneurs-synthetic-public-use-file-de-synpuf)
- AHRQ **SyH-DR** is a synthetic all-payer claims database built from 2016 data — [AHRQ SyH-DR](https://www.ahrq.gov/data/innovations/syh-dr.html)

### Inferences
- For an outpatient **ICD-10-CM** checker, the Amazon ACI-Bench set is **high** value for a quick, credible, outpatient-style diagnosis benchmark. It is non-commercial, though, so it is fine for internal evaluation and arguably for publishing results. It should not be used to train a commercial model without checking the NC terms with counsel.
- For **E/M leveling**, no public gold standard exists. A builder must create one, whether by labeling ACI-Bench/MTS-Dialog/PriMock57/MTSamples or by getting de-identified charts from design partners. ProFees found only 44% expert–coder agreement, which suggests the gold set needs double coding plus adjudication. Even so, ceiling accuracy will be bounded by human disagreement.
- The CMS synthetic claims are useful for **claim-format and edit-logic testing** (ICD-10-CM ↔ HCPCS pairing, NCCI/MUE-style rules, modifier presence). They are not useful for note-to-code accuracy, and Synthea's claims are built from a SNOMED mapping, so code distributions are not realistic.
- DE-SynPUF predates the Oct 2015 ICD-10 transition, so its diagnosis codes should be ICD-9-era. I did not verify this on the page; low value.

### Gaps
- MedSynth's license was not visible. The CMS synthetic PUF download page (data.cms.gov) did not render, so its current status and terms beyond the user guide were not verified.
- Whether ProFees or any other group has since released a synthetic E/M dataset was not confirmed (search found none).
- MedCodER's record count and note source were not stated on Zenodo.

---

## Q5. What aggregate reference data (no notes) is useful for benchmarking E/M and CPT distributions?

### Takeaway
CMS public files give free, national, specialty-level and clinician-level distributions of HCPCS/CPT (including E/M levels, modifiers and place of service). These are useful as **priors and sanity checks**, e.g., "is this clinic's 99214/99215 mix an outlier?". CERT gives Medicare improper-payment context. HCUP is facility-focused and paid.

### Cited Findings
- **Medicare Physician & Other Practitioners — by Provider and Service** is free on data.cms.gov. It covers 100% of final-action Part B non-institutional line items for FFS, keyed by **NPI × HCPCS × place of service (F/O)**. Facility rows generally reflect only the professional fee, and DMEPOS is excluded — [CMS methodology](https://data.cms.gov/resources/medicare-physician-other-practitioners-methodology); [dataset page](https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-provider-and-service)
- The data.gov catalog lists a 2023 data-year (D23) file for this dataset — [data.gov catalog](https://catalog.data.gov/dataset/medicare-physician-other-practitioners-by-provider-and-service-23337). Counts for fewer than 11 beneficiaries are suppressed — [CMS by-Provider data dictionary (RY21)](https://data.cms.gov/sites/default/files/2021-10/5d9da495-6798-4428-8260-ce362d8fc5a5/MUP_PHY_RY21_20211021_DD_PRV.pdf)
- **Physician/Supplier Procedure Summary (PSPS)** is an annual summary of Part B carrier and DME FFS claims by carrier, pricing locality, **HCPCS, HCPCS modifier, provider specialty**, type of service and place of service. It includes submitted, allowed and denied services and charges, and payments. The full LDS file costs **$400** (about 250 MB CSV) and requires a DUA. A small-cell-suppressed **public version is free**. Data is available from 2010 and released annually around August — [CMS PSPS page](https://www.cms.gov/data-research/cms-data/limited-data-set-lds-files/physician/supplier-procedure-summary-psps)
- **CERT (Comprehensive Error Rate Testing)** publishes Supplemental Improper Payment Data for report years 2017–2025. The 2025 edition was released 2026-01-24 — [CMS CERT Reports](https://cms.gov/research-statistics-data-and-systems/monitoring-programs/medicare-ffs-compliance-programs/cert/cert-reports)
- **HCUP (AHRQ)** requires training and a DUA, and prices are set by participating data organizations. Purchases go through CDORS — [HCUP Central Distributor](https://hcup-us.ahrq.gov/tech_assist/centdist.jsp). NASS (ambulatory surgery) for 2016–2018 was listed at $1,000 ($200 students) in a 2021 catalog — [HCUP Nationwide Database Catalog Jul 2021](https://hcup-us.ahrq.gov/tech_assist/centdist/HCUP-Nationwide-Database-Catalog-Jul2021.pdf). NASS covers OR-type ambulatory surgeries with diagnosis and procedure codes — [NASS Introduction 2023](https://hcup-us.ahrq.gov/db/nation/nass/NASSIntroduction2023.pdf)

### Inferences
- PSPS (free public version) plus the Provider & Service PUF are **high** value as reference distributions for an E/M checker. Examples: expected 99212–99215 mix by specialty, modifier-25 frequency with E/M, and facility vs. office split. They are **not** test cases; they are calibration priors and outlier baselines.
- CERT supplemental tables are useful for prioritizing which E/M and documentation error categories to catch (e.g., insufficient documentation vs. incorrect coding).
- HCUP is **low** value for an outpatient professional-fee checker: it is facility-focused, paid, has no notes, and its DUAs restrict use.

### Gaps
- I could not open the 2025 CERT supplemental file to extract E/M-specific error rates. Search results cited an FY2024 Medicare FFS improper payment rate of 7.66% ($31.70B), and secondary sources gave 2023 shares of incorrect coding (52.4%) and insufficient documentation (34%). None of these were verified on a primary CMS page.
- The latest Physician & Other Practitioners data year and the exact suppression language were not confirmed on the JavaScript-rendered data.cms.gov pages.
- Whether HCUP DUAs allow commercial product development was not confirmed.

---

## Q6. Which vendors license real-world de-identified data with clinical notes, and do they include outpatient notes plus professional billing codes?

### Takeaway
Several networks claim billions of de-identified notes: Truveta (7–8B+), Mayo Clinic Platform_Discover/nference (~0.5–0.7B), and Protege as a marketplace (3B+ claimed). **Public pricing is not disclosed by any of them.** Some keep data inside their own cloud (Mayo), and some appear to deliver NLP-derived concepts rather than raw text (Optum, possibly Truveta). Raw outpatient note text paired with professional CPT/E/M claims at the encounter level was **not confirmed** for any vendor.

### Cited Findings
- **Truveta** claims more than 130M patients (also "140M+ EHRs"; the page is inconsistent) and 7B+ or 8B+ clinical notes (also inconsistent). Codes include ICD, SNOMED, **CPT and HCPCS**, RxNorm/NDC, LOINC and CVX. Closed claims cover 200M+ patients from 2016 onward. The site has a "Request data" option aimed at pharma, device, healthcare and public-health organizations, and no pricing — [Truveta Data](https://truveta.com/truveta-data)
- Truveta reported 5B+ notes as of Nov 2024 and says it "uses advanced AI technology to extract and clean" note data — [Truveta (Nov 2024 release)](https://truveta.com/?p=260246)
- **Mayo Clinic Platform_Discover** offers structured data plus unstructured clinical notes, pathology and radiology reports. "These data never leave the Mayo Clinic cloud computing environment", so developers build models inside Mayo's environment. Note counts conflict across Mayo pages: 520M, 644M (5.3M patients) and 698M (13.6M+ patients) — [Mayo Clinic News Network](https://newsnetwork.mayoclinic.org/discussion/by-eliminating-bias-in-ai-models-and-offering-access-to-deidentified-data-mayo-clinic-platform-aims-to-transform-health-care) (via search snippet; direct fetch 403); [Mayo Clinic Platform_Discover](https://www.mayoclinicplatform.org/2022/03/16/mayo-clinic-platform_discover/)
- **nference nSights** gives partners access to Mayo Clinic Platform's de-identified EHR data, and a Mayo-branded version became Platform_Discover — [MobiHealthNews](https://mobihealthnews.com/news/nference-launches-real-world-data-platform-expands-mayo-clinic-partnership)
- **Optum Labs Data Warehouse (OLDW)** offers claims plus EHR-derived data. Optum's NLP turns notes into **de-identified structured data**, not raw text — [Optum NLP methods](https://www.optum.com/en/business/insights/page.hub.natural-language-processing-methods.html). Academic access runs through research credits or fee schedules, e.g., at UCSF — [UCSF OLDW](https://data.ucsf.edu/node/126)
- **Protege** (founded 2024, NYC) is a marketplace that licenses de-identified clinical records and imaging to AI developers, with de-identification, consent tracking and provenance. It claims "3B+ clinical notes" (self-reported). Shaip added EHR and physician dictation datasets in Mar 2025 and plans SOAP notes. Protege raised a $25M Series A (Aug 2025) and $30M (Jan 2026) — [SiliconANGLE Jan 2026](https://siliconangle.com/2026/01/08/protege-raises-30m-grow-governed-marketplace-ai-training-data/); [Shaip–Protege](https://www.shaip.com/press-coverage/high-quality-healthcare-data-throughpartnership-with-protege/); [Pulse 2.0 Series A](https://pulse2.com/protege-25-million-series-a-raised-for-expanding-ai-training-data-platform)
- **IQVIA** offers note-search tools (Patient Finder, Linguamatics NLP) deployed on each client's own EHR. I found no evidence that it licenses a de-identified note corpus — [UK G-Cloud listing](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/188853855521862); [IQVIA NLP quality measures](https://www.iqvia.com/-/media/iqvia/pdfs/library/fact-sheets/nlp-platform-for-quality-measures.pdf)
- **Komodo Health** sells the Healthcare Map (330M+ de-identified patients, on Snowflake Marketplace) and holds a CMS Innovator license for Medicare, Medicaid and MA encounter data. It is claims-centric, and I found no evidence of free-text notes — [Komodo CMS Innovator license](https://www.komodohealth.com/news/cms-innovators-license); [BusinessWire](https://www.businesswire.com/news/home/20231005357152/en)
- **Datavant** does tokenization and linkage of structured data. It also offers an "Unstructured De-Identification" product that pairs redaction with an "accelerated Expert Determination", pitched at "data hungry" AI — [Datavant unstructured de-ID](https://www.datavant.com/?p=2148); [Datavant Connect](https://datavant.com/white-papers/datavant-connect-overview-tokenization-technology-structured-data)
- **No public per-record prices** for de-identified notes or CPT-coded notes were found. One AWS Marketplace de-identified ophthalmology EHR sample is listed free, and custom cohorts and annotation require contacting the vendor — [AWS Marketplace listing](https://aws.amazon.com/marketplace/pp/prodview-fbwtzrrfh22n4)

### Inferences
- For a pre-bill outpatient checker, the most realistic path to real charts is **design-partner data under a BAA** (Business Associate Agreement), de-identified in-house (see Q7). Vendor datasets are more useful later for scale and specialty breadth.
- Truveta is the only vendor whose public page explicitly lists **both** notes and CPT/HCPCS. Whether raw outpatient note text is deliverable, and joinable to the professional claim lines for the same encounter, needs direct confirmation.
- Mayo's "data never leaves" model would require running the checker inside Mayo's cloud. That works for validation studies but is awkward for iterative product development.

### Gaps
- No vendor pricing was found. Industry anecdotes typically put enterprise RWD licenses in six to seven figures annually, but I found **no citable source**, so this is not asserted.
- I could not confirm whether any vendor can deliver encounter-level outpatient note text joined to professional E/M claims with modifiers.
- I could not confirm Truveta's and Protege's terms on using data to train commercial AI models.

---

## Q7. What de-identification tools and HIPAA methods apply if a builder collects real charts from design partners, and what does it cost?

### Takeaway
Open-source tools (Presidio, MIT; Philter, BSD-3) and cloud APIs (AWS Comprehend Medical DetectPHI at about $0.0014 per 100 characters, roughly $0.02–0.03 per page; Azure de-ID billed per MB) make Safe Harbor-style scrubbing cheap per note. Commercial suites like John Snow Labs are also available. A formal Expert Determination is the expensive step, quoted at $50K–$200K by one vendor blog (unverified).

### Cited Findings
- **Microsoft Presidio** is MIT-licensed. It is a "context aware, pluggable and customizable PII de-identification service for text and images", and its README warns that "there is no guarantee that Presidio will find all sensitive information" — [GitHub microsoft/presidio](https://github.com/microsoft/presidio)
- **Philter (UCSF)** is BSD-3-Clause, "open source clinical text de-identification". It is a command-line tool that removes PHI from plain text and has an evaluation mode against gold annotations — [GitHub BCHSI/philter-ucsf](https://github.com/BCHSI/philter-ucsf). It targets the 18 HIPAA PHI types. A later certified pipeline (Philter V1.0) extends the open-source beta — [UCOP Tech Awards 2022](https://www.ucop.edu/information-technology-services/_files/uc-tech-awards/2022/philter-automated-clinical-notes-de-identification-pipeline.pdf)
- **AWS Comprehend Medical** bills per unit of 100 characters (1-unit minimum), with a free tier of 85k units in the first month — [AWS pricing page](https://aws.amazon.com/comprehend/medical/pricing). DetectPHI costs about **$0.0014 per unit**, per LiteLLM docs — [LiteLLM](https://docs.litellm.ai/docs/pass_through/comprehend_medical). AWS's own cost example puts PHI detection at $714 for 30,000 pages × 1,700 characters, which works out to about $0.0014 per unit or about $0.024 per page — [AWS Enhanced Document Understanding cost](https://docs.aws.amazon.com/solutions/latest/enhanced-document-understanding-on-aws/cost.html)
- **Azure Health Data Services de-identification** is charged per MB, with 50 MB per month free. The exact rate was not visible in fetched content — [Microsoft Learn overview](https://learn.microsoft.com/en-us/azure/healthcare-apis/deidentification/overview); [Azure pricing](https://azure.microsoft.com/pricing/details/health-data-services/)
- **Manual de-identification cost benchmark.** John Snow Labs cites academic work estimating about **$0.61 per note** ($83/hour team, 135 notes/hour) and calls this infeasible at millions of notes — [John Snow Labs release](https://www.johnsnowlabs.com/john-snow-labs-de-identification-solution-enables-data-monetization-and-healthcare-innovation/)
- **Expert Determination** typically costs **$50,000–$200,000** per engagement, per a vendor blog. This is unverified — [Nirmitee](https://nirmitee.io/blog/healthcare-data-deidentification-ai-safe-harbor-expert-determination). The engagement produces a technical report plus certification and may need periodic re-assessment — [AccountableHQ](https://www.accountablehq.com/post/hipaa-de-identification-with-expert-determination-what-it-is-who-can-do-it-and-how-to-do-it-right). Safe Harbor is described as simpler and cost-effective — [Censinet](https://censinet.com/perspectives/hipaa-safe-harbor-vs-expert-determination)
- The **Safe Harbor** rules (18 identifiers, all date elements except year, 3-digit ZIP only if more than 20,000 people, ages over 89 grouped, no actual knowledge) and the **Expert Determination** standard ("very small" risk, documented methods) are set out at [45 CFR 164.514(b)](https://www.law.cornell.edu/cfr/text/45/164.514)
- **Datavant** sells unstructured de-identification with "accelerated Expert Determination" — [Datavant](https://www.datavant.com/?p=2148)

### Inferences
- **Safe Harbor's date rule matters for coding.** E/M time-based coding and the "new vs. established patient" (3-year) rule depend on dates and intervals. Strict Safe Harbor removes all date elements except year, which can break those checks. Expert Determination (which can permit shifted dates) may therefore be worth its cost for a coding test set.
- Under a BAA, a builder can often process identified PHI for the covered entity's own operations without de-identifying it. De-identification is mainly needed to **retain or reuse** charts for model development and shared benchmarks. Legal review is needed; this is not sourced here.
- PHI scrubbers degrade coding-relevant text. The medRxiv E/M study reportedly saw accuracy drop from ~75% to ~48% after de-identification (Q4, unverified). Test sets should be checked for over-redaction of clinical terms.

### Gaps
- John Snow Labs and Azure per-unit prices were not publicly confirmed. Expert Determination pricing comes from one vendor blog only.
- The HHS de-identification guidance page returned 403. The regulation text was used instead.

---

## Q8. What licensing traps exist (PhysioNet and LLM APIs, research-only DUAs, AMA CPT, non-commercial licenses)?

### Takeaway
Four traps matter most:
1. **PhysioNet data is for scientific research only, per individual user.** It may go only to LLM APIs with the right no-retention and no-human-review terms; consumer ChatGPT is barred.
2. **The n2c2 corporate DUA allows testing a tool but not incorporating the data into a product.**
3. **The AMA prohibits using its CPT data file to train or fine-tune AI.** Every product containing CPT codes needs a license.
4. **Several of the best coding datasets are NC** (non-commercial): Amazon's ACI-Bench ICD-10, MedCodER and Asclepius.

### Cited Findings
- **PhysioNet + online LLMs (post dated Apr 18, 2023).** The DUA "explicitly prohibits sharing access to the data with third parties, including sending it through APIs" from companies like OpenAI, and ChatGPT is barred. Permitted routes listed are: Azure OpenAI with opt-out of human review; Amazon Bedrock, where fine-tuned copies stay private; Google Gemini via Vertex AI, which does not train on prompts; and Anthropic Claude, which does not train on prompts by default and does no routine human review — [PhysioNet responsible LLM use](https://physionet.org/news/post/gpt-responsible-use)
- PhysioNet's FAQ: "Current policy requires adherence to a zero data retention policy"; "Local LLM models can be used without restrictions"; credentialed access is individual, and "Sharing data within teams or classes is not permitted" — [PhysioNet FAQ](https://physionet.org/about/faqs/)
- **PhysioNet DUA text.** Access is "for the sole purpose of lawful use in scientific research". Users "will not share access to PhysioNet restricted data with anyone else", must not attempt re-identification, must report PHI to PHI-report@physionet.org, and must contribute code to an open repository if they openly disseminate results. The DUA does not mention commercial use explicitly — [PhysioNet Credentialed DUA (MIMIC-IV 3.1)](https://physionet.org/content/mimiciv/view-dua/3.1/)
- **n2c2 corporate DUA** allows "evaluation and testing of a natural language processing tool", but the permission "will not extend to proposals that include or incorporate the Data / Datasets into such product". No redistribution is allowed, including GitHub — [n2c2 DUA](https://n2c2.dbmi.hms.harvard.edu/data-use-agreement) (via search snippet)
- **AMA CPT licensing (FAQ updated Jul 14, 2026).** "Organizations across the globe must have a license for each product that contains CPT codes". "Using the CPT Standard Data File to train, fine-tune, or improve AI models is prohibited". Permitted under the AI Addendum are "traditional machine learning (e.g., predictive analytics) for internal use" and "retrieval‑based AI that references content when needed". Distribution or monetization of AI outputs must follow the license — [AMA CPT licensing AI FAQs](https://www.ama-assn.org/practice-management/cpt/licensing-cpt-ai-faqs)
- **Licenses of key datasets**:
  - Non-commercial (NC): Amazon ACI-Bench ICD-10 annotations (CC-BY-NC-4.0) — [GitHub](https://github.com/amazon-science/toward-clinical-coding-verification-adaptation); MedCodER (CC BY-NC-ND 4.0) — [Zenodo](https://zenodo.org/records/13308316); Asclepius synthetic (CC-BY-NC-SA 4.0) — [HF](https://huggingface.co/datasets/starmpcc/Asclepius-Synthetic-Clinical-Notes)
  - Commercial-friendly: ACI-Bench (CC BY 4.0) — [GitHub](https://github.com/wyim/aci-bench); MTS-Dialog (CC BY 4.0) — [GitHub](https://github.com/abachaa/MTS-Dialog); PriMock57 (CC BY 4.0) — [LICENSE](https://raw.githubusercontent.com/babylonhealth/primock57/main/LICENSE.md); CodiEsp (CC BY 4.0) — [Zenodo](https://zenodo.org/records/3837305); augmented-clinical-notes (MIT) — [HF](https://huggingface.co/datasets/AGBonnet/augmented-clinical-notes); Synthea (Apache 2.0) — [GitHub](https://github.com/synthetichealth/synthea); MDACE annotations (MIT, but the underlying text is under the PhysioNet DUA) — [MDACE paper](https://arxiv.org/pdf/2307.03859); CMS synthetic claims ("without restrictions") — [CMS user guide](https://data.cms.gov/sites/default/files/2023-05/d51e1218-68c3-4c7c-9598-0b81f22fe903/User%20Guide%20-%20CMS%20Synthetic%20RIF%20Files%20May%202023_AM508_v2.pdf)
- **License caveat for synthetic derivatives.** A dataset card's license covers only that dataset's own content, and upstream sources may carry their own terms — [search summary re HF cards](https://huggingface.co/datasets/AGBonnet/augmented-clinical-notes/blob/3b250abeb9a326c64be5723fdd67d82fc9ef0ee8/README.md). For example, augmented-clinical-notes embeds PMC-Patients text, and MedSynth is seeded from IQVIA claims statistics — [HF MedSynth](https://huggingface.co/datasets/Ahmad0067/MedSynth)

### Inferences
- **Using MIMIC with a hosted LLM** is allowed only through the vetted enterprise endpoints with zero data retention and no human review. A startup must also be comfortable that its use is "scientific research" rather than product development. Building and selling a product trained on MIMIC is legally gray at best, and counsel should review it. MIMIC is safer as an **internal research benchmark** with published methods.
- **CPT inside datasets.** MIMIC-III CPTEVENTS, CMS PUFs and MDACE all contain CPT codes. Displaying CPT descriptors in a commercial product, or fine-tuning on the AMA data file, needs an AMA license. The AMA FAQ specifically prohibits training on the CPT Standard Data File. Whether training on *claims or notes that merely contain CPT numbers* is restricted is unclear (see Gaps).
- A practical stack would look like this:
  - Commercial-safe seed notes: ACI-Bench, MTS-Dialog, PriMock57.
  - In-house certified-coder labels for E/M, CPT, ICD-10 and modifiers.
  - Internal-only evaluation on: the Amazon ICD-10 set (NC), MDACE Profee and MIMIC-III CPTEVENTS (research DUA).
  - CMS PSPS/PUF for priors.
  - Design-partner charts under BAA for the real test set.

### Gaps
- The AMA FAQ does not say whether numeric CPT codes in third-party data (claims, notes) count as "CPT content" for the training prohibition. The AMA should be asked directly.
- PhysioNet's policy on commercial entities and commercial product development was not explicitly stated in the fetched pages. The 2023 LLM post may have been superseded; the FAQ now references a "zero data retention policy".

---

## Q9. Consolidated catalog: every dataset, at a glance

### Takeaway
No single public dataset tests an outpatient E/M + CPT + ICD-10 + modifier checker end-to-end. The best available components are:
- **Outpatient ICD-10:** Amazon ACI-Bench ICD-10 (207 notes, NC license).
- **Profee evidence spans, no E/M:** MDACE Profee (52 charts).
- **Real notes with inpatient/ICU E/M:** MIMIC-III CPTEVENTS.
- **Seed notes to hand-label:** ACI-Bench, MTS-Dialog, PriMock57, MTSamples.
- **Reference distributions:** CMS PSPS and Provider & Service PUFs.

### Cited Findings

Usefulness ratings (High/Med/Low) are my assessment for an **outpatient E/M/CPT/ICD-10 pre-bill checker**. The reasons are in the Inferences sections above, and sources are linked per row.

| Dataset (owner) | Size | Setting | Notes? | Codes | Access / license | Commercial use? | Cost | Usefulness | Source |
|---|---|---|---|---|---|---|---|---|---|
| MIMIC-III v1.4 (MIT LCP/BIDMC) | >40k ICU pts, 2001–12 | ICU/inpatient | Yes (discharge, progress, radiology, ECG) | ICD-9 dx/px; **CPT incl. inpatient/critical-care E/M** (demo: 1,150/1,579 CPT rows are E/M) | PhysioNet credentialed + CITI + DUA 1.5.0 | Research-only DUA | Free | **Med** (only real notes + E/M, but inpatient E/M) | [PhysioNet](https://physionet.org/content/mimiciii/1.4/); [demo CPTEVENTS](https://www.physionet.org/files/mimiciii-demo/1.4/CPTEVENTS.csv) |
| MIMIC-IV v3.1 | 364,627 pts; 546,028 admissions; 2008–22 | Hospital/ICU (+ outpatient vitals in omr) | No (notes in -Note) | ICD-9 + ICD-10 dx/px; HCPCS (demo: observation G0378/9921x, procedures); DRG | Credentialed DUA | Research-only | Free | Low–Med | [PhysioNet](https://physionet.org/content/mimiciv/3.1/); [demo](https://physionet.org/content/mimic-iv-demo/2.2/) |
| MIMIC-IV-Note v2.2 | 331,794 discharge + 2.32M radiology | Hospital/ED | Yes | Link to MIMIC-IV codes | Credentialed DUA | Research-only | Free | Low (no office notes) | [PhysioNet](https://physionet.org/content/mimic-iv-note/2.2/) |
| MIMIC-IV-ED v2.2 | ~425k ED stays, 2011–19 | ED | Chief complaint only | ICD-9/10 ED dx (≤9/stay) | Credentialed DUA | Research-only | Free | Low | [PhysioNet](https://physionet.org/content/mimic-iv-ed/2.2/) |
| eICU-CRD v2.0 (Philips/MIT) | 200k+ ICU stays, 208 hospitals, 2014–15 | ICU | Structured note templates only | Dx strings w/ ICD-9 + ICD-10 | Credentialed DUA | Research-only | Free | Low | [PhysioNet](https://physionet.org/content/eicu-crd/2.0/); [demo](https://physionet.org/files/eicu-crd-demo/2.0.1/) |
| MDACE (3M/Solventum, ACL 2023) | 302 inpatient + **52 Profee** charts; 9.5k evidence spans | Inpatient & profee (MIMIC-III) | Via MIMIC-III | ICD-10 (→ICD-9 via GEMs); CPT (Profee); **E/M excluded** | MIT annotations + MIMIC-III DUA | Annotations yes; text research-only | Free | **Med–High** for evidence/ICD/CPT-procedure; none for E/M | [arXiv](https://arxiv.org/pdf/2307.03859) |
| n2c2/i2b2 (Harvard DBMI) | Multiple challenge sets | Mostly inpatient | Yes | No billing codes found | Per-user DUA; academic & corporate | Corporate: test only, not in product | Free | Low | [n2c2 DUA](https://n2c2.dbmi.hms.harvard.edu/data-use-agreement) |
| CodiEsp (BSC) | 1,000 cases | Case reports (Spanish) | Yes (+MT English) | ICD-10-CM/PCS (CIE10) | CC BY 4.0 | Yes | Free | Low (Spanish, case reports) | [Zenodo](https://zenodo.org/records/3837305) |
| **Amazon ACI-Bench ICD-10** (EMNLP 2025) | 207 notes (67/20/120) | **Outpatient-style** | Yes (+dialogue) | **ICD-10-CM** (double-annotated + arbitrated) | GitHub annotations + ACI-Bench | **CC-BY-NC-4.0** | Free | **High** for ICD-10; none for CPT/E/M | [GitHub](https://github.com/amazon-science/toward-clinical-coding-verification-adaptation); [arXiv](https://arxiv.org/html/2510.07629) |
| MedCodER (Deloitte 2024) | Small (text.csv 506 kB) | Not stated | Yes | ICD-10-CM + evidence | Zenodo | **CC BY-NC-ND 4.0** | Free | Low–Med | [Zenodo](https://zenodo.org/records/13308316); [arXiv](https://arxiv.org/html/2409.15368v1) |
| MedSynth (2025) | 10,240 pairs, 2,000 ICD-10 codes | Synthetic SOAP | Yes (+dialogue) | ICD-10 (1 per pair) | HF; license not shown | Unclear | Free | Low–Med (synthetic, single code) | [HF](https://huggingface.co/datasets/Ahmad0067/MedSynth) |
| ProFees (Oracle 2025) | 216 encounters | Outpatient/preventive | Yes | **CPT E/M + MDM levels** | **Not released** | n/a | n/a | n/a (design reference only) | [arXiv](https://arxiv.org/html/2510.25007v1) |
| ACI-Bench (MSFT/Nuance/UW) | 207 encounters | Clinic visits (role-played) | Yes (+dialogue/audio-ASR) | None | CC BY 4.0 | Yes | Free | **High** as seed for in-house E/M labeling | [GitHub](https://github.com/wyim/aci-bench) |
| MTS-Dialog | ~1.7k pairs (+3.6k aug) | Clinic encounters (snippets) | Note sections | None | CC BY 4.0 | Yes | Free | Med (section-level, not full notes) | [GitHub](https://github.com/abachaa/MTS-Dialog) |
| PriMock57 (Babylon) | 57 consults | Mock primary care | Yes (+audio) | None | CC BY 4.0 | Yes | Free | Med (small) | [GitHub](https://github.com/babylonhealth/primock57) |
| MTSamples (Kaggle) | 4,999 samples | Multi-specialty transcriptions | Yes | None | CC0 on Kaggle (site terms unverified) | Likely, verify | Free | **Med–High** seed for CPT procedure + E/M labeling | [clinspacy docs](https://search.r-project.org/CRAN/refmans/clinspacy/html/dataset_mtsamples.html) |
| Asclepius synthetic | 158,114 notes | Synthetic discharge | Yes | None | CC-BY-NC-SA 4.0 | **No** | Free | Low | [HF](https://huggingface.co/datasets/starmpcc/Asclepius-Synthetic-Clinical-Notes) |
| augmented-clinical-notes (EPFL) | 30,000 triplets | Case reports + synthetic dialogue | Yes | None | MIT (upstream PMC terms) | Likely | Free | Low | [HF](https://huggingface.co/datasets/AGBonnet/augmented-clinical-notes) |
| Synthea (MITRE) | Unlimited (generator) | Synthetic longitudinal | Templated (FHIR R4 + US Core only) | SNOMED, LOINC, RxNorm, CVX (CSV); ICD-10/HCPCS via RIF mapping | Apache 2.0 | Yes | Free | Low (codes unrealistic for coding QA) | [GitHub](https://github.com/synthetichealth/synthea); [CSV dict](https://github.com/synthetichealth/synthea/wiki/CSV-File-Data-Dictionary) |
| CMS Synthetic Medicare Claims PUFs (2023) | 8,671 benes; 1.12M carrier claims | Synthetic claims | No | ICD-10-CM, HCPCS, NDC | Public, "without restrictions" | Yes | Free | Low–Med (claim-format/edit testing) | [User guide](https://data.cms.gov/sites/default/files/2023-05/d51e1218-68c3-4c7c-9598-0b81f22fe903/User%20Guide%20-%20CMS%20Synthetic%20RIF%20Files%20May%202023_AM508_v2.pdf) |
| CMS DE-SynPUF (2008–10) | ~2.3M benes | Synthetic claims | No | ICD-9-era, HCPCS (not verified) | Public domain | Yes | Free | Low | [CMS](https://www.cms.gov/data-research/statistics-trends-and-reports/medicare-claims-synthetic-public-use-files/cms-2008-2010-data-entrepreneurs-synthetic-public-use-file-de-synpuf) |
| CMS Physician & Other Practitioners by Provider & Service | National, NPI × HCPCS × POS | Part B professional | No | HCPCS/CPT counts, $ | Public | Yes (CPT descriptors AMA) | Free | **High** as priors | [Methodology](https://data.cms.gov/resources/medicare-physician-other-practitioners-methodology) |
| CMS PSPS | National Part B by HCPCS × **modifier** × specialty × POS | Part B | No | HCPCS + modifiers | Public (suppressed) / LDS w/ DUA | Public yes | Free / $400 LDS | **High** as priors (E/M mix, modifier rates) | [CMS PSPS](https://www.cms.gov/data-research/cms-data/limited-data-set-lds-files/physician/supplier-procedure-summary-psps) |
| CMS CERT supplemental data | Annual, 2017–2025 | Medicare FFS | No | Error rates by service | Public | Yes | Free | Med (error-category priorities) | [CERT reports](https://cms.gov/research-statistics-data-and-systems/monitoring-programs/medicare-ffs-compliance-programs/cert/cert-reports) |
| HCUP (AHRQ) e.g., NASS | National/state samples | Facility (inpatient, ED, amb. surgery) | No | ICD-10 dx/px (CPT not confirmed) | DUA + training | Unclear | ~$200–$1,000+ per year/db | Low | [HCUP](https://hcup-us.ahrq.gov/tech_assist/centdist.jsp) |
| Truveta | 130M+ pts; 7–8B+ notes | Multi-setting EHR + claims | Yes (form of delivery unclear) | ICD, SNOMED, CPT, HCPCS… | Commercial license | Yes (terms unknown) | Undisclosed | Potentially High; unverified | [Truveta Data](https://truveta.com/truveta-data) |
| Mayo Clinic Platform_Discover / nference | ~0.5–0.7B notes | Multi-setting | Yes (stays in Mayo cloud) | Dx, meds, labs… | Partnership | Yes, in-enclave | Undisclosed | Med (enclave-only) | [Mayo](https://www.mayoclinicplatform.org/2022/03/16/mayo-clinic-platform_discover/) |
| Optum Labs (OLDW) | Large claims + EHR | Multi-setting | NLP-derived concepts | Claims codes | Research partnerships / fees | Varies | Undisclosed | Low–Med | [Optum NLP](https://www.optum.com/en/business/insights/page.hub.natural-language-processing-methods.html) |
| Protege (marketplace) | "3B+ notes" (claimed) | Varies by supplier | Yes | Varies | Commercial license | Yes (AI-training focus) | Undisclosed | Potentially High; unverified | [SiliconANGLE](https://siliconangle.com/2026/01/08/protege-raises-30m-grow-governed-marketplace-ai-training-data/) |

### Inferences
- **Recommended minimum test harness (my synthesis).**
  1. **ICD-10-CM accuracy:** the Amazon ACI-Bench 207-note set (internal evaluation, NC).
  2. **Evidence-span faithfulness:** MDACE Profee and Inpatient (research DUA).
  3. **E/M leveling and CPT/modifier logic:** a new in-house gold set. Have two certified coders code 200–500 notes from ACI-Bench, MTS-Dialog, PriMock57 and MTSamples, plus de-identified design-partner charts, with adjudication. Under the 2021+/2024 AMA MDM rules, record the problem, data and risk sub-levels, as ProFees did.
  4. **Distribution sanity:** CMS PSPS and the Provider & Service PUF.
  5. **Claim-format and edit testing:** the CMS synthetic claims.
- The single largest gap in the public landscape is **office/outpatient professional notes with E/M levels and modifiers**. Producing even a small, permissively licensed set would be a differentiating asset.

### Gaps
- Several sizes and licenses could not be verified on primary pages: MTSamples site terms, MedSynth license, the current MDACE repo, the full n2c2 list, and vendor terms and pricing.
- HCUP pricing is from a 2021 catalog and may be out of date.
