import { useEffect, useRef, useState } from "react";
import {
  DISABLED,
  FOCUS_VISIBLE,
  HOVER,
  PILL_TRIGGER_BASE,
  SHADOW_SM,
} from "@/lib/classNames";

export type ResultsPaginationProps = {
  page: number;
  totalPages: number;
  canPrev?: boolean;
  canNext?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPage?: (page: number) => void;
  isJumping?: boolean;
};

export const ResultsPagination = ({
  page,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onPage,
  isJumping,
}: ResultsPaginationProps) => {
  const prevEnabled = canPrev ?? page > 1;
  const nextEnabled = canNext ?? page < Math.max(totalPages, 1);
  const total = Math.max(totalPages, 1);

  const [draft, setDraft] = useState<number>(page);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(page);
  }, [page]);

  const clamp = (n: number) => {
    const v = Number.isFinite(n) ? n : page;
    return Math.max(1, Math.min(total, Math.floor(v)));
  };

  const submitDraft = () => {
    if (!onPage) return;
    const target = clamp(draft);
    if (target !== page) onPage(target);
  };

  const cancelDraft = () => {
    setDraft(page);
  };

  return (
    <nav
      className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap"
      aria-label="Results pagination"
    >
      {/* Prev */}
      <button
        type="button"
        onClick={prevEnabled && !isJumping ? onPrev : undefined}
        disabled={!prevEnabled || isJumping}
        aria-label="Previous page"
        className={`${PILL_TRIGGER_BASE} ${FOCUS_VISIBLE} ${HOVER} ${DISABLED} ${SHADOW_SM} select-none`}
      >
        <span aria-hidden>←</span> Prev
      </button>

      {/* Center: always an input */}
      <form
        className={`
          flex items-center gap-2
          rounded-xl px-3 py-1.5
          bg-lightpurple dark:bg-darkpurple
          border border-gray-200 dark:border-ashygray 
          ${SHADOW_SM}
        `}
        onSubmit={(e) => {
          e.preventDefault();
          submitDraft();
        }}
      >
        <label htmlFor="page-input" className="sr-only">
          Go to page
        </label>

        <span className="text-sm font-semibold text-black dark:text-white">
          Page
        </span>
        <section className="relative">
          <input
            id="page-input"
            ref={inputRef}
            type="text"
            inputMode="numeric"
            aria-label="Page number"
            disabled={isJumping || !onPage}
            min={1}
            max={total}
            value={Number.isNaN(draft) ? "" : draft}
            readOnly={!onPage}
            aria-disabled={!onPage}
            onChange={(e) =>
              setDraft(
                e.target.value === ""
                  ? ("" as unknown as number)
                  : Number(e.target.value),
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                cancelDraft();
                // keep focus for accessibility
                inputRef.current?.select();
              }
            }}
            onBlur={cancelDraft}
            className={`${DISABLED} ${FOCUS_VISIBLE} w-[4.5ch] px-2 py-1 rounded-md outline-none bg-lightsearchbargray dark:bg-darksearchbargray text-black dark:text-white text-sm text-center disabled:opacity-80 disabled:cursor-not-allowed`}
          />
        </section>

        <span className="text-sm font-semibold text-black dark:text-white">
          / {total}
        </span>
      </form>

      {/* Next */}
      <button
        type="button"
        onClick={nextEnabled && !isJumping ? onNext : undefined}
        disabled={!nextEnabled || isJumping}
        aria-label="Next page"
        className={`${PILL_TRIGGER_BASE} ${FOCUS_VISIBLE} ${HOVER} ${DISABLED} select-none`}
      >
        Next <span aria-hidden>→</span>
      </button>
    </nav>
  );
};
