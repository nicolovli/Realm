import { prisma } from "../../db.js";
import { Prisma } from "@prisma/client";
import {
  buildWhereFromFilter,
  transformGame,
  normalizeSearchTerm,
  planForSort,
  gameIncludes,
  serializeField,
  tupleAfterToWhere,
} from "./gameHelpers.js";
import { getGamesCacheKey, setGamesCache } from "./gameCache.js";
import { GamesArgs, GameArgs, GameFilter } from "./gameTypes.js";
import {
  encodeCursorTuple,
  decodeCursorTuple,
  valuesInOrder,
  CursorFieldName,
  CursorField,
} from "../utils/cursor.js";

export const gameResolvers = {
  Query: {
    // Legacy offset-based list (kept as-is)
    games: async (_parent: unknown, args: GamesArgs) => {
      const {
        filter,
        search,
        after,
        take = 20,
        sortBy = "popularity",
        ids,
        sortOrder,
      } = args;

      const baseWhere = buildWhereFromFilter(filter, search);
      const direction = sortOrder === "asc" ? "asc" : "desc";

      let orderBy:
        | Prisma.GameOrderByWithRelationInput
        | Prisma.Enumerable<Prisma.GameOrderByWithRelationInput>;

      switch (sortBy) {
        case "popularity":
          orderBy = [
            { popularityScore: direction as Prisma.SortOrder },
            { name: "asc" },
          ];
          break;
        case "release-date":
          orderBy = [
            { publishedStore: direction as Prisma.SortOrder },
            { name: "asc" },
          ];
          break;
        case "rating":
          orderBy = [
            { hasRatings: "desc" },
            { avgRating: direction as Prisma.SortOrder },
            { name: "asc" },
          ];
          break;
        case "alphabetical":
        default:
          orderBy = [{ name: direction as Prisma.SortOrder }];
      }

      const cacheKey = getGamesCacheKey({
        filter,
        search,
        sortBy,
        sortOrder,
        after,
        take,
      });

      const page = after ?? 0;
      const skip = page * take;

      const where: Prisma.GameWhereInput = {
        ...(baseWhere as Prisma.GameWhereInput),
      };
      if (ids && ids.length) where.id = { in: ids };

      const include = gameIncludes;

      let games;
      if (sortBy === "release-date") {
        games = await prisma.game.findMany({
          take,
          skip,
          where: { ...where, publishedStore: { not: null } },
          orderBy: { publishedStore: direction },
          include,
        });
      } else if (sortBy === "alphabetical") {
        games = await prisma.game.findMany({
          take,
          skip,
          where,
          orderBy: { name: direction },
          include,
        });
      } else {
        games = await prisma.game.findMany({
          take,
          skip,
          where,
          orderBy,
          include,
        });
      }

      setGamesCache(cacheKey, games);
      return games.map(transformGame);
    },

    game: async (_parent: unknown, { id }: GameArgs) => {
      const numericId = typeof id === "string" ? Number(id) : id;
      if (Number.isNaN(numericId)) return null;

      const g = await prisma.game.findUnique({
        where: { id: numericId as number },
        include: gameIncludes,
      });
      return g ? transformGame(g) : null;
    },

    gamesCount: async (
      _parent: unknown,
      args: { filter?: GameFilter; search?: string },
    ) => {
      const { filter, search } = args;
      const where = buildWhereFromFilter(
        filter,
        search,
      ) as Prisma.GameWhereInput;
      return prisma.game.count({ where });
    },

    // Search suggestions
    searchGames: async (
      _parent: unknown,
      { query, limit = 6 }: { query: string; limit?: number },
    ) => {
      const q = (query || "").trim();
      if (!q) return [];

      const where = buildWhereFromFilter(undefined, q) as Prisma.GameWhereInput;

      const rows = await prisma.game.findMany({
        where,
        take: limit,
        orderBy: [{ popularityScore: "desc" }, { name: "asc" }],
        include: { publishers: true },
      });

      return rows.map((r) => ({
        id: r.id,
        sid: r.sid,
        name: r.name,
        image: r.image,
        publishers: r.publishers.map((p) => p.name),
      }));
    },

    // Cursor-based connection with tuple cursors
    gamesConnection: async (
      _parent: unknown,
      args: {
        filter?: GameFilter;
        search?: string;
        first?: number;
        after?: string | null;
        last?: number;
        before?: string | null;
        sortBy?: string | null;
        sortOrder?: "asc" | "desc" | null;
        offset?: number | null;
      },
    ) => {
      const first = Math.min(args.first ?? 9, 50);

      // Base where
      const baseWhere = buildWhereFromFilter(args.filter, args.search);
      let where: Prisma.GameWhereInput = {
        ...(baseWhere as Prisma.GameWhereInput),
      };

      // Augment search with publishers/tags startsWith
      if (args.search && args.search.trim()) {
        const q = normalizeSearchTerm(args.search);

        const [pubs, tags] = await Promise.all([
          prisma.publisher.findMany({
            where: { name: { startsWith: q, mode: "insensitive" } },
            include: { games: { select: { id: true } } },
          }),
          prisma.tag.findMany({
            where: { name: { startsWith: q, mode: "insensitive" } },
            include: { games: { select: { id: true } } },
          }),
        ]);

        const relationIds = new Set<number>();
        for (const p of pubs) for (const g of p.games) relationIds.add(g.id);
        for (const t of tags) for (const g of t.games) relationIds.add(g.id);

        const orConditions: Prisma.GameWhereInput[] = [
          { name: { startsWith: q, mode: "insensitive" } },
        ];
        if (relationIds.size > 0)
          orConditions.push({ id: { in: Array.from(relationIds) } });

        const baseTyped = baseWhere as Prisma.GameWhereInput;
        where = { AND: [baseTyped, { OR: orConditions }] };
      }

      // Sort plan (returns orderBy + the fields tuple we must respect)
      const { orderBy, fields } = planForSort(args.sortBy, args.sortOrder);

      // If sorting by publishedStore, exclude nulls
      if (fields[0]?.field === "publishedStore") {
        where = { ...where, publishedStore: { not: null } };
      }

      // Apply 'after' using tuple comparator
      let mergedWhere: Prisma.GameWhereInput = where;
      if (args.after) {
        const decoded = decodeCursorTuple(args.after);
        const expectedOrder = fields.map((f) => f.field) as CursorFieldName[];
        const vals = valuesInOrder(decoded, expectedOrder);
        const extra = tupleAfterToWhere(fields, vals);
        mergedWhere = { AND: [where, extra] };
      }

      // Fetch first+1 to infer hasNext
      const rows = await prisma.game.findMany({
        where: mergedWhere,
        orderBy,
        take: first + 1,
        include: gameIncludes,
      });

      const hasNextPage = rows.length > first;
      const pageRows = hasNextPage ? rows.slice(0, first) : rows;

      const edges = pageRows.map((g) => ({
        cursor: encodeCursorTuple(
          fields.map<CursorField>(({ field }) => ({
            k: field as CursorFieldName,
            v: serializeField(field, g),
          })),
        ),
        node: transformGame(g),
      }));

      const pageInfo = {
        hasNextPage,
        hasPreviousPage: Boolean(args.after),
        startCursor: edges.length ? edges[0].cursor : null,
        endCursor: edges.length ? edges[edges.length - 1].cursor : null,
      };

      // Count against the base filter (not the 'after' window)
      const totalCount = await prisma.game.count({ where });

      return { edges, pageInfo, totalCount };
    },
  },
};
