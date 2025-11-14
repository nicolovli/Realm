import type { FilterKey, SelectedFilters, GameFilter, Game } from "@/types";
import type { SortOptionValue } from "@/constants/resultFiltersConstants";

// Cursor cache entry for pagination
export type CursorEntry = {
  end?: string | null;
  hasNext?: boolean;
};

// Cursor cache payload for session storage
export type CursorCachePayload = {
  updatedAt: number;
  currentPage?: number;
  cursors: Array<[number, CursorEntry]>;
};

// useCursorCache hook return type
export type CursorCache = {
  cursorByPage: React.MutableRefObject<Map<number, CursorEntry>>;
  persist: (options?: { currentPage?: number }) => void;
  clear: (options?: { resetPage?: number }) => void;
};

// useResultFiltersState hook return type
// Manages URL, React state, and transition status for result filters UI
export type UseResultFiltersStateReturn = {
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  sortOption: SortOptionValue;
  setSortOption: React.Dispatch<React.SetStateAction<SortOptionValue>>;
  order: "asc" | "desc";
  setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
};

// useResultFiltersData hook arguments
export type UseResultFiltersDataArgs = {
  selectedFilters: SelectedFilters;
  searchQuery?: string;
};

// useResultFiltersData hook return type
// Provides filter metadata and derived availability for current selection context
export type UseResultFiltersDataReturn = {
  currentFilter: GameFilter | null;
  filters: Record<FilterKey, string[]>;
  filtersWithAvailability: Record<
    FilterKey,
    Array<{ name: string; disabled: boolean }>
  >;
  availableGroups: ReadonlyArray<{
    key: FilterKey;
    label: string;
  }>;
  activeFilterEntries: Array<{
    key: FilterKey;
    label: string;
    value: string;
  }>;
  hasActiveFilters: boolean;
  matchesCountFromCountQuery?: number;
  loadingFilters: boolean;
  loadingCount: boolean;
  filtersReady: boolean;
};

// useResultFiltersPagination hook arguments

export type UseResultFiltersPaginationArgs = {
  currentFilter: GameFilter | null;
  sortOption: SortOptionValue;
  order: "asc" | "desc";
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  startTransition: React.TransitionStartFunction;
  searchQuery?: string;
  selectedFilters: SelectedFilters;
  matchesCountFromCountQuery?: number;
};

// useResultFiltersPagination hook return type
// Orchestrates paginated game retrieval with cache, queries, and jump handlers

export type UseResultFiltersPaginationReturn = {
  games: Game[];
  gamesLoading: boolean;
  gamesError?: string;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  matchesCount: number;
  isJumping: boolean;
  loadingPage: number | null;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleGoToPage: (page: number) => Promise<void> | void;
  handlePageReset: () => void;
};
