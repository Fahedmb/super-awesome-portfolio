"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink,
  Code,
  X,
  Sparkles,
  Layers,
  Cpu,
  Monitor,
} from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  youtubeId?: string; // YouTube video ID for pre-recorded demo
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  metrics: string;
  icon: string;
}

const defaultProjects: ProjectItem[] = [
  {
    id: "canvas-engine",
    title: "Cinematic 60 FPS Canvas Engine",
    tagline: "High-Framerate Video Seeking & Adaptive Bitrate Streaming",
    description:
      "Hardware-accelerated web engine orchestrating 1,194 high-definition video frames synchronized to scroll velocity with sub-millisecond precision and zero layout thrashing.",
    youtubeId: "dQw4w9WgXcQ", // Demo reference placeholder
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    tags: ["Next.js 16", "HTML5 Canvas", "WebGL", "TypeScript"],
    metrics: "60 FPS RENDER • 0 LAYOUT JANK",
    icon: "layers",
  },
  {
    id: "mcp-control-plane",
    title: "Agentic Intelligence & MCP Tooling",
    tagline: "Dynamic Skill Orchestration with Cryptographic Validation",
    description:
      "Local-first control plane for AI agents supporting SHA-256 catalog verification, lazy-loaded MCP servers, and dynamic skill stack composition across 2,000+ skills.",
    youtubeId: "dQw4w9WgXcQ",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    tags: ["Node.js", "Model Context Protocol", "TypeScript", "JSON-RPC"],
    metrics: "2,009 SKILLS • 100% OFFLINE VERIFIED",
    icon: "cpu",
  },
  {
    id: "celestial-sim",
    title: "Orbital Mechanics & Cosmic Shaders",
    tagline: "Interactive WebGL Singularity & Starfield Simulation",
    description:
      "Real-time celestial physics renderer computing gravitational lensing, relativistic Doppler shifts, and particle accretion disks via custom GLSL fragment shaders.",
    youtubeId: "dQw4w9WgXcQ",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    tags: ["Three.js", "GLSL Shaders", "Physics Engine", "WebGL"],
    metrics: "100K PARTICLES • GPU ACCELERATED",
    icon: "sparkles",
  },
];

interface DepthCarouselProps {
  projects?: ProjectItem[];
  className?: string;
}

export default function DepthCarousel({
  projects = defaultProjects,
  className = "",
}: DepthCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const current = projects[activeIndex];

  const getIcon = (type: string) => {
    switch (type) {
      case "cpu":
        return <Cpu className="w-5 h-5 text-amber-600 dark:text-yellow-400" />;
      case "sparkles":
        return <Sparkles className="w-5 h-5 text-amber-600 dark:text-yellow-400" />;
      case "layers":
      default:
        return <Layers className="w-5 h-5 text-amber-600 dark:text-yellow-400" />;
    }
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      {/* 3D Depth Card Viewport */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-white/95 border border-neutral-200/90 shadow-2xl shadow-neutral-900/10 backdrop-blur-2xl text-neutral-900">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              {getIcon(current.icon)}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-700 uppercase">
                FEATURED WORK // {String(activeIndex + 1).padStart(2, "0")} OF{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-neutral-900">
                {current.title}
              </h3>
            </div>
          </div>

          {/* Quick Carousel Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prevProject}
              className="p-2 rounded-full border border-neutral-200 bg-neutral-100/80 hover:bg-neutral-200 text-neutral-700 transition-all active:scale-95 cursor-pointer"
              title="Previous Project"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextProject}
              className="p-2 rounded-full border border-neutral-200 bg-neutral-100/80 hover:bg-neutral-200 text-neutral-700 transition-all active:scale-95 cursor-pointer"
              title="Next Project"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="space-y-4 mb-6">
          <p className="text-xs sm:text-sm font-semibold text-amber-800 tracking-wide">
            {current.tagline}
          </p>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
            {current.description}
          </p>

          {/* Impact Metrics Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-[10px] font-mono font-bold text-neutral-700">
            <span>METRICS:</span>
            <span className="text-amber-700">{current.metrics}</span>
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {current.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-mono text-neutral-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons & Pre-recorded Video Demo Trigger */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100">
          {current.youtubeId && (
            <button
              onClick={() => setActiveVideoId(current.youtubeId!)}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-mono font-semibold tracking-wider transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-yellow-400" />
              <span>WATCH VIDEO DEMO</span>
            </button>
          )}

          {current.githubUrl && (
            <a
              href={current.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-mono font-semibold transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <span>SOURCE // GITHUB</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </a>
          )}

          {current.liveUrl && (
            <a
              href={current.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 text-xs font-mono font-semibold transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <span>LIVE DEPLOYMENT</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
            </a>
          )}
        </div>
      </div>

      {/* Embedded YouTube Video Demo Modal */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl">
            <button
              onClick={() => setActiveVideoId(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-all cursor-pointer"
              title="Close Video"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
              title="Project Video Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
