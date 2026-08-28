"use client";

import React, { useState, useEffect } from "react";
import { Compass, Layers, Sparkles, ChevronRight, ChevronLeft, Check, X } from "lucide-react";

interface GuidedTourProps {
  onNavigateToSection?: (sectionIndex: number) => void;
  isMobile?: boolean;
}

export default function GuidedTour({
  onNavigateToSection,
  isMobile = false,
}: GuidedTourProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      id: "navigation",
      icon: Compass,
      badge: "STEP 1 OF 3 // NAVIGATION",
      title: "How to Travel Across Sectors",
      description: isMobile
        ? "Double-swipe up/down or tap the sector buttons at the bottom to travel between Origin, About Me, Works, and Contact."
        : "Navigate seamlessly between 4 sectors: 00 Origin, 01 About Me, 02 Works, and 03 Contact using the top header pill, arrow keys, or bottom travel bar.",
      actionLabel: "Next: Intel Tabs",
    },
    {
      id: "interactive-tabs",
      icon: Layers,
      badge: "STEP 2 OF 3 // INTERACTIVITY",
      title: "Interactive Tabs & FAQ",
      description: isMobile
        ? "Swipe tab bars horizontally to browse Architecture, Academic Roadmap, Hobbies, FAQ & Channels. Tap any card to reveal details."
        : "Explore rich tabs inside each sector. Hover or click cards to declassify FAQ answers, engineering philosophies, and project walkthroughs.",
      actionLabel: "Next: Modes",
    },
    {
      id: "modes",
      icon: Sparkles,
      badge: "STEP 3 OF 3 // EXPERIENCE MODES",
      title: "Simple & 3D Video Modes",
      description: isMobile
        ? "Your mobile device is running in optimized Fast Mode. You can download the official CV or send a direct transmission anytime!"
        : "Switch between lightning-fast Simple Mode and Cinematic 3D Video Mode anytime using the toggle button in the top-right header.",
      actionLabel: "Got It, Let's Explore!",
    },
  ];

  // Auto-trigger after 3 seconds of landing if not previously completed
  useEffect(() => {
    try {
      const alreadyDone = localStorage.getItem("portfolio_guided_tour_done");
      if (alreadyDone === "true") return;
    } catch {}

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Listen for custom event to re-open tour manually anytime
  useEffect(() => {
    const handleReopen = () => {
      setCurrentStep(0);
      setIsVisible(true);
    };

    window.addEventListener("open-portfolio-tour", handleReopen);
    return () => window.removeEventListener("open-portfolio-tour", handleReopen);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem("portfolio_guided_tour_done", "true");
    } catch {}
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!isVisible) return null;

  const current = steps[currentStep];
  const Icon = current.icon;

  return (
    <div
      role="dialog"
      aria-label="Portfolio Guide"
      className="fixed bottom-16 sm:bottom-20 right-3 sm:right-6 left-3 sm:left-auto z-[9999] max-w-sm sm:max-w-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#0a0a0c]/95 border border-yellow-400/40 text-white shadow-2xl backdrop-blur-2xl animate-section-entrance transition-all duration-300 pointer-events-auto"
    >
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Header with Step Indicator and Close */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[9px] sm:text-[10px] font-mono font-bold">
          <Icon className="w-3 h-3 text-yellow-400" />
          <span>{current.badge}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress Dots */}
          <div className="flex items-center gap-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  idx === currentStep
                    ? "w-4 bg-yellow-400"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleDismiss}
            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Dismiss Tutorial"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="space-y-1.5 mb-4">
        <h3 className="text-sm sm:text-base font-bold font-display text-white tracking-tight flex items-center gap-1.5">
          {current.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed font-light font-sans">
          {current.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
        <button
          onClick={handleDismiss}
          className="text-[10px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer px-2 py-1"
        >
          Skip Tutorial
        </button>

        <div className="flex items-center gap-1.5">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Previous Step"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFD600] hover:bg-yellow-300 text-black text-[11px] font-mono font-extrabold tracking-wider transition-all active:scale-95 shadow-md shadow-yellow-400/25 flex items-center gap-1 cursor-pointer"
          >
            <span>{current.actionLabel}</span>
            {currentStep === steps.length - 1 ? (
              <Check className="w-3.5 h-3.5 text-black font-extrabold" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-black font-extrabold" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
