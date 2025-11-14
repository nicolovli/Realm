// Reusable helpers that transform result-filter state (selection parsing, cache keys, payload builders).

import type { SortOptionValue } from "@/constants/resultFiltersConstants";
import {
  CACHE_TTL_MS,
  SORT_OPTIONS,
  STORAGE_PREFIX,
} from "@/constants/resultFiltersConstants";
import type { FilterKey, SelectedFilters } from "@/types/FilterTypes";
import type { GameFilter } from "@/types/GameTypes";
import type { CursorCachePayload } from "@/types/HookTypes";

export const defaultSelection = (): SelectedFilters => ({
  genres: [],
  tags: [],
  categories: [],
  platforms: [],
  publisher: [],
});

export const toSorted = (arr: string[]): string[] =>
  Array.from(new Set(arr)).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );

export const buildGameFilter = (
  selected: SelectedFilters,
): GameFilter | null => {
  const hasSelections = Object.values(selected).some(
    (values) => values.length > 0,
  );
  if (!hasSelections) return null;

  return {
    ...(selected.genres.length > 0 && { genres: selected.genres }),
    ...(selected.tags.length > 0 && { tags: selected.tags }),
    ...(selected.categories.length > 0 && { categories: selected.categories }),
    ...(selected.platforms.length > 0 && { platforms: selected.platforms }),
    ...(selected.publisher.length > 0 && { publishers: selected.publisher }),
  } satisfies GameFilter;
};

export const buildCacheKey = (
  selected: SelectedFilters,
  sort: SortOptionValue,
  sortOrder: "asc" | "desc",
  search?: string,
): string => {
  const filterParts = (Object.keys(selected) as FilterKey[])
    .sort()
    .map((key) => {
      const values = [...selected[key]].sort();
      return `${key}:${values.join("|")}`;
    });

  return [
    `sort:${sort}`,
    `order:${sortOrder}`,
    `search:${search ?? ""}`,
    ...filterParts,
  ].join(";");
};

export const toCursor = (cursor?: string | null): string | undefined =>
  cursor && cursor.length > 0 ? cursor : undefined;

export const parsePage = (params: URLSearchParams): number => {
  const n = Number(params.get("page") || "1");
  return Number.isFinite(n) && n > 0 ? n : 1;
};

export const parseSort = (params: URLSearchParams): SortOptionValue => {
  const value = params.get("sort");
  const match = SORT_OPTIONS.some((option) => option.value === value);
  return (match ? value : "popularity") as SortOptionValue;
};

export const parseOrder = (
  params: URLSearchParams,
  sortValue: string,
): "asc" | "desc" => {
  const order = params.get("order");
  if (order === "asc" || order === "desc") return order;
  return sortValue === "alphabetical" ? "asc" : "desc";
};

export const parseSelectedFilters = (
  params: URLSearchParams,
): SelectedFilters => {
  const next = defaultSelection();
  (Object.keys(next) as FilterKey[]).forEach((key) => {
    const value = params.get(key);
    if (value) next[key] = value.split(",").filter(Boolean);
  });
  return next;
};

const getSessionStorage = (): Storage | null => {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch (error) {
    console.warn("Session storage unavailable", error);
    return null;
  }
};

export const loadCursorCache = (key: string): CursorCachePayload | null => {
  const storage = getSessionStorage();
  if (!storage) return null;
  const raw = storage.getItem(`${STORAGE_PREFIX}${key}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CursorCachePayload;
    if (!parsed || !Array.isArray(parsed.cursors)) return null;
    if (!parsed.updatedAt || Date.now() - parsed.updatedAt > CACHE_TTL_MS) {
      storage.removeItem(`${STORAGE_PREFIX}${key}`);
      return null;
    }
    return parsed;
  } catch {
    storage.removeItem(`${STORAGE_PREFIX}${key}`);
    return null;
  }
};

export const saveCursorCache = (
  key: string,
  payload: CursorCachePayload,
): void => {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(payload));
  } catch (error) {
    console.warn("Unable to persist pagination cache", error);
  }
};
