import { Context } from "../context.js";
import { Prisma } from "@prisma/client";

export function validateStar(star: number) {
  if (star < 1 || star > 5)
    throw new Error("Star rating must be between 1 and 5.");
}

export function validateDescription(description: string) {
  if (description.length < 1 || description.length > 500)
    throw new Error("Description must be between 1 and 500 characters.");
}

export function checkAuthenticated(userId?: number) {
  if (!userId) throw new Error("Not authenticated.");
}

// Helper to ensure user owns the review
export async function checkReviewOwnership(
  id: number,
  userId: number,
  ctx: Context,
) {
  const review = await ctx.prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found.");
  if (review.userId !== userId)
    throw new Error("You can only modify your own reviews.");
  return review;
}

// Helper to recompute game aggregates after review changes
export async function updateGameAggregates(
  gameId: number,
  tx: Prisma.TransactionClient,
) {
  const [reviewCount, avgAgg, favCount] = await Promise.all([
    tx.review.count({ where: { gameId } }),
    tx.review.aggregate({
      where: { gameId },
      _avg: { star: true },
    }),
    tx.user.count({
      where: { favorites: { some: { id: gameId } } },
    }),
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
}
