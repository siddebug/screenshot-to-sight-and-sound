import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  MessageSquare,
  PhoneOff,
  Wifi,
  FileText,
  X,
  Send,
} from "lucide-react";
import { useApp } from "../context/AppContext";

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
  const { role, reports, showToast } = useApp();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<"waiting" | "call">("waiting");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [activeDrawer, setActiveDrawer] = useState<null | "chat" | "side">(null);
  const [messages, setMessages] = useState<string[]>([
    "Dr. Chetali: Hello Aarav! How have your symptoms been this week?",
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const callDuration = useStopwatch(phase === "call");

  // Camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (camOn && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Camera permission denied or not found
        });
    }
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [camOn]);

  // Simulate auto-admission for patient after 4 seconds
  useEffect(() => {
    if (phase === "waiting" && role === "patient") {
      const timer = setTimeout(() => {
        setPhase("call");
        showToast("Dr. Chetali has admitted you to the consultation room");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [phase, role, showToast]);

  const handleEndCall = () => {
    showToast("Consultation call ended");
    navigate("/");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages((prev) => [...prev, `You: ${inputMsg.trim()}`]);
    setInputMsg("");
  };

  // Self Camera View
  const SelfCamera = (
    <div className="relative h-full w-full overflow-hidden bg-[#1B3B2B] rounded-2xl">
      {camOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full scale-x-[-1] object-cover"
        />
      ) : (
        <div className="grid h-full place-items-center font-serif text-2xl text-emerald-200">
          Camera Off
        </div>
      )}
    </div>
  );

  // ==============================================================
  // 1. VIRTUAL WAITING ROOM
  // ==============================================================
  if (phase === "waiting") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#1B3B2B] p-5 text-white">
        <div className="flex items-center justify-between">
          <p className="font-serif text-xl font-bold">Virtual Waiting Room</p>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300 font-medium">
            <Wifi className="h-3.5 w-3.5" /> HD Ready
          </span>
        </div>

        <div className="mt-6 aspect-[4/3] overflow-hidden rounded-3xl border border-emerald-800 shadow-xl">
          {SelfCamera}
        </div>

        {/* Media Controls Preview */}
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`grid h-12 w-12 place-items-center rounded-full transition ${
              micOn ? "bg-white/15 text-white" : "bg-white text-[#1B3B2B]"
            }`}
          >
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setCamOn(!camOn)}
            className={`grid h-12 w-12 place-items-center rounded-full transition ${
              camOn ? "bg-white/15 text-white" : "bg-white text-[#1B3B2B]"
            }`}
          >
            {camOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5 text-rose-600" />}
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D97757] opacity-75" />
            <span className="relative h-3 w-3 rounded-full bg-[#D97757]" />
          </span>
          <p className="text-sm font-medium">
            {role === "doctor" ? "Patient Aarav Mehta is waiting" : "Dr. Chetali will admit you shortly"}
          </p>
        </div>

        <button
          onClick={() => setPhase("call")}
          className="mt-6 rounded-full bg-[#D97757] py-3 text-xs font-bold text-white shadow-lg hover:bg-[#c86646] transition"
        >
          {role === "doctor" ? "Admit Patient Now" : "Enter Consultation Room"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-3 text-xs text-emerald-200/80 hover:text-white transition text-center"
        >
          Leave Waiting Room
        </button>
      </div>
    );
  }

  // ==============================================================
  // 2. ACTIVE VIDEO CONSULTATION CANVAS
  // ==============================================================
  return (
    <div className="relative mx-auto h-screen max-w-md overflow-hidden bg-[#142D21] text-white">
      {/* Remote Participant Full Screen Canvas */}
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-[#1B3B2B] to-[#0E1F16]">
        <div className="text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white/10 font-serif text-3xl font-bold border border-white/20">
            {role === "doctor" ? "AM" : "CD"}
          </div>
          <p className="mt-3 font-serif text-2xl font-bold">
            {role === "doctor" ? "Aarav Mehta" : "Dr. Chetali Damania"}
          </p>
          <p className="text-xs text-emerald-300/80 mt-1 font-mono">
            Encrypted HD · {callDuration}
          </p>
        </div>
      </div>

      {/* Picture-in-Picture Local Preview */}
      <div className="absolute right-4 top-4 h-36 w-28 overflow-hidden rounded-2xl border-2 border-white/25 shadow-lg">
        {SelfCamera}
      </div>

      {/* Bottom Floating Call Controls */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center items-center gap-3 px-4">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`grid h-12 w-12 place-items-center rounded-full transition ${
            micOn ? "bg-white/20 text-white" : "bg-white text-[#1B3B2B]"
          }`}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 text-rose-600" />}
        </button>

        <button
          onClick={() => setCamOn(!camOn)}
          className={`grid h-12 w-12 place-items-center rounded-full transition ${
            camOn ? "bg-white/20 text-white" : "bg-white text-[#1B3B2B]"
          }`}
        >
          {camOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5 text-rose-600" />}
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === "chat" ? null : "chat")}
          className={`grid h-12 w-12 place-items-center rounded-full transition ${
            activeDrawer === "chat" ? "bg-emerald-600 text-white" : "bg-white/20 text-white"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === "side" ? null : "side")}
          className={`grid h-12 w-12 place-items-center rounded-full transition ${
            activeDrawer === "side" ? "bg-emerald-600 text-white" : "bg-white/20 text-white"
          }`}
        >
          <FileText className="h-5 w-5" />
        </button>

        <button
          aria-label="End call"
          onClick={handleEndCall}
          className="grid h-12 w-12 place-items-center rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 transition"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>

      {/* Slide-Up Drawer for In-Call Chat & Reports */}
      {activeDrawer && (
        <div className="absolute inset-x-0 bottom-0 z-20 max-h-[65%] overflow-y-auto rounded-t-3xl bg-white p-5 text-[#1B3B2B] shadow-2xl">
          <div className="flex justify-between items-center border-b border-[#EFECE6] pb-2">
            <p className="font-serif text-lg font-bold">
              {activeDrawer === "chat" ? "In-Call Chat" : role === "doctor" ? "Live Clinical Notes" : "Uploaded Lab Reports"}
            </p>
            <button onClick={() => setActiveDrawer(null)}>
              <X className="h-5 w-5 text-[#5A685F]" />
            </button>
          </div>

          {/* Chat Drawer */}
          {activeDrawer === "chat" && (
            <div className="mt-3 space-y-3">
              <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                {messages.map((m, idx) => (
                  <p key={idx} className="rounded-xl bg-[#FBF9F5] p-2.5 text-[#1B3B2B] border border-[#E8E4DC]">
                    {m}
                  </p>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-full border border-[#E8E4DC] px-4 py-2 text-xs focus:outline-none"
                  placeholder="Type a message..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                />
                <button
                  type="submit"
                  className="grid h-9 w-9 place-items-center rounded-full bg-[#1B3B2B] text-white"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Side Drawer: Patient Reports vs Doctor Notes */}
          {activeDrawer === "side" && role === "patient" && (
            <div className="mt-3 space-y-2 text-xs">
              {reports.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl bg-[#FBF9F5] p-3 border border-[#E8E4DC]">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#D97757]" />
                    <span className="font-medium text-[#1B3B2B]">{r.name}</span>
                  </div>
                  <span className="text-[11px] text-[#5A685F]">{r.size}</span>
                </div>
              ))}
            </div>
          )}

          {activeDrawer === "side" && role === "doctor" && (
            <div className="mt-3 space-y-3 text-xs">
              <textarea
                rows={4}
                className="w-full rounded-xl border border-[#E8E4DC] p-3 focus:outline-none"
                placeholder="Write consultation assessment & remedy plan..."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
              />
              <button
                onClick={() => showToast("Case notes saved to patient EMR")}
                className="w-full rounded-full bg-[#1B3B2B] py-2.5 text-xs font-bold text-white shadow-sm"
              >
                Save Notes to Patient EMR
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

