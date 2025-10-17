import { prisma } from "../../db.js";
import { TOP_PUBLISHERS } from "../../constants/topPublishers.js";

// Helper function to normalize search terms (same as game resolvers)
function normalizeSearchTerm(search: string): string {
  return search
    .trim()
    .replace(/[®™©]/g, "") // Remove trademark symbols
    .replace(/[^\w\s]/g, " ") // Replace special chars with spaces
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim();
}

// Helper function to build search conditions (same as game resolvers)
function buildSearchConditions(searchTerm: string) {
  const words = searchTerm
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (words.length === 1) {
    // Single word search
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
    // Multi-word search - each word must appear in the name
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

type AvailableFilterOptions = {
  genres: string[];
  categories: string[];
  platforms: string[];
  publishers: string[];
  tags: string[];
};

type CacheData = AvailableFilterOptions;

// In-memory cache for filter options
const filterCache = new Map<string, { data: CacheData; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCacheKey(filter: GameFilter, search?: string): string {
  return JSON.stringify({ filter: filter || {}, search: search || "" });
}

function getCachedResult(key: string) {
  const cached = filterCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedResult(key: string, data: CacheData) {
  filterCache.set(key, { data, timestamp: Date.now() });

  // Clean old entries if cache gets too big
  if (filterCache.size > 100) {
    const oldestKey = filterCache.keys().next().value;
    if (oldestKey) {
      filterCache.delete(oldestKey);
    }
  }
}

type GameFilter = {
  tags?: string[];
  languages?: string[];
  categories?: string[];
  genres?: string[];
  platforms?: string[];
  publishers?: string[];
};

export const filterResolvers = {
  Query: {
    // Get all available filter options (for initial dropdown population)
    filterOptions: async () => {
      const [genres, categories, platforms, tags] = await Promise.all([
        prisma.genre.findMany({ orderBy: { name: "asc" } }),
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.platform.findMany({ orderBy: { name: "asc" } }),
        prisma.tag.findMany({ orderBy: { name: "asc" } }),
      ]);

      // Get only curated top publishers
      const publishers = await prisma.publisher.findMany({
        where: { name: { in: TOP_PUBLISHERS } },
        orderBy: { name: "asc" },
      });

      return {
        genres,
        categories,
        platforms,
        publishers,
        tags,
      };
    },

    // Get available filter options based on current search and filters
    availableFilterOptions: async (
      _parent: unknown,
      args: { filter: GameFilter; search?: string },
    ) => {
      const { filter, search } = args;

      // Check cache first
      const cacheKey = getCacheKey(filter, search);

      const cachedResult = getCachedResult(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Build enhanced search where clause (using same logic as game resolvers)
      const baseWhere: Record<string, unknown> = {};
      if (search && search.trim()) {
        const originalSearch = search.trim();
        const normalizedSearch = normalizeSearchTerm(search);

        // Combine both original and normalized search conditions
        const orConditions = [
          ...buildSearchConditions(originalSearch),
          ...buildSearchConditions(normalizedSearch),
        ];
        baseWhere.OR = orConditions;
      }

      // Get all games that match search criteria
      const allGames = await prisma.game.findMany({
        where: baseWhere,
        select: {
          genres: { select: { name: true } },
          categories: { select: { name: true } },
          platforms: { select: { name: true } },
          publishers: { select: { name: true } },
          tags: { select: { name: true } },
        },
        take: search ? 1000 : undefined,
      });

      type GameWithRelations = {
        genres: Array<{ name: string }>;
        categories: Array<{ name: string }>;
        platforms: Array<{ name: string }>;
        publishers: Array<{ name: string }>;
        tags: Array<{ name: string }>;
      };

      // Helper to check if a game matches filter excluding one type
      const gameMatchesFilter = (
        game: GameWithRelations,
        excludeType: keyof GameFilter,
      ) => {
        if (!filter) return true;

        const checks = [
          { type: "genres", values: filter.genres },
          { type: "categories", values: filter.categories },
          { type: "platforms", values: filter.platforms },
          { type: "publishers", values: filter.publishers },
          { type: "tags", values: filter.tags },
        ];

        return checks.every(({ type, values }) => {
          if (type === excludeType || !values?.length) return true;

          const gameValues =
            game[type as keyof GameWithRelations]?.map(
              (item: { name: string }) => item.name,
            ) || [];
          // AND-logikk: spill må ha alle valgte verdier i denne filtertypen
          return values.every((filterValue) =>
            gameValues.includes(filterValue),
          );
        });
      };

      // Extract available options for each filter type
      const getOptionsForType = (type: keyof GameFilter) => {
        // IF no values are selected in this filter type, return all possible
        const selected = filter?.[type] || [];
        if (!selected.length) {
          const allOptions = allGames.flatMap((game) => {
            const gameRelation = game[
              type as keyof GameWithRelations
            ] as Array<{
              name: string;
            }>;
            return (
              gameRelation?.map((item: { name: string }) => item.name) || []
            );
          });
          return [...new Set(allOptions)].sort();
        }
        // Or: Return only values that can be combined with all other selected
        const possibleOptions = allGames
          .filter((game) => gameMatchesFilter(game, type))
          .flatMap((game) => {
            const gameRelation = game[
              type as keyof GameWithRelations
            ] as Array<{
              name: string;
            }>;
            return (
              gameRelation?.map((item: { name: string }) => item.name) || []
            );
          });
        // Fjern allerede valgte verdier
        const filteredOptions = possibleOptions.filter(
          (opt) => !selected.includes(opt),
        );
        return [...new Set(filteredOptions)].sort();
      };

      const result = {
        genres: getOptionsForType("genres"),
        categories: getOptionsForType("categories"),
        platforms: getOptionsForType("platforms"),
        publishers: getOptionsForType("publishers"),
        tags: getOptionsForType("tags"),
      };

      // Cache the result
      setCachedResult(cacheKey, result);

      return result;
    },
  },
};
