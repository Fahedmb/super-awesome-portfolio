"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink,
  Lock,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Server,
  X,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Terminal,
  ArrowRight,
  Code2,
  Maximize2,
  Radio,
} from "lucide-react";

export interface ProjectItem {
  id: string;
  tabLabel: string;
  title: string;
  clientOrRole: string;
  category: string;
  tagline: string;
  problem: string;
  solution: string;
  features: string[];
  youtubeId?: string;
  githubUrl?: string;
  tags: string[];
  metrics: string;
  icon: string;
  isPrivate?: boolean;
  isPortfolioProduct?: boolean;
}

const defaultProjects: ProjectItem[] = [
  {
    id: "certifup",
    tabLabel: "CERTIFUP",
    title: "CertifUp — Certification & Testing Platform",
    clientOrRole: "Incubator Startup / PFE at TEKONSULT • 2024 - 2025",
    category: "MICROSERVICES & IAM ARCHITECTURE",
    tagline: "4-Microservice Cluster, Anti-Cheat Telemetry & Zero-Trust Credential Vault",
    problem: "Academic institutions and certification centers lacked a secure, automated platform to prevent credential fraud, manage voucher inventories, and detect test-taking cheating in real time.",
    solution: "Architected a 4-microservice cluster (IAM, catalog, test engine, voucher vault) with 25+ OpenAPI endpoints, deterministic SHA-256 test generation, STOMP WebSocket anti-cheat telemetry, and zero-trust vaults (BCrypt + AES-256 GCM) with 88% test coverage.",
    features: [
      "4-Microservice backend with 25+ OpenAPI endpoints and automated Eureka/Spring Cloud discovery.",
      "Deterministic SHA-256 test generator & real-time WebSocket anti-cheat browser monitoring.",
      "Zero-trust voucher vault with AES-256 GCM encryption and automated Docker/Jenkins CI/CD (88% coverage).",
    ],
    youtubeId: "C9CCD-VNP3c",
    githubUrl: "https://github.com/Fahedmb",
    tags: ["Java 17", "Spring Boot 3", "Angular 18", "Docker", "Jenkins", "WebSockets", "AES-256 GCM", "OpenAPI", "JUnit/Mockito"],
    metrics: "4 MICROSERVICES • 25+ OPENAPI ENDPOINTS • 88% COVERAGE",
    icon: "cpu",
    isPrivate: true,
  },
  {
    id: "cpg-tms",
    tabLabel: "CPG TMS",
    title: "Compagnie des Phosphates de Gafsa (CPG) — Enterprise TMS",
    clientOrRole: "Enterprise Mining & Transport Logistics • 2026",
    category: "ENTERPRISE LOGISTICS & TMS",
    tagline: "Digitized 7 Extraction Basins & Bilingual Executive BI Engine",
    problem: "Training requests and logistics operations across 7 remote mining extraction basins suffered from 3-week paper approval delays and disconnected invoice cost reconciliation.",
    solution: "Digitized the entire logistics lifecycle into a unified enterprise TMS, linking Purchase Orders directly to sessions for 100% cost reconciliation and generating bilingual executive BI analytics with embedded JFreeCharts.",
    features: [
      "Cut logistics request turnaround by >85% (slashed from 3 weeks to under 48 hours).",
      "Automated 100% cost reconciliation linking Purchase Orders to training sessions and invoice ledgers.",
      "Executive BI engine with 15+ KPIs and bilingual (FR/AR) PDF/CSV reporting powered by JFreeCharts.",
    ],
    youtubeId: "Cer7r8s04h0",
    githubUrl: "https://github.com/Fahedmb",
    tags: ["Spring Boot 4", "Angular 22", "PostgreSQL", "JFreeCharts", "Bilingual i18n", "Procurement Engine", "REST APIs"],
    metrics: ">85% TURNAROUND REDUCTION (<48H) • 7 BASINS • 100% RECONCILIATION",
    icon: "layers",
    isPrivate: true,
  },
  {
    id: "yazaki-talent",
    tabLabel: "YAZAKI",
    title: "YAZAKI Corporation — Talent Intelligence Platform",
    clientOrRole: "Automotive Wire Harness & Systems • 2025 - 2026",
    category: "AUTOMOTIVE COMPETENCY & AUDIT",
    tagline: "Automotive Skill Matrices & ISO 30414 Coordinate Parser",
    problem: "Managing 120+ technical skill evaluations across 6 automotive departments in disparate spreadsheets caused evaluation discrepancies and failed ISO 30414 audit trails.",
    solution: "Built a centralized competency matrix engine with automated gap detection (<75% Priority 1, <85% Priority 2) that automatically triggers corrective training tickets, backed by an Apache POI coordinate parser migrating legacy matrices with 100% data fidelity.",
    features: [
      "120+ automotive competency matrices across 6 production departments with automated gap alerts.",
      "Automated corrective training ticket dispatching linked directly to performance appraisals.",
      "Apache POI coordinate parser migrating complex multi-sheet legacy matrices with 100% data fidelity.",
    ],
    youtubeId: "VbhtEj1B5sc",
    githubUrl: "https://github.com/Fahedmb",
    tags: ["Spring Boot 4", "Next.js 15", "PostgreSQL", "Apache POI", "ISO 30414 Audit", "Skill Matrix Algorithms"],
    metrics: "120+ SKILLS MATRIX • 6 DEPTS • 100% DATA FIDELITY",
    icon: "shield",
    isPrivate: true,
  },
  {
    id: "enterprise-hr",
    tabLabel: "ENTERPRISE HR",
    title: "Enterprise HR & Project Operations Platform",
    clientOrRole: "Enterprise Systems Platform • 2025",
    category: "REALTIME OPERATIONS & RBAC",
    tagline: "STOMP WebSocket Realtime Chat & Multi-Role REST Architectures",
    problem: "Enterprise teams needed a single operational hub to manage distributed attendance, multi-role project assignments, and instant team communication without third-party data leakage.",
    solution: "Engineered 17 REST controllers implementing strict role-based access workflows, paired with a real-time STOMP WebSocket chat engine featuring presence tracking and zero-trust JWT authorization.",
    features: [
      "Authored comprehensive API catalogs across 17 REST controllers with role-based access isolation.",
      "Real-time STOMP WebSocket chat engine with presence tracking and instantaneous notifications.",
      "Zero-trust session authorization with JWT token revocation and immutable audit trails.",
    ],
    youtubeId: "FZT9HYyFXm4",
    githubUrl: "https://github.com/Fahedmb",
    tags: ["Java 21", "Spring Boot 3.5", "React 18", "MySQL", "STOMP WebSockets", "JWT Vault", "REST Controllers"],
    metrics: "17 REST CONTROLLERS • STOMP CHAT • 100% RBAC ISOLATION",
    icon: "server",
    isPrivate: true,
  },
  {
    id: "canvas-engine",
    tabLabel: "3D PORTFOLIO",
    title: "Cosmic 60 FPS Canvas Engine & 3D Interactive Portfolio",
    clientOrRole: "Personal Engineering Project • 2026",
    category: "3D GRAPHICS & SIMULATION",
    tagline: "Hardware-Accelerated Frame Seeking & 3D Physics Simulation",
    problem: "Traditional developer portfolios rely on static layouts or sluggish WebGL scenes that cause massive frame drops, jank, and poor conversion.",
    solution: "Engineered a custom hardware-accelerated video canvas synchronizing 1,194 video frames to scroll velocity with sub-millisecond precision, paired with interactive 3D Rapier physics and zero layout thrashing.",
    features: [
      "Hardware-accelerated HTML5 Canvas video stream with requestVideoFrameCallback synchronization.",
      "Interactive 3D lanyard physics with Rapier physics engine, React Three Fiber & specular button shaders.",
      "Zero-jitter CSS grid navigation, dynamic telemetry HUD, and sub-second Web Vitals.",
    ],
    tags: ["Next.js 15", "React 19", "Three.js / Rapier", "HTML5 Canvas", "Tailwind CSS v4", "TypeScript"],
    metrics: "60 FPS RENDER • 0 LAYOUT JANK • SUB-SECOND VITALS",
    icon: "zap",
    isPrivate: false,
    isPortfolioProduct: true,
  },
];

