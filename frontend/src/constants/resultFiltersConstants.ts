// Shared configuration constants for the results filter experience (labels, page size, query policies).

import type { FilterKey } from "@/types";

export const FILTER_GROUPS = [
  { key: "genres", label: "Genres" },
  { key: "tags", label: "Tags" },
  { key: "categories", label: "Categories" },
  { key: "platforms", label: "Platforms" },
  { key: "publisher", label: "Top Publishers" },
] as const satisfies ReadonlyArray<{ key: FilterKey; label: string }>;

export const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "release-date", label: "Release date" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "rating", label: "Rating" },
] as const;

export type SortOptionValue = (typeof SORT_OPTIONS)[number]["value"];

export const PAGE_SIZE = 9;
export const STORAGE_PREFIX = "results-pagination::";
export const CACHE_TTL_MS = 1000 * 60 * 15;

export const GAMES_PAGE_QUERY_POLICY = {
  fetchPolicy: "cache-first" as const,
  nextFetchPolicy: "cache-first" as const,
  returnPartialData: true,
  notifyOnNetworkStatusChange: true,
};

export const GAMES_NEIGHBOR_PREFETCH_POLICY = {
  fetchPolicy: "cache-first" as const,
  returnPartialData: true,
  notifyOnNetworkStatusChange: false,
};

export const JUMP_BATCH_THRESHOLDS = {
  large: 20,
  medium: 10,
} as const;

export const JUMP_BATCH_SIZES = {
  large: 15,
  medium: 10,
  small: 5,
} as const;
