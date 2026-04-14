# BBA Advisory Portal — AI-Assisted Student Services Platform

> **BUAD 5722 — Big Data | William & Mary, Mason School of Business | Spring 2025 | Team 13**

A full-stack web application that replaces manual email-based advising workflows with an integrated, FERPA-compliant digital portal — built for an anonymous higher education client using generative AI.

 **Live Site:** [mason-bba.vercel.app](https://mason-bba.vercel.app)

---

## Table of Contents

- [Why This Project Matters](#why-this-project-matters)
- [Project Scope](#project-scope)
- [Project Details](#project-details)
- [Team](#team)
- [Kanban Board](#kanban-board)
- [What's Next](#whats-next)
- [Responsible AI Considerations](#responsible-ai-considerations)
- [References](#references)

---

## Why This Project Matters

University advising offices are under-resourced and overwhelmed. Students send emails asking the same questions repeatedly — transfer credit eligibility, registration deadlines, graduation requirements — and wait days for answers that already exist in a spreadsheet somewhere. Advisors spend a significant portion of their time answering routine inquiries instead of focusing on the high-value, nuanced conversations that actually move students forward.

Research confirms this gap. Muñoz et al. (2023) found that AI-supported academic advising can meaningfully improve access to advising services, particularly for students from disadvantaged backgrounds who rely more heavily on institutional support systems. Their study demonstrated that FAQ-based AI tools, when properly integrated with human review workflows, reduce response latency and increase student engagement with advising resources.

For businesses and institutions more broadly, the same dynamic applies: as service volume scales, the cost of handling routine inquiries manually becomes unsustainable. Automating tier-1 responses — while keeping humans in the loop for complex cases — is a proven pattern in customer service, healthcare triage, and now higher education. This project builds that pattern for a real advising office, using free-tier infrastructure and tools the client already uses.

---

## Project Scope

**This project is narrowly scoped to one problem:** replacing email as the primary communication channel between BBA undergraduate students and the advising office of one anonymous Mason School of Business program.

**In scope:**
- A public student portal covering: transfer credit lookup, FAQ self-service, advising appointment booking, contact form submission, and course planning
- A private staff dashboard covering: email inbox management, FAQ escalation queue, transfer credit administration, and advising appointment context
- Real-time data sync between Google Sheets (content) and both portals
- Student email submissions routed to a PostgreSQL database and surfaced in the staff inbox with AI-assisted draft replies
- Supabase-based authentication for staff access (FERPA compliance)

**Out of scope:**
- Integration with Banner, DegreeWorks, or any W&M ERP system
- Direct sending of emails from the portal (submissions open the user's mail client)
- Native mobile app
- AI that autonomously responds to students without staff review

---

## Project Details

### Architecture

The system consists of two HTML files served from Vercel, sharing a Supabase PostgreSQL database and a Google Sheets CMS layer.

```
Student Portal (student.html) Staff Dashboard (staff.html)

 Supabase (PostgreSQL) 
 student_emails table 
 RLS policies 

 Google Sheets (CMS) 
 FAQ answers (col B) 
 Transfer credit records 

```

### Student Portal — 6 Tabs

| Tab | Function |
|-----|----------|
| **Home** | Announcements and quick links |
| **Transfer Credits** | Search 360 records across 108 institutions; submit request via MS Forms |
| **FAQ** | 65 answers across 8 categories; live keyword search; auto-refreshes from Google Sheets every 60s |
| **Guidance & Advising** | 4-step booking form → pre-fills W&M Outlook calendar booking page |
| **Contact BBA Office** | Structured form → opens mail client pre-filled + saves to Supabase simultaneously |
| **Course Planning** | Interactive semester worksheet; download as PDF or Excel; links to official curriculum guides |

### Staff Dashboard — 5 Tabs

| Tab | Function |
|-----|----------|
| **Overview** | Stat cards, workflow health, quick actions |
| **Transfer Credits** | Full table, filters, expiry flags, CSV export |
| **FAQ Escalations** | Unresolved queue; respond and push answers to live FAQ |
| **Advising Appointments** | Student-submitted summaries for advisor prep |
| **Email Inbox** | Pulls from Supabase; auto-matches query to FAQ knowledge base; pre-fills draft reply; staff edits before sending |

### Technology Stack

| Layer | Tool | Cost |
|-------|------|------|
| Hosting | Vercel (Hobby) | Free forever |
| Database + Auth | Supabase (Free tier) | Free forever |
| Content management | Google Sheets | Free |
| Version control | GitHub (Private repo) | Free |
| Frontend | Vanilla HTML/CSS/JS | — |

### Key Design Decisions

**Single-file architecture.** Each portal is one self-contained HTML file with no build tools, no frameworks, and no external CSS/JS dependencies beyond Google Fonts and Supabase SDK. This makes the system easy to hand off to non-developers and eliminates deployment complexity.

**Google Sheets as CMS.** Staff already use Google Sheets daily. Rather than introducing a new CMS, we connected directly to their existing spreadsheets. They edit a cell; the portal updates within 60 seconds. No Vercel login, no code change, no redeployment.

**Supabase for FERPA compliance.** All student data (name, ID, email, submissions) is stored in a private PostgreSQL database with row-level security policies. Students can insert rows but cannot read others' data. Staff access requires Supabase authentication. Nothing sensitive is stored in the public GitHub repo or in browser localStorage.

**Integration over replacement.** Every external tool (Outlook booking, Microsoft Forms, mason.wm.edu PDFs, bba@mason.wm.edu) was integrated rather than replaced, minimizing change management burden on the client.

---

## Team

> *Client identity withheld per client request.*

| Member | Role |
|--------|------|
| **Latisha Khorana** | Project lead · Authentication · FERPA compliance · Login system |
| **Turner** | Email module · FAQ keyword matching · Staff inbox |
| **Violet** | Guidance & Advising tab · Calendar/booking integration |
| **Bryce** | Bug testing · Meeting notes · QA |

 **Project repository:** [github.com/lkhorana](https://github.com/lkhorana)

---

## Kanban Board

### Done

| Task | Owner | Notes |
|------|-------|-------|
| Client discovery meeting | Team | 18 February 2025 |
| Requirements & scope definition | Team | Outcome of Feb 18 meeting |
| Student portal — Transfer Credits tab | Latisha | 360 records, 108 institutions, expiry flags |
| Student portal — FAQ tab | Latisha | 65 answers, 8 categories, live search |
| Student portal — Guidance & Advising tab | Violet | 4-step form, Outlook booking integration |
| Student portal — Contact BBA Office | Turner | Email form + preview |
| Student portal — Course Planning tab | Latisha | Semester cards, PDF/Excel download |
| Staff dashboard — Email Inbox module | Turner | FAQ matching, draft pre-fill |
| Staff dashboard — FAQ Escalations tab | Latisha | Respond + push to FAQ |
| Staff dashboard — Transfer Credits tab | Latisha | Full table, filters, CSV export |
| Staff dashboard — Advising Appointments | Violet | Student summary modal |
| Supabase authentication + login page | Latisha | Session-based, no hardcoded emails |
| FERPA compliance review | Latisha | RLS policies, auth gate, no PII in repo |
| Google Sheets CMS integration | Latisha | 60s auto-refresh, gviz CSV endpoint |
| Supabase `student_emails` table + RLS | Latisha | Insert/select policies |
| Student email → Supabase → Staff inbox | Latisha | Real-time, any device |
| Client check-in meeting | Team | 19 March 2025 |
| Vercel deployment + GitHub integration | Latisha | Auto-deploy on push |
| Bug testing + QA passes | Bryce | Multiple rounds |
| Staff inbox Supabase read fix | Latisha | emLoadStudentEmails scope resolved |
| Google Sheets published URL fix | Latisha | Switched to gviz CSV endpoint |

### Future Improvements

| Task | Notes |
|------|-------|
| Banner/DegreeWorks API integration | Pull live credit counts into Course Planning tab |
| Push notifications for staff | Alert when new email submission arrives |
| Student authentication | Allow students to save/resume course plans |
| Analytics dashboard | Track most-searched FAQ terms, peak usage times |
| Multi-language support | Thai, Mandarin for international students |
| Native mobile app | React Native wrapper |
| Supabase ownership transfer to client | Settings → General → Transfer project |

---

## What's Next

**Near-term (1–3 months)**

The most impactful next step is connecting the portal to **Banner and DegreeWorks** via W&M's existing APIs. Currently, the course planning tab relies on manual student input. A live integration would pull the student's actual credit count, completed courses, and remaining requirements directly, eliminating data entry and reducing advising prep time significantly.

**Medium-term (3–12 months)**

The staff email inbox currently surfaces a pre-drafted reply based on FAQ keyword matching. A more sophisticated model — fine-tuned on historical advising email threads — could generate contextually aware responses rather than FAQ lookups. This would be particularly valuable for complex, multi-part student questions that don't map cleanly to a single FAQ entry.

A **student-facing authentication layer** (separate from the staff auth) would allow students to save course plans, track advising appointment history, and receive proactive notifications about registration deadlines or expiring transfer credit decisions.

**Long-term (12+ months)**

**Predictive risk flagging:** Using historical advising records and course performance data, a model could identify students at risk of not meeting graduation requirements and surface them to advisors before the problem becomes critical. This is a well-documented application of learning analytics in higher education (Frontiers in Education, 2025).

**Institutional scalability:** The architecture is deliberately generic — Google Sheets CMS, Supabase auth, Vercel hosting, vanilla HTML. Any advising office at any institution could fork this repository, swap in their own FAQ data and transfer credit records, and have a working portal within hours.

**Concerns to watch**

- **Advisor over-reliance:** If staff begin treating the AI-drafted reply as final rather than as a starting point, response quality may decline. Clear UX signals (the draft is explicitly labeled as requiring review) are a first-line mitigation, but ongoing monitoring matters.
- **Data governance on transfer:** When the Supabase project is transferred to the client, clear documentation of what data is stored, how long it is retained, and who has access needs to accompany the handoff.
- **Maintenance burden:** The Google Sheets dependency means a corrupted or accidentally deleted sheet could break the FAQ and transfer credit features. A scheduled backup process should be implemented.

---

## Responsible AI Considerations

This project used Claude (Anthropic) as the primary generative AI tool for code generation, architecture design, and documentation. The following principles guided our use:

**Human review at every output.** No AI-generated code was deployed without review. The staff email draft feature is explicitly framed as a starting point requiring human editing before sending — the UI labels it "review before sending" and the original FAQ answer is preserved separately so staff can verify the source.

**No autonomous student-facing AI responses.** The portal does not send any message to a student without a staff member reviewing and actively sending it. The AI assists drafting; humans decide what gets sent.

**FERPA and data minimization.** We collected only the data fields needed for each form. Student IDs and email addresses are stored in Supabase (private, RLS-protected) and never in the public repository, browser storage, or logs.

**Transparency with the client.** The client was informed that Claude was used to generate the codebase and that the system includes AI-assisted features (FAQ matching, draft reply generation). They reviewed the system and approved its deployment.

**Bias in FAQ matching.** The keyword-matching algorithm is simple and deterministic — it matches on exact keywords from a hardcoded list. This is intentionally conservative: a more sophisticated semantic model could introduce hallucination risk in an advising context where accuracy is critical. Future iterations should evaluate retrieval-augmented generation (RAG) approaches with appropriate guardrails.

**Model limitations acknowledged.** Claude-generated code was not always correct on the first pass — particularly around JavaScript scope, Supabase RLS policies, and browser security constraints. This reinforces the importance of human review rather than treating AI output as ground truth.

---

## References

### Primary Research Paper

Muñoz, A., Peña, J., & Aguilar, J. (2023). AI-supported academic advising: Exploring ChatGPT's current state and future potential toward student empowerment. *Education Sciences, 13*(9), 885. https://doi.org/10.3390/educsci13090885

> Directly relevant to this project: the authors evaluate AI tools for academic advising across real student FAQ datasets, finding that AI can meaningfully reduce response latency and expand advising access for underserved students, while underscoring the importance of human oversight in the loop.

### Additional References

Frontiers in Education. (2025). *Artificial intelligence in higher education institutions: Review of innovations, opportunities and challenges.* https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1530247/full

Frontiers in Education. (2025). *Implementing artificial intelligence in academic and administrative processes through responsible strategic leadership in higher education institutions.* https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1548104/full

Supabase. (2024). *Row level security.* https://supabase.com/docs/guides/database/postgres/row-level-security

Supabase. (2024). *Authentication documentation.* https://supabase.com/docs/guides/auth

Vercel. (2024). *Hobby plan documentation.* https://vercel.com/docs/accounts/plans/hobby

Family Educational Rights and Privacy Act (FERPA), 20 U.S.C. § 1232g; 34 CFR Part 99. U.S. Department of Education. https://www.ed.gov/ferpa

W&M Mason School of Business. (2025). *BBA undergraduate program — course planning resources.* https://mason.wm.edu/undergraduate/

---

*Built with Claude (Anthropic) · Hosted on Vercel · Database by Supabase · Spring 2025*
