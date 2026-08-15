"use client";

import React, { useRef, useState } from "react";

interface BorderGlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export default function BorderGlowCard({
  children,
  className = "",
  glowColor = "rgba(255, 214, 0, 0.45)", // Electric Mustard
}: BorderGlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl p-[1px] overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background: isHovered
          ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, rgba(255,255,255,0.06) 60%, transparent 100%)`
          : "rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Inner Card Surface */}
      <div className="relative h-full w-full rounded-[15px] bg-[#0c0c10]/90 backdrop-blur-2xl p-6 transition-all duration-300 group-hover:bg-[#101018]/90">
        {children}
      </div>
    </div>
  );
}
