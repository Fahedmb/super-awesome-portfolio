"use client";

import React from "react";

export interface LogoItem {
  name: string;
  category: string;
  logo: string;
}

const defaultTechStack: LogoItem[] = [
  { name: "Java 21", category: "BACKEND", logo: "/assets/tech/java.svg" },
  { name: "Spring Boot 4", category: "MICROSERVICES", logo: "/assets/tech/spring.svg" },
  { name: "Next.js 15", category: "FULL-STACK", logo: "/assets/tech/nextjs.svg" },
  { name: "React 19", category: "UI ENGINE", logo: "/assets/tech/react.svg" },
  { name: "Angular 22", category: "ENTERPRISE UI", logo: "/assets/tech/angular.svg" },
  { name: "Python / AI", category: "INTELLIGENT SYSTEMS", logo: "/assets/tech/python.svg" },
  { name: "PostgreSQL", category: "DATABASE", logo: "/assets/tech/postgresql.svg" },
  { name: "Redis", category: "CACHE & STREAMS", logo: "/assets/tech/redis.svg" },
  { name: "Docker", category: "CONTAINERIZATION", logo: "/assets/tech/docker.svg" },
  { name: "Jenkins", category: "CI/CD PIPELINES", logo: "/assets/tech/jenkins.svg" },
  { name: "TypeScript", category: "TYPE SYSTEM", logo: "/assets/tech/typescript.svg" },
  { name: "Tailwind CSS", category: "DESIGN SYSTEM", logo: "/assets/tech/tailwindcss.svg" },
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
          ? "border-y border-neutral-200/80 bg-neutral-100/60 text-neutral-800"
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
            className="flex items-center gap-2.5 whitespace-nowrap text-xs font-mono tracking-wider"
          >
            {/* Actual Framework / Library Logo */}
            <div
              className={`w-6 h-6 rounded-md p-0.5 flex items-center justify-center transition-transform hover:scale-110 ${
                isLight ? "bg-white shadow-xs border border-neutral-200/60" : "bg-white/10 border border-white/10"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.logo}
                alt={item.name}
                className="w-4 h-4 object-contain"
                loading="lazy"
              />
            </div>
            <span
              className={`font-bold ${
                isLight ? "text-neutral-900" : "text-white"
              }`}
            >
              {item.name}
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                isLight
                  ? "bg-neutral-200/80 text-neutral-700 font-medium"
                  : "bg-white/10 text-yellow-400 font-medium"
              }`}
            >
              {item.category}
            </span>
            <span className="text-neutral-400/30 text-xs">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
