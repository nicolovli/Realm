// Executes the primary games connection query and neighbor prefetches while updating the cursor cache.

import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_FILTERED_GAMES } from "@/lib/graphql";
import type {
  GamesConnectionData,
  GetFilteredGamesVars,
  CursorEntry,
  Game,
  GameFilter,
} from "@/types";
import type { SortOptionValue } from "@/constants/resultFiltersConstants";
import {
  GAMES_NEIGHBOR_PREFETCH_POLICY,
  GAMES_PAGE_QUERY_POLICY,
  PAGE_SIZE,
} from "@/constants/resultFiltersConstants";
import { toCursor } from "@/lib/utils/resultFiltersHelpers";

type UseGamesPageQueryArgs = {
  currentFilter: GameFilter | null;
  sortOption: SortOptionValue;
  order: "asc" | "desc";
  currentPage: number;
  searchQuery?: string;
  cursorByPage: React.RefObject<Map<number, CursorEntry>>;
  persistCache: (options?: { currentPage?: number }) => void;
};

type GamesConnection = NonNullable<GamesConnectionData["gamesConnection"]>;
type GamesPageInfo = GamesConnection["pageInfo"];

type UseGamesPageQueryReturn = {
  connection: GamesConnection | undefined;
  games: Game[];
  gamesLoading: boolean;
  gamesError?: string;
  pageInfo: GamesPageInfo | undefined;
  shouldJumpToPage: boolean;
};

export const useGamesPageQuery = ({
  currentFilter,
  sortOption,
  order,
  currentPage,
  searchQuery,
  cursorByPage,
  persistCache,
}: UseGamesPageQueryArgs): UseGamesPageQueryReturn => {
  const after =
    currentPage === 1
      ? undefined
      : toCursor(cursorByPage.current.get(currentPage - 1)?.end);

  const shouldJumpToPage = currentPage > 1 && !after;

  const {
    data: pageConn,
    loading: gamesLoading,
    error: gamesError,
  } = useQuery<GamesConnectionData, GetFilteredGamesVars>(GET_FILTERED_GAMES, {
    variables: {
      filter: currentFilter || {},
      search: searchQuery,
      sortBy: sortOption,
      sortOrder: order,
      first: PAGE_SIZE,
      after,
    },
    skip: shouldJumpToPage,
    ...GAMES_PAGE_QUERY_POLICY,
  });

  const connection = useMemo(() => {
    const maybe = pageConn?.gamesConnection;
    if (!maybe) return undefined;
    if (typeof maybe.totalCount !== "number") return undefined;
    return maybe as GamesConnection;
  }, [pageConn]);

  const pageInfo = connection?.pageInfo;

  useEffect(() => {
    if (!connection || !pageInfo) return;
    cursorByPage.current.set(currentPage, {
      end: pageInfo.endCursor ?? null,
      hasNext: !!pageInfo.hasNextPage,
    });
    persistCache();
  }, [connection, pageInfo, currentPage, cursorByPage, persistCache]);

  const nextAfter = useMemo(() => toCursor(pageInfo?.endCursor), [pageInfo]);
  useQuery<GamesConnectionData, GetFilteredGamesVars>(GET_FILTERED_GAMES, {
    variables: {
      filter: currentFilter || {},
      search: searchQuery,
      sortBy: sortOption,
      sortOrder: order,
      first: PAGE_SIZE,
      after: nextAfter,
    },
    skip: !nextAfter,
    ...GAMES_NEIGHBOR_PREFETCH_POLICY,
  });

  const prevEndRaw =
    currentPage > 2
      ? cursorByPage.current.get(currentPage - 2)?.end
      : undefined;
  const prevAfter = toCursor(prevEndRaw);

  useQuery<GamesConnectionData, GetFilteredGamesVars>(GET_FILTERED_GAMES, {
    variables: {
      filter: currentFilter || {},
      search: searchQuery,
      sortBy: sortOption,
      sortOrder: order,
      first: PAGE_SIZE,
      after: prevAfter,
    },
    skip: currentPage <= 1 || !prevAfter,
    ...GAMES_NEIGHBOR_PREFETCH_POLICY,
  });

  const games: Game[] = useMemo(() => {
    const edges = connection?.edges ?? [];
    if (!edges.length) return [];
    return edges
      .map((edge) => edge?.node)
      .filter((node): node is Game => !!node)
      .map((node) => ({
        ...node,
        descriptionShort: node.descriptionShort ?? undefined,
        image: node.image ?? undefined,
        publishedStore: node.publishedStore ?? undefined,
      }));
  }, [connection]);

  return {
    connection,
    pageInfo,
    games,
    gamesLoading,
    gamesError: gamesError?.message,
    shouldJumpToPage,
  };
};
