import { AvailableFilterOptions } from "./filterTypes.js";
import {
  normalizeFilter,
  normalizeSearch,
  stableStringify,
} from "../utils/cacheKey.js";

// In-memory cache for filter UI options.
// Keys are *normalized* (trimmed search, deduped/sorted arrays) so semantically identical queries hit the same entry.
// We also do a light LRU: every get "touches" the entry by reinserting it.

// In-memory cache for filter options (LRU-ish via Map insertion order)
type CacheData = AvailableFilterOptions;

const filterCache = new Map<string, { data: CacheData; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_ENTRIES = 200;

export function getCacheKey(filter: object, search?: string): string {
  const keyObj = {
    filter: normalizeFilter(filter),
    search: normalizeSearch(search),
  };
  return stableStringify(keyObj);
}

export function getCachedResult(key: string): CacheData | null {
  // TTL eviction first (staleness beats recency)
  const cached = filterCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    filterCache.delete(key);
    return null;
  }
  // Touch for LRU-ish behavior: move to end of Map insertion order
  filterCache.delete(key);
  filterCache.set(key, cached);
  return cached.data;
}

export function setCachedResult(key: string, data: CacheData): void {
  // Bound cache size to prevent unbounded memory growth in long-lived processes
  filterCache.set(key, { data, timestamp: Date.now() });
  if (filterCache.size > MAX_ENTRIES) {
    const oldestKey = filterCache.keys().next().value;
    if (oldestKey) filterCache.delete(oldestKey);
  }
}

export function clearFilterCache(): void {
  filterCache.clear();
}
