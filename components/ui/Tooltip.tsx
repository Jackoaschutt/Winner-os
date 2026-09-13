"use client";

import { HelpCircle } from "lucide-react";
import { useState } from "react";

// Lightweight "What does this mean?" education tooltip used throughout the
// app so advanced metrics never leave a beginner guessing.
export function InfoTip({ label, text }: { label?: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className="ml-1 inline-flex items-center text-white/35 hover:text-white/70"
        aria-label={label || "What does this mean?"}
      >
        <HelpCircle size={13} />
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-white/10 bg-base-800 p-2.5 text-xs font-normal leading-snug text-white/80 shadow-glass">
          {text}
        </span>
      )}
    </span>
  );
}
