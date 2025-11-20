import { useCallback, useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { CREATE_REVIEW, getReviewRefetchQueries } from "@/lib/graphql";
import { BUTTON_BASE, FOCUS_VISIBLE, HOVER } from "@/lib/classNames";
import { StarRating, ReviewTextArea, type Review } from "@/components/Reviews";
import { toast } from "sonner";
import { useReviewsForGame } from "@/hooks/useReviews";
import { useLoginDialog } from "@/hooks/useLoginDialog";
import { AuthDialog } from "@/components/User";

export const ReviewForm = ({
  gameId,
  currentUserId,
}: {
  gameId: number;
  currentUserId?: number;
}) => {
  const [star, setStar] = useState<number>(5);
  const [description, setDescription] = useState("");
  const { open, openLogin, handleOpenChange } = useLoginDialog();

  const apollo = useApolloClient();
  const invalidateGameLists = useCallback(() => {
    try {
      apollo.cache.evict({ fieldName: "gamesConnection" });
      apollo.cache.gc();
      const cacheAny = apollo.cache as { broadcastWatches?: () => void };
      cacheAny.broadcastWatches?.();
    } catch (error) {
      console.warn("Failed to invalidate cached game lists", error);
    }
  }, [apollo]);

  const [createReview, { loading }] = useMutation(CREATE_REVIEW, {
    refetchQueries: getReviewRefetchQueries(gameId),
    errorPolicy: "all",
  });

  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useReviewsForGame(gameId, 100);

  const myExisting: Review | undefined = currentUserId
    ? reviews.find((r: Review) => Number(r.user?.id) === Number(currentUserId))
    : undefined;

  if (reviewsLoading && reviews.length === 0) return null;

  if (reviewsError) {
    return (
      <aside
        role="alert"
        className="rounded-[18px] border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300"
      >
        Could not check existing reviews. Please try again later.
      </aside>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      return toast.error("Log in to submit a review");
    }
    if (
      star < 1 ||
      star > 5 ||
      description.length < 1 ||
      description.length > 500
    )
      return toast.error(
        "Invalid input. Star rating has to be between 1 and 5, and description length has to be between 1 and 500.",
      );
    try {
      await createReview({ variables: { gameId, star, description } });
      invalidateGameLists();
      toast.success("Review posted!");
      setDescription("");
      setStar(5);
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("Error creating review:", error);

      // Check if it's a unique constraint error
      if (
        err?.message?.includes("Unique constraint failed") ||
        err?.message?.includes("A user can only submit a review once")
      ) {
        toast.error(
          "You already have a review for this game. Edit it instead!",
        );
      } else {
        toast.error("Could not submit the review. Please try again.");
      }
    }
  };

  if (myExisting) {
    return null;
  }

  if (!currentUserId)
    return (
      <>
        <span
          data-cy="reviewform_login"
          className="text-xl text-black dark:text-white bg-lightpurple dark:bg-darkpurple rounded-3xl p-8 justify-center"
        >
          If you want to leave a review, you have to{" "}
          <button
            type="button"
            onClick={openLogin}
            disabled={false}
            className={`${FOCUS_VISIBLE} underline dark:hover:brightness-200 hover:brightness-70 text-lightbuttonpurple dark:text-darkbuttonpurple font-semibold cursor-pointer`}
          >
            log in
          </button>{" "}
          first!
        </span>
        <AuthDialog open={open} onOpenChange={handleOpenChange} />
      </>
    );

  return (
    <>
      <form
        onSubmit={onSubmit}
        className={`bg-lightpurple dark:bg-darkpurple rounded-4xl p-6 w-full text-black dark:text-white`}
      >
        <fieldset disabled={loading} className="contents">
          <legend className="sr-only">Write a review!</legend>

          <header className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base md:text-lg font-semibold">
              <span>{currentUserId ? "You" : ""}</span>
            </h3>

            <label className="flex items-center gap-2">
              <span
                className="opacity-80"
                style={{ transform: "translateY(1.2px)" }}
              >
                Rating:
              </span>
              <StarRating value={star} onChange={setStar} />
            </label>
          </header>

          <section className="mt-4">
            <>
              <label htmlFor="description" className="sr-only">
                Review Description
              </label>
              <ReviewTextArea
                value={description}
                onChange={setDescription}
                required
                placeholder="Write a review..."
              />
            </>
          </section>

          <footer className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setDescription("");
                setStar(5);
              }}
              className={`${FOCUS_VISIBLE} ${HOVER} text-sm px-3 py-1 rounded-full cursor-pointer}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              data-cy="submit-review-button"
              aria-busy={loading}
              className={`${BUTTON_BASE} ${FOCUS_VISIBLE} ${HOVER} text-white font-medium px-6 py-2 rounded-full dark:bg-darkbuttonpurple bg-lightbuttonpurple `}
            >
              {loading ? "Sender…" : "Post"}
            </button>
          </footer>
        </fieldset>
      </form>
    </>
  );
};
