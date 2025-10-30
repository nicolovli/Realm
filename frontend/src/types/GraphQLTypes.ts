import type { Game, GameFilter } from "./GameTypes";
import type { FilterOption } from "./FilterTypes";

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

export type GamesConnectionNode = {
  id: string;
  name: string;
  image?: string | null;
  descriptionShort?: string | null;
  publishedStore?: string | null;
};

export type GamesConnectionData = {
  gamesConnection?: {
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: { cursor: string; node: GamesConnectionNode }[];
  };
};

export type GetFilteredGamesCursorVars = {
  filter: GameFilter | Record<string, never>;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  first: number;
  after?: string;
};
