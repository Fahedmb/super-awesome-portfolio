"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import ScrollCanvas from "@/components/ScrollCanvas";
import SpecularButton from "@/components/SpecularButton";
import LogoLoop from "@/components/LogoLoop";
import BorderGlowCard from "@/components/BorderGlowCard";
import DepthCarousel from "@/components/DepthCarousel";
import EasterEggDecoder from "@/components/EasterEggDecoder";
import TransmissionForm from "@/components/TransmissionForm";
import GradualBlur from "@/components/GradualBlur";
import AboutTabs from "@/components/AboutTabs";

const Lanyard = dynamic(() => import("@/components/Lanyard"), {
  ssr: false,
  loading: () => <div className="h-[480px] w-full" />,
});
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Sparkles,
  Code2,
  Orbit,
  Radio,
  Cpu,
  Layers,
  FileDown,
  GraduationCap,
  Briefcase,
  Database,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface ProgressData {
  progress: number;
  currentFrame: number;
  totalFrames: number;
  currentScene: string;
  sceneProgress: number;
}

export default function Home() {
  const isAnimating = useRef(false);
  const animRafRef = useRef<number | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [hoveredNav, setHoveredNav] = useState<number | null>(null);
  const [progressState, setProgressState] = useState<ProgressData>({
    progress: 0,
    currentFrame: 0,
    totalFrames: 1194,
    currentScene: "scene_1",
    sceneProgress: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const sectionTitles = [
    { num: "00", name: "ORIGIN", themeLabel: "THE ASCENT", subtitle: "Genesis" },
    { num: "01", name: "ABOUT ME", themeLabel: "SINGULARITY", subtitle: "Engineering Profile" },
    { num: "02", name: "WORKS", themeLabel: "PROJECTS", subtitle: "Enterprise Demos" },
    { num: "03", name: "CONTACT ME", themeLabel: "TRANSMIT", subtitle: "Direct Dispatch" },
  ];

  // Smooth cinematic transition engine (3.2s duration per scene)
  const scrollToSection = useCallback(
    (index: number, customDuration?: number) => {
      const vh = window.innerHeight;
      const targetIndex = Math.max(0, Math.min(index, 3));
      const targetY = targetIndex * vh;
      const startY = window.scrollY;
      const change = targetY - startY;

      if (Math.abs(change) < 2) return;

      // Respect accessibility preferences
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        window.scrollTo(0, targetY);
        setActiveSection(targetIndex);
        return;
      }

      if (animRafRef.current) {
        cancelAnimationFrame(animRafRef.current);
      }

      isAnimating.current = true;
      const startTime = performance.now();

      // Pacing calibration: 3200ms per section
      const sectionsCount = Math.max(1, Math.abs(change) / vh);
      const duration =
        customDuration ?? Math.min(5200, 3200 + (sectionsCount - 1) * 900);

      // Smooth cinematic cruise easing
      const cinematicCruiseEase = (t: number): number => {
        if (t < 0.10) {
          const p = t / 0.10;
          return 0.10 * (p * p * (3 - 2 * p));
        } else if (t > 0.90) {
          const p = (t - 0.90) / 0.10;
          const smoothOut = p * p * (3 - 2 * p);
          return 0.90 + 0.10 * smoothOut;
        } else {
          return t;
        }
      };

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        const ease = cinematicCruiseEase(rawProgress);

        window.scrollTo(0, startY + change * ease);

        if (rawProgress < 1) {
          animRafRef.current = requestAnimationFrame(animateScroll);
        } else {
          window.scrollTo(0, targetY);
          isAnimating.current = false;
          animRafRef.current = null;
          setActiveSection(targetIndex);
        }
      };

      animRafRef.current = requestAnimationFrame(animateScroll);
    },
    []
  );

  // Multi-modal gesture and interaction handler (Wheel, Touch, Keyboard)
  useEffect(() => {
    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (isAnimating.current && now - lastWheelTime < 600) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) > 12) {
        e.preventDefault();
        lastWheelTime = now;

        const vh = window.innerHeight;
        const currentSection = Math.round(window.scrollY / vh);
        if (e.deltaY > 0 && currentSection < 3) {
          scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }
    };

    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = performance.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const deltaTime = performance.now() - touchStartTime;
      const velocity = Math.abs(deltaY) / Math.max(deltaTime, 1);

      if (Math.abs(deltaY) > 35 || velocity > 0.3) {
        const vh = window.innerHeight;
        const currentSection = Math.round(window.scrollY / vh);
        if (deltaY > 0 && currentSection < 3) {
          scrollToSection(currentSection + 1);
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const vh = window.innerHeight;
      const currentSection = Math.round(window.scrollY / vh);

      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        if (currentSection < 3) scrollToSection(currentSection + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        if (currentSection > 0) scrollToSection(currentSection - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToSection(3);
      }
    };

    const handleScroll = () => {
      const vh = window.innerHeight;
      const current = Math.round(window.scrollY / vh);
      setActiveSection(current);

      if (isAnimating.current) return;

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        const nearest = Math.round(window.scrollY / vh);
        scrollToSection(nearest);
      }, 250);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [scrollToSection]);

  const handleProgressUpdate = useCallback((data: ProgressData) => {
    setProgressState(data);
  }, []);

  // Smooth visibility for GradualBlur based on scroll position
  const progressRatio = progressState.progress;
  const sectionFloat = progressRatio * 3;

  const getSectionVisibility = (index: number) => {
    const dist = Math.abs(sectionFloat - index);
    const threshold = 0.12; // 12% window around checkpoint
    if (dist >= threshold) return 0;
    return 1 - dist / threshold;
  };

  const isCurrentSectionLight = activeSection === 0 || activeSection === 2;

  return (
    <main className="relative min-h-screen font-sans selection:bg-yellow-400 selection:text-black">
      {/* Dynamic 60fps Video-Synchronized Background Canvas */}
      <ScrollCanvas onProgressUpdate={handleProgressUpdate} />

      {/* Top Glass Header & Navigation HUD */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-colors duration-300 ${
              isCurrentSectionLight
                ? "bg-neutral-900/10 border border-neutral-900/20 text-neutral-900"
                : "bg-yellow-400/20 border border-yellow-400/40 text-yellow-400"
            }`}
          >
            <Orbit className="w-4 h-4 animate-spin" style={{ animationDuration: "16s" }} />
          </div>
          <div>
            <div
              className={`text-xs font-mono font-bold tracking-widest flex items-center gap-1.5 transition-colors duration-300 ${
                isCurrentSectionLight ? "text-neutral-900" : "text-white"
              }`}
            >
              FAHED MBAREK <span className="font-normal opacity-60">// FULL-STACK &amp; AI</span>
            </div>
            <div
              className={`text-[10px] flex items-center gap-1.5 font-mono ${
                isCurrentSectionLight ? "text-neutral-600" : "text-neutral-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              TUNISIA (UTC+1) // OPEN FOR ROLES &amp; VENTURES
            </div>
          </div>
        </div>

        {/* Floating Glass Navigation Pill with Zero-Jitter Grid Overlay */}
        <nav
          className={`hidden md:flex items-center p-1.5 rounded-full border shadow-2xl transition-all duration-300 ${
            isCurrentSectionLight ? "glass-panel-light" : "glass-panel-dark"
          }`}
        >
          {sectionTitles.map((item, idx) => {
            const isActive = activeSection === idx;
            const isHovered = hoveredNav === idx;
            return (
              <button
                key={item.num}
                onClick={() => scrollToSection(idx)}
                onMouseEnter={() => setHoveredNav(idx)}
                onMouseLeave={() => setHoveredNav(null)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? isCurrentSectionLight
                      ? "bg-neutral-900 text-white font-bold shadow-md"
                      : "bg-[#FFD600] text-black font-bold shadow-lg shadow-yellow-400/25"
                    : isCurrentSectionLight
                    ? "text-neutral-600 hover:text-neutral-900 hover:bg-black/5"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="opacity-70 font-mono text-[10px]">{item.num}</span>
                {/* CSS Grid dual-layer: Keeps width fixed to max(name, themeLabel) with zero layout shift */}
                <span className="inline-grid grid-cols-1 grid-rows-1 text-[11px] tracking-wider font-semibold">
                  <span
                    className={`col-start-1 row-start-1 whitespace-nowrap transition-all duration-200 ${
                      isHovered ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span
                    className={`col-start-1 row-start-1 whitespace-nowrap transition-all duration-200 ${
                      isHovered
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  >
                    {item.themeLabel}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Quick Header Actions: CV Download & Contact */}
        <div className="flex items-center gap-2">
          <a
            href="/cv_fahed_mbarek.pdf"
            download
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-200 active:scale-95 border ${
              isCurrentSectionLight
                ? "bg-amber-500/10 border-amber-500/30 text-amber-900 hover:bg-amber-500/20"
                : "bg-yellow-400/10 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20"
            }`}
            title="Download Official CV PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>CV (PDF)</span>
          </a>

          <SpecularButton
            variant={isCurrentSectionLight ? "light" : "yellow"}
            onClick={() => scrollToSection(3)}
            className="!py-1.5 !px-3.5 !text-[11px]"
          >
            <span>CONTACT ME</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </SpecularButton>
        </div>
      </header>

      {/* Floating Bottom Telemetry & Navigation Controls */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
        {/* Left: Refined Telemetry HUD with Clear Sector / Phase / Sync */}
        <div
          suppressHydrationWarning
          className={`px-4 py-2 rounded-xl text-[11px] font-mono pointer-events-auto flex items-center gap-3.5 border shadow-lg backdrop-blur-xl transition-all duration-300 ${
            isCurrentSectionLight ? "glass-panel-light text-neutral-800" : "glass-panel-dark text-neutral-300"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="opacity-50">SECTOR:</span>{" "}
            <span
              className={`font-bold uppercase tracking-wider ${
                isCurrentSectionLight ? "text-amber-800" : "text-yellow-400"
              }`}
            >
              {sectionTitles[activeSection]?.name || "ORIGIN"}
            </span>
          </div>
          <div className="hidden sm:block h-3 w-[1px] bg-neutral-500/20" />
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="opacity-50">PHASE:</span>{" "}
            <span className="font-semibold tracking-wider">
              {sectionTitles[activeSection]?.themeLabel || "THE ASCENT"}
            </span>
          </div>
          <div className="hidden sm:block h-3 w-[1px] bg-neutral-500/20" />
          <div className="flex items-center gap-1.5">
            <span className="opacity-50">SYNC:</span>
            <span className="font-bold font-mono">{Math.round(progressState.progress * 100)}%</span>
          </div>
        </div>

        {/* Center: Global Progress Line */}
        <div className="hidden lg:block w-48 h-1.5 bg-black/40 border border-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-300 transition-all duration-75"
            style={{ width: `${Math.max(4, progressState.progress * 100)}%` }}
          />
        </div>

        {/* Right: Scene Navigation Buttons */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => scrollToSection(activeSection - 1)}
            disabled={mounted ? activeSection <= 0 : false}
            className={`p-2.5 rounded-xl border transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
              isCurrentSectionLight
                ? "glass-panel-light text-neutral-800 hover:bg-neutral-200"
                : "glass-panel-dark text-neutral-300 hover:text-white"
            }`}
            title="Previous Section (Arrow Up)"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection(activeSection + 1)}
            disabled={mounted ? activeSection >= 3 : false}
            className={`p-2.5 rounded-xl border transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
              isCurrentSectionLight
                ? "glass-panel-light text-neutral-800 hover:bg-neutral-200"
                : "glass-panel-dark text-neutral-300 hover:text-white"
            }`}
            title="Next Section (Arrow Down)"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* 
        ═══════════════════════════════════════════════════════════════════════
        CINEMATIC NARRATIVE OVERLAYS (4 Acts with Gradual Blur)
        ═══════════════════════════════════════════════════════════════════════
      */}
      <div className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-hidden">
        {/* 
          ─────────────────────────────────────────────────────────────────────
          SECTION 0: ORIGIN // THE ASCENT (Light // #FFFFFF)
          ─────────────────────────────────────────────────────────────────────
        */}
        <GradualBlur
          visibleProgress={getSectionVisibility(0)}
          className="absolute max-w-7xl w-full flex flex-col justify-between"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-2 lg:pt-4">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-neutral-900 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-mono mb-3 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>FAHED MBAREK // FULL-STACK &amp; AI SYSTEMS</span>
              </div>

              {/* Bold, Clear, Distinct Software Engineer Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight leading-[1.08] mb-3 text-neutral-900">
                Full-Stack Software Engineer{" "}
                <span className="block font-editorial italic text-amber-700 font-normal text-2xl sm:text-4xl md:text-5xl mt-1">
                  Distributed Backends, AI &amp; Modern Web.
                </span>
              </h1>

              {/* Generalized Bio without specific university names */}
              <p className="text-xs sm:text-sm text-neutral-700 max-w-xl leading-relaxed mb-4 font-light">
                Full-Stack Software Engineer with a National Engineering Diploma and Data Science background,
                combining 3+ years of client-facing freelance web delivery (15+ custom platforms) with enterprise
                systems engineering. Specializing in scalable Java/Spring Boot microservices, modern Next.js &amp; Angular
                architectures, and AI-enabled integrations.
              </p>

              {/* Clean General Qualification Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                  <span>NATIONAL ENGINEERING DIPLOMA</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-700" />
                  <span>DATA SCIENCE BACKGROUND</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[11px] font-mono flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                  <span>3+ YRS FREELANCE DELIVERY</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/cv_fahed_mbarek.pdf"
                  download
                  className="px-5 py-3 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-mono font-bold tracking-wider transition-all duration-200 active:scale-95 shadow-xl shadow-neutral-900/15 flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4 text-yellow-400" />
                  <span>DOWNLOAD CV (PDF)</span>
                </a>

                <SpecularButton
                  variant="light"
                  onClick={() => scrollToSection(1)}
                  className="shadow-md"
                >
                  <span>ABOUT ME</span>
                  <ChevronRight className="w-4 h-4" />
                </SpecularButton>

                <button
                  onClick={() => scrollToSection(2)}
                  className="px-5 py-3 rounded-full border border-neutral-300 bg-white/80 hover:bg-white text-neutral-800 text-xs font-mono font-semibold transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
                >
                  EXPLORE WORKS
                </button>
              </div>
            </div>

            {/* Right Column: Interactive 3D Lanyard (React Bits + Rapier Physics) */}
            <div className="lg:col-span-5 flex justify-center items-center pointer-events-auto overflow-visible">
              <Lanyard
                position={[0, 0, 20]}
                gravity={[0, -40, 0]}
                fov={20}
                transparent={true}
                lanyardWidth={1}
                frontImage="/assets/lanyard/fahed_badge.svg"
                active={getSectionVisibility(0) > 0.05}
              />
            </div>
          </div>

          {/* Bottom Tech Logo Loop with Actual Framework Logos */}
          <div className="mt-4 sm:mt-6">
            <LogoLoop theme="light" />
          </div>
        </GradualBlur>

        {/* 
          ─────────────────────────────────────────────────────────────────────
          SECTION 1: ABOUT ME // THE SINGULARITY (Noir // #000000)
          ─────────────────────────────────────────────────────────────────────
        */}
        <GradualBlur
          visibleProgress={getSectionVisibility(1)}
          className="absolute max-w-5xl w-full flex flex-col text-white"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono mb-2 backdrop-blur-md self-start">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SECTION 01 // ABOUT ME &amp; ENGINEERING CORE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight mb-2">
            The Engineer Behind the Code:{" "}
            <span className="text-electric-yellow glow-yellow font-editorial italic font-normal">
              Foundations, Journey &amp; Persona.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed mb-3.5 font-light">
            Bridging academic engineering rigor with 3+ years of client-facing freelance web delivery and enterprise systems.
            Explore my core architecture pillars, academic timeline, physical &amp; creative pursuits, and classified intel below.
          </p>

          {/* Interactive Multi-Tab Interface: Core Architecture, Academic Roadmap, Hobbies, Q&A */}
          <AboutTabs />
        </GradualBlur>

        {/* 
          ─────────────────────────────────────────────────────────────────────
          SECTION 2: WORKS // COMPILED PROJECTS (Gallery White // #F8F9FA)
          ─────────────────────────────────────────────────────────────────────
        */}
        <GradualBlur
          visibleProgress={getSectionVisibility(2)}
          className="absolute max-w-5xl w-full flex flex-col text-neutral-900"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-mono mb-2 backdrop-blur-md self-start">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>SECTION 02 // COMPILED ENTERPRISE WORKS &amp; DEMOS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight mb-1.5">
            Enterprise Platforms &amp;{" "}
            <span className="font-editorial italic text-amber-800 font-normal">
              Recorded Video Demos.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed mb-3 font-light">
            Production-grade systems built from scratch with microservices, automated cost reconciliation,
            automotive competency matrices, and embedded video walkthroughs.
          </p>

          {/* 3D Depth Carousel with Quick Tabs and Video Modals */}
          <DepthCarousel onOrderPortfolio={() => scrollToSection(3)} />
        </GradualBlur>

        {/* 
          ─────────────────────────────────────────────────────────────────────
          SECTION 3: CONTACT ME // DIRECT TRANSMISSION (Void Noir // #000000)
          ─────────────────────────────────────────────────────────────────────
        */}
        <GradualBlur
          visibleProgress={getSectionVisibility(3)}
          className="absolute max-w-4xl w-full flex flex-col text-white"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono mb-2 backdrop-blur-md self-center">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>SECTION 03 // CONTACT ME &amp; DIRECT TRANSMISSION</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-center mb-2">
            Initiate Contact with{" "}
            <span className="text-electric-yellow glow-yellow font-editorial italic font-normal">
              Fahed Mbarek.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 text-center max-w-lg mx-auto leading-relaxed mb-4 font-light font-mono">
            Open for full-time software engineering roles, enterprise system architecture,
            and client collaborations. Send a message to initiate discussion.
          </p>

          {/* Interactive Contact & Telemetry Dispatch Form */}
          <TransmissionForm />
        </GradualBlur>
      </div>

      {/* Invisible Snap Scroll Spacer Sections (Provides 300vh scroll range) */}
      <div className="relative z-10 w-full pointer-events-none">
        <section className="h-screen w-full" />
        <section className="h-screen w-full" />
        <section className="h-screen w-full" />
        <section className="h-screen w-full" />
      </div>
    </main>
  );
}
