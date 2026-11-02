import React from "react";
import {
  Copy,
  ExternalLink,
  ShieldCheck,
  Sun,
  CalendarClock,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { COURIERS, ORDER_STAGES } from "../data/mockData";

export const Medicines: React.FC = () => {
  const { orders, prescription, showToast } = useApp();

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard.writeText(awb);
    showToast(`AWB ${awb} copied to clipboard!`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1B3B2B]">Medicines & Tracking</h1>
        <p className="text-xs text-[#5A685F] mt-1">
          Signed prescriptions and real-time courier consignment status
        </p>
      </div>

      {/* 1. DISPATCH & PARCEL TRACKING SECTION */}
      <div>
        <h2 className="font-serif text-lg font-bold text-[#1B3B2B] mb-2">Active Shipments</h2>
        <div className="space-y-3">
          {orders.map((order) => {
            const courier = COURIERS[order.courier];
            return (
              <div key={order.id} className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#D97757] px-3 py-1 text-[11px] font-bold text-white">
                    {ORDER_STAGES[order.stage]}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-[#EBF4EF] px-3 py-1 text-[11px] font-semibold text-[#2D5A43]">
                    <CalendarClock className="h-3 w-3" /> {order.eta}
                  </span>
                </div>

                {/* Stepper Progress Bar */}
                <div className="pt-2 flex items-center">
                  {ORDER_STAGES.map((stageName, idx) => {
                    const isPassed = idx <= order.stage;
                    const isCurrent = idx === order.stage;
                    return (
                      <div key={stageName} className="flex flex-1 flex-col items-center text-center">
                        <div className="flex w-full items-center">
                          <div
                            className={`h-0.5 flex-1 ${
                              idx === 0 ? "opacity-0" : isPassed ? "bg-[#2D5A43]" : "bg-[#EFECE6]"
                            }`}
                          />
                          <div
                            className={`h-3.5 w-3.5 rounded-full border-2 transition ${
                              isPassed
                                ? "border-[#2D5A43] bg-[#2D5A43]"
                                : "border-[#E8E4DC] bg-white"
                            } ${isCurrent ? "ring-4 ring-[#2D5A43]/20" : ""}`}
                          />
                          <div
                            className={`h-0.5 flex-1 ${
                              idx === ORDER_STAGES.length - 1 ? "opacity-0" : isPassed ? "bg-[#2D5A43]" : "bg-[#EFECE6]"
                            }`}
                          />
                        </div>
                        <span className="mt-1 text-[10px] text-[#5A685F] font-medium">{stageName}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Courier Provider Details */}
                <div className="flex items-center gap-3 rounded-xl bg-[#FBF9F5] p-3 border border-[#EFECE6]">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1B3B2B] text-xs font-bold text-white shrink-0">
                    {courier.short}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#1B3B2B]">{courier.name}</p>
                    <p className="text-[11px] text-[#5A685F] line-clamp-1">{order.remedies.join(", ")}</p>
                  </div>
                </div>

                {/* AWB Box with 1-Tap Copy */}
                <div className="flex items-center justify-between rounded-xl border border-dashed border-[#E8E4DC] p-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#5A685F]">AWB / Tracking Number</p>
                    <p className="font-mono text-base font-bold text-[#1B3B2B] tracking-wide">{order.awb}</p>
                  </div>
                  <button
                    onClick={() => handleCopyAwb(order.awb)}
                    className="flex items-center gap-1 rounded-full border border-[#E8E4DC] bg-white px-3 py-1.5 text-xs font-semibold text-[#1B3B2B] hover:bg-[#FBF9F5] transition"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy AWB
                  </button>
                </div>

                {/* Direct 1-Tap Tracking Button */}
                <a
                  href={courier.getUrl(order.awb)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    if (order.courier === "indiapost") {
                      handleCopyAwb(order.awb);
                      showToast("AWB copied! Please paste it into India Post tracking field.");
                    }
                  }}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-[#1B3B2B] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#264F3B] transition"
                >
                  <span>Track Package on {courier.name}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Storage & Care Guidelines */}
      <div className="flex items-start gap-3 rounded-2xl bg-[#FDF2EE] p-4 text-xs text-[#1B3B2B] border border-[#F6DED6]">
        <Sun className="h-5 w-5 text-[#D97757] shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <b>Homeopathic Remedy Care:</b> Store globules and dilutions in a cool, dry place away from direct sunlight, camphor, coffee, eucalyptus balms, and strong perfumes.
        </p>
      </div>

      {/* 2. DIGITALLY SIGNED PRESCRIPTION CARD */}
      <div>
        <h2 className="font-serif text-lg font-bold text-[#1B3B2B] mb-2">Active E-Prescription</h2>
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-start justify-between border-b border-[#EFECE6] pb-3">
            <div>
              <p className="font-serif text-xl font-bold text-[#1B3B2B]">{prescription.diagnosis}</p>
              <p className="text-xs text-[#5A685F]">{prescription.id} · Issued {prescription.date}</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[#EBF4EF] px-2.5 py-1 text-[10px] font-bold text-[#2D5A43]">
              <ShieldCheck className="h-3.5 w-3.5" /> Digitally Signed
            </span>
          </div>

          <div className="space-y-2">
            {prescription.remedies.map((remedy) => (
              <div key={remedy.name} className="rounded-xl border border-[#E8E4DC] p-2.5 bg-[#FBF9F5]">
                <p className="font-bold text-xs text-[#1B3B2B]">{remedy.name}</p>
                <p className="text-[11px] text-[#5A685F] mt-0.5">{remedy.dose} · {remedy.duration}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A685F]">Clinical Dietetic Precautions</p>
            <ul className="mt-1 list-disc pl-5 text-[11px] text-[#1B3B2B] space-y-0.5">
              {prescription.precautions.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#EFECE6] pt-3 text-right">
            <p className="font-serif text-lg italic font-bold text-[#1B3B2B]">Dr. Chetali Damania</p>
            <p className="text-[10px] text-[#5A685F]">CCAH, Medalist in BHMS · Registration No. GHC-2451</p>
          </div>
        </div>
      </div>
    </div>
  );
};

