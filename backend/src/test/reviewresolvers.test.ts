import { reviewResolvers } from "../graphql/review/reviewResolvers.js";
import type { Context } from "../graphql/context.js";
import type { Prisma, Review, User, Game } from "@prisma/client";
import {
  checkAuthenticated,
  checkReviewOwnership,
  validateDescription,
  validateStar,
  updateGameAggregates,
} from "../graphql/review/index.js";
import { clearGamesCache } from "../graphql/game/index.js";

jest.mock("../graphql/review/index.js", () => ({
  checkAuthenticated: jest.fn(),
  checkReviewOwnership: jest.fn(),
  validateDescription: jest.fn(),
  validateStar: jest.fn(),
  updateGameAggregates: jest.fn(),
}));

jest.mock("../graphql/game/index.js", () => ({
  clearGamesCache: jest.fn(),
}));

const mockReview = (id: number): Review => ({
  id,
  userId: 1,
  gameId: 10,
  star: 4,
  description: "Nice game",
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createMockContext = (): Context => {
  const reviewQueries = {
    findMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  };

  return {
    prisma: {
      review: reviewQueries,
      user: { findUnique: jest.fn() },
      game: { findUnique: jest.fn() },
      $transaction: jest.fn(),
    } as unknown as Context["prisma"],
    userId: 1,
  };
};

describe("reviewResolvers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("reviewsForGame", () => {
    it("returns paginated reviews with edges and pageInfo", async () => {
      const ctx = createMockContext();

      ctx.prisma.review.findMany = jest
        .fn()
        .mockResolvedValue([mockReview(20), mockReview(19), mockReview(18)]);

      ctx.prisma.review.count = jest.fn().mockResolvedValue(3);

      const result = await reviewResolvers.Query.reviewsForGame(
        {},
        { gameId: 10, first: 2 },
        ctx,
      );

      expect(result.edges.length).toBe(2);
      expect(result.pageInfo.hasNextPage).toBe(true);
      expect(result.totalCount).toBe(3);
    });

    it("returns empty list and hasNextPage false when no reviews", async () => {
      const ctx = createMockContext();
      ctx.prisma.review.findMany = jest.fn().mockResolvedValue([]);
      ctx.prisma.review.count = jest.fn().mockResolvedValue(0);
      const result = await reviewResolvers.Query.reviewsForGame(
        {},
        { gameId: 10, first: 5 },
        ctx,
      );
      expect(result.edges).toHaveLength(0);
      expect(result.pageInfo.hasNextPage).toBe(false);
      expect(result.totalCount).toBe(0);
    });

    it("ignores invalid base64 cursor and does not skip", async () => {
      const ctx = createMockContext();
      const reviews = [mockReview(2), mockReview(1)];
      ctx.prisma.review.findMany = jest.fn().mockResolvedValue(reviews);
      ctx.prisma.review.count = jest.fn().mockResolvedValue(2);
      await reviewResolvers.Query.reviewsForGame(
        {},
        { gameId: 10, first: 2, after: "**invalid**" },
        ctx,
      );
      expect(
        (ctx.prisma.review.findMany as jest.Mock).mock.calls[0][0].skip,
      ).toBe(0);
    });
  });

  describe("reviewsMetaForGame", () => {
    it("returns total count and average rating", async () => {
      const ctx = createMockContext();

      ctx.prisma.review.count = jest.fn().mockResolvedValue(5);
      ctx.prisma.review.aggregate = jest.fn().mockResolvedValue({
        _avg: { star: 4.2 },
      });

      const result = await reviewResolvers.Query.reviewsMetaForGame(
        {},
        { gameId: 10 },
        ctx,
      );

      expect(result.totalReviews).toBe(5);
      expect(result.averageStar).toBe(4.2);
    });
  });

  describe("userReviews", () => {
    it("returns paginated user reviews", async () => {
      const ctx = createMockContext();

      ctx.prisma.review.findMany = jest
        .fn()
        .mockResolvedValue([mockReview(10), mockReview(9)]);

      ctx.prisma.review.count = jest.fn().mockResolvedValue(2);

      const result = await reviewResolvers.Query.userReviews(
        {},
        { userId: "1", first: 1 },
        ctx,
      );

      expect(result.edges.length).toBe(1);
      expect(result.pageInfo.hasNextPage).toBe(true);
    });

    it("returns last page with hasNextPage false", async () => {
      const ctx = createMockContext();
      ctx.prisma.review.findMany = jest.fn().mockResolvedValue([mockReview(5)]);
      ctx.prisma.review.count = jest.fn().mockResolvedValue(1);
      const result = await reviewResolvers.Query.userReviews(
        {},
        { userId: "1", first: 1 },
        ctx,
      );
      expect(result.edges).toHaveLength(1);
      expect(result.pageInfo.hasNextPage).toBe(false);
    });

    it("throws on invalid userId", async () => {
      const ctx = createMockContext();

      await expect(
        reviewResolvers.Query.userReviews({}, { userId: "not-a-number" }, ctx),
      ).rejects.toThrow("Invalid userId");
    });
  });

  describe("createReview", () => {
    it("creates a new review and updates aggregates", async () => {
      const ctx = createMockContext();

      (checkAuthenticated as jest.Mock).mockReturnValue(undefined);
      ctx.prisma.$transaction = jest
        .fn()
        .mockImplementation(
          async (
            callback: (tx: Prisma.TransactionClient) => Promise<Review>,
          ) => {
            const tx = {
              review: {
                create: jest.fn().mockResolvedValue(mockReview(1)),
              },
            } as unknown as Prisma.TransactionClient;

            return callback(tx);
          },
        );

      const result = await reviewResolvers.Mutation.createReview(
        {},
        { gameId: 10, star: 4, description: "Good" },
        ctx,
      );

      expect(result.id).toBe(1);
      expect(validateStar).toHaveBeenCalledWith(4);
      expect(validateDescription).toHaveBeenCalledWith("Good");
      expect(updateGameAggregates).toHaveBeenCalled();
      expect(clearGamesCache).toHaveBeenCalled();
    });

    it("throws on invalid star rating", async () => {
      const ctx = createMockContext();
      (checkAuthenticated as jest.Mock).mockReturnValue(undefined);
      (validateStar as jest.Mock).mockImplementation(() => {
        throw new Error("Star rating must be between 1 and 5.");
      });
      await expect(
        reviewResolvers.Mutation.createReview(
          {},
          { gameId: 10, star: 0, description: "Bad" },
          ctx,
        ),
      ).rejects.toThrow("Star rating must be between 1 and 5.");
    });

    it("throws on invalid description", async () => {
      const ctx = createMockContext();
      (checkAuthenticated as jest.Mock).mockReturnValue(undefined);
      (validateStar as jest.Mock).mockImplementation(() => undefined);
      (validateDescription as jest.Mock).mockImplementation(() => {
        throw new Error("Description must be between 1 and 500 characters.");
      });
      await expect(
        reviewResolvers.Mutation.createReview(
          {},
          { gameId: 10, star: 4, description: "" },
          ctx,
        ),
      ).rejects.toThrow("Description must be between 1 and 500 characters.");
    });
  });

  describe("updateReview", () => {
    it("updates a review", async () => {
      const ctx = createMockContext();

      (checkAuthenticated as jest.Mock).mockReturnValue(undefined);
      (checkReviewOwnership as jest.Mock).mockResolvedValue(mockReview(5));

      ctx.prisma.$transaction = jest
        .fn()
        .mockImplementation(
          async (
            callback: (tx: Prisma.TransactionClient) => Promise<Review>,
          ) => {
            const tx = {
              review: {
                update: jest.fn().mockResolvedValue({
                  ...mockReview(5),
                  star: 5,
                }),
              },
            } as unknown as Prisma.TransactionClient;

            return callback(tx);
          },
        );

      const result = await reviewResolvers.Mutation.updateReview(
        {},
        { id: 5, star: 5 },
        ctx,
      );

      expect(result.star).toBe(5);
      expect(updateGameAggregates).toHaveBeenCalled();
      expect(clearGamesCache).toHaveBeenCalled();
    });

    it("throws on invalid new star", async () => {
      const ctx = createMockContext();
      (checkAuthenticated as jest.Mock).mockReturnValue(undefined);
      (checkReviewOwnership as jest.Mock).mockResolvedValue(mockReview(7));
      (validateStar as jest.Mock).mockImplementation(() => {
        throw new Error("Star rating must be between 1 and 5.");
      });
      await expect(
        reviewResolvers.Mutation.updateReview({}, { id: 7, star: 10 }, ctx),
      ).rejects.toThrow("Star rating must be between 1 and 5.");
    });
  });

  describe("deleteReview", () => {
    it("deletes a review", async () => {
      const ctx = createMockContext();
      const review = mockReview(3);

      (checkReviewOwnership as jest.Mock).mockResolvedValue(review);

      ctx.prisma.$transaction = jest
        .fn()
        .mockImplementation(
          async (
            callback: (tx: Prisma.TransactionClient) => Promise<boolean>,
          ) => {
            const tx = {
              review: {
                delete: jest.fn().mockResolvedValue(undefined),
              },
            } as unknown as Prisma.TransactionClient;

            return callback(tx);
          },
        );

      const result = await reviewResolvers.Mutation.deleteReview(
        {},
        { id: 3 },
        ctx,
      );

      expect(result).toBe(true);
      expect(updateGameAggregates).toHaveBeenCalledWith(
        review.gameId,
        expect.any(Object),
      );
      expect(clearGamesCache).toHaveBeenCalled();
    });

    it("propagates authentication failure", async () => {
      const ctx = createMockContext();
      (checkAuthenticated as jest.Mock).mockImplementation(() => {
        throw new Error("Not authenticated.");
      });
      await expect(
        reviewResolvers.Mutation.deleteReview({}, { id: 99 }, ctx),
      ).rejects.toThrow("Not authenticated.");
    });
  });

  describe("Review field resolvers", () => {
    it("resolves user", async () => {
      const ctx = createMockContext();
      const user: User = {
        id: 1,
        username: "test",
        email: "x@y.com",
        password: "",
      };

      ctx.prisma.user.findUnique = jest.fn().mockResolvedValue(user);

      const result = await reviewResolvers.Review.user({ userId: 1 }, {}, ctx);

      expect(result).toBe(user);
    });

    it("returns null when user not found", async () => {
      const ctx = createMockContext();
      ctx.prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const result = await reviewResolvers.Review.user(
        { userId: 999 },
        {},
        ctx,
      );
      expect(result).toBeNull();
    });

    it("resolves game", async () => {
      const ctx = createMockContext();
      const game: Game = {
        id: 10,
        sid: 1,
        name: "Game",
        image: null,
        descriptionHtml: null,
        descriptionText: null,
        descriptionShort: null,
        publishedStore: null,
        avgRating: null,
        reviewsCount: 0,
        favoritesCount: 0,
        popularityScore: 0,
        hasRatings: false,
      };

      ctx.prisma.game.findUnique = jest.fn().mockResolvedValue(game);

      const result = await reviewResolvers.Review.game({ gameId: 10 }, {}, ctx);

      expect(result).toBe(game);
    });

    it("returns null when game not found", async () => {
      const ctx = createMockContext();
      ctx.prisma.game.findUnique = jest.fn().mockResolvedValue(null);
      const result = await reviewResolvers.Review.game(
        { gameId: 999 },
        {},
        ctx,
      );
      expect(result).toBeNull();
    });
  });
});
