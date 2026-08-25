"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import ScrollCanvas from "@/components/ScrollCanvas";
import SpecularButton from "@/components/SpecularButton";
import LogoLoop from "@/components/LogoLoop";
import DepthCarousel from "@/components/DepthCarousel";
import TransmissionForm from "@/components/TransmissionForm";
import GradualBlur from "@/components/GradualBlur";
import AboutTabs from "@/components/AboutTabs";
import { detectDevice } from "@/lib/device";

const Lanyard = dynamic(() => import("@/components/Lanyard"), {
  ssr: false,
  loading: () => <div className="h-[480px] w-full" />,
});
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Sparkles,
  Orbit,
  Radio,
  FileDown,
  GraduationCap,
  Briefcase,
  Database,
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

  const [activeSection, setActiveSection] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [hoveredNav, setHoveredNav] = useState<number | null>(null);
  const progressRef = useRef<ProgressData>({
    progress: 0,
    currentFrame: 0,
    totalFrames: 1194,
    currentScene: "scene_1",
    sceneProgress: 0,
  });
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

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

      if (Math.abs(change) < 2) {
        setActiveSection(targetIndex);
        setIsTransitioning(false);
        return;
      }

      const dev = detectDevice();

      // Respect accessibility preferences
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        window.scrollTo(0, targetY);
        setActiveSection(targetIndex);
        setIsTransitioning(false);
        return;
      }

      if (animRafRef.current) {
        cancelAnimationFrame(animRafRef.current);
      }

      // Mobile Device Fast-Track: 320ms responsive cubic-bezier smooth transition without video waiting
      if (dev.isMobile) {
        setIsTransitioning(true);
        isAnimating.current = true;
        const startTime = performance.now();
        const duration = 320;

        const animateMobile = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Cubic ease-out
          const ease = 1 - Math.pow(1 - progress, 3);

          window.scrollTo(0, startY + change * ease);

          if (progress < 1) {
            animRafRef.current = requestAnimationFrame(animateMobile);
          } else {
            window.scrollTo(0, targetY);
            isAnimating.current = false;
            animRafRef.current = null;
            setActiveSection(targetIndex);
            setIsTransitioning(false);
          }
        };

        animRafRef.current = requestAnimationFrame(animateMobile);
        return;
      }

      // Desktop (Windows PC, Mac, Linux): Full 1:1 real-time 60fps video playback
      setIsTransitioning(true);
      isAnimating.current = true;
      const startTime = performance.now();

      // Natural 1:1 real-time video playback duration (zero speedup)
      const sceneDurations = [7333, 6200, 6367];
      const fromSec = Math.min(Math.round(startY / vh), 2);
      const toSec = Math.min(targetIndex, 3);
      const minSec = Math.min(fromSec, toSec);
      const maxSec = Math.max(fromSec, toSec);

      let naturalSpanDuration = 0;
      for (let s = minSec; s < maxSec && s < sceneDurations.length; s++) {
        naturalSpanDuration += sceneDurations[s];
      }
      if (naturalSpanDuration === 0) naturalSpanDuration = 6600;

      const duration = customDuration ?? naturalSpanDuration;

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        // Completely linear 1:1 constant velocity — zero acceleration / zero easing
        const ease = rawProgress;

        window.scrollTo(0, startY + change * ease);

        if (rawProgress < 1) {
          animRafRef.current = requestAnimationFrame(animateScroll);
        } else {
          window.scrollTo(0, targetY);
          isAnimating.current = false;
          animRafRef.current = null;
          setActiveSection(targetIndex);
          setIsTransitioning(false);
        }
      };

      animRafRef.current = requestAnimationFrame(animateScroll);
    },
    []
  );

  // Multi-modal gesture and interaction handler (Wheel, Touch, Keyboard)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // If already transitioning between sections, ignore wheel events to prevent animation interruption
      if (isAnimating.current) {
        return;
      }

      if (Math.abs(e.deltaY) > 8) {
        const vh = window.innerHeight;
        const currentSection = Math.round(window.scrollY / vh);
        if (e.deltaY > 0 && currentSection < 3) {
          scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
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

      if (isAnimating.current) return;

      setIsTransitioning(true);

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        const nearest = Math.round(window.scrollY / vh);
        scrollToSection(nearest);
      }, 150);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Allow internal scrolling inside scrollable sub-containers (.overflow-y-auto or .overflow-x-auto)
      let target = e.target as HTMLElement | null;
      let isInsideScrollable = false;
      while (target && target !== document.body) {
        if (
          target.classList?.contains("overflow-y-auto") ||
          target.classList?.contains("overflow-x-auto")
        ) {
          isInsideScrollable = true;
          break;
        }
        target = target.parentElement;
      }
      // Block window/page dragging from activating video animations
      if (!isInsideScrollable) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleTouchMove);
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [scrollToSection]);

  const handleProgressUpdate = useCallback((data: ProgressData) => {
    progressRef.current = data;
    // Direct DOM writes — zero React re-renders
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.max(4, data.progress * 100)}%`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${Math.round(data.progress * 100)}%`;
    }
  }, []);

  const getSectionVisibility = (index: number) => {
    if (isTransitioning) return 0;
    return activeSection === index ? 1 : 0;
  };

  const isCurrentSectionLight = activeSection === 0 || activeSection === 2;

  return (
    <main className="relative min-h-screen font-sans selection:bg-yellow-400 selection:text-black">
      {/* Dynamic 60fps Video-Synchronized Background Canvas */}
      <ScrollCanvas onProgressUpdate={handleProgressUpdate} />

      {/* Top Glass Header & Navigation HUD (Desktop & Tablet) */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 px-6 py-4 items-center justify-between pointer-events-auto">
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
              FAHED MBAREK <span className="font-normal opacity-60">{"// FULL-STACK & AI"}</span>
            </div>
            <div
              className={`text-[10px] flex items-center gap-1.5 font-mono ${
                isCurrentSectionLight ? "text-neutral-600" : "text-neutral-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              TUNISIA (UTC+1) // OPEN FOR ROLES &amp; VENTURES
            </div>
          </div>
        </div>

        {/* Floating Glass Navigation Pill with Zero-Jitter Grid Overlay */}
        <nav
          className={`flex items-center p-1.5 rounded-full border shadow-2xl transition-all duration-300 ${
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
            href="/Resume_Fahed_Mbarek.pdf"
            download="Resume_Fahed_Mbarek.pdf"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-200 active:scale-95 border ${
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
      <footer className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between pointer-events-none">
        {/* Left: Refined Telemetry HUD with Clear Sector / Phase */}
        <div
          suppressHydrationWarning
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-[11px] font-mono pointer-events-auto flex items-center gap-2 sm:gap-3.5 border shadow-lg backdrop-blur-xl transition-all duration-300 ${
            isCurrentSectionLight ? "glass-panel-light text-neutral-800" : "glass-panel-dark text-neutral-300"
          }`}
        >
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="opacity-50 text-[9px] sm:text-[10px]">SEC:</span>{" "}
            <span
              className={`font-bold uppercase tracking-wider ${
                isCurrentSectionLight ? "text-amber-800" : "text-yellow-400"
              }`}
            >
              {isTransitioning
                ? "TRANSIT..."
                : `${sectionTitles[activeSection]?.num} ${sectionTitles[activeSection]?.name}`}
            </span>
          </div>
          <div className="hidden md:block h-3 w-[1px] bg-neutral-500/20" />
          <div className="hidden md:flex items-center gap-1.5">
            <span className="opacity-50">PHASE:</span>{" "}
            <span className="font-semibold tracking-wider">
              {isTransitioning
                ? "SYNCHRONIZING STREAM"
                : sectionTitles[activeSection]?.themeLabel}
            </span>
          </div>
        </div>

        {/* Center: Perfectly Centered Animation Progress Meter (Mobile & Desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-2xl pointer-events-auto transition-all duration-300 bg-black/85 border-white/15 text-white">
          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="hidden sm:inline">SYNC</span>
          </div>
          <div className="w-20 sm:w-36 md:w-52 h-1.5 bg-white/10 border border-white/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 transition-all duration-75 shadow-[0_0_10px_rgba(255,214,0,0.7)]"
              style={{ width: "4%" }}
            />
          </div>
          <span ref={progressTextRef} className="text-[10px] sm:text-[11px] font-mono font-bold text-yellow-400 tabular-nums">
            0%
          </span>
        </div>

        {/* Right: Scene Navigation Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 pointer-events-auto">
          <button
            onClick={() => scrollToSection(activeSection - 1)}
            disabled={activeSection <= 0}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
              isCurrentSectionLight
                ? "glass-panel-light text-neutral-800 hover:bg-neutral-200"
                : "glass-panel-dark text-neutral-300 hover:text-white"
            }`}
            title="Previous Sector (Arrow Up)"
          >
            <ArrowUp className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
          <button
            onClick={() => scrollToSection(activeSection + 1)}
            disabled={activeSection >= 3}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
              isCurrentSectionLight
                ? "glass-panel-light text-neutral-800 hover:bg-neutral-200"
                : "glass-panel-dark text-neutral-300 hover:text-white"
            }`}
            title="Next Sector (Arrow Down)"
          >
            <ArrowDown className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
        </div>
      </footer>

      {/* ----------------------------------------------------------------- */}
      {/* CINEMATIC NARRATIVE OVERLAYS (4 Acts with Gradual Blur) */}
      {/* ----------------------------------------------------------------- */}
      <div className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 pt-1 sm:pt-2 md:pt-14 pb-14 sm:pb-16 overflow-hidden">
        {/* SECTION 0: ORIGIN // THE ASCENT (Light // #FFFFFF) */}
        <GradualBlur
          visibleProgress={getSectionVisibility(0)}
          className="absolute w-[96vw] sm:w-[94vw] md:w-full max-w-7xl flex flex-col justify-between max-h-[88vh] lg:max-h-[92vh] mx-auto pointer-events-auto"
        >
          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center pt-1 lg:pt-3">
              {/* Left Narrative Column */}
              <div className="lg:col-span-7 flex flex-col items-start text-neutral-900 z-10">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-[10px] sm:text-xs font-mono mb-2 sm:mb-3 backdrop-blur-md">
                  <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-600 animate-pulse" />
                  <span>FAHED MBAREK // FULL-STACK &amp; AI SYSTEMS</span>
                </div>

                {/* Bold, Clear, Distinct Software Engineer Title */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.1] mb-2 sm:mb-3 text-neutral-900">
                  Full-Stack Software Engineer{" "}
                  <span className="block font-editorial italic text-amber-700 font-normal text-xl sm:text-3xl md:text-4xl lg:text-5xl mt-0.5 sm:mt-1">
                    Distributed Backends, AI &amp; Modern Web.
                  </span>
                </h1>

                {/* Generalized Bio */}
                <p className="text-[11px] sm:text-xs md:text-sm text-neutral-700 max-w-xl leading-relaxed mb-3 sm:mb-4 font-light">
                  Full-Stack Software Engineer with a National Engineering Diploma and Data Science background,
                  combining 3+ years of client-facing freelance web delivery (15+ custom platforms) with enterprise
                  systems engineering. Specializing in scalable Java/Spring Boot microservices, modern Next.js &amp; Angular
                  architectures, and AI-enabled integrations.
                </p>

                {/* Clean General Qualification Badges */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-5">
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] sm:text-[11px] font-mono flex items-center gap-1 sm:gap-1.5">
                    <GraduationCap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-700" />
                    <span>NATIONAL ENGINEERING DIPLOMA</span>
                  </span>
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] sm:text-[11px] font-mono flex items-center gap-1 sm:gap-1.5">
                    <Database className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-700" />
                    <span>DATA SCIENCE BACKGROUND</span>
                  </span>
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[10px] sm:text-[11px] font-mono flex items-center gap-1 sm:gap-1.5">
                    <Briefcase className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-700" />
                    <span>3+ YRS FREELANCE DELIVERY</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <a
                    href="/Resume_Fahed_Mbarek.pdf"
                    download="Resume_Fahed_Mbarek.pdf"
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-[11px] sm:text-xs font-mono font-bold tracking-wider transition-all duration-200 active:scale-95 shadow-xl shadow-neutral-900/15 flex items-center gap-1.5 sm:gap-2"
                  >
                    <FileDown className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-yellow-400" />
                    <span>DOWNLOAD CV</span>
                  </a>

                  <SpecularButton
                    variant="light"
                    onClick={() => scrollToSection(1)}
                    className="shadow-md !py-2 sm:!py-2.5 !px-4 sm:!px-5 !text-[11px] sm:!text-xs"
                  >
                    <span>ABOUT ME</span>
                    <ChevronRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </SpecularButton>

                  <button
                    onClick={() => scrollToSection(2)}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-neutral-300 bg-white/80 hover:bg-white text-neutral-800 text-[11px] sm:text-xs font-mono font-semibold transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
                  >
                    EXPLORE WORKS
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive 3D Lanyard (Desktop & Large Viewports) */}
              <div className="hidden lg:flex lg:col-span-5 justify-center items-center pointer-events-auto overflow-visible">
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

            {/* Bottom Tech Logo Loop */}
            <div className="mt-3 sm:mt-4 shrink-0">
              <LogoLoop theme="light" />
            </div>
          </div>

          {/* Absolute Bottom Navigation Bar */}
          <button
            onClick={() => scrollToSection(1)}
            className="w-full py-2 sm:py-2.5 px-4 sm:px-5 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-mono font-bold tracking-wider flex items-center justify-between transition-all active:scale-98 shadow-xl shadow-neutral-900/25 cursor-pointer shrink-0 mt-1.5 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span>NEXT SECTOR: 01 ABOUT ME &amp; ENGINEERING CORE</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
              <span>TRAVEL</span>
              <ArrowDown className="w-4 h-4 text-yellow-400 animate-bounce" />
            </div>
          </button>
        </GradualBlur>

        {/* SECTION 1: ABOUT ME // THE SINGULARITY (Noir // #000000) */}
        <GradualBlur
          visibleProgress={getSectionVisibility(1)}
          className="absolute w-[96vw] sm:w-[94vw] md:w-full max-w-7xl flex flex-col justify-between max-h-[88vh] lg:max-h-[92vh] text-white mx-auto pointer-events-auto"
        >
          {/* Absolute Top Navigation Bar */}
          <button
            onClick={() => scrollToSection(0)}
            className="w-full py-1.5 px-4 rounded-2xl bg-black/80 hover:bg-black border border-white/15 backdrop-blur-xl text-neutral-300 hover:text-white text-xs font-mono font-bold tracking-wider flex items-center justify-between transition-all active:scale-98 shadow-lg cursor-pointer shrink-0 mb-1.5 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <ArrowUp className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>PREVIOUS SECTOR: 00 ORIGIN</span>
            </div>
            <span className="text-[10px] font-mono text-yellow-400 font-bold">RETURN ↑</span>
          </button>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[10px] sm:text-xs font-mono mb-1 backdrop-blur-md self-start">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>SECTION 01 // ABOUT ME &amp; ENGINEERING CORE</span>
            </div>

            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold font-display tracking-tight mb-0.5 sm:mb-1">
              The Engineer Behind the Code:{" "}
              <span className="text-electric-yellow glow-yellow font-editorial italic font-normal">
                Foundations, Journey &amp; Persona.
              </span>
            </h2>

            <p className="text-[11px] sm:text-xs text-neutral-300 max-w-3xl leading-relaxed mb-1.5 sm:mb-2 font-light">
              Bridging academic engineering rigor with 3+ years of client-facing freelance web delivery and enterprise systems.
              Explore my core architecture pillars, academic timeline, physical &amp; creative pursuits, and classified intel below.
            </p>

            {/* Interactive Multi-Tab Interface: Core Architecture, Academic Roadmap, Hobbies, Q&A */}
            <AboutTabs />
          </div>

          {/* Absolute Bottom Navigation Bar */}
          <button
            onClick={() => scrollToSection(2)}
            className="w-full py-2 sm:py-2.5 px-4 sm:px-5 rounded-2xl bg-[#FFD600] hover:bg-[#FFE033] text-black text-xs font-mono font-extrabold tracking-wider flex items-center justify-between transition-all active:scale-98 shadow-xl shadow-yellow-400/30 cursor-pointer shrink-0 mt-1.5 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span>NEXT SECTOR: 02 COMPILED ENTERPRISE WORKS</span>
            </div>
            <div className="flex items-center gap-1.5 text-black font-extrabold">
              <span>TRAVEL</span>
              <ArrowDown className="w-4 h-4 text-black animate-bounce" />
            </div>
          </button>
        </GradualBlur>

        {/* SECTION 2: WORKS // COMPILED PROJECTS (Gallery White // #F8F9FA) */}
        <GradualBlur
          visibleProgress={getSectionVisibility(2)}
          className="absolute w-[96vw] sm:w-[94vw] md:w-full max-w-7xl flex flex-col justify-between max-h-[88vh] lg:max-h-[92vh] text-neutral-900 mx-auto pointer-events-auto"
        >
          {/* Absolute Top Navigation Bar */}
          <button
            onClick={() => scrollToSection(1)}
            className="w-full py-1.5 px-4 rounded-2xl bg-white/90 hover:bg-white border border-neutral-300 backdrop-blur-xl text-neutral-800 text-xs font-mono font-bold tracking-wider flex items-center justify-between transition-all active:scale-98 shadow-md cursor-pointer shrink-0 mb-1.5 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <ArrowUp className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span>PREVIOUS SECTOR: 01 ABOUT ME</span>
            </div>
            <span className="text-[10px] font-mono text-amber-800 font-bold">RETURN ↑</span>
          </button>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-[10px] sm:text-xs font-mono mb-1 backdrop-blur-md self-start">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-700" />
              <span>SECTION 02 // COMPILED ENTERPRISE WORKS &amp; DEMOS</span>
            </div>

            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold font-display tracking-tight mb-0.5 sm:mb-1">
              Enterprise Platforms &amp;{" "}
              <span className="font-editorial italic text-amber-800 font-normal">
                Recorded Video Demos.
              </span>
            </h2>

            <p className="text-[11px] sm:text-xs text-neutral-600 max-w-2xl leading-relaxed mb-1.5 sm:mb-2 font-light">
              Production-grade systems built from scratch with microservices, automated cost reconciliation,
              automotive competency matrices, and embedded video walkthroughs.
            </p>

            {/* 3D Depth Carousel with Quick Tabs and Video Modals */}
            <DepthCarousel onOrderPortfolio={() => scrollToSection(3)} />
          </div>

          {/* Absolute Bottom Navigation Bar */}
          <button
            onClick={() => scrollToSection(3)}
            className="w-full py-2 sm:py-2.5 px-4 sm:px-5 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-mono font-bold tracking-wider flex items-center justify-between transition-all active:scale-98 shadow-xl shadow-neutral-900/25 cursor-pointer shrink-0 mt-1.5 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span>NEXT SECTOR: 03 CONTACT ME &amp; TRANSMISSION</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
              <span>TRAVEL</span>
              <ArrowDown className="w-4 h-4 text-yellow-400 animate-bounce" />
            </div>
          </button>
        </GradualBlur>

        {/* SECTION 3: CONTACT ME // DIRECT TRANSMISSION (Void Noir // #000000) */}
        <GradualBlur
          visibleProgress={getSectionVisibility(3)}
          className="absolute w-[96vw] sm:w-[94vw] md:w-full max-w-4xl flex flex-col justify-between max-h-[88vh] lg:max-h-[92vh] text-white mx-auto pointer-events-auto"
        >
          {/* Absolute Top Navigation Bar */}
          <button
            onClick={() => scrollToSection(2)}
            className="w-full py-1.5 px-4 rounded-2xl bg-black/80 hover:bg-black border border-white/15 backdrop-blur-xl text-neutral-300 hover:text-white text-xs font-mono font-bold tracking-wider flex items-center justify-between transition-all active:scale-98 shadow-lg cursor-pointer shrink-0 mb-1.5 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <ArrowUp className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>PREVIOUS SECTOR: 02 COMPILED WORKS</span>
            </div>
            <span className="text-[10px] font-mono text-yellow-400 font-bold">RETURN ↑</span>
          </button>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[10px] sm:text-xs font-mono mb-1 backdrop-blur-md self-center">
              <Radio className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-pulse" />
              <span>SECTION 03 // CONTACT ME &amp; DIRECT TRANSMISSION</span>
            </div>

            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-center mb-1 sm:mb-1.5">
              Initiate Contact with{" "}
              <span className="text-electric-yellow glow-yellow font-editorial italic font-normal">
                Fahed Mbarek.
              </span>
            </h2>

            <p className="text-[11px] sm:text-xs text-neutral-300 text-center max-w-lg mx-auto leading-relaxed mb-2 sm:mb-2.5 font-light font-mono">
              Open for full-time software engineering roles, enterprise system architecture,
              and client collaborations. Send a message to initiate discussion.
            </p>

            {/* Interactive Contact & Telemetry Dispatch Form */}
            <TransmissionForm />
          </div>

          {/* Absolute Bottom Navigation Bar */}
          <button
            onClick={() => scrollToSection(0)}
            className="w-full py-2 sm:py-2.5 px-4 sm:px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold tracking-wider flex items-center justify-between transition-all active:scale-98 shadow-xl backdrop-blur-xl cursor-pointer shrink-0 mt-1.5 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <Orbit className="w-4 h-4 text-yellow-400 animate-spin" />
              <span>RETURN TO ORIGIN // SECTOR 00</span>
            </div>
            <span className="text-xs font-mono text-yellow-400 font-bold flex items-center gap-1.5">
              <span>TOP</span>
              <ArrowUp className="w-4 h-4 text-yellow-400 animate-bounce" />
            </span>
          </button>
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
