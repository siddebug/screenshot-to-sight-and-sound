import React, { useState } from "react";
import { Lock, ShieldCheck, KeyRound, X, Stethoscope, AlertCircle } from "lucide-react";

interface DoctorPinModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const DoctorPinModal: React.FC<DoctorPinModalProps> = ({ isOpen, onSuccess, onCancel }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 2451 (matching Dr. Chetali's Medical Council Reg: GHC-2451)
    if (pin.trim() === "2451" || pin.trim() === "1234") {
      sessionStorage.setItem("doctor_authenticated", "true");
      onSuccess();
      setPin("");
      setError(false);
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-[#1B3B2B] text-center space-y-4">
        {/* Header Icon */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-950 text-emerald-300 shadow-md">
          <Stethoscope className="h-8 w-8" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-900">
            <ShieldCheck className="h-3 w-3" /> Practitioner Verification
          </span>
          <h2 className="mt-2 font-serif text-xl font-bold">Doctor Practice Console</h2>
          <p className="text-xs text-[#5A685F] mt-1">
            Dr. Chetali Damania · Reg. GHC-2451
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl border border-[#E8E4DC] bg-[#FBF9F5] p-4 text-xs">
            <label className="block text-[#1B3B2B] font-semibold mb-1">
              Enter 4-Digit Clinical Access PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoFocus
              value={pin}
              onChange={(e) => {
                setError(false);
                setPin(e.target.value.replace(/[^0-9]/g, ""));
              }}
              placeholder="••••"
              className="w-32 mx-auto tracking-[0.5em] text-center font-mono text-2xl font-bold rounded-xl border border-[#E8E4DC] bg-white py-2 focus:border-emerald-700 focus:outline-none"
            />
            {error && (
              <p className="mt-2 text-[11px] font-semibold text-rose-600 flex items-center justify-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Incorrect PIN. Please try again.
              </p>
            )}
            <p className="mt-2 text-[10px] text-[#5A685F]">
              Default Demo PIN: <b className="text-emerald-800">2451</b> (or 1234)
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-[#E8E4DC] py-2.5 text-xs font-semibold text-[#5A685F] hover:bg-[#FBF9F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pin.length < 4}
              className="flex-1 rounded-xl bg-emerald-950 py-2.5 text-xs font-semibold text-white shadow-md disabled:opacity-50 hover:bg-emerald-900 transition"
            >
              Unlock Console
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
