// Orchestrates paginated game retrieval by wiring cache, queries, and jump handlers together.

import { useEffect, useMemo, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import type {
  UseResultFiltersPaginationArgs,
  UseResultFiltersPaginationReturn,
} from "@/types";
import { PAGE_SIZE } from "@/constants/resultFiltersConstants";
import { buildCacheKey } from "@/lib/utils/resultFiltersHelpers";
import {
  useCursorCache,
  useGamesPageQuery,
  usePageJump,
} from "@/hooks/resultFilters";

export const useResultFiltersPagination = ({
  currentFilter,
  sortOption,
  order,
  currentPage,
  setCurrentPage,
  startTransition,
  searchQuery,
  selectedFilters,
  matchesCountFromCountQuery,
}: UseResultFiltersPaginationArgs): UseResultFiltersPaginationReturn => {
  const apollo = useApolloClient();

  const cacheKey = useMemo(
    () => buildCacheKey(selectedFilters, sortOption, order, searchQuery),
    [selectedFilters, sortOption, order, searchQuery],
  );

  const { cursorByPage, persist, clear } = useCursorCache({
    cacheKey,
    currentPage,
  });

  const datasetSignature = useMemo(
    () =>
      JSON.stringify({
        selectedFilters,
        sortOption,
        order,
        searchQuery,
      }),
    [selectedFilters, sortOption, order, searchQuery],
  );

  const prevSignatureRef = useRef<string>("");
  useEffect(() => {
    if (
      prevSignatureRef.current &&
      prevSignatureRef.current !== datasetSignature
    ) {
      clear({ resetPage: 1 });
      startTransition(() => setCurrentPage(1));
    }
    prevSignatureRef.current = datasetSignature;
  }, [datasetSignature, clear, setCurrentPage, startTransition]);

  const { pageInfo, games, gamesLoading, gamesError, shouldJumpToPage } =
    useGamesPageQuery({
      currentFilter,
      sortOption,
      order,
      currentPage,
      searchQuery,
      cursorByPage,
      persistCache: persist,
    });

  const {
    isJumping,
    loadingPage,
    handleNextPage,
    handlePrevPage,
    handlePageReset,
    handleGoToPage,
  } = usePageJump({
    apollo,
    currentFilter,
    sortOption,
    order,
    currentPage,
    setCurrentPage,
    startTransition,
    searchQuery,
    cursorByPage,
    persistCache: persist,
    matchesCountFromCountQuery,
  });

  useEffect(() => {
    if (currentPage > 1 && shouldJumpToPage && matchesCountFromCountQuery) {
      void handleGoToPage(currentPage);
    }
  }, [
    currentPage,
    shouldJumpToPage,
    matchesCountFromCountQuery,
    handleGoToPage,
  ]);

  const matchesCount = useMemo(
    () => matchesCountFromCountQuery ?? 0,
    [matchesCountFromCountQuery],
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(matchesCount / PAGE_SIZE)),
    [matchesCount],
  );

  const canNext =
    pageInfo?.hasNextPage ??
    cursorByPage.current.get(currentPage)?.hasNext ??
    false;

  const canPrev = currentPage > 1;

  return {
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
  };
};
