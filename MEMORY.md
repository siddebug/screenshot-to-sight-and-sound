# Project Memory & Agent Guidelines

## Core Principles
1. **Always Update Memory**: Keep this document and workspace context updated with architecture decisions, status, and pending tasks after every meaningful change.
2. **GitHub Commits (Explicit Confirmation Required)**: **NEVER** push or commit to GitHub automatically. Always summarize changes and ask the user for explicit approval before invoking any commit or sync script.
3. **Decoupled Standalone Architecture**: Completely independent from Lovable and TanStack Start. Clean, modular Vite + React + React Router v6 application.
4. **Target GitHub Repository**: `https://github.com/siddebug/Medicate` (Branch: `main`).
5. **Auth Token**: `C:\Users\SIDDHARTH GAJJAR\Downloads\gabru.txt`.

---

## Technical Architecture (Pure React)

### Framework & Styling
- **Build Tool:** Vite 6 + TypeScript 5
- **Framework:** React 18 / 19
- **Routing:** React Router v6 (`react-router-dom`) with `BrowserRouter`
- **Styling:** Tailwind CSS (`tailwind.config.js` with bespoke `#1B3B2B`, `#2D5A43`, `#FBF9F5`, `#D97757` palette)
- **Icons:** Lucide React
- **Global State:** React Context (`AppContext.tsx`) with automatic `localStorage` synchronization (`medicate_standalone_v1`)

---

## File Map & Responsibilities

