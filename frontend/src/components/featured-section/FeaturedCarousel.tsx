import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEventHandler,
} from "react";
import type { PreviewGame } from "../../types/PreviewGame";
import FeaturedCard from "./FeaturedCard";
import { useSlidesPerView } from "../../hooks/useSlidesPerView";
import { isCoarsePointer } from "../../utils/isTouch";
import { useCarouselDrag } from "../../hooks/useCarouselDrag";
import { useInputCapabilities } from "../../hooks/useInputCapabilities";
import { useCarouselMetrics } from "../../hooks/useCarouselMetrics";
import { Link } from "react-router-dom";

// style constants
// Arrow buttons (uses project purples, with opacity + proper focus rings)
export const arrowClass =
  "absolute top-1/2 -translate-y-1/2 z-20 h-10 w-10 " +
  "flex items-center justify-center rounded-full backdrop-blur " +
  "text-black dark:text-white " +
  "bg-opacity-60 bg-lightpurple " + // light bg @ 60%
  "dark:bg-opacity-50 dark:bg-darkpurple " + // dark bg @ 50%
  "hover:brightness-110 " +
  "focus:outline-none focus:ring-2 " +
  "focus:ring-activelightdots dark:focus:ring-darkbuttonpurple";

// Dots (base = inactive; add activeDotClass when selected)
export const dotBaseClass =
  "h-2 w-2 rounded-full transition-all " +
  "bg-lightdots dark:bg-darkpurple " + // inactive colors
  "focus:outline-none focus:ring-2 " +
  "focus:ring-activelightdots dark:focus:ring-darkbuttonpurple";

export const activeDotClass = "w-4 bg-activelightdots dark:bg-darkbuttonpurple";

// Explore button
export const exploreBtnClass =
  "rounded-full px-4 py-2 text-sm font-medium text-white shadow " +
  "bg-lightbuttonpurple hover:brightness-110 " +
  "dark:bg-darkbuttonpurple dark:hover:brightness-110 " +
  "focus:outline-none focus:ring-2 cursor-pointer " +
  "focus:ring-activelightdots dark:focus:ring-darkpurple";

export type FeaturedCarouselProps = {
  items: PreviewGame[]; // pass 10 items
  title?: string;
  onExploreAll?: () => void;
};

function clampIndex(i: number, len: number) {
  if (len === 0) return 0;
  const r = i % len;
  return r < 0 ? r + len : r;
}

