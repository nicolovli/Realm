import { useEffect } from "react";
import { FilterPill } from "./FilterPill";
import { FOCUS_VISIBLE, HOVER, PILL_TRIGGER_BASE } from "../../lib/classNames";
import type {
  FilterKey,
  FilterGroup,
  SelectedFilters,
} from "../../types/FilterTypes";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  availableGroups: FilterGroup[];
  filters: Record<FilterKey, Array<{ name: string; disabled: boolean }>>;
  selectedFilters: SelectedFilters;
  isLoading: boolean;
  filtersReady?: boolean;
  handleOptionToggle: (group: FilterKey, option: string) => void;
}

export const MobileFilterDrawer = ({
  open,
  onClose,
  availableGroups,
  filters,
  selectedFilters,
  isLoading,
  filtersReady = true,
  handleOptionToggle,
}: MobileFilterDrawerProps) => {
  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (open) {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = "0";
      document.body.style.left = "0";
    } else {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      document.body.style.left = "";
    }
  }, [open]);

  if (!open) return null;

  return (
    <section
      id="mobile-filter-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Filter menu"
      className="md:hidden fixed inset-0 z-100 flex justify-center items-start bg-black/30 px-4"
    >
      <article className="relative top-1/2 -translate-y-1/2 w-full rounded-2xl bg-lightpurple dark:bg-darkpurple text-black dark:text-white shadow-2xl flex flex-col md:max-w-md">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className={`${FOCUS_VISIBLE} absolute right-4 top-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-black/10 p-1 dark:text-white dark:bg-darkpurple cursor-pointer `}
          aria-label="Close filters"
        >
          <span className="text-[25px]">×</span>
        </button>

        {/* Filter groups */}
        <section className="flex flex-col gap-4 px-5 pb-6 pt-8">
          {availableGroups.map(({ key, label }) => {
            const options = filters[key] || [];
            const selectedValues = selectedFilters[key] || [];

            return (
              <section
                key={key}
                aria-label={`${label} filter`}
                className="flex flex-col gap-2"
              >
                <h2 className="text-[15px] font-bold text-black dark:text-white flex items-center gap-2">
                  {label}
                </h2>

                <FilterPill
                  label={
                    selectedValues.length === 0
                      ? "All"
                      : selectedValues.join(", ")
                  }
                  options={options}
                  selectedValues={selectedValues}
                  isLoading={isLoading}
                  filtersReady={filtersReady}
                  onToggle={(option) => handleOptionToggle(key, option)}
                />
              </section>
            );
          })}

          {/* Apply filters button */}
          <footer className="bottom-0 -mx-5 mt-1 px-5 pb-3 pt-2 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              className={`${PILL_TRIGGER_BASE} ${FOCUS_VISIBLE} ${HOVER} w-full items-center`}
            >
              Apply filters
            </button>
          </footer>
        </section>
      </article>
    </section>
  );
};
