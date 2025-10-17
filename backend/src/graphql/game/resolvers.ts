import { prisma } from "../../db.js";

// Simple in-memory cache for games
type GamesCacheData = GameWithRelations[];
const gamesCache = new Map<
  string,
  { data: GamesCacheData; timestamp: number }
>();
// const GAMES_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getGamesCacheKey(args: {
  filter?: GameFilter;
  search?: string;
  sortBy?: string;
  after?: number;
  take?: number;
}) {
  return JSON.stringify(args);
}
import { Prisma } from "@prisma/client";

type GameFilter = {
  tags?: string[];
  languages?: string[];
  categories?: string[];
  genres?: string[];
  platforms?: string[];
  publishers?: string[];
  developers?: string[];
};

type GamesArgs = {
  filter?: GameFilter;
  search?: string;
  after?: number;
  take?: number;
  ids?: number[];
  sortBy?: string;
};

type GameArgs = {
  id: string;
};

type GameWithRelations = Prisma.GameGetPayload<{
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

// Helper function for mapping gamerelations
function mapGameRelations<T extends { name: string }>(
  relations: T[],
): string[] {
  return relations.map((r) => r.name);
}

function transformGame(game: GameWithRelations) {
  return {
    ...game,
    developers: mapGameRelations(game.developers),
    publishers: mapGameRelations(game.publishers),
    platforms: mapGameRelations(game.platforms),
    tags: mapGameRelations(game.tags),
    languages: mapGameRelations(game.languages),
    categories: mapGameRelations(game.categories),
    genres: mapGameRelations(game.genres),
  };
}

// Helper function to normalize search terms
function normalizeSearchTerm(search: string): string {
  return search
    .trim()
    .replace(/[®™©]/g, "") // Remove trademark symbols
    .replace(/[^\w\s]/g, " ") // Replace special characters with spaces
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim();
}

// Helper function to build search conditions for a given search term
function buildSearchConditions(searchTerm: string) {
  // Split search term into individual words for better matching
  const words = searchTerm
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (words.length === 1) {
    // Single word search - search in name, publishers, and tags
    const word = words[0];
    return [
      {
        name: {
          contains: word,
          mode: "insensitive" as const,
        },
      },
      {
        publishers: {
          some: {
            name: {
              contains: word,
              mode: "insensitive" as const,
            },
          },
        },
      },
      {
        tags: {
          some: {
            name: {
              contains: word,
              mode: "insensitive" as const,
            },
          },
        },
      },
    ];
  } else {
    // Multi-word search - each word must appear somewhere in the name
    return [
      {
        AND: words.map((word) => ({
          name: {
            contains: word,
            mode: "insensitive" as const,
          },
        })),
      },
    ];
  }
}

// Helper function to build complete where clause
function buildWhereFromFilter(filter?: GameFilter, search?: string) {
  const where: Record<string, unknown> = {};

  // Add search functionality
  if (search && search.trim()) {
    const originalSearch = search.trim();
    const normalizedSearch = normalizeSearchTerm(search);

    // Combine both original and normalized search conditions
    const orConditions = [
      ...buildSearchConditions(originalSearch),
      ...buildSearchConditions(normalizedSearch),
    ];
    where.OR = orConditions;
  }

  // Add filter conditions: require ALL selected filters to match (AND between groups)
  if (filter) {
    const andFilters: unknown[] = [];
    // Helper: require all selected values in a filtertype
    function requireAllValues(field: string, values: string[]) {
      return values.map((v) => ({ [field]: { some: { name: v } } }));
    }
    if (filter.tags?.length) {
      andFilters.push(...requireAllValues("tags", filter.tags));
    }
    if (filter.categories?.length) {
      andFilters.push(...requireAllValues("categories", filter.categories));
    }
    if (filter.developers?.length) {
      andFilters.push(...requireAllValues("developers", filter.developers));
    }
    if (filter.genres?.length) {
      andFilters.push(...requireAllValues("genres", filter.genres));
    }
    if (filter.publishers?.length) {
      andFilters.push(...requireAllValues("publishers", filter.publishers));
    }
    if (filter.platforms?.length) {
      andFilters.push(...requireAllValues("platforms", filter.platforms));
    }
    if (filter.languages?.length) {
      andFilters.push(...requireAllValues("languages", filter.languages));
    }
    if (andFilters.length > 0) {
      where.AND = andFilters;
    }
  }

  return where;
}

export const gameResolvers = {
  Query: {
    games: async (_parent: unknown, args: GamesArgs) => {
      const {
        filter,
        search,
        after,
        take = 20,
        sortBy = "popularity",
        ids,
      } = args;
      const where = buildWhereFromFilter(filter, search);
      let orderBy: Prisma.GameOrderByWithRelationInput = {
        name: "asc" as const,
      };

      if (ids && ids.length) {
        where.id = { in: ids };
      }
      switch (sortBy) {
        case "popularity":
          // For now, use name sorting since we don't have popularity fields
          orderBy = { name: "asc" as const };
          break;
        case "release-date":
          orderBy = { publishedStore: "desc" as const };
          break;
        case "rating":
          // For now, use name sorting since we don't have rating fields
          orderBy = { name: "asc" as const };
          break;
        case "alphabetical":
          orderBy = { name: "asc" as const };
          break;
        default:
          orderBy = { name: "asc" as const };
      }

      let games;
      const cacheKey = getGamesCacheKey({
        filter,
        search,
        sortBy,
        take,
      });

      const page = after ?? 0;
      const skip = page * take;

      if (sortBy === "release-date") {
        // For release date sorting, only show games with actual dates
        games = await prisma.game.findMany({
          take,
          skip,
          where: {
            ...where,
            publishedStore: { not: null },
          },
          orderBy: { publishedStore: "desc" },
          include: {
            developers: true,
            publishers: true,
            platforms: true,
            tags: true,
            languages: true,
            categories: true,
            genres: true,
          },
        });
      } else if (sortBy === "alphabetical") {
        games = await prisma.game.findMany({
          take,
          skip,
          where,
          orderBy: { name: "asc" },
          include: {
            developers: true,
            publishers: true,
            platforms: true,
            tags: true,
            languages: true,
            categories: true,
            genres: true,
          },
        });
      } else {
        games = await prisma.game.findMany({
          take,
          skip,
          where,
          orderBy,
          include: {
            developers: true,
            publishers: true,
            platforms: true,
            tags: true,
            languages: true,
            categories: true,
            genres: true,
          },
        });
      }

      // Save in cache
      gamesCache.set(cacheKey, { data: games, timestamp: Date.now() });

      return games.map(transformGame);
    },

    gamesCount: async (
      _parent: unknown,
      args: { filter?: GameFilter; search?: string },
    ) => {
      const { filter, search } = args;
      const where = buildWhereFromFilter(filter, search);

      return await prisma.game.count({ where });
    },

    searchGames: async (
      _parent: unknown,
      args: { query: string; limit: number },
    ) => {
      const { query, limit } = args;

      // Reuse the same search logic as other resolvers
      const where = buildWhereFromFilter(undefined, query);

      const games = await prisma.game.findMany({
        where,
        take: limit,
        include: {
          developers: true,
          publishers: true,
          platforms: true,
          tags: true,
          languages: true,
          categories: true,
          genres: true,
        },
      });

      return games.map((game: GameWithRelations) => ({
        ...game,
        developers: game.developers.map((d) => d.name),
        publishers: game.publishers.map((p) => p.name),
        platforms: game.platforms.map((p) => p.name),
        tags: game.tags.map((t) => t.name),
        languages: game.languages.map((l) => l.name),
        categories: game.categories.map((c) => c.name),
        genres: game.genres.map((g) => g.name),
      }));
    },

    game: async (_parent: unknown, args: GameArgs) => {
      const game = await prisma.game.findUnique({
        where: { id: parseInt(args.id) },
        include: {
          developers: true,
          publishers: true,
          platforms: true,
          tags: true,
          languages: true,
          categories: true,
          genres: true,
        },
      });

      if (!game) return null;
      return transformGame(game);
    },
  },
};
