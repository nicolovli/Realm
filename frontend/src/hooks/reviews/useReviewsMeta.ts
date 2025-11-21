// Lightweight hook for fetching average rating + review count.
import { useQuery } from "@apollo/client/react";
import { GET_REVIEWS_META_FOR_GAME } from "@/lib/graphql";

export function useReviewsMeta(gameId: number | null) {
  const { data, loading, error } = useQuery<
    { reviewsMetaForGame: { averageStar: number; totalReviews: number } },
    { gameId: number }
  >(GET_REVIEWS_META_FOR_GAME, {
    variables: { gameId: gameId || 0 },
    skip: !gameId,
    fetchPolicy: "cache-first",
  });

  return {
    averageStar: data?.reviewsMetaForGame?.averageStar,
    totalReviews: data?.reviewsMetaForGame?.totalReviews,
    loading,
    error,
  };
}
