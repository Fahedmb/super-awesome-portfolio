"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Monitor, Cpu, Sparkles } from "lucide-react";
import { detectDevice, DeviceInfo } from "@/lib/device";

// Types
interface TierInfo {
  width: number;
  height: number;
  maxEffectiveWidth: number;
}

interface SceneInfo {
  duration: number;
  fps: number;
  frameCount: number;
  sources: Record<string, string>;
}

interface VideoManifest {
  tiers: Record<string, TierInfo>;
  scenes: Record<string, SceneInfo>;
  totalFrames: number;
  totalDuration: number;
  fps: number;
}

interface ScrollCanvasProps {
  activeSection?: number;
  onProgressUpdate?: (data: {
    progress: number;
    currentFrame: number;
    totalFrames: number;
    currentScene: string;
    sceneProgress: number;
  }) => void;
}

// Tier selection based on effective display width:
// - 720p / Mobile displays (<= 1280px): use "480p"
// - 1080p displays (1281px - 1920px): use "720p"
// - 2K displays (1921px - 2560px) & 4K+: use "1080p"
function selectTier(): string {
  if (typeof window === "undefined") return "720p";

  const effectiveWidth = window.innerWidth * (window.devicePixelRatio || 1);
  if (effectiveWidth <= 1280) {
    return "480p";
  } else if (effectiveWidth <= 1920) {
    return "720p";
  } else {
    return "1080p";
  }
}

