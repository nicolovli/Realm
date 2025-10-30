import { GameWithRelations, GameFilter } from "./gameTypes.js";

// Simple in-memory cache for games
export type GamesCacheData = GameWithRelations[];

const gamesCache = new Map<
  string,
  { data: GamesCacheData; timestamp: number }
>();

export function getGamesCacheKey(args: {
  filter?: GameFilter;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  after?: number;
  take?: number;
}) {
  return JSON.stringify(args);
}

export function setGamesCache(key: string, data: GamesCacheData) {
  gamesCache.set(key, { data, timestamp: Date.now() });
}

export function getGamesCache(key: string) {
  return gamesCache.get(key);
}
