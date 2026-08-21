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
  maxTranslateY = 16,
  className = "",
}: GradualBlurProps) {
  // Clamped visibility factor (0 to 1)
  const clamped = Math.max(0, Math.min(1, visibleProgress));

  // Smoothstep easing for silky compositor transition
  const smooth = clamped * clamped * (3 - 2 * clamped);

  const opacity = smooth;
  const translateY = (1 - smooth) * maxTranslateY;

  if (opacity <= 0.001) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        opacity,
        transform: `translate3d(0, ${translateY.toFixed(1)}px, 0)`,
        pointerEvents: opacity > 0.7 ? "auto" : "none",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
