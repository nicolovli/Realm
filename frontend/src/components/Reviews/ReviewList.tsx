import { useQuery } from "@apollo/client/react";
import { NetworkStatus } from "@apollo/client";
import {
  GET_REVIEWS_FOR_GAME,
  GET_REVIEWS_META_FOR_GAME,
} from "../../lib/graphql/queries/reviewQueries";
import ReviewItem from "./ReviewItem";
import { StarRating } from "./StarRating";
import type { Review } from "../../types/Review";
import { BUTTON_BASE, FOCUS_VISIBLE, HOVER } from "@/lib/classNames";
import { useMemo } from "react";

type ReviewsForGameData = {
  reviewsForGame: (Review & {
    user?: { id?: number; username?: string } | null;
  })[];
};
type ReviewsForGameVars = { gameId: number; take?: number; skip?: number };
type ReviewsMetaData = {
  reviewsMetaForGame: { averageStar: number; totalReviews: number };
};
type ReviewsMetaVars = { gameId: number };

const TAKE = 6;

const toNum = (v: unknown): number | null => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

export const ReviewList = ({
  gameId,
  currentUserId,
}: {
  gameId: number;
  currentUserId?: number;
}) => {
  const { data, error, fetchMore, networkStatus } = useQuery<
    ReviewsForGameData,
    ReviewsForGameVars
  >(GET_REVIEWS_FOR_GAME, {
    variables: { gameId, take: TAKE, skip: 0 },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });

  const { data: meta } = useQuery<ReviewsMetaData, ReviewsMetaVars>(
    GET_REVIEWS_META_FOR_GAME,
    { variables: { gameId } },
  );

  const total = meta?.reviewsMetaForGame.totalReviews ?? 0;
  const avg = meta?.reviewsMetaForGame.averageStar ?? 0;

  const all = useMemo(() => data?.reviewsForGame ?? [], [data?.reviewsForGame]);

  const hasMore = all.length < total;
  const loadingMore = networkStatus === NetworkStatus.fetchMore;
  const initialLoading = networkStatus === NetworkStatus.loading;

  const items = useMemo(() => {
    if (!currentUserId) return all;
    const mine = all.filter((r) => toNum(r.user?.id) === toNum(currentUserId));
    const others = all.filter(
      (r) => toNum(r.user?.id) !== toNum(currentUserId),
    );
    return [...mine, ...others];
  }, [all, currentUserId]);

  const handleLoadMore = async () => {
    const nextSkip = all.length;
    await fetchMore({
      variables: { gameId, take: TAKE, skip: nextSkip },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          reviewsForGame: [
            ...prev.reviewsForGame,
            ...fetchMoreResult.reviewsForGame,
          ],
        };
      },
    });
  };

  return (
    <section aria-live="polite" className="space-y-4">
      {initialLoading && <p>Loading reviews...</p>}

      {error && <p>Could not load reviews</p>}
      {!error && (
        <>
          <header className="flex items-center gap-3">
            <h2 className="text-lg text-black dark:text-white md:text-xl font-semibold">
              {total} Reviews
            </h2>
            <span className="opacity-80 text-lg text-black dark:text-white">
              — average {avg.toFixed(1)}
            </span>
            <StarRating value={avg} readOnly />
          </header>

          <ul className="space-y-4">
            {items.map((r) => (
              <li key={r.id}>
                <ReviewItem
                  review={r}
                  gameId={gameId}
                  currentUserId={currentUserId}
                />
              </li>
            ))}
          </ul>

          {hasMore && (
            <footer className="pt-2">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`${BUTTON_BASE} ${FOCUS_VISIBLE} ${HOVER} mx-auto block text-white font-medium px-6 py-2 rounded-full bg-lightbuttonpurple dark:bg-darkbuttonpurple`}
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </footer>
          )}
        </>
      )}
    </section>
  );
};
