"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, Orbit, Award, Terminal } from "lucide-react";

interface LanyardProps {
  name?: string;
  role?: string;
  status?: string;
  theme?: "light" | "dark";
  className?: string;
}

export default function Lanyard({
  name = "FAHED",
  role = "SOFTWARE ENGINEER // ASTRONOMY ENTHUSIAST",
  status = "ACTIVE IN EARTH ORBIT",
  theme = "light",
  className = "",
}: LanyardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientY - centerY) / 12; // Inverted for 3D tilt
    const y = -(e.clientX - centerX) / 12;
    setRotate({ x, y });
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setRotate({ x: 0, y: 0 });
    }
  };

  // Drag physics simulation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      setOffset({
        x: Math.max(-120, Math.min(120, newX)),
        y: Math.max(-60, Math.min(120, newY)),
      });
      setRotate({
        x: Math.max(-25, Math.min(25, -newY / 4)),
        y: Math.max(-25, Math.min(25, newX / 4)),
      });
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Spring back to rest position
        setOffset({ x: 0, y: 0 });
        setRotate({ x: 0, y: 0 });
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  const isLight = theme === "light";

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* Elastic Suspension Strap & Metallic Clasp */}
      <div className="flex flex-col items-center pointer-events-none z-10">
        {/* Top Anchor Ring */}
        <div
          className={`w-5 h-5 rounded-full border-2 ${
            isLight
              ? "border-neutral-400 bg-neutral-300 shadow-sm"
              : "border-neutral-600 bg-neutral-800"
          }`}
        />
        {/* Elastic Lanyard Strap */}
        <div
          className={`w-3.5 h-16 transition-transform duration-100 ${
            isLight
              ? "bg-gradient-to-b from-neutral-800 via-neutral-900 to-black shadow-md"
              : "bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900"
          }`}
          style={{
            transform: `rotate(${offset.x * 0.15}deg)`,
            transformOrigin: "top center",
          }}
        />
        {/* Metal Carabiner Clip */}
        <div
          className={`w-7 h-4 rounded-sm border ${
            isLight
              ? "bg-gradient-to-r from-neutral-300 via-white to-neutral-300 border-neutral-400"
              : "bg-gradient-to-r from-neutral-700 via-neutral-600 to-neutral-700 border-neutral-500"
          }`}
        />
      </div>

      {/* 3D Physical ID Badge */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        className={`w-64 sm:w-72 rounded-2xl p-5 shadow-2xl transition-all ${
          isDragging ? "cursor-grabbing duration-75" : "cursor-grab duration-300 ease-out"
        } ${
          isLight
            ? "bg-white/90 border border-neutral-300/80 text-neutral-900 shadow-neutral-900/15"
            : "bg-neutral-900/90 border border-neutral-700/80 text-white shadow-black/60"
        } backdrop-blur-2xl`}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Top Badge Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-700/50 mb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-amber-600 dark:text-yellow-400 font-bold">
            <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
            <span>FLIGHT PASS // 2026</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>VALIDATED</span>
          </div>
        </div>

        {/* Identity Section */}
        <div className="flex items-center gap-3.5 mb-4">
          {/* Avatar Silhouette / Emblem */}
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center border font-mono font-bold text-xl ${
              isLight
                ? "bg-gradient-to-br from-neutral-900 to-black text-yellow-400 border-neutral-700 shadow-md"
                : "bg-gradient-to-br from-yellow-400 to-amber-600 text-black border-yellow-300 shadow-lg shadow-yellow-500/20"
            }`}
          >
            FH
          </div>
          <div>
            <h3 className="text-lg font-bold font-display tracking-tight leading-none mb-1">
              {name}
            </h3>
            <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 leading-tight">
              {role}
            </p>
          </div>
        </div>

        {/* Barcode & Security Hologram */}
        <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-700/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              TELEMETRY REF
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-700 dark:text-neutral-300">
              VI · I · VIII · V · IV
            </span>
          </div>
          <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-700 dark:text-yellow-400">
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}
