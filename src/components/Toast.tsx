import React from "react";
import { CheckCircle, Info } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#1B3B2B] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-medium border border-emerald-800 animate-bounce">
      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

