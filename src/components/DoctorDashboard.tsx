import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Video, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Card, SectionTitle } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { COURIERS, QUEUE_SEED, REPORTS, HISTORY, type CourierId } from "@/lib/data";
import { cn } from "@/lib/utils";

const pill: Record<string, string> = {
  Upcoming: "bg-secondary text-forest",
  "In Progress": "bg-accent text-accent-foreground",
  Completed: "bg-muted text-muted-foreground",
};

export function DoctorDashboard() {
  const { addOrder } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [pdf, setPdf] = useState<string | null>(null);
  const [form, setForm] = useState({ remedy: "", dosage: "", courier: "bluedart" as CourierId, awb: "" });
  const patient = QUEUE_SEED.find((q) => q.id === selected);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.remedy || !form.awb) { toast.error("Add a remedy and AWB number"); return; }
    addOrder({ id: `ORD-${Math.floor(Math.random() * 9000 + 1000)}`, remedies: [form.remedy], courier: form.courier, awb: form.awb.trim(), stage: 1, eta: "Arriving in 3–5 days" });
    toast.success(`Patient notified · ${COURIERS[form.courier].name} ${form.awb}`);
    setForm({ remedy: "", dosage: "", courier: "bluedart", awb: "" });
  };

  return (
    <div>
      <h1 className="text-3xl text-forest">Today's queue</h1>
      <p className="text-sm text-muted-foreground">{QUEUE_SEED.length} consultations</p>
      <div className="mt-4 space-y-3">
        {QUEUE_SEED.map((q) => (
          <Card key={q.id} className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{q.time} · {q.kind} · {q.country}</p>
                <button onClick={() => setSelected(q.id)} className="font-serif text-lg text-forest underline-offset-2 hover:underline">{q.patient}</button>
                <p className="text-xs text-muted-foreground">{q.reason}</p>
              </div>
              <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", pill[q.status])}>{q.status}</span>
            </div>
            {q.status !== "Completed" && (
              <Link to="/consult" className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground">
                <Video className="h-4 w-4" /> Start Video Consultation
              </Link>
            )}
          </Card>
        ))}
      </div>

      {patient && (
        <>
          <SectionTitle title="Patient EMR" action={<button onClick={() => setSelected(null)}><X className="h-4 w-4" /></button>} />
          <Card>
            <p className="font-serif text-xl text-forest">{patient.patient}</p>
            <p className="text-xs text-muted-foreground">{patient.reason}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reports</p>
            {REPORTS.map((r) => (
              <button key={r.id} onClick={() => setPdf(r.name)} className="mt-2 flex w-full items-center gap-2 rounded-xl bg-muted p-2 text-left text-sm text-forest">
                <FileText className="h-4 w-4 text-accent" /> {r.name}
              </button>
            ))}
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">History</p>
            {HISTORY.map((h) => <p key={h.date} className="mt-1 text-xs"><b>{h.date}</b> — {h.note}</p>)}
          </Card>
        </>
      )}

      <SectionTitle title="Prescription & Dispatch" />
      <Card>
        <form onSubmit={submit} className="space-y-3 text-sm">
          <input className="w-full rounded-xl border border-input bg-background p-3" placeholder="Remedy (e.g. Pulsatilla 200)" value={form.remedy} onChange={(e) => setForm({ ...form, remedy: e.target.value })} />
          <input className="w-full rounded-xl border border-input bg-background p-3" placeholder="Dosage (e.g. 4 globules 3× daily)" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
          <select className="w-full rounded-xl border border-input bg-background p-3" value={form.courier} onChange={(e) => setForm({ ...form, courier: e.target.value as CourierId })}>
            {Object.entries(COURIERS).map(([k, c]) => <option key={k} value={k}>{c.name}</option>)}
          </select>
          <input className="w-full rounded-xl border border-input bg-background p-3 font-mono" placeholder="AWB / Tracking number" value={form.awb} onChange={(e) => setForm({ ...form, awb: e.target.value })} />
          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 font-semibold text-accent-foreground"><Send className="h-4 w-4" /> Dispatch & notify patient</button>
        </form>
      </Card>

      {pdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/60 p-4" onClick={() => setPdf(null)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between"><p className="font-semibold text-forest">{pdf}</p><button onClick={() => setPdf(null)}><X className="h-4 w-4" /></button></div>
            <div className="mt-4 space-y-2 rounded-xl border border-border bg-background p-4 font-mono text-xs">
              <p className="font-bold">CITY DIAGNOSTICS LAB — Panaji, Goa</p>
              <p>Haemoglobin ........ 13.4 g/dL (13–17)</p>
              <p>WBC ................ 7,800 /µL (4k–11k)</p>
              <p>Eosinophils ........ 8% ↑ (1–6)</p>
              <p>TSH ................ 2.1 µIU/mL</p>
              <p>Total IgE .......... 310 IU/mL ↑</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
