import type { Game } from "../../types/GameTypes";
import { HOVER, FOCUS_VISIBLE } from "../../lib/classNames";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

const CardChrome =
  "rounded-2xl ring-1 bg-lightpurple ring-gray dark:bg-darkpurple dark:ring-darkgray overflow-hidden";

export const Card = ({
  game,
  onClick,
}: {
  game: Game;
  onClick?: (g: Game) => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Build responsive image sources only if we have an image URL
  const imageSources = useMemo(() => {
    if (!game.image) return null;
    const base = encodeURIComponent(game.image);
    const make = (w: number) =>
      `https://images.weserv.nl/?url=${base}&w=${w}&output=webp`;
    return {
      src: make(640),
      srcSet: `${make(320)} 320w, ${make(480)} 480w, ${make(640)} 640w`,
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    };
  }, [game.image]);

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
                <section className="absolute inset-0 animate-pulse bg-lightsearchbargray dark:bg-darksearchbargray" />
              )}

              {imageSources && (
                <img
                  src={imageSources.src}
                  srcSet={imageSources.srcSet}
                  sizes={imageSources.sizes}
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
              )}

              {(!imageSources || errored) && (
                <section className="absolute inset-0 grid place-items-center text-xs text-zinc-600 dark:text-zinc-300">
                  <span>Image unavailable</span>
                </section>
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
                <span className="absolute inset-0 animate-pulse bg-lightsearchbargray dark:bg-darksearchbargray" />
              )}

              {imageSources && (
                <img
                  src={imageSources.src}
                  srcSet={imageSources.srcSet}
                  sizes={imageSources.sizes}
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
              )}

              {(!imageSources || errored) && (
                <section className="absolute inset-0 grid place-items-center text-xs text-zinc-600 dark:text-zinc-300">
                  <span>Image unavailable</span>
                </section>
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
};
