import { gameResolvers } from "../graphql/game/gameResolvers.js";
import { prisma } from "../db.js";
import {
  clearGamesCache,
  planForSort,
  serializeField,
} from "../graphql/game/index.js";
import { Prisma } from "@prisma/client";
import {
  encodeCursorTuple,
  CursorFieldName,
  CursorField,
} from "../graphql/utils/cursor.js";

jest.mock("../db.js", () => ({
  prisma: {
    game: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    publisher: { findMany: jest.fn() },
    tag: { findMany: jest.fn() },
  },
}));

const mockPrisma = prisma as unknown as {
  game: { findMany: jest.Mock; findUnique: jest.Mock; count: jest.Mock };
  publisher: { findMany: jest.Mock };
  tag: { findMany: jest.Mock };
};

describe("gameResolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearGamesCache();
    mockPrisma.publisher.findMany.mockResolvedValue([]);
    mockPrisma.tag.findMany.mockResolvedValue([]);
  });

  describe("games", () => {
    it("fetches a page of games with transform + caching", async () => {
      const rows = [
        {
          id: 1,
          sid: "g1",
          name: "Alpha",
          image: "alpha.png",
          descriptionShort: "A",
          descriptionText: "A full",
          publishedStore: new Date("2024-01-01"),
          avgRating: 4.2,
          reviewsCount: 3,
          favoritesCount: 10,
          popularityScore: 50,
          hasRatings: true,
          publishers: [{ name: "PubA" }],
        },
      ];

      mockPrisma.game.findMany.mockResolvedValue(rows);

      const firstCall = await gameResolvers.Query.games(undefined, {
        filter: {},
        search: " ",
        after: 0,
        take: 10,
        sortBy: "popularity",
        sortOrder: "desc",
      });

      expect(firstCall).toEqual([
        expect.objectContaining({ publishers: ["PubA"], id: 1 }),
      ]);
      expect(mockPrisma.game.findMany).toHaveBeenCalledTimes(1);

      const secondCall = await gameResolvers.Query.games(undefined, {
        filter: {},
        search: " ",
        after: 0,
        take: 10,
        sortBy: "popularity",
        sortOrder: "desc",
      });
      expect(secondCall).toEqual(firstCall);
      expect(mockPrisma.game.findMany).toHaveBeenCalledTimes(1);
    });

    it("returns empty array when prisma returns no rows", async () => {
      mockPrisma.game.findMany.mockResolvedValue([]);
      const result = await gameResolvers.Query.games(undefined, {
        filter: {},
        take: 5,
      });
      expect(result).toEqual([]);
    });
  });

  describe("game", () => {
    it("returns transformed single game", async () => {
      mockPrisma.game.findUnique.mockResolvedValue({
        id: 99,
        sid: "g99",
        name: "Zeta",
        image: "zeta.png",
        descriptionShort: "Z",
        descriptionText: "Z full",
        publishedStore: new Date("2023-06-01"),
        avgRating: 3.7,
        reviewsCount: 1,
        favoritesCount: 2,
        popularityScore: 12,
        hasRatings: true,
        publishers: [{ name: "PubZ" }],
        developers: [{ name: "DevZ" }],
        platforms: [{ name: "PC" }],
        tags: [{ name: "TagZ" }],
        languages: [{ name: "EN" }],
        categories: [{ name: "CatZ" }],
        genres: [{ name: "GenreZ" }],
      });
      const result = await gameResolvers.Query.game(undefined, { id: "99" });
      expect(result).toMatchObject({
        id: 99,
        publishers: ["PubZ"],
        developers: ["DevZ"],
        platforms: ["PC"],
        tags: ["TagZ"],
        languages: ["EN"],
        categories: ["CatZ"],
        genres: ["GenreZ"],
      });
    });

    it("returns null for invalid id", async () => {
      const result = await gameResolvers.Query.game(undefined, { id: "abc" });
      expect(result).toBeNull();
      expect(mockPrisma.game.findUnique).not.toHaveBeenCalled();
    });

    it("returns null when game not found", async () => {
      mockPrisma.game.findUnique.mockResolvedValue(null);
      const result = await gameResolvers.Query.game(undefined, { id: "1" });
      expect(result).toBeNull();
    });
  });

  describe("gamesCount", () => {
    it("counts games with filter and search", async () => {
      mockPrisma.game.count.mockResolvedValue(42);
      const result = await gameResolvers.Query.gamesCount(undefined, {
        filter: { genres: ["Action"] },
        search: " space ",
      });
      expect(result).toBe(42);
      expect(mockPrisma.game.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.any(Object) }),
      );
    });
  });

  describe("searchGames", () => {
    it("returns empty array for blank query", async () => {
      const result = await gameResolvers.Query.searchGames(undefined, {
        query: "   ",
        limit: 5,
      });
      expect(result).toEqual([]);
      expect(mockPrisma.game.findMany).not.toHaveBeenCalled();
    });

    it("returns truncated list respecting limit", async () => {
      mockPrisma.game.findMany.mockResolvedValue([
        {
          id: 1,
          sid: "g1",
          name: "Alpha",
          image: "a.png",
          publishers: [{ name: "PubA" }],
        },
        {
          id: 2,
          sid: "g2",
          name: "Beta",
          image: "b.png",
          publishers: [{ name: "PubB" }],
        },
        {
          id: 3,
          sid: "g3",
          name: "Gamma",
          image: "c.png",
          publishers: [{ name: "PubC" }],
        },
      ]);
      const result = await gameResolvers.Query.searchGames(undefined, {
        query: "alpha",
        limit: 2,
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ publishers: ["PubA"] });
    });
  });

  describe("gamesConnection", () => {
    it("returns edges with cursors and pageInfo", async () => {
      const rows = [
        {
          id: 10,
          sid: "g10",
          name: "Delta",
          image: "d.png",
          descriptionShort: "d",
          descriptionText: "d full",
          publishedStore: new Date("2024-01-01"),
          avgRating: 2.5,
          reviewsCount: 0,
          favoritesCount: 1,
          popularityScore: 5,
          hasRatings: false,
          publishers: [{ name: "PubD" }],
        },
        {
          id: 11,
          sid: "g11",
          name: "Epsilon",
          image: "e.png",
          descriptionShort: "e",
          descriptionText: "e full",
          publishedStore: new Date("2024-02-01"),
          avgRating: 3.1,
          reviewsCount: 1,
          favoritesCount: 2,
          popularityScore: 6,
          hasRatings: true,
          publishers: [{ name: "PubE" }],
        },
        // extra row to signal hasNextPage
        {
          id: 12,
          sid: "g12",
          name: "Zeta",
          image: "z.png",
          descriptionShort: "z",
          descriptionText: "z full",
          publishedStore: new Date("2024-03-01"),
          avgRating: 4.0,
          reviewsCount: 2,
          favoritesCount: 3,
          popularityScore: 7,
          hasRatings: true,
          publishers: [{ name: "PubZ" }],
        },
      ];
      mockPrisma.game.findMany.mockResolvedValue(rows);
      const result = await gameResolvers.Query.gamesConnection(undefined, {
        first: 2,
        search: " ",
      });
      expect(result.edges).toHaveLength(2);
      expect(result.pageInfo.hasNextPage).toBe(true);
      expect(result.pageInfo.startCursor).toBeTruthy();
      expect(result.edges[0].node.publishers).toEqual(["PubD"]);
    });

    it("applies 'after' cursor filtering for subsequent page", async () => {
      const { fields } = planForSort("popularity", "desc");
      type TestCursorRow = {
        id: number;
        name: string;
        publishedStore: Date;
        avgRating: number | Prisma.Decimal | null;
        popularityScore: number | Prisma.Decimal | null;
        hasRatings: boolean | null;
      };
      const firstRow: TestCursorRow = {
        id: 20,
        name: "Alpha",
        publishedStore: new Date("2024-04-01"),
        avgRating: 4.0,
        popularityScore: 100,
        hasRatings: true,
      };
      const cursorFields: CursorField[] = fields.map((f) => ({
        k: f.field as CursorFieldName,
        v: serializeField(f.field as CursorFieldName, firstRow),
      }));
      const afterCursor = encodeCursorTuple(cursorFields);

      mockPrisma.game.findMany.mockResolvedValue([]);
      await gameResolvers.Query.gamesConnection(undefined, {
        first: 1,
        after: afterCursor,
      });
      expect(mockPrisma.game.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ AND: expect.any(Array) }),
        }),
      );
    });
  });
});
