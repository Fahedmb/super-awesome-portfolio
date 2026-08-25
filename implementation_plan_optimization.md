# Performance Optimization: Scroll-Driven Video Canvas & Full-Site Audit

Comprehensive performance analysis and optimization plan for the Super Awesome Portfolio — targeting the **scroll-video stutter** as the primary issue and surfacing additional performance, architecture, and UX problems.

---

## Executive Summary

The portfolio uses a **scroll-synchronized video canvas** ([`ScrollCanvas.tsx`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/components/ScrollCanvas.tsx)) that seeks through 3 pre-loaded H.264 MP4 scenes as the user scrolls. The core stutter is caused by a combination of **video seeking latency**, **excessive bitrate**, **missing faststart atoms**, **reactive re-renders flooding the scroll path**, and **backdrop-blur compositing costs**. Beyond the video, I found **11 additional issues** spanning asset weight, 3D scene lifecycle, accessibility gaps, and architectural concerns.

---

## User Review Required

> [!IMPORTANT]
> **Video re-encoding is required.** The current videos are encoded as H.264 High Profile All-Intra at ~10-18 Mbps bitrate. For random-access seeking, they need to be re-encoded with keyframe-every-frame (true All-Intra) at a **lower bitrate with `faststart`**. I'll provide the exact ffmpeg commands. This is the single biggest fix for the stutter.

> [!IMPORTANT]
> **The entire `page.tsx` is `"use client"`**, making the whole page a Client Component (35KB). This prevents any Server Component optimizations and bloats the client JS bundle. We need to split it into Server + Client islands.

> [!WARNING]
> **`fahed_badge.svg` is 2.2 MB** — this is an absurdly large SVG (likely contains embedded raster data or unoptimized paths). It adds ~2.2 MB to the initial load on desktop. It should be optimized or converted to WebP/AVIF.

---

## Open Questions

> [!IMPORTANT]
> **Q1:** Do you have the original source videos (Before Effects / Blender renders, etc.) in `raw_videos/`? If so, I can provide the exact re-encoding commands. If not, I'll re-encode from the existing MP4s (minor generation loss).

> [!IMPORTANT]  
> **Q2:** The `fahed_badge.svg` (2.2 MB) — is this an SVG with embedded raster data (base64 images)? If so, should we extract the raster and convert to WebP, or do you have a vector-only version?

> [!NOTE]
> **Q3:** Are you open to adding `prefers-reduced-motion` support that would skip the video canvas entirely and show static hero images instead? This is a significant accessibility win.

---

## Findings & Proposed Changes

### 🎬 CRITICAL: ScrollCanvas Video Stutter Fix

This is the **#1 performance issue**. Here's why the scroll-video stutters:

#### Root Causes Identified

