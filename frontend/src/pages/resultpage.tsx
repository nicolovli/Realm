import { ResultFilters } from "@/components/ResultFilters";
import { ResultsGrid } from "@/components/ResultsGrid/ResultsGrid";
import { ResultsPagination } from "@/components/ResultsGrid/ResultsPagination";
import { useResultFilters } from "@/hooks/useResultFilters";
import { useSearchParams } from "react-router-dom";

export const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || undefined;

  const filters = useResultFilters(searchQuery);

  const busy =
    filters.gamesLoading ||
    filters.isLoading ||
    filters.isJumping ||
    filters.isPending;

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
          games={filters.games}
          loading={busy && filters.games.length === 0}
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
