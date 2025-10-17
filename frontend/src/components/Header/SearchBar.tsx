import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_GAMES } from "../../lib/graphql/queries/gameQueries";
import { HOVER } from "../../lib/classNames";
import type { Game } from "../../types/GameTypes";

type SearchGamesData = {
  searchGames: Game[];
};

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  onSearchSubmit?: () => void; // Optional callback when search is submitted
};

// Simple debounce hook to limit operations while typing
const useDebouncedValue = (value: string, delay = 200) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

export const SearchBar = ({
  placeholder = "Search for games, tags, genres...",
  className = "",
  onSearchSubmit,
}: SearchBarProps) => {
  const navigate = useNavigate();

  // Component state management
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(
    () => new Set(),
  ); // Tracks which game images have loaded successfully
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Apollo Client query for searching games
  const [searchGames, { data }] = useLazyQuery<SearchGamesData>(SEARCH_GAMES);

  // Search input processing
  const normalized = useMemo(() => term.trim().toLowerCase(), [term]);
  const debounced = useDebouncedValue(normalized, 200);

  // Execute search when debounced value changes
  useEffect(() => {
    if (debounced && debounced.length > 0) {
      searchGames({
        variables: {
          query: debounced,
          limit: 6,
        },
      });
    }
  }, [debounced, searchGames]);

  // Get game suggestions from GraphQL response
  const suggestions: Game[] = useMemo(() => {
    return data?.searchGames || [];
  }, [data]);

  // Only show dropdown when user has opened it AND there are suggestions to display
  const isOpen = open && suggestions.length > 0;

  // Close dropdown when clicking outside the search component
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Handles form submission - navigates to result page with search query
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      // Navigate to result page with search query
      navigate(`/games?search=${encodeURIComponent(term.trim())}`);
      setOpen(false);
      inputRef.current?.blur(); // Remove focus from input after search
      onSearchSubmit?.(); // Call optional callback
    }
  };

  /**
   * Handles keyboard navigation within the search dropdown
   * - Arrow keys: Navigate through suggestions
   * - Enter: Search current term (or select suggestion if navigated with arrows)
   * - Escape: Close dropdown
   */
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle keyboard navigation through suggestions
    if (open && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        return;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(
          (i) => (i - 1 + suggestions.length) % suggestions.length,
        );
        return;
      } else if (e.key === "Enter" && activeIndex >= 0) {
        // Only select suggestion if user has navigated with arrows (activeIndex changed from 0)
        const hasNavigated = activeIndex !== 0 || suggestions.length === 1;
        if (hasNavigated) {
          e.preventDefault();
          const pick = suggestions[activeIndex];
          if (pick) {
            navigate(`/games/${pick.id}`);
            setTerm(pick.name);
            setOpen(false);
            inputRef.current?.blur(); // Remove focus from input after selection
            onSearchSubmit?.(); // Call optional callback
            return;
          }
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        return;
      }
    }

    // Default Enter behavior: search current term
    if (e.key === "Enter") {
      e.preventDefault();
      if (term.trim()) {
        navigate(`/games?search=${encodeURIComponent(term.trim())}`);
        setOpen(false);
        inputRef.current?.blur(); // Remove focus from input after search
        onSearchSubmit?.(); // Call optional callback
      }
    }
  };

  // Handles clicking on a game suggestion - navigates to game detail page

  const handleGameClick = (game: Game) => {
    navigate(`/games/${game.id}`);
    setTerm(game.name);
    setOpen(false);
    inputRef.current?.blur(); // Remove focus from input after selection
    onSearchSubmit?.(); // Call optional callback
  };

  const handleClear = () => {
    setTerm("");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <section ref={wrapperRef} className={`relative w-full ${className}`}>
      <form
        role="search"
        aria-label="Search games"
        onSubmit={handleSubmit}
        className="relative w-full"
      >
        <div className="relative flex items-center bg-lightsearchbargray dark:bg-darksearchbargray rounded-full shadow-sm overflow-hidden">
          <input
            ref={inputRef}
            aria-label="Search for games"
            placeholder={placeholder}
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setActiveIndex(0); // Reset to first suggestion when typing
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="flex-1 w-full px-4 py-3 outline-none bg-transparent text-black dark:text-white placeholder-lightgray text-sm"
            name="search"
          />

          {/* Clear button - only show when there's text */}
          {term && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 p-3 text-lightgray dark:text-darkgray hover:text-black dark:hover:text-white"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className={`flex-shrink-0 bg-lightbuttonpurple dark:bg-darkbuttonpurple text-white p-3 cursor-pointer ${HOVER}`}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Dropdown with search suggestions - only visible when isOpen is true */}
      {isOpen && (
        <section
          role="listbox"
          aria-label="Search suggestions"
          className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((game, i) => (
            <div
              key={game.id}
              role="option"
              aria-selected={i === activeIndex}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => e.preventDefault()} // Prevents input blur before click
              onClick={() => handleGameClick(game)}
              className={`flex items-center gap-3 p-3 cursor-pointer duration-150 ${
                i === activeIndex
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-lightsearchbargray dark:bg-darksearchbargray"
              } ${HOVER}`}
            >
              {/* Game thumbnail with loading state */}
              <figure className="relative w-12 h-12 flex-shrink-0">
                {!loadedImages.has(game.id) && (
                  <div className="absolute inset-0 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
                )}
                <img
                  src={game.image}
                  alt={game.name}
                  width={48}
                  height={48}
                  className={`w-12 h-12 object-cover rounded duration-200 ${
                    loadedImages.has(game.id) ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() =>
                    setLoadedImages((prev) => {
                      if (prev.has(game.id)) return prev;
                      const next = new Set(prev);
                      next.add(game.id);
                      return next;
                    })
                  }
                />
              </figure>
              {/* Game information display */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-black dark:text-white truncate text-sm">
                  {game.name}
                </p>
                {game.publishers && game.publishers.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {game.publishers[0]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </section>
  );
};

export default SearchBar;
