import type { FeaturedGame } from "@/types/GameTypes";
import { useState } from "react";
import { Link } from "react-router-dom";

// Card + title style constants
const cardClass =
  "relative w-full overflow-hidden rounded-2xl ring-1 " +
  "bg-lightpurple ring-gray " + // light
  "dark:bg-darkpurple dark:ring-darkgray"; // dark

const titleClass =
  "mt-3 line-clamp-1 text-sm font-medium  text-zinc-900 dark:text-zinc-100 text-center";

export default function FeaturedCard({ game }: { game: FeaturedGame }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <Link
      to={`/games/${game.id}`}
      className="group relative w-full mx-auto select-none cursor-pointer
                 max-w-[420px] sm:max-w-none
                 max-[380px]:max-w-[300px]"
      aria-label={game.name}
    >
      <div className={cardClass}>
        <div className="relative w-full aspect-[16/9]">
          {!loaded && !errored && (
            <div className="absolute inset-0 animate-pulse bg-zinc-200/60 dark:bg-zinc-700/40" />
          )}

          <img
            src={game.image}
            alt={game.name}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setErrored(true);
              setLoaded(true);
            }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />

          {errored && (
            <div className="absolute inset-0 grid place-items-center text-xs text-zinc-600 dark:text-zinc-300">
              <span>Image unavailable</span>
            </div>
          )}
        </div>
      </div>

      <h3 className={titleClass}>{game.name}</h3>
    </Link>
  );
}
