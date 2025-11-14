import { FOCUS_VISIBLE, HOVER } from "@/lib/classNames";

interface FilterChipsProps {
  activeFilters: Array<{ key: string; value: string; label: string }>;
  hasActiveFilters: boolean;
  onRemove: (group: string, value: string) => void;
  onClearAll: () => void;
}

export const FilterChips = ({
  activeFilters,
  hasActiveFilters,
  onRemove,
  onClearAll,
}: FilterChipsProps) => {
  // Don't render if no active filters
  if (!hasActiveFilters) return null;

  return (
    <section className="flex gap-2 w-full" aria-label="Active filters">
      {/* Clear all filters button */}
      <button
        type="button"
        onClick={onClearAll}
        className={`${FOCUS_VISIBLE} ${HOVER} self-start text-sm tracking-wide text-gray-600 dark:text-white/80 cursor-pointer px-3 py-1.5 rounded-full bg-gray-200 dark:bg-white/40 shadow-sm whitespace-nowrap flex-shrink-0 min-w-[8rem]`}
      >
        Clear all filters
      </button>

      {/* Active filter chips list */}
      <ul className={`flex flex-nowrap gap-2 overflow-x-auto pb-1 list-none `}>
        {activeFilters.map(({ key, value, label }) => (
          <li key={`${key}-${value}`}>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray dark:bg-white/70 px-3 py-1 text-sm text-black shadow-sm flex-shrink-0">
              <span className="font-medium whitespace-nowrap">{value}</span>
              <button
                type="button"
                onClick={() => onRemove(key, value)}
                aria-label={`Remove ${value} from ${label}`}
                className={`${FOCUS_VISIBLE} ${HOVER} flex items-center justify-center w-6 h-6 rounded cursor-pointer flex-shrink-0 `}
              >
                <span className="flex items-center justify-center w-3 h-3 leading-none text-lg">
                  ✕
                </span>
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