export default function ScrollCanvas({
  activeSection = 0,
  onProgressUpdate,
}: ScrollCanvasProps) {
  const [deviceInfo] = useState<DeviceInfo>(() => detectDevice());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null); // Cache context!
  const [isLoaded, setIsLoaded] = useState(() => detectDevice().isMobile);
  const [loadProgress, setLoadProgress] = useState(() => (detectDevice().isMobile ? 100 : 0));
  const [showLoader, setShowLoader] = useState(() => !detectDevice().isMobile);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShowLoader(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const [selectedTier, setSelectedTier] = useState<string>("");

  // Video refs - one <video> per scene
  const videosRef = useRef<Record<string, HTMLVideoElement>>({});
  const pendingSeekRef = useRef<Record<string, number | null>>({});
  const manifestRef = useRef<VideoManifest | null>(null);
  const activeSceneRef = useRef<string>("scene_1");
  const currentFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const renderVideoFrame = useCallback((video: HTMLVideoElement) => {
    const canvas = canvasRef.current;
    // Get or create the context ONCE with high quality smoothing and low-latency desynchronized pipeline
    if (!ctxRef.current && canvas) {
      const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }
      ctxRef.current = ctx;
    }
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const vidW = video.videoWidth;
    const vidH = video.videoHeight;

    if (!vidW || !vidH) return;

    // Cover-fit math
    const scale = Math.max(canvasW / vidW, canvasH / vidH);
    const drawW = vidW * scale;
    const drawH = vidH * scale;
    const x = (canvasW - drawW) / 2;
    const y = (canvasH - drawH) / 2;

    ctx.drawImage(video, x, y, drawW, drawH);
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    // Re-cache context after resize (canvas reset clears it)
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }
    ctxRef.current = ctx;
    // Re-render current frame
    const video = videosRef.current[activeSceneRef.current];
    if (video && video.readyState >= 2) {
      renderVideoFrame(video);
    }
  }, [renderVideoFrame]);

  // Apply a specific progress ratio to video seeking & telemetry
  const applyProgress = useCallback(
    (scrollRatio: number) => {
      const manifest = manifestRef.current;
      if (!manifest) {
        onProgressUpdate?.({
          progress: scrollRatio,
          currentFrame: Math.round(scrollRatio * 1194),
          totalFrames: 1194,
          currentScene: "scene_1",
          sceneProgress: scrollRatio,
        });
        return;
      }

      const sectionFloat = scrollRatio * 3; // 0.0 to 3.0

      let sectionIndex = 0;
      let sectionProgress = 0;

      if (sectionFloat <= 1.0) {
        sectionIndex = 0;
        sectionProgress = sectionFloat;
      } else if (sectionFloat <= 2.0) {
        sectionIndex = 1;
        sectionProgress = sectionFloat - 1.0;
      } else {
        sectionIndex = 2;
        sectionProgress = Math.min(1.0, sectionFloat - 2.0);
      }

      const sceneKeys = ["scene_1", "scene_2", "scene_3"];
      const sceneKey = sceneKeys[sectionIndex];
      const scene = manifest.scenes[sceneKey];

      if (!scene) return;

      const targetTime =
        sectionProgress >= 1.0
          ? Math.max(0, scene.duration - 0.033)
          : sectionProgress * scene.duration;
      const video = videosRef.current[sceneKey];

      if (!video || video.readyState < 2) return;

      // Switch active scene if needed
      if (activeSceneRef.current !== sceneKey) {
        activeSceneRef.current = sceneKey;
        renderVideoFrame(video);
      }

      // Non-blocking single-stream seek dispatch for 60fps All-Intra video
      if (Math.abs(video.currentTime - targetTime) > 0.002) {
        if (video.seeking) {
          pendingSeekRef.current[sceneKey] = targetTime;
        } else {
          video.currentTime = targetTime;
          pendingSeekRef.current[sceneKey] = null;
        }
      }

      // Draw current video frame directly on active canvas
      renderVideoFrame(video);

      // Calculate frame number for the HUD
      const globalFrameOffset = sceneKeys.slice(0, sectionIndex).reduce((sum, key) => {
        return sum + (manifest.scenes[key]?.frameCount || 0);
      }, 0);
      const localFrame = Math.round(sectionProgress * (scene.frameCount - 1));
      const globalFrame = globalFrameOffset + localFrame;

      currentFrameRef.current = globalFrame;

      // Fire the progress callback
      onProgressUpdate?.({
        progress: scrollRatio,
        currentFrame: globalFrame,
        totalFrames: manifest.totalFrames,
        currentScene: sceneKey,
        sceneProgress: sectionProgress,
      });
    },
    [onProgressUpdate, renderVideoFrame]
  );

  // CORE: Direct 1:1 scroll handler with zero gradual speed lag
  const handleScroll = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    rafIdRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const vh = window.innerHeight;
      const totalScrollHeight = vh * 3; // 4 sections = 3vh of scroll range
      const scrollRatio = Math.max(0, Math.min(1, scrollTop / totalScrollHeight));

      applyProgress(scrollRatio);
    });
  }, [applyProgress]);

  // Load videos on mount
  useEffect(() => {
    let isCancelled = false;

    // Mobile Device Check: Skip video fetching, decoding, and DOM elements entirely!
    if (deviceInfo.isMobile) {
      return;
    }

    async function initVideos() {
      // 1. Fetch manifest
      const res = await fetch("/videos/manifest.json");
      if (!res.ok) throw new Error("Failed to load video manifest");
      const manifest: VideoManifest = await res.json();
      if (isCancelled) return;
      manifestRef.current = manifest;

      // 2. Select resolution tier based on screen size
      const tier = selectTier();
      setSelectedTier(tier);
      console.log(
        `[ScrollCanvas] Selected tier: ${tier} (effective width: ${
          window.innerWidth * (window.devicePixelRatio || 1)
        }px)`
      );

      // 3. Create <video> elements for each scene using the selected tier's sources
      const sceneKeys = Object.keys(manifest.scenes).sort();
      let loadedCount = 0;
      const totalScenes = sceneKeys.length;

      const loadPromises = sceneKeys.map((sceneKey) => {
        return new Promise<void>((resolve) => {
          const scene = manifest.scenes[sceneKey];
          const videoSrc = scene.sources[tier]; // ← Use tiered source!

          const video = document.createElement("video");
          video.src = videoSrc;
          video.muted = true;
          video.playsInline = true;
          video.preload = "auto";
          video.crossOrigin = "anonymous";
          video.pause();

          // Keep in active DOM viewport with max GPU decoder priority (prevents Chromium background throttling)
          video.style.position = "fixed";
          video.style.top = "-9999px";
          video.style.left = "0";
          video.style.width = "1px";
          video.style.height = "1px";
          video.style.opacity = "0";
          video.style.pointerEvents = "none";
          video.style.zIndex = "-9999";
          document.body.appendChild(video);

          videosRef.current[sceneKey] = video;

          // Track loading progress via buffered ranges
          const onProgress = () => {
            if (isCancelled) return;
            if (video.buffered.length > 0) {
              const bufferedEnd = video.buffered.end(video.buffered.length - 1);
              const sceneProgress = Math.min(1, bufferedEnd / scene.duration);
              const overallProgress =
                ((loadedCount + sceneProgress) / totalScenes) * 100;
              setLoadProgress(Math.round(overallProgress));
            }
          };
          video.addEventListener("progress", onProgress);

          // Resolve when video has enough data to seek
          const onCanPlay = () => {
            if (isCancelled) return;
            video.removeEventListener("canplaythrough", onCanPlay);
            video.removeEventListener("progress", onProgress);
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / totalScenes) * 100));

            // Setup the seeked listener for canvas drawing
            video.addEventListener("seeked", () => {
              if (activeSceneRef.current === sceneKey) {
                renderVideoFrame(video);
              }
              // Flush any pending target time that was queued during seeking
              const pendingTime = pendingSeekRef.current[sceneKey];
              if (pendingTime !== null && pendingTime !== undefined && Math.abs(video.currentTime - pendingTime) > 0.001) {
                pendingSeekRef.current[sceneKey] = null;
                video.currentTime = pendingTime;
              }
            });

            // Use requestVideoFrameCallback if available for smoother rendering
            const videoWithRvfc = video as HTMLVideoElement & {
              requestVideoFrameCallback?: (callback: () => void) => number;
            };
            if (typeof videoWithRvfc.requestVideoFrameCallback === "function") {
              const onVideoFrame = () => {
                if (isCancelled) return;
                if (activeSceneRef.current === sceneKey) {
                  renderVideoFrame(video);
                }
                videoWithRvfc.requestVideoFrameCallback?.(onVideoFrame);
              };
              videoWithRvfc.requestVideoFrameCallback(onVideoFrame);
            }

            resolve();
          };
          video.addEventListener("canplaythrough", onCanPlay);

          // Fallback timeout (15s)
          setTimeout(() => {
            if (loadedCount < totalScenes) {
              video.removeEventListener("canplaythrough", onCanPlay);
              video.removeEventListener("progress", onProgress);
              loadedCount++;
              setLoadProgress(Math.round((loadedCount / totalScenes) * 100));
              video.addEventListener("seeked", () => {
                if (activeSceneRef.current === sceneKey) {
                  renderVideoFrame(video);
                }
              });
              resolve();
            }
          }, 15000);
        });
      });

      await Promise.all(loadPromises);
      if (isCancelled) return;

      setIsLoaded(true);

      // Render first frame of scene_1
      const firstVideo = videosRef.current["scene_1"];
      if (firstVideo) {
        firstVideo.currentTime = 0;
      }
    }

    initVideos().catch(console.error);

    return () => {
      isCancelled = true;
      Object.values(videosRef.current).forEach((video) => {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.parentNode?.removeChild(video);
      });
      videosRef.current = {};
    };
  }, [renderVideoFrame, deviceInfo.isMobile]);

  // Setup scroll + resize listeners (after loaded)
  useEffect(() => {
    if (!isLoaded) return;

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial render

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isLoaded, handleResize, handleScroll]);

  if (deviceInfo.isMobile) {
    const isLight = activeSection === 0 || activeSection === 2;
    return (
      <div
        className={`fixed inset-0 w-full h-full -z-10 transition-colors duration-700 ease-in-out pointer-events-none ${
          isLight ? "bg-[#ffffff]" : "bg-[#0a0a0c]"
        }`}
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      {/* ------------------------------------------------------------------- */}
      {/* HIGH-TECH COSMIC TELEMETRY INITIALIZER & DISPLAY RECOGNITION LOADER */}
      {/* ------------------------------------------------------------------- */}
      {showLoader && (
      <div
        className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-neutral-950/98 backdrop-blur-3xl text-white transition-all duration-700 ease-out ${
          isLoaded
            ? "opacity-0 pointer-events-none scale-105"
            : "opacity-100 pointer-events-auto scale-100"
        }`}
      >
        {/* Subtle Cosmic Amber Radial Glow in Background */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none -z-10" />

        {/* Central HUD Card with Cybernetic Gold Brackets */}
        <div className="relative w-full max-w-md mx-4 p-6 sm:p-8 rounded-3xl bg-neutral-900/80 border border-yellow-400/30 backdrop-blur-2xl shadow-2xl shadow-yellow-500/10 flex flex-col items-center text-center overflow-hidden">
          {/* Cybernetic HUD Corner Accents */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-yellow-400 pointer-events-none opacity-80" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-yellow-400 pointer-events-none opacity-80" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-yellow-400 pointer-events-none opacity-80" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-yellow-400 pointer-events-none opacity-80" />

          {/* Top Status Telemetry Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/25 text-yellow-300 text-[10px] font-mono tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>INITIALIZING HARDWARE CANVAS</span>
          </div>

          {/* High-Tech Orbital Indicator */}
          <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
            {/* Ambient Pulse Ring */}
            <div className="absolute inset-0 rounded-full border border-yellow-400/15 animate-pulse [animation-duration:3s]" />
            {/* Outer Dashed Orbit */}
            <div className="absolute inset-0 rounded-full border border-dashed border-yellow-400/30 animate-spin [animation-duration:14s]" />
            {/* Inner High-Speed Accent Arc */}
            <div className="absolute inset-2 rounded-full border-2 border-t-yellow-400 border-r-amber-500 border-b-transparent border-l-transparent animate-spin [animation-duration:1.6s]" />
            {/* Center Percentage Display */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-black text-electric-yellow tracking-tight glow-yellow">
                {loadProgress}%
              </span>
              <span className="text-[9px] font-mono text-neutral-400 tracking-wider">SYNCING</span>
            </div>
          </div>

          {/* Title & Stream Identification */}
          <h2 className="text-base sm:text-lg font-bold font-display text-white tracking-tight mb-1">
            FAHED MBAREK <span className="font-editorial italic font-normal text-amber-400 text-sm sm:text-base">{"// SYSTEMS"}</span>
          </h2>
          <p className="text-[11px] font-mono text-neutral-400 mb-5">
            Loading Video-Synchronized Interactive Architecture
          </p>

          {/* Hardware & Display Recognition Telemetry Badges */}
          <div className="w-full grid grid-cols-2 gap-2 mb-5 text-left">
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-yellow-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] font-mono text-neutral-400 leading-none mb-1">SYSTEM ARCHITECTURE</div>
                <div className="text-[10px] font-mono font-bold text-white truncate">
                  {deviceInfo.osName.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] font-mono text-neutral-400 leading-none mb-1">DECODER PIPELINE</div>
                <div className="text-[10px] font-mono font-bold text-yellow-300 truncate">
                  {selectedTier ? `${selectedTier.toUpperCase()} // 60FPS` : "INITIALIZING..."}
                </div>
              </div>
            </div>
          </div>

          {/* Glowing Golden Amber Progress Bar */}
          <div className="w-full h-1.5 bg-neutral-950 border border-yellow-400/20 rounded-full overflow-hidden mb-3.5 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 rounded-full shadow-lg shadow-yellow-500/50 transition-all duration-200"
              style={{ width: `${Math.max(4, loadProgress)}%` }}
            />
          </div>

          {/* Micro Telemetry Footer */}
          <div className="flex items-center justify-between w-full text-[10px] font-mono text-neutral-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>1,194 Frames Pre-Warmed</span>
            </span>
            <span className="text-yellow-400/80 font-bold">READY TO SCROLL</span>
          </div>
        </div>
      </div>
      )}

      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10 bg-neutral-950 transition-opacity duration-500"
        style={{
          opacity: isLoaded ? 1 : 0,
        }}
      />
    </>
  );
}
