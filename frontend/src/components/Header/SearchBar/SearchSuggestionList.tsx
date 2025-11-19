import { useState } from "react";
import type { MouseEvent } from "react";
import { HOVER } from "@/lib/classNames";
import type { Game } from "@/types";

type SearchSuggestionListProps = {
  isOpen: boolean;
  suggestions: Game[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSuggestionClick: (game: Game) => void;
  loading: boolean;
  error?: Error;
  debouncedTerm: string;
};

export const SearchSuggestionList = ({
  isOpen,
  suggestions,
  activeIndex,
  onActiveIndexChange,
  onSuggestionClick,
  loading,
  error,
  debouncedTerm,
}: SearchSuggestionListProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<number | string>>(
    () => new Set(),
  );

  if (!isOpen) {
    return null;
  }

  const markImageLoaded = (id: number | string) => {
    setLoadedImages((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const hasTerm = debouncedTerm.length > 0;
  const shortTerm = debouncedTerm.length < 3;

  const getMessage = () => {
    if (error) {
      console.error(error);
      return "Could not load search results. Try again.";
    }
    if (!hasTerm) return "Start typing to search for games...";
    if (loading) return "Searching...";
    if (shortTerm) return "Please enter at least 3 characters.";
    if (suggestions.length === 0)
      return `No games found for "${debouncedTerm}"`;
    return null;
  };

  const message = getMessage();

  if (message) {
    return (
      <section
        role="listbox"
        aria-label="Search suggestions"
        className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto"
      >
        <p className="p-4 text-base text-gray-500 dark:text-gray-400 bg-lightsearchbargray dark:bg-darksearchbargray">
          {message}
        </p>
      </section>
    );
  }

  return (
    <section
      role="listbox"
      aria-label="Search suggestions"
      className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto"
    >
      {suggestions.map((game, index) => {
        const isActive = index === activeIndex;
        const encoded = game.image ? encodeURIComponent(game.image) : null;
        const src =
          encoded &&
          `https://images.weserv.nl/?url=${encoded}&w=96&output=webp`;
        const srcSet =
          encoded &&
          `https://images.weserv.nl/?url=${encoded}&w=48&output=webp 1x, https://images.weserv.nl/?url=${encoded}&w=96&output=webp 2x`;
        const hasLoaded = loadedImages.has(game.id);

        return (
          <button
            key={game.id}
            role="option"
            type="button"
            aria-selected={isActive}
            onMouseEnter={() => onActiveIndexChange(index)}
            onMouseDown={(event: MouseEvent<HTMLButtonElement>) =>
              event.preventDefault()
            }
            onClick={() => onSuggestionClick(game)}
            className={`flex w-full items-center gap-3 p-3 text-left cursor-pointer duration-150 ${
              isActive
                ? "bg-gray-200 dark:bg-gray-700"
                : "bg-lightsearchbargray dark:bg-darksearchbargray"
            } ${HOVER}`}
          >
            <figure className="relative w-12 h-12 flex-shrink-0">
              {!hasLoaded && (
                <span className="absolute inset-0 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
              )}
              {src ? (
                <img
                  src={src}
                  srcSet={srcSet ?? undefined}
                  alt={game.name}
                  width={48}
                  height={48}
                  className={`w-12 h-12 object-cover rounded duration-200 ${
                    hasLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => markImageLoaded(game.id)}
                  onError={() => markImageLoaded(game.id)}
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-[10px] text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded">
                  N/A
                </span>
              )}
            </figure>
            <span className="flex-1 min-w-0">
              <p className="font-medium text-black dark:text-white truncate text-sm">
                {game.name}
              </p>
              {game.publishers?.length ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {game.publishers[0]}
                </p>
              ) : null}
            </span>
          </button>
        );
      })}
    </section>
  );
};
