import { FOCUS_VISIBLE, CARD_BORDER, SHADOW_SM } from "@/lib/classNames";
import { buildPreviewState, buildSrcSet } from "@/lib/utils/images";
import type { FeaturedGame } from "@/types";
import { memo, useState } from "react";
import { Link } from "react-router-dom";

const cardClass = `relative w-full overflow-hidden rounded-2xl ${CARD_BORDER} ${SHADOW_SM}`;

const containerClass =
  "group relative block w-full mx-auto select-none cursor-pointer sm:max-w-none max-[380px]:max-w-[300px] rounded-2xl ml-1";

const titleClass =
  "mt-2 px-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 text-center truncate";

export const FeaturedCard = memo(
  ({
    game,
    "data-cy": dataCy,
    priority,
  }: {
    game: FeaturedGame;
    "data-cy"?: string;
    priority?: boolean;
  }) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    const imageSet = game.image
      ? buildSrcSet(game.image, [320, 480, 640, 800])
      : null;

    return (
      <Link
        to={`/games/${game.id}`}
        state={buildPreviewState(game.image, 800)}
        aria-label={game.name}
        data-cy={dataCy}
        className={containerClass + FOCUS_VISIBLE}
      >
        <figure className={cardClass}>
          <section className="relative w-full aspect-[16/9]">
            {imageSet && !loaded && !errored && (
              <span
                className="absolute inset-0 animate-pulse bg-zinc-200/60 dark:bg-zinc-700/40"
                aria-hidden
              />
            )}

            {imageSet && (
              <img
                src={imageSet.src}
                srcSet={imageSet.srcSet}
                sizes={imageSet.sizes}
                alt={`Picure of game: ${game.name}`}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : undefined}
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => {
                  setErrored(true);
                  setLoaded(true);
                }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            )}

            {(!imageSet || errored) && (
              <figcaption className="absolute inset-0 grid place-items-center text-xs text-zinc-600 dark:text-zinc-300">
                <span>Image unavailable</span>
              </figcaption>
            )}
          </section>
        </figure>

        <h3 className={titleClass}>{game.name}</h3>
      </Link>
    );
  },
  (prev, next) =>
    prev.game.id === next.game.id &&
    prev.game.name === next.game.name &&
    prev.game.image === next.game.image,
);
