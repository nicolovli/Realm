import { render, cleanup } from "@testing-library/react";
import { vi, type MockedFunction } from "vitest";
import { SortDropdown } from "../../components/ResultFilters";

vi.mock("../../components/ResultFilters", () => ({
  __esModule: true,
  SortDropdown: vi.fn(() => null),
}));

const mockSortDropdown = SortDropdown as MockedFunction<typeof SortDropdown>;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const sortOptions = [
  {
    value: "popularity" as const,
    label: "Popularity",
    sortValue: "popularity" as const,
    order: "desc" as const,
    onSelect: () => {},
  },
  {
    value: "alphabetical" as const,
    label: "Alphabetical",
    sortValue: "alphabetical" as const,
    order: "asc" as const,
    onSelect: () => {},
  },
  {
    value: "release-date" as const,
    label: "Release date",
    sortValue: "release-date" as const,
    order: "desc" as const,
    onSelect: () => {},
  },
  {
    value: "rating" as const,
    label: "Rating",
    sortValue: "rating" as const,
    order: "desc" as const,
    onSelect: () => {},
  },
];

describe("SortDropdown", () => {
  it("renders with correct props", () => {
    const props = {
      sortOption: "popularity" as const,
      order: "desc" as const,
      setSortOption: vi.fn(),
      sortOptions,
    };

    render(<SortDropdown {...props} />);

    expect(mockSortDropdown).toHaveBeenCalledWith(props, undefined);
  });

  it("is called with setSortOption callback", () => {
    const setSortOption = vi.fn();
    const props = {
      sortOption: "alphabetical" as const,
      order: "asc" as const,
      setSortOption,
      sortOptions,
    };

    render(<SortDropdown {...props} />);

    expect(mockSortDropdown).toHaveBeenCalledWith(
      expect.objectContaining({
        setSortOption,
        sortOption: "alphabetical",
      }),
      undefined,
    );
  });
});
