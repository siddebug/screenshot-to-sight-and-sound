# Medicate — Telemedicine & Clinical Care Platform

Medicate is an intuitive, mobile-first telemedicine and clinical practice web application for **Dr. Chetali Damania** (CCAH, Medalist in BHMS, Advanced Diploma in Dietetics and Nutrition, 18+ years practice, Reg. GHC-2451).

Built from scratch as a pure React application with clean role separation between **Patient View** and **Doctor Practice Console**.

---

## Architecture & Distinct Role Views

### 1. Patient View
- **Home**: Next appointment countdown timer (`02:44:12`), doctor credentials badge (CCAH, Medalist in BHMS, Adv. Dip. Dietetics), quick action pills, and daily video wellness tips modal.
- **Specialties (`/conditions`)**: 11 clinical areas (Women's Health, Endocrinology, Gastro-Intestinal Diseases, Auto-Immune Diseases, Arthritis & Joint Pain, Respiratory Diseases, Renal Diseases, Paediatric Care, Skin Conditions, Anxiety & Mental Health, Lifestyle & Dietetics) with explicit *"Where Homeopathy Helps"* vs *"When to See Allopathy / ER"* triage limits.
- **Book Appointment (`/book`)**: 5-step booking wizard with appointment type selection, slot picker, lab report upload, dynamic fee calculator, and printable booking receipt.
- **Video Consult (`/consult`)**: Virtual waiting room, live consultation webcam preview, call timer (`00:01`, `00:02`...), in-call chat, and clinical note drawer.
- **Medicine Tracking (`/medicines`)**: Signed e-prescription card, 4-stage tracking stepper (*Dispensed → Dispatched → In Transit → Delivered*), AWB copy button with feedback toast, and 1-tap courier redirection (Blue Dart, Delhivery, DTDC, DHL, FedEx, India Post).
- **Records Vault (`/records`)**: Encrypted lab reports vault (Total IgE, CBC, Thyroid), report preview modal, upload report dialog, and consultation timeline.

### 2. Doctor Practice Console (`Doctor Console`)
- **Queue Management**: Today's patient schedule with real-time intake status and 1-click video admission.
- **Patient EMR & Lab Viewer**: Medical history with interactive lab results reviewer (CBC, Thyroid, Allergy IgE) and clinical notes editor.
- **Prescription Pad & Parcel Dispatch**: Digital remedy builder with potency, frequency, duration, and courier consignment generator with live AWB tracking.
- **Practice Settings**: Dynamic consultation fee schedules (Comprehensive 45m & Follow-up 20m) and clinic hours.

---

## Tech Stack
- **Framework**: React 18 / 19 + Vite
- **Routing**: React Router v6 (`react-router-dom`)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Typography**: Cormorant Garamond & Plus Jakarta Sans
- **State Management**: React Context with LocalStorage persistence

---

## Local Development

```sh
npm install
npm run dev
```

App runs on `http://localhost:3000` by default.
