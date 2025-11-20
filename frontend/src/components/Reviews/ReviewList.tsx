import { ReviewItem, StarRating } from "@/components/Reviews";
import { BUTTON_BASE, FOCUS_VISIBLE, HOVER } from "@/lib/classNames";
import { useReviewsForGame, useUserReviews } from "@/hooks/reviews";
import { Link } from "react-router-dom";
import type { Review } from "@/types";
import { useMemo } from "react";

type ReviewWithGame = Review & {
  game?: { id: number | string; name: string };
};

export const ReviewList = ({
  gameId,
  currentUserId,
  isUserReviews = false,
  userId,
}: {
  gameId?: number;
  currentUserId?: number;
  isUserReviews?: boolean;
  userId?: string;
}) => {
  const userReviewsData = useUserReviews(userId || "");
  const gameReviewsData = useReviewsForGame(gameId || null);
  const reviewsData = isUserReviews ? userReviewsData : gameReviewsData;

  const {
    reviews: rawReviews,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    avg,
  } = reviewsData;

  const reviews = useMemo(() => {
    const seen = new Set<string>();
    return rawReviews.filter((review: Review) => {
      const key = review.id;
      if (key == null) return true;
      const normalizedKey = String(key);
      if (seen.has(normalizedKey)) return false;
      seen.add(normalizedKey);
      return true;
    });
  }, [rawReviews]);

  if (loading && reviews.length === 0) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p>Could not load reviews</p>;
  }

  return (
    <section aria-live="polite" className="space-y-4">
      {/* Summary header */}
      <header className="flex items-center gap-3">
        <h2
          className="text-lg text-black dark:text-white md:text-xl font-semibold"
          style={{ transform: "translateY(2px)" }}
        >
          {isUserReviews
            ? `My Reviews (${totalCount ?? 0})`
            : `${totalCount ?? 0} Reviews`}
        </h2>

        {!isUserReviews && (
          <>
            <span
              className="opacity-80 text-lg text-black dark:text-white"
              style={{ transform: "translateY(2px)" }}
            >
              — average {avg.toFixed(1)}
            </span>
            <StarRating value={avg || 0} readOnly />
          </>
        )}
      </header>

      {reviews.length === 0 ? (
        <p className="text-black dark:text-white">
          {isUserReviews
            ? "You haven't written any reviews yet."
            : "No reviews found."}
        </p>
      ) : (
        /* Review list */
        <ul className="space-y-4">
          {reviews.map((review: ReviewWithGame) => {
            const reviewGameId =
              gameId || (review.game?.id ? Number(review.game.id) : 0);
            return (
              <li key={review.id}>
                {isUserReviews && review.game?.name && (
                  <p className="text-l font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Game:{" "}
                    <Link
                      to={`/games/${review.game.id}`}
                      className={`${FOCUS_VISIBLE} hover:underline text-lightbuttonpurple dark:text-lightpurple`}
                    >
                      {review.game.name}
                    </Link>
                  </p>
                )}
                <ReviewItem
                  review={review}
                  gameId={reviewGameId}
                  currentUserId={currentUserId}
                  isUserContext={isUserReviews}
                  userId={userId}
                />
              </li>
            );
          })}
        </ul>
      )}

      {hasMore && (
        /* Load more button */
        <footer className="pt-2 justify-center flex">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className={`${BUTTON_BASE} ${FOCUS_VISIBLE} ${HOVER} mx-auto !text-lg block text-white font-medium px-6 py-2 rounded-full bg-lightbuttonpurple dark:bg-darkbuttonpurple`}
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </footer>
      )}
    </section>
  );
};
