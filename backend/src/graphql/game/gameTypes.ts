import { Prisma } from "@prisma/client";

export type GameFilter = {
  tags?: string[];
  languages?: string[];
  categories?: string[];
  genres?: string[];
  platforms?: string[];
  publishers?: string[];
  developers?: string[];
};

export type GamesArgs = {
  filter?: GameFilter;
  search?: string;
  after?: number;
  take?: number;
  ids?: number[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type GameArgs = {
  id: string;
};

export type GameWithRelations = Prisma.GameGetPayload<{
  include: {
    developers: true;
    publishers: true;
    platforms: true;
    tags: true;
    languages: true;
    categories: true;
    genres: true;
  };
}>;
