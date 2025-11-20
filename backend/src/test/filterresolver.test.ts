import { filterResolvers } from "../graphql/filter/filterResolvers.js";
import { prisma } from "../db.js";
import { TOP_PUBLISHERS } from "../constants/topPublishers.js";

jest.mock("../db.js", () => ({
  prisma: {
    genre: { findMany: jest.fn() },
    category: { findMany: jest.fn() },
    platform: { findMany: jest.fn() },
    tag: { findMany: jest.fn() },
    publisher: { findMany: jest.fn() },
  },
}));

const mockPrisma = prisma as unknown as {
  genre: { findMany: jest.Mock };
  category: { findMany: jest.Mock };
  platform: { findMany: jest.Mock };
  tag: { findMany: jest.Mock };
  publisher: { findMany: jest.Mock };
};

describe("filterResolvers -> filteroptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all filter options correctly", async () => {
    // Mock database returns
    mockPrisma.genre.findMany.mockResolvedValue([{ id: 1, name: "Action" }]);
    mockPrisma.category.findMany.mockResolvedValue([{ id: 2, name: "Indie" }]);
    mockPrisma.platform.findMany.mockResolvedValue([{ id: 3, name: "PC" }]);
    mockPrisma.tag.findMany.mockResolvedValue([{ id: 4, name: "Multiplayer" }]);
    mockPrisma.publisher.findMany.mockResolvedValue([
      { id: 5, name: TOP_PUBLISHERS[0] },
    ]);

    const result = await filterResolvers.Query.filterOptions();

    expect(result).toEqual({
      genres: [{ id: 1, name: "Action" }],
      categories: [{ id: 2, name: "Indie" }],
      platforms: [{ id: 3, name: "PC" }],
      publishers: [{ id: 5, name: TOP_PUBLISHERS[0] }],
      tags: [{ id: 4, name: "Multiplayer" }],
    });

    expect(prisma.publisher.findMany).toHaveBeenCalledWith({
      where: { name: { in: TOP_PUBLISHERS } },
      orderBy: { name: "asc" },
    });
  });

  it("handles empty database tables without failing (edge-case)", async () => {
    mockPrisma.genre.findMany.mockResolvedValue([]);
    mockPrisma.category.findMany.mockResolvedValue([]);
    mockPrisma.platform.findMany.mockResolvedValue([]);
    mockPrisma.tag.findMany.mockResolvedValue([]);
    mockPrisma.publisher.findMany.mockResolvedValue([]);

    const result = await filterResolvers.Query.filterOptions();

    expect(result).toEqual({
      genres: [],
      categories: [],
      platforms: [],
      publishers: [],
      tags: [],
    });
  });

  it("throws an error if Prisma fails (error-handling test)", async () => {
    mockPrisma.genre.findMany.mockRejectedValue(new Error("Database failure"));

    await expect(filterResolvers.Query.filterOptions()).rejects.toThrow(
      "Database failure",
    );
  });
});

describe("filterResolvers -> availableFilterOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all option names when no filter and no search", async () => {
    mockPrisma.genre.findMany.mockResolvedValue([
      { name: "Action" },
      { name: "RPG" },
    ]);
    mockPrisma.category.findMany.mockResolvedValue([
      { name: "Indie" },
      { name: "Strategy" },
    ]);
    mockPrisma.platform.findMany.mockResolvedValue([
      { name: "PC" },
      { name: "Mac" },
    ]);
    mockPrisma.publisher.findMany.mockResolvedValue([
      { name: TOP_PUBLISHERS[0] },
      { name: TOP_PUBLISHERS[1] },
    ]);
    mockPrisma.tag.findMany.mockResolvedValue([
      { name: "Multiplayer" },
      { name: "Co-op" },
    ]);

    const result = await filterResolvers.Query.availableFilterOptions(
      undefined,
      { filter: {}, search: null },
    );

    expect(result).toEqual({
      genres: ["Action", "RPG"],
      categories: ["Indie", "Strategy"],
      platforms: ["PC", "Mac"],
      publishers: [TOP_PUBLISHERS[0], TOP_PUBLISHERS[1]],
      tags: ["Multiplayer", "Co-op"],
    });
  });

  it("excludes already selected filter values (e.g. selected genres)", async () => {
    mockPrisma.genre.findMany.mockResolvedValue([
      { name: "Action" },
      { name: "RPG" },
    ]);
    mockPrisma.category.findMany.mockResolvedValue([]);
    mockPrisma.platform.findMany.mockResolvedValue([]);
    mockPrisma.publisher.findMany.mockResolvedValue([]);
    mockPrisma.tag.findMany.mockResolvedValue([]);

    const result = await filterResolvers.Query.availableFilterOptions(
      undefined,
      { filter: { genres: ["Action"] }, search: null },
    );

    expect(result.genres).toEqual(["RPG"]);
  });

  it("deduplicates and sorts option names (relation-query path)", async () => {
    mockPrisma.genre.findMany.mockResolvedValue([
      { name: "RPG" },
      { name: "Action" },
      { name: "RPG" },
    ]);
    mockPrisma.category.findMany.mockResolvedValue([]);
    mockPrisma.platform.findMany.mockResolvedValue([]);
    mockPrisma.publisher.findMany.mockResolvedValue([]);
    mockPrisma.tag.findMany.mockResolvedValue([]);

    const result = await filterResolvers.Query.availableFilterOptions(
      undefined,
      { filter: {}, search: "RPG" },
    );

    expect(result.genres).toEqual(["Action", "RPG"]);
  });

  it("respects other selected filters when computing options (cross-filter constraint)", async () => {
    mockPrisma.genre.findMany.mockImplementation(async (args: unknown) => {
      const a = args as { where?: { games?: { some?: unknown } } } | undefined;
      expect(a?.where?.games?.some).toBeDefined();
      return [{ name: "Action" }, { name: "RPG" }];
    });
    mockPrisma.category.findMany.mockResolvedValue([
      { name: "Indie" },
      { name: "Strategy" },
    ]);
    mockPrisma.platform.findMany.mockResolvedValue([]);
    mockPrisma.publisher.findMany.mockResolvedValue([]);
    mockPrisma.tag.findMany.mockResolvedValue([]);

    const result = await filterResolvers.Query.availableFilterOptions(
      undefined,
      { filter: { categories: ["Indie"] }, search: null },
    );

    expect(result.genres).toEqual(["Action", "RPG"]);
    expect(result.categories).toEqual(["Strategy"]);
  });

  it("propagates errors from prisma calls", async () => {
    mockPrisma.genre.findMany.mockRejectedValue(new Error("DB explode"));
    mockPrisma.category.findMany.mockResolvedValue([]);
    mockPrisma.platform.findMany.mockResolvedValue([]);
    mockPrisma.publisher.findMany.mockResolvedValue([]);
    mockPrisma.tag.findMany.mockResolvedValue([]);

    await expect(
      filterResolvers.Query.availableFilterOptions(undefined, {
        filter: {},
        search: null,
      }),
    ).rejects.toThrow("DB explode");
  });
});
