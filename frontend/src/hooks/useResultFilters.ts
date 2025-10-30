import { useEffect, useMemo, useState, useRef, useTransition } from "react";
import { useQuery, useApolloClient } from "@apollo/client/react";
import {
  GET_FILTER_OPTIONS,
  GET_TOTAL_GAMES_COUNT,
  GET_AVAILABLE_FILTER_OPTIONS,
} from "../lib/graphql/queries/filterQueries";
import { GET_FILTERED_GAMES_CURSOR } from "../lib/graphql/queries/cursorQueries";
import type { GameFilter, Game } from "../types/GameTypes";
import type {
  FilterKey,
  FiltersMap,
  SelectedFilters,
} from "../types/FilterTypes";
import type {
  FilterOptionsData,
  GamesCountData,
  AvailableFilterOptionsData,
  AvailableFilterOptionsVariables,
  GamesConnectionData,
  GetFilteredGamesCursorVars,
} from "../types/GraphQLTypes";
import { useLocation, useNavigate } from "react-router-dom";

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

const PAGE_SIZE = 9;
type CursorEntry = { end?: string | null; hasNext?: boolean };
const toCursor = (c: string | null | undefined): string | undefined =>
  c && c.length > 0 ? c : undefined;

// ---- helpers to parse URL once ----
function parsePage(params: URLSearchParams): number {
  const n = Number(params.get("page") || "1");
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function parseSort(
  params: URLSearchParams,
): (typeof SORT_OPTIONS)[number]["value"] {
  const s = params.get("sort");
  const ok = SORT_OPTIONS.some((o) => o.value === s);
  return (ok ? s : "popularity") as (typeof SORT_OPTIONS)[number]["value"];
}
function parseOrder(
  params: URLSearchParams,
  sortValue: string,
): "asc" | "desc" {
  const o = params.get("order");
  if (o === "asc" || o === "desc") return o;
  // default order per sort
  return sortValue === "alphabetical" ? "asc" : "desc";
}
function parseSelectedFilters(params: URLSearchParams): SelectedFilters {
  const next = defaultSelection();
  (Object.keys(next) as FilterKey[]).forEach((k) => {
    const v = params.get(k);
    if (v) next[k] = v.split(",").filter(Boolean);
  });
  return next;
}

export function useResultFilters(searchQuery?: string) {
  const location = useLocation();
  const navigate = useNavigate();

  // Read current URL once for initial state
  const initialParams = new URLSearchParams(location.search);
  const initialSort = parseSort(initialParams);

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(() =>
    parseSelectedFilters(initialParams),
  );
  const [sortOption, setSortOption] = useState<
    (typeof SORT_OPTIONS)[number]["value"]
  >(() => initialSort);
  const [order, setOrder] = useState<"asc" | "desc">(() =>
    parseOrder(initialParams, initialSort),
  );
  const [currentPage, setCurrentPage] = useState<number>(() =>
    parsePage(initialParams),
  );

  const [isJumping, setIsJumping] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Track a cursor per visited page
  const cursorByPage = useRef<Map<number, CursorEntry>>(new Map());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nextSel = parseSelectedFilters(params);
    const nextSort = parseSort(params);
    const nextOrder = parseOrder(params, nextSort);
    const nextPage = parsePage(params);

    // only update when actually different to avoid loops
    setSelectedFilters((prev) => {
      const keys = Object.keys(prev) as FilterKey[];
      const changed = keys.some((k) => {
        const a = prev[k];
        const b = nextSel[k];
        if (a.length !== b.length) return true;
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
        return false;
      });
      return changed ? nextSel : prev;
    });
    setSortOption((prev) => (prev !== nextSort ? nextSort : prev));
    setOrder((prev) => (prev !== nextOrder ? nextOrder : prev));
    setCurrentPage((prev) => (prev !== nextPage ? nextPage : prev));
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // preserve text search explicitly
    if (searchQuery) params.set("search", searchQuery);
    else params.delete("search");

    // filters
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) params.set(key, values.join(","));
      else params.delete(key);
    });

    // sort/order
    params.set("sort", sortOption);
    params.set("order", order);

    // page
    if (currentPage > 1) params.set("page", String(currentPage));
    else params.delete("page");

    const next = params.toString();
    const curr = location.search.startsWith("?")
      ? location.search.slice(1)
      : location.search;

    if (next !== curr) {
      navigate({ search: next }, { replace: true });
    }
  }, [
    selectedFilters,
    sortOption,
    order,
    currentPage,
    searchQuery,
    navigate,
    location.search,
  ]);

  // Build filter for backend
  const currentFilter: GameFilter | null = useMemo(() => {
    const has = Object.values(selectedFilters).some((arr) => arr.length > 0);
    if (!has) return null;
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

  // Reset paging when filters/sort/search change (but NOT on URL hydration, which is now done in initializers)
  const prevResetKey = useRef<string>("");
  useEffect(() => {
    const key = JSON.stringify({
      selectedFilters,
      sortOption,
      order,
      searchQuery,
    });
    if (prevResetKey.current && prevResetKey.current !== key) {
      setCurrentPage(1);
      cursorByPage.current.clear();
    }
    if (!prevResetKey.current) prevResetKey.current = key; // first mount baseline
  }, [selectedFilters, sortOption, order, searchQuery]);

  // Queries
  const { data: filterData, loading: loadingFilters } =
    useQuery<FilterOptionsData>(GET_FILTER_OPTIONS, {
      fetchPolicy: "cache-first",
      errorPolicy: "ignore",
    });

  const { data: availableOptionsData } = useQuery<
    AvailableFilterOptionsData,
    AvailableFilterOptionsVariables
  >(GET_AVAILABLE_FILTER_OPTIONS, {
    variables: { currentFilter: currentFilter || {}, search: searchQuery },
    skip: !currentFilter && !searchQuery,
    fetchPolicy: "cache-first",
    errorPolicy: "ignore",
  });

  const { data: countData, loading: loadingCount } = useQuery<GamesCountData>(
    GET_TOTAL_GAMES_COUNT,
    {
      variables: { filter: currentFilter, search: searchQuery },
      fetchPolicy: "cache-first",
    },
  );

  // Current page via cursor
  const after =
    currentPage === 1
      ? undefined
      : toCursor(cursorByPage.current.get(currentPage - 1)?.end);

  const { data: pageConn, loading: gamesLoading } = useQuery<
    GamesConnectionData,
    GetFilteredGamesCursorVars
  >(GET_FILTERED_GAMES_CURSOR, {
    variables: {
      filter: currentFilter || {},
      search: searchQuery,
      sortBy: sortOption,
      sortOrder: order,
      first: PAGE_SIZE,
      after,
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    returnPartialData: true,
    notifyOnNetworkStatusChange: true,
  });

  const gc = pageConn?.gamesConnection;
  const pageInfo = gc?.pageInfo;
  const edges = gc?.edges ?? [];

  // Save endCursor/hasNext for the current page
  useEffect(() => {
    if (!gc || !pageInfo) return;
    cursorByPage.current.set(currentPage, {
      end: pageInfo.endCursor ?? null,
      hasNext: !!pageInfo.hasNextPage,
    });
  }, [gc, pageInfo, currentPage]);

  // Prefetch neighbors
  const nextAfter = toCursor(pageInfo?.endCursor);
  useQuery<GamesConnectionData, GetFilteredGamesCursorVars>(
    GET_FILTERED_GAMES_CURSOR,
    {
      variables: {
        filter: currentFilter || {},
        search: searchQuery,
        sortBy: sortOption,
        sortOrder: order,
        first: PAGE_SIZE,
        after: nextAfter,
      },
      skip: !nextAfter,
      fetchPolicy: "cache-first",
      returnPartialData: true,
      notifyOnNetworkStatusChange: false,
    },
  );

  const prevEndRaw =
    currentPage > 2
      ? cursorByPage.current.get(currentPage - 2)?.end
      : undefined;
  const prevAfter = currentPage > 1 ? toCursor(prevEndRaw) : undefined;
  useQuery<GamesConnectionData, GetFilteredGamesCursorVars>(
    GET_FILTERED_GAMES_CURSOR,
    {
      variables: {
        filter: currentFilter || {},
        search: searchQuery,
        sortBy: sortOption,
        sortOrder: order,
        first: PAGE_SIZE,
        after: prevAfter,
      },
      skip: currentPage <= 1 || !prevAfter,
      fetchPolicy: "cache-first",
      returnPartialData: true,
      notifyOnNetworkStatusChange: false,
    },
  );

  // Build filters map
  const filters: FiltersMap = useMemo(() => {
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
        (options.genres || []).map((g) => g.name ?? "").filter(Boolean),
      ),
      tags: toSorted(
        (options.tags || []).map((t) => t.name ?? "").filter(Boolean),
      ),
      categories: toSorted(
        (options.categories || []).map((c) => c.name ?? "").filter(Boolean),
      ),
      platforms: toSorted(
        (options.platforms || []).map((p) => p.name ?? "").filter(Boolean),
      ),
      publisher: toSorted(
        (options.publishers || []).map((p) => p.name ?? "").filter(Boolean),
      ),
    };
  }, [filterData]);

  // Combine with availability
  const filtersWithAvailability = useMemo(() => {
    if (!availableOptionsData?.availableFilterOptions) {
      const defaultDisabled = !!searchQuery;
      return Object.entries(filters).reduce(
        (acc, [key, options]) => {
          acc[key as FilterKey] = options.map((name) => ({
            name,
            disabled: defaultDisabled,
          }));
          return acc;
        },
        {} as Record<FilterKey, Array<{ name: string; disabled: boolean }>>,
      );
    }

    const available = availableOptionsData.availableFilterOptions as Record<
      string,
      string[] | undefined
    >;
    return Object.entries(filters).reduce(
      (acc, [key, options]) => {
        const filterKey = key as FilterKey;
        const backendKey = filterKey === "publisher" ? "publishers" : filterKey;
        const set = new Set(available[backendKey] ?? []);
        acc[filterKey] = options.map((name) => {
          const selected = selectedFilters[filterKey];
          if (selected.length === 0) return { name, disabled: !set.has(name) };
          return { name, disabled: !selected.includes(name) && !set.has(name) };
        });
        return acc;
      },
      {} as Record<FilterKey, Array<{ name: string; disabled: boolean }>>,
    );
  }, [filters, availableOptionsData, selectedFilters, searchQuery]);

  // Handlers
  const handleOptionToggle = (group: FilterKey, option: string) => {
    setSelectedFilters((prev) => {
      if (option === "All")
        return prev[group].length === 0 ? prev : { ...prev, [group]: [] };
      const exists = prev[group].includes(option);
      const updated = exists
        ? prev[group].filter((v) => v !== option)
        : [...prev[group], option];
      return { ...prev, [group]: updated };
    });
  };

  const handleRemoveSelection = (group: FilterKey, option: string) => {
    setSelectedFilters((prev) => {
      if (!prev[group].includes(option)) return prev;
      return { ...prev, [group]: prev[group].filter((v) => v !== option) };
    });
  };

  const handleClearAll = () => setSelectedFilters(defaultSelection());

  // Pagination
  const handleNextPage = () => {
    const hasNext = cursorByPage.current.get(currentPage)?.hasNext ?? false;
    if (hasNext) startTransition(() => setCurrentPage((p) => p + 1));
  };
  const handlePrevPage = () => {
    if (currentPage > 1) startTransition(() => setCurrentPage((p) => p - 1));
  };

  const apollo = useApolloClient();
  const jumpingRef = useRef(false);

  const handleGoToPage = async (n: number) => {
    const total = Math.max(
      1,
      Math.ceil((countData?.gamesCount ?? 0) / PAGE_SIZE),
    );
    const target = Math.max(1, Math.min(total, Math.floor(Number(n) || 1)));
    if (target === currentPage) return;

    if (target === 1 || cursorByPage.current.has(target)) {
      startTransition(() => setCurrentPage(target));
      // warm neighbors (optional)
      Promise.allSettled(
        [target - 1, target + 1]
          .filter((p) => p >= 1 && p <= total)
          .map(async (p) => {
            const afterForP =
              p === 1
                ? undefined
                : toCursor(cursorByPage.current.get(p - 1)?.end);
            if (p > 1 && !afterForP) return;
            await apollo.query<GamesConnectionData, GetFilteredGamesCursorVars>(
              {
                query: GET_FILTERED_GAMES_CURSOR,
                variables: {
                  filter: currentFilter || {},
                  search: searchQuery,
                  sortBy: sortOption,
                  sortOrder: order,
                  first: PAGE_SIZE,
                  after: afterForP,
                },
                fetchPolicy: "cache-first",
                errorPolicy: "ignore",
              },
            );
          }),
      );
      return;
    }

    if (jumpingRef.current) return;
    jumpingRef.current = true;
    setIsJumping(true);

    try {
      const visited = [...cursorByPage.current.keys()].filter(
        (k) => k < target,
      );
      const startPage = visited.length ? Math.max(...visited) : 1;
      const deltaPages = target - startPage;

      let afterCursor: string | undefined =
        startPage === 1
          ? undefined
          : toCursor(cursorByPage.current.get(startPage)?.end);

      let remaining = deltaPages;
      let pagePointer = startPage;

      let pagesPerBatch = 12;
      let serverPageCapDetected = false;

      while (remaining > 0) {
        const takePages = Math.min(remaining, pagesPerBatch);
        const takeEdges = takePages * PAGE_SIZE;

        const res = await apollo.query<
          GamesConnectionData,
          GetFilteredGamesCursorVars
        >({
          query: GET_FILTERED_GAMES_CURSOR,
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

        const jumpGc = res.data?.gamesConnection;
        const jumpEdges = jumpGc?.edges ?? [];

        if (!jumpGc || jumpEdges.length === 0) {
          const last = cursorByPage.current.get(pagePointer);
          if (last)
            cursorByPage.current.set(pagePointer, { ...last, hasNext: false });
          startTransition(() => setCurrentPage(Math.min(target, pagePointer)));
          return;
        }

        const pagesFilled = Math.floor(jumpEdges.length / PAGE_SIZE);
        if (!serverPageCapDetected && pagesFilled === 1 && takePages > 1) {
          serverPageCapDetected = true;
          pagesPerBatch = 1;
        }

        for (let i = 1; i <= pagesFilled; i++) {
          const edgeIndex = i * PAGE_SIZE - 1;
          const edge = jumpEdges[edgeIndex] as { cursor: string };
          if (!edge) break;
          const nextPage = pagePointer + i;
          cursorByPage.current.set(nextPage, {
            end: edge.cursor,
            hasNext: true,
          });
        }

        pagePointer += pagesFilled;
        remaining -= pagesFilled;
        afterCursor = toCursor(
          (jumpEdges[jumpEdges.length - 1] as { cursor?: string })?.cursor,
        );

        if (pagesFilled === 0 || !jumpGc.pageInfo?.hasNextPage) {
          const last = cursorByPage.current.get(pagePointer);
          if (last)
            cursorByPage.current.set(pagePointer, { ...last, hasNext: false });
          startTransition(() => setCurrentPage(Math.min(target, pagePointer)));
          return;
        }
      }

      // probe for hasNext accuracy (optional)
      try {
        const probe = await apollo.query<
          GamesConnectionData,
          GetFilteredGamesCursorVars
        >({
          query: GET_FILTERED_GAMES_CURSOR,
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
        if (existing)
          cursorByPage.current.set(target, { ...existing, hasNext });
      } catch {
        console.error("Failed to probe hasNext accuracy");
      }

      startTransition(() => setCurrentPage(target));
    } finally {
      jumpingRef.current = false;
      setIsJumping(false);
    }
  };

  // Derived
  const games: Game[] =
    edges
      .map((e) => e?.node)
      .filter((n): n is Game => !!n)
      .map((n) => ({
        ...n,
        descriptionShort: n.descriptionShort ?? undefined,
        image: n.image ?? undefined,
        publishedStore: n.publishedStore ?? undefined,
      })) ?? [];

  const matchesCount =
    (gc?.totalCount as number | undefined) ?? countData?.gamesCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(matchesCount / PAGE_SIZE));
  const canNext = cursorByPage.current.get(currentPage)?.hasNext ?? false;
  const canPrev = currentPage > 1;

  const activeFilterEntries = FILTER_GROUPS.flatMap(({ key, label }) =>
    selectedFilters[key].map((value) => ({ key, label, value })),
  );
  const hasActiveFilters = activeFilterEntries.length > 0;

  type Group = (typeof FILTER_GROUPS)[number];
  const availableGroups: ReadonlyArray<Group> = filterData
    ? FILTER_GROUPS.filter((g): g is Group => {
        const key = g.key as FilterKey;
        return (filters[key] ?? []).length > 0;
      })
    : FILTER_GROUPS;

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
    handlePageReset: () => startTransition(() => setCurrentPage(1)),

    matchesCount,
    sortOption,
    setSortOption,
    order,
    setOrder,
    isLoading: loadingFilters || loadingCount || gamesLoading,
    isPending,
    isJumping,
    filtersReady: !!filterData && !loadingFilters,
    filterError: undefined,
    countError: undefined,
  };
}
