import type { GameFilter } from "../game/index.js";
import {
  normalizeFilter,
  normalizeSearch,
  stableStringify,
} from "../utils/cacheKey.js";

type CacheData = {
  genres: string[];
  categories: string[];
  platforms: string[];
  publishers: string[];
  tags: string[];
};

const filterCache = new Map<string, { data: CacheData; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_ENTRIES = 200;

export function getCacheKey(filter?: GameFilter | null, search?: string) {
  const keyObj = {
    filter: normalizeFilter(filter ?? undefined),
    search: normalizeSearch(search),
  };
  return stableStringify(keyObj);
}

export function getCachedResult(key: string): CacheData | null {
  const cached = filterCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    filterCache.delete(key);
    return null;
  }

  // refresh insertion order for LRU behavior
  filterCache.delete(key);
  filterCache.set(key, cached);
  return cached.data;
}

export function setCachedResult(key: string, data: CacheData): void {
  filterCache.set(key, { data, timestamp: Date.now() });
  if (filterCache.size > MAX_ENTRIES) {
    const oldestKey = filterCache.keys().next().value;
    if (oldestKey) filterCache.delete(oldestKey);
  }
}

export function clearFilterCache(): void {
  filterCache.clear();
}
