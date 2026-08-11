"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import ScrollCanvas from "@/components/ScrollCanvas";

export default function Home() {
  const isAnimating = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const scrollToSection = useCallback((index: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const targetY = index * window.innerHeight;
    const startY = window.scrollY;
    const change = targetY - startY;
    const startTime = performance.now();
    const duration = 3500; // 3.5 seconds — fast enough to feel responsive, slow enough to see the scene

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Near-linear easing: 5% ease-in, 90% linear, 5% ease-out
      // This preserves constant video playback speed matching the original scenes
      const nearLinearEase = (t: number): number => {
        if (t < 0.05) {
          const p = t / 0.05;
          return 0.05 * (p * p);
        } else if (t > 0.95) {
          const p = (t - 0.95) / 0.05;
          return 0.95 + 0.05 * (1 - (1 - p) * (1 - p));
        } else {
          return t;
        }
      };

      const ease = nearLinearEase(progress);

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
      // Progress data available here for future UI components
    },
    []
  );

  return (
    <main className="relative text-white min-h-screen font-sans">
      {/* Dynamic Canvas Background Component */}
      <ScrollCanvas onProgressUpdate={handleProgressUpdate} />

      {/* 
        SNAP SCROLL SECTIONS 
        These empty sections provide the scroll height (300vh total) 
        and snap points for the video engine.
      */}
      <div className="relative z-10 w-full pointer-events-none">
        {/* SECTION 1 */}
        <section className="h-screen w-full"></section>

        {/* SECTION 2 */}
        <section className="h-screen w-full"></section>

        {/* SECTION 3 */}
        <section className="h-screen w-full"></section>

        {/* SECTION 4 (Final Checkpoint) */}
        <section className="h-screen w-full"></section>
      </div>
    </main>
  );
}
