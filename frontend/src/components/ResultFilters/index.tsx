import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterPill } from "./FilterPill";
import { FilterChips } from "./FilterChips";
import { MatchCount } from "./MatchCount";
import { SortDropdown } from "./SortDropdown";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { useResultFilters } from "../../hooks/useResultFilters";
import {
  BUTTON_BASE,
  FOCUS_VISIBLE,
  PILL_TRIGGER_BASE,
} from "../../lib/classNames";
import type { FilterKey, FilterGroup } from "../../types/FilterTypes";

type ResultFiltersProps = {
  searchQuery?: string;
};

export const ResultFilters = ({
  searchQuery,
  filtersWithAvailability,
  isLoading,
  selectedFilters,
  sortOption,
  setSortOption,
  availableGroups,
  matchesCount,
  activeFilterEntries,
  hasActiveFilters,
  handleOptionToggle,
  handleRemoveSelection,
  handleClearAll,
  filtersReady,
  filterError,
  countError,
}: ResultFiltersProps & ReturnType<typeof useResultFilters>) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // const {
  //   filtersWithAvailability,
  //   isLoading,
  //   selectedFilters,
  //   sortOption,
  //   setSortOption,
  //   availableGroups,
  //   matchesCount,
  //   activeFilterEntries,
  //   hasActiveFilters,
  //   handleOptionToggle,
  //   handleRemoveSelection,
  //   handleClearAll,
  //   filtersReady,
  //   filterError,
  //   countError,
  // } = useResultFilters(searchQuery);

  const handleClearSearch = () => {
    navigate("/games");
  };

  return (
    <header className="flex flex-col gap-4 md:gap-6">
      {/* Filter error message */}
      {filterError && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{filterError}</p>
        </div>
      )}

      {/* Mobile filter drawer trigger */}
      <section className="flex md:hidden w-full mb-2" aria-label="Open filters">
        <button
          className={`${PILL_TRIGGER_BASE} ${FOCUS_VISIBLE} bg-lightpurple dark:bg-darkpurple font-semibold w-30 justify-center`}
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open filters"
        >
          Filters
        </button>
      </section>

      {/* Filter pills (desktop) */}
      <nav
        className="hidden md:flex w-full gap-2 flex-wrap"
        aria-label="Filter dropdowns"
      >
        {availableGroups.map(({ key, label }) => (
          <FilterPill
            key={key}
            label={label}
            options={filtersWithAvailability[key] || []}
            selectedValues={selectedFilters[key] || []}
            isLoading={isLoading}
            filtersReady={filtersReady}
            onToggle={(option) => handleOptionToggle(key as FilterKey, option)}
          />
        ))}
      </nav>

      {/* Active filter chips and search indicator */}
      <nav className="space-y-3">
        {/* Search indicator with clear option */}
        {searchQuery && (
          <nav className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Search: "{searchQuery}"
            </span>
            <button
              onClick={handleClearSearch}
              className={`${FOCUS_VISIBLE} ${BUTTON_BASE} !bg-gray`}
            >
              Clear Search
            </button>
          </nav>
        )}

        <FilterChips
          activeFilters={activeFilterEntries}
          hasActiveFilters={hasActiveFilters}
          onRemove={(group, option) =>
            handleRemoveSelection(group as FilterKey, option)
          }
          onClearAll={handleClearAll}
        />
      </nav>

      {/* Sort dropdown and match count */}
      <section
        className="flex items-center justify-between w-full"
        aria-label="Sort and match count"
      >
        <MatchCount matchesCount={matchesCount} countError={countError} />
        <SortDropdown
          sortOption={sortOption}
          setSortOption={setSortOption}
          sortOptions={[
            { value: "popularity", label: "Popularity" },
            { value: "release-date", label: "Release date" },
            { value: "alphabetical", label: "Alphabetical" },
            { value: "rating", label: "Rating" },
          ]}
        />
      </section>

      {/* Mobile filter drawer overlay */}
      <MobileFilterDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        availableGroups={availableGroups as FilterGroup[]}
        filters={filtersWithAvailability}
        selectedFilters={selectedFilters}
        isLoading={isLoading}
        filtersReady={filtersReady}
        handleOptionToggle={(group, option) =>
          handleOptionToggle(group as FilterKey, option)
        }
      />
    </header>
  );
};

export default ResultFilters;
