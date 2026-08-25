"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Video, Box, Zap, X, Check } from "lucide-react";

interface ModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remember: boolean) => void;
}

export default function ModeModal({ isOpen, onClose, onConfirm }: ModeModalProps) {
  const [rememberChoice, setRememberChoice] = useState(true);

  // Close modal on Escape key
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
      {/* Dark Backdrop with Blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in cursor-pointer"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-3xl bg-neutral-950/95 border border-yellow-400/40 p-6 sm:p-8 shadow-2xl shadow-yellow-500/10 text-white backdrop-blur-2xl animate-section-entrance z-10 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>EXPERIENCE SWITCHER</span>
        </div>

        {/* Modal Title & Subtitle */}
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white mb-1.5 tracking-tight">
          Enable 3D &amp; Video Animations?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 font-light">
          Switch from <strong>Simple Mode</strong> (fast, lightweight default) to the full 3D interactive version.
        </p>

        {/* Feature Cards */}
        <div className="space-y-2.5 mb-6">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-900/80 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-yellow-400/10 text-yellow-400 shrink-0 mt-0.5">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono">Scroll Video Effects</div>
              <div className="text-[11px] sm:text-xs text-neutral-400 leading-snug">
                Background video scenes that smoothly animate as you scroll through sections.
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-900/80 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono">Interactive 3D Badge</div>
              <div className="text-[11px] sm:text-xs text-neutral-400 leading-snug">
                A 3D physics-based lanyard on the home section that you can grab and toss.
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-900/80 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono">Uses Extra System Power</div>
              <div className="text-[11px] sm:text-xs text-neutral-400 leading-snug">
                Requires higher graphics power and extra internet data to download video assets.
              </div>
            </div>
          </div>
        </div>

        {/* Remember Choice Checkbox */}
        <label className="flex items-center gap-2.5 mb-6 cursor-pointer select-none text-xs font-mono text-neutral-300">
          <div
            onClick={(e) => {
              e.preventDefault();
              setRememberChoice((prev) => !prev);
            }}
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
              rememberChoice
                ? "bg-yellow-400 border-yellow-400 text-black"
                : "border-neutral-600 bg-neutral-900"
            }`}
          >
            {rememberChoice && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>Remember my choice on this device</span>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onConfirm(rememberChoice)}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#FFD600] hover:bg-[#FFE033] text-black text-xs font-mono font-black tracking-wider uppercase transition-all shadow-xl shadow-yellow-500/25 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Turn On 3D Mode</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono font-semibold transition-all active:scale-98 cursor-pointer"
          >
            Keep Simple Mode
          </button>
        </div>
      </div>
    </div>
  );
}