export default function FeaturedCarousel({
  items,
  title = "Featured games",
  onExploreAll,
}: FeaturedCarouselProps) {
  const spv = useSlidesPerView();
  const cloneCount = spv;

  const logical = items.slice(0, 10);

  const trackItems = useMemo(() => {
    if (logical.length === 0) return [] as PreviewGame[];
    const head = logical.slice(0, cloneCount);
    const tail = logical.slice(-cloneCount);
    return [...tail, ...logical, ...head];
  }, [logical, cloneCount]);

  const [index, setIndex] = useState(cloneCount);
  const [, setAnimating] = useState(false);
  const [hint, setHint] = useState(isCoarsePointer());

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);

  const { anyHover } = useInputCapabilities();
  const showArrows = anyHover;
  const allowMouseDrag = false; // set true if you want mouse drag too

  // measure metrics in pixels
  const { slidePx, stepPx, ready } = useCarouselMetrics(
    viewportRef,
    trackRef,
    spv,
  );

  // Snap from clones (using px transform)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onEnd = () => {
      setAnimating(false);
      const before = cloneCount;
      const lastReal = cloneCount + logical.length - 1;

      const snap = (targetIndex: number) => {
        el.style.transitionProperty = "none";
        el.style.transitionDuration = "0ms";
        el.style.transform = `translate3d(-${targetIndex * stepPx}px,0,0)`;
        setIndex(targetIndex);
        void el.offsetWidth;
        el.style.transitionProperty = "transform";
        el.style.transitionDuration = "";
      };

      if (index <= before - 1) {
        snap(before + logical.length - 1);
      } else if (index >= lastReal + 1) {
        snap(before);
      }
    };

    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [index, cloneCount, logical.length, stepPx]);

  // Keep logical slide across SPV changes
  useEffect(() => {
    setIndex((i) => {
      const before = cloneCount;
      const logicalIndex = clampIndex(i - before, logical.length);
      return cloneCount + logicalIndex;
    });
  }, [cloneCount, logical.length]);

  // apply transform whenever index or metrics change
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !ready) return;
    el.style.transform = `translate3d(-${index * stepPx}px,0,0)`;
  }, [index, stepPx, ready]);

  // attach drag behavior (in pixels)
  useCarouselDrag(viewportRef, trackRef, {
    enabled: true,
    spv,
    index,
    setIndex,
    setAnimating,
    slidePx,
    stepPx,
    allowMouseDrag,
  });

  // Keyboard
  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setAnimating(true);
      setIndex(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setAnimating(true);
      setIndex(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setIndex(cloneCount);
    } else if (e.key === "End") {
      e.preventDefault();
      setIndex(cloneCount + logical.length - 1);
    }
  };

  const logicalIndex = clampIndex(index - cloneCount, logical.length);

  return (
    <section className="w-full">
      <h2 className="mb-4 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        aria-live="polite"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="mx-auto w-full overflow-hidden"
      >
        {/* Viewport */}
        <div
          ref={viewportRef}
          onPointerDownCapture={() => setHint(false)}
          className="
            relative isolate overflow-hidden rounded-xl touch-pan-y overscroll-x-contain
            touch:cursor-grab touch:active:cursor-grabbing sm:px-0"
        >
          {/* Track */}
          <ul
            ref={trackRef}
            className="z-0 flex select-none gap-0 sm:gap-4 md:gap-6 lg:gap-8 transition-transform duration-300 ease-out motion-reduce:transition-none"
            // transform is controlled by effect (px)
          >
            {trackItems.map((g, i) => (
              <li
                key={`${g.sid}-${i}`}
                className="shrink-0"
                style={{
                  // IMPORTANT: use fixed px width so math matches the transform
                  flex: "0 0 auto",
                  width: ready ? `${slidePx}px` : "auto",
                }}
              >
                <FeaturedCard game={g} />
              </li>
            ))}
          </ul>

          {/* Prev arrow */}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => {
              setAnimating(true);
              setIndex(index - 1);
            }}
            data-nodrag="true"
            className={`${arrowClass} left-2 ${showArrows ? "flex" : "hidden"}`}
          >
            ◀
          </button>

          {/* Next arrow */}
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => {
              setAnimating(true);
              setIndex(index + 1);
            }}
            data-nodrag="true"
            className={`${arrowClass} right-2 ${showArrows ? "flex" : "hidden"}`}
          >
            ▶
          </button>

          {/* swipe hint */}
          {hint && (
            <div
              className="pointer-events-none absolute right-3 top-3 rounded-full px-2 py-1 text-xs text-white md:hidden"
              style={{
                backgroundColor: "color-mix(in oklab, black 70%, transparent)",
              }}
            >
              Swipe →
            </div>
          )}
        </div>

        {/* Dots */}
        <nav aria-label="Pagination" className="mt-4 flex justify-center gap-2">
          {logical.map((_, i) => {
            const isActive = logicalIndex === i;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1} of ${logical.length}`}
                aria-current={isActive}
                onClick={() => {
                  setAnimating(true);
                  setIndex(cloneCount + i);
                }}
                data-nodrag="true"
                className={dotBaseClass}
                style={{
                  width: isActive ? "1rem" : "0.5rem",
                  backgroundColor: isActive ? "activelightdots" : "lightdots",
                }}
              />
            );
          })}
        </nav>

        {/* Explore */}
        {onExploreAll && (
          <Link className="mt-6 flex justify-center" to="/result">
            <button
              data-nodrag="true"
              className={exploreBtnClass + " bg-lightbuttonpurple"}
            >
              Explore all games
            </button>
          </Link>
        )}
      </div>
    </section>
  );
}
