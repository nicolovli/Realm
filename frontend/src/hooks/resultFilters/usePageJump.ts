// Provides navigation handlers that can traverse arbitrarily across paginated results using batched cursor fetching.
import { useCallback, useRef, useState } from "react";
import type { ApolloClient } from "@apollo/client";
import { GET_FILTERED_GAMES } from "@/lib/graphql";
import type {
  GamesConnectionData,
  GetFilteredGamesVars,
  CursorEntry,
  GameFilter,
} from "@/types";
import type { SortOptionValue } from "@/constants/resultFiltersConstants";
import {
  JUMP_BATCH_SIZES,
  JUMP_BATCH_THRESHOLDS,
  PAGE_SIZE,
} from "@/constants/resultFiltersConstants";
import { toCursor } from "@/lib/utils/resultFiltersHelpers";

type UsePageJumpArgs = {
  apollo: ApolloClient;
  currentFilter: GameFilter | null;
  sortOption: SortOptionValue;
  order: "asc" | "desc";
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  startTransition: React.TransitionStartFunction;
  searchQuery?: string;
  cursorByPage: React.MutableRefObject<Map<number, CursorEntry>>;
  persistCache: (options?: { currentPage?: number }) => void;
  matchesCountFromCountQuery?: number;
  connectionTotalCount?: number;
};

type UsePageJumpReturn = {
  isJumping: boolean;
  loadingPage: number | null;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handlePageReset: () => void;
  handleGoToPage: (page: number) => Promise<void> | void;
};

const chooseBatchSize = (remaining: number): number => {
  if (remaining > JUMP_BATCH_THRESHOLDS.large) return JUMP_BATCH_SIZES.large;
  if (remaining > JUMP_BATCH_THRESHOLDS.medium) return JUMP_BATCH_SIZES.medium;
  return JUMP_BATCH_SIZES.small;
};

