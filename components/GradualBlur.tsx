"use client";

import React from "react";

interface GradualBlurProps {
  children: React.ReactNode;
  visibleProgress: number; // 0.0 (hidden & blurred) to 1.0 (fully sharp & visible)
  maxBlur?: number; // max blur in px (default 12)
  maxTranslateY?: number; // max translateY in px (default 20)
  className?: string;
}

export default function GradualBlur({
  children,
  visibleProgress,
  maxBlur = 12,
  maxTranslateY = 20,
  className = "",
}: GradualBlurProps) {
  // Clamped visibility factor (0 to 1)
  const clamped = Math.max(0, Math.min(1, visibleProgress));

  // Smoothstep easing for silky blur and opacity transition
  const smooth = clamped * clamped * (3 - 2 * clamped);

  const opacity = smooth;
  const blur = (1 - smooth) * maxBlur;
  const translateY = (1 - smooth) * maxTranslateY;

  if (opacity <= 0.001) {
    return null;
  }

  return (
    <div
      className={`transition-all duration-75 ease-out ${className}`}
      style={{
        opacity,
        filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none",
        transform: `translateY(${translateY.toFixed(1)}px)`,
        pointerEvents: opacity > 0.7 ? "auto" : "none",
        willChange: "opacity, filter, transform",
      }}
    >
      {children}
    </div>
  );
}
