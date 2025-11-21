// Runs the search suggestions query with debouncing and exposes state for the SearchBar.
import { useEffect, useMemo } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_GAMES } from "@/lib/graphql";
import type { Game } from "@/types";
import { useDebouncedValue } from "@/hooks/search";

type SearchGamesData = {
  searchGames: Game[];
};

type UseSearchSuggestionsOptions = {
  limit?: number;
  enabled?: boolean;
};

export const useSearchSuggestions = (
  term: string,
  { limit = 6, enabled = true }: UseSearchSuggestionsOptions = {},
) => {
  const trimmed = useMemo(() => term.trim(), [term]);
  const debouncedTerm = useDebouncedValue(trimmed, 200);

  const [fetchSuggestions, { data, loading, error }] =
    useLazyQuery<SearchGamesData>(SEARCH_GAMES);

  useEffect(() => {
    if (!enabled || !debouncedTerm) return;

    fetchSuggestions({
      variables: {
        query: debouncedTerm,
        limit,
      },
    });
  }, [debouncedTerm, enabled, fetchSuggestions, limit]);

  const suggestions = debouncedTerm ? (data?.searchGames ?? []) : [];

  return {
    suggestions,
    loading,
    error,
    debouncedTerm,
  };
};
