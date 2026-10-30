import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Home,
  Stethoscope,
  CalendarDays,
  Pill,
  User,
  Leaf,
  Users,
  Send,
  Sliders,
  Clock,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useApp, type DoctorTab } from "@/lib/app-store";
import { cn } from "@/lib/utils";

const PATIENT_NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/conditions", label: "Conditions", icon: Stethoscope },
  { to: "/book", label: "Book", icon: CalendarDays },
  { to: "/medicines", label: "Medicines", icon: Pill },
  { to: "/profile", label: "Records", icon: User },
] as const;

const DOCTOR_NAV: { tab: DoctorTab; label: string; icon: typeof Clock }[] = [
  { tab: "queue", label: "Queue", icon: Clock },
  { tab: "patients", label: "Patients", icon: Users },
  { tab: "dispatch", label: "Rx & Dispatch", icon: Send },
  { tab: "settings", label: "Settings", icon: Sliders },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { role, setRole, doctorTab, setDoctorTab, appointments, orders } = useApp();
  const { pathname } = useLocation();
  const hideChrome = pathname.startsWith("/consult");

  if (hideChrome) return <>{children}</>;

  const isDoctor = role === "doctor";

  return (
    <div className={cn("mx-auto min-h-screen max-w-md pb-24 transition-colors", isDoctor ? "bg-[#F7F9F8]" : "bg-background")}>
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-30 border-b px-4 pb-3 pt-3 backdrop-blur transition-colors",
          isDoctor ? "border-emerald-900/10 bg-emerald-950 text-white" : "border-border bg-background/90"
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full text-primary-foreground",
                isDoctor ? "bg-emerald-600" : "bg-gradient-forest"
              )}
            >
              {isDoctor ? <Stethoscope className="h-4 w-4" /> : <Leaf className="h-4 w-4" />}
            </span>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <p className={cn("font-serif text-lg font-semibold", isDoctor ? "text-white" : "text-forest")}>
                  {isDoctor ? "Dr. Chetali Damania" : "Health & Homeopathy"}
                </p>
                {isDoctor && (
                  <span className="flex items-center gap-0.5 rounded bg-emerald-800/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-200">
                    <ShieldCheck className="h-2.5 w-2.5" /> Doctor Console
                  </span>
                )}
              </div>
              <p className={cn("text-[11px]", isDoctor ? "text-emerald-200/80" : "text-muted-foreground")}>
                {isDoctor ? "BHMS (Goa) · Reg. GHC-2451" : "Hello, Aarav 👋"}
              </p>
            </div>
          </Link>
          <button
            aria-label="Notifications"
            onClick={() =>
              toast(isDoctor ? "2 patients in waiting room for video consult 🔔" : "Your Blue Dart parcel is in transit 📦")
            }
            className={cn(
              "relative grid h-10 w-10 place-items-center rounded-full border transition-colors",
              isDoctor ? "border-emerald-800 bg-emerald-900/60 text-emerald-200" : "border-border bg-card text-forest"
            )}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>

        {/* Global Role Switcher */}
        <div
          className={cn(
            "mt-3 grid grid-cols-2 rounded-full p-1 text-xs font-medium transition-colors",
            isDoctor ? "bg-emerald-900/70" : "bg-muted"
          )}
        >
          <button
            onClick={() => setRole("patient")}
            className={cn(
              "rounded-full py-1.5 transition",
              !isDoctor ? "bg-card text-forest shadow-soft" : "text-emerald-200/70 hover:text-white"
            )}
          >
            Patient View
          </button>
          <button
            onClick={() => setRole("doctor")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-full py-1.5 transition",
              isDoctor ? "bg-emerald-700 text-white shadow-soft" : "text-muted-foreground hover:text-forest"
            )}
          >
            Doctor View (Dr. Chetali)
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-4">{children}</main>

      {/* Role-Specific Bottom Navigation Bar */}
      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t backdrop-blur",
          isDoctor ? "border-emerald-900/20 bg-emerald-950/95 text-white" : "border-border bg-card/95"
        )}
      >
        {isDoctor ? (
          /* DOCTOR NAVIGATION */
          <ul className="grid grid-cols-4">
            {DOCTOR_NAV.map(({ tab, label, icon: Icon }) => {
              const active = pathname === "/" && doctorTab === tab;
              return (
                <li key={tab}>
                  <Link
                    to="/"
                    onClick={() => setDoctorTab(tab)}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors",
                      active ? "text-white font-medium" : "text-emerald-300/60 hover:text-emerald-200"
                    )}
                  >
                    <span className={cn("rounded-full px-3 py-1 transition-colors", active && "bg-emerald-800")}>
                      <Icon className="h-5 w-5" />
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          /* PATIENT NAVIGATION */
          <ul className="grid grid-cols-5">
            {PATIENT_NAV.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 text-[11px]",
                      active ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    <span className={cn("rounded-full px-3 py-1", active && "bg-secondary")}>
                      <Icon className="h-5 w-5" />
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </div>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-end justify-between">
      <h2 className="text-2xl text-forest">{title}</h2>
      {action}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-4 shadow-soft", className)}>{children}</div>;
}
