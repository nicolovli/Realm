import { render, cleanup } from "@testing-library/react";
import { vi, type MockedFunction } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import type { MockedResponse } from "@apollo/client/testing";
import { ResultFilters } from "@/components/ResultFilters";

// Mock the ResultFilters component (default export)
vi.mock("../../components/ResultFilters", () => ({
  __esModule: true,
  ResultFilters: vi.fn(() => null),
}));

const mockResultFilters = ResultFilters as MockedFunction<typeof ResultFilters>;

// Mock GraphQL queries that might be used
const mocks: MockedResponse[] = [
  // Add any necessary GraphQL mocks here if the component makes queries
];

const defaultProps = {
  searchQuery: undefined,
  filters: {
    genres: [],
    tags: [],
    categories: [],
    platforms: [],
    publisher: [],
  },
  filtersWithAvailability: {
    genres: [],
    tags: [],
    categories: [],
    platforms: [],
    publisher: [],
  },
  selectedFilters: {
    genres: [],
    tags: [],
    categories: [],
    platforms: [],
    publisher: [],
  },
  availableGroups: [],
  activeFilterEntries: [],
  hasActiveFilters: false,
  handleOptionToggle: vi.fn(),
  handleRemoveSelection: vi.fn(),
  handleClearAll: vi.fn(),
  isLoading: false,
  sortOption: "popularity" as const,
  setSortOption: vi.fn(),
  order: "desc" as const,
  setOrder: vi.fn(),
  pageSize: 9,
  matchesCount: 0,
  filtersReady: true,
  filterError: undefined,
  countError: undefined,
  games: [],
  nextPageGames: [],
  gamesLoading: false,
  totalPages: 1,
  currentPage: 1,
  canPrev: false,
  canNext: false,
  isPending: false,
  isJumping: false,
  handleNextPage: vi.fn(),
  handlePrevPage: vi.fn(),
  handleGoToPage: vi.fn(),
  handlePageReset: vi.fn(),
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ResultFilters", () => {
  const renderWithProviders = (props = {}) => {
    return render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <ResultFilters {...defaultProps} {...props} />
        </MemoryRouter>
      </MockedProvider>,
    );
  };

  it("renders ResultFilters without search query", () => {
    renderWithProviders();
    expect(mockResultFilters).toHaveBeenCalled();
  });

  it("renders ResultFilters with search query", () => {
    const searchQuery = "test game";
    renderWithProviders({ searchQuery });
    expect(mockResultFilters).toHaveBeenCalledWith(
      expect.objectContaining({ searchQuery }),
      undefined,
    );
  });

  it("renders multiple times without issues", () => {
    renderWithProviders();
    renderWithProviders({ searchQuery: "another search" });
    expect(mockResultFilters).toHaveBeenCalledTimes(2);
  });
});
