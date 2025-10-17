/**
 * Simplified hook for filter management with backend integration
 * Handles filter options, selected filters, game counting, and pagination
 */
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  GET_FILTER_OPTIONS,
  GET_TOTAL_GAMES_COUNT,
  GET_FILTERED_GAMES,
  GET_AVAILABLE_FILTER_OPTIONS,
} from "../lib/graphql/queries/filterQueries";
import type { GameFilter } from "../types/GameTypes";
import type {
  FilterKey,
  FiltersMap,
  SelectedFilters,
} from "../types/FilterTypes";
import type {
  FilterOptionsData,
  GamesCountData,
  FilteredGamesData,
  AvailableFilterOptionsData,
  AvailableFilterOptionsVariables,
} from "../types/GraphQLTypes";

export const FILTER_GROUPS = [
  { key: "genres", label: "Genres" },
  { key: "tags", label: "Tags" },
  { key: "categories", label: "Categories" },
  { key: "platforms", label: "Platforms" },
  { key: "publisher", label: "Top Publishers" },
] as const;

export const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "release-date", label: "Release date" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "rating", label: "Rating" },
] as const;

const defaultSelection = (): SelectedFilters => ({
  genres: [],
  tags: [],
  categories: [],
  platforms: [],
  publisher: [],
});

