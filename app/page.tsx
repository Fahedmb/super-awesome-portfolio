"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import ScrollCanvas from "@/components/ScrollCanvas";
import SpecularButton from "@/components/SpecularButton";
import LogoLoop from "@/components/LogoLoop";
import Lanyard from "@/components/Lanyard";
import BorderGlowCard from "@/components/BorderGlowCard";
import DepthCarousel from "@/components/DepthCarousel";
import EasterEggDecoder from "@/components/EasterEggDecoder";
import TransmissionForm from "@/components/TransmissionForm";
import GradualBlur from "@/components/GradualBlur";
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
  Dumbbell,
  Disc,
  Coffee,
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
    { num: "01", name: "GENESIS", subtitle: "The Ascent" },
    { num: "02", name: "SINGULARITY", subtitle: "Interstellar Code" },
    { num: "03", name: "WORKS", subtitle: "Compiled Projects" },
    { num: "04", name: "TRANSMIT", subtitle: "Radio Signal" },
  ];

  // Slow, cinematic transition engine (3.2s duration per scene)
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

      // Pacing calibration: 3200ms per section to allow full appreciation of the visual video transformations
      const sectionsCount = Math.max(1, Math.abs(change) / vh);
      const duration =
        customDuration ?? Math.min(5200, 3200 + (sectionsCount - 1) * 900);

      // Smooth cinematic cruise easing (10% ease-in, 80% constant cruise, 10% ease-out)
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

    // 1. Wheel/Trackpad Interceptor
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

    // 2. Mobile Touch & Swipe Engine
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

    // 3. Accessible Keyboard Navigation
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

    // 4. Native scroll sync
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

  // Compute smooth visibility for GradualBlur based on scroll position
  const progressRatio = progressState.progress;
  const sectionFloat = progressRatio * 3;

  // Components and writing fade in/out during the first 10-12% and last 10-12% of the journey
  // During the middle 75-80% of the transition, visibility is 0 (hidden & blurred) so the full video is unobstructed
  const getSectionVisibility = (index: number) => {
    const dist = Math.abs(sectionFloat - index);
    const threshold = 0.12; // 12% window around checkpoint
    if (dist >= threshold) return 0;
    return 1 - dist / threshold; // 1.0 at checkpoint, drops to 0 at threshold
  };

  const isCurrentSectionLight = activeSection === 0 || activeSection === 2;

  return (
    <main className="relative min-h-screen font-sans selection:bg-yellow-400 selection:text-black">
      {/* Dynamic 60fps Video-Synchronized Background Canvas */}
      <ScrollCanvas onProgressUpdate={handleProgressUpdate} />

      {/* Top Glass Header & Navigation HUD */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-auto">
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
              className={`text-xs font-mono font-bold tracking-widest flex items-center gap-2 transition-colors duration-300 ${
                isCurrentSectionLight ? "text-neutral-900" : "text-white"
              }`}
            >
              FAHED <span className="font-normal opacity-60">// COSMIC SYSTEMS</span>
            </div>
            <div
              className={`text-[10px] flex items-center gap-1.5 font-mono ${
                isCurrentSectionLight ? "text-neutral-600" : "text-neutral-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              IN ORBIT // OPEN FOR VENTURES
            </div>
          </div>
        </div>

        {/* Floating Glass Navigation Pill */}
        <nav
          className={`hidden md:flex items-center p-1.5 rounded-full border shadow-2xl transition-all duration-300 ${
            isCurrentSectionLight ? "glass-panel-light" : "glass-panel-dark"
          }`}
        >
          {sectionTitles.map((item, idx) => {
            const isActive = activeSection === idx;
            return (
              <button
                key={item.num}
                onClick={() => scrollToSection(idx)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-500 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? isCurrentSectionLight
                      ? "bg-neutral-900 text-white font-bold shadow-md"
                      : "bg-[#FFD600] text-black font-bold shadow-lg shadow-yellow-400/25"
                    : isCurrentSectionLight
                    ? "text-neutral-600 hover:text-neutral-900 hover:bg-black/5"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.num}</span>
                <span className="text-[11px] tracking-wider">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <SpecularButton
          variant={isCurrentSectionLight ? "light" : "yellow"}
          onClick={() => scrollToSection(3)}
          className="!py-2 !px-4 !text-[11px]"
        >
          <span>TRANSMIT</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </SpecularButton>
      </header>

      {/* Floating Bottom Telemetry & Navigation Controls */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
        {/* Left: Realtime Scene & Frame Telemetry */}
        <div
          suppressHydrationWarning
          className={`px-4 py-2 rounded-xl text-[11px] font-mono pointer-events-auto flex items-center gap-4 border transition-all duration-300 ${
            isCurrentSectionLight ? "glass-panel-light text-neutral-800" : "glass-panel-dark text-neutral-300"
          }`}
        >
          <div>
            <span className="opacity-50">SCENE:</span>{" "}
            <span
              className={`font-bold uppercase ${
                isCurrentSectionLight ? "text-amber-800" : "text-yellow-400"
              }`}
            >
              {progressState.currentScene.replace("_", " ")}
            </span>
          </div>
          <div className="hidden sm:block h-3 w-[1px] bg-neutral-500/20" />
          <div className="hidden sm:block">
            <span className="opacity-50">FRAME:</span>{" "}
            <span className="font-bold">
              {String(progressState.currentFrame).padStart(4, "0")} / {progressState.totalFrames}
            </span>
          </div>
          <div className="hidden sm:block h-3 w-[1px] bg-neutral-500/20" />
          <div className="flex items-center gap-2">
            <span className="opacity-50">PROGRESS:</span>
            <span className="font-bold">{Math.round(progressState.progress * 100)}%</span>
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
            title="Previous Scene (Arrow Up)"
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
            title="Next Scene (Arrow Down)"
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
      <div className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center p-6 md:p-12 overflow-hidden">
        {/* 
          ─────────────────────────────────────────────────────────────────────
          ACT 0: THE GENESIS & ASCENT (Light // #FFFFFF)
          ─────────────────────────────────────────────────────────────────────
        */}
        <GradualBlur
          visibleProgress={getSectionVisibility(0)}
          className="absolute max-w-6xl w-full flex flex-col justify-between"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-neutral-900">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-mono mb-4 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>ACT 00 // THE COSMIC ASCENT</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-tight leading-[1.05] mb-4 text-neutral-900">
                Architecting Software Across the{" "}
                <span className="font-editorial italic text-amber-700 font-normal">
                  Digital Cosmos.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 max-w-xl leading-relaxed mb-6 font-light">
                Full-stack engineer and astronomy enthusiast crafting high-performance
                systems, synchronized 60 FPS canvas graphics, and resilient architectures
                that operate with celestial precision.
              </p>

              {/* Persona Hobbies & Easter Egg Badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-mono flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-amber-700" />
                  <span>BOXING &amp; STRENGTH</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-mono flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-amber-700" />
                  <span>VINYL &amp; ACOUSTICS</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-mono flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>ESPRESSO</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-mono flex items-center gap-1.5">
                  <Orbit className="w-3.5 h-3.5 text-amber-700" />
                  <span>ASTROPHYSICS</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <SpecularButton
                  variant="light"
                  onClick={() => scrollToSection(1)}
                  className="shadow-xl shadow-neutral-900/15"
                >
                  <span>ENTER THE SINGULARITY</span>
                  <ChevronRight className="w-4 h-4" />
                </SpecularButton>
                <button
                  onClick={() => scrollToSection(2)}
                  className="px-6 py-3.5 rounded-full border border-neutral-300 bg-white/80 hover:bg-white text-neutral-800 text-xs font-mono font-semibold transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                >
                  VIEW SELECTED WORKS
                </button>
              </div>
            </div>

            {/* Right Column: Interactive 3D Lanyard */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <Lanyard
                name="FAHED"
                role="SOFTWARE ENGINEER // ASTRONOMY ENTHUSIAST"
                status="ACTIVE IN ORBIT"
                theme="light"
              />
            </div>
          </div>

          {/* Bottom Tech Logo Loop */}
          <div className="mt-8">
            <LogoLoop theme="light" />
          </div>
        </GradualBlur>

        {/* 
          ─────────────────────────────────────────────────────────────────────
          ACT 1: THE BLACK HOLE & FABRIC OF CODE (Noir // #000000)
          ─────────────────────────────────────────────────────────────────────
        */}
        <GradualBlur
          visibleProgress={getSectionVisibility(1)}
          className="absolute max-w-5xl w-full flex flex-col text-white"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono mb-3 backdrop-blur-md self-start">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACT 01 // INTERSTELLAR COMPUTATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight mb-3">
            Inside the Singularity:{" "}
            <span className="text-electric-yellow glow-yellow font-editorial italic font-normal">
              The Fabric of Code.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed mb-6 font-light">
            Like Cooper navigating the Tesseract in <em>Interstellar</em>, software engineering is
            the craft of manipulating the foundational fabric of information. Inside the black hole,
            code galaxies compile into physical reality.
          </p>

          {/* 3 Border Glow Experience Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <BorderGlowCard>
              <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-3 text-yellow-400">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold mb-1 text-white font-display">
                Modern Frontend &amp; Web Systems
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light mb-3">
                Next.js 16, React 19, TypeScript, Turbopack, and sub-second Core Web Vitals.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-400">
                  Next.js 16
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-400">
                  React 19
                </span>
              </div>
            </BorderGlowCard>

            <BorderGlowCard>
              <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-3 text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold mb-1 text-white font-display">
                60 FPS Canvas &amp; 3D Shaders
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light mb-3">
                WebGL, Three.js, requestVideoFrameCallback, and custom GLSL relativistic shaders.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-400">
                  HTML5 Canvas
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-400">
                  GLSL
                </span>
              </div>
            </BorderGlowCard>

            <BorderGlowCard>
              <div className="w-9 h-9 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center mb-3 text-purple-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold mb-1 text-white font-display">
                Physical Rigor &amp; Astronomy
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light mb-3">
                Applying astrophysical discipline, boxing endurance, and clean systems thinking.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-400">
                  Astrophysics
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-400">
                  Resilience
                </span>
              </div>
            </BorderGlowCard>
          </div>

          {/* Interactive Easter Egg Decoder Component */}
          <EasterEggDecoder />
        </GradualBlur>

        {/* 
          ─────────────────────────────────────────────────────────────────────
          ACT 2: COMPILED REALITY & PROJECTS (Gallery White // #F8F9FA)
          ─────────────────────────────────────────────────────────────────────
        */}
        <GradualBlur
          visibleProgress={getSectionVisibility(2)}
          className="absolute max-w-5xl w-full flex flex-col text-neutral-900"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-mono mb-3 backdrop-blur-md self-start">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>ACT 02 // COMPILED WORKS &amp; DEMOS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight mb-2">
            Featured Inventions &amp;{" "}
            <span className="font-editorial italic text-amber-800 font-normal">
              Recorded Walkthroughs.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed mb-6 font-light">
            Each project is built from scratch with production-grade engineering, performance benchmarks,
            and interactive video walkthroughs.
          </p>

          {/* 3D Depth Carousel with Embedded YouTube Video Player Modals */}
          <DepthCarousel />
        </GradualBlur>

        {/* 
          ─────────────────────────────────────────────────────────────────────
          ACT 3: THE COSMIC RADIO TRANSMISSION (Void Noir // #000000)
          ─────────────────────────────────────────────────────────────────────
        */}
        <GradualBlur
          visibleProgress={getSectionVisibility(3)}
          className="absolute max-w-4xl w-full flex flex-col text-white"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono mb-3 backdrop-blur-md self-center">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ACT 03 // DEEP SPACE RADIO BROADCAST</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight text-center mb-3">
            Transmit a Signal to{" "}
            <span className="text-electric-yellow glow-yellow font-editorial italic font-normal">
              Earth Orbit.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 text-center max-w-lg mx-auto leading-relaxed mb-6 font-light font-mono">
            A satellite dish pointed at the stars, transforming radio signals into Git commits.
            Send a message to initiate a collaboration.
          </p>

          {/* Interactive Cosmic Radio Transmission Form */}
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
