import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, AlertTriangle, ChevronDown, ArrowRight } from "lucide-react";
import { CLINICAL_SPECIALTIES } from "../data/mockData";

export const Conditions: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("paediatrics");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1B3B2B]">Conditions Treated</h1>
        <p className="text-xs text-[#5A685F] mt-1">
          Gentle homeopathy, honest answers — including exactly when you need conventional or emergency care.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="rounded-2xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-950">
        <p className="font-bold flex items-center gap-1.5 text-rose-800">
          <AlertTriangle className="h-4 w-4 shrink-0" /> Immediate Emergency Triage
        </p>
        <p className="mt-1 text-[11px] text-rose-900 leading-relaxed">
          For acute chest pain, sudden breathlessness, severe unmanageable bleeding, or acute psychiatric crises — immediately call 112 or visit your nearest hospital emergency department.
        </p>
      </div>

      {/* Specialty Accordions */}
      <div className="space-y-3">
        {CLINICAL_SPECIALTIES.map((c) => {
          const isOpen = openId === c.id;
          return (
            <div key={c.id} className="rounded-2xl border border-[#E8E4DC] bg-white shadow-sm overflow-hidden transition">
              <button
                onClick={() => setOpenId(isOpen ? null : c.id)}
                className="flex w-full items-center gap-3.5 p-4 text-left hover:bg-[#FBF9F5] transition"
              >
                <span className="text-3xl shrink-0">{c.emoji}</span>
                <div className="flex-1">
                  <p className="font-serif text-lg font-bold text-[#1B3B2B]">{c.name}</p>
                  <p className="text-xs text-[#5A685F] mt-0.5 line-clamp-1">{c.blurb}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-[#5A685F] transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 space-y-3 text-xs border-t border-[#EFECE6]">
                  {/* Where Homeopathy Helps */}
                  <div className="rounded-xl bg-[#EBF4EF] p-3 text-[#1B3B2B]">
                    <p className="mb-2 font-bold flex items-center gap-1 text-[#2D5A43]">
                      <Check className="h-4 w-4 text-emerald-600" /> Where Homeopathy Helps
                    </p>
                    <ul className="space-y-1.5 pl-5 list-disc text-[11px] text-[#1B3B2B]/90">
                      {c.helps.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* When to Look Elsewhere / Allopathic Care */}
                  <div className="rounded-xl bg-[#FDF2EE] p-3 text-[#1B3B2B]">
                    <p className="mb-2 font-bold flex items-center gap-1 text-[#D97757]">
                      <AlertTriangle className="h-4 w-4 text-[#D97757]" /> When to See Allopathy / Specialist
                    </p>
                    <ul className="space-y-1.5 pl-5 list-disc text-[11px] text-[#1B3B2B]/90">
                      {c.refer.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Book Button */}
                  <Link
                    to="/book"
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-[#1B3B2B] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#264F3B] transition"
                  >
                    <span>Book Consultation for {c.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