function toSorted(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

export function useResultFilters(searchQuery?: string) {
  // Core state
  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(defaultSelection);
  const [sortOption, setSortOption] =
    useState<(typeof SORT_OPTIONS)[number]["value"]>("popularity");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 9; // 3x3 grid

  // Build filter for backend
  const currentFilter: GameFilter | null = useMemo(() => {
    const hasFilters = Object.values(selectedFilters).some(
      (arr) => arr.length > 0,
    );
    if (!hasFilters) return null;

    return {
      ...(selectedFilters.genres.length > 0 && {
        genres: selectedFilters.genres,
      }),
      ...(selectedFilters.tags.length > 0 && { tags: selectedFilters.tags }),
      ...(selectedFilters.categories.length > 0 && {
        categories: selectedFilters.categories,
      }),
      ...(selectedFilters.platforms.length > 0 && {
        platforms: selectedFilters.platforms,
      }),
      ...(selectedFilters.publisher.length > 0 && {
        publishers: selectedFilters.publisher,
      }),
    };
  }, [selectedFilters]);

  // 1. Get all filter options (cached, runs once)
  const { data: filterData, loading: loadingFilters } =
    useQuery<FilterOptionsData>(GET_FILTER_OPTIONS, {
      fetchPolicy: "cache-first",
      errorPolicy: "ignore",
    });

  // 2. Get available filter options based on current selection + search
  const { data: availableOptionsData } = useQuery<
    AvailableFilterOptionsData,
    AvailableFilterOptionsVariables
  >(GET_AVAILABLE_FILTER_OPTIONS, {
    variables: { currentFilter: currentFilter || {}, search: searchQuery },
    skip: !currentFilter && !searchQuery,
    fetchPolicy: "cache-first",
    errorPolicy: "ignore",
  });

  // 3. Get games count
  const { data: countData, loading: loadingCount } = useQuery<GamesCountData>(
    GET_TOTAL_GAMES_COUNT,
    {
      variables: { filter: currentFilter, search: searchQuery },
      fetchPolicy: "cache-first",
    },
  );

  // 4. Get current page games
  const { data: gamesData, loading: gamesLoading } =
    useQuery<FilteredGamesData>(GET_FILTERED_GAMES, {
      variables: {
        filter: currentFilter,
        search: searchQuery,
        take: pageSize,
        after: currentPage - 1,
        sortBy: sortOption,
      },
      fetchPolicy: "cache-first",
      skip: !filterData,
    });

  // 5. Preload next page for better UX
  const { data: nextPageData } = useQuery<FilteredGamesData>(
    GET_FILTERED_GAMES,
    {
      variables: {
        filter: currentFilter,
        search: searchQuery,
        take: pageSize,
        after: currentPage * pageSize,
        sortBy: sortOption,
      },
      fetchPolicy: "cache-first",
      skip:
        !filterData || !gamesData?.games || gamesData.games.length < pageSize,
    },
  );

  // Build filters map from backend data
  const filters = useMemo((): FiltersMap => {
    if (!filterData?.filterOptions)
      return {
        genres: [],
        tags: [],
        categories: [],
        platforms: [],
        publisher: [],
      };

    const options = filterData.filterOptions;
    return {
      genres: toSorted(
        (options.genres || []).map((g) => g.name).filter(Boolean),
      ),
      tags: toSorted((options.tags || []).map((t) => t.name).filter(Boolean)),
      categories: toSorted(
        (options.categories || []).map((c) => c.name).filter(Boolean),
      ),
      platforms: toSorted(
        (options.platforms || []).map((p) => p.name).filter(Boolean),
      ),
      publisher: toSorted(
        (options.publishers || []).map((p) => p.name).filter(Boolean),
      ),
    };
  }, [filterData]);

  // Combine filters with availability information
  const filtersWithAvailability = useMemo(() => {
    if (!availableOptionsData?.availableFilterOptions) {
      const defaultDisabled = !!searchQuery;
      return Object.entries(filters).reduce(
        (acc, [key, options]) => {
          acc[key as FilterKey] = options.map((option) => ({
            name: option,
            disabled: defaultDisabled,
          }));
          return acc;
        },
        {} as Record<FilterKey, Array<{ name: string; disabled: boolean }>>,
      );
    }

    const available = availableOptionsData.availableFilterOptions;
    return Object.entries(filters).reduce(
      (acc, [key, options]) => {
        const filterKey = key as FilterKey;
        const backendKey = filterKey === "publisher" ? "publishers" : filterKey;
        const availableSet = new Set(
          available[backendKey as keyof typeof available] || [],
        );

        acc[filterKey] = options.map((option) => {
          // If no filter is chosen in this group, use backend availability
          if (selectedFilters[filterKey].length === 0) {
            return {
              name: option,
              disabled: !availableSet.has(option),
            };
          }
          // If there is a selected filter, only enable if this value is selected or if it can be combined with all other selected
          return {
            name: option,
            disabled:
              !selectedFilters[filterKey].includes(option) &&
              !availableSet.has(option),
          };
        });
        return acc;
      },
      {} as Record<FilterKey, Array<{ name: string; disabled: boolean }>>,
    );
  }, [filters, availableOptionsData, selectedFilters, searchQuery]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, sortOption, searchQuery]);

  // Event handlers
  const handleOptionToggle = (group: FilterKey, option: string) => {
    setSelectedFilters((prev) => {
      if (option === "All")
        return prev[group].length === 0 ? prev : { ...prev, [group]: [] };
      const current = prev[group];
      const exists = current.includes(option);
      const updated = exists
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [group]: updated };
    });
  };

  const handleRemoveSelection = (group: FilterKey, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group];
      if (!current.includes(option)) return prev;
      return { ...prev, [group]: current.filter((v) => v !== option) };
    });
  };

  const handleClearAll = () => setSelectedFilters(defaultSelection());

  // Pagination handlers
  const handleNextPage = () => {
    const hasCurrentPageGames =
      gamesData?.games && gamesData.games.length >= pageSize;
    const hasPreloadedGames =
      nextPageData?.games && nextPageData.games.length > 0;
    if (hasCurrentPageGames || hasPreloadedGames) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handlePageReset = () => setCurrentPage(1);

  // Derived values
  const matchesCount = countData?.gamesCount ?? 0;
  const totalPages = Math.ceil(matchesCount / pageSize);
  const activeFilterEntries = FILTER_GROUPS.flatMap(({ key, label }) =>
    selectedFilters[key].map((value) => ({ key, label, value })),
  );
  const hasActiveFilters = activeFilterEntries.length > 0;
  const availableGroups = loadingFilters
    ? FILTER_GROUPS // Show all groups while loading
    : FILTER_GROUPS.filter(({ key }) => filters[key].length > 0);

  return {
    // Filter management
    filters,
    filtersWithAvailability,
    selectedFilters,
    availableGroups,
    activeFilterEntries,
    hasActiveFilters,
    handleOptionToggle,
    handleRemoveSelection,
    handleClearAll,

    // Game data
    games: gamesData?.games || [], // Games for this page (max 9)
    nextPageGames: nextPageData?.games || [], // Preloaded games for next page (9 games)
    gamesLoading, // Loading state for games
    totalPages, // Total number of pages
    currentPage, // Current page
    handleNextPage, // Go to next page
    handlePrevPage, // Go to previous page
    handlePageReset, // Reset to page 1

    // Other state
    matchesCount,
    sortOption,
    setSortOption,
    isLoading: loadingFilters || loadingCount || gamesLoading,
    filtersReady: !loadingFilters && !!filterData,
    filterError: undefined, // Error ignored due to errorPolicy
    countError: undefined, // Error ignored due to errorPolicy
  };
}
