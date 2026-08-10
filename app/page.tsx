"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import ScrollCanvas from "@/components/ScrollCanvas";
import {
  Sparkles,
  Layers,
  Zap,
  Cpu,
  Code2,
  ArrowDown,
  Mail,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [scrollData, setScrollData] = useState({
    progress: 0,
    currentFrame: 0,
    totalFrames: 1194,
    currentScene: "scene_1",
    sceneProgress: 0,
  });

  const [contactOpen, setContactOpen] = useState(false);
  const isAnimating = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const scrollToSection = useCallback((index: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const targetY = index * window.innerHeight;
    const startY = window.scrollY;
    const change = targetY - startY;
    const startTime = performance.now();
    const duration = 5000; // Exact 5-second cinematic duration

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Custom Cinematic Easing Curve (Sinusoidal Blend)
      // We combine two sine waves to guarantee:
      // 1. Starts and ends completely smoothly (speed = 0)
      // 2. Accelerates to a fast peak
      // 3. Decelerates in the middle to a very slow (but non-zero) crawl
      // A controls the minimum speed in the middle. 0.15 means speed drops to ~30% of average.
      const A = 0.15; 
      const B = 1 - A;
      const ease = 
        progress 
        - (A * Math.sin(2 * Math.PI * progress)) / (2 * Math.PI)
        - (B * Math.sin(4 * Math.PI * progress)) / (4 * Math.PI);

      window.scrollTo(0, startY + change * ease);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        isAnimating.current = false;
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  // Custom JS Scroll Engine
  useEffect(() => {
    // 1. Wheel/Trackpad Interceptor
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      // Detect intentional scroll flick
      if (Math.abs(e.deltaY) > 15) {
        e.preventDefault();

        const currentSection = Math.round(window.scrollY / window.innerHeight);
        if (e.deltaY > 0 && currentSection < 3) {
          scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }
    };

    // 2. Scrollbar Drag Handler
    const handleScroll = () => {
      if (isAnimating.current) return;

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        // User released the scrollbar - find closest section
        const nearestSection = Math.round(window.scrollY / window.innerHeight);
        scrollToSection(nearestSection);
      }, 300); // 300ms debounce
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollToSection]);

  const handleProgressUpdate = useCallback(
    (data: {
      progress: number;
      currentFrame: number;
      totalFrames: number;
      currentScene: string;
      sceneProgress: number;
    }) => {
      setScrollData(data);
    },
    []
  );

  const sceneTitles: Record<string, { label: string; name: string }> = {
    scene_1: { label: "01", name: "VISUAL HORIZON" },
    scene_2: { label: "02", name: "CORE ENGINE" },
    scene_3: { label: "03", name: "FUTURE INTELLIGENCE" },
  };

  return (
    <main className="relative text-white min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Canvas Background Component */}
      <ScrollCanvas onProgressUpdate={handleProgressUpdate} />

      {/* Top Header & Sticky Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between glass-panel border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-neutral-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wider uppercase text-neutral-100">
              Antigravity Studio
            </h1>
            <p className="text-[11px] text-neutral-400 font-mono">
              Scroll-Linked Canvas Sequence
            </p>
          </div>
        </div>

        {/* Scene Switcher / Status Badge */}
        <div className="hidden md:flex items-center space-x-2 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-neutral-400">ACTIVE:</span>
          <span className="text-cyan-400 font-bold">
            SCENE {sceneTitles[scrollData.currentScene]?.label || "01"} —{" "}
            {sceneTitles[scrollData.currentScene]?.name || "VISUAL HORIZON"}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setContactOpen(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Lead</span>
        </button>

        {/* Top Scroll Progress Indicator */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-75"
          style={{ width: `${Math.round(scrollData.progress * 100)}%` }}
        />
      </header>

      {/* BOTTOM CONTROLS & FRAME HUD (Fixed to Screen) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-6 py-6 md:px-12 lg:px-20 flex items-end justify-between pointer-events-none">
        {/* Left: Frame Scrubber Display */}
        <div className="pointer-events-auto px-4 py-2 rounded-xl glass-panel text-xs font-mono text-neutral-300 flex items-center space-x-3 shadow-2xl">
          <span className="text-cyan-400 font-bold">FRAME:</span>
          <span className="text-white font-bold text-sm">
            {String(scrollData.currentFrame + 1).padStart(4, "0")}
          </span>
          <span className="text-neutral-500">/</span>
          <span className="text-neutral-400">
            {String(scrollData.totalFrames).padStart(4, "0")}
          </span>
        </div>

        {/* Right: Scene Navigator Pills */}
        <div className="pointer-events-auto flex items-center space-x-2 px-3 py-2 rounded-xl glass-panel text-xs font-mono">
          {["scene_1", "scene_2", "scene_3"].map((sceneKey, idx) => (
            <div
              key={sceneKey}
              className={`px-2.5 py-1 rounded-md transition-all ${
                scrollData.currentScene === sceneKey
                  ? "bg-indigo-600 text-white font-bold"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              0{idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* SNAP SCROLL SECTIONS */}
      <div className="relative z-10 w-full">
        {/* SECTION 1: Frame 0 */}
        <section className="h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-20 pointer-events-none">
          <div className="max-w-2xl pointer-events-auto transition-all duration-700">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-4">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>60 FPS H.264 Video Engine</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight glow-text">
              HIGH-PERFORMANCE <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                CANVAS ANIMATION
              </span>
            </h2>
            <p className="text-base md:text-lg text-neutral-300 mb-8 leading-relaxed">
              Experience ultra-smooth motion driven by 3 all-intra MP4 videos (1194 frames), bound to your vertical scroll with zero frame drops.
            </p>

            {/* Stat Highlights */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
              <div className="p-3.5 rounded-xl glass-card text-center">
                <div className="text-xl md:text-2xl font-bold font-mono text-cyan-400">
                  1194
                </div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider">
                  Total Frames
                </div>
              </div>
              <div className="p-3.5 rounded-xl glass-card text-center">
                <div className="text-xl md:text-2xl font-bold font-mono text-purple-400">
                  60 FPS
                </div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider">
                  Source Rate
                </div>
              </div>
              <div className="p-3.5 rounded-xl glass-card text-center">
                <div className="text-xl md:text-2xl font-bold font-mono text-emerald-400">
                  2.5x
                </div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider">
                  Pacing Boost
                </div>
              </div>
            </div>

            {/* Scroll prompt */}
            <div className="flex items-center space-x-3 text-neutral-400 text-xs font-mono">
              <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center animate-bounce">
                <ArrowDown className="w-4 h-4 text-cyan-400" />
              </div>
              <span>Scroll down to advance</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: Frame 200 */}
        <section className="h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-20 pointer-events-none">
          <div className="max-w-4xl pointer-events-auto transition-all duration-700">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scene 02: Architecture & Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight glow-cyan">
              INTELLIGENT PRELOADING PIPELINE
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl glass-card">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Stage 1: Blob Caching
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Fetches full all-intra MP4 videos dynamically and stores them as in-memory Blobs for zero-latency network hits.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Stage 2: Frame Seeking
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Maps exact viewport scroll percentage directly to video timeline, providing instantaneous scrubbing without B-frames.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Responsive Cover Scaling
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  High-DPI canvas math dynamically fits full-res source frames to screen bounds with zero distortion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Frame 390 */}
        <section className="h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-20 pointer-events-none">
          <div className="max-w-3xl pointer-events-auto transition-all duration-700">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-4">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scene 03: Production Ready</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight glow-text">
              BUILT WITH NEXT.JS 16 & TAILWIND
            </h2>
            <p className="text-sm md:text-base text-neutral-300 mb-6 leading-relaxed">
              Ready to transform interactive marketing pages, product showcases, and high-impact agency portfolios.
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "Next.js 16 (App Router)",
                "React 19",
                "Tailwind CSS v4",
                "HTML5 Canvas 2D",
                "All-Intra MP4 Decoding",
                "TypeScript",
                "requestAnimationFrame",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA Box */}
            <div className="p-6 rounded-2xl glass-panel flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">
                  Need custom canvas animations?
                </h4>
                <p className="text-xs text-neutral-400">
                  Let’s build your next award-winning web application.
                </p>
              </div>
              <button
                onClick={() => setContactOpen(true)}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 shrink-0"
              >
                Start Project
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 4: Frame 597 (Final Checkpoint) */}
        <section className="h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 lg:px-20 pointer-events-none text-center">
          <div className="max-w-2xl pointer-events-auto transition-all duration-700 glass-panel p-10 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] mx-auto mb-6">
              <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight glow-text uppercase">
              Experience Complete
            </h2>
            <p className="text-sm md:text-base text-neutral-400 mb-8 leading-relaxed max-w-md mx-auto">
              You have reached the final frame. The video buffer is fully loaded in memory, allowing instantaneous traversal backwards through the timeline.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3 rounded-xl border border-neutral-700 hover:border-cyan-500 hover:bg-cyan-500/10 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Back to Top
            </button>
          </div>
        </section>
      </div>

      {/* Contact Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel border border-neutral-800 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">
              Let's Create Together
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Get in touch for custom visual canvas development, Next.js engineering, or interactive portfolio projects.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! Message received.");
                setContactOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  PROJECT INQUIRY
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about your project timeline and visual goals..."
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setContactOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
