"use client";

import React, { useRef, useState } from "react";

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
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "yellow":
        return {
          container:
            "bg-[#FFD600] text-black font-bold border border-yellow-300 shadow-[0_10px_30px_rgba(255,214,0,0.35)] hover:shadow-[0_15px_40px_rgba(255,214,0,0.55)]",
          specular:
            "radial-gradient(circle 80px at " +
            mousePos.x +
            "% " +
            mousePos.y +
            "%, rgba(255,255,255,0.8), transparent 70%)",
        };
      case "light":
        return {
          container:
            "bg-neutral-900 text-white font-semibold border border-neutral-700/60 shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.25)]",
          specular:
            "radial-gradient(circle 80px at " +
            mousePos.x +
            "% " +
            mousePos.y +
            "%, rgba(255,255,255,0.4), transparent 70%)",
        };
      case "dark":
      default:
        return {
          container:
            "bg-white/10 text-white font-semibold border border-white/15 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(255,214,0,0.2)] hover:border-yellow-400/40",
          specular:
            "radial-gradient(circle 90px at " +
            mousePos.x +
            "% " +
            mousePos.y +
            "%, rgba(255,214,0,0.4), transparent 70%)",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-xs font-mono tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer ${styles.container} ${className}`}
      {...props}
    >
      {/* Specular Sheen Overlay */}
      {isHovered && (
        <span
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: styles.specular,
            opacity: 0.85,
          }}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
