import { prisma } from "../../db.js";
import { TOP_PUBLISHERS } from "../../constants/topPublishers.js";
import {
  getCacheKey,
  getCachedResult,
  setCachedResult,
  GameFilter,
  AvailableFilterOptions,
} from "./index.js";
import { Prisma } from "@prisma/client";
import { buildWhereFromFilter, buildSearchWhere } from "../game/index.js";

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

      const cached = getCachedResult(cacheKey);
      if (cached) return cached;

      // Build search WHERE once (contains + startsWith + relation-aware from unified search.ts)
      const trimmed = search?.trim();
      const searchWhere: Prisma.GameWhereInput = trimmed
        ? await buildSearchWhere(trimmed, "containsIds")
        : {};

      // Helper: base filters, optionally excluding one relation type
      function whereExcluding(
        f: GameFilter | undefined,
        exclude?: keyof GameFilter,
      ): Prisma.GameWhereInput {
        // When computing “available options” for type T, exclude T from the base
        // filter so we can "discover" remaining values, unless the user already
        // selected some T (then we keep it to narrow within their choices)
        if (!f || !exclude) {
          return buildWhereFromFilter(f, undefined) as Prisma.GameWhereInput;
        }
        const rest: Partial<GameFilter> = { ...f };
        delete (rest as Record<string, unknown>)[exclude];
        return buildWhereFromFilter(
          rest as GameFilter,
          undefined,
        ) as Prisma.GameWhereInput;
      }

      // For each relation type: fetch distinct names among relations whose games match
      async function getOptionsForType(
        type: keyof GameFilter,
      ): Promise<string[]> {
        const noFilters =
          !filter || Object.values(filter).every((v) => !v?.length);
        const selected = filter?.[type] || [];

        // Fast path when nothing is selected or searched
        if (noFilters && !trimmed && !selected.length) {
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

        // Build the game WHERE used to constrain each relation query
        const baseFilterWhere = selected.length
          ? whereExcluding(filter, undefined) // include this type if user already picked some
          : whereExcluding(filter, type); // otherwise exclude this type to discover options

        const whereForGames: Prisma.GameWhereInput = Object.keys(searchWhere)
          .length
          ? { AND: [baseFilterWhere, searchWhere] }
          : baseFilterWhere;

        // Query relations directly with `where: { games: { some: <gameWhere> } }`.
        // This avoids the slow pattern of “fetch game IDs → filter relations in app”.
        let rows: Array<{ name: string }> = [];
        if (type === "genres") {
          rows = await prisma.genre.findMany({
            where: { games: { some: whereForGames } },
            select: { name: true },
            orderBy: { name: "asc" },
          });
        } else if (type === "categories") {
          rows = await prisma.category.findMany({
            where: { games: { some: whereForGames } },
            select: { name: true },
            orderBy: { name: "asc" },
          });
        } else if (type === "platforms") {
          rows = await prisma.platform.findMany({
            where: { games: { some: whereForGames } },
            select: { name: true },
            orderBy: { name: "asc" },
          });
        } else if (type === "publishers") {
          rows = await prisma.publisher.findMany({
            where: { games: { some: whereForGames } },
            select: { name: true },
            orderBy: { name: "asc" },
          });
        } else if (type === "tags") {
          rows = await prisma.tag.findMany({
            where: { games: { some: whereForGames } },
            select: { name: true },
            orderBy: { name: "asc" },
          });
        }

        const names = Array.from(new Set(rows.map((r) => r.name))).sort();
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
