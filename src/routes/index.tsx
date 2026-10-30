import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarPlus, Truck, Upload, MessageCircle, Video, Award, Globe, GraduationCap, X } from "lucide-react";
import { Card, SectionTitle } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { CONDITIONS, TIPS } from "@/lib/data";
import { DoctorDashboard } from "@/components/DoctorDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Health & Homeopathy — Gentle care with Dr. Chetali" },
      { name: "description", content: "Book video or Goa clinic homeopathy consultations, track medicines and keep your health records in one place." },
      { property: "og:title", content: "Health & Homeopathy — Dr. Chetali Damania" },
      { property: "og:description", content: "Gentle homeopathy, honest answers. Consult worldwide from India, UAE, UK and US." },
    ],
  }),
  component: Index,
});

function useCountdown(target: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return "--:--:--";
  const diff = Math.max(0, target.getTime() - now);
  const h = Math.floor(diff / 3.6e6), m = Math.floor((diff % 3.6e6) / 6e4), s = Math.floor((diff % 6e4) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function Index() {
  const { role, appointments } = useApp();
  if (role === "doctor") return <DoctorDashboard />;
  const next = appointments[0] ?? { date: new Date().toISOString().slice(0, 10), time: "18:30", kind: "Follow-up" };
  const target = new Date(`${next.date}T${next.time}:00`);
  return <PatientHome target={target} kind={next.kind} />;
}

function PatientHome({ target, kind }: { target: Date; kind: string }) {
  const countdown = useCountdown(target);
  const [tip, setTip] = useState<(typeof TIPS)[number] | null>(null);
  const actions = [
    { label: "Book Consultation", icon: CalendarPlus, to: "/book" as const },
    { label: "Track Medicines", icon: Truck, to: "/medicines" as const },
    { label: "Upload Reports", icon: Upload, to: "/profile" as const },
  ];
  return (
    <div>
      <div className="rounded-3xl bg-gradient-forest p-5 text-primary-foreground shadow-soft">
        <p className="text-xs uppercase tracking-widest opacity-80">Next appointment</p>
        <h1 className="mt-1 text-3xl">{kind} · Video</h1>
        <p className="text-sm opacity-80">
          {target.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} at{" "}
          {target.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="mt-4 font-mono text-3xl tracking-wider">{countdown}</p>
        <Link to="/consult" className="mt-4 flex items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground">
          <Video className="h-4 w-4" /> Join Video Room
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {actions.map(({ label, icon: Icon, to }) => (
          <Link key={label} to={to} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center text-[11px] font-medium text-forest">
            <Icon className="h-5 w-5 text-primary" /> {label}
          </Link>
        ))}
        <a href="https://wa.me/919800000000" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center text-[11px] font-medium text-forest">
          <MessageCircle className="h-5 w-5 text-success" /> WhatsApp Clinic
        </a>
      </div>

      <Card className="mt-5">
        <div className="flex gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-secondary font-serif text-2xl text-forest">CD</div>
          <div>
            <h3 className="text-xl text-forest">Dr. Chetali Damania</h3>
            <p className="text-xs text-muted-foreground">Homeopath & Dietitian · “Gentle homeopathy, honest answers.”</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {[
            [Award, "18+ years experience"],
            [GraduationCap, "BHMS, Univ. of Goa"],
            [Award, "Gold Medalist, Dietetics"],
            [Globe, "6 countries served"],
          ].map(([I, t], i) => {
            const Icon = I as typeof Award;
            return (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-forest">
                <Icon className="h-4 w-4 text-accent" /> {t as string}
              </div>
            );
          })}
        </div>
      </Card>

      <SectionTitle title="Conditions" action={<Link to="/conditions" className="text-xs font-medium text-primary">See all</Link>} />
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
        {CONDITIONS.map((c) => (
          <Link key={c.id} to="/conditions" className="w-36 shrink-0 rounded-2xl border border-border bg-card p-4">
            <span className="text-2xl">{c.emoji}</span>
            <p className="mt-2 font-serif text-lg leading-tight text-forest">{c.name}</p>
          </Link>
        ))}
      </div>

      <SectionTitle title="Daily Companion" />
      <p className="-mt-2 mb-3 text-xs text-muted-foreground">Small reminders between visits</p>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {TIPS.map((t, i) => (
          <button key={t.title} onClick={() => setTip(t)} className={`flex h-48 w-32 shrink-0 flex-col justify-end rounded-2xl p-3 text-left ${i % 2 ? "bg-accent text-accent-foreground" : "bg-gradient-forest text-primary-foreground"}`}>
            <span className="text-[10px] uppercase tracking-widest opacity-80">{t.tag}</span>
            <span className="font-serif text-lg leading-tight">{t.title}</span>
          </button>
        ))}
      </div>

      {tip && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/50 p-4" onClick={() => setTip(null)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="text-2xl text-forest">{tip.title}</h3>
              <button aria-label="Close" onClick={() => setTip(null)}><X className="h-5 w-5" /></button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tip.body}</p>
          </div>
        </div>
      )}
    </div>
  );
}
