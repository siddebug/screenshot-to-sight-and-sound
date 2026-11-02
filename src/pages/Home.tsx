import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarPlus,
  Truck,
  Upload,
  MessageCircle,
  Video,
  Award,
  Globe,
  GraduationCap,
  X,
  Play,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CLINICAL_SPECIALTIES, WELLNESS_TIPS } from "../data/mockData";
import { DoctorConsole } from "../components/DoctorConsole";
import { WellnessTip } from "../types";

export const Home: React.FC = () => {
  const { role, appointments } = useApp();

  // If in doctor role, render the Doctor Console
  if (role === "doctor") {
    return <DoctorConsole />;
  }

  // Patient Home
  const nextApp = appointments[0] || {
    date: new Date().toISOString().slice(0, 10),
    time: "18:30",
    kind: "Follow-up",
    mode: "online",
  };

  return <PatientHome nextApp={nextApp} />;
};

function useCountdown(targetHour = 18, targetMinute = 30) {
  const [timeLeft, setTimeLeft] = useState("02:44:12");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(targetHour, targetMinute, 0, 0);
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }
      const diff = Math.max(0, target.getTime() - now.getTime());
      const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
      const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetHour, targetMinute]);

  return timeLeft;
}

const PatientHome: React.FC<{ nextApp: any }> = ({ nextApp }) => {
  const countdown = useCountdown(18, 30);
  const [selectedTip, setSelectedTip] = useState<WellnessTip | null>(null);

  const quickActions = [
    { label: "Book Consult", icon: CalendarPlus, to: "/book" },
    { label: "Track Parcel", icon: Truck, to: "/medicines" },
    { label: "Upload Lab", icon: Upload, to: "/records" },
  ];

  return (
    <div className="space-y-4">
      {/* Next Appointment Card */}
      <div className="rounded-3xl bg-[#1B3B2B] p-5 text-white shadow-soft">
        <p className="text-[10px] uppercase tracking-widest text-emerald-300">Upcoming Consultation</p>
        <h1 className="mt-1 font-serif text-3xl font-bold">{nextApp.kind} · Online Video</h1>
        <p className="text-xs text-emerald-100/80">
          Today at {nextApp.time} with Dr. Chetali Damania
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-emerald-300/70">Time Remaining</p>
            <p className="font-mono text-2xl font-bold tracking-wider">{countdown}</p>
          </div>
          <Link
            to="/consult"
            className="flex items-center gap-2 rounded-full bg-[#D97757] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#c86646] transition"
          >
            <Video className="h-4 w-4" /> Enter Video Room
          </Link>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-4 gap-2">
        {quickActions.map(({ label, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#E8E4DC] bg-white p-3 text-center text-[11px] font-semibold text-[#1B3B2B] shadow-sm hover:border-[#2D5A43] transition"
          >
            <Icon className="h-5 w-5 text-[#2D5A43]" />
            <span>{label}</span>
          </Link>
        ))}
        <a
          href="https://wa.me/919800000000"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#E8E4DC] bg-white p-3 text-center text-[11px] font-semibold text-[#1B3B2B] shadow-sm hover:border-[#2D5A43] transition"
        >
          <MessageCircle className="h-5 w-5 text-emerald-600" />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Doctor Credentials Card */}
      <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#EBF4EF] font-serif text-2xl font-bold text-[#1B3B2B]">
            CD
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1B3B2B]">Dr. Chetali Damania</h3>
            <p className="text-xs text-[#5A685F]">
              Homeopath & Clinical Dietitian · <span className="italic">“Gentle homeopathy, honest answers.”</span>
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {[
            [GraduationCap, "CCAH (Adv. Homeopathy)"],
            [Award, "Medalist in BHMS"],
            [Award, "Adv. Dip. Dietetics & Nutrition"],
            [Globe, "18+ yrs · Global Practice"],
          ].map(([I, text], i) => {
            const Icon = I as typeof Award;
            return (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-[#FBF9F5] px-3 py-2 text-[#1B3B2B]">
                <Icon className="h-4 w-4 text-[#D97757] shrink-0" />
                <span className="font-medium text-[11px]">{text as string}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specialties Preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-xl font-bold text-[#1B3B2B]">Conditions Treated</h2>
          <Link to="/conditions" className="text-xs font-semibold text-[#2D5A43] hover:underline">
            View All {CLINICAL_SPECIALTIES.length} ↗
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CLINICAL_SPECIALTIES.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              to="/conditions"
              className="rounded-2xl border border-[#E8E4DC] bg-white p-3 shadow-sm hover:border-[#2D5A43] transition"
            >
              <span className="text-2xl">{c.emoji}</span>
              <p className="font-serif font-bold text-sm text-[#1B3B2B] mt-1">{c.name}</p>
              <p className="text-[10px] text-[#5A685F] line-clamp-2 mt-0.5">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Daily Wellness Companion */}
      <div>
        <h2 className="font-serif text-xl font-bold text-[#1B3B2B] mb-2">Small Reminders, Between Visits</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {WELLNESS_TIPS.map((tip) => (
            <button
              key={tip.title}
              onClick={() => setSelectedTip(tip)}
              className="w-48 shrink-0 rounded-2xl border border-[#E8E4DC] bg-white p-3 text-left shadow-sm hover:border-[#2D5A43] transition"
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#D97757]">
                <span>{tip.tag}</span>
                <Play className="h-3 w-3 fill-current" />
              </div>
              <p className="font-serif font-bold text-sm text-[#1B3B2B] mt-1">{tip.title}</p>
              <p className="text-[11px] text-[#5A685F] line-clamp-2 mt-1">{tip.body}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tip Modal */}
      {selectedTip && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedTip(null)}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#EFECE6] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D97757]">{selectedTip.tag}</span>
              <button onClick={() => setSelectedTip(null)}>
                <X className="h-4 w-4 text-[#5A685F]" />
              </button>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1B3B2B] mt-3">{selectedTip.title}</h3>
            <p className="text-xs text-[#5A685F] mt-2 leading-relaxed">{selectedTip.body}</p>
            <button
              onClick={() => setSelectedTip(null)}
              className="mt-5 w-full rounded-full bg-[#1B3B2B] py-2.5 text-xs font-semibold text-white"
            >
              Close Reminder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

