# 🔬 Scroll-Linked Canvas Animation — Performance Analysis Report

> **Project**: super awesome portfolio  
> **Date**: 2026-08-10  
> **Analyst**: Antigravity Performance Engine  

---

## 1. Architecture Overview

The page uses a **scroll-linked image-sequence-to-canvas** pattern:
1. On page load, **597 WebP frames** (extracted from 3 MP4 source videos) are fetched and decoded into `HTMLImageElement` objects.
2. A fixed `<canvas>` fills the viewport. As the user scrolls through 4 viewport-height sections, a `requestAnimationFrame`-gated scroll handler maps `scrollY` → frame index → `ctx.drawImage()`.
3. A custom scroll engine intercepts `wheel` events and drives 5-second cinematic ease animations between sections.

### Component Map

| File | Role |
|------|------|
| [ScrollCanvas.tsx](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/components/ScrollCanvas.tsx) | Canvas renderer, frame preloader, scroll→frame mapping |
| [page.tsx](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/app/page.tsx) | Page layout, HUD, scroll engine, contact modal |
| [globals.css](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/app/globals.css) | Glassmorphism utilities, scrollbar, glow effects |
| [manifest.json](file:///c:/Users/fahed/Projects/super%20awesome%20portfolio/public/assets/manifest.json) | Scene metadata (frame counts, file patterns) |

---

## 2. Asset Inventory — Hard Numbers

### Frame Files (WebP)

| Scene | Frames | Compressed Size | Avg/Frame | Min | Max |
|-------|--------|-----------------|-----------|-----|-----|
| scene_1 | 220 | **28.3 MB** | 131 KB | 7.1 KB | 336 KB |
| scene_2 | 186 | **19.2 MB** | 106 KB | 6.5 KB | 247 KB |
| scene_3 | 191 | **20.8 MB** | 112 KB | 8.8 KB | 352 KB |
| **TOTAL** | **597** | **68.3 MB** | **117 KB** | — | — |

### Frame Resolution

| Property | Value |
|----------|-------|
| Source frame dimensions | **2560 × 1440 px** (QHD / 1440p) |
| Bits per pixel (decoded RGBA) | 32 bits (4 bytes) |
| Per-frame decoded bitmap size | 2560 × 1440 × 4 = **14.75 MB** |
| Total decoded bitmap memory | 597 × 14.75 MB = **~8.8 GB** ⚠️ |

### Source Videos (for reference)

| Scene | MP4 Size |
|-------|----------|
| scene 1.mp4 | 32.2 MB |
| scene 2.mp4 | 22.3 MB |
| scene 3.mp4 | 22.5 MB |
| **Total** | **77.0 MB** |

---

## 3. Memory Cost Breakdown

### 3.1 Network Transfer

| Item | Cost |
|------|------|
| 597 WebP files over HTTP | **~68.3 MB** (uncompressed; WebP is already compressed) |
| manifest.json | 847 bytes |
| JS bundle + CSS + fonts | ~150–300 KB (typical Next.js) |
| **Total initial download** | **~68.6 MB** |

> [!CAUTION]
> On a 10 Mbps connection, loading all 597 frames takes **~55 seconds**. On 50 Mbps it's ~11 seconds. The page is completely blocked by a fullscreen loader during this time.

### 3.2 JavaScript Heap Memory

| Item | Estimate |
|------|----------|
| 597 `HTMLImageElement` objects (decoded bitmaps) | **~8.8 GB** |
| React component tree + state | ~2–5 MB |
| Canvas backbuffer (2560 × 1440 @ 32bpp) | ~14.75 MB |
| **Total JS Heap (peak)** | **~8.8 GB** ⚠️⚠️⚠️ |

> [!WARNING]
> **8.8 GB of decoded image data is catastrophic.** Most browsers cap tab memory at 2–4 GB. Chrome will start evicting decoded bitmaps and re-decoding them on demand, causing stutter on every scroll. Mobile browsers will simply crash.

### 3.3 GPU / Graphics Memory

| Item | Estimate |
|------|----------|
| Canvas texture (1 active frame on GPU) | ~14.75 MB |
| Compositor layers (glass-panel blur, fixed elements) | ~5–15 MB |
| `backdrop-filter: blur()` on header + HUD (per-frame GPU blur) | Continuous GPU cost |
| **Total GPU VRAM** | **~20–30 MB** (modest) |

The GPU cost is actually reasonable — only 1 frame is on the canvas at a time. The problem is entirely in the **CPU-side decoded bitmap cache**.

---

## 4. Runtime Performance Analysis

### 4.1 Scroll Handler

```
scroll event → cancelAnimationFrame → requestAnimationFrame → {
  calculate scrollY → frame index mapping
  ctx.drawImage(img, x, y, w, h)  ← this is the hot path
}
```

**Verdict**: The rAF-gated pattern is correct. However:

- ✅ `{ passive: true }` on scroll — good
- ✅ Single rAF dedup — good  
- ⚠️ `getContext("2d", { alpha: false })` is called **every frame** instead of once — minor overhead
- ⚠️ Cover-fit math recalculates every frame even when canvas/image dimensions haven't changed
- ⚠️ The `onProgressUpdate` callback triggers `setScrollData()` on every frame, causing a React re-render of the entire `Home` component including all 4 sections, the header, the HUD, and all Lucide icons

### 4.2 Canvas Rendering

| Operation | Cost |
|-----------|------|
| `drawImage` (2560×1440 source → viewport-sized canvas) | **~2–4ms** on modern GPU (bilinear scaling) |
| Source bitmap decode (if evicted from cache) | **~15–30ms** per frame ⚠️ |

When Chrome evicts decoded bitmaps (which it **will** at 8.8 GB), scrolling triggers a decode-then-draw pipeline that can easily blow the 16ms frame budget.

### 4.3 Scroll Engine (page.tsx)

- The custom `handleWheel` interceptor with `e.preventDefault()` blocks native scrolling — **correct for this use case**.
- The scrollbar-drag debounce snaps to nearest section after 300ms — works but the snap animation fires a 5-second `requestAnimationFrame` loop with `window.scrollTo()` on every frame, which continuously triggers the canvas scroll handler. This creates a **double rAF loop** (scroll engine + canvas renderer).

### 4.4 CSS Performance

- `backdrop-filter: blur(16px)` on the fixed header runs on **every compositor frame** during scroll. This is a known GPU-intensive operation.
- `.animate-ping` and `.animate-spin` on the preloader are fine (removed after load).
- `.animate-bounce` on the scroll prompt runs continuously — negligible cost.

---

## 5. Overall Rating

| Category | Score | Notes |
|----------|-------|-------|
| 🎨 Visual Quality | **9.5 / 10** | QHD frames, smooth glassmorphism, excellent aesthetics |
| 📡 Network Efficiency | **3 / 10** | 68 MB blocking download, no progressive loading |
| 🧠 Memory Efficiency | **1.5 / 10** | ~8.8 GB decoded bitmaps — will crash on most devices |
| ⚡ Scroll Smoothness | **6 / 10** | Good when cached; degrades to stuttery when bitmaps evict |
| 📱 Mobile Viability | **1 / 10** | Will crash on virtually all mobile browsers |
| 🏗️ Architecture | **6 / 10** | Solid skeleton but missing critical optimizations |
| **OVERALL** | **4.5 / 10** | Beautiful but unsustainable at current memory footprint |

---

## 6. Optimization Options & Recommendations

### Option A: `OffscreenCanvas` + `createImageBitmap` with LRU Cache _(Recommended — High Impact)_

**What**: Instead of keeping 597 decoded `HTMLImageElement` objects in memory, store the **compressed WebP blobs** in memory (~68 MB total) and decode only a sliding window of ~30–50 frames around the current position using `createImageBitmap()`.

**Impact**:
- Memory: **8.8 GB → ~350 MB** (68 MB blobs + ~50 decoded bitmaps at 14.75 MB each = ~285 MB decoded window)
- Network: Same 68 MB download
- Smoothness: Excellent — `createImageBitmap()` decodes in a background thread and returns a GPU-ready bitmap

**Complexity**: Medium. Requires rewriting the preloader to fetch as `Blob` instead of `Image`, and implementing a frame cache manager.

---

### Option B: Resolution Tiering (Serve viewport-matched frames)

**What**: Pre-generate frame sets at multiple resolutions:
- **1280×720** for mobile / ≤ 1080p screens (3.7 MB decoded per frame → **2.2 GB** for all 597)
- **1920×1080** for standard desktop (8.3 MB decoded per frame → **4.9 GB**)
- **2560×1440** only for QHD+ displays

Serve the appropriate set based on `window.innerWidth` and `devicePixelRatio`.

**Impact**:
- Memory: **~60–75% reduction** for most users
- Network: **~40–65% reduction** (WebP scales well with resolution)
- Quality: Visually identical at target viewport — no perceptible difference

**Complexity**: Low-Medium. Requires an FFmpeg re-extraction pipeline + manifest update.

---

### Option C: Hybrid Video + Canvas Approach _(Best UX, Highest Complexity)_

**What**: Instead of 597 static images, use the **original MP4 videos** directly with `<video>` elements and `video.currentTime` scrubbing.

- Browser natively handles decode, memory management, and hardware acceleration
- Seeking to a specific time is handled by the codec's keyframe structure
- Memory usage: **~77 MB** (just the video files in the HTTP cache)

**Impact**:
- Memory: **8.8 GB → ~80 MB** (99% reduction)
- Network: 77 MB (comparable to current 68 MB WebP)
- Smoothness: Depends on keyframe interval — may need re-encoding with frequent keyframes

**Complexity**: High. Video seeking can be imprecise (snaps to nearest keyframe). Requires careful encoding with 1-second GOP or all-intra and custom seek logic.

---

### Option D: Quick Wins (Apply Immediately)

These are low-effort fixes that improve performance without changing the architecture:

#### D1. Cache canvas context reference
```diff
- const ctx = canvas.getContext("2d", { alpha: false });
+ // Store ctx in a ref, created once
```

#### D2. Throttle React state updates
Instead of calling `setScrollData()` on every scroll frame, throttle to ~10 Hz or use a ref + manual DOM updates for the HUD:
```diff
- onProgressUpdate?.(data);  // triggers React re-render every frame
+ // Only update React state every 100ms
+ // Or use refs + direct DOM manipulation for frame counter
```

#### D3. Debounce resize handler
Add a debounce to `handleResize` to prevent canvas thrashing during window resize drag.

#### D4. Move `backdrop-filter` off fixed header during scroll
Use `will-change: transform` or disable the blur during active scrolling to free GPU bandwidth.

#### D5. Memoize child components
Wrap the 4 sections and header in `React.memo()` to prevent unnecessary re-renders when only `scrollData` changes.

---

## 7. Recommended Optimization Strategy

> [!IMPORTANT]
> **Priority 1**: Apply Option D (Quick Wins) — immediate, no architectural changes.  
> **Priority 2**: Implement Option A (Blob cache + `createImageBitmap` LRU) — eliminates the memory crisis.  
> **Priority 3**: Consider Option B (Resolution Tiering) — reduces network transfer for the majority of users.  
> **Priority 4**: Evaluate Option C (Video scrubbing) for a V2 rewrite if maximum efficiency is needed.

### Target Metrics After Optimization (Options A + B + D combined)

| Metric | Current | After Optimization |
|--------|---------|-------------------|
| Peak memory | ~8.8 GB | **~200–350 MB** |
| Network transfer (1080p user) | 68 MB | **~25–35 MB** |
| Time to interactive | 11–55 sec | **~3–8 sec** (progressive) |
| Scroll frame drops | Frequent (bitmap eviction) | **Near zero** |
| Mobile support | ❌ Crashes | ✅ Functional |

---

## 8. What the Numbers Mean in Practice

To put 8.8 GB in perspective:
- A **MacBook Air M1** (8 GB RAM) would need to dedicate **all system memory** to this one tab
- A **budget Android phone** (4 GB RAM) would crash before loading 40% of the frames  
- Chrome's default per-tab limit is typically **2–4 GB** — this exceeds it by 2–4×
- Even on a high-end 32 GB desktop, Chrome will aggressively evict and re-decode bitmaps, causing visible stutter

The good news: the compressed WebP data (68 MB) is very manageable. The architecture just needs to avoid decoding all 597 frames simultaneously.
