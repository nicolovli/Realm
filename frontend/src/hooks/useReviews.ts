import { useQuery } from "@apollo/client/react";
import {
  GET_REVIEWS_META_FOR_GAME,
  GET_REVIEWS_FOR_GAME,
  GET_USER_REVIEWS,
} from "@/lib/graphql";
import type { ReviewsConnection } from "@/components/Reviews";

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

export function useUserReviews(userId: string | null, first: number = 10) {
  const { data, loading, error, fetchMore } = useQuery<
    { userReviews: ReviewsConnection },
    { userId: string; first: number; after?: string }
  >(GET_USER_REVIEWS, {
    variables: { userId: userId || "", first },
    skip: !userId,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const reviews = data?.userReviews?.edges?.map((e) => e?.node) ?? [];
  const pageInfo = data?.userReviews?.pageInfo;
  const totalCount = data?.userReviews?.totalCount ?? 0;

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
    avg: 0,
  };
}
