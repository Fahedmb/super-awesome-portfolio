"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

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
  onProgressUpdate?: (data: {
    progress: number;
    currentFrame: number;
    totalFrames: number;
    currentScene: string;
    sceneProgress: number;
  }) => void;
}

// Tier selection — runs once at load time
function selectTier(manifest: VideoManifest): string {
  if (typeof window === "undefined") return "1080p"; // Fallback for SSR

  const effectiveWidth = window.innerWidth * (window.devicePixelRatio || 1);
  const tierEntries = Object.entries(manifest.tiers).sort(
    ([, a], [, b]) => a.maxEffectiveWidth - b.maxEffectiveWidth
  );

  for (const [tierName, tierInfo] of tierEntries) {
    if (effectiveWidth <= tierInfo.maxEffectiveWidth) {
      return tierName;
    }
  }
  return tierEntries[tierEntries.length - 1][0];
}

export default function ScrollCanvas({ onProgressUpdate }: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null); // Cache context!
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
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
    // Get or create the context ONCE
    if (!ctxRef.current && canvas) {
      ctxRef.current = canvas.getContext("2d", { alpha: false });
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
    ctxRef.current = canvas.getContext("2d", { alpha: false });
    // Re-render current frame
    const video = videosRef.current[activeSceneRef.current];
    if (video && video.readyState >= 2) {
      renderVideoFrame(video);
    }
  }, [renderVideoFrame]);

  // CORE: Scroll handler → video.currentTime seeking
  const handleScroll = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    rafIdRef.current = requestAnimationFrame(() => {
      const manifest = manifestRef.current;
      if (!manifest) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const vh = window.innerHeight;
      const totalScrollHeight = vh * 3; // 4 sections = 3vh of scroll range

      // Determine which scene and progress within it
      // Section 0 (0.0): Scene 1 frame 0
      // Section 1 (1.0): Scene 1 last frame (completed transition)
      // Section 2 (2.0): Scene 2 last frame (completed transition)
      // Section 3 (3.0): Scene 3 last frame (completed transition)
      const scrollRatio = Math.max(0, Math.min(1, scrollTop / totalScrollHeight));
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

      // Calculate target time within the video (clamped ~1 frame before duration to prevent video ended stalls)
      const targetTime =
        sectionProgress >= 1.0
          ? Math.max(0, scene.duration - 0.033)
          : sectionProgress * scene.duration;
      const video = videosRef.current[sceneKey];

      if (!video || video.readyState < 2) return;

      // Switch active scene if needed
      if (activeSceneRef.current !== sceneKey) {
        activeSceneRef.current = sceneKey;
      }

      // Smooth seek dispatch with pending queue
      if (Math.abs(video.currentTime - targetTime) > 0.001) {
        if (video.seeking) {
          pendingSeekRef.current[sceneKey] = targetTime;
        } else {
          video.currentTime = targetTime;
          pendingSeekRef.current[sceneKey] = null;
        }
      }

      // Calculate frame number for the HUD
      const globalFrameOffset = sceneKeys.slice(0, sectionIndex).reduce((sum, key) => {
        return sum + (manifest.scenes[key]?.frameCount || 0);
      }, 0);
      const localFrame = Math.round(sectionProgress * (scene.frameCount - 1));
      const globalFrame = globalFrameOffset + localFrame;

      currentFrameRef.current = globalFrame;

      // Fire the progress callback (throttled via rAF already)
      onProgressUpdate?.({
        progress: scrollRatio,
        currentFrame: globalFrame,
        totalFrames: manifest.totalFrames,
        currentScene: sceneKey,
        sceneProgress: sectionProgress,
      });
    });
  }, [onProgressUpdate, renderVideoFrame]);

  // Load videos on mount
  useEffect(() => {
    let isCancelled = false;

    async function initVideos() {
      // 1. Fetch manifest
      const res = await fetch("/videos/manifest.json");
      if (!res.ok) throw new Error("Failed to load video manifest");
      const manifest: VideoManifest = await res.json();
      if (isCancelled) return;
      manifestRef.current = manifest;

      // 2. Select resolution tier based on screen size
      const tier = selectTier(manifest);
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

          // Keep in DOM but invisible (display:none prevents decoding!)
          video.style.position = "fixed";
          video.style.top = "-9999px";
          video.style.left = "-9999px";
          video.style.width = "1px";
          video.style.height = "1px";
          video.style.opacity = "0";
          video.style.pointerEvents = "none";
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
            if ("requestVideoFrameCallback" in video) {
              const onVideoFrame = () => {
                if (isCancelled) return;
                if (activeSceneRef.current === sceneKey) {
                  renderVideoFrame(video);
                }
                (video as any).requestVideoFrameCallback(onVideoFrame);
              };
              (video as any).requestVideoFrameCallback(onVideoFrame);
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
  }, [renderVideoFrame]);

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

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 text-white transition-opacity duration-700 ease-out ${
          isLoaded
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        <div className="relative flex flex-col items-center max-w-md px-6 text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-cyan-400 border-b-purple-500 border-l-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-cyan-400 font-bold">
              {loadProgress}%
            </div>
          </div>

          <h2 className="text-xl font-extrabold tracking-wider text-neutral-100 uppercase mb-2">
            Loading Video Scenes
          </h2>
          <p className="text-xs font-mono text-neutral-400 mb-6">
            Streaming at {selectedTier || "Detecting..."}
          </p>

          <div className="w-full h-2 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-150"
              style={{ width: `${loadProgress}%` }}
            />
          </div>

          <p className="text-[11px] text-neutral-500 italic">
            Please wait while {manifestRef.current?.totalFrames || 1194} high-definition frames are loaded for zero-latency seeking.
          </p>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10 bg-neutral-950 transition-opacity duration-500"
        style={{
          opacity: isLoaded ? 1 : 0,
          willChange: "transform"
        }}
      />
    </>
  );
}
