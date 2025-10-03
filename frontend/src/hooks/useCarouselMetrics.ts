import { useEffect, useState } from "react";
import type { RefObject } from "react";

type Metrics = {
  gapPx: number; // horizontal gap (px)
  slidePx: number; // single slide width (px, excluding gap)
  stepPx: number; // slide + gap (px)
  ready: boolean;
};

export function useCarouselMetrics(
  viewportRef: RefObject<HTMLDivElement | null>,
  trackRef: RefObject<HTMLUListElement | null>,
  spv: number,
): Metrics {
  const [m, setM] = useState<Metrics>({
    gapPx: 0,
    slidePx: 0,
    stepPx: 0,
    ready: false,
  });

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    const viewportEl = viewportRef.current;
    const trackEl = trackRef.current;
    if (!viewportEl || !trackEl || spv <= 0) return;

    const compute = () => {
      const cs = getComputedStyle(trackEl);
      // Use columnGap for horizontal flex rows; fall back to gap if needed
      const gapStr = cs.columnGap || cs.gap || "0px";
      const gapPx = Number.parseFloat(gapStr) || 0;

      const vw = viewportEl.clientWidth;
      const slide = Math.max((vw - gapPx * (spv - 1)) / spv, 0);
      const step = slide + gapPx;

      setM({ gapPx, slidePx: slide, stepPx: step, ready: slide > 0 });
    };

    compute();

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(compute);
      ro.observe(viewportEl);
      return () => ro.disconnect();
    }

    // Fallback: window resize (cast to DOM-aware type to avoid 'never')
    const win = globalThis as unknown as Window & typeof globalThis;
    const onResize = () => compute();
    win.addEventListener("resize", onResize);
    return () => win.removeEventListener("resize", onResize);
  }, [viewportRef, trackRef, spv]);

  return m;
}
