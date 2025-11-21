import { useState } from "react";
import {
  FilterPill,
  FilterChips,
  MatchCount,
  SortDropdown,
  MobileFilterDrawer,
} from "@/components/ResultFilters";
import { useResultFilters } from "@/hooks/resultFilters";
import { FOCUS_VISIBLE, PILL_TRIGGER_BASE } from "@/lib/classNames";
import type { FilterKey, FilterGroup } from "@/types";

type ResultFiltersProps = {
  searchQuery?: string;
};

export const ResultFilters = ({
  filtersWithAvailability,
  isLoading,
  selectedFilters,
  sortOption,
  setSortOption,
  order,
  setOrder,
  availableGroups,
  matchesCount,
  activeFilterEntries,
  hasActiveFilters,
  handleOptionToggle,
  handleRemoveSelection,
  handleClearAll,
  handlePageReset,
  filtersReady,
  filterError,
  countError,
  countLoading,
}: ResultFiltersProps & ReturnType<typeof useResultFilters>) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const sortFields = [
    {
      key: "alphabetical",
      labels: { asc: "Title: A → Z", desc: "Title: Z → A" },
      preferredOrder: ["asc", "desc"] as const,
    },
    {
      key: "release-date",
      labels: {
        asc: "Oldest first",
        desc: "Newest first",
      },
      preferredOrder: ["desc", "asc"] as const,
    },
    {
      key: "popularity",
      labels: {
        asc: "Least popular",
        desc: "Most popular",
      },
      preferredOrder: ["desc", "asc"] as const,
    },
    {
      key: "rating",
      labels: { asc: "Lowest rating", desc: "Highest rating" },
      preferredOrder: ["desc", "asc"] as const,
    },
  ] as const;

  type Direction = "asc" | "desc";

  const sortItems = sortFields.flatMap((field) =>
    field.preferredOrder.map((dir) => {
      const sortValue = field.key as
        | "alphabetical"
        | "release-date"
        | "popularity"
        | "rating";
      const order = dir as Direction;
      return {
        value: `${field.key}:${order}`,
        label: field.labels[order],
        sortValue,
        order,
        onSelect: () => {
          setSortOption(sortValue);
          setOrder(order);
          handlePageReset();
        },
      };
    }),
  );

  return (
    <header className="flex flex-col gap-4 md:gap-0">
      {/* Filter error message */}
      {filterError && (
        <section className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{filterError}</p>
        </section>
      )}

      {/* Mobile filter drawer trigger */}
      <section
        className="flex mdlg:hidden w-full mb-2"
        aria-label="Open filters"
      >
        <button
          className={`${PILL_TRIGGER_BASE} ${FOCUS_VISIBLE} bg-lightpurple dark:bg-darkpurple w-25 justify-center`}
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open filters"
        >
          Filters
        </button>
        <section className="flex items-center gap-2 ml-auto ">
          <SortDropdown
            sortOption={sortOption}
            order={order}
            setSortOption={setSortOption}
            sortOptions={sortItems}
          />
        </section>
      </section>

      {/* Filter pills (desktop) */}
      <nav
        className=" hidden mdlg:flex w-full gap-2 pb-4"
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

        <section className="flex items-center gap-2 ml-auto">
          <SortDropdown
            sortOption={sortOption}
            order={order}
            setSortOption={setSortOption}
            sortOptions={sortItems}
          />
        </section>
      </nav>

      <FilterChips
        activeFilters={activeFilterEntries}
        hasActiveFilters={hasActiveFilters}
        onRemove={(group, option) =>
          handleRemoveSelection(group as FilterKey, option)
        }
        onClearAll={handleClearAll}
      />

      {/* Sort dropdown, order toggle and match count */}
      <section
        className="flex items-center justify-between w-full"
        aria-label="Sort and match count"
      >
        <MatchCount
          matchesCount={matchesCount}
          countError={countError}
          countLoading={countLoading}
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
