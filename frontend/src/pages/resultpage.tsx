import ResultFilters from "@/components/ResultFilters";
import ResultsGrid from "@/components/ResultsGrid/ResultsGrid";
import ResultsPagination from "@/components/ResultsGrid/ResultsPagination";
import { useResultFilters } from "@/hooks/useResultFilters";
import { useSearchParams } from "react-router-dom";

export const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || undefined;

  const filters = useResultFilters(searchQuery);

  return (
    <main>
      <section className="w-[min(1600px,92%)] mx-auto">
        {/* Pass the same hook data to both components */}
        <ResultFilters {...filters} searchQuery={searchQuery} />
      </section>

      <section className="w-[min(1600px,92%)] mx-auto" aria-label="Game list">
        <ResultsGrid
          games={filters.games}
          loading={filters.gamesLoading}
          emptyState="No games match the current filters."
        />
      </section>

      <nav className="w-[min(1600px,92%)] mx-auto" aria-label="Pagination">
        <ResultsPagination
          page={filters.currentPage}
          totalPages={filters.totalPages}
          canNext={filters.currentPage < filters.totalPages}
          onPrev={filters.handlePrevPage}
          onNext={filters.handleNextPage}
        />
      </nav>
    </main>
  );
};
