import { AvailableFilterOptions } from "./filterTypes.js";

// In-memory cache for filter options
type CacheData = AvailableFilterOptions;

const filterCache = new Map<string, { data: CacheData; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function getCacheKey(filter: object, search?: string): string {
  return JSON.stringify({ filter: filter || {}, search: search || "" });
}

export function getCachedResult(key: string): CacheData | null {
  const cached = filterCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

export function setCachedResult(key: string, data: CacheData): void {
  filterCache.set(key, { data, timestamp: Date.now() });

  // Clean old entries if cache gets too big
  if (filterCache.size > 100) {
    const oldestKey = filterCache.keys().next().value;
    if (oldestKey) filterCache.delete(oldestKey);
  }
}
