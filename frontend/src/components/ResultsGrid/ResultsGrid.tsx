import type { ResultsGridProps } from "@/types/ResultGridTypes";
import type { Game } from "../../types/GameTypes";
import { HOVER, FOCUS_VISIBLE } from "../../lib/classNames";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const CardChrome =
  "rounded-2xl ring-1 bg-lightpurple ring-gray dark:bg-darkpurple dark:ring-darkgray overflow-hidden";

function Card({ game, onClick }: { game: Game; onClick?: (g: Game) => void }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <li className="list-none">
      <article className={CardChrome}>
        {onClick ? (
          <button
            type="button"
            onClick={() => onClick(game)}
            className={`${HOVER} ${FOCUS_VISIBLE} group relative block w-full text-left cursor-pointer`}
            aria-label={`Open ${game.name}`}
          >
            <figure className="relative w-full aspect-[16/9]">
              {/* loading shimmer  */}
              {!loaded && !errored && (
                <div className="absolute inset-0 animate-pulse bg-lightsearchbargray dark:bg-darksearchbargray" />
              )}

              <img
                src={game.image}
                alt={game.name}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => {
                  setErrored(true);
                  setLoaded(true);
                }}
                className="
                  absolute inset-0 h-full w-full object-cover
                  transition-transform duration-300
                  group-hover:scale-[1.03]
                "
              />

              {errored && (
                <div className="absolute inset-0 grid place-items-center text-xs text-zinc-600 dark:text-zinc-300">
                  <span>Image unavailable</span>
                </div>
              )}

              {/* Fade-in name on hover/focus */}
              <figcaption
                className="
                  pointer-events-none absolute inset-x-0 bottom-0
                  p-3 text-white text-sm font-semibold
                  opacity-0 duration-200
                  group-hover:opacity-100 group-focus-visible:opacity-100
                  bg-gradient-to-t from-black/70 via-black/30 to-transparent
                "
              >
                <span className="block line-clamp-1">{game.name}</span>
              </figcaption>
            </figure>
          </button>
        ) : (
          <Link
            to={`/games/${game.id}`}
            className={`${HOVER} ${FOCUS_VISIBLE} group relative block cursor-pointer`}
            aria-label={`Open ${game.name}`}
          >
            <figure className="relative w-full aspect-[16/9]">
              {!loaded && !errored && (
                <div className="absolute inset-0 animate-pulse bg-lightsearchbargray dark:bg-darksearchbargray" />
              )}

              <img
                src={game.image}
                alt={game.name}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => {
                  setErrored(true);
                  setLoaded(true);
                }}
                className="
                  absolute inset-0 h-full w-full object-cover
                  transition-transform duration-300
                  group-hover:scale-[1.03]
                "
              />

              {errored && (
                <div className="absolute inset-0 grid place-items-center text-xs text-zinc-600 dark:text-zinc-300">
                  <span>Image unavailable</span>
                </div>
              )}

              <figcaption
                className="
                  pointer-events-none absolute inset-x-0 bottom-0
                  p-3 text-white text-sm font-semibold
                  opacity-0 duration-200
                  group-hover:opacity-100 group-focus-visible:opacity-100
                  bg-gradient-to-t from-black/70 via-black/30 to-transparent
                "
              >
                <span className="block line-clamp-1">{game.name}</span>
              </figcaption>
            </figure>
          </Link>
        )}
      </article>
    </li>
  );
}

function SkeletonCard() {
  return (
    <li className="list-none">
      <div className={`${CardChrome} animate-pulse`}>
        <div className="relative w-full aspect-[16/9] bg-lightsearchbargray dark:bg-darksearchbargray rounded-xl" />
      </div>
    </li>
  );
}

export default function ResultsGrid({
  games,
  loading,
  emptyState,
  error,
}: ResultsGridProps) {
  // Delayed skeleton so that filters can load
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => setShowSkeleton(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

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

  if (!loading && !showSkeleton && games.length === 0) {
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

  return (
    <ul
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      aria-live="polite"
      role="list"
    >
      {loading || showSkeleton
        ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
        : games.map((g) => <Card key={g.id} game={g} />)}
    </ul>
  );
}
