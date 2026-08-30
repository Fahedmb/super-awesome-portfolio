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

  const [isClientMobile, setIsClientMobile] = useState<boolean>(isMobile);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClientMobile(isMobile || window.innerWidth < 640);
    }
  }, [isMobile]);

  const mobileSteps: TourStep[] = [
    {
      targetId: "tour-works-hero-btn",
      fallbackTargetId: "tour-works-hero-btn",
      title: "Section 02: Enterprise Works",
      description: "Tap here to jump directly to Section 02 to watch recorded video demos and explore platforms.",
      icon: Layers,
      placement: "bottom",
    },
    {
      targetId: "tour-cv-hero-btn",
      fallbackTargetId: "tour-cv-hero-btn",
      title: "Download CV & Credentials",
      description: "Tap here to inspect and download Fahed's official Resume and Motivation Letter in EN & FR.",
      icon: FileDown,
      placement: "bottom",
    },
  ];

  const desktopSteps: TourStep[] = [
    {
      targetId: "tour-works-btn",
      fallbackTargetId: "tour-works-hero-btn",
      title: "Section 02: Enterprise Works & Demos",
      description: "Click here to jump directly to Section 02 to watch recorded video demos and explore platforms.",
      icon: Layers,
      placement: "bottom",
    },
    {
      targetId: "tour-cv-btn",
      fallbackTargetId: "tour-cv-hero-btn",
      title: "Download CV & Credentials",
      description: "Click here to inspect and download Fahed's official Resume and Motivation Letter in EN & FR.",
      icon: FileDown,
      placement: "bottom",
    },
    {
      targetId: "tour-3d-btn",
      fallbackTargetId: "tour-cv-hero-btn",
      title: "Simple & 3D Experience",
      description: "Toggle between ultra-fast Simple Mode and Cinematic 3D Video Mode anytime in the header.",
      icon: Sparkles,
      placement: "bottom",
    },
    {
      targetId: "tour-next-btn",
      fallbackTargetId: "tour-telemetry-sec",
      title: "Sector Navigation",
      description: "Click this travel bar or scroll down with your mouse to journey through all 4 sectors.",
      icon: ArrowDown,
      placement: "top",
    },
  ];

  const steps = isClientMobile ? mobileSteps : desktopSteps;

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
    if ((!el || el.offsetParent === null) && currentStep.fallbackTargetId) {
      el = document.getElementById(currentStep.fallbackTargetId);
    }

    if (el && el.offsetParent !== null) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect(rect);
        return;
      }
    }
    // Fallback if target element is hidden or off-screen
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

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  };

  if (!isVisible) return null;

  const current = steps[currentStepIndex];
  const Icon = current.icon;

  // Viewport measurements
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 400;
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const isSmallScreen = windowWidth < 640;

  // Calculate tooltip coordinates based on targetRect
  let tooltipStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 99999,
  };

  let arrowPlacement: "top" | "bottom" = "top";
  let arrowLeftPercent = 50;

  if (isSmallScreen) {
    // Mobile view: Full width with 12px margin on both sides
    tooltipStyle.left = "12px";
    tooltipStyle.right = "12px";
    tooltipStyle.width = "calc(100vw - 24px)";
    tooltipStyle.maxWidth = "400px";
    tooltipStyle.margin = "0 auto";

    if (targetRect) {
      const targetCenterX = targetRect.left + targetRect.width / 2;
      arrowLeftPercent = Math.max(12, Math.min(88, (targetCenterX / windowWidth) * 100));

      // If target is in top half of screen, place tooltip below it
      if (targetRect.top < windowHeight * 0.45) {
        arrowPlacement = "top";
        tooltipStyle.top = `${Math.max(12, Math.min(targetRect.bottom + 8, windowHeight - 210))}px`;
      } else {
        // Target is in bottom half of screen, place tooltip above it
        arrowPlacement = "bottom";
        tooltipStyle.bottom = `${Math.max(12, Math.min(windowHeight - targetRect.top + 8, windowHeight - 210))}px`;
      }
    } else {
      // Centered fallback on mobile
      tooltipStyle.bottom = "72px";
      arrowPlacement = "bottom";
      arrowLeftPercent = 50;
    }
  } else {
    // Desktop view: Anchored floating card (320px width)
    const tooltipWidth = 320;
    if (targetRect) {
      const targetCenterX = targetRect.left + targetRect.width / 2;
      let left = targetCenterX - tooltipWidth / 2;
      left = Math.max(16, Math.min(left, windowWidth - tooltipWidth - 16));
      arrowLeftPercent = Math.max(15, Math.min(85, ((targetCenterX - left) / tooltipWidth) * 100));

      if (current.placement === "top" || targetRect.bottom + 170 > windowHeight) {
        arrowPlacement = "bottom";
        tooltipStyle.bottom = `${Math.max(16, windowHeight - targetRect.top + 10)}px`;
        tooltipStyle.left = `${left}px`;
        tooltipStyle.width = `${tooltipWidth}px`;
      } else {
        arrowPlacement = "top";
        tooltipStyle.top = `${Math.max(16, targetRect.bottom + 10)}px`;
        tooltipStyle.left = `${left}px`;
        tooltipStyle.width = `${tooltipWidth}px`;
      }
    } else {
      tooltipStyle.bottom = "80px";
      tooltipStyle.left = "50%";
      tooltipStyle.transform = "translateX(-50%)";
      tooltipStyle.width = `${tooltipWidth}px`;
    }
  }

  return (
    <>
      {/* Full-screen Click-to-Dismiss Transparent Backdrop */}
      <div
        onClick={handleDismiss}
        className="fixed inset-0 z-[99990] bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity duration-300"
        aria-label="Click anywhere to skip tutorial"
      />

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
            zIndex: 99995,
            pointerEvents: "none",
          }}
          className="border-2 border-yellow-400 animate-pulse shadow-[0_0_16px_rgba(255,214,0,0.8)] ring-4 ring-yellow-400/25"
        />
      )}

      {/* Contextual Floating Tooltip Card (Tapping anywhere skips tutorial) */}
      <div
        ref={tooltipRef}
        style={tooltipStyle}
        onClick={handleDismiss}
        className="p-3.5 sm:p-4 rounded-2xl bg-[#0a0a0c]/95 border border-yellow-400/80 text-white shadow-2xl backdrop-blur-2xl animate-section-entrance transition-all duration-300 pointer-events-auto cursor-pointer"
      >
        {/* Directional Arrow Pointer */}
        {targetRect && (
          <div
            style={{ left: `${arrowLeftPercent}%` }}
            className={`absolute w-3 h-3 bg-[#0a0a0c] border-yellow-400/80 transform -translate-x-1/2 rotate-45 pointer-events-none ${
              arrowPlacement === "top"
                ? "-top-1.5 border-t border-l"
                : "-bottom-1.5 border-b border-r"
            }`}
          />
        )}

        {/* Header with Step Badge, Tap-to-Skip notice, and Close button */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[9px] sm:text-[10px] font-mono font-bold">
            <Icon className="w-3 h-3 text-yellow-400" />
            <span>STEP {currentStepIndex + 1} OF {steps.length}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-neutral-400 hidden xs:inline">Tap to skip</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="flex items-center gap-0.5 text-[10px] font-mono text-neutral-400 hover:text-yellow-400 transition-colors cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-white/5"
              title="Skip entire tutorial"
            >
              <span>Skip</span>
              <X className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Tooltip Content */}
        <div className="space-y-1 mb-2.5">
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