interface DepthCarouselProps {
  projects?: ProjectItem[];
  className?: string;
  onOrderPortfolio?: () => void;
}

export default function DepthCarousel({
  projects = defaultProjects,
  className = "",
  onOrderPortfolio,
}: DepthCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideoProject, setActiveVideoProject] = useState<ProjectItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close video modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideoProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const current = projects[activeIndex];

  const handleOrderClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("order-portfolio-request", {
          detail: {
            frequency: "Freelance Web Platform Delivery",
            message:
              "Hi Fahed, I would like to commission a custom interactive 3D portfolio / web platform for my personal branding. Let's discuss scope and timeline!",
          },
        })
      );
    }

    if (onOrderPortfolio) {
      onOrderPortfolio();
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: window.innerHeight * 3, behavior: "smooth" });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "cpu":
        return <Cpu className="w-4 h-4 text-amber-700" />;
      case "shield":
        return <ShieldCheck className="w-4 h-4 text-amber-700" />;
      case "server":
        return <Server className="w-4 h-4 text-amber-700" />;
      case "zap":
        return <Zap className="w-4 h-4 text-amber-700" />;
      case "layers":
      default:
        return <Layers className="w-4 h-4 text-amber-700" />;
    }
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2 MATCHING LIGHT-THEMED PROJECT TAB NAVBAR                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex justify-center mb-3">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/90 border border-neutral-300/80 backdrop-blur-xl shadow-md max-w-fit mx-auto overflow-x-auto scrollbar-none">
          {projects.map((proj, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={proj.id}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-mono font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-md font-extrabold"
                    : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                }`}
              >
                <span className={`font-mono text-[9px] ${isActive ? "text-yellow-400" : "opacity-60"}`}>
                  0{idx + 1}
                </span>
                <span>{proj.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* STRUCTURED PROJECT CARD CONTAINER                                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        key={current.id}
        className="relative rounded-3xl p-5 sm:p-6 bg-white/95 border border-neutral-200/90 shadow-2xl shadow-neutral-900/10 backdrop-blur-2xl text-neutral-900 animate-tab-switch"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              {getIcon(current.icon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-900">
                  {current.category}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {current.clientOrRole}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display tracking-tight text-neutral-900">
                {current.title}
              </h3>
            </div>
          </div>

          {/* Quick Pagination Arrows */}
          <div className="flex items-center space-x-1">
            <button
              onClick={prevProject}
              className="p-1.5 rounded-full border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all active:scale-95 cursor-pointer"
              title="Previous Project"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-neutral-500 px-1">
              0{activeIndex + 1}/0{projects.length}
            </span>
            <button
              onClick={nextProject}
              className="p-1.5 rounded-full border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all active:scale-95 cursor-pointer"
              title="Next Project"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Structured Body Grid */}
        <div className="space-y-3 mb-4">
          {/* Section 1: Problem Statement & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Problem Statement Box */}
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/15">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-900 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span>PROBLEM STATEMENT</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-light">
                {current.problem}
              </p>
            </div>

            {/* Engineered Solution Box */}
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-900 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                <span>ENGINEERED SOLUTION</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-light">
                {current.solution}
              </p>
            </div>
          </div>

          {/* Section 2: Key Features & Engineering Highlights */}
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-800 mb-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-700" />
              <span>KEY ARCHITECTURAL FEATURES</span>
            </div>
            <div className="space-y-1.5">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-600 font-light">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Tech Stack Carousel / Marquee Ticker */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-500 mb-1.5 px-0.5">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3 h-3 text-amber-700" />
                <span>TECHNICAL STACK &amp; LIBRARIES</span>
              </div>
              <span className="text-[9px] font-normal text-neutral-400 font-mono">
                {current.tags.length} MODULES
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-[10px] font-mono font-medium text-neutral-800 whitespace-nowrap shadow-2xs hover:border-amber-500/40 hover:bg-amber-500/10 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Proven Impact Telemetry */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold text-amber-900 w-full">
            <span className="text-amber-700 font-normal">PROVEN IMPACT:</span>
            <span>{current.metrics}</span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ACTION BUTTONS & DEMOS                                              */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-100">
          {/* Watch Video Demo Modal Trigger (Projects 1 to 4) */}
          {current.youtubeId && (
            <button
              onClick={() => setActiveVideoProject(current)}
              className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-mono font-bold tracking-wider transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-yellow-300" />
              <span>WATCH VIDEO DEMO</span>
            </button>
          )}

          {/* Normal GitHub Button with Hover Morphing to Private Repo Lock (Projects 1 - 4) */}
          {current.githubUrl && (
            <a
              href={current.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="group/gh relative px-3.5 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-mono font-semibold transition-all duration-300 active:scale-95 flex items-center gap-2 overflow-hidden shadow-xs cursor-pointer"
              title={current.isPrivate ? "Private enterprise repository — Click to visit GitHub profile" : "View Source on GitHub"}
            >
              {current.isPrivate ? (
                <>
                  <span className="flex items-center gap-1.5 transition-transform duration-300 group-hover/gh:-translate-y-6 group-hover/gh:opacity-0">
                    <Code2 className="w-3.5 h-3.5 text-neutral-500" />
                    <span>SOURCE / GITHUB</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center gap-1.5 text-yellow-400 font-bold translate-y-6 opacity-0 group-hover/gh:translate-y-0 group-hover/gh:opacity-100 transition-all duration-300 bg-neutral-900">
                    <Lock className="w-3.5 h-3.5 text-yellow-400" />
                    <span>PRIVATE REPO</span>
                  </span>
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-neutral-500 group-hover/gh:text-white" />
                  <span>SOURCE / GITHUB</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 group-hover/gh:text-white" />
                </span>
              )}
            </a>
          )}

          {/* Dedicated "Order a Portfolio" Button for 5th Project */}
          {current.isPortfolioProduct && (
            <button
              onClick={handleOrderClick}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-mono font-bold tracking-wider transition-all duration-200 active:scale-95 shadow-lg shadow-neutral-900/20 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-4 h-4 fill-current text-yellow-400" />
              <span>ORDER A PORTFOLIO</span>
              <ArrowRight className="w-4 h-4 text-yellow-400" />
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* CUSTOM HIGH-TECH VIDEO PLAYER MODAL WITH PORTAL (FULL SCREEN BLUR)  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {mounted &&
        activeVideoProject &&
        activeVideoProject.youtubeId &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-2xl animate-fadeIn"
            onClick={() => setActiveVideoProject(null)}
          >
            <div
              className="relative w-full max-w-5xl rounded-3xl bg-neutral-950 border border-yellow-400/40 shadow-2xl shadow-yellow-500/20 overflow-hidden flex flex-col backdrop-blur-2xl animate-tab-switch"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Custom Studio Player Header Bar with Big Clear Project Title */}
              <div className="flex items-start sm:items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900">
                <div className="space-y-1">
                  {/* Status Telemetry Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-[10px] font-mono font-bold text-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>RECORDED DEMO TELEMETRY</span>
                    </div>
                    <span className="text-[10px] font-mono text-yellow-400 font-semibold">
                      {activeVideoProject.category}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
                      • {activeVideoProject.clientOrRole}
                    </span>
                  </div>

                  {/* Big, Clear, Highly Visible Project Title */}
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold font-display text-white tracking-tight leading-snug">
                    {activeVideoProject.title}
                  </h3>
                </div>

                {/* Sleek Custom Close Button */}
                <button
                  onClick={() => setActiveVideoProject(null)}
                  className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-yellow-400 hover:text-black text-white transition-all duration-200 cursor-pointer border border-white/10 shrink-0 active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
                  title="Close Player (ESC)"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">CLOSE</span>
                </button>
              </div>

              {/* Seamless Edge-to-Edge Custom Video Viewport Screen with HUD Corner Brackets */}
              <div className="relative w-full aspect-video bg-black overflow-hidden">
                {/* Cybernetic HUD Corner Accents */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-yellow-400 pointer-events-none z-10 opacity-80" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-yellow-400 pointer-events-none z-10 opacity-80" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-yellow-400 pointer-events-none z-10 opacity-80" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-yellow-400 pointer-events-none z-10 opacity-80" />

                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoProject.youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                  title={activeVideoProject.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Custom Video Player Telemetry Footer Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3 border-t border-white/10 bg-neutral-950 text-[11px] font-mono">
                <div className="flex items-center gap-2 text-yellow-300 font-semibold">
                  <span className="text-amber-500 font-bold">PROVEN IMPACT:</span>
                  <span>{activeVideoProject.metrics}</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-[10px]">ESC to close</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
