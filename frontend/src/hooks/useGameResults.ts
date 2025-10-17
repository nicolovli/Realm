// src/hooks/useGameResults.ts
import { useQuery } from "@apollo/client/react";
import { GET_FILTERED_GAMES } from "../lib/graphql/queries/filterQueries";
import type { SelectedFilters } from "../types/FilterTypes";
import type { FilteredGamesData } from "../types/GraphQLTypes";

type UseGameResultsOptions = {
  selectedFilters: SelectedFilters;
  sortOption: string;
  take?: number;
  after?: string;
};

export function useGameResults({
  selectedFilters,
  take = 20,
  after,
}: UseGameResultsOptions) {
  // Fetch games using existing backend API
  const { data, loading, error, fetchMore } = useQuery<FilteredGamesData>(
    GET_FILTERED_GAMES,
    {
      variables: {
        filter: {
          genres:
            selectedFilters.genres.length > 0
              ? selectedFilters.genres
              : undefined,
          tags:
            selectedFilters.tags.length > 0 ? selectedFilters.tags : undefined,
          categories:
            selectedFilters.categories.length > 0
              ? selectedFilters.categories
              : undefined,
          platforms:
            selectedFilters.platforms.length > 0
              ? selectedFilters.platforms
              : undefined,
          publishers:
            selectedFilters.publisher.length > 0
              ? selectedFilters.publisher
              : undefined,
        },
        take,
        after,
      },
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
  );

  // Pagination handler
  const loadMore = async () => {
    if (!data?.games.length) return;

    const lastGame = data.games[data.games.length - 1];
    await fetchMore({
      variables: {
        after: lastGame.id,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          ...fetchMoreResult,
          games: [...prev.games, ...fetchMoreResult.games],
        };
      },
    });
  };

  return {
    games: data?.games ?? [],
    totalCount: data?.games?.length ?? 0, // Backend does not return totalCount yet
    loading,
    error,
    loadMore,
    hasMore: (data?.games?.length ?? 0) >= take, // Simple check for now
  };
}
