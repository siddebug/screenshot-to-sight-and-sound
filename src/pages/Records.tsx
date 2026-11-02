import React, { useState } from "react";
import {
  FileText,
  Upload,
  Calendar,
  ShieldCheck,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HeartPulse,
  User,
  Plus,
  X,
  Stethoscope,
  MapPin,
  Award,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { PatientReport } from "../types";

export const Records: React.FC = () => {
  const { reports, addReport, showToast, role } = useApp();
  const [activeTab, setActiveTab] = useState<"reports" | "history" | "clinic">("reports");
  const [isUploading, setIsUploading] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const [newReportCategory, setNewReportCategory] = useState("Blood Investigation");
  const [previewReport, setPreviewReport] = useState<PatientReport | null>(null);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportName.trim()) {
      showToast("Please provide a report title");
      return;
    }

    const report: PatientReport = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${newReportName.trim()} (${newReportCategory})`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
    };

    addReport(report);
    showToast(`Report "${report.name}" successfully vaulted`);
    setNewReportName("");
    setIsUploading(false);
  };

  return (
    <div className="space-y-4">
      {/* Patient Health Passport Header */}
      <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#EBF4EF] text-[#2D5A43] font-serif text-lg font-bold">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-[#1B3B2B]">Aarav Mehta</h2>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-[#2D5A43]">
                  Active Case
                </span>
              </div>
              <p className="text-xs text-[#5A685F]">29 Yrs · Male · O+ Positive · ID: #CD-8841</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded bg-[#FBF9F5] px-2 py-1 text-[11px] font-medium text-[#5A685F] border border-[#E8E4DC]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2D5A43]" /> HIPAA Vault
          </span>
        </div>

        {/* Clinical Badges */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#E8E4DC]/60 pt-3 text-xs">
          <div className="rounded-xl bg-[#FBF9F5] p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-[#5A685F] font-semibold">Active Care Protocol</p>
            <p className="mt-0.5 font-medium text-[#1B3B2B]">Allergic Rhinitis & Sinusitis</p>
            <p className="text-[11px] text-[#5A685F]">Day 14 of 30 · Rhus Tox 30C</p>
          </div>
          <div className="rounded-xl bg-amber-50/70 p-2.5 border border-amber-200/50">
            <p className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold">Known Allergies</p>
            <p className="mt-0.5 font-medium text-amber-900">Dust mites, Penicillin</p>
            <p className="text-[11px] text-amber-700">No homeo contraindications</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex rounded-xl bg-[#EFECE6] p-1 text-xs font-semibold text-[#5A685F]">
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex-1 rounded-lg py-2 transition ${
            activeTab === "reports" ? "bg-white text-[#1B3B2B] shadow-sm" : "hover:text-[#1B3B2B]"
          }`}
        >
          Lab Vault ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 rounded-lg py-2 transition ${
            activeTab === "history" ? "bg-white text-[#1B3B2B] shadow-sm" : "hover:text-[#1B3B2B]"
          }`}
        >
          Consult Log
        </button>
        <button
          onClick={() => setActiveTab("clinic")}
          className={`flex-1 rounded-lg py-2 transition ${
            activeTab === "clinic" ? "bg-white text-[#1B3B2B] shadow-sm" : "hover:text-[#1B3B2B]"
          }`}
        >
          Doctor Profile
        </button>
      </div>

      {/* TAB 1: LAB REPORTS VAULT */}
      {activeTab === "reports" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5A685F]">Diagnostic Documents</p>
            <button
              onClick={() => setIsUploading(true)}
              className="flex items-center gap-1.5 rounded-full bg-[#2D5A43] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#1B3B2B] transition"
            >
              <Upload className="h-3.5 w-3.5" /> Upload Report
            </button>
          </div>

          <div className="space-y-2">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between rounded-2xl border border-[#E8E4DC] bg-white p-3.5 shadow-sm transition hover:border-[#2D5A43]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-[#EBF4EF] text-[#2D5A43]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1B3B2B] leading-snug">{report.name}</h3>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-[#5A685F]">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
                        <CheckCircle2 className="h-3 w-3" /> Reviewed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewReport(report)}
                    title="Preview Document"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-[#E8E4DC] text-[#5A685F] hover:bg-[#FBF9F5] hover:text-[#1B3B2B] transition"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => showToast(`Downloaded: ${report.name}`)}
                    title="Download Report"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-[#E8E4DC] text-[#5A685F] hover:bg-[#FBF9F5] hover:text-[#1B3B2B] transition"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Clinical Disclosure Banner */}
          <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-3.5 text-xs text-[#2D5A43]">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#2D5A43] mt-0.5" />
              <div>
                <p className="font-semibold text-[#1B3B2B]">Holistic Cross-Analysis</p>
                <p className="mt-0.5 text-[#5A685F]">
                  Dr. Chetali reviews allopathic blood work, biopsy notes, and ultrasounds to individualize homeopathic potencies and safely monitor disease progression.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONSULTATION HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#5A685F]">Past Consultations & Milestones</p>

          <div className="relative border-l-2 border-[#E8E4DC] ml-4 pl-4 space-y-4">
            {/* Consultation 1 */}
            <div className="relative">
              <span className="absolute -left-[23px] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#2D5A43] ring-4 ring-white" />
              <div className="rounded-2xl border border-[#E8E4DC] bg-white p-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                    Follow-up (20 min)
                  </span>
                  <span className="text-xs text-[#5A685F]">Oct 18, 2026</span>
                </div>
                <h4 className="mt-2 font-serif font-bold text-[#1B3B2B]">Progress Review · Allergic Rhinitis</h4>
                <p className="mt-1 text-xs text-[#5A685F] leading-relaxed">
                  Patient reported 60% reduction in morning sneezing fits. Nasal airway clear. Advised continuation of Rhus Tox 30C with Arsenicum Album before sleep.
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-[#E8E4DC]/60 pt-2 text-[11px]">
                  <span className="text-[#2D5A43] font-semibold">Rx: Rhus Tox 30C + Arsenicum Album</span>
                  <button
                    onClick={() => showToast("Opening Consultation Summary & Rx PDF")}
                    className="text-[#2D5A43] underline font-medium hover:text-[#1B3B2B]"
                  >
                    View Summary
                  </button>
                </div>
              </div>
            </div>

            {/* Consultation 2 */}
            <div className="relative">
              <span className="absolute -left-[23px] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#5A685F] ring-4 ring-white" />
              <div className="rounded-2xl border border-[#E8E4DC] bg-white p-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-900">
                    Comprehensive Intake (45 min)
                  </span>
                  <span className="text-xs text-[#5A685F]">Sep 24, 2026</span>
                </div>
                <h4 className="mt-2 font-serif font-bold text-[#1B3B2B]">Constitutional Case Evaluation</h4>
                <p className="mt-1 text-xs text-[#5A685F] leading-relaxed">
                  Detailed case intake covering familial asthma history, seasonal triggers, thermal preference (chilly), and chronic fatigue patterns. Total IgE requested.
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-[#E8E4DC]/60 pt-2 text-[11px]">
                  <span className="text-[#5A685F]">Initiated Constitutional Therapy</span>
                  <button
                    onClick={() => showToast("Opening Case Intake Notes")}
                    className="text-[#2D5A43] underline font-medium hover:text-[#1B3B2B]"
                  >
                    Case Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOCTOR PROFILE & CLINICAL DIRECTORY */}
      {activeTab === "clinic" && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#1B3B2B] text-white font-serif text-xl font-bold">
                CD
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1B3B2B]">Dr. Chetali Damania</h3>
                <p className="text-xs text-[#2D5A43] font-medium">CCAH · Medalist in BHMS · Reg. GHC-2451</p>
                <p className="text-[11px] text-[#5A685F]">Certificate Course in Advanced Homeopathy · Advanced Diploma in Dietetics and Nutrition</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-[#E8E4DC]/70 pt-3 text-xs text-[#5A685F]">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1B3B2B]">Goa Clinical Practice</p>
                  <p>Miramar Beach Road, Panaji, Goa 403001</p>
                  <p className="text-[11px] text-[#5A685F]">Mon / Wed / Fri: 10:00 AM – 1:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-[#E8E4DC]/40">
                <MapPin className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1B3B2B]">Mumbai Clinical Practice</p>
                  <p>Dadar West, Near Shivaji Park, Mumbai 400028</p>
                  <p className="text-[11px] text-[#5A685F]">Tue / Thu / Sat: 4:00 PM – 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-[#E8E4DC]/40">
                <Award className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1B3B2B]">Global Telemedicine Reach</p>
                  <p>India, UAE (Dubai), United Kingdom & North America</p>
                  <p className="text-[11px] text-[#5A685F]">Medicines shipped via DHL, Blue Dart & Delhivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Red Flag Disclaimer */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Emergency & Triage Boundaries</p>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Homeopathy is intended for chronic care, functional disorders, and gentle constitutional healing. In acute emergencies—such as severe allergic anaphylaxis, respiratory distress, acute chest pain, or high refractory fevers—please seek immediate allopathic ER intervention.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD REPORT MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#EBF4EF] text-[#2D5A43]">
                  <Upload className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1B3B2B]">Upload Lab Investigation</h3>
              </div>
              <button
                onClick={() => setIsUploading(false)}
                className="grid h-7 w-7 place-items-center rounded-full text-[#5A685F] hover:bg-[#FBF9F5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#1B3B2B]">Investigation / Test Title</label>
                <input
                  type="text"
                  placeholder="e.g., Vitamin D3 & B12 Panel"
                  value={newReportName}
                  onChange={(e) => setNewReportName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E8E4DC] px-3 py-2 text-xs text-[#1B3B2B] focus:border-[#2D5A43] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B3B2B]">Category</label>
                <select
                  value={newReportCategory}
                  onChange={(e) => setNewReportCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E8E4DC] px-3 py-2 text-xs text-[#1B3B2B] focus:border-[#2D5A43] focus:outline-none"
                >
                  <option>Blood Investigation</option>
                  <option>Allergy IgE Panel</option>
                  <option>Thyroid / Hormone Profile</option>
                  <option>Radiology / Ultrasound Scan</option>
                  <option>Previous Allopathic Prescription</option>
                </select>
              </div>

              {/* Mock Dropzone */}
              <div className="rounded-xl border-2 border-dashed border-[#E8E4DC] p-4 text-center">
                <FileText className="mx-auto h-8 w-8 text-[#5A685F]" />
                <p className="mt-1 text-xs font-medium text-[#1B3B2B]">Selected simulated PDF file</p>
                <p className="text-[10px] text-[#5A685F]">Max file size 25MB (PDF, PNG, JPG)</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="flex-1 rounded-xl border border-[#E8E4DC] py-2.5 text-xs font-semibold text-[#5A685F] hover:bg-[#FBF9F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#2D5A43] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1B3B2B]"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW REPORT MODAL */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1B3B2B] truncate max-w-[200px]">
                    {previewReport.name}
                  </h3>
                  <p className="text-[10px] text-[#5A685F]">{previewReport.date} · {previewReport.size}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="grid h-7 w-7 place-items-center rounded-full text-[#5A685F] hover:bg-[#FBF9F5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-[#FBF9F5] p-3 border border-[#E8E4DC]">
                <p className="text-[10px] uppercase font-bold text-[#5A685F]">Doctor's Clinical Notes</p>
                <p className="mt-1 text-[#1B3B2B] leading-relaxed">
                  "Serum IgE level marked at 420 IU/mL confirms strong atopic predisposition. Titrated Rhus Tox potency to 30C to prevent homeopathic aggravation."
                </p>
                <p className="mt-2 text-[10px] text-[#2D5A43] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Signed by Dr. Chetali Damania
                </p>
              </div>

              <div className="rounded-xl border border-[#E8E4DC] p-3">
                <p className="font-semibold text-[#1B3B2B] mb-2">Key Diagnostic Markers</p>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between border-b border-[#E8E4DC]/50 pb-1">
                    <span className="text-[#5A685F]">Total Serum IgE</span>
                    <span className="font-semibold text-amber-700">420 IU/mL (High)</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E8E4DC]/50 pb-1">
                    <span className="text-[#5A685F]">Absolute Eosinophil</span>
                    <span className="font-semibold text-[#1B3B2B]">480 /cu mm (Normal)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A685F]">Hemoglobin (Hb)</span>
                    <span className="font-semibold text-[#1B3B2B]">14.2 g/dL (Normal)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast(`Downloaded verified document: ${previewReport.name}`);
                  setPreviewReport(null);
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#2D5A43] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1B3B2B]"
              >
                <Download className="h-3.5 w-3.5" /> Download Encrypted Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

