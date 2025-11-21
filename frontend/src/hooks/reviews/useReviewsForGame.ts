// Fetches game reviews with pagination support and a live average rating.
import { useQuery } from "@apollo/client/react";
import { GET_REVIEWS_FOR_GAME } from "@/lib/graphql";
import type { ReviewsConnection } from "@/components/Reviews";
import { useReviewsMeta } from "@/hooks/reviews/useReviewsMeta";

export function useReviewsForGame(gameId: number | null, first: number = 10) {
  const { data, loading, error, fetchMore } = useQuery<
    { reviewsForGame: ReviewsConnection },
    { gameId: number; first: number; after?: string }
  >(GET_REVIEWS_FOR_GAME, {
    variables: { gameId: gameId || 0, first },
    skip: !gameId,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const { averageStar } = useReviewsMeta(gameId);

  const reviews = data?.reviewsForGame?.edges?.map((e) => e?.node) ?? [];
  const pageInfo = data?.reviewsForGame?.pageInfo;
  const totalCount = data?.reviewsForGame?.totalCount ?? 0;

  const loadMore = async () => {
    if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) return;
    await fetchMore({
      variables: {
        after: pageInfo.endCursor,
      },
    });
  };

  return {
    reviews,
    loading,
    error,
    totalCount,
    hasMore: pageInfo?.hasNextPage ?? false,
    loadMore,
    avg: averageStar ?? 0,
  };
}
