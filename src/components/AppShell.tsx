import { Link, useLocation } from "@tanstack/react-router";
import { Bell, Home, Stethoscope, CalendarDays, Pill, User, Leaf } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/conditions", label: "Conditions", icon: Stethoscope },
  { to: "/book", label: "Book", icon: CalendarDays },
  { to: "/medicines", label: "Medicines", icon: Pill },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { role, setRole } = useApp();
  const { pathname } = useLocation();
  const hideChrome = pathname.startsWith("/consult");

  if (hideChrome) return <>{children}</>;

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 pb-3 pt-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-forest text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="font-serif text-lg font-semibold text-forest">Health & Homeopathy</p>
              <p className="text-[11px] text-muted-foreground">
                {role === "doctor" ? "Good day, Dr. Chetali" : "Hello, Aarav 👋"}
              </p>
            </div>
          </Link>
          <button
            aria-label="Notifications"
            onClick={() => toast("Your Blue Dart parcel is in transit 📦")}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card"
          >
            <Bell className="h-4 w-4 text-forest" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 rounded-full bg-muted p-1 text-xs font-medium">
          {(["patient", "doctor"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "rounded-full py-1.5 transition",
                role === r ? "bg-card text-forest shadow-soft" : "text-muted-foreground",
              )}
            >
              {r === "patient" ? "Patient View" : "Doctor View (Dr. Chetali)"}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-border bg-card/95 backdrop-blur">
        <ul className="grid grid-cols-5">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[11px]",
                    active ? "text-primary" : "text-muted-foreground",
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
