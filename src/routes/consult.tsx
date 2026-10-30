import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare, PhoneOff, Wifi, FileText, X, Send } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { REPORTS } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/consult")({
  head: () => ({
    meta: [
      { title: "Video consultation room — Health & Homeopathy" },
      { name: "description", content: "Secure HD video consultation with Dr. Chetali Damania." },
      { property: "og:title", content: "Video room — Health & Homeopathy" },
      { property: "og:description", content: "Join your homeopathy video consultation." },
    ],
  }),
  component: Consult,
});

function useCamera(on: boolean) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (on && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((s) => {
        stream = s;
        if (ref.current) ref.current.srcObject = s;
      }).catch(() => {});
    }
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [on]);
  return ref;
}

function Consult() {
  const { role } = useApp();
  const nav = useNavigate();
  const [phase, setPhase] = useState<"waiting" | "call">("waiting");
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [drawer, setDrawer] = useState<null | "chat" | "side">(null);
  const [msgs, setMsgs] = useState<string[]>(["Dr. Chetali: Hello! How have the sneezing episodes been?"]);
  const [msg, setMsg] = useState("");
  const [notes, setNotes] = useState("");
  const [rx, setRx] = useState<string[]>([]);
  const [rxIn, setRxIn] = useState("");
  const vid = useCamera(cam);

  useEffect(() => {
    if (phase === "waiting" && role === "patient") {
      const t = setTimeout(() => { setPhase("call"); toast("Dr. Chetali admitted you"); }, 5000);
      return () => clearTimeout(t);
    }
  }, [phase, role]);

  const end = () => { toast("Call ended"); nav({ to: "/" }); };

  const Self = (
    <div className="relative h-full w-full overflow-hidden bg-forest">
      {cam ? <video ref={vid} autoPlay playsInline muted className="h-full w-full scale-x-[-1] object-cover" /> : <div className="grid h-full place-items-center font-serif text-3xl text-primary-foreground">You</div>}
    </div>
  );

  if (phase === "waiting")
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-forest p-5 text-primary-foreground">
        <div className="flex items-center justify-between">
          <p className="font-serif text-xl">Waiting room</p>
          <span className="flex items-center gap-1 rounded-full bg-success/30 px-3 py-1 text-xs"><Wifi className="h-3 w-3" /> Network: Excellent</span>
        </div>
        <div className="mt-6 aspect-[3/4] overflow-hidden rounded-3xl">{Self}</div>
        <div className="mt-4 flex justify-center gap-3">
          <RoundBtn on={mic} onClick={() => setMic(!mic)} icon={mic ? Mic : MicOff} label="Mic" />
          <RoundBtn on={cam} onClick={() => setCam(!cam)} icon={cam ? Video : VideoOff} label="Camera" />
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" /><span className="relative h-3 w-3 rounded-full bg-accent" /></span>
          <p className="text-sm">{role === "doctor" ? "Patient Aarav Mehta is waiting" : "Dr. Chetali will admit you shortly"}</p>
        </div>
        <button onClick={() => setPhase("call")} className="mt-6 rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground">
          {role === "doctor" ? "Admit patient" : "Enter now"}
        </button>
        <button onClick={() => nav({ to: "/" })} className="mt-3 text-sm opacity-80">Leave</button>
      </div>
    );

  return (
    <div className="relative mx-auto h-screen max-w-md overflow-hidden bg-forest text-primary-foreground">
      <div className="absolute inset-0 grid place-items-center bg-gradient-forest">
        <div className="text-center">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-primary-foreground/10 font-serif text-4xl">{role === "doctor" ? "AM" : "CD"}</div>
          <p className="mt-3 font-serif text-2xl">{role === "doctor" ? "Aarav Mehta" : "Dr. Chetali Damania"}</p>
          <p className="text-xs opacity-70">HD · 00:{String(new Date().getSeconds()).padStart(2, "0")} · encrypted</p>
        </div>
      </div>
      <div className="absolute right-4 top-4 h-40 w-28 overflow-hidden rounded-2xl border-2 border-primary-foreground/30">{Self}</div>

      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
        <RoundBtn on={mic} onClick={() => setMic(!mic)} icon={mic ? Mic : MicOff} label="Mute" />
        <RoundBtn on={cam} onClick={() => setCam(!cam)} icon={cam ? Video : VideoOff} label="Video" />
        <RoundBtn on onClick={() => toast("Screen sharing started")} icon={MonitorUp} label="Share screen" />
        <RoundBtn on onClick={() => setDrawer(drawer === "chat" ? null : "chat")} icon={MessageSquare} label="Chat" />
        <RoundBtn on onClick={() => setDrawer(drawer === "side" ? null : "side")} icon={FileText} label={role === "doctor" ? "Notes" : "Reports"} />
        <button aria-label="End call" onClick={end} className="grid h-12 w-12 place-items-center rounded-full bg-destructive"><PhoneOff className="h-5 w-5" /></button>
      </div>

      {drawer && (
        <div className="absolute inset-x-0 bottom-0 z-10 max-h-[70%] overflow-y-auto rounded-t-3xl bg-card p-5 text-foreground">
          <div className="flex justify-between">
            <p className="font-serif text-xl text-forest">{drawer === "chat" ? "Chat" : role === "doctor" ? "Notes & live prescription" : "Your reports"}</p>
            <button aria-label="Close" onClick={() => setDrawer(null)}><X className="h-5 w-5" /></button>
          </div>
          {drawer === "chat" && (
            <>
              <div className="mt-3 space-y-2 text-sm">{msgs.map((m, i) => <p key={i} className="rounded-xl bg-muted p-2">{m}</p>)}</div>
              <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (msg) { setMsgs([...msgs, `You: ${msg}`]); setMsg(""); } }}>
                <input className="flex-1 rounded-full border border-input px-4 text-sm" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message" />
                <button className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
              </form>
            </>
          )}
          {drawer === "side" && role === "patient" && (
            <div className="mt-3 space-y-2">{REPORTS.map((r) => <p key={r.id} className="flex items-center gap-2 rounded-xl bg-muted p-3 text-sm text-forest"><FileText className="h-4 w-4 text-accent" />{r.name}</p>)}</div>
          )}
          {drawer === "side" && role === "doctor" && (
            <div className="mt-3 space-y-3 text-sm">
              <textarea rows={3} className="w-full rounded-xl border border-input p-3" placeholder="Clinical notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (rxIn) { setRx([...rx, rxIn]); setRxIn(""); } }}>
                <input className="flex-1 rounded-xl border border-input p-3" placeholder="Add remedy, e.g. Pulsatilla 200" value={rxIn} onChange={(e) => setRxIn(e.target.value)} />
                <button className="rounded-xl bg-primary px-4 text-primary-foreground">Add</button>
              </form>
              {rx.map((r) => <p key={r} className="rounded-xl bg-secondary p-2 text-forest">💊 {r}</p>)}
              <button onClick={() => toast.success("Prescription signed & shared with patient")} className="w-full rounded-full bg-accent py-3 font-semibold text-accent-foreground">Sign & send prescription</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RoundBtn({ on, onClick, icon: Icon, label }: { on: boolean; onClick: () => void; icon: typeof Mic; label: string }) {
  return (
    <button aria-label={label} onClick={onClick} className={cn("grid h-12 w-12 place-items-center rounded-full", on ? "bg-primary-foreground/15" : "bg-primary-foreground text-forest")}>
      <Icon className="h-5 w-5" />
    </button>
  );
}
