import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, AlertTriangle, ChevronDown } from "lucide-react";
import { CONDITIONS } from "@/lib/data";

export const Route = createFileRoute("/conditions")({
  head: () => ({
    meta: [
      { title: "Conditions we treat — Health & Homeopathy" },
      { name: "description", content: "Six specialties with honest limits: when homeopathy helps and when to seek allopathic or emergency care." },
      { property: "og:title", content: "Conditions — Health & Homeopathy" },
      { property: "og:description", content: "Transparent triage across paediatrics, skin, hormones, anxiety, acute illness and dietetics." },
    ],
  }),
  component: Conditions,
});

function Conditions() {
  const [open, setOpen] = useState<string | null>(CONDITIONS[0].id);
  return (
    <div>
      <h1 className="text-3xl text-forest">Conditions</h1>
      <p className="text-sm text-muted-foreground">Gentle homeopathy, honest answers — including when you need something else.</p>
      <div className="mt-4 rounded-2xl border border-destructive/30 bg-accent-soft p-3 text-xs text-forest">
        <b>Emergency?</b> Chest pain, breathing difficulty, severe bleeding or suicidal thoughts — call 112 or go to the nearest hospital now.
      </div>
      <div className="mt-4 space-y-3">
        {CONDITIONS.map((c) => {
          const isOpen = open === c.id;
          return (
            <div key={c.id} className="rounded-2xl border border-border bg-card shadow-soft">
              <button onClick={() => setOpen(isOpen ? null : c.id)} className="flex w-full items-center gap-3 p-4 text-left">
                <span className="text-3xl">{c.emoji}</span>
                <div className="flex-1">
                  <p className="font-serif text-xl text-forest">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.blurb}</p>
                </div>
                <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="grid gap-3 px-4 pb-4 text-xs">
                  <div className="rounded-xl bg-secondary p-3">
                    <p className="mb-1 font-semibold text-forest">Where homeopathy helps</p>
                    {c.helps.map((h) => <p key={h} className="flex gap-2"><Check className="h-3.5 w-3.5 text-success" /> {h}</p>)}
                  </div>
                  <div className="rounded-xl bg-accent-soft p-3">
                    <p className="mb-1 font-semibold text-forest">See a doctor / allopathic care</p>
                    {c.refer.map((h) => <p key={h} className="flex gap-2"><AlertTriangle className="h-3.5 w-3.5 text-accent" /> {h}</p>)}
                  </div>
                  <Link to="/book" className="rounded-full bg-primary py-2.5 text-center font-semibold text-primary-foreground">Book a consultation</Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
