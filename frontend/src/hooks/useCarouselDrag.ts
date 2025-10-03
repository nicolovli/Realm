import { useEffect, useRef, type RefObject } from "react";

type Params = {
  enabled: boolean;
  spv: number;
  index: number;
  setIndex: (i: number) => void;
  setAnimating: (b: boolean) => void;
  // pixel metrics
  slidePx: number;
  stepPx: number;
  // pointer policy
  allowMouseDrag?: boolean; // default false
};

export function useCarouselDrag(
  viewportRef: RefObject<HTMLDivElement | null>,
  trackRef: RefObject<HTMLUListElement | null>,
  {
    enabled,
    spv,
    index,
    setIndex,
    setAnimating,
    slidePx,
    stepPx,
    allowMouseDrag = false,
  }: Params,
) {
  const startX = useRef(0);
  const deltaX = useRef(0);
  const dragging = useRef(false);
  const startTime = useRef(0);
  const clickSuppress = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const isNoDrag = (el: EventTarget | null) =>
      el instanceof HTMLElement && !!el.closest('[data-nodrag="true"]');

    const dragStartSlopPx = 5;
    const thresholdRatio = 0.25; // 25% of slide width

    const isPointerAllowed = (e: PointerEvent) =>
      e.pointerType === "mouse"
        ? allowMouseDrag
        : e.pointerType === "touch" || e.pointerType === "pen";

    const applyTransform = (offsetPx: number) => {
      track.style.transform = `translate3d(-${offsetPx}px,0,0)`;
    };

    const currentSnapOffset = () => index * stepPx;

    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary || isNoDrag(e.target) || !isPointerAllowed(e)) return;
      dragging.current = true;
      startX.current = e.clientX;
      deltaX.current = 0;
      startTime.current = performance.now();
      clickSuppress.current = false;
      track.style.transitionProperty = "none";
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current || !e.isPrimary || !isPointerAllowed(e)) return;
      const dx = e.clientX - startX.current;
      deltaX.current = dx;

      if (Math.abs(dx) > dragStartSlopPx) clickSuppress.current = true;

      applyTransform(currentSnapOffset() - dx);
    };

    const endPointer = (e?: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;

      if (e && e.isPrimary) {
        try {
          viewport.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }

      const elapsed = performance.now() - startTime.current;
      const dx = deltaX.current;
      const vx = Math.abs(dx) / Math.max(elapsed, 1); // px/ms
      const passed = Math.abs(dx) > slidePx * thresholdRatio || vx > 0.6;

      track.style.transitionProperty = "transform";
      setAnimating(true);
      setIndex(passed ? index + (dx < 0 ? 1 : -1) : index);
    };

    const onClickCapture = (e: MouseEvent) => {
      if (clickSuppress.current) {
        e.preventDefault();
        e.stopPropagation();
        clickSuppress.current = false;
      }
    };

    viewport.addEventListener("pointerdown", onPointerDown, { passive: true });
    viewport.addEventListener("pointermove", onPointerMove, { passive: true });
    viewport.addEventListener("pointerup", endPointer, {
      passive: true,
    });
    viewport.addEventListener("pointercancel", endPointer, {
      passive: true,
    });
    viewport.addEventListener("lostpointercapture", endPointer, {
      passive: true,
    });
    viewport.addEventListener("click", onClickCapture, true);

    // Touch fallback (older iOS)
    const hasPointer = "PointerEvent" in window;
    let touchId: number | null = null;
    const getTouch = (e: TouchEvent) =>
      touchId != null
        ? Array.from(e.changedTouches).find((t) => t.identifier === touchId)
        : e.changedTouches[0];

    const onTouchStart = (e: TouchEvent) => {
      if (hasPointer || isNoDrag(e.target)) return;
      const t = getTouch(e);
      if (!t) return;
      touchId = t.identifier;
      dragging.current = true;
      startX.current = t.clientX;
      deltaX.current = 0;
      startTime.current = performance.now();
      clickSuppress.current = false;
      track.style.transitionProperty = "none";
    };

    const onTouchMove = (e: TouchEvent) => {
      if (hasPointer || !dragging.current) return;
      const t = getTouch(e);
      if (!t) return;

      const dx = t.clientX - startX.current;
      deltaX.current = dx;

      if (Math.abs(dx) > dragStartSlopPx) clickSuppress.current = true;

      applyTransform(currentSnapOffset() - dx);
      e.preventDefault();
    };

    const onTouchEnd = () => {
      if (hasPointer) return;
      endPointer();
      touchId = null;
    };

    viewport.addEventListener("touchstart", onTouchStart, { passive: false });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("touchend", onTouchEnd);
    viewport.addEventListener("touchcancel", onTouchEnd);

    return () => {
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endPointer);
      viewport.removeEventListener("pointercancel", endPointer);
      viewport.removeEventListener("lostpointercapture", endPointer);
      viewport.removeEventListener("click", onClickCapture, true);

      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [
    enabled,
    spv,
    index,
    setIndex,
    setAnimating,
    slidePx,
    stepPx,
    allowMouseDrag,
    viewportRef,
    trackRef,
  ]);
}