export const usePageJump = ({
  apollo,
  currentFilter,
  sortOption,
  order,
  currentPage,
  setCurrentPage,
  startTransition,
  searchQuery,
  cursorByPage,
  persistCache,
  matchesCountFromCountQuery,
  connectionTotalCount,
}: UsePageJumpArgs): UsePageJumpReturn => {
  const [isJumping, setIsJumping] = useState(false);
  const [loadingPage, setLoadingPage] = useState<number | null>(null);
  const jumpingRef = useRef(false);

  const handleNextPage = useCallback(() => {
    const hasNext = cursorByPage.current.get(currentPage)?.hasNext ?? false;
    if (hasNext) startTransition(() => setCurrentPage((prev) => prev + 1));
  }, [cursorByPage, currentPage, setCurrentPage, startTransition]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      startTransition(() => setCurrentPage((prev) => prev - 1));
    }
  }, [currentPage, setCurrentPage, startTransition]);

  const handlePageReset = useCallback(() => {
    cursorByPage.current.clear();
    persistCache({ currentPage: 1 });
    startTransition(() => setCurrentPage(1));
  }, [cursorByPage, persistCache, setCurrentPage, startTransition]);

  const handleGoToPage = useCallback(
    async (targetPage: number) => {
      const totalMatches =
        typeof connectionTotalCount === "number"
          ? connectionTotalCount
          : (matchesCountFromCountQuery ?? 0);
      const totalPages = Math.max(1, Math.ceil(totalMatches / PAGE_SIZE));
      const target = Math.max(
        1,
        Math.min(totalPages, Math.floor(Number(targetPage) || 1)),
      );

      if (target === currentPage && cursorByPage.current.has(target - 1))
        return;

      if (target === 1 || cursorByPage.current.has(target)) {
        startTransition(() => setCurrentPage(target));
        Promise.allSettled(
          [target - 1, target + 1]
            .filter((page) => page >= 1 && page <= totalPages)
            .map(async (page) => {
              const afterForPage =
                page === 1
                  ? undefined
                  : toCursor(cursorByPage.current.get(page - 1)?.end);
              if (page > 1 && !afterForPage) return;
              await apollo.query<GamesConnectionData, GetFilteredGamesVars>({
                query: GET_FILTERED_GAMES,
                variables: {
                  filter: currentFilter || {},
                  search: searchQuery,
                  sortBy: sortOption,
                  sortOrder: order,
                  first: PAGE_SIZE,
                  after: afterForPage,
                },
                fetchPolicy: "cache-first",
                errorPolicy: "ignore",
              });
            }),
        );
        persistCache();
        return;
      }

      if (jumpingRef.current) return;
      jumpingRef.current = true;
      setIsJumping(true);

      try {
        const visited = [...cursorByPage.current.keys()].filter(
          (page) => page < target,
        );
        const startPage = visited.length ? Math.max(...visited) : 1;
        const deltaPages = target - startPage;

        let afterCursor: string | undefined =
          startPage === 1
            ? undefined
            : toCursor(cursorByPage.current.get(startPage)?.end);

        let remaining = deltaPages;
        let pagePointer = startPage;

        let serverPageCapDetected = false;

        setLoadingPage(target);
        startTransition(() => setCurrentPage(target));

        while (remaining > 0) {
          const takePages = Math.min(remaining, chooseBatchSize(remaining));
          const takeEdges = takePages * PAGE_SIZE;

          const response = await apollo.query<
            GamesConnectionData,
            GetFilteredGamesVars
          >({
            query: GET_FILTERED_GAMES,
            variables: {
              filter: currentFilter || {},
              search: searchQuery,
              sortBy: sortOption,
              sortOrder: order,
              first: takeEdges,
              after: afterCursor,
            },
            fetchPolicy: "network-only",
            errorPolicy: "all",
          });

          const jumpConnection = response.data?.gamesConnection;
          const jumpEdges = jumpConnection?.edges ?? [];

          if (!jumpConnection || jumpEdges.length === 0) {
            const last = cursorByPage.current.get(pagePointer);
            if (last) {
              cursorByPage.current.set(pagePointer, {
                ...last,
                hasNext: false,
              });
            }
            persistCache();
            return;
          }

          const pagesFilled = Math.floor(jumpEdges.length / PAGE_SIZE);
          if (!serverPageCapDetected && pagesFilled === 1 && takePages > 1) {
            serverPageCapDetected = true;
          }

          for (let i = 1; i <= pagesFilled; i++) {
            const edgeIndex = i * PAGE_SIZE - 1;
            const edge = jumpEdges[edgeIndex] as { cursor: string } | undefined;
            if (!edge) break;

            const pageNumber = pagePointer + i - 1;
            cursorByPage.current.set(pageNumber, {
              end: edge.cursor,
              hasNext: true,
            });
          }

          persistCache();

          pagePointer += pagesFilled;
          remaining -= pagesFilled;

          const lastCompletePageIndex = pagesFilled * PAGE_SIZE - 1;
          afterCursor = toCursor(
            (jumpEdges[lastCompletePageIndex] as { cursor?: string })?.cursor,
          );

          if (pagesFilled === 0 || !jumpConnection.pageInfo?.hasNextPage) {
            const lastPageCompleted = pagePointer + pagesFilled - 1;
            const last = cursorByPage.current.get(lastPageCompleted);
            if (last) {
              cursorByPage.current.set(lastPageCompleted, {
                ...last,
                hasNext: false,
              });
            }
            persistCache();
            return;
          }
        }

        try {
          const probe = await apollo.query<
            GamesConnectionData,
            GetFilteredGamesVars
          >({
            query: GET_FILTERED_GAMES,
            variables: {
              filter: currentFilter || {},
              search: searchQuery,
              sortBy: sortOption,
              sortOrder: order,
              first: 1,
              after: toCursor(cursorByPage.current.get(target)?.end),
            },
            fetchPolicy: "network-only",
            errorPolicy: "all",
          });
          const hasNext = !!probe.data?.gamesConnection?.edges?.length;
          const existing = cursorByPage.current.get(target);
          if (existing) {
            cursorByPage.current.set(target, { ...existing, hasNext });
          }
          persistCache();
        } catch {
          console.error("Failed to probe hasNext accuracy");
        }
      } finally {
        jumpingRef.current = false;
        setIsJumping(false);
        setLoadingPage(null);
        persistCache();
      }
    },
    [
      apollo,
      connectionTotalCount,
      currentFilter,
      currentPage,
      cursorByPage,
      matchesCountFromCountQuery,
      order,
      persistCache,
      searchQuery,
      setCurrentPage,
      sortOption,
      startTransition,
    ],
  );

  return {
    isJumping,
    loadingPage,
    handleNextPage,
    handlePrevPage,
    handlePageReset,
    handleGoToPage,
  };
};
