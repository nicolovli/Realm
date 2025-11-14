import { Prisma } from "@prisma/client";

export type GameFilter = {
  tags?: string[];
  languages?: string[];
  categories?: string[];
  genres?: string[];
  platforms?: string[];
  publishers?: string[];
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
  select: {
    id: true;
    sid: true;
    name: true;
    image: true;
    descriptionShort: true;
    publishedStore: true;
    avgRating: true;
    reviewsCount: true;
    favoritesCount: true;
    popularityScore: true;
    hasRatings: true;

    developers: { select: { name: true } };
    publishers: { select: { name: true } };
    platforms: { select: { name: true } };
    tags: { select: { name: true } };
    languages: { select: { name: true } };
    categories: { select: { name: true } };
    genres: { select: { name: true } };
  };
}>;
