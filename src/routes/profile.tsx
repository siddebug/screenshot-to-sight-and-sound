import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Card, SectionTitle } from "@/components/AppShell";
import { HISTORY, REPORTS } from "@/lib/data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My records — Health & Homeopathy" },
      { name: "description", content: "Your medical history, consultation notes and lab reports vault." },
      { property: "og:title", content: "Profile & records — Health & Homeopathy" },
      { property: "og:description", content: "Keep your health history and reports in one calm place." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [reports, setReports] = useState(REPORTS);
  const [view, setView] = useState<string | null>(null);
  return (
    <div>
      <Card className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-forest font-serif text-2xl text-primary-foreground">AM</div>
        <div>
          <h1 className="text-2xl text-forest">Aarav Mehta</h1>
          <p className="text-xs text-muted-foreground">34 yrs · Male · Mumbai, India</p>
          <p className="text-xs text-muted-foreground">Allergies: Dust, pollen</p>
        </div>
      </Card>

      <SectionTitle
        title="Reports vault"
        action={
          <label className="flex cursor-pointer items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Upload className="h-3.5 w-3.5" /> Upload
            <input type="file" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setReports((r) => [{ id: String(Date.now()), name: f.name, date: "Today", size: `${Math.ceil(f.size / 1024)} KB` }, ...r]);
              toast.success("Report uploaded");
            }} />
          </label>
        }
      />
      <div className="space-y-2">
        {reports.map((r) => (
          <button key={r.id} onClick={() => setView(r.name)} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left">
            <FileText className="h-5 w-5 text-accent" />
            <div className="flex-1"><p className="text-sm font-medium text-forest">{r.name}</p><p className="text-[11px] text-muted-foreground">{r.date} · {r.size}</p></div>
          </button>
        ))}
      </div>

      <SectionTitle title="Consultation history" />
      <div className="space-y-3 border-l-2 border-secondary pl-4">
        {HISTORY.map((h) => (
          <div key={h.date} className="relative">
            <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-primary" />
            <p className="text-xs text-muted-foreground">{h.date} · {h.type}</p>
            <p className="text-sm text-forest">{h.note}</p>
          </div>
        ))}
      </div>

      {view && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/60 p-4" onClick={() => setView(null)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between"><p className="font-semibold text-forest">{view}</p><button aria-label="Close" onClick={() => setView(null)}><X className="h-4 w-4" /></button></div>
            <p className="mt-4 rounded-xl bg-muted p-6 text-center text-xs text-muted-foreground">Preview of your report. Shared securely with Dr. Chetali.</p>
          </div>
        </div>
      )}
    </div>
  );
}
