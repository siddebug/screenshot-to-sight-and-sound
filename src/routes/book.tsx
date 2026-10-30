import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Globe, Building2, Upload, Check, Download, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a consultation — Health & Homeopathy" },
      { name: "description", content: "Book an online video or Goa clinic homeopathy consultation with Dr. Chetali in a few steps." },
      { property: "og:title", content: "Book with Dr. Chetali — Health & Homeopathy" },
      { property: "og:description", content: "Comprehensive 45-minute or follow-up 20-minute consultations, worldwide." },
    ],
  }),
  component: Book,
});

const FEES = { Comprehensive: 1500, "Follow-up": 800 } as const;
const SLOTS = { Morning: ["09:30", "10:15", "11:00", "11:45"], Afternoon: ["13:00", "14:30", "15:15", "16:00"], Evening: ["17:00", "17:45", "18:30", "19:30"] };
const STEPS = ["Type", "Duration", "Slot", "Intake", "Pay"];

function Book() {
  const { addAppointment } = useApp();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"online" | "clinic">("online");
  const [kind, setKind] = useState<"Comprehensive" | "Follow-up">("Comprehensive");
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; }), []);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [intake, setIntake] = useState({ complaint: "", onset: "", meds: "" });
  const [files, setFiles] = useState<string[]>([]);
  const [pay, setPay] = useState("UPI");
  const [done, setDone] = useState(false);
  const [drag, setDrag] = useState(false);

  const fee = FEES[kind];
  const platform = mode === "online" ? 50 : 0;
  const gst = Math.round((fee + platform) * 0.18);
  const total = fee + platform + gst;

  const isClosed = (d: Date) => d.getDay() === 0;
  const slotAllowed = (d: Date, t: string) => {
    if (mode === "online") return true;
    if (d.getDay() === 6) return t >= "10:00" && t < "14:00";
    return t >= "09:30" && t <= "18:30";
  };

  const canNext = [true, true, !!date && !!time, intake.complaint.trim().length > 2, true][step];

  const receipt = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFont("times", "bold"); doc.setFontSize(20); doc.text("Health & Homeopathy", 20, 24);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text("Dr. Chetali Damania, BHMS (Univ. of Goa) · Gold Medalist in Dietetics", 20, 31);
    doc.setFontSize(14); doc.text("Booking Receipt", 20, 46);
    doc.setFontSize(11);
    const rows = [
      ["Booking ID", `HH-${Date.now().toString().slice(-6)}`],
      ["Type", mode === "online" ? "Online Video Consultation" : "In-Person · Goa Clinic"],
      ["Consultation", `${kind} (${kind === "Comprehensive" ? 45 : 20} min)`],
      ["Date & time", `${date?.toDateString()} ${time}`],
      ["Complaint", intake.complaint],
      ["Consultation fee", `INR ${fee}`], ["Platform fee", `INR ${platform}`], ["GST 18%", `INR ${gst}`],
      ["Total paid", `INR ${total}`], ["Payment method", pay],
    ];
    rows.forEach(([k, v], i) => { doc.text(String(k), 20, 58 + i * 8); doc.text(String(v).slice(0, 60), 80, 58 + i * 8); });
    doc.save("booking-receipt.pdf");
  };

  const confirm = () => {
    if (!date || !time) return;
    addAppointment({ id: `A-${Date.now()}`, mode, kind, date: date.toISOString().slice(0, 10), time });
    setDone(true);
    toast.success("Payment successful · Appointment confirmed");
  };

  if (done)
    return (
      <div className="pt-10 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary"><Check className="h-10 w-10 text-primary" /></div>
        <h1 className="mt-4 text-3xl text-forest">You're booked</h1>
        <p className="text-sm text-muted-foreground">{date?.toDateString()} at {time} · {kind}</p>
        <button onClick={receipt} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"><Download className="h-4 w-4" /> Download PDF receipt</button>
        <Link to="/" className="mt-3 block text-sm text-primary">Back to home</Link>
      </div>
    );

  return (
    <div>
      <div className="flex items-center gap-2">
        {step > 0 && <button aria-label="Back" onClick={() => setStep(step - 1)}><ChevronLeft className="h-5 w-5" /></button>}
        <h1 className="text-3xl text-forest">Book a consultation</h1>
      </div>
      <div className="mt-3 flex gap-1">
        {STEPS.map((s, i) => <div key={s} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />)}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Step {step + 1} of 5 · {STEPS[step]}</p>

      <div className="mt-4 space-y-3">
        {step === 0 && (
          <>
            {([["online", Globe, "Online Video Consultation", "Worldwide — India, UAE, UK, US"], ["clinic", Building2, "In-Person Visit · Goa Clinic", "Mon–Fri 9:30–18:30 · Sat 10:00–14:00"]] as const).map(([v, Icon, t, d]) => (
              <button key={v} onClick={() => setMode(v)} className={cn("flex w-full items-center gap-3 rounded-2xl border bg-card p-4 text-left", mode === v ? "border-primary ring-2 ring-primary/20" : "border-border")}>
                <Icon className="h-6 w-6 text-primary" />
                <div><p className="font-semibold text-forest">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
              </button>
            ))}
          </>
        )}
        {step === 1 && (
          <>
            {([["Comprehensive", "First / Comprehensive · 45 min", "Deep-dive intake of your history, mind and body."], ["Follow-up", "Follow-up · 20 min", "Remedy review and adjustments."]] as const).map(([v, t, d]) => (
              <button key={v} onClick={() => setKind(v)} className={cn("flex w-full items-center justify-between rounded-2xl border bg-card p-4 text-left", kind === v ? "border-primary ring-2 ring-primary/20" : "border-border")}>
                <div><p className="font-semibold text-forest">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
                <span className="font-serif text-xl text-forest">₹{FEES[v]}</span>
              </button>
            ))}
          </>
        )}
        {step === 2 && (
          <>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
              {days.map((d) => {
                const closed = mode === "clinic" && isClosed(d);
                const active = date?.toDateString() === d.toDateString();
                return (
                  <button key={d.toISOString()} disabled={closed} onClick={() => { setDate(d); setTime(null); }} className={cn("flex w-14 shrink-0 flex-col items-center rounded-2xl border py-2", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card", closed && "opacity-40")}>
                    <span className="text-[10px] uppercase">{d.toLocaleDateString(undefined, { weekday: "short" })}</span>
                    <span className="font-serif text-xl">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
            {date && Object.entries(SLOTS).map(([part, ts]) => (
              <div key={part}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{part}</p>
                <div className="flex flex-wrap gap-2">
                  {ts.map((t) => {
                    const ok = slotAllowed(date, t);
                    return (
                      <button key={t} disabled={!ok} onClick={() => setTime(t)} className={cn("rounded-full border px-4 py-2 text-sm", time === t ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card", !ok && "opacity-30 line-through")}>{t}</button>
                    );
                  })}
                </div>
              </div>
            ))}
            {!date && <p className="text-sm text-muted-foreground">Pick a date to see available slots.</p>}
          </>
        )}
        {step === 3 && (
          <div className="space-y-3 text-sm">
            <textarea className="w-full rounded-xl border border-input bg-card p-3" rows={3} placeholder="Chief health complaint *" value={intake.complaint} onChange={(e) => setIntake({ ...intake, complaint: e.target.value })} />
            <label className="block text-xs text-muted-foreground">When did it start?
              <input type="date" className="mt-1 w-full rounded-xl border border-input bg-card p-3 text-sm text-foreground" value={intake.onset} onChange={(e) => setIntake({ ...intake, onset: e.target.value })} />
            </label>
            <input className="w-full rounded-xl border border-input bg-card p-3" placeholder="Current allopathic medicines (if any)" value={intake.meds} onChange={(e) => setIntake({ ...intake, meds: e.target.value })} />
            <label
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); setFiles((f) => [...f, ...Array.from(e.dataTransfer.files).map((x) => x.name)]); }}
              className={cn("flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center text-xs text-muted-foreground", drag ? "border-primary bg-secondary" : "border-border bg-card")}
            >
              <Upload className="h-6 w-6 text-primary" /> Drag & drop lab reports / scans, or tap to browse
              <input type="file" multiple className="hidden" onChange={(e) => setFiles((f) => [...f, ...Array.from(e.target.files ?? []).map((x) => x.name)])} />
            </label>
            {files.map((f) => <p key={f} className="flex items-center gap-2 text-xs text-forest"><Check className="h-3 w-3 text-success" /> {f}</p>)}
          </div>
        )}
        {step === 4 && (
          <>
            <Card>
              {[["Consultation fee", fee], ["Platform fee", platform], ["GST (18%)", gst]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 text-sm"><span className="text-muted-foreground">{k}</span><span>₹{v}</span></div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold text-forest"><span>Total</span><span className="font-serif text-2xl">₹{total}</span></div>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              {["UPI", "Credit/Debit Card", "NetBanking", "International Card"].map((p) => (
                <button key={p} onClick={() => setPay(p)} className={cn("rounded-xl border bg-card p-3 text-sm", pay === p ? "border-primary ring-2 ring-primary/20 text-forest" : "border-border")}>{p}</button>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        disabled={!canNext}
        onClick={() => (step === 4 ? confirm() : setStep(step + 1))}
        className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
      >
        {step === 4 ? `Pay ₹${total}` : "Continue"}
      </button>
    </div>
  );
}
