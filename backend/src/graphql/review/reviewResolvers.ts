import { Prisma } from "@prisma/client";
import { Context } from "../context.js";
import {
  checkAuthenticated,
  checkReviewOwnership,
  validateDescription,
  validateStar,
} from "./reviewHelpers.js";
import {
  DeleteReviewArgs,
  ReviewArgs,
  ReviewsForGameArgs,
  UpdateReviewArgs,
} from "./reviewTypes.js";

export const reviewResolvers = {
  Query: {
    reviewsForGame: async (
      _parent: unknown,
      args: ReviewsForGameArgs,
      ctx: Context,
    ) => {
      const { gameId, take = 6, skip = 0 } = args;
      const userId = ctx.userId ?? null;

      const myReview = userId
        ? await ctx.prisma.review.findFirst({ where: { gameId, userId } })
        : null;

      if (!myReview) {
        return ctx.prisma.review.findMany({
          where: { gameId },
          orderBy: { createdAt: "desc" },
          take,
          skip,
        });
      }

      const isFirstPage = skip === 0;

      if (isFirstPage) {
        const others = await ctx.prisma.review.findMany({
          where: { gameId, NOT: { id: myReview.id } },
          orderBy: { createdAt: "desc" },
          take: Math.max(0, take - 1),
          skip: 0,
        });
        return [myReview, ...others];
      }

      const effectiveSkip = Math.max(0, skip - 1);
      return ctx.prisma.review.findMany({
        where: { gameId, NOT: { id: myReview.id } },
        orderBy: { createdAt: "desc" },
        take,
        skip: effectiveSkip,
      });
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
  },

  Mutation: {
    createReview: async (_parent: unknown, args: ReviewArgs, ctx: Context) => {
      const { gameId, star, description } = args;
      const userId = ctx.userId;
      checkAuthenticated(userId);

      // validations
      return await ctx.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const review = await tx.review.create({
            data: {
              game: { connect: { id: gameId } },
              user: { connect: { id: userId } },
              star,
              description,
            },
          });

          // recompute aggregates
          const [reviewCount, avgAgg, favCount] = await Promise.all([
            tx.review.count({ where: { gameId } }),
            tx.review.aggregate({ where: { gameId }, _avg: { star: true } }),
            tx.user.count({ where: { favorites: { some: { id: gameId } } } }),
          ]);

          const avg = avgAgg._avg.star ?? 0;
          const hasRatings = reviewCount > 0;
          const popularityScore = favCount * 2 + reviewCount;

          await tx.game.update({
            where: { id: gameId },
            data: {
              reviewsCount: reviewCount,
              avgRating: hasRatings ? avg : null,
              hasRatings,
              favoritesCount: favCount,
              popularityScore,
            },
          });

          return review;
        },
      );
    },

    updateReview: async (
      _parent: unknown,
      args: UpdateReviewArgs,
      ctx: Context,
    ) => {
      const { id, star, description } = args;
      const userId = ctx.userId;
      checkAuthenticated(userId);
      checkReviewOwnership(id, userId!, ctx);

      if (star !== undefined) validateStar(star);
      if (description !== undefined) validateDescription(description);

      return ctx.prisma.review.update({
        where: { id },
        data: {
          ...(star !== undefined && { star }),
          ...(description !== undefined && { description }),
        },
      });
    },

    deleteReview: async (
      _parent: unknown,
      args: DeleteReviewArgs,
      ctx: Context,
    ) => {
      const { id } = args;
      checkAuthenticated(ctx.userId);

      const review = await checkReviewOwnership(id, ctx.userId!, ctx);
      await ctx.prisma.review.delete({ where: { id: review.id } });
      return true;
    },
  },

  Review: {
    user: (parent: { userId: number }, _args: unknown, ctx: Context) =>
      ctx.prisma.user.findUnique({ where: { id: parent.userId } }),
    game: (parent: { gameId: number }, _args: unknown, ctx: Context) =>
      ctx.prisma.game.findUnique({ where: { id: parent.gameId } }),
  },
};
