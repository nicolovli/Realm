// Public hook that composes result filter state, data, and pagination logic into one consumer-facing API.

import { useCallback } from "react";
import type {
  UseResultFiltersDataReturn,
  UseResultFiltersPaginationReturn,
  FilterKey,
} from "@/types";
import {
  useResultFiltersState,
  useResultFiltersData,
  useResultFiltersPagination,
} from "@/hooks/resultFilters";
import { defaultSelection } from "@/lib/utils/resultFiltersHelpers";

export {
  FILTER_GROUPS,
  SORT_OPTIONS,
} from "@/constants/resultFiltersConstants";

type ResultFiltersData = UseResultFiltersDataReturn;
type ResultFiltersPagination = UseResultFiltersPaginationReturn;

export const useResultFilters = (searchQuery?: string) => {
  const {
    selectedFilters,
    setSelectedFilters,
    sortOption,
    setSortOption,
    order,
    setOrder,
    currentPage,
    setCurrentPage,
    isPending,
    startTransition,
  } = useResultFiltersState(searchQuery);

  const {
    currentFilter,
    filters,
    filtersWithAvailability,
    availableGroups,
    activeFilterEntries,
    hasActiveFilters,
    matchesCountFromCountQuery,
    loadingFilters,
    loadingCount,
    filtersReady,
  }: ResultFiltersData = useResultFiltersData({
    selectedFilters,
    searchQuery,
  });

  const {
    games,
    gamesLoading,
    gamesError,
    totalPages,
    canPrev,
    canNext,
    matchesCount,
    isJumping,
    loadingPage,
    handleNextPage,
    handlePrevPage,
    handleGoToPage,
    handlePageReset,
  }: ResultFiltersPagination = useResultFiltersPagination({
    currentFilter,
    sortOption,
    order,
    currentPage,
    setCurrentPage,
    startTransition,
    searchQuery,
    selectedFilters,
    matchesCountFromCountQuery,
  });

  const handleOptionToggle = useCallback(
    (group: FilterKey, option: string) => {
      setSelectedFilters((prev) => {
        if (option === "All")
          return prev[group].length === 0 ? prev : { ...prev, [group]: [] };
        const exists = prev[group].includes(option);
        const updated = exists
          ? prev[group].filter((value) => value !== option)
          : [...prev[group], option];
        return { ...prev, [group]: updated };
      });
    },
    [setSelectedFilters],
  );

  const handleRemoveSelection = useCallback(
    (group: FilterKey, option: string) => {
      setSelectedFilters((prev) => {
        if (!prev[group].includes(option)) return prev;
        return {
          ...prev,
          [group]: prev[group].filter((value) => value !== option),
        };
      });
    },
    [setSelectedFilters],
  );

  const handleClearAll = useCallback(() => {
    setSelectedFilters(defaultSelection());
  }, [setSelectedFilters]);

  const isLoading = loadingFilters || loadingCount || gamesLoading;

  return {
    filters,
    filtersWithAvailability,
    selectedFilters,
    availableGroups,
    activeFilterEntries,
    hasActiveFilters,
    handleOptionToggle,
    handleRemoveSelection,
    handleClearAll,
    games,
    nextPageGames: [],
    gamesLoading,
    totalPages,
    currentPage,
    canPrev,
    canNext,
    handleNextPage,
    handlePrevPage,
    handleGoToPage,
    handlePageReset,
    matchesCount,
    sortOption,
    setSortOption,
    order,
    setOrder,
    isLoading,
    isPending,
    isJumping,
    loadingPage,
    filtersReady,
    filterError: undefined,
    countError: undefined,
    gamesError,
  };
};
