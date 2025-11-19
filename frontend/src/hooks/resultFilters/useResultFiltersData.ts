import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_FILTER_OPTIONS, GET_TOTAL_GAMES_COUNT } from "@/lib/graphql";
import type {
  FilterOptionsData,
  GamesCountData,
  FiltersMap,
  FilterKey,
  UseResultFiltersDataArgs,
  UseResultFiltersDataReturn,
} from "@/types";
import { FILTER_GROUPS } from "@/constants/resultFiltersConstants";
import { buildGameFilter, toSorted } from "@/lib/utils/resultFiltersHelpers";

type AvailableOption = { name: string; disabled: boolean };
type FiltersWithAvailability = Record<FilterKey, AvailableOption[]>;

export const useResultFiltersData = ({
  selectedFilters,
  searchQuery,
}: UseResultFiltersDataArgs): UseResultFiltersDataReturn => {
  const currentFilter = useMemo(
    () => buildGameFilter(selectedFilters),
    [selectedFilters],
  );

  const { data: filterData, loading: loadingFilters } =
    useQuery<FilterOptionsData>(GET_FILTER_OPTIONS, {
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

  const filters: FiltersMap = useMemo(() => {
    if (!filterData?.filterOptions)
      return {
        genres: [],
        tags: [],
        categories: [],
        platforms: [],
        publisher: [],
      } satisfies FiltersMap;

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
    } satisfies FiltersMap;
  }, [filterData]);

  const filtersWithAvailability: FiltersWithAvailability = useMemo(
    () =>
      (
        Object.entries(filters) as Array<[FilterKey, FiltersMap[FilterKey]]>
      ).reduce((acc, [key, options]) => {
        acc[key] = options.map((name) => ({
          name,
          disabled: false,
        }));
        return acc;
      }, {} as FiltersWithAvailability),
    [filters],
  );

  const activeFilterEntries = useMemo(
    () =>
      FILTER_GROUPS.flatMap(({ key, label }) =>
        selectedFilters[key].map((value) => ({ key, label, value })),
      ),
    [selectedFilters],
  );

  const availableGroups = useMemo(() => {
    if (!filterData) return FILTER_GROUPS;
    return FILTER_GROUPS.filter((group) => {
      const key = group.key as FilterKey;
      return (filters[key] ?? []).length > 0;
    });
  }, [filterData, filters]);

  const matchesCountFromCountQuery = countData?.gamesCount;
  const hasActiveFilters = activeFilterEntries.length > 0;

  return {
    currentFilter,
    filters,
    filtersWithAvailability,
    availableGroups,
    activeFilterEntries,
    hasActiveFilters,
    matchesCountFromCountQuery,
    loadingFilters,
    loadingCount,
    filtersReady: !!filterData && !loadingFilters,
  };
};
