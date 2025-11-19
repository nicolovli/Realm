import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchBarInput, SearchSuggestionList } from "@/components/Header";
import type { Game } from "@/types";
import { useSearchSuggestions } from "@/hooks/search";
import { buildPreviewState } from "@/lib/utils/images";
import { toast } from "sonner";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  onSearchSubmit?: () => void;
};

export const SearchBar = ({
  placeholder = "Search for games, tags or publishers...",
  className = "",
  onSearchSubmit,
}: SearchBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    suggestions,
    loading: searchLoading,
    error: searchError,
    debouncedTerm,
  } = useSearchSuggestions(term);

  useEffect(() => {
    if (location.pathname.startsWith("/games")) {
      const params = new URLSearchParams(
        location.search || window.location.search,
      );
      const value = params.get("search") ?? "";
      setTerm(value);
    } else {
      setTerm("");
      setOpen(false);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions]);

  const performSearch = (searchTerm: string) => {
    const params = new URLSearchParams(
      location.search || window.location.search,
    );
    params.set("search", searchTerm);
    params.set("page", "1");

    navigate(`/games?${params.toString()}`);
    setOpen(false);
    inputRef.current?.blur();
    onSearchSubmit?.();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = term.trim();
    if (trimmed.length < 3) {
      toast.error("Please enter at least 3 characters to search.");
      return;
    }
    if (trimmed) performSearch(trimmed);
  };

  const handleInputChange = (value: string) => {
    setTerm(value);
    setActiveIndex(0);
    setOpen(true);
  };

  const handleGameClick = (game: Game) => {
    navigate(`/games/${game.id}`, {
      state: buildPreviewState(game.image),
    });
    setTerm(game.name);
    setOpen(false);
    inputRef.current?.blur();
    onSearchSubmit?.();
  };

  const handleClear = () => {
    setTerm("");
    setOpen(false);
    inputRef.current?.focus();

    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    navigate(`/games?${params.toString()}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (open && suggestions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % suggestions.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(
          (index) => (index - 1 + suggestions.length) % suggestions.length,
        );
        return;
      }

      if (event.key === "Enter") {
        const hasNavigated = activeIndex !== 0 || suggestions.length === 1;
        if (hasNavigated) {
          event.preventDefault();
          const pick = suggestions[activeIndex];
          if (pick) {
            handleGameClick(pick);
            return;
          }
        }
      }

      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const trimmed = term.trim();
      if (trimmed.length < 3) {
        toast.error("Please enter at least 3 characters to search.");
        return;
      }
      if (trimmed) performSearch(trimmed);
    }
  };

  return (
    <section ref={wrapperRef} className={`relative w-full ${className}`}>
      <form
        role="search"
        aria-label="Search games"
        data-cy="search-input"
        onSubmit={handleSubmit}
        className="relative w-full"
      >
        <SearchBarInput
          term={term}
          placeholder={placeholder}
          inputRef={inputRef}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onClear={handleClear}
        />
      </form>
      <SearchSuggestionList
        isOpen={open}
        suggestions={suggestions}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        onSuggestionClick={handleGameClick}
        loading={searchLoading}
        error={searchError}
        debouncedTerm={debouncedTerm}
      />
    </section>
  );
};
