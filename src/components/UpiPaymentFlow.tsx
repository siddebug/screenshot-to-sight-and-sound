import React, { useState } from "react";
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Building,
  ArrowRight,
} from "lucide-react";

interface UpiPaymentFlowProps {
  amount: number;
  patientName: string;
  kind: string;
  onPaymentSuccess: (utr: string, method: string) => void;
}

export const UpiPaymentFlow: React.FC<UpiPaymentFlowProps> = ({
  amount,
  patientName,
  kind,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"upi" | "bank">("upi");
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const clinicUpiVpa = "drchetali@okhdfcbank";
  const clinicName = "Dr. Chetali Damania";
  const note = `Consultation-${patientName.replace(/\s+/g, "")}-${kind.slice(0, 4)}`;

  // Universal Bharat UPI Intent URL
  const upiIntentUrl = `upi://pay?pa=${clinicUpiVpa}&pn=${encodeURIComponent(
    clinicName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Quick QR API (free public open qr renderer for browser preview)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiIntentUrl
  )}&margin=10`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(clinicUpiVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleVerifyUtr = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (cleanUtr.length < 8) {
      setErrorMsg("Please enter a valid 12-digit UPI reference / UTR number from your payment app");
      return;
    }
    setErrorMsg("");
    onPaymentSuccess(cleanUtr, activeTab === "upi" ? "UPI Direct" : "Bank Transfer");
  };

  return (
    <div className="space-y-4">
      {/* Zero Fee Assurance Banner */}
      <div className="rounded-2xl border border-emerald-900/15 bg-emerald-50/80 p-3 text-xs text-[#2D5A43]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#2D5A43]" />
          <p className="font-medium">
            <span className="font-bold text-[#1B3B2B]">0% Gateway Commission:</span> 100% of your payment is credited directly to Dr. Chetali's clinical account.
          </p>
        </div>
      </div>

      {/* Payment Channel Sub-Tabs */}
      <div className="flex rounded-xl bg-[#EFECE6] p-1 text-xs font-semibold text-[#5A685F]">
        <button
          type="button"
          onClick={() => setActiveTab("upi")}
          className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
            activeTab === "upi" ? "bg-white text-[#1B3B2B] shadow-sm" : "hover:text-[#1B3B2B]"
          }`}
        >
          <Smartphone className="h-3.5 w-3.5 text-[#2D5A43]" />
          Instant UPI / QR
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bank")}
          className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
            activeTab === "bank" ? "bg-white text-[#1B3B2B]" : "hover:text-[#1B3B2B]"
          }`}
        >
          <Building className="h-3.5 w-3.5 text-[#2D5A43]" />
          Direct NEFT / IMPS
        </button>
      </div>

      {activeTab === "upi" ? (
        <div className="rounded-3xl border border-[#E8E4DC] bg-white p-5 shadow-sm text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-bold text-emerald-900">
            <span>Payable Amount: ₹{amount}</span>
          </div>

          {/* Dynamic Bharat QR Code */}
          <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl border-2 border-emerald-900/10 bg-[#FBF9F5] p-2 shadow-inner">
            <img
              src={qrCodeUrl}
              alt="Scan to Pay via UPI"
              className="h-full w-full rounded-xl object-contain"
            />
          </div>

          <p className="text-[11px] text-[#5A685F]">
            Scan with <b>Google Pay</b>, <b>PhonePe</b>, <b>Paytm</b>, or any banking UPI app
          </p>

          {/* Mobile 1-Tap UPI Intent Button */}
          <div className="space-y-2">
            <a
              href={upiIntentUrl}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2D5A43] py-3 text-xs font-bold text-white shadow-md hover:bg-[#1B3B2B] transition"
            >
              <Smartphone className="h-4 w-4" />
              <span>Tap to Pay on Mobile (GPay / PhonePe / Paytm)</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>

            {/* Copy UPI VPA */}
            <div className="flex items-center justify-between rounded-xl border border-[#E8E4DC] bg-[#FBF9F5] px-3 py-2 text-xs">
              <div className="text-left font-mono text-[11px] text-[#1B3B2B]">
                <p className="text-[9px] uppercase font-bold text-[#5A685F]">Clinical UPI ID</p>
                <p className="font-bold">{clinicUpiVpa}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#2D5A43] hover:underline"
              >
                {copiedUpi ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy VPA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Direct Bank Account Details (NEFT/IMPS / International) */
        <div className="rounded-3xl border border-[#E8E4DC] bg-white p-5 shadow-sm text-xs space-y-3">
          <p className="font-bold text-[#1B3B2B] text-sm">Direct Clinical Bank Account (Zero Surcharge)</p>
          <div className="space-y-2 text-[11px] text-[#5A685F]">
            <div className="flex justify-between border-b border-[#EFECE6] pb-1.5">
              <span>Beneficiary Name:</span>
              <span className="font-bold text-[#1B3B2B]">Dr. Chetali Damania</span>
            </div>
            <div className="flex justify-between border-b border-[#EFECE6] pb-1.5">
              <span>Bank Name:</span>
              <span className="font-bold text-[#1B3B2B]">HDFC Bank Ltd.</span>
            </div>
            <div className="flex justify-between border-b border-[#EFECE6] pb-1.5">
              <span>Account Number:</span>
              <span className="font-mono font-bold text-[#1B3B2B]">50100482910482</span>
            </div>
            <div className="flex justify-between border-b border-[#EFECE6] pb-1.5">
              <span>IFSC Code:</span>
              <span className="font-mono font-bold text-[#1B3B2B]">HDFC0000084 (Miramar Goa)</span>
            </div>
            <div className="flex justify-between">
              <span>Account Type:</span>
              <span className="font-bold text-[#1B3B2B]">Current Practice Account</span>
            </div>
          </div>
        </div>
      )}

      {/* UTR / Transaction Reference Verification Form */}
      <form onSubmit={handleVerifyUtr} className="space-y-3">
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 shadow-sm">
          <label className="block text-xs font-bold text-[#1B3B2B]">
            Enter 12-Digit UPI Reference / UTR Number *
          </label>
          <p className="mt-0.5 text-[10px] text-[#5A685F]">
            Found in your Google Pay, PhonePe, or Banking app transaction receipt.
          </p>
          <input
            type="text"
            required
            maxLength={18}
            placeholder="e.g. 430982716254"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ""))}
            className="mt-2 w-full rounded-xl border border-[#E8E4DC] px-3.5 py-2.5 font-mono text-sm text-[#1B3B2B] focus:border-[#2D5A43] focus:outline-none"
          />
          {errorMsg && <p className="mt-1 text-[11px] font-semibold text-rose-600">{errorMsg}</p>}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-full bg-[#1B3B2B] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#264F3B] transition"
        >
          <span>Verify Payment & Confirm Booking</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

