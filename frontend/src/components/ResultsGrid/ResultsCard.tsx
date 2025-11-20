import type { Game } from "@/types";
import {
  HOVER,
  FOCUS_VISIBLE,
  CARD_BORDER,
  IMAGE_HOVER_GRADIENT,
} from "@/lib/classNames";
import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { buildPreviewState } from "@/lib/utils/images";
import { isCoarsePointer } from "@/lib/isTouch";
import { HeartIcon } from "@/components/HeartIcon";
import { AuthDialog } from "@/components/User";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export const Card = ({
  game,
  onClick,
}: {
  game: Game;
  onClick?: (g: Game) => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { setIsLoggedIn } = useAuthStatus();

  useEffect(() => {
    setIsTouchDevice(isCoarsePointer());
  }, []);

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
      <article className={`rounded-2xl ${CARD_BORDER} overflow-hidden`}>
        {onClick ? (
          <button
            type="button"
            onClick={() => onClick(game)}
            className={`${HOVER} ${FOCUS_VISIBLE} group relative block w-full text-left cursor-pointer`}
            aria-label={`Open ${game.name}`}
            data-cy="result-card"
          >
            <figure
              className={`relative w-full aspect-[16/9] ${IMAGE_HOVER_GRADIENT}`}
            >
              {!isTouchDevice && (
                <section
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-3 right-3 z-20 p-1.5 pt-2 rounded-full bg-white/30 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <HeartIcon
                    gameId={Number(game.id)}
                    size={36}
                    onRequireLogin={() => setAuthOpen(true)}
                  />
                </section>
              )}
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
                  pointer-events-none z-10 absolute inset-x-0 bottom-0
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
            state={buildPreviewState(game.image)}
            className={`${HOVER} ${FOCUS_VISIBLE} group relative block cursor-pointer`}
            aria-label={`Open ${game.name}`}
            data-cy="result-card"
          >
            <figure
              className={`relative w-full aspect-[16/9] ${IMAGE_HOVER_GRADIENT}`}
            >
              {!isTouchDevice && (
                <section
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-3 right-3 z-20 p-1.5 pt-2 rounded-full bg-white/30 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <HeartIcon
                    gameId={Number(game.id)}
                    size={36}
                    onRequireLogin={() => setAuthOpen(true)}
                  />
                </section>
              )}
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
                  pointer-events-none z-10 absolute inset-x-0 bottom-0
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
        <AuthDialog
          open={authOpen}
          onOpenChange={(open) => {
            setAuthOpen(open);
            if (!open && localStorage.getItem("token")) {
              setIsLoggedIn(true);
              window.dispatchEvent(new Event("auth-change"));
            }
          }}
        />
      </article>
    </li>
  );
};
