import { prisma } from "../../db.js";
import { Prisma } from "@prisma/client";
import {
  buildWhereFromFilter,
  transformGame,
  planForSort,
  gameSelect,
  serializeField,
  tupleAfterToWhere,
  whereClauses,
  getGamesCacheKey,
  setGamesCache,
  getGamesCache,
  GamesArgs,
  GameArgs,
  GameFilter,
  buildSearchWhere,
} from "./index.js";
import {
  encodeCursorTuple,
  decodeCursorTuple,
  valuesInOrder,
  CursorFieldName,
  CursorField,
} from "../utils/cursor.js";

type GameRow = Prisma.GameGetPayload<{ select: typeof gameSelect }>;

const MAX_TAKE = 50;

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
        sortOrder,
      } = args;

      const trimmedSearch = search?.trim();
      const page = Math.max(0, Number(after ?? 0));
      const pageSize = Math.min(Math.max(1, take), MAX_TAKE);
      // Clamp inputs defensively to avoid accidental large scans / negative skips

      const baseWhere = buildWhereFromFilter(
        filter,
        undefined,
      ) as Prisma.GameWhereInput;
      const { orderBy } = planForSort(sortBy, sortOrder);

      const cacheKey = getGamesCacheKey({
        filter,
        search: trimmedSearch,
        sortBy,
        sortOrder,
        after: page,
        take: pageSize,
        ids,
      });

      const cached = getGamesCache(cacheKey);
      if (cached) return cached.map(transformGame);
      // Cache stores raw rows (select shape). Transform on the way out for UI types.

      const searchWhere = await buildSearchWhere(trimmedSearch, "containsIds");

      const where = whereClauses(
        baseWhere,
        searchWhere,
        ids && ids.length ? { id: { in: ids } } : undefined,
      );

      const rows = await prisma.game.findMany({
        take: pageSize,
        skip: page * pageSize,
        where,
        orderBy,
        select: gameSelect,
      });

      setGamesCache(cacheKey, rows);
      return rows.map(transformGame);
    },

    game: async (_parent: unknown, { id }: GameArgs) => {
      const numericId = typeof id === "string" ? Number(id) : id;
      if (!Number.isFinite(numericId)) return null;

      const g = await prisma.game.findUnique({
        where: { id: numericId as number },
        select: gameSelect,
      });
      return g ? transformGame(g) : null;
    },

    gamesCount: async (
      _parent: unknown,
      args: { filter?: GameFilter; search?: string },
    ) => {
      const trimmed = args.search?.trim();
      const baseWhere = buildWhereFromFilter(
        args.filter,
        undefined,
      ) as Prisma.GameWhereInput;
      const searchWhere = await buildSearchWhere(trimmed, "containsIds");

      return prisma.game.count({ where: whereClauses(baseWhere, searchWhere) });
    },

    searchGames: async (
      _parent: unknown,
      { query, limit = 6 }: { query: string; limit?: number },
    ) => {
      const q = (query || "").trim();
      if (!q) return [];

      const where = await buildSearchWhere(q, "containsIds");

      const rows = await prisma.game.findMany({
        where,
        take: Math.min(limit, 20),
        orderBy: [{ popularityScore: "desc" }, { name: "asc" }],
        select: {
          id: true,
          sid: true,
          name: true,
          image: true,
          publishers: { select: { name: true } },
        },
      });

      return rows.map((r) => ({
        id: r.id,
        sid: r.sid,
        name: r.name,
        image: r.image,
        publishers: r.publishers.map((p) => p.name),
      }));
    },

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
      const first = Math.min(args.first ?? 12, MAX_TAKE);

      // Build base WHERE from filters only (no search here)
      const baseWhere = buildWhereFromFilter(
        args.filter,
        undefined,
      ) as Prisma.GameWhereInput;

      // Build rich search WHERE (contains + startsWith + relation-ID boosts)
      const trimmed = args.search?.trim();
      const searchWhere = await buildSearchWhere(trimmed, "containsIds");

      // Combine filters + search
      const where = whereClauses(baseWhere, searchWhere);

      const { orderBy, fields } = planForSort(args.sortBy, args.sortOrder);

      let mergedWhere: Prisma.GameWhereInput = where;
      if (args.after) {
        const decoded = decodeCursorTuple(args.after);
        const expectedOrder = fields.map((f) => f.field) as CursorFieldName[];
        const vals = valuesInOrder(decoded, expectedOrder);
        const extra = tupleAfterToWhere(fields, vals);
        mergedWhere = { AND: [where, extra] };
      }

      // Fetch page (+1 for hasNextPage)
      const rows = await prisma.game.findMany({
        where: mergedWhere,
        orderBy,
        take: first + 1,
        select: gameSelect,
      });

      const hasNextPage = rows.length > first;
      const pageRows = hasNextPage ? rows.slice(0, first) : rows;

      const edges = pageRows.map((g: GameRow) => {
        const cursorFields: CursorField[] = fields.map(({ field }) => ({
          k: field as CursorFieldName,
          v: serializeField(field, g),
        }));
        return {
          cursor: encodeCursorTuple(cursorFields),
          node: transformGame(g),
        };
      });

      const pageInfo = {
        hasNextPage,
        hasPreviousPage: Boolean(args.after),
        startCursor: edges.length ? edges[0].cursor : null,
        endCursor: edges.length ? edges[edges.length - 1].cursor : null,
      };

      const totalCount = await prisma.game.count({ where });

      return { edges, pageInfo, totalCount };
    },
  },
};
