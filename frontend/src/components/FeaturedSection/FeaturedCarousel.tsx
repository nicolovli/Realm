import { useEffect, useMemo, useRef, useState } from "react";
import { FeaturedCard } from "@/components/FeaturedSection";
import { Link } from "react-router-dom";
import type { FeaturedGame } from "@/types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { FOCUS_VISIBLE, HOVER } from "@/lib/classNames";

export type FeaturedCarouselProps = {
  items: FeaturedGame[];
  title?: string;
  onExploreAll?: () => void;
  itemBasisClassName?: string;
};

export const arrowClass =
  "absolute top-1/2 -translate-y-1/2 z-20 h-10 w-10 " +
  "flex items-center justify-center rounded-full backdrop-blur " +
  "text-black dark:text-white " +
  "bg-opacity-60 bg-lightpurple " +
  "dark:bg-opacity-50 dark:bg-darkpurple " +
  "hover:brightness-110 cursor-pointer " +
  FOCUS_VISIBLE;

export const dotBaseClass =
  "rounded-full transition-all bg-transparent cursor-pointer flex items-center justify-center" +
  FOCUS_VISIBLE;

export const exploreBtnClass =
  "rounded-full px-4 py-2 text-sm font-medium text-white shadow " +
  "bg-lightbuttonpurple dark:bg-darkbuttonpurple cursor-pointer " +
  HOVER +
  FOCUS_VISIBLE;

function useAnyHover() {
  const get = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(any-hover: hover)").matches === true;

  const [anyHover, setAnyHover] = useState<boolean>(get);
  useEffect(() => {
    const mq = window.matchMedia?.("(any-hover: hover)");
    if (!mq) return;
    const update = () => setAnyHover(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return { anyHover };
}

function useIsCoarsePointer() {
  const [coarse, setCoarse] = useState<boolean>(() => {
    return typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: coarse)").matches
      ? true
      : false;
  });
  useEffect(() => {
    const mq = window.matchMedia?.("(pointer: coarse)");
    if (!mq) return;
    const update = () => setCoarse(mq.matches);
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return coarse;
}

export const FeaturedCarousel = ({
  items,
  title = "Featured games",
  onExploreAll,
  itemBasisClassName = "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4",
}: FeaturedCarouselProps) => {
  const logical = useMemo(() => items.slice(0, 10), [items]);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [hint, setHint] = useState<boolean>(false);

  const { anyHover } = useAnyHover();
  const isCoarse = useIsCoarsePointer();
  const regionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHint(!anyHover && isCoarse);
  }, [anyHover, isCoarse]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setSelected(api.selectedScrollSnap());
    const onInit = () => {
      setSnapCount(api.scrollSnapList().length);
      setSelected(api.selectedScrollSnap());
    };

    onInit();
    api.on("reInit", onInit);
    api.on("select", onSelect);

    return () => {
      api.off("reInit", onInit);
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="w-full" data-cy="featured-carousel">
      <h2 className="mb-4 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>

      <article
        ref={regionRef}
        aria-label={title}
        aria-live="polite"
        className="mx-auto w-full overflow-hidden "
      >
        <figure
          className="
            relative isolate overflow-hidden rounded-xl touch-pan-y overscroll-x-contain
            touch:cursor-grab touch:active:cursor-grabbing sm:px-0"
          onPointerDownCapture={() => setHint(false)}
        >
          <Carousel
            opts={{
              loop: true,
              align: "start",
              skipSnaps: false,
              duration: 20,
            }}
            setApi={setApi}
            className={`w-full`}
          >
            <CarouselContent className="select-none -mr-0 sm:-mr-4 md:-mr-6 lg:-mr-8">
              {logical.map((g) => (
                <CarouselItem
                  key={g.id}
                  className={`shrink-0 ${itemBasisClassName} mt-4 mb-8 pr-0  sm:pr-4 md:pr-6 lg:pr-8`}
                >
                  <FeaturedCard data-cy="featured-game-card" game={g} />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Prev/Next arrows only on hover-capable devices */}
            <CarouselPrevious
              aria-label="Previous slide"
              className={`${arrowClass} left-2 ${anyHover ? "flex" : "hidden"}`}
              data-cy="featured-prev"
            >
              ◀
            </CarouselPrevious>
            <CarouselNext
              aria-label="Next slide"
              className={`${arrowClass} right-2 ${anyHover ? "flex" : "hidden"}`}
              data-cy="featured-next"
            >
              ▶
            </CarouselNext>
          </Carousel>

          {/* swipe hint (touch only, hidden after first interaction) */}
          {hint && (
            <p
              className="pointer-events-none absolute right-3 top-3 rounded-full px-2 py-1 text-xs text-white"
              style={{
                backgroundColor: "color-mix(in oklab, black 70%, transparent)",
              }}
            >
              Swipe →
            </p>
          )}
        </figure>

        <nav aria-label="Pagination" className="mt-4 flex justify-center gap-5">
          {Array.from({ length: snapCount }).map((_, i) => {
            const isActive = selected === i;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1} of ${snapCount}`}
                aria-current={isActive}
                onClick={() => api?.scrollTo(i)}
                className={`${dotBaseClass}`}
              >
                <span
                  className={`block rounded-full transition-all ${
                    isActive
                      ? "h-5 w-5 bg-activelightdots dark:bg-darkbuttonpurple"
                      : "h-4 w-4 bg-lightdots dark:bg-darkpurple"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {onExploreAll && (
          <section className="mt-6 flex justify-center mb-4">
            <Link className="focus-visible:outline-none" to="/games">
              <button onClick={onExploreAll} className={exploreBtnClass}>
                Explore all games
              </button>
            </Link>
          </section>
        )}
      </article>
    </section>
  );
};
