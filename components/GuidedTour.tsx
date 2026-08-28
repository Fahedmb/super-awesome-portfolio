"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, FileDown, Layers, ArrowDown, ChevronRight, X, Check } from "lucide-react";

interface TourStep {
  targetId: string;
  fallbackTargetId?: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  placement?: "bottom" | "top";
}

interface GuidedTourProps {
  onNavigateToSection?: (sectionIndex: number) => void;
  isMobile?: boolean;
}

export default function GuidedTour({
  onNavigateToSection,
  isMobile = false,
}: GuidedTourProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const steps: TourStep[] = [
    {
      targetId: isMobile ? "tour-works-hero-btn" : "tour-works-btn",
      fallbackTargetId: "tour-works-hero-btn",
      title: "Section 02: Enterprise Works & Demos",
      description: "Click here to jump directly to Section 02 to watch recorded video demos and explore full enterprise projects.",
      icon: Layers,
      placement: "bottom",
    },
    {
      targetId: isMobile ? "tour-cv-hero-btn" : "tour-cv-btn",
      fallbackTargetId: "tour-cv-hero-btn",
      title: "Download CV & Credentials",
      description: "Click here to inspect and download Fahed's official Resume and Motivation Letter in English or French.",
      icon: FileDown,
      placement: "bottom",
    },
    {
      targetId: "tour-3d-btn",
      fallbackTargetId: "tour-works-hero-btn",
      title: "Simple & 3D Video Experience",
      description: isMobile
        ? "Mobile devices run in ultra-fast Simple Mode. You can navigate effortlessly across all sectors."
        : "Toggle between ultra-fast Simple Mode and Cinematic 3D Video Mode anytime.",
      icon: Sparkles,
      placement: "bottom",
    },
    {
      targetId: "tour-next-btn",
      fallbackTargetId: "tour-works-hero-btn",
      title: "Travel to the Next Sector",
      description: isMobile
        ? "Double-swipe down or tap the sector bar to advance to the next sector."
        : "Click this travel bar or scroll down with your mouse to journey through all 4 sectors.",
      icon: ArrowDown,
      placement: "top",
    },
  ];

  // Trigger after 3 seconds of landing if not completed before
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

  // Update target rect position whenever currentStepIndex changes, or on resize/scroll
  const updateTargetRect = useCallback(() => {
    if (!isVisible) return;
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    let el = document.getElementById(currentStep.targetId);
    if (!el && currentStep.fallbackTargetId) {
      el = document.getElementById(currentStep.fallbackTargetId);
    }

    if (el) {
      const rect = el.getBoundingClientRect();
      // Ensure element is visible on screen
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect(rect);
        return;
      }
    }
    // Fallback if target element is hidden (e.g. desktop navbar on mobile)
    setTargetRect(null);
  }, [isVisible, currentStepIndex, steps]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect);
    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
    };
  }, [updateTargetRect]);

  // Listen for custom event to trigger tour manually
  useEffect(() => {
    const handleReopen = () => {
      setCurrentStepIndex(0);
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
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  };

  if (!isVisible) return null;

  const current = steps[currentStepIndex];
  const Icon = current.icon;

  // Calculate tooltip coordinates based on targetRect
  let tooltipStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 99999,
  };

  let arrowPlacement: "top" | "bottom" = "top";
  let arrowLeftPercent = 50;

  const tooltipWidth = typeof window !== "undefined" ? Math.min(340, window.innerWidth - 32) : 320;

  if (targetRect) {
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;

    let left = targetCenterX - tooltipWidth / 2;
    // Keep within viewport boundaries with 16px padding
    left = Math.max(16, Math.min(left, windowWidth - tooltipWidth - 16));

    // Calculate where arrow should point along the tooltip's top/bottom edge
    arrowLeftPercent = Math.max(15, Math.min(85, ((targetCenterX - left) / tooltipWidth) * 100));

    // Decide if tooltip should appear below or above target
    if (current.placement === "top" || targetRect.bottom + 160 > windowHeight) {
      // Position above target
      arrowPlacement = "bottom";
      tooltipStyle = {
        position: "fixed",
        top: Math.max(16, targetRect.top - 140),
        left: `${left}px`,
        width: `${tooltipWidth}px`,
        zIndex: 99999,
      };
    } else {
      // Position below target
      arrowPlacement = "top";
      tooltipStyle = {
        position: "fixed",
        top: Math.min(windowHeight - 150, targetRect.bottom + 12),
        left: `${left}px`,
        width: `${tooltipWidth}px`,
        zIndex: 99999,
      };
    }
  } else {
    // Centered fallback if target is not currently found
    tooltipStyle = {
      position: "fixed",
      bottom: "5rem",
      left: "50%",
      transform: "translateX(-50%)",
      width: `${tooltipWidth}px`,
      zIndex: 99999,
    };
  }

  return (
    <>
      {/* Target Element Highlight Beacon Ring */}
      {targetRect && (
        <div
          style={{
            position: "fixed",
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            borderRadius: "9999px",
            zIndex: 99998,
            pointerEvents: "none",
          }}
          className="border-2 border-yellow-400 animate-pulse shadow-[0_0_16px_rgba(255,214,0,0.8)] ring-4 ring-yellow-400/25"
        />
      )}

      {/* Contextual Floating Tooltip Card */}
      <div
        ref={tooltipRef}
        style={tooltipStyle}
        className="p-3.5 sm:p-4 rounded-2xl bg-black/95 border border-yellow-400/70 text-white shadow-2xl backdrop-blur-2xl animate-section-entrance transition-all duration-300 pointer-events-auto"
      >
        {/* Directional Arrow Pointer */}
        {targetRect && (
          <div
            style={{ left: `${arrowLeftPercent}%` }}
            className={`absolute w-3 h-3 bg-black border-yellow-400/70 transform -translate-x-1/2 rotate-45 pointer-events-none ${
              arrowPlacement === "top"
                ? "-top-1.5 border-t border-l"
                : "-bottom-1.5 border-b border-r"
            }`}
          />
        )}

        {/* Header with Step Badge and Skip Button */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[9px] sm:text-[10px] font-mono font-bold">
            <Icon className="w-3 h-3 text-yellow-400" />
            <span>STEP {currentStepIndex + 1} OF {steps.length}</span>
          </div>

          <button
            onClick={handleDismiss}
            className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 hover:text-yellow-400 transition-colors cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-white/5"
            title="Skip entire tutorial"
          >
            <span>Skip All</span>
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Tooltip Content */}
        <div className="space-y-1 mb-3">
          <h4 className="text-xs sm:text-sm font-bold font-display text-white tracking-tight flex items-center gap-1.5">
            {current.title}
          </h4>
          <p className="text-[11px] text-neutral-300 leading-relaxed font-light font-sans">
            {current.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          {/* Progress dots */}
          <div className="flex items-center gap-1">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentStepIndex
                    ? "w-3.5 bg-yellow-400"
                    : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-3 py-1 rounded-xl bg-[#FFD600] hover:bg-yellow-300 text-black text-[11px] font-mono font-extrabold tracking-wider transition-all active:scale-95 shadow-md shadow-yellow-400/25 flex items-center gap-1 cursor-pointer"
          >
            <span>{currentStepIndex === steps.length - 1 ? "Got It!" : "Next"}</span>
            {currentStepIndex === steps.length - 1 ? (
              <Check className="w-3 h-3 text-black font-extrabold" />
            ) : (
              <ChevronRight className="w-3 h-3 text-black font-extrabold" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
