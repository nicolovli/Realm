import type { DocumentNode } from "graphql";
import type { Game, GameFilter, FilterOption } from "@/types";

// Refetch configuration for Apollo mutations
// Used to specify which queries should be refetched after a mutation

export type RefetchConfig =
  | string
  | {
      query: DocumentNode;
      variables?: Record<string, unknown>;
    };

// Filter variables for GraphQL queries
// Extends generic variables with filter-specific fields

export interface FilterVariables extends Record<string, unknown> {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filter?: Record<string, unknown>;
  search?: string;
}

// User data from GET_USER_WITH_FAV query
// Contains user ID, username, and favorite games list

export type UserData = {
  me: {
    id: string;
    username: string;
    favorites: { id: string }[];
  } | null;
};

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
  games: Array<{
    id: string;
    name: string;
    descriptionShort?: string;
    image?: string;
    rating?: number;
  }>;
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
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: { cursor: string; node: GamesConnectionNode }[];
  };
};

export type GetFilteredGamesVars = {
  filter: GameFilter | Record<string, never>;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  first: number;
  after?: string;
};
