export interface MatchCountProps {
  matchesCount: number;
  countError?: string | null;
  countLoading?: boolean;
  isSearch?: boolean;
}

export const MatchCount = ({
  matchesCount,
  countError,
  countLoading,
}: MatchCountProps) => {
  if (countLoading) {
    return (
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-sm font-semibold pt-2 text-gray-400"
      >
        Loading…
      </p>
    );
  }

  return (
    <p
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-cy="results-count"
      className={`text-sm font-semibold pt-2 ${
        countError
          ? "text-red-600 dark:text-red-400"
          : "text-black dark:text-white"
      }`}
    >
      {/* Show error message, or no matches message, or count */}
      {countError
        ? countError
        : matchesCount === 0
          ? "No matches found. Adjust filters or clear selections."
          : `${matchesCount.toLocaleString("en-US")} matches`}
    </p>
  );
};
