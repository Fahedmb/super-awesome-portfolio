"use client";

import React from "react";

interface LogoItem {
  name: string;
  category: string;
}

const defaultTechStack: LogoItem[] = [
  { name: "NEXT.JS 16", category: "FRAMEWORK" },
  { name: "REACT 19", category: "UI ENGINE" },
  { name: "TYPESCRIPT", category: "LANGUAGE" },
  { name: "WEBGL / THREE.JS", category: "3D & SHADERS" },
  { name: "TAILWIND CSS V4", category: "STYLING" },
  { name: "TURBOPACK", category: "BUNDLER" },
  { name: "HTML5 CANVAS", category: "60 FPS ENGINE" },
  { name: "PYTHON", category: "SYSTEMS & AI" },
  { name: "GLSL SHADERS", category: "GRAPHICS" },
  { name: "NODE.JS", category: "RUNTIME" },
];

interface LogoLoopProps {
  items?: LogoItem[];
  theme?: "light" | "dark";
  className?: string;
}

export default function LogoLoop({
  items = defaultTechStack,
  theme = "light",
  className = "",
}: LogoLoopProps) {
  // Duplicate array for seamless infinite looping
  const duplicatedItems = [...items, ...items];

  const isLight = theme === "light";

  return (
    <div
      className={`relative w-full overflow-hidden py-3 select-none ${
        isLight
          ? "border-y border-neutral-200/80 bg-neutral-100/50 text-neutral-800"
          : "border-y border-white/10 bg-black/40 text-neutral-300"
      } ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <div className="animate-logo-loop flex items-center gap-8">
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center gap-3 whitespace-nowrap text-xs font-mono tracking-wider"
          >
            <span
              className={`font-bold ${
                isLight ? "text-neutral-900" : "text-white"
              }`}
            >
              {item.name}
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded ${
                isLight
                  ? "bg-neutral-200 text-neutral-600"
                  : "bg-white/10 text-yellow-400"
              }`}
            >
              {item.category}
            </span>
            <span className="text-neutral-400/40 text-xs">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
