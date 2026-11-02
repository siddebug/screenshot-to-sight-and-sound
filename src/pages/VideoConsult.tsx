import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PhoneCall,
  MessageCircle,
  Clock,
  ShieldCheck,
  FileText,
  User,
  X,
  Send,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CLINIC_WHATSAPP, INITIAL_QUEUE } from "../data/mockData";

function useStopwatch(isRunning: boolean) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

export const VideoConsult: React.FC = () => {
  const { role, reports, showToast, setDoctorTab } = useApp();
  const navigate = useNavigate();

  const isDoctor = role === "doctor";
  const [activePatient, setActivePatient] = useState(INITIAL_QUEUE[1]); // Aarav Mehta
  const [consultStarted, setConsultStarted] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<null | "chat" | "notes" | "reports">(null);
  const [messages, setMessages] = useState<string[]>([
    "Dr. Chetali: Hello Aarav, please keep your WhatsApp open. I am reviewing your IgE lab reports and will initiate our video call shortly.",
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState(
    "Patient reports 60% relief in morning sneezing fits. Nasal passages clearer. Continuing Rhus Tox 30C with Arsenicum Album at bedtime."
  );

  const duration = useStopwatch(consultStarted);

  // Doctor Action: Initiate WhatsApp Call
  const handleDoctorInitiateCall = () => {
    setConsultStarted(true);
    showToast(`Initiating WhatsApp Video Call to ${activePatient.patientName}...`);

    const text = encodeURIComponent(
      `Hello ${activePatient.patientName}, this is Dr. Chetali Damania for our scheduled homeopathic consultation (${activePatient.kind}). Initiating our video call now.`
    );
    const waUrl = `https://wa.me/${activePatient.patientWhatsApp || "919820188410"}?text=${text}`;
    window.open(waUrl, "_blank");
  };

  // Patient Action: Text Clinic Only (Patient cannot call)
  const handlePatientTextClinic = () => {
    const text = encodeURIComponent(
      `Hello Dr. Chetali, Aarav Mehta here. I am in the Medicate virtual waiting room for my ${activePatient.time} appointment.`
    );
    const waUrl = `https://wa.me/${CLINIC_WHATSAPP.clean}?text=${text}`;
    window.open(waUrl, "_blank");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const sender = isDoctor ? "Dr. Chetali" : "You (Aarav)";
    setMessages((prev) => [...prev, `${sender}: ${inputMsg.trim()}`]);
    setInputMsg("");
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#FBF9F5] pb-10 text-[#1B3B2B]">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E8E4DC] bg-white/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#5A685F] hover:text-[#1B3B2B]"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Dashboard
        </button>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-[#2D5A43]">
          <span className="h-2 w-2 rounded-full bg-[#2D5A43] animate-pulse" />
          <span>{consultStarted ? `In Call · ${duration}` : "Room Ready"}</span>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* ============================================================== */}
        {/* DOCTOR VIEW: EXCLUSIVE CALL INITIATION & PRACTICE COCKPIT      */}
        {/* ============================================================== */}
        {isDoctor ? (
          <div className="space-y-4">
            {/* Clinical Call Initiator Banner */}
            <div className="rounded-3xl border border-emerald-900/20 bg-emerald-950 p-5 text-white shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="flex items-center gap-1 rounded bg-emerald-800/80 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-200 uppercase">
                    <Stethoscope className="h-3 w-3" /> Doctor Practice Console
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-bold">{activePatient.patientName}</h2>
                  <p className="text-xs text-emerald-200/80">
                    {activePatient.kind} Consultation · {activePatient.country}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl font-bold text-emerald-300">{duration}</p>
                  <p className="text-[10px] text-emerald-200/60 uppercase">Consult Timer</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-emerald-900/50 p-3 text-xs text-emerald-100 border border-emerald-800/60">
                <p className="font-semibold text-white">Chief Complaint:</p>
                <p className="mt-0.5 text-emerald-200/90">{activePatient.complaint}</p>
                <p className="mt-2 text-[11px] text-emerald-300">
                  Registered WhatsApp: <span className="font-mono font-bold text-white">{activePatient.patientPhone || "+91 98201 88410"}</span>
                </p>
              </div>

              {/* Exclusive Doctor Video Initiation CTA */}
              <div className="mt-5 space-y-2">
                <button
                  onClick={handleDoctorInitiateCall}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-emerald-950 shadow-lg hover:bg-emerald-400 transition"
                >
                  <PhoneCall className="h-5 w-5" />
                  <span>Initiate WhatsApp Video Call</span>
                </button>
                <p className="text-center text-[10px] text-emerald-300/70">
                  Calls are initiated exclusively by you to ensure patient punctuality and privacy.
                </p>
              </div>
            </div>

            {/* Quick Actions Drawer Controls */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveDrawer(activeDrawer === "notes" ? null : "notes")}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-semibold transition ${
                  activeDrawer === "notes"
                    ? "border-[#2D5A43] bg-emerald-50 text-[#2D5A43]"
                    : "border-[#E8E4DC] bg-white text-[#5A685F] hover:border-[#2D5A43]"
                }`}
              >
                <FileText className="h-5 w-5 text-[#2D5A43]" />
                <span>Case Notes</span>
              </button>

              <button
                onClick={() => setActiveDrawer(activeDrawer === "chat" ? null : "chat")}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-semibold transition ${
                  activeDrawer === "chat"
                    ? "border-[#2D5A43] bg-emerald-50 text-[#2D5A43]"
                    : "border-[#E8E4DC] bg-white text-[#5A685F] hover:border-[#2D5A43]"
                }`}
              >
                <MessageCircle className="h-5 w-5 text-[#2D5A43]" />
                <span>In-App Chat</span>
              </button>

              <button
                onClick={() => {
                  setDoctorTab("dispatch");
                  navigate("/");
                }}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#E8E4DC] bg-white p-3 text-xs font-semibold text-[#5A685F] hover:border-[#2D5A43] transition"
              >
                <Stethoscope className="h-5 w-5 text-[#D97757]" />
                <span>Formulate Rx</span>
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* PATIENT VIEW: TEXT ONLY — WAITING FOR DOCTOR'S INCOMING CALL    */
          /* ============================================================== */
          <div className="space-y-4">
            {/* Virtual Waiting Room Card */}
            <div className="rounded-3xl border border-[#E8E4DC] bg-white p-5 shadow-sm text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#EBF4EF] text-[#2D5A43]">
                <Clock className="h-8 w-8 animate-pulse" />
              </div>

              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                <span>🔒 Text-Only Mode · Incoming Call Only</span>
              </div>

              <h2 className="mt-2 font-serif text-2xl font-bold text-[#1B3B2B]">Virtual Waiting Room</h2>
              <p className="text-xs text-[#5A685F] mt-1">
                Scheduled Slot: <span className="font-semibold text-[#1B3B2B]">11:30 AM (Follow-up)</span>
              </p>

              {/* Clinical Protocol Disclaimer */}
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-left text-xs text-amber-950">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                  <div>
                    <p className="font-bold">Strict Doctor-Initiated Call Policy</p>
                    <p className="mt-0.5 text-amber-900 leading-relaxed text-[11px]">
                      <b>Direct video calling is disabled for patients.</b> To maintain clinical consultation discipline and privacy, <b>only Dr. Chetali can initiate your video consultation call</b>. Patients have text-only access. Please keep WhatsApp unmuted to receive the doctor's call.
                    </p>
                  </div>
                </div>
              </div>

              {/* Patient Text-Only Action */}
              <div className="mt-5 space-y-2">
                <button
                  onClick={handlePatientTextClinic}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2D5A43] py-3 text-xs font-bold text-white shadow-md hover:bg-[#1B3B2B] transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Text Dr. Chetali on WhatsApp</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </button>

                <button
                  onClick={() => setActiveDrawer(activeDrawer === "chat" ? null : "chat")}
                  className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-[#E8E4DC] py-2.5 text-xs font-semibold text-[#5A685F] hover:bg-[#FBF9F5] transition"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#2D5A43]" />
                  <span>Open In-App Text Chat</span>
                </button>
              </div>
            </div>
                  <MessageCircle className="h-4 w-4" />
                  <span>Message Dr. Chetali on WhatsApp</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </button>

                <button
                  onClick={() => setActiveDrawer(activeDrawer === "chat" ? null : "chat")}
                  className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-[#E8E4DC] py-2.5 text-xs font-semibold text-[#5A685F] hover:bg-[#FBF9F5] transition"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#2D5A43]" />
                  <span>Open In-App Consultation Chat</span>
                </button>
              </div>
            </div>

            {/* Checklist for Consultation */}
            <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 text-xs space-y-2">
              <p className="font-serif font-bold text-sm text-[#1B3B2B]">Before Dr. Chetali Calls:</p>
              <div className="space-y-1.5 text-[11px] text-[#5A685F]">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2D5A43]" /> Keep recent lab reports accessible in your Vault
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2D5A43]" /> Note down changes in symptoms over the last 14 days
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2D5A43]" /> Sit in a quiet, well-lit room for face and tongue assessment
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* INTERACTIVE DRAWERS: CASE NOTES & IN-APP CHAT                  */}
        {/* ============================================================== */}
        {activeDrawer === "notes" && (
          <div className="rounded-3xl border border-[#E8E4DC] bg-white p-4 shadow-md animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2">
              <h3 className="font-serif font-bold text-sm text-[#1B3B2B]">Live EMR Consultation Notes</h3>
              <button onClick={() => setActiveDrawer(null)} className="text-[#5A685F] hover:text-[#1B3B2B]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="mt-3 w-full rounded-xl border border-[#E8E4DC] p-3 text-xs text-[#1B3B2B] focus:border-[#2D5A43] focus:outline-none"
              placeholder="Record symptoms, constitutional rubrics, and remedy plans..."
            />
            <button
              onClick={() => {
                showToast("Case notes saved to patient history");
                setActiveDrawer(null);
              }}
              className="mt-2 w-full rounded-xl bg-[#2D5A43] py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1B3B2B]"
            >
              Save Notes to EMR
            </button>
          </div>
        )}

        {activeDrawer === "chat" && (
          <div className="rounded-3xl border border-[#E8E4DC] bg-white p-4 shadow-md animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2">
              <h3 className="font-serif font-bold text-sm text-[#1B3B2B]">In-App Consultation Chat</h3>
              <button onClick={() => setActiveDrawer(null)} className="text-[#5A685F] hover:text-[#1B3B2B]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-2.5 leading-relaxed ${
                    m.startsWith("You")
                      ? "ml-6 bg-[#EBF4EF] text-[#1B3B2B]"
                      : "mr-6 bg-[#FBF9F5] text-[#1B3B2B] border border-[#E8E4DC]"
                  }`}
                >
                  {m}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder={isDoctor ? "Type clinical instruction..." : "Type text message to Dr. Chetali..."}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 rounded-xl border border-[#E8E4DC] px-3 py-2 text-xs text-[#1B3B2B] focus:border-[#2D5A43] focus:outline-none"
              />
              <button
                type="submit"
                className="grid h-8 w-8 place-items-center rounded-xl bg-[#2D5A43] text-white hover:bg-[#1B3B2B]"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
