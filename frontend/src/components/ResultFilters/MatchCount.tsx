// Renders the match count and status message

// Props for the MatchCount component
interface MatchCountProps {
  matchesCount: number;
  countError?: string | null;
}

// Displays the number of matches, or a message if there are none
export const MatchCount = ({ matchesCount, countError }: MatchCountProps) => {
  return (
    <p
      role="status"
      aria-live="polite"
      className={`text-sm font-semibold ${
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
          : `${matchesCount.toLocaleString()} matches`}
    </p>
  );
};
