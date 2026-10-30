import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  Video,
  Send,
  X,
  Clock,
  Users,
  Sliders,
  DollarSign,
  Package,
  Calendar,
  CheckCircle,
  ExternalLink,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Card, SectionTitle } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { COURIERS, QUEUE_SEED, HISTORY, type CourierId } from "@/lib/data";
import { cn } from "@/lib/utils";

const pill: Record<string, string> = {
  Upcoming: "bg-secondary text-forest",
  "In Progress": "bg-accent text-accent-foreground",
  Completed: "bg-muted text-muted-foreground",
};

export function DoctorDashboard() {
  const {
    doctorTab,
    setDoctorTab,
    orders,
    addOrder,
    appointments,
    reports,
    consultationFees,
    updateFees,
    activePrescription,
    updatePrescription,
  } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>("q2"); // Default to Aarav Mehta
  const [pdfModal, setPdfModal] = useState<string | null>(null);

  // Prescription & Dispatch state
  const [form, setForm] = useState({
    remedy: "",
    dosage: "",
    duration: "14 days",
    courier: "bluedart" as CourierId,
    awb: "",
  });

  // Settings state
  const [fees, setFees] = useState(consultationFees);
  const [clinicHours, setClinicHours] = useState({
    weekdays: "09:30 - 18:30",
    saturdays: "10:00 - 14:00",
    sundays: "Closed (Emergencies to ER)",
  });

  const selectedPatient = QUEUE_SEED.find((q) => q.id === selectedPatientId) || QUEUE_SEED[0];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.remedy || !form.awb) {
      toast.error("Please add at least one remedy and an AWB tracking number");
      return;
    }

    // Add to shared orders
    addOrder({
      id: `ORD-${Math.floor(Math.random() * 9000 + 1000)}`,
      remedies: [form.remedy],
      courier: form.courier,
      awb: form.awb.trim(),
      stage: 1, // Dispatched
      eta: "Arriving in 2–4 days",
      patientName: selectedPatient.patient,
      date: "Today",
    });

    // Also update the active patient prescription so it appears on /medicines
    updatePrescription({
      ...activePrescription,
      diagnosis: selectedPatient.reason,
      remedies: [
        { name: form.remedy, dose: form.dosage || "4 globules 3× daily", duration: form.duration },
        ...activePrescription.remedies,
      ],
    });

    toast.success(`Dispatched! Patient ${selectedPatient.patient} notified (${COURIERS[form.courier].name} ${form.awb})`);
    setForm({ remedy: "", dosage: "", duration: "14 days", courier: "bluedart", awb: "" });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateFees(fees);
    toast.success("Practice fee schedule & clinic hours updated!");
  };

  return (
    <div className="space-y-4">
      {/* Mini Doctor Tab Bar */}
      <div className="grid grid-cols-4 gap-1 rounded-2xl bg-muted p-1 text-xs font-medium">
        {[
          { tab: "queue", label: "Queue", count: QUEUE_SEED.filter((q) => q.status !== "Completed").length },
          { tab: "patients", label: "Patients", count: QUEUE_SEED.length },
          { tab: "dispatch", label: "Rx / Parcel", count: orders.length },
          { tab: "settings", label: "Settings" },
        ].map(({ tab, label, count }) => {
          const active = doctorTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setDoctorTab(tab as any)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl py-2 transition",
                active ? "bg-card text-forest font-semibold shadow-soft" : "text-muted-foreground hover:text-forest"
              )}
            >
              <span>{label}</span>
              {typeof count === "number" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px]",
                    active ? "bg-emerald-100 text-emerald-800" : "bg-border text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: QUEUE & TODAY'S SCHEDULE                                */}
      {/* ============================================================== */}
      {doctorTab === "queue" && (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-forest">Live Consultation Queue</h1>
              <p className="text-xs text-muted-foreground">Today's appointments across India, UAE, UK, and US</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Clinic Active
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {QUEUE_SEED.map((q) => (
              <Card key={q.id} className="p-4 transition hover:border-emerald-700/30">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-forest">{q.time}</span>
                      <span className="text-xs text-muted-foreground">({q.country})</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{q.kind}</span>
                    </div>
                    <p className="mt-1 font-serif text-lg font-bold text-forest">{q.patient}</p>
                    <p className="text-xs text-muted-foreground">Chief complaint: <span className="text-forest font-medium">{q.reason}</span></p>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", pill[q.status])}>
                    {q.status}
                  </span>
                </div>

                <div className="mt-3.5 flex gap-2 pt-2 border-t border-border">
                  {q.status !== "Completed" && (
                    <Link
                      to="/consult"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-800 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-emerald-900 transition"
                    >
                      <Video className="h-4 w-4" /> Start HD Video Consultation
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPatientId(q.id);
                      setDoctorTab("patients");
                    }}
                    className="rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-medium text-forest hover:bg-muted"
                  >
                    View EMR
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PATIENTS & EMR VAULT                                   */}
      {/* ============================================================== */}
      {doctorTab === "patients" && (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-forest">Patient EMR Records</h1>
              <p className="text-xs text-muted-foreground">Lab investigations, allergy profiles, and history</p>
            </div>
          </div>

          {/* Patient Selector Pills */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUEUE_SEED.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                  selectedPatientId === p.id
                    ? "bg-emerald-800 text-white shadow-soft"
                    : "border border-border bg-card text-muted-foreground hover:text-forest"
                )}
              >
                {p.patient}
              </button>
            ))}
          </div>

          {/* EMR Card for Selected Patient */}
          <Card className="mt-4">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-forest">{selectedPatient.patient}</h3>
                <p className="text-xs text-muted-foreground">{selectedPatient.country} · {selectedPatient.kind} Consultation</p>
                <p className="mt-1 text-xs text-forest"><b>Primary Concern:</b> {selectedPatient.reason}</p>
              </div>
              <button
                onClick={() => {
                  setDoctorTab("dispatch");
                  setForm((f) => ({ ...f, remedy: "Pulsatilla 200" }));
                }}
                className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-secondary/80"
              >
                <Plus className="h-3.5 w-3.5" /> Prescribe
              </button>
            </div>

            {/* Lab Reports & Documents */}
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Uploaded Lab Tests & Scans ({reports.length})
              </p>
              <div className="mt-2 space-y-2">
                {reports.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setPdfModal(r.name)}
                    className="flex w-full items-center justify-between rounded-xl bg-muted p-2.5 text-left text-xs text-forest hover:bg-secondary/60 transition"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent" />
                      <span className="font-medium">{r.name}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{r.date} · {r.size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Consultation History */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Previous Case Notes
              </p>
              <div className="mt-2 space-y-2 text-xs">
                {HISTORY.map((h) => (
                  <div key={h.date} className="rounded-xl border border-border p-2.5">
                    <p className="font-semibold text-forest">{h.date} ({h.type})</p>
                    <p className="text-muted-foreground mt-0.5">{h.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: PRESCRIPTION & COURIER DISPATCH                          */}
      {/* ============================================================== */}
      {doctorTab === "dispatch" && (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-forest">Prescriptions & Dispatches</h1>
              <p className="text-xs text-muted-foreground">Create homeopathic remedies & trigger parcel tracking</p>
            </div>
          </div>

          {/* Prescription Pad Form */}
          <Card className="mt-4">
            <h3 className="font-serif text-lg font-semibold text-forest mb-2">
              New Prescription for {selectedPatient.patient}
            </h3>
            <form onSubmit={handleDispatch} className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Homeopathic Remedy & Potency</label>
                <input
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-forest focus:ring-1 focus:ring-emerald-700"
                  placeholder="e.g. Pulsatilla 200 / Arnica Montana 30C / Natrum Mur 6X"
                  value={form.remedy}
                  onChange={(e) => setForm({ ...form, remedy: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Dosage Frequency</label>
                  <input
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-forest"
                    placeholder="e.g. 4 globules 3× daily"
                    value={form.dosage}
                    onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Course Duration</label>
                  <input
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-forest"
                    placeholder="e.g. 14 days"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Logistics Provider</label>
                  <select
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-forest"
                    value={form.courier}
                    onChange={(e) => setForm({ ...form, courier: e.target.value as CourierId })}
                  >
                    {Object.entries(COURIERS).map(([k, c]) => (
                      <option key={k} value={k}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">AWB / Consignment No.</label>
                  <input
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-mono text-forest"
                    placeholder="e.g. BD849201928IN"
                    value={form.awb}
                    onChange={(e) => setForm({ ...form, awb: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3 font-semibold text-white shadow-soft hover:bg-emerald-900 transition"
              >
                <Send className="h-4 w-4" /> Sign Rx, Dispatch Parcel & Notify Patient
              </button>
            </form>
          </Card>

          {/* Active Dispatches Table */}
          <div className="mt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Recent Dispatches ({orders.length})
            </h3>
            <div className="space-y-2">
              {orders.map((o) => {
                const c = COURIERS[o.courier];
                return (
                  <Card key={o.id} className="p-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-forest">{o.patientName || "Patient"} · {c.name}</p>
                        <p className="font-mono text-muted-foreground">AWB: {o.awb}</p>
                        <p className="text-[11px] text-muted-foreground">{o.remedies.join(", ")}</p>
                      </div>
                      <a
                        href={c.url(o.awb)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        Track ↗
                      </a>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: PRACTICE SETTINGS & CLINIC HOURS                        */}
      {/* ============================================================== */}
      {doctorTab === "settings" && (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-forest">Practice & Fee Settings</h1>
              <p className="text-xs text-muted-foreground">Dr. Chetali Damania's practice configuration</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="mt-4 space-y-4">
            <Card>
              <h3 className="font-serif text-lg font-semibold text-forest mb-3">Consultation Fees</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground block mb-1">
                    First / Comprehensive Consultation (45 min)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-input bg-background py-2.5 pl-8 pr-3 text-sm text-forest"
                      value={fees.comprehensive}
                      onChange={(e) => setFees({ ...fees, comprehensive: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">
                    Follow-up Consultation (20 min)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-input bg-background py-2.5 pl-8 pr-3 text-sm text-forest"
                      value={fees.followUp}
                      onChange={(e) => setFees({ ...fees, followUp: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-serif text-lg font-semibold text-forest mb-3">Goa Clinic Hours (In-Person)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Mon – Fri</span>
                  <span className="font-medium text-forest">{clinicHours.weekdays}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium text-forest">{clinicHours.saturdays}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium text-muted-foreground">{clinicHours.sundays}</span>
                </div>
              </div>
            </Card>

            <button
              type="submit"
              className="w-full rounded-full bg-emerald-800 py-3 text-sm font-semibold text-white shadow-soft hover:bg-emerald-900 transition"
            >
              Save Practice Settings
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
          <div className="w-full max-w-md rounded-2xl bg-card p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-border pb-2">
              <p className="font-semibold text-forest text-sm">{pdfModal}</p>
              <button onClick={() => setPdfModal(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 space-y-2 rounded-xl border border-border bg-background p-4 font-mono text-xs">
              <p className="font-bold text-emerald-900">CITY DIAGNOSTICS LAB — Panaji, Goa</p>
              <p>Patient: Aarav Mehta (Age 34, M)</p>
              <p className="text-muted-foreground">----------------------------------------</p>
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
}
