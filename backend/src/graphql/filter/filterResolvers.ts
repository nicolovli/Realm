import { prisma } from "../../db.js";
import { TOP_PUBLISHERS } from "../../constants/topPublishers.js";
import {
  normalizeSearchTerm,
  buildGameWhereExcludingType,
} from "./filterHelpers.js";
import {
  getCacheKey,
  getCachedResult,
  setCachedResult,
} from "./filterCache.js";
import { GameFilter, AvailableFilterOptions } from "./filterTypes.js";
import { Prisma } from "@prisma/client";

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

      return { genres, categories, platforms, publishers, tags };
    },

    // Get available filter options based on current search and filters
    availableFilterOptions: async (
      _parent: unknown,
      args: { filter: GameFilter; search?: string },
    ) => {
      const { filter, search } = args;
      const cacheKey = getCacheKey(filter, search);

      // Check cache first
      const cached = getCachedResult(cacheKey);
      if (cached) return cached;

      // Normalize search and prefetch relation ids for prefix matches (used in building game WHERE)
      const q: string | undefined =
        search && search.trim() ? normalizeSearchTerm(search) : undefined;

      const [matchingPublisherIds, matchingTagIds] = await (q
        ? Promise.all([
            prisma.publisher.findMany({
              where: { name: { startsWith: q, mode: "insensitive" } },
              select: { id: true },
            }),
            prisma.tag.findMany({
              where: { name: { startsWith: q, mode: "insensitive" } },
              select: { id: true },
            }),
          ])
        : Promise.resolve([[], []]));

      const pubIds = matchingPublisherIds.map((p) => p.id);
      const tagIds = matchingTagIds.map((t) => t.id);

      // For each relation type: get game ids matching all other filters + search,
      // then fetch distinct relation names for those games.
      async function getOptionsForType(
        type: keyof GameFilter,
      ): Promise<string[]> {
        // If no filters/search at all and no selected for this type, return all names for speed
        const noFilters =
          !filter || Object.values(filter).every((v) => !v?.length);
        const selected = filter?.[type] || [];

        if (noFilters && !q && !selected.length) {
          // quick path: return all possible values ordered
          if (type === "genres")
            return (
              await prisma.genre.findMany({ orderBy: { name: "asc" } })
            ).map((g) => g.name);
          if (type === "categories")
            return (
              await prisma.category.findMany({ orderBy: { name: "asc" } })
            ).map((c) => c.name);
          if (type === "platforms")
            return (
              await prisma.platform.findMany({ orderBy: { name: "asc" } })
            ).map((p) => p.name);
          if (type === "publishers")
            return (
              await prisma.publisher.findMany({ orderBy: { name: "asc" } })
            ).map((p) => p.name);
          if (type === "tags")
            return (
              await prisma.tag.findMany({ orderBy: { name: "asc" } })
            ).map((t) => t.name);
          return [];
        }

        // 1) get game ids that match filters.
        // If the user has selected values in this same type, include them in the WHERE
        let whereForGames: Prisma.GameWhereInput;
        if (selected.length) {
          // include selections for this type when computing available options
          whereForGames = buildGameWhereExcludingType(
            filter,
            undefined,
            q,
            pubIds,
            tagIds,
          );
        } else {
          // exclude this type from filters when computing available options (quick-path)
          whereForGames = buildGameWhereExcludingType(
            filter,
            type,
            q,
            pubIds,
            tagIds,
          );
        }

        const gameRows = await prisma.game.findMany({
          where: whereForGames,
          select: { id: true },
          take: 5000,
        }); // safety cap
        const gameIds = gameRows.map((r) => r.id);
        if (!gameIds.length) return [];

        // 2) get distinct relation names for those game ids
        let rows: Array<{ name: string }> = [];
        if (type === "genres")
          rows = await prisma.genre.findMany({
            where: { games: { some: { id: { in: gameIds } } } },
            select: { name: true },
            orderBy: { name: "asc" },
          });
        else if (type === "categories")
          rows = await prisma.category.findMany({
            where: { games: { some: { id: { in: gameIds } } } },
            select: { name: true },
            orderBy: { name: "asc" },
          });
        else if (type === "platforms")
          rows = await prisma.platform.findMany({
            where: { games: { some: { id: { in: gameIds } } } },
            select: { name: true },
            orderBy: { name: "asc" },
          });
        else if (type === "publishers")
          rows = await prisma.publisher.findMany({
            where: { games: { some: { id: { in: gameIds } } } },
            select: { name: true },
            orderBy: { name: "asc" },
          });
        else if (type === "tags")
          rows = await prisma.tag.findMany({
            where: { games: { some: { id: { in: gameIds } } } },
            select: { name: true },
            orderBy: { name: "asc" },
          });

        const names = Array.from(new Set(rows.map((r) => r.name))).sort();
        // If user already selected values for this type, return only the remaining possible options
        return selected.length
          ? names.filter((n) => !selected.includes(n))
          : names;
      }

      const [genresOpt, categoriesOpt, platformsOpt, publishersOpt, tagsOpt] =
        await Promise.all([
          getOptionsForType("genres"),
          getOptionsForType("categories"),
          getOptionsForType("platforms"),
          getOptionsForType("publishers"),
          getOptionsForType("tags"),
        ]);

      const result: AvailableFilterOptions = {
        genres: genresOpt,
        categories: categoriesOpt,
        platforms: platformsOpt,
        publishers: publishersOpt,
        tags: tagsOpt,
      };

      // Cache the result
      setCachedResult(cacheKey, result);
      return result;
    },
  },
};
