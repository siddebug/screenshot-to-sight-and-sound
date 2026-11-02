import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Home,
  Stethoscope,
  CalendarDays,
  Pill,
  User,
  Leaf,
  ShieldCheck,
  Clock,
  Users,
  Send,
  Sliders,
} from "lucide-react";
import { useApp, DoctorTab } from "../context/AppContext";

const PATIENT_NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/conditions", label: "Specialties", icon: Stethoscope },
  { to: "/book", label: "Book", icon: CalendarDays },
  { to: "/medicines", label: "Medicines", icon: Pill },
  { to: "/records", label: "Records", icon: User },
];

const DOCTOR_NAV: { tab: DoctorTab; label: string; icon: typeof Clock }[] = [
  { tab: "queue", label: "Queue", icon: Clock },
  { tab: "patients", label: "Patients", icon: Users },
  { tab: "dispatch", label: "Rx & Dispatch", icon: Send },
  { tab: "settings", label: "Settings", icon: Sliders },
];

export const AppShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { role, setRole, doctorTab, setDoctorTab, showToast } = useApp();
  const location = useLocation();
  const isDoctor = role === "doctor";
  const hideChrome = location.pathname.startsWith("/consult");

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className={`mx-auto min-h-screen max-w-md pb-24 transition-colors ${isDoctor ? "bg-[#F7F9F8]" : "bg-[#FBF9F5]"}`}>
      {/* Top Header */}
      <header
        className={`sticky top-0 z-30 border-b px-4 pb-3 pt-3 backdrop-blur transition-colors ${
          isDoctor ? "border-emerald-900/10 bg-emerald-950 text-white" : "border-[#E8E4DC] bg-[#FBF9F5]/90 text-[#1B3B2B]"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span
              className={`grid h-9 w-9 place-items-center rounded-full text-white ${
                isDoctor ? "bg-emerald-600" : "bg-[#2D5A43]"
              }`}
            >
              {isDoctor ? <Stethoscope className="h-4 w-4" /> : <Leaf className="h-4 w-4" />}
            </span>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <p className={`font-serif text-lg font-bold ${isDoctor ? "text-white" : "text-[#1B3B2B]"}`}>
                  {isDoctor ? "Dr. Chetali Damania" : "Health & Homeopathy"}
                </p>
                {isDoctor && (
                  <span className="flex items-center gap-0.5 rounded bg-emerald-800/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-200">
                    <ShieldCheck className="h-2.5 w-2.5" /> Doctor Console
                  </span>
                )}
              </div>
              <p className={`text-[11px] ${isDoctor ? "text-emerald-200/80" : "text-[#5A685F]"}`}>
                {isDoctor ? "CCAH · Medalist in BHMS · Reg. GHC-2451" : "Hello, Aarav 👋"}
              </p>
            </div>
          </Link>

          <button
            aria-label="Notifications"
            onClick={() =>
              showToast(isDoctor ? "2 patients in waiting room for video consult 🔔" : "Your Blue Dart parcel is in transit 📦")
            }
            className={`relative grid h-10 w-10 place-items-center rounded-full border transition-colors ${
              isDoctor
                ? "border-emerald-800 bg-emerald-900/60 text-emerald-200"
                : "border-[#E8E4DC] bg-white text-[#1B3B2B]"
            }`}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D97757]" />
          </button>
        </div>

        {/* Global Role Switcher */}
        <div
          className={`mt-3 grid grid-cols-2 rounded-full p-1 text-xs font-medium transition-colors ${
            isDoctor ? "bg-emerald-900/70" : "bg-[#EFECE6]"
          }`}
        >
          <button
            onClick={() => setRole("patient")}
            className={`rounded-full py-1.5 transition ${
              !isDoctor ? "bg-white text-[#1B3B2B] shadow-sm font-semibold" : "text-emerald-200/70 hover:text-white"
            }`}
          >
            Patient View
          </button>
          <button
            onClick={() => setRole("doctor")}
            className={`rounded-full py-1.5 transition ${
              isDoctor ? "bg-emerald-700 text-white shadow-sm font-semibold" : "text-[#5A685F] hover:text-[#1B3B2B]"
            }`}
          >
            Doctor View (Dr. Chetali)
          </button>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="px-4 pt-4">{children}</main>

      {/* Role-Specific Navigation Bar */}
      <nav
        className={`fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t backdrop-blur ${
          isDoctor ? "border-emerald-900/20 bg-emerald-950/95 text-white" : "border-[#E8E4DC] bg-white/95 text-[#1B3B2B]"
        }`}
      >
        {isDoctor ? (
          /* Doctor Console Tabs */
          <ul className="grid grid-cols-4">
            {DOCTOR_NAV.map(({ tab, label, icon: Icon }) => {
              const active = location.pathname === "/" && doctorTab === tab;
              return (
                <li key={tab}>
                  <Link
                    to="/"
                    onClick={() => setDoctorTab(tab)}
                    className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
                      active ? "text-white font-semibold" : "text-emerald-300/60 hover:text-emerald-200"
                    }`}
                  >
                    <span className={`rounded-full px-3 py-1 transition-colors ${active ? "bg-emerald-800" : ""}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          /* Patient Tabs */
          <ul className="grid grid-cols-5">
            {PATIENT_NAV.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
                      active ? "text-[#2D5A43] font-semibold" : "text-[#5A685F] hover:text-[#1B3B2B]"
                    }`}
                  >
                    <span className={`rounded-full px-3 py-1 transition-colors ${active ? "bg-[#EBF4EF]" : ""}`}>
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
};
