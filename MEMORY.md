# Project Memory & Agent Guidelines

## Core Principles
1. **Always Update Memory**: Keep this document and workspace context updated with architecture decisions, status, and pending tasks.
2. **GitHub Commits (Confirmation Required)**: **NEVER** push or commit to GitHub automatically. Always summarize the proposed changes and ask the user for confirmation before executing any commit or push.

---

## Project Status & Key Information
- **App Name:** Medicate (Health & Homeopathy / Dr. Chetali Damania)
- **Primary Workspace Directory:** `C:\Users\SIDDHARTH GAJJAR\.gemini\antigravity\scratch\Medicate`
- **Repository:** `siddebug/screenshot-to-sight-and-sound` (Public, Branch: `main`)
- **Connected Platform:** Lovable (`https://lovable.dev/projects/lovp_2j6hfkcepg8raajyqc27vwrgmp`)
- **GitHub Auth Token Location:** `C:\Users\SIDDHARTH GAJJAR\Downloads\gabru.txt`

---

## Architecture & Role Differentiation (Implemented)

### 1. Patient Experience (Consumer Wellness)
- **Theme:** Soothing cream (`#FBF9F5`) & sage green (`#2D5A43`).
- **Header:** "Hello, Aarav 👋", notification bell, clinic branding.
- **Bottom Navigation:**
  - `Home`: Upcoming video appointment countdown, daily wellness reels, quick actions.
  - `Conditions`: 6 specialties with honest allopathic referral disclosures.
  - `Book`: 5-step booking wizard with dynamic fee calculation and report upload.
  - `Medicines`: Active e-prescription, dosage guide, AWB copy, and 1-tap courier redirect (Blue Dart, Delhivery, DTDC, India Post, DHL, FedEx).
  - `Records`: Patient's uploaded lab tests and clinical history.

### 2. Doctor Experience (Clinical EMR & Practice Console)
- **Theme:** Deep emerald/slate (`bg-emerald-950 text-white`) with "Doctor Console" badge & medical registration `BHMS (Goa) Reg. GHC-2451`.
- **Bottom Navigation:**
  - `Queue`: Today's consultations queue with live video admission button.
  - `Patients`: Comprehensive EMR directory with interactive lab report viewer (CBC, Thyroid, IgE).
  - `Rx & Dispatch`: Live prescription pad to formulate homeopathic remedies and trigger courier parcel tracking.
  - `Settings`: Dynamic consultation fee schedule editor (Comprehensive 45m & Follow-up 20m) and Goa clinic opening hours.

### 3. Cross-Role Reactivity & Storage
- **`localStorage` Persistence:** State persists across reloads (`orders`, `appointments`, `reports`, `activePrescription`, `consultationFees`).
- **Synchronized Workflows:**
  - Prescriptions written by the doctor in "Rx & Dispatch" instantly update the patient's `/medicines` view.
  - Lab reports uploaded by patients in `/book` or `/profile` immediately populate Dr. Chetali's EMR directory.
  - Consultation fees adjusted in Doctor "Settings" dynamically update the Patient `/book` checkout.
- **Bug Fixes:**
  - Replaced jumping wall-clock seconds in the video room with an active `useStopwatch` timer.
  - Added graceful print fallback for receipt generation in `book.tsx`.
