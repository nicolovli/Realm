import { useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { CREATE_REVIEW } from "../../lib/graphql/mutations/reviews";
import {
  GET_REVIEWS_FOR_GAME,
  GET_REVIEWS_META_FOR_GAME,
} from "../../lib/graphql/queries/reviewQueries";
import { BUTTON_BASE, FOCUS_VISIBLE, HOVER } from "@/lib/classNames";
import { StarRating } from "./StarRating";
import { toast } from "sonner";
import type { Review } from "../../types/Review";

export const ReviewForm = ({
  gameId,
  currentUserId,
}: {
  gameId: number;
  currentUserId?: number;
}) => {
  const [star, setStar] = useState<number>(5);
  const [description, setDescription] = useState("");
  const apollo = useApolloClient();
  const [createReview, { loading }] = useMutation(CREATE_REVIEW, {
    refetchQueries: [
      { query: GET_REVIEWS_FOR_GAME, variables: { gameId } },
      { query: GET_REVIEWS_META_FOR_GAME, variables: { gameId } },
    ],
    awaitRefetchQueries: true,
  });

  const { data: existingData, loading: reviewsLoading } = useQuery<
    { reviewsForGame: Review[] },
    { gameId: number; take?: number; skip?: number }
  >(GET_REVIEWS_FOR_GAME, {
    variables: { gameId, take: 6, skip: 0 },
    fetchPolicy: "cache-and-network",
  });

  if (reviewsLoading && !existingData) return null;

  const myExisting: Review | undefined = currentUserId
    ? (existingData?.reviewsForGame ?? []).find(
        (r) => Number(r.user?.id) === Number(currentUserId),
      )
    : undefined;

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
      setDescription("");
      setStar(5);
      await apollo.refetchQueries({
        include: [GET_REVIEWS_FOR_GAME, GET_REVIEWS_META_FOR_GAME],
      });
    } catch {
      toast.error(
        "Could not submit the review. A user can only submit a review once.",
      );
    }
  };

  if (myExisting) {
    return null;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-lightpurple dark:bg-darkpurple rounded-4xl p-6 w-full text-black dark:text-white"
    >
      <fieldset disabled={loading} className="contents">
        <legend className="sr-only">Write a review!</legend>

        <header className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base md:text-lg font-semibold">
            <span>{currentUserId ? "You" : "—"}</span>
          </h3>

          <label className="flex items-center gap-2">
            <span className="opacity-80">Rating</span>
            <StarRating value={star} onChange={setStar} />
          </label>
        </header>

        <section className="mt-4">
          <label htmlFor="description" className="sr-only">
            Review Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
            rows={4}
            className={`${FOCUS_VISIBLE} w-full bg-gray-100 dark:bg-white/10 rounded-3xl p-4 leading-relaxed outline-none`}
            placeholder="Write a review!"
          />
        </section>

        <footer className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setDescription("");
              setStar(5);
            }}
            className={`${FOCUS_VISIBLE} ${HOVER} text-sm px-3 py-1 rounded-full cursor-pointer`}
          >
            Cancel
          </button>
          <button
            type="submit"
            aria-busy={loading}
            className={`${BUTTON_BASE} ${FOCUS_VISIBLE} ${HOVER} text-white font-medium px-6 py-2 rounded-full dark:bg-darkbuttonpurple bg-lightbuttonpurple `}
          >
            {loading ? "Sender…" : "Post"}
          </button>
        </footer>
      </fieldset>
    </form>
  );
};
