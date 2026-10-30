import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Upload, X, Award, GraduationCap, MapPin, Sliders } from "lucide-react";
import { toast } from "sonner";
import { Card, SectionTitle } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { HISTORY } from "@/lib/data";

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
  const { role, setDoctorTab, reports, addReport, consultationFees } = useApp();
  const [view, setView] = useState<string | null>(null);

  // If Doctor is viewing Profile, show Dr. Chetali's credentials & practice overview!
  if (role === "doctor") {
    return (
      <div>
        <Card className="flex items-center gap-4 border-emerald-800/30 bg-emerald-950 text-white">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-700 font-serif text-2xl text-white">
            CD
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Dr. Chetali Damania</h1>
            <p className="text-xs text-emerald-200">BHMS (Goa) · Gold Medalist, Dietetics</p>
            <p className="text-[11px] text-emerald-300/80 mt-1">Medical Reg: GHC-2451 · 18+ Years Practice</p>
          </div>
        </Card>

        <SectionTitle title="Practice Overview" />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-muted-foreground">Comprehensive (45m)</p>
            <p className="font-serif text-xl font-bold text-forest mt-1">₹{consultationFees.comprehensive}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-muted-foreground">Follow-up (20m)</p>
            <p className="font-serif text-xl font-bold text-forest mt-1">₹{consultationFees.followUp}</p>
          </div>
        </div>

        <SectionTitle title="Clinical Credentials" />
        <Card className="space-y-3 text-xs">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-accent shrink-0" />
            <div>
              <p className="font-semibold text-forest">Bachelor of Homeopathic Medicine and Surgery (BHMS)</p>
              <p className="text-muted-foreground">University of Goa · 2008</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-accent shrink-0" />
            <div>
              <p className="font-semibold text-forest">Gold Medalist in Dietetics & Clinical Nutrition</p>
              <p className="text-muted-foreground">Maharashtra State Board · 2010</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-accent shrink-0" />
            <div>
              <p className="font-semibold text-forest">Health & Homeopathy Clinic</p>
              <p className="text-muted-foreground">Panaji, Goa · In-person consultations by appointment</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Patient Profile View
  return (
    <div>
      <Card className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-forest font-serif text-2xl text-primary-foreground">
          AM
        </div>
        <div>
          <h1 className="text-2xl text-forest">Aarav Mehta</h1>
          <p className="text-xs text-muted-foreground">34 yrs · Male · Mumbai, India</p>
          <p className="text-xs text-muted-foreground">Allergies: Dust, pollen</p>
        </div>
      </Card>

      <SectionTitle
        title="Reports vault"
        action={
          <label className="flex cursor-pointer items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
            <Upload className="h-3.5 w-3.5" /> Upload
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                addReport({
                  id: String(Date.now()),
                  name: f.name,
                  date: "Today",
                  size: `${Math.ceil(f.size / 1024)} KB`,
                });
                toast.success("Report uploaded and shared with Dr. Chetali");
              }}
            />
          </label>
        }
      />
      <div className="space-y-2">
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setView(r.name)}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left hover:border-primary/40 transition"
          >
            <FileText className="h-5 w-5 text-accent" />
            <div className="flex-1">
              <p className="text-sm font-medium text-forest">{r.name}</p>
              <p className="text-[11px] text-muted-foreground">{r.date} · {r.size}</p>
            </div>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest/60 p-4"
          onClick={() => setView(null)}
        >
          <div className="w-full max-w-md rounded-2xl bg-card p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-border pb-2">
              <p className="font-semibold text-forest">{view}</p>
              <button aria-label="Close" onClick={() => setView(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 rounded-xl bg-muted p-6 text-center text-xs text-muted-foreground">
              Preview of your lab report. Encrypted and shared with Dr. Chetali's EMR.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
