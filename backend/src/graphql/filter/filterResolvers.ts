import { prisma } from "../../db.js";
import { Prisma } from "@prisma/client";
import { TOP_PUBLISHERS } from "../../constants/topPublishers.js";
import type { GameFilter } from "./filterTypes.js";
import { buildWhereFromFilter, buildSearchWhere } from "../game/index.js";

const useAvailableResultFiltersOnSearch = true;

const fetchOptionNames = async () => {
  const [genres, categories, platforms, tags] = await Promise.all([
    prisma.genre.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { name: true },
    }),
    prisma.platform.findMany({
      orderBy: { name: "asc" },
      select: { name: true },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
  ]);

  const publishers = await prisma.publisher.findMany({
    where: { name: { in: TOP_PUBLISHERS } },
    orderBy: { name: "asc" },
    select: { name: true },
  });

  return {
    genres: genres.map((g) => g.name),
    categories: categories.map((c) => c.name),
    platforms: platforms.map((p) => p.name),
    publishers: publishers.map((p) => p.name),
    tags: tags.map((t) => t.name),
  };
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

      return { genres, categories, platforms, publishers, tags };
    },

    availableFilterOptions: async (
      _parent: unknown,
      args: { filter: GameFilter; search?: string | null },
    ) => {
      const { filter, search } = args;
      const trimmed = search?.trim();
      if (trimmed && !useAvailableResultFiltersOnSearch) {
        return fetchOptionNames();
      }
      const searchWhere: Prisma.GameWhereInput = trimmed
        ? await buildSearchWhere(trimmed, "containsIds")
        : {};

      const whereExcluding = (
        f: GameFilter | undefined,
        exclude?: keyof GameFilter,
      ): Prisma.GameWhereInput => {
        if (!f || !exclude) {
          return buildWhereFromFilter(f, undefined) as Prisma.GameWhereInput;
        }
        const rest: GameFilter = { ...f };
        delete rest[exclude];
        return buildWhereFromFilter(rest, undefined) as Prisma.GameWhereInput;
      };

      const getOptionsForType = async (
        type: keyof GameFilter,
      ): Promise<string[]> => {
        const noFilters =
          !filter || Object.values(filter).every((v) => !v?.length);
        const selected = filter?.[type] ?? [];

        if (noFilters && !trimmed && selected.length === 0) {
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

        const baseFilterWhere =
          selected.length > 0
            ? whereExcluding(filter, undefined)
            : whereExcluding(filter, type);

        const whereForGames =
          Object.keys(searchWhere).length > 0
            ? { AND: [baseFilterWhere, searchWhere] }
            : baseFilterWhere;

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

        const names = Array.from(new Set(rows.map((row) => row.name))).sort();
        return selected.length
          ? names.filter((name) => !selected.includes(name))
          : names;
      };

      const [genres, categories, platforms, publishers, tags] =
        await Promise.all([
          getOptionsForType("genres"),
          getOptionsForType("categories"),
          getOptionsForType("platforms"),
          getOptionsForType("publishers"),
          getOptionsForType("tags"),
        ]);

      return { genres, categories, platforms, publishers, tags };
    },
  },
};
