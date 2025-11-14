import { Context } from "../context.js";
import {
  checkAuthenticated,
  checkReviewOwnership,
  validateDescription,
  validateStar,
  updateGameAggregates,
  DeleteReviewArgs,
  ReviewArgs,
  ReviewsForGameArgs,
  UpdateReviewArgs,
} from "./index.js";
import type { Prisma } from "@prisma/client";
import { clearGamesCache } from "../game/index.js";
import { clearFilterCache } from "../filter/index.js";

export const reviewResolvers = {
  Query: {
    reviewsForGame: async (
      _parent: unknown,
      args: ReviewsForGameArgs,
      ctx: Context,
    ) => {
      const { gameId, first = 6, after } = args;
      const userId = ctx.userId ?? null;

      // If the viewer has their own review, show it first on the first page,
      // then fill the rest with latest reviews. On subsequent pages we skip over it.
      // This preserves perceived ownership without breaking pagination math.

      const where = { gameId };

      // Get all reviews for this game
      const allReviews = await ctx.prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      // Find user's review if they have one
      const myReviewIndex = userId
        ? allReviews.findIndex((r) => r.userId === userId)
        : -1;

      // Reorder so user's review is first
      const orderedReviews =
        myReviewIndex > -1
          ? [
              allReviews[myReviewIndex],
              ...allReviews.slice(0, myReviewIndex),
              ...allReviews.slice(myReviewIndex + 1),
            ]
          : allReviews;

      // Apply cursor-based pagination
      const startIndex = (() => {
        if (after) {
          const decodedCursor = Buffer.from(after, "base64").toString("utf-8");
          const cursorId = parseInt(decodedCursor, 10);
          return orderedReviews.findIndex((r) => r.id === cursorId) + 1;
        }
        return 0;
      })();

      const paginatedReviews = orderedReviews.slice(
        startIndex,
        startIndex + (first ?? 6),
      );
      const hasNextPage = orderedReviews.length > startIndex + (first ?? 6);

      const edges = paginatedReviews.map((review) => ({
        node: review,
        cursor: Buffer.from(review.id.toString(), "utf-8").toString("base64"),
      }));

      return {
        edges,
        pageInfo: {
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage,
        },
        totalCount: orderedReviews.length,
      };
    },

    reviewsMetaForGame: async (
      _parent: unknown,
      { gameId }: { gameId: number },
      ctx: Context,
    ) => {
      const [count, avg] = await Promise.all([
        ctx.prisma.review.count({ where: { gameId } }),
        ctx.prisma.review.aggregate({
          where: { gameId },
          _avg: { star: true },
        }),
      ]);
      return {
        averageStar: avg._avg.star ?? 0,
        totalReviews: count,
      };
    },

    userReviews: async (
      _parent: unknown,
      {
        userId,
        first = 10,
        after,
      }: { userId: string; first?: number; after?: string },
      ctx: Context,
    ) => {
      const numericUserId = parseInt(userId, 10);
      if (Number.isNaN(numericUserId)) {
        throw new Error("Invalid userId");
      }

      const where = { userId: numericUserId };
      const take = (first ?? 10) + 1; // +1 to check if there's a next page
      const skip = after ? 1 : 0; // Skip the cursor itself
      const cursor: { id: number } | undefined = after
        ? (() => {
            const decodedCursor = Buffer.from(after, "base64").toString(
              "utf-8",
            );
            return { id: parseInt(decodedCursor, 10) };
          })()
        : undefined;

      const reviews = await ctx.prisma.review.findMany({
        where,
        take,
        skip,
        cursor: cursor ? cursor : undefined,
        orderBy: { createdAt: "desc" },
      });

      const pageSize = first ?? 10;
      const hasNextPage = reviews.length > pageSize;
      const reviewsToReturn = hasNextPage
        ? reviews.slice(0, pageSize)
        : reviews;

      const edges = reviewsToReturn.map((review) => ({
        node: review,
        cursor: Buffer.from(review.id.toString(), "utf-8").toString("base64"),
      }));

      const totalCount = await ctx.prisma.review.count({ where });

      return {
        edges,
        pageInfo: {
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage,
        },
        totalCount,
      };
    },
  },

  Mutation: {
    createReview: async (_parent: unknown, args: ReviewArgs, ctx: Context) => {
      const { gameId, star, description } = args;
      const userId = ctx.userId;
      checkAuthenticated(userId);

      try {
        const result = await ctx.prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            const review = await tx.review.create({
              data: {
                game: { connect: { id: gameId } },
                user: { connect: { id: userId } },
                star,
                description,
              },
            });

            await updateGameAggregates(gameId, tx);

            return review;
          },
        );
        return result;
      } catch (error) {
        console.error(`[Backend] createReview FAILED:`, error);
        throw error;
      } finally {
        clearGamesCache();
        clearFilterCache();
      }
    },

    updateReview: async (
      _parent: unknown,
      args: UpdateReviewArgs,
      ctx: Context,
    ) => {
      const { id, star, description } = args;
      const userId = ctx.userId;
      checkAuthenticated(userId);
      await checkReviewOwnership(id, userId!, ctx);
      await checkReviewOwnership(id, userId!, ctx);

      if (star !== undefined) validateStar(star);
      if (description !== undefined) validateDescription(description);

      try {
        const result = await ctx.prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            const review = await tx.review.update({
              where: { id },
              data: {
                ...(star !== undefined && { star }),
                ...(description !== undefined && { description }),
              },
            });

            if (star !== undefined) {
              await updateGameAggregates(review.gameId, tx);
            }
            return review;
          },
        );
        return result;
      } catch (error) {
        throw error;
      } finally {
        clearGamesCache();
        clearFilterCache();
      }
    },

    deleteReview: async (
      _parent: unknown,
      args: DeleteReviewArgs,
      ctx: Context,
    ) => {
      const { id } = args;
      checkAuthenticated(ctx.userId);

      const review = await checkReviewOwnership(id, ctx.userId!, ctx);

      try {
        const result = await ctx.prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            await tx.review.delete({ where: { id: review.id } });
            await updateGameAggregates(review.gameId, tx);
            return true;
          },
        );

        return result;
      } catch (error) {
        throw error;
      } finally {
        clearGamesCache();
        clearFilterCache();
      }
    },
  },

  Review: {
    user: (parent: { userId: number }, _args: unknown, ctx: Context) =>
      ctx.prisma.user.findUnique({ where: { id: parent.userId } }),
    game: (parent: { gameId: number }, _args: unknown, ctx: Context) =>
      ctx.prisma.game.findUnique({ where: { id: parent.gameId } }),
  },
};
