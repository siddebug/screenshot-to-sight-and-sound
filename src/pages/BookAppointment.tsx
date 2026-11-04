import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Globe,
  Building2,
  Upload,
  Check,
  Download,
  ChevronLeft,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { UpiPaymentFlow } from "../components/UpiPaymentFlow";

const SLOTS = {
  Morning: ["09:30", "10:15", "11:00", "11:45"],
  Afternoon: ["13:00", "14:30", "15:15", "16:00"],
  Evening: ["17:00", "17:45", "18:30", "19:30"],
};

const STEPS = ["Type", "Duration", "Slot", "Intake", "Checkout"];

export const BookAppointment: React.FC = () => {
  const { addAppointment, fees, addReport, showToast } = useApp();
  const location = useLocation();

  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"online" | "clinic">("online");
  const [kind, setKind] = useState<"Comprehensive" | "Follow-up">("Comprehensive");

  // Next 14 calendar days
  const calendarDays = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return d;
    });
  }, []);

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [intake, setIntake] = useState({ complaint: "", onset: "", meds: "" });
  const [files, setFiles] = useState<string[]>([]);
  const [payMethod, setPayMethod] = useState("Direct UPI");
  const [isBooked, setIsBooked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Pre-fill chief complaint if redirected from a Specialty in Conditions.tsx
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const spec = params.get("specialty");
    if (spec) {
      const cleanSpec = spec.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      setIntake((prev) => ({
        ...prev,
        complaint: `Consultation for ${cleanSpec}`,
      }));
    }
  }, [location]);

  const feeAmount = kind === "Comprehensive" ? fees.comprehensive : fees.followUp;
  const totalAmount = feeAmount;

  const isSunday = (d: Date) => d.getDay() === 0;
  const isSlotAllowed = (d: Date, t: string) => {
    if (mode === "online") return true;
    if (d.getDay() === 6) return t >= "10:00" && t < "14:00"; // Saturday clinic hours
    return t >= "09:30" && t <= "18:30";
  };

  const canProceed = [
    true,
    true,
    !!date && !!time,
    intake.complaint.trim().length > 2,
    true,
  ][step];

  const handleConfirm = (paymentMethodInfo?: string) => {
    if (!date || !time) return;

    const chosenPayment = paymentMethodInfo || payMethod;

    // Add appointment
    addAppointment({
      id: `A-${Date.now()}`,
      mode,
      kind,
      date: date.toISOString().slice(0, 10),
      time,
      patientName: "Aarav Mehta",
      patientPhone: "+91 98201 88410",
      patientWhatsApp: "919820188410",
      complaint: intake.complaint,
      status: "Upcoming",
    });

    // Add attached files to shared records vault
    files.forEach((f) => {
      addReport({
        id: String(Date.now() + Math.random()),
        name: f,
        date: "Today",
        size: "180 KB",
      });
    });

    setPayMethod(chosenPayment);
    setIsBooked(true);
    showToast("Booking & payment verified with Dr. Chetali!");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (isBooked) {
    return (
      <div className="pt-8 text-center space-y-4">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#EBF4EF]">
          <Check className="h-10 w-10 text-[#2D5A43]" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1B3B2B]">Booking Confirmed!</h1>
          <p className="text-xs text-[#5A685F] mt-1">
            {date?.toDateString()} at {time} · {kind} ({mode === "online" ? "Online Video" : "In-Person Goa Clinic"})
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 text-left text-xs space-y-2">
          <div className="flex justify-between border-b border-[#EFECE6] pb-2 font-bold text-[#1B3B2B]">
            <span>Receipt Total</span>
            <span className="font-serif text-base">₹{totalAmount}</span>
          </div>
          <p className="text-[#5A685F]">Patient: <span className="text-[#1B3B2B] font-semibold">Aarav Mehta</span></p>
          <p className="text-[#5A685F]">Doctor: <span className="text-[#1B3B2B] font-semibold">Dr. Chetali Damania, CCAH, Medalist in BHMS</span></p>
          <p className="text-[#5A685F]">Payment: <span className="text-[#1B3B2B] font-semibold">{payMethod} · Paid</span></p>
        </div>

        <button
          onClick={handlePrintReceipt}
          className="inline-flex items-center gap-2 rounded-full bg-[#1B3B2B] px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#264F3B]"
        >
          <Download className="h-4 w-4" /> Download / Print Receipt
        </button>

        <div>
          <Link to="/" className="text-xs font-semibold text-[#2D5A43] hover:underline">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="flex items-center gap-2">
        {step > 0 && (
          <button
            aria-label="Back"
            onClick={() => setStep(step - 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#E8E4DC] bg-white"
          >
            <ChevronLeft className="h-4 w-4 text-[#1B3B2B]" />
          </button>
        )}
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1B3B2B]">Book Consultation</h1>
          <p className="text-[11px] text-[#5A685F]">Step {step + 1} of 5 · {STEPS[step]}</p>
        </div>
      </div>

      {/* Step Stepper Progress Bar */}
      <div className="flex gap-1">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition ${
              i <= step ? "bg-[#2D5A43]" : "bg-[#EFECE6]"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Mode Selection */}
      {step === 0 && (
        <div className="space-y-3 pt-2">
          {[
            {
              id: "online",
              icon: Globe,
              title: "Online WhatsApp Video Consultation",
              desc: "Consult worldwide. Video call is initiated directly by Dr. Chetali to your registered WhatsApp.",
            },
            {
              id: "clinic",
              icon: Building2,
              title: "In-Person Visit · Goa Clinic",
              desc: "Panaji clinic. Mon–Fri 9:30–18:30, Sat 10:00–14:00 by appointment.",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id as any)}
              className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition ${
                mode === item.id
                  ? "border-[#2D5A43] bg-white ring-2 ring-[#2D5A43]/20 shadow-sm"
                  : "border-[#E8E4DC] bg-white hover:border-[#2D5A43]/40"
              }`}
            >
              <item.icon className="h-6 w-6 text-[#2D5A43] shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-base font-bold text-[#1B3B2B]">{item.title}</p>
                <p className="text-xs text-[#5A685F] mt-0.5">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Duration & Fee */}
      {step === 1 && (
        <div className="space-y-3 pt-2">
          {[
            {
              id: "Comprehensive",
              title: "First / Comprehensive · 45 min",
              desc: "Deep-dive constitutional intake into symptoms, sleep, stress & dietary reality.",
              price: fees.comprehensive,
            },
            {
              id: "Follow-up",
              title: "Follow-up Visit · 20 min",
              desc: "Reviewing remedy response, symptom relief percentage & dosage adjustments.",
              price: fees.followUp,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setKind(item.id as any)}
              className={`flex w-full items-start justify-between rounded-2xl border p-4 text-left transition ${
                kind === item.id
                  ? "border-[#2D5A43] bg-white ring-2 ring-[#2D5A43]/20 shadow-sm"
                  : "border-[#E8E4DC] bg-white hover:border-[#2D5A43]/40"
              }`}
            >
              <div>
                <p className="font-serif text-base font-bold text-[#1B3B2B]">{item.title}</p>
                <p className="text-xs text-[#5A685F] mt-0.5 pr-2">{item.desc}</p>
              </div>
              <span className="font-serif text-xl font-bold text-[#1B3B2B]">₹{item.price}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Calendar & Slot Picker */}
      {step === 2 && (
        <div className="space-y-4 pt-2">
          <p className="text-xs font-semibold text-[#5A685F]">Select Date</p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {calendarDays.map((d) => {
              const closed = mode === "clinic" && isSunday(d);
              const isSelected = date?.toDateString() === d.toDateString();
              return (
                <button
                  key={d.toISOString()}
                  disabled={closed}
                  onClick={() => {
                    setDate(d);
                    setTime(null);
                  }}
                  className={`flex w-14 shrink-0 flex-col items-center rounded-2xl border py-2.5 transition ${
                    isSelected
                      ? "border-[#2D5A43] bg-[#2D5A43] text-white shadow-sm"
                      : "border-[#E8E4DC] bg-white text-[#1B3B2B]"
                  } ${closed ? "opacity-35 cursor-not-allowed bg-gray-50" : "hover:border-[#2D5A43]"}`}
                >
                  <span className="text-[10px] uppercase font-semibold">
                    {d.toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                  <span className="font-serif text-lg font-bold">{d.getDate()}</span>
                </button>
              );
            })}
          </div>

          {date ? (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-[#5A685F]">
                Available Slots for {date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
              </p>
              {Object.entries(SLOTS).map(([category, times]) => (
                <div key={category}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#D97757] mb-1.5">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {times.map((slot) => {
                      const allowed = isSlotAllowed(date, slot);
                      const isChosen = time === slot;
                      return (
                        <button
                          key={slot}
                          disabled={!allowed}
                          onClick={() => setTime(slot)}
                          className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                            isChosen
                              ? "border-[#D97757] bg-[#D97757] text-white shadow-sm font-bold"
                              : "border-[#E8E4DC] bg-white text-[#1B3B2B]"
                          } ${!allowed ? "opacity-30 line-through cursor-not-allowed" : "hover:border-[#D97757]"}`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E4DC] p-6 text-center text-xs text-[#5A685F]">
              Please choose a date from the calendar above to view open slots.
            </div>
          )}
        </div>
      )}

      {/* Step 4: Medical Intake Questionnaire */}
      {step === 3 && (
        <div className="space-y-3 pt-2 text-xs">
          <div>
            <label className="block text-[#1B3B2B] font-semibold mb-1">Chief Health Complaint *</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-[#E8E4DC] bg-white p-3 text-xs text-[#1B3B2B] focus:outline-none focus:ring-1 focus:ring-[#2D5A43]"
              placeholder="Describe what you are facing (e.g. chronic sinusitis, eczema flare, sleep issues...)"
              value={intake.complaint}
              onChange={(e) => setIntake({ ...intake, complaint: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[#1B3B2B] font-semibold mb-1">When did symptoms begin?</label>
            <input
              type="date"
              className="w-full rounded-xl border border-[#E8E4DC] bg-white p-2.5 text-xs text-[#1B3B2B]"
              value={intake.onset}
              onChange={(e) => setIntake({ ...intake, onset: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[#1B3B2B] font-semibold mb-1">Current Allopathic / Other Medicines</label>
            <input
              type="text"
              className="w-full rounded-xl border border-[#E8E4DC] bg-white p-2.5 text-xs text-[#1B3B2B]"
              placeholder="e.g. Antihistamines, Thyroxine 50mcg, inhalers..."
              value={intake.meds}
              onChange={(e) => setIntake({ ...intake, meds: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[#1B3B2B] font-semibold mb-1">Upload Lab Reports / Scans (Optional)</label>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files).map((f) => f.name)]);
              }}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-5 text-center text-xs transition ${
                isDragging ? "border-[#2D5A43] bg-[#EBF4EF]" : "border-[#E8E4DC] bg-white hover:border-[#2D5A43]"
              }`}
            >
              <Upload className="h-6 w-6 text-[#2D5A43]" />
              <span className="text-[#5A685F]">Drag & drop lab PDFs or images here, or tap to browse</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files || []).map((f) => f.name)])}
              />
            </label>
            {files.map((name) => (
              <p key={name} className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-[#2D5A43]">
                <Check className="h-3 w-3 text-emerald-600" /> {name}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Checkout & Zero-Cost UPI Payment */}
      {step === 4 && (
        <div className="space-y-4 pt-2 text-xs">
          <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#1B3B2B] mb-2">Consultation Summary</h3>
            <div className="flex justify-between text-[#5A685F]">
              <span>{kind} Consultation ({kind === "Comprehensive" ? "45 min" : "20 min"})</span>
              <span className="text-[#1B3B2B] font-semibold">₹{feeAmount}</span>
            </div>
            <div className="flex justify-between text-[#5A685F]">
              <span>Platform Surcharge (Zero Cost Policy)</span>
              <span className="text-[#2D5A43] font-semibold">₹0 (Free)</span>
            </div>
            <div className="flex justify-between border-t border-[#EFECE6] pt-2 text-sm font-bold text-[#1B3B2B]">
              <span>Direct Doctor Fee</span>
              <span className="font-serif text-2xl font-bold">₹{totalAmount}</span>
            </div>
          </div>

          <UpiPaymentFlow
            amount={totalAmount}
            patientName="Aarav Mehta"
            kind={kind}
            onPaymentSuccess={(utr, method) => {
              handleConfirm(`${method} (Ref: ${utr})`);
            }}
          />
        </div>
      )}

      {/* Navigation Buttons for steps 0 through 3 */}
      {step < 4 && (
        <div className="pt-2">
          <button
            disabled={!canProceed}
            onClick={() => setStep(step + 1)}
            className="w-full rounded-full bg-[#1B3B2B] py-3.5 text-xs font-bold text-white shadow-md disabled:opacity-40 hover:bg-[#264F3B] transition"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

