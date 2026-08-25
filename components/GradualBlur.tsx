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
  className = "",
}: GradualBlurProps) {
  if (visibleProgress <= 0.001) {
    return null;
  }

  return (
    <div
      className={`${className} animate-section-entrance`}
      style={{
        pointerEvents: "auto",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
