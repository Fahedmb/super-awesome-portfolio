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
  ShieldCheck,
  Zap,
} from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  clientOrRole: string;
  tagline: string;
  description: string;
  youtubeId?: string; // YouTube video ID or demo embed
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  metrics: string;
  icon: string;
}

const defaultProjects: ProjectItem[] = [
  {
    id: "certifup",
    title: "CertifUp — Certification & Testing Platform",
    clientOrRole: "Incubator Startup / PFE at TEKONSULT • 2024 - 2025",
    tagline: "4-Microservice Backend, Anti-Cheat Telemetry & Zero-Trust Credential Vault",
    description:
      "Authored a 60+ page feasibility study surveying 13 academic institutions (77% digital demand), benchmarked 22 international competitors, and formulated the multi-phase product roadmap. Architected a 4-microservice backend (Java 17, Spring Boot 3, Angular 18) for IAM, catalog, test execution, and voucher vault with 25+ OpenAPI endpoints. Engineered deterministic SHA-256 test generation engine, real-time WebSocket anti-cheat telemetry, and zero-trust credential vaults (BCrypt, AES-256 GCM). Configured automated CI/CD pipelines (Docker, Jenkins) with JUnit/Mockito test gates achieving 88% service coverage.",
    youtubeId: "dQw4w9WgXcQ", // Replaceable with specific YouTube demo
    githubUrl: "https://github.com/Fahedmb",
    tags: [
      "Java 17",
      "Spring Boot 3",
      "Angular 18",
      "Docker",
      "Jenkins",
      "WebSockets",
      "AES-256 GCM",
      "OpenAPI",
      "Microservices",
    ],
    metrics: "4 MICROSERVICES • 25+ OPENAPI ENDPOINTS • 88% TEST COVERAGE",
    icon: "cpu",
  },
  {
    id: "cpg-tms",
    title: "Compagnie des Phosphates de Gafsa (CPG) — Enterprise TMS",
    clientOrRole: "Enterprise Mining & Transport Logistics • 2026",
    tagline: "Digitized 7 Extraction Basins & Bilingual Executive BI Engine",
    description:
      "Digitized training logistics across 7 mining extraction basins, cutting request turnaround by >85% (from 3 weeks to <48h). Engineered procurement modules linking Purchase Orders to sessions, automating 100% cost reconciliation and invoice tracking. Formulated 15+ executive BI KPIs with automated bilingual (FR/AR) PDF/CSV reporting powered by embedded JFreeCharts.",
    youtubeId: "dQw4w9WgXcQ",
    githubUrl: "https://github.com/Fahedmb",
    tags: [
      "Spring Boot 4",
      "Angular 22",
      "PostgreSQL",
      "JFreeCharts",
      "Bilingual Reporting",
      "Procurement Module",
      "Enterprise TMS",
    ],
    metrics: ">85% TURNAROUND REDUCTION (<48H) • 7 BASINS • 100% RECONCILIATION",
    icon: "layers",
  },
  {
    id: "yazaki-talent",
    title: "YAZAKI Corporation — Talent Intelligence Platform",
    clientOrRole: "Automotive Wire Harness & Systems • 2025 - 2026",
    tagline: "Automotive Skill Matrices & ISO 30414 Compliant Coordinate Parser",
    description:
      "Digitized performance management across 6 automotive departments (120+ skills), establishing 5-point competency matrices and automated gap detection (< 75% Priority 1, < 85% Priority 2) linked to corrective training tickets. Built an Apache POI coordinate parser to migrate legacy multi-sheet Excel matrices with 100% data fidelity and ISO 30414 audit trails.",
    youtubeId: "dQw4w9WgXcQ",
    githubUrl: "https://github.com/Fahedmb",
    tags: [
      "Spring Boot 4",
      "Next.js 15",
      "PostgreSQL",
      "Apache POI",
      "ISO 30414 Audit",
      "Competency Matrix",
      "Data Migration",
    ],
    metrics: "120+ SKILLS MATRIX • 6 AUTOMOTIVE DEPTS • 100% DATA FIDELITY",
    icon: "shield",
  },
  {
    id: "enterprise-hr",
    title: "Enterprise HR & Project Operations Platform",
    clientOrRole: "Enterprise Systems Platform • 2025",
    tagline: "STOMP WebSocket Realtime Chat & Multi-Role REST Architectures",
    description:
      "Designed role-based workflows for attendance and leave requests; authored comprehensive API catalogs for 17 REST controllers and real-time STOMP chat with Java 21, Spring Boot 3.5, React 18, and MySQL.",
    youtubeId: "dQw4w9WgXcQ",
    githubUrl: "https://github.com/Fahedmb",
    tags: [
      "Java 21",
      "Spring Boot 3.5",
      "React 18",
      "MySQL",
      "STOMP WebSockets",
      "REST Controllers",
      "RBAC Workflows",
    ],
    metrics: "17 REST CONTROLLERS • STOMP CHAT • ROLE-BASED ACCESS",
    icon: "sparkles",
  },
  {
    id: "canvas-engine",
    title: "Cosmic 60 FPS Canvas Engine & 3D Interactive Portfolio",
    clientOrRole: "Personal Engineering Project • 2026",
    tagline: "Hardware-Accelerated Frame Seeking & 3D Physics Simulation",
    description:
      "Hardware-accelerated web engine orchestrating 1,194 high-definition video frames synchronized to scroll velocity with sub-millisecond precision and zero layout thrashing. Features interactive 3D lanyard physics with React Three Fiber & Rapier, dynamic glassmorphic telemetry, and responsive multi-touch controls.",
    youtubeId: "dQw4w9WgXcQ",
    githubUrl: "https://github.com/Fahedmb/super-awesome-portfolio",
    liveUrl: "/",
    tags: [
      "Next.js 15",
      "React 19",
      "Three.js / Rapier",
      "HTML5 Canvas",
      "Tailwind CSS v4",
      "TypeScript",
    ],
    metrics: "60 FPS RENDER • 0 LAYOUT JANK • SUB-SECOND VITALS",
    icon: "zap",
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
        return <Cpu className="w-5 h-5 text-amber-700" />;
      case "shield":
        return <ShieldCheck className="w-5 h-5 text-amber-700" />;
      case "zap":
        return <Zap className="w-5 h-5 text-amber-700" />;
      case "sparkles":
        return <Sparkles className="w-5 h-5 text-amber-700" />;
      case "layers":
      default:
        return <Layers className="w-5 h-5 text-amber-700" />;
    }
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      {/* Quick Project Select Tabs */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
        {projects.map((proj, idx) => (
          <button
            key={proj.id}
            onClick={() => setActiveIndex(idx)}
            className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all whitespace-nowrap cursor-pointer ${
              activeIndex === idx
                ? "bg-neutral-900 text-white font-bold shadow-sm"
                : "bg-white/80 hover:bg-white text-neutral-600 border border-neutral-200"
            }`}
          >
            <span className="opacity-60 mr-1.5">{String(idx + 1).padStart(2, "0")}</span>
            <span>{proj.title.split("—")[0].trim()}</span>
          </button>
        ))}
      </div>

      {/* 3D Depth Card Viewport */}
      <div className="relative rounded-3xl p-5 sm:p-7 bg-white/95 border border-neutral-200/90 shadow-2xl shadow-neutral-900/10 backdrop-blur-2xl text-neutral-900">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              {getIcon(current.icon)}
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-amber-700 uppercase">
                {current.clientOrRole}
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display tracking-tight text-neutral-900">
                {current.title}
              </h3>
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={prevProject}
              className="p-2 rounded-full border border-neutral-200 bg-neutral-100/80 hover:bg-neutral-200 text-neutral-700 transition-all active:scale-95 cursor-pointer"
              title="Previous Project"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-neutral-500 px-1">
              {activeIndex + 1}/{projects.length}
            </span>
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
        <div className="space-y-3 mb-4">
          <p className="text-xs sm:text-sm font-semibold text-amber-800 tracking-wide">
            {current.tagline}
          </p>
          <p className="text-xs text-neutral-600 leading-relaxed font-light line-clamp-4 hover:line-clamp-none transition-all">
            {current.description}
          </p>

          {/* Impact Metrics Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold text-amber-900">
            <span className="text-neutral-500 font-normal">PROVEN IMPACT:</span>
            <span>{current.metrics}</span>
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {current.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-mono text-neutral-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons & Pre-recorded Video Demo Trigger */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-neutral-100">
          {current.youtubeId && (
            <button
              onClick={() => setActiveVideoId(current.youtubeId!)}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-mono font-semibold tracking-wider transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
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
              className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-mono font-semibold transition-all duration-200 active:scale-95 flex items-center gap-1.5"
            >
              <span>SOURCE / GITHUB</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </a>
          )}

          {current.liveUrl && (
            <a
              href={current.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 text-xs font-mono font-semibold transition-all duration-200 active:scale-95 flex items-center gap-1.5"
            >
              <span>LIVE DEMO</span>
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
