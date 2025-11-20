import { GameWithRelations, GameFilter } from "./index.js";
import {
  normalizeFilter,
  normalizeSearch,
  stableStringify,
} from "../utils/cacheKey.js";

// Cache of game list pages keyed by normalized query args.

export type GamesCacheData = GameWithRelations[];

const gamesCache = new Map<
  string,
  { data: GamesCacheData; expiresAt: number }
>();
const DEFAULT_TTL_MS = 240_000; // 4m
const MAX_ENTRIES = 500;

export function getGamesCacheKey(args: {
  filter?: GameFilter;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  after?: number;
  take?: number;
  ids?: number[];
}) {
  const keyObj = {
    filter: normalizeFilter(args.filter),
    search: normalizeSearch(args.search),
    sortBy: args.sortBy || undefined,
    sortOrder: args.sortOrder || undefined,
    after: typeof args.after === "number" ? args.after : undefined,
    take: typeof args.take === "number" ? args.take : undefined,
    ids:
      Array.isArray(args.ids) && args.ids.length
        ? [...new Set(args.ids)].sort((a, b) => a - b)
        : undefined,
  };
  return stableStringify(keyObj);
}

export function setGamesCache(
  key: string,
  data: GamesCacheData,
  ttlMs = DEFAULT_TTL_MS,
) {
  gamesCache.set(key, { data, expiresAt: Date.now() + ttlMs });
  if (gamesCache.size > MAX_ENTRIES) {
    const oldestKey = gamesCache.keys().next().value;
    if (oldestKey) gamesCache.delete(oldestKey);
  }
}

export function getGamesCache(key: string) {
  // Expire before touch to avoid reviving stale entries
  const hit = gamesCache.get(key);
  if (!hit) return undefined;
  if (Date.now() > hit.expiresAt) {
    gamesCache.delete(key);
    return undefined;
  }
  // Touch for LRU-ish behavior
  gamesCache.delete(key);
  gamesCache.set(key, hit);
  return hit.data;
}

export function clearGamesCache(): void {
  gamesCache.clear();
}
