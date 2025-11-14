import { ResultFilters } from "@/components/ResultFilters";
import { ResultsGrid, ResultsPagination } from "@/components/ResultsGrid";
import { useResultFilters } from "@/hooks/resultFilters";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || undefined;

  const filters = useResultFilters(searchQuery);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
      <section
        className="w-[min(1600px,92%)] mx-auto"
        aria-label="Result filters"
      >
        <ResultFilters {...filters} searchQuery={searchQuery} />
      </section>

      <section className="w-[min(1600px,92%)] mx-auto" aria-label="Game list">
        <ResultsGrid
          games={gamesForGrid}
          loading={showLoadingSkeletons}
          error={filters.gamesError}
          emptyState="No games match the current filters."
        />
      </section>

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
