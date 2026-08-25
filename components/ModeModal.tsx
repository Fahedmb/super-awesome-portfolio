"use client";

import React, { useEffect, useState } from "react";

interface ModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remember: boolean) => void;
}

export default function ModeModal({ isOpen, onClose, onConfirm }: ModeModalProps) {
  const [rememberChoice, setRememberChoice] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      {/* Dark Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
      />

      {/* Clean Minimal Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e0e11] border border-neutral-800 p-6 sm:p-7 shadow-2xl text-white z-10 animate-section-entrance">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold font-display text-white mb-2">
          Enable 3D Mode?
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-5 font-sans">
          This turns on 3D elements, physics interactions, and background video animations. It requires more graphics power and internet data.
        </p>

        {/* Remember Choice Checkbox */}
        <label className="flex items-center gap-2 mb-6 cursor-pointer select-none text-xs text-neutral-300 font-mono">
          <input
            type="checkbox"
            checked={rememberChoice}
            onChange={(e) => setRememberChoice(e.target.checked)}
            className="w-4 h-4 rounded accent-yellow-400 cursor-pointer"
          />
          <span>Remember my choice</span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono font-medium transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(rememberChoice)}
            className="px-5 py-2 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black text-xs font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Turn On 3D Mode
          </button>
        </div>
      </div>
    </div>
  );
}