| # | Cause | Severity | File |
|---|-------|----------|------|
| 1 | **Video bitrate is 10-18 Mbps** — browser decoder saturates on rapid seeking | 🔴 Critical | Video files |
| 2 | **No `moov` atom faststart** — seeking requires reading to end of file | 🔴 Critical | Video files |
| 3 | **`handleProgressUpdate` calls `setProgressState()` on every scroll frame** — triggers React re-render of entire page tree on every RAF | 🔴 Critical | [page.tsx](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/app/page.tsx#L228-L230) |
| 4 | **`GradualBlur` × 4 sections all recalculate `getSectionVisibility()` per render** — each computes smoothstep + inline styles | 🟡 High | [page.tsx](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/app/page.tsx#L236-L241) |
| 5 | **`backdrop-blur-3xl` on the loading overlay lingers** — after `isLoaded` becomes true, the element stays in DOM (just opacity:0) with a massive blur still composited | 🟡 High | [ScrollCanvas.tsx](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/components/ScrollCanvas.tsx#L378-L383) |
| 6 | **3 hidden `<video>` elements with `100vw × 100vh` and `opacity: 0.0001`** stay in the visible DOM — forces the compositor to render 3 full-screen layers | 🟡 High | [ScrollCanvas.tsx](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/components/ScrollCanvas.tsx#L251-L259) |
| 7 | **Canvas `willChange: "transform"` is unnecessary** — the canvas never transforms, this just wastes GPU memory promoting it | 🟢 Low | [ScrollCanvas.tsx](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/components/ScrollCanvas.tsx#L474) |

---

#### [FIX 1] Re-encode videos with lower bitrate + faststart + true All-Intra keyframes

The current videos are H.264 High Profile at 10-18 Mbps. For scroll-seeking, we need:
- **Every frame is a keyframe** (true I-frame only / All-Intra) — so the browser doesn't need to decode preceding frames to reach the target
- **`faststart`** — moves the `moov` atom to the front of the file so seeking is instant
- **Lower bitrate** (3-8 Mbps depending on tier) — reduces decoder pressure during rapid seeking

```bash
# Example for 720p (adjust -b:v for each tier)
ffmpeg -i input.mp4 \
  -c:v libx264 -preset slow \
  -profile:v high -level 4.2 \
  -intra -g 1 -bf 0 \
  -b:v 5M -maxrate 6M -bufsize 10M \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -an \
  output_720p.mp4
```

**Bitrate targets per tier:**
| Tier | Current Bitrate | Recommended Bitrate | Savings |
|------|----------------|-------------------|---------|
| 480p | ~5.5 Mbps | 2.5-3 Mbps | ~45% smaller |
| 720p | ~10 Mbps | 4-5 Mbps | ~50% smaller |
| 1080p | ~18 Mbps | 6-8 Mbps | ~55% smaller |
| 2k | ~22 Mbps (est.) | 10-12 Mbps | ~50% smaller |

---

#### [FIX 2] Eliminate React re-renders from scroll path

The `handleProgressUpdate` callback calls `setProgressState()` on every single scroll-driven RAF tick. This causes the **entire** `Home` component (727 lines including 4 GradualBlur sections, the header, footer, telemetry HUD, etc.) to re-render at 60fps during scrolling.

##### [MODIFY] [`page.tsx`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/app/page.tsx)

Replace the progress state with a **ref-based approach** and only update the DOM elements that actually change (the progress bar and telemetry) via direct DOM writes:

```diff
- const [progressState, setProgressState] = useState<ProgressData>({ ... });
- const handleProgressUpdate = useCallback((data: ProgressData) => {
-   setProgressState(data);
- }, []);
+ const progressRef = useRef<ProgressData>({ ... });
+ const progressBarRef = useRef<HTMLDivElement>(null);
+ const progressTextRef = useRef<HTMLSpanElement>(null);
+ const sectionLabelRef = useRef<HTMLSpanElement>(null);
+
+ const handleProgressUpdate = useCallback((data: ProgressData) => {
+   progressRef.current = data;
+   // Direct DOM writes — zero React re-renders
+   if (progressBarRef.current) {
+     progressBarRef.current.style.width = `${Math.max(4, data.progress * 100)}%`;
+   }
+   if (progressTextRef.current) {
+     progressTextRef.current.textContent = `${Math.round(data.progress * 100)}%`;
+   }
+   // Update section visibility via RAF-batched class toggles
+   const sectionFloat = data.progress * 3;
+   const newActive = Math.round(sectionFloat);
+   if (newActive !== activeSectionRef.current) {
+     setActiveSection(newActive);  // Only re-render on section CHANGE
+   }
+ }, []);
```

This changes the re-render frequency from **~60/sec** (every scroll tick) to **~3/sec** (only when the active section changes).

---

#### [FIX 3] Remove backdrop-blur from DOM after load completes

##### [MODIFY] [`ScrollCanvas.tsx`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/components/ScrollCanvas.tsx#L378-L467)

After `isLoaded` is true and the fade-out transition completes, **remove the loading overlay entirely from the DOM** instead of keeping it with `opacity: 0` and `backdrop-blur-3xl`:

```diff
+ const [showLoader, setShowLoader] = useState(true);
+
+ useEffect(() => {
+   if (isLoaded) {
+     const timer = setTimeout(() => setShowLoader(false), 700);
+     return () => clearTimeout(timer);
+   }
+ }, [isLoaded]);

// In JSX:
- <div className={`fixed inset-0 z-[999999] ... backdrop-blur-3xl ... ${
-   isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
- }`}>
+ {showLoader && (
+   <div className={`fixed inset-0 z-[999999] ... backdrop-blur-3xl ... ${
+     isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
+   }`}>
+     ...
+   </div>
+ )}
```

---

#### [FIX 4] Hide inactive video elements properly

The 3 video elements are all fixed at `100vw × 100vh` with `opacity: 0.0001`. This forces the browser to composite 3 full-screen video layers. Only the active scene's video needs to be in the viewport:

```diff
// For inactive videos, move them off-screen instead of using opacity
- video.style.opacity = "0.0001";
+ video.style.opacity = "0";
+ video.style.width = "1px";
+ video.style.height = "1px";
+ video.style.position = "fixed";
+ video.style.top = "-9999px";
```

And when activating a scene, promote only the active video:
```javascript
// On scene switch, only the active video needs to be in viewport
Object.entries(videosRef.current).forEach(([key, vid]) => {
  if (key === sceneKey) {
    vid.style.width = "1px"; vid.style.height = "1px";
    vid.style.top = "0"; vid.style.opacity = "0.001";
  } else {
    vid.style.top = "-9999px"; vid.style.opacity = "0";
  }
});
```

---

#### [FIX 5] Remove unnecessary `willChange` on canvas

```diff
  style={{
    opacity: isLoaded ? 1 : 0,
-   willChange: "transform"
  }}
```

The canvas never transforms — it's a fixed full-screen element. `willChange: "transform"` just wastes GPU memory by promoting it to a separate compositing layer unnecessarily.

---

### 🏗️ Architecture Issues

---

#### [ISSUE 6] Entire page is `"use client"` — no Server Component benefits

##### [MODIFY] [`page.tsx`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/app/page.tsx#L1)

The entire 727-line page is a Client Component. The static content (headings, section titles, badges, text) should be Server Components that stream as HTML. Only the interactive parts need `"use client"`.

**Recommended approach:** Split into:
- `page.tsx` — Server Component with static HTML structure
- `HomeClient.tsx` — Client Component with scroll logic, state, and interactive elements
- Pass the static content as `children` to avoid re-rendering it

---

#### [ISSUE 7] No `prefers-reduced-motion` support

The entire experience (scroll hijacking, video canvas, 3D physics, CSS animations) plays regardless of the user's motion preferences. This is a **WCAG 2.1 Level AAA** violation.

##### [MODIFY] Multiple files

- [page.tsx](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/app/page.tsx#L84-L92) — already checks in `scrollToSection()` ✅ but doesn't apply to:
  - Video canvas initialization
  - 3D Lanyard physics
  - Logo loop marquee
  - All `animate-ping`, `animate-pulse`, `animate-bounce`, `animate-spin` CSS animations
- [globals.css](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/app/globals.css) — **no `@media (prefers-reduced-motion)` query at all**

Add to `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### 📦 Asset Optimization Issues

---

#### [ISSUE 8] `fahed_badge.svg` is 2.2 MB

[`fahed_badge.svg`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/public/assets/lanyard/fahed_badge.svg) — 2,202 KB for an SVG is extreme. This likely contains embedded base64 raster images or unoptimized path data.

**Fix options:**
1. Run through SVGO to strip metadata and optimize paths
2. If it contains raster data, extract it and convert to WebP (<100 KB target)
3. Consider using a lighter version for mobile (the 3D Lanyard is hidden on mobile anyway via `hidden lg:flex`)

---

#### [ISSUE 9] `card.glb` is 2.4 MB (uncompressed GLB)

[`card.glb`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/public/assets/lanyard/card.glb) — should be compressed with **Draco** or **Meshopt** compression, which typically achieves 80-90% reduction:

```bash
npx gltf-transform draco card.glb card_draco.glb
# Expected: 2.4 MB → ~300-500 KB
```

---

#### [ISSUE 10] `Fahed_Mbarek.png` is 1.6 MB

[`Fahed_Mbarek.png`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/public/Fahed_Mbarek.png) at 1.6 MB — should be converted to WebP/AVIF with Next.js Image optimization, or manually optimized if used outside of `<Image>`.

---

#### [ISSUE 11] `next.config.ts` has zero optimization config

[`next.config.ts`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/next.config.ts) is completely empty. Missing:
- No `images.formats` — Next.js won't serve AVIF/WebP
- No `compress` setting
- No `headers()` for caching video/asset files
- No `webpack` customization for tree-shaking Three.js

**Recommended additions:**
```typescript
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};
```

---

### 🎨 Additional Performance & UX Issues

---

#### [ISSUE 12] `SpecularButton` triggers React re-render on every mousemove

[`SpecularButton.tsx`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/components/SpecularButton.tsx#L22-L28) — `setMousePos()` is called on every `mousemove` event, causing a full component re-render per mouse frame. Should use a **ref + direct style write** instead:

```diff
- const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
+ const mousePosRef = useRef({ x: 50, y: 50 });
+ const sheenRef = useRef<HTMLSpanElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
-   setMousePos({
-     x: ((e.clientX - rect.left) / rect.width) * 100,
-     y: ((e.clientY - rect.top) / rect.height) * 100,
-   });
+   const x = ((e.clientX - rect.left) / rect.width) * 100;
+   const y = ((e.clientY - rect.top) / rect.height) * 100;
+   mousePosRef.current = { x, y };
+   if (sheenRef.current) {
+     sheenRef.current.style.background = 
+       `radial-gradient(circle 80px at ${x}% ${y}%, rgba(255,255,255,0.8), transparent 70%)`;
+   }
  };
```

---

#### [ISSUE 13] `BorderGlowCard` same mousemove re-render issue

[`BorderGlowCard.tsx`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/components/BorderGlowCard.tsx#L20-L27) — identical pattern. `setMousePos()` on every mousemove. Same ref-based fix applies.

---

#### [ISSUE 14] 3D Lanyard doesn't pause physics when off-screen

[`Lanyard.tsx`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/components/Lanyard.tsx#L90) — the `active` prop correctly pauses physics, but the **Canvas renderer still runs `useFrame` at 60fps** even when the lanyard section is not visible. The `useFrame` hook at line 282 does early-return when `!active && !dragged`, but Three.js still burns GPU cycles rendering the scene.

**Fix:** Use `frameloop="demand"` on the Canvas when `active` is false:

```diff
  <Canvas
    camera={{ position: position, fov: fov }}
    dpr={[1, isMobile ? 1.5 : 2]}
+   frameloop={active ? "always" : "demand"}
    gl={{ alpha: transparent, antialias: true, powerPreference: "high-performance" }}
```

---

#### [ISSUE 15] `scroll-behavior: smooth` in CSS conflicts with JS scroll hijacking

[`globals.css`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/app/globals.css#L11) has `scroll-behavior: smooth` on `html`, but [`page.tsx`](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/app/page.tsx#L73-L137) implements custom JS-based smooth scrolling via `scrollToSection()`. These **fight each other** — the CSS smooth scroll applies its own interpolation on top of the JS `window.scrollTo()` calls, causing the scroll position to drift and creating a "double-easing" effect.

```diff
  html {
    color-scheme: dark light;
-   scroll-behavior: smooth;
+   scroll-behavior: auto;
  }
```

---

#### [ISSUE 16] Multiple `animate-ping` elements cause continuous compositing

The page has **at least 5 elements** using `animate-ping` (which scales an element to 200% and fades to 0, repeatedly). Each one forces a separate compositor layer and continuous GPU work:

- Header status dot (line 275)
- Loading overlay ping ring (line 405)
- Loading overlay status dot (line 398)
- Section navigation dots (lines 538, 594)

**Fix:** Replace most `animate-ping` with `animate-pulse` (simpler opacity animation) or reduce to a single ping element on the page.

---

## Priority Order for Implementation

| Priority | Fix | Impact on Stutter | Effort |
|----------|-----|-------------------|--------|
| 🔴 P0 | Re-encode videos (Fix 1) | **Massive** — eliminates decoder bottleneck | Medium (ffmpeg commands) |
| 🔴 P0 | Eliminate scroll-path re-renders (Fix 2) | **Major** — stops 60fps React reconciliation | Medium |
| 🟡 P1 | Remove loaded overlay from DOM (Fix 3) | **Moderate** — stops backdrop-blur compositing | Easy |
| 🟡 P1 | Fix CSS `scroll-behavior` conflict (Issue 15) | **Moderate** — eliminates double-easing | Trivial |
| 🟡 P1 | Hide inactive video elements (Fix 4) | **Moderate** — reduces compositor layers | Easy |
| 🟢 P2 | Pause 3D canvas when off-screen (Issue 14) | Moderate GPU savings | Easy |
| 🟢 P2 | Add `prefers-reduced-motion` (Issue 7) | Accessibility compliance | Easy |
| 🟢 P2 | Optimize `next.config.ts` caching (Issue 11) | Faster repeat visits | Easy |
| 🟢 P2 | Fix `SpecularButton`/`BorderGlowCard` re-renders (Issues 12-13) | Minor UI smoothness | Easy |
| 🔵 P3 | Optimize `fahed_badge.svg` (Issue 8) | Faster initial load | Medium |
| 🔵 P3 | Compress `card.glb` with Draco (Issue 9) | Faster 3D load | Easy |
| 🔵 P3 | Split page.tsx Server/Client (Issue 6) | Bundle size + SSR | High |
| 🔵 P3 | Reduce `animate-ping` elements (Issue 16) | Minor GPU savings | Trivial |

---

## Verification Plan

### Automated Tests
```bash
npm run build        # Verify zero build errors after changes
npm run lint         # Verify no new lint warnings
```

### Manual Verification
- **Chrome DevTools Performance tab**: Record a scroll session before/after — measure frame time drops, GPU utilization, and main thread work
- **Lighthouse Performance audit**: Compare scores before/after
- **Chrome Rendering → Paint flashing**: Verify no unexpected paint regions during scroll
- **Chrome Layers panel**: Verify reduced compositor layer count after fixes
- **Test on throttled CPU (4× slowdown)**: Confirm stutter-free scrolling on simulated low-end device
- **Test `prefers-reduced-motion`**: Toggle in system settings and verify graceful degradation
