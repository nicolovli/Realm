import type { ResultsGridProps } from "@/types/ResultGridTypes";
import { useEffect, useState } from "react";
import { Card } from "./ResultsCard";
import { FOCUS_VISIBLE, HOVER } from "@/lib/classNames";

const CardChrome =
  "rounded-2xl ring-1 bg-lightpurple ring-gray dark:bg-darkpurple dark:ring-darkgray overflow-hidden";

function SkeletonCard() {
  return (
    <li className="list-none" aria-hidden="true">
      <span className={`${CardChrome} animate-pulse block`}>
        <section className="relative w-full aspect-[16/9] bg-lightsearchbargray dark:bg-darksearchbargray rounded-xl" />
      </span>
    </li>
  );
}

export const ResultsGrid = ({
  games,
  loading, // "no data yet AND fetching"
  emptyState,
  error,
}: ResultsGridProps) => {
  const PAGE_SIZE = 9;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset visible slice when the dataset length changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [games.length]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, games.length));
  };

  if (error) {
    return (
      <aside
        role="alert"
        className="rounded-[18px] border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300"
      >
        {error}
      </aside>
    );
  }

  const shouldShowSkeleton = loading && games.length === 0;

  if (!shouldShowSkeleton && games.length === 0) {
    return (
      <p
        role="status"
        className="rounded-[18px] border-2 border-dashed border-gray-200 text-lightgray
         p-[clamp(18px,2vw,26px)] text-center"
      >
        {emptyState ?? "No games to display."}
      </p>
    );
  }

  const items = Array.from({
    length: shouldShowSkeleton
      ? PAGE_SIZE
      : Math.min(visibleCount, games.length),
  }).map((_, idx) => {
    if (shouldShowSkeleton) {
      return <SkeletonCard key={`skeleton-${idx}`} />;
    }
    const game = games[idx];
    if (game) {
      return <Card key={game.id} game={game} />;
    }

    return (
      <li key={`placeholder-${idx}`} className="list-none invisible">
        <div
          className={`${CardChrome} block w-full`}
          style={{ aspectRatio: "16/9" }}
        />
      </li>
    );
  });

  return (
    <>
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        aria-live="polite"
        role="list"
      >
        {items}
      </ul>

      {!shouldShowSkeleton &&
        games.length > 0 &&
        visibleCount < games.length && (
          <section className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className={`text-black dark:text-white px-6 py-2 rounded-full bg-lightpurple dark:bg-darkpurple text-sm md:text-base ${HOVER} ${FOCUS_VISIBLE}`}
              aria-label="Load more games"
            >
              Load more favorites
            </button>
          </section>
        )}
    </>
  );
};
