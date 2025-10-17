import type { ResultsPaginationProps } from "@/types/ResultPaginationTypes";
import {
  DISABLED,
  FOCUS_VISIBLE,
  HOVER,
  PILL_TRIGGER_BASE,
} from "../../lib/classNames";

export default function ResultsPagination({
  page,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onPage,
}: ResultsPaginationProps) {
  const prevEnabled = canPrev ?? page > 1;
  const nextEnabled = canNext ?? page < Math.max(totalPages, 1);
  const total = Math.max(totalPages, 1);
  const jumpId = "results-pagination-jump";

  return (
    <nav
      className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap"
      aria-label="Results pagination"
    >
      {/* Prev */}
      <button
        type="button"
        onClick={prevEnabled ? onPrev : undefined}
        disabled={!prevEnabled}
        aria-label="Previous page"
        className={`${PILL_TRIGGER_BASE} ${FOCUS_VISIBLE} ${HOVER} ${DISABLED} select-none`}
      >
        <span aria-hidden>←</span> Prev
      </button>

      {/* Page indicator */}
      <output
        aria-live="polite"
        className="
          rounded-xl px-4 py-2 text-sm font-semibold select-none
          bg-lightpurple dark:bg-darkpurple text-black dark:text-white
          border border-gray-200 dark:border-ashygray
        "
      >
        Page {page} / {total}
      </output>

      {/* Next */}
      <button
        type="button"
        onClick={nextEnabled ? onNext : undefined}
        disabled={!nextEnabled}
        aria-label="Next page"
        className={`${PILL_TRIGGER_BASE} ${FOCUS_VISIBLE} ${HOVER} ${DISABLED} select-none`}
      >
        Next <span aria-hidden>→</span>
      </button>

      {/* Jump-to page */}
      {onPage && total > 1 && (
        <div className="ml-2 sm:ml-3 text-sm flex items-center gap-2">
          <label htmlFor={jumpId} className="text-black dark:text-white">
            Jump to
          </label>
          <select
            id={jumpId}
            className="
              px-2 py-1 rounded-md outline-none
              bg-white dark:bg-darkblack
              border border-gray-200 dark:border-ashygray
              text-black dark:text-white
              focus-visible:outline-blue
            "
            value={page}
            onChange={(e) => onPage(Number(e.target.value))}
          >
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
}
