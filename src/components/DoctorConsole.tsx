import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  PhoneCall,
  Send,
  X,
  Plus,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { COURIERS, INITIAL_QUEUE, CONSULTATION_HISTORY } from "../data/mockData";
import { CourierProvider } from "../types";

export const DoctorConsole: React.FC = () => {
  const {
    doctorTab,
    setDoctorTab,
    orders,
    addOrder,
    reports,
    prescription,
    updatePrescription,
    fees,
    updateFees,
    showToast,
  } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>("q2"); // Aarav Mehta
  const [pdfModal, setPdfModal] = useState<string | null>(null);

  // Prescription Form State
  const [form, setForm] = useState({
    remedy: "",
    dosage: "4 globules 3× daily before meals",
    duration: "14 days",
    courier: "bluedart" as CourierProvider,
    awb: "",
  });

  // Settings State
  const [practiceFees, setPracticeFees] = useState(fees);

  const selectedPatient = INITIAL_QUEUE.find((q) => q.id === selectedPatientId) || INITIAL_QUEUE[0];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.remedy.trim() || !form.awb.trim()) {
      showToast("Please provide remedy name and an AWB tracking number");
      return;
    }

    // Add to shared orders
    addOrder({
      id: `ORD-${Math.floor(Math.random() * 9000 + 1000)}`,
      remedies: [form.remedy.trim()],
      courier: form.courier,
      awb: form.awb.trim(),
      stage: 1, // Dispatched
      eta: "Arriving in 2–4 days",
      patientName: selectedPatient.patientName,
      date: "Today",
    });

    // Update active prescription
    updatePrescription({
      ...prescription,
      diagnosis: selectedPatient.complaint || "Acute constitutional follow-up",
      remedies: [
        { name: form.remedy.trim(), dose: form.dosage, duration: form.duration },
        ...prescription.remedies,
      ],
    });

    showToast(`Prescription & parcel dispatched via ${COURIERS[form.courier].name}!`);
    setForm({ remedy: "", dosage: "4 globules 3× daily before meals", duration: "14 days", courier: "bluedart", awb: "" });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateFees(practiceFees);
    showToast("Practice consultation fees updated successfully!");
  };

  return (
    <div className="space-y-4">
      {/* Mini Tab Switcher */}
      <div className="grid grid-cols-4 gap-1 rounded-2xl bg-[#EFECE6] p-1 text-xs font-medium">
        {[
          { tab: "queue", label: "Queue", count: INITIAL_QUEUE.filter((q) => q.status !== "Completed").length },
          { tab: "patients", label: "Patients", count: INITIAL_QUEUE.length },
          { tab: "dispatch", label: "Rx & Parcel", count: orders.length },
          { tab: "settings", label: "Settings" },
        ].map(({ tab, label, count }) => {
          const active = doctorTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setDoctorTab(tab as any)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 transition ${
                active ? "bg-white text-[#1B3B2B] font-bold shadow-sm" : "text-[#5A685F] hover:text-[#1B3B2B]"
              }`}
            >
              <span>{label}</span>
              {typeof count === "number" && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${active ? "bg-emerald-100 text-emerald-800" : "bg-[#DDD8CF]"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 1. TODAY'S LIVE QUEUE                                          */}
      {/* ============================================================== */}
      {doctorTab === "queue" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#1B3B2B]">Live Consultation Queue</h1>
              <p className="text-xs text-[#5A685F]">Patients waiting worldwide</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Live Room
            </span>
          </div>

          <div className="space-y-3">
            {INITIAL_QUEUE.map((q) => (
              <div key={q.id} className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1B3B2B]">{q.time}</span>
                      <span className="text-xs text-[#5A685F]">({q.country})</span>
                      <span className="rounded bg-[#EFECE6] px-1.5 py-0.5 text-[10px] text-[#5A685F]">{q.kind}</span>
                    </div>
                    <p className="mt-1 font-serif text-lg font-bold text-[#1B3B2B]">{q.patientName}</p>
                    <p className="text-xs text-[#5A685F]">Reason: <span className="text-[#1B3B2B] font-medium">{q.complaint}</span></p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    q.status === "Completed" ? "bg-gray-100 text-gray-500" : q.status === "In Progress" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {q.status}
                  </span>
                </div>

                <div className="mt-3.5 flex gap-2 pt-2 border-t border-[#EFECE6]">
                  {q.status !== "Completed" && (
                    <Link
                      to="/consult"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-800 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-900 transition"
                    >
                      <PhoneCall className="h-4 w-4" /> Start WhatsApp Video
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPatientId(q.id);
                      setDoctorTab("patients");
                    }}
                    className="rounded-xl border border-[#E8E4DC] bg-white px-3 py-2.5 text-xs font-medium text-[#1B3B2B] hover:bg-[#FBF9F5]"
                  >
                    View EMR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PATIENTS EMR & LAB TEST VAULT                               */}
      {/* ============================================================== */}
      {doctorTab === "patients" && (
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#1B3B2B]">Patient EMR Vault</h1>
          <p className="text-xs text-[#5A685F] mb-3">Case reports and investigations</p>

          {/* Patient Selector Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {INITIAL_QUEUE.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  selectedPatientId === p.id
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "border border-[#E8E4DC] bg-white text-[#5A685F] hover:text-[#1B3B2B]"
                }`}
              >
                {p.patientName}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between border-b border-[#EFECE6] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1B3B2B]">{selectedPatient.patientName}</h3>
                <p className="text-xs text-[#5A685F]">{selectedPatient.country} · {selectedPatient.kind} Case</p>
                <p className="mt-1 text-xs text-[#1B3B2B]"><b>Primary Health Complaint:</b> {selectedPatient.complaint}</p>
              </div>
              <button
                onClick={() => {
                  setDoctorTab("dispatch");
                  setForm((f) => ({ ...f, remedy: "Pulsatilla 200" }));
                }}
                className="flex items-center gap-1 rounded-full bg-[#EBF4EF] px-3 py-1.5 text-xs font-semibold text-[#2D5A43] hover:bg-emerald-100"
              >
                <Plus className="h-3.5 w-3.5" /> Prescribe
              </button>
            </div>

            {/* Uploaded Lab Reports */}
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5A685F]">
                Uploaded Lab Tests & Scans ({reports.length})
              </p>
              <div className="mt-2 space-y-2">
                {reports.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setPdfModal(r.name)}
                    className="flex w-full items-center justify-between rounded-xl bg-[#FBF9F5] p-2.5 text-left text-xs text-[#1B3B2B] hover:bg-[#EBF4EF] transition"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#D97757]" />
                      <span className="font-medium">{r.name}</span>
                    </div>
                    <span className="text-[11px] text-[#5A685F]">{r.date} · {r.size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Historical Notes */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5A685F]">
                Consultation Case History
              </p>
              <div className="mt-2 space-y-2 text-xs">
                {CONSULTATION_HISTORY.map((h) => (
                  <div key={h.date} className="rounded-xl border border-[#E8E4DC] p-2.5 bg-[#FBF9F5]">
                    <p className="font-semibold text-[#1B3B2B]">{h.date} ({h.type})</p>
                    <p className="text-[#5A685F] mt-0.5">{h.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. PRESCRIPTION & LOGISTICS DISPATCH                           */}
      {/* ============================================================== */}
      {doctorTab === "dispatch" && (
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#1B3B2B]">Digital Rx & Parcel Dispatch</h1>
          <p className="text-xs text-[#5A685F] mb-3">Formulate remedies & trigger courier delivery</p>

          <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#1B3B2B] mb-2">
              New Prescription for {selectedPatient.patientName}
            </h3>
            <form onSubmit={handleDispatch} className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-[#5A685F] block mb-1">Homeopathic Remedy & Potency</label>
                <input
                  className="w-full rounded-xl border border-[#E8E4DC] bg-white p-2.5 text-xs text-[#1B3B2B] focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  placeholder="e.g. Pulsatilla 200 / Arnica Montana 30C / Natrum Mur 6X"
                  value={form.remedy}
                  onChange={(e) => setForm({ ...form, remedy: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#5A685F] block mb-1">Dosage Frequency</label>
                  <input
                    className="w-full rounded-xl border border-[#E8E4DC] bg-white p-2.5 text-xs text-[#1B3B2B]"
                    placeholder="e.g. 4 globules 3× daily"
                    value={form.dosage}
                    onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#5A685F] block mb-1">Course Duration</label>
                  <input
                    className="w-full rounded-xl border border-[#E8E4DC] bg-white p-2.5 text-xs text-[#1B3B2B]"
                    placeholder="e.g. 14 days"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#5A685F] block mb-1">Courier Provider</label>
                  <select
                    className="w-full rounded-xl border border-[#E8E4DC] bg-white p-2.5 text-xs text-[#1B3B2B]"
                    value={form.courier}
                    onChange={(e) => setForm({ ...form, courier: e.target.value as CourierProvider })}
                  >
                    {Object.entries(COURIERS).map(([k, c]) => (
                      <option key={k} value={k}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#5A685F] block mb-1">AWB / Consignment Tracking No.</label>
                  <input
                    className="w-full rounded-xl border border-[#E8E4DC] bg-white p-2.5 text-xs font-mono text-[#1B3B2B]"
                    placeholder="e.g. BD849201928IN"
                    value={form.awb}
                    onChange={(e) => setForm({ ...form, awb: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3 font-semibold text-white shadow-sm hover:bg-emerald-900 transition"
              >
                <Send className="h-4 w-4" /> Sign Rx & Dispatch Courier Parcel
              </button>
            </form>
          </div>

          {/* Active Dispatches List */}
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5A685F] mb-2">
              Recent Dispatches ({orders.length})
            </h3>
            <div className="space-y-2">
              {orders.map((o) => {
                const c = COURIERS[o.courier];
                return (
                  <div key={o.id} className="rounded-2xl border border-[#E8E4DC] bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#1B3B2B]">{o.patientName} · {c.name}</p>
                        <p className="font-mono text-[#5A685F]">AWB: {o.awb}</p>
                        <p className="text-[11px] text-[#5A685F]">{o.remedies.join(", ")}</p>
                      </div>
                      <a
                        href={c.getUrl(o.awb)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-full bg-[#EBF4EF] px-3 py-1.5 text-xs font-semibold text-[#2D5A43] hover:underline"
                      >
                        Track ↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. PRACTICE SETTINGS                                           */}
      {/* ============================================================== */}
      {doctorTab === "settings" && (
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#1B3B2B]">Practice & Fee Settings</h1>
          <p className="text-xs text-[#5A685F] mb-3">Configure consultation fees and clinic schedule</p>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1B3B2B] mb-3">Consultation Fee Schedule</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#5A685F] block mb-1">
                    First / Comprehensive Consultation (45 min)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#5A685F]">₹</span>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-[#E8E4DC] bg-white py-2.5 pl-8 pr-3 text-sm text-[#1B3B2B]"
                      value={practiceFees.comprehensive}
                      onChange={(e) => setPracticeFees({ ...practiceFees, comprehensive: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#5A685F] block mb-1">
                    Follow-up Consultation (20 min)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#5A685F]">₹</span>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-[#E8E4DC] bg-white py-2.5 pl-8 pr-3 text-sm text-[#1B3B2B]"
                      value={practiceFees.followUp}
                      onChange={(e) => setPracticeFees({ ...practiceFees, followUp: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1B3B2B] mb-3">Goa Clinic Hours (In-Person)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#5A685F]">Mon – Fri</span>
                  <span className="font-medium text-[#1B3B2B]">09:30 – 18:30</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#5A685F]">Saturday</span>
                  <span className="font-medium text-[#1B3B2B]">10:00 – 14:00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#5A685F]">Sunday</span>
                  <span className="font-medium text-[#5A685F]">Closed (Emergencies to ER)</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-emerald-800 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-900 transition"
            >
              Save Fee Schedule & Hours
            </button>
          </form>
        </div>
      )}

      {/* Lab Report Modal */}
      {pdfModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPdfModal(null)}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#EFECE6] pb-2">
              <p className="font-bold text-[#1B3B2B] text-sm">{pdfModal}</p>
              <button onClick={() => setPdfModal(null)}>
                <X className="h-4 w-4 text-[#5A685F]" />
              </button>
            </div>
            <div className="mt-3 space-y-2 rounded-xl border border-[#E8E4DC] bg-[#FBF9F5] p-4 font-mono text-xs">
              <p className="font-bold text-emerald-900">CITY DIAGNOSTICS LAB — Panaji, Goa</p>
              <p>Patient: Aarav Mehta (Age 34, M)</p>
              <p className="text-[#5A685F]">----------------------------------------</p>
              <p>Haemoglobin ........ 13.4 g/dL (13–17)</p>
              <p>WBC ................ 7,800 /µL (4k–11k)</p>
              <p className="text-amber-700 font-bold">Eosinophils ........ 8% ↑ (Normal 1–6%)</p>
              <p>TSH ................ 2.1 µIU/mL (0.4–4.0)</p>
              <p className="text-amber-700 font-bold">Total IgE .......... 310 IU/mL ↑ (Allergic flare)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

