// Fetches paginated reviews authored by a specific user.
import { useQuery } from "@apollo/client/react";
import { GET_USER_REVIEWS } from "@/lib/graphql";
import type { ReviewsConnection } from "@/components/Reviews";

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
