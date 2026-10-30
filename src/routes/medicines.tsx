import { createFileRoute } from "@tanstack/react-router";
import { Copy, ExternalLink, ShieldCheck, Sun, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Card, SectionTitle } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { COURIERS, ORDER_STAGES, PRESCRIPTION } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/medicines")({
  head: () => ({
    meta: [
      { title: "Prescriptions & tracking — Health & Homeopathy" },
      { name: "description", content: "View your signed homeopathic prescription and track your remedy parcel with your courier." },
      { property: "og:title", content: "Medicines — Health & Homeopathy" },
      { property: "og:description", content: "Prescriptions, dosage, precautions and live courier tracking." },
    ],
  }),
  component: Medicines,
});

function Medicines() {
  const { orders } = useApp();
  const copy = async (awb: string) => {
    try { await navigator.clipboard.writeText(awb); } catch { /* ignore */ }
    toast.success(`AWB ${awb} copied`);
  };
  return (
    <div>
      <h1 className="text-3xl text-forest">Medicines</h1>

      <SectionTitle title="Delivery" />
      <div className="space-y-4">
        {orders.map((o) => {
          const c = COURIERS[o.courier];
          return (
            <Card key={o.id}>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">{ORDER_STAGES[o.stage]}</span>
                <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] text-forest"><CalendarClock className="h-3 w-3" /> {o.eta}</span>
              </div>
              <div className="mt-4 flex items-center">
                {ORDER_STAGES.map((s, i) => (
                  <div key={s} className="flex flex-1 flex-col items-center text-center">
                    <div className="flex w-full items-center">
                      <div className={cn("h-0.5 flex-1", i === 0 ? "opacity-0" : i <= o.stage ? "bg-primary" : "bg-muted")} />
                      <div className={cn("h-3.5 w-3.5 rounded-full border-2", i <= o.stage ? "border-primary bg-primary" : "border-border bg-card", i === o.stage && "ring-4 ring-primary/20")} />
                      <div className={cn("h-0.5 flex-1", i === ORDER_STAGES.length - 1 ? "opacity-0" : i < o.stage ? "bg-primary" : "bg-muted")} />
                    </div>
                    <span className="mt-1 text-[10px] text-muted-foreground">{s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted p-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-forest text-xs font-bold text-primary-foreground">{c.short}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-forest">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{o.remedies.join(", ")}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-border p-3">
                <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">AWB / Tracking no.</p><p className="font-mono text-lg font-semibold text-forest">{o.awb}</p></div>
                <button onClick={() => copy(o.awb)} className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-2 text-xs"><Copy className="h-3.5 w-3.5" /> Copy AWB</button>
              </div>
              <a href={c.url(o.awb)} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
                Track Package on {c.name} <ExternalLink className="h-4 w-4" />
              </a>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl bg-accent-soft p-4 text-xs text-forest">
        <Sun className="h-5 w-5 shrink-0 text-accent" />
        Keep remedies in a cool, dry place away from sunlight and strong aromatic substances.
      </div>

      <SectionTitle title="Prescription" />
      <Card>
        <div className="flex items-start justify-between">
          <div><p className="font-serif text-xl text-forest">{PRESCRIPTION.diagnosis}</p><p className="text-xs text-muted-foreground">{PRESCRIPTION.id} · {PRESCRIPTION.date}</p></div>
          <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-primary"><ShieldCheck className="h-3 w-3" /> Digitally signed</span>
        </div>
        <div className="mt-4 space-y-3">
          {PRESCRIPTION.remedies.map((r) => (
            <div key={r.name} className="rounded-xl border border-border p-3">
              <p className="font-semibold text-forest">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.dose} · {r.duration}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dietary precautions</p>
        <ul className="mt-1 list-disc pl-5 text-xs text-forest">{PRESCRIPTION.precautions.map((p) => <li key={p}>{p}</li>)}</ul>
        <div className="mt-4 border-t border-border pt-3 text-right">
          <p className="font-serif text-lg italic text-forest">Dr. Chetali Damania</p>
          <p className="text-[10px] text-muted-foreground">BHMS, University of Goa · Reg. No. GHC-2451</p>
        </div>
      </Card>
    </div>
  );
}