| File Path | Description / Responsibility |
|:---|:---|
| [`index.html`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/index.html) | Root HTML with Cormorant Garamond & Plus Jakarta Sans typography |
| [`src/main.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/main.tsx) | React DOM entry point wrapping `BrowserRouter` and `AppProvider` |
| [`src/App.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/App.tsx) | Client router wiring with `AppShell` and global `Toast` |
| [`src/index.css`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/index.css) | Custom scrollbars, glassmorphism, and color utilities |
| [`src/types/index.ts`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/types/index.ts) | Domain interfaces for Orders, Prescriptions, Appointments, Couriers, and Reports |
| [`src/data/mockData.ts`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/data/mockData.ts) | Courier configs (Blue Dart, Delhivery, DTDC, DHL, FedEx, India Post), 6 specialties with triage boundaries, seed queue |
| [`src/context/AppContext.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/context/AppContext.tsx) | Central store with local storage, role switcher, shared prescriptions, reports, fees |
| [`src/components/AppShell.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/components/AppShell.tsx) | Dual-mode navigation: Patient bottom bar (5 tabs) vs Doctor Console (4 clinical tabs) + header |
| [`src/components/DoctorConsole.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/components/DoctorConsole.tsx) | Doctor Practice workspace (Queue, EMR & Lab Viewer, Rx Pad & Dispatch, Fee Settings) |
| [`src/components/Toast.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/components/Toast.tsx) | Non-intrusive floating feedback pill |
| [`src/components/UpiPaymentFlow.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/components/UpiPaymentFlow.tsx) | Zero-fee Bharat UPI QR & 1-tap mobile intent (`upi://pay`) with 12-digit UTR verification |
| [`src/services/db.ts`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/services/db.ts) | Unified Database and Storage service layer compatible with PocketBase REST API and local fallback |
| [`src/pages/Home.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/pages/Home.tsx) | Countdown timer, doctor credentials, quick actions, daily video reels modal |
| [`src/pages/Conditions.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/pages/Conditions.tsx) | 6 specialties with transparent "Where Homeopathy Helps" vs "When to See Allopathy / ER" |
| [`src/pages/BookAppointment.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/pages/BookAppointment.tsx) | 5-step booking wizard with calendar slot selection, lab report uploader, dynamic fee calculation, printable receipt |
| [`src/pages/VideoConsult.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/pages/VideoConsult.tsx) | Virtual waiting room with text-only patient check-in & doctor-exclusive WhatsApp video call initiation, in-call chat, case notes |
| [`src/pages/Medicines.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/pages/Medicines.tsx) | Signed e-prescription card, 4-stage tracking stepper, 1-tap courier redirection + AWB copy toast |
| [`src/pages/Records.tsx`](file:///C:/Users/SIDDHARTH%20GAJJAR/.gemini/antigravity/scratch/Medicate/src/pages/Records.tsx) | Patient health passport, encrypted diagnostic reports vault, report preview modal, upload report dialog, consultation history |

## Architecture & Database Design Artifact
- Comprehensive 100% Free / Zero-Cost architecture documented in:
  `medicate_architecture_and_database_design.md` (Artifact).
- **Zero-Cost Stack Highlights:**
  - Video: **Direct WhatsApp Video Call Trigger** (`https://wa.me/<number>?text=...`). **Asymmetric Communication Policy:** ONLY the doctor (Dr. Chetali) has the authority to initiate video calls to the patient; patients have text-only permissions (via WhatsApp text check-in or chat) to maintain clinical boundaries and prevent unscheduled calls.
  - Backend Alternative to Supabase: **PocketBase** (lightweight single-binary Go backend with embedded SQLite, built-in Auth, Realtime SSE events, and file storage) or self-hosted Node.js + SQLite/Drizzle.
  - Payments: Direct 0% commission UPI Intent & Dynamic QR Generator (`upi://pay?pa=...`) with UTR reference verification.
  - Logistics: Direct public AWB deep links (Blue Dart, Delhivery, DTDC, India Post, DHL, FedEx) with zero aggregator API costs.

---

## Role Separation Summary

1. **Patient View (`role: 'patient'`)**:
   - Palette: Warm cream (`#FBF9F5`) and forest green (`#2D5A43`).
   - Personal greeting: "Hello, Aarav 👋".
   - 5 Navigation Tabs: Home, Specialties, Book, Medicines, Records.
2. **Doctor Console (`role: 'doctor'`)**:
   - Palette: Clinical deep slate / emerald (`bg-emerald-950 text-white`).
   - Clinical header: "Dr. Chetali Damania · CCAH · Medalist in BHMS · Reg. GHC-2451".
   - Credentials: CCAH (Certificate Course in Advanced Homeopathy), Medalist in BHMS, Advanced Diploma in Dietetics and Nutrition.
   - 4 Dedicated Clinical Tabs: Queue, Patients (EMR), Rx & Dispatch, Settings.

---

## Clinical Conditions & Specialties (11 Clinical Domains)
1. **Women's Health**: PMOS, Menopause, Menstrual irregularities, Infertility (replaces Hormones / PCOS).
2. **Endocrinology**: Diabetes, Under active thyroid, Hyper-thyroidism.
3. **Gastro-Intestinal Diseases**: Acidity, GERD, IBS, IBD, Gastritis, Chronic constipation, Piles, Fissures.
4. **Auto-Immune Diseases**: Urticaria, Psoriasis, Psoriatic arthritis, Lichen planus, Cancer complementary care, Rheumatoid arthritis.
5. **Arthritis & Joint Pain**: Osteoarthritis, Rheumatoid arthritis, Cervical spondylosis, Lumbar spondylosis, Gout, Sciatica.
6. **Respiratory Diseases**: Chronic cold, Laryngitis, Asthma, Bronchitis, Sinusitis.
7. **Renal Diseases**: Kidney stones, UTI, Cystitis, Chronic kidney disease.
8. **Paediatrics**: Constipation, Allergies, Bronchitis, Asthma, colic, teething, and gentle immunity.
9. **Skin Conditions**: Lichen planus, Dermatitis, Keratosis, Tinea (ringworm), urticaria (purged "healing from within").
10. **Anxiety & Mental Health**: Stress, performance anxiety, sleep disturbances.
11. **Lifestyle & Dietetics**: Advanced Diploma in Dietetics & Nutrition metabolic balancing.

---

## Courier Integration
- **Direct AWB Deep Link:** Blue Dart, Delhivery, DTDC, DHL, FedEx.
- **Copy-to-Clipboard Assistance:** India Post tracking portal guidance.

---

## Legacy Cleanup Completed
- Purged all TanStack Start files (`routeTree.gen.ts`, `router.tsx`, `server.ts`, `start.ts`, `src/routes/`, `src/components/ui/`, `bun.lock`, `bunfig.toml`, `components.json`).
- Zero Lovable artifacts remain.

---

## Latest Deployment & Git Status
- **Repositories Synchronized:**
  - **Medicate Standalone:** [`https://github.com/siddebug/Medicate`](https://github.com/siddebug/Medicate) — Commit `87f93323` (`main` branch)
  - **Lovable Connected:** [`https://github.com/siddebug/screenshot-to-sight-and-sound`](https://github.com/siddebug/screenshot-to-sight-and-sound) — Commit `2769c61b` (`main` branch)
- **Status:** All 51 files synchronized cleanly across both repositories with atomic Git Tree API. Features WhatsApp video consultation with doctor-only call initiation and patient text-only check-in.
