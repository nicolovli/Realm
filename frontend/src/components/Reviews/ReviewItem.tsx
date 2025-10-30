import { useState } from "react";
import { StarRating } from "./StarRating";
import type { Review } from "../../types/Review";
import { toast } from "sonner";
import { useApolloClient, useMutation } from "@apollo/client/react";
import {
  UPDATE_REVIEW,
  DELETE_REVIEW,
} from "../../lib/graphql/mutations/reviews";
import {
  GET_REVIEWS_FOR_GAME,
  GET_REVIEWS_META_FOR_GAME,
} from "@/lib/graphql/queries/reviewQueries";
import { FOCUS_VISIBLE, HOVER } from "@/lib/classNames";

// Helper function to parse various date formats
const toDate = (v: unknown): Date | null => {
  if (v instanceof Date) return v;
  if (typeof v === "number" && Number.isFinite(v)) return new Date(v);
  if (typeof v === "string") {
    const s = v.trim();
    // epoch i ms som string → number
    if (/^\d+$/.test(s)) {
      const n = Number(s);
      return Number.isFinite(n) ? new Date(n) : null;
    }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
};

// Helper function to format date in a pretty way
const formatPretty = (d: Date) => {
  const now = new Date().getTime();
  const diffSec = Math.round((now - d.getTime()) / 1000);

  if (diffSec < 60) return "now";
  if (diffSec < 3600) return `${Math.round(diffSec / 60)} minutes ago`;
  if (diffSec < 86400) return `${Math.round(diffSec / 3600)} hours ago`;
  if (diffSec < 30 * 86400) return `${Math.round(diffSec / 86400)} days ago`;

  const date = d.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
};

export const ReviewItem = ({
  review,
  currentUserId,
  gameId,
}: {
  review: Review & { user?: { id?: number; username?: string } | null };
  currentUserId?: number;
  gameId: number;
}) => {
  const isMine = Number(review.user?.id) === Number(currentUserId);

  // Date parsing
  const created = toDate(review.createdAt);
  const isoForAttr = created ? created.toISOString() : undefined;
  const pretty = created ? formatPretty(created) : "-";

  // Edit state
  const [editing, setEditing] = useState(false);
  const [draftStar, setDraftStar] = useState<number>(review.star);
  const [draftDesc, setDraftDesc] = useState<string>(review.description);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const apollo = useApolloClient();
  const [updateReview, { loading: updating }] = useMutation(UPDATE_REVIEW, {
    refetchQueries: [
      { query: GET_REVIEWS_FOR_GAME, variables: { gameId } },
      { query: GET_REVIEWS_META_FOR_GAME, variables: { gameId } },
    ],
    awaitRefetchQueries: true,
  });

  const [deleteReview, { loading: deleting }] = useMutation(DELETE_REVIEW, {
    refetchQueries: [
      { query: GET_REVIEWS_FOR_GAME, variables: { gameId } },
      { query: GET_REVIEWS_META_FOR_GAME, variables: { gameId } },
    ],
    awaitRefetchQueries: true,
  });

  const onSave = async () => {
    if (
      draftStar < 1 ||
      draftStar > 5 ||
      draftDesc.length < 1 ||
      draftDesc.length > 500
    ) {
      return toast.error(
        "Invalid input. Star rating has to be between 1 and 5, and description length has to be between 1 and 500.",
      );
    }
    try {
      await updateReview({
        variables: {
          id: Number(review.id),
          star: draftStar,
          description: draftDesc,
        },
      });
      toast.success("Review updated");
      setEditing(false);
      await apollo.refetchQueries({
        include: [GET_REVIEWS_FOR_GAME, GET_REVIEWS_META_FOR_GAME],
      });
    } catch {
      toast.error("Could not update the review.");
    }
  };

  const onCancel = () => {
    setDraftStar(review.star);
    setDraftDesc(review.description);
    setEditing(false);
  };

  const onConfirmDelete = async () => {
    setShowDeleteConfirm(false);

    try {
      await deleteReview({ variables: { id: Number(review.id) } });
      toast.success("Review deleted");
      await apollo.refetchQueries({
        include: [GET_REVIEWS_FOR_GAME, GET_REVIEWS_META_FOR_GAME],
      });
    } catch {
      toast.error("Could not delete the review.");
    }
  };

  return (
    <article
      className={`bg-lightpurple dark:bg-darkpurple rounded-4xl p-6 w-full text-black dark:text-white ${isMine && "mb-10"}`}
      aria-labelledby={`review-${review.id}-heading`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h3
          id={`review-${review.id}-heading`}
          className="text-base md:text-lg font-semibold"
        >
          <span>{review.user?.username ?? "Anon"}</span>
          {isMine && (
            <span className="ml-2 text-lg px-3 py-1 rounded-full bg-white text-black dark:bg-white/80">
              Your review
            </span>
          )}
        </h3>
        {!editing ? (
          <p className="flex items-center gap-2">
            <span className="opacity-80">Rating:</span>
            <StarRating value={review.star} />
          </p>
        ) : (
          <label className="flex items-center gap-2">
            <span className="opacity-80">Rating:</span>
            <StarRating value={draftStar} onChange={setDraftStar} />
          </label>
        )}
      </header>
      {!editing ? (
        <section className="mt-4">
          <h4 className="sr-only">Review</h4>
          <p className="bg-gray-100 dark:bg-white/10 rounded-3xl p-4 leading-relaxed outline-none">
            {review.description}
          </p>
        </section>
      ) : (
        <section className="mt-4">
          <label htmlFor={`edit-review-${review.id}`} className="sr-only">
            Edit your review
          </label>
          <textarea
            id={`edit-review-${review.id}`}
            value={draftDesc}
            onChange={(e) => setDraftDesc(e.target.value)}
            maxLength={500}
            rows={4}
            className={`${FOCUS_VISIBLE} w-full bg-gray-100 dark:bg-white/10 rounded-3xl p-4 leading-relaxed outline-none`}
          />
        </section>
      )}

      <footer
        className={`mt-3 text-xs flex md:flex-row items-center justify-between ${showDeleteConfirm && "flex-col"}`}
      >
        <time
          className={`mt-3 text-black dark:text-white opacity-70 ${showDeleteConfirm && "w-full md:w-auto text-left"}`}
          dateTime={isoForAttr}
          title={created?.toLocaleString("nb-NO")}
        >
          {pretty}
        </time>

        {isMine && (
          <>
            {!editing ? (
              <span className={`flex items-center gap-2`}>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={deleting}
                    className={`${FOCUS_VISIBLE} ${HOVER} mt-3 text-lg px-4 py-1 rounded-full cursor-pointer text-black dark:text-white`}
                    aria-label="Delete review"
                    title="Delete review"
                  >
                    Delete
                  </button>
                ) : (
                  <>
                    <section
                      role="alertdialog"
                      aria-labelledby={`review-${review.id}-heading`}
                      className="mt-3 flex items-center gap-2 rounded md:mr-5"
                    >
                      <span className="text-lg text-black dark:text-white text-center">
                        Delete your review?
                      </span>

                      <section className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className={`${FOCUS_VISIBLE} ${HOVER} text-lg px-3 py-1 rounded-full cursor-pointer`}
                          aria-label="Cancel delete"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={onConfirmDelete}
                          disabled={deleting}
                          className={`${FOCUS_VISIBLE} ${HOVER} text-lg px-3 py-1 rounded-full bg-red-600 text-white cursor-pointer`}
                          aria-label="Confirm delete review"
                        >
                          {deleting ? "Deleting…" : "Confirm"}
                        </button>
                      </section>
                    </section>
                  </>
                )}

                <button
                  onClick={() => setEditing(true)}
                  disabled={updating}
                  className={`${FOCUS_VISIBLE} ${HOVER} mt-3 font-semibold text-lg px-4 py-1 rounded-full cursor-pointer text-white bg-lightbuttonpurple dark:bg-darkbuttonpurple whitespace-nowrap ${showDeleteConfirm && "hidden md:inline-flex"}`}
                >
                  Edit your review
                </button>
              </span>
            ) : (
              <section className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={updating}
                  className={`${FOCUS_VISIBLE} ${HOVER} mt-1 text-lg px-4 py-1 rounded-full cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={updating}
                  className={`${FOCUS_VISIBLE} ${HOVER} mt-1 text-lg px-4 py-1 rounded-full text-white bg-lightbuttonpurple dark:bg-darkbuttonpurple cursor-pointer whitespace-nowrap`}
                >
                  {updating ? "Saving..." : "Save your review"}
                </button>
              </section>
            )}
          </>
        )}
      </footer>
    </article>
  );
};

export default ReviewItem;
