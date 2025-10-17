// API response shapes (GetGamesData, FilterOptionsData, etc.)

import type { Game, GameFilter } from "./GameTypes";
import type { FilterOption } from "./FilterTypes";

// GraphQL Query Response Types
export type GetGamesData = {
  games: Game[];
};

export type GetGamesVariables = {
  filter?: GameFilter;
  after?: string;
  take?: number;
};

export type GetGameData = {
  game: Game;
};

export type GetGameVariables = {
  id: string;
};

export type FilteredGamesData = {
  games: Game[];
};

export type FilterOptionsData = {
  filterOptions: {
    genres: FilterOption[];
    categories: FilterOption[];
    platforms: FilterOption[];
    publishers: FilterOption[];
    tags: FilterOption[];
  };
};

export type GamesCountData = {
  gamesCount: number;
};

export type GetPromoGamesData = {
  games: Game[];
};

export type AvailableFilterOptionsData = {
  availableFilterOptions: {
    genres: string[];
    categories: string[];
    platforms: string[];
    publishers: string[];
    tags: string[];
  };
};

export type AvailableFilterOptionsVariables = {
  currentFilter: GameFilter;
  search?: string;
};
