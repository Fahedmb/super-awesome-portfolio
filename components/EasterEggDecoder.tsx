"use client";

import React, { useState } from "react";
import { Sparkles, Key, Check } from "lucide-react";

export default function EasterEggDecoder() {
  const [isDecoded, setIsDecoded] = useState(false);

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-mono text-yellow-400 font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>COSMIC CIPHER // EASTER EGG</span>
        </div>
        <button
          onClick={() => setIsDecoded((prev) => !prev)}
          className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          <Key className="w-3 h-3" />
          <span>{isDecoded ? "RESET CIPHER" : "DECODE TRANSMISSION"}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono">
        {/* Cipher Sequence */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {["VI", "I", "VIII", "V", "IV"].map((numeral, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-neutral-900 border border-neutral-700/80 text-neutral-200"
            >
              <span className="text-[11px] font-bold text-neutral-400">{numeral}</span>
              {isDecoded && (
                <span className="text-[11px] font-bold text-yellow-400 animate-pulse">
                  {idx === 0 ? "F" : idx === 1 ? "A" : idx === 2 ? "H" : idx === 3 ? "E" : "D"}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Decoder Explanation */}
        <div className="text-[11px] text-neutral-400 leading-snug">
          {isDecoded ? (
            <span className="text-yellow-400 font-bold">
              ✓ DECRYPTED: Numerical positions (6 · 1 · 8 · 5 · 4) map to alphabet letters <strong>F · A · H · E · D</strong>.
            </span>
          ) : (
            <span>Hidden across the cosmic cloud ascent in Act 0. Click decode to resolve cipher.</span>
          )}
        </div>
      </div>
    </div>
  );
}
