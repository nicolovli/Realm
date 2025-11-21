import { ResultFilters } from "@/components/ResultFilters";
import { ResultsGrid, ResultsPagination } from "@/components/ResultsGrid";
import { useResultFilters } from "@/hooks/resultFilters";
import { ELEVATED_CONTAINER } from "@/lib/classNames";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";

export const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || undefined;

  const filters = useResultFilters(searchQuery);
  const { currentPage, isJumping, loadingPage } = filters;

  const prevPageRef = useRef<number>(currentPage);
  const prevJumpingRef = useRef<boolean>(isJumping);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    prevPageRef.current = currentPage;
    prevJumpingRef.current = isJumping;
  }, [currentPage, isJumping]);

  useEffect(() => {
    const pageChanged = prevPageRef.current !== currentPage;
    const finishedJump =
      prevJumpingRef.current && !isJumping && loadingPage === null;
    if (pageChanged || finishedJump) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      prevPageRef.current = currentPage;
    }
    prevJumpingRef.current = isJumping;
  }, [currentPage, isJumping, loadingPage]);

  const busy =
    filters.gamesLoading ||
    filters.isLoading ||
    filters.isJumping ||
    filters.isPending;

  const isPaging = filters.loadingPage !== null;
  const gamesForGrid = isPaging ? [] : filters.games;

  const showLoadingSkeletons = isPaging || (busy && gamesForGrid.length === 0);

  return (
    <main className="!p-0 !gap-8">
      {/* Elevated container for filters and results grid */}
      <article
        className={`w-[min(1600px,92%)] mx-auto ${ELEVATED_CONTAINER} flex flex-col gap-8 `}
      >
        {" "}
        <section aria-label="Result filters">
          <ResultFilters {...filters} searchQuery={searchQuery} />
        </section>
        <section aria-label="Game list">
          <ResultsGrid
            games={gamesForGrid}
            loading={showLoadingSkeletons}
            error={filters.gamesError}
            emptyState="No games match the current filters."
          />
        </section>
      </article>

      {/* Pagination stays on regular background */}
      <nav className="w-[min(1600px,92%)] mx-auto" aria-label="Pagination">
        <ResultsPagination
          page={filters.currentPage}
          totalPages={filters.totalPages}
          canPrev={filters.canPrev && !busy}
          canNext={filters.canNext && !busy}
          onPrev={filters.handlePrevPage}
          onNext={filters.handleNextPage}
          onPage={filters.handleGoToPage}
          isJumping={busy}
        />
      </nav>
    </main>
  );
};
