"use client";

import React, { useRef, useState, useCallback } from "react";

interface SpecularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "dark" | "light" | "yellow";
  className?: string;
}

export default function SpecularButton({
  children,
  variant = "dark",
  className = "",
  onClick,
  ...props
}: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !sheenRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    // Direct DOM write — no React re-render
    sheenRef.current.style.background =
      `radial-gradient(circle 80px at ${x}% ${y}%, rgba(255,255,255,0.8), transparent 70%)`;
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case "yellow":
        return "bg-[#FFD600] text-black font-bold border border-yellow-300 shadow-[0_10px_30px_rgba(255,214,0,0.35)] hover:shadow-[0_15px_40px_rgba(255,214,0,0.55)]";
      case "light":
        return "bg-neutral-900 text-white font-semibold border border-neutral-700/60 shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.25)]";
      case "dark":
      default:
        return "bg-white/10 text-white font-semibold border border-white/15 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(255,214,0,0.2)] hover:border-yellow-400/40";
    }
  };

  const containerStyles = getVariantStyles();

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-xs font-mono tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer ${containerStyles} ${className}`}
      {...props}
    >
      {/* Specular Sheen Overlay — driven by ref, no re-renders */}
      <span
        ref={sheenRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.85 : 0,
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
