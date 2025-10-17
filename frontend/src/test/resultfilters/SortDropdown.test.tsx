import { render, cleanup } from "@testing-library/react";
import { vi, type MockedFunction } from "vitest";

vi.mock("../../components/ResultFilters/SortDropdown", () => ({
  __esModule: true,
  SortDropdown: vi.fn(() => null),
}));

import { SortDropdown } from "../../components/ResultFilters/SortDropdown";

const mockSortDropdown = SortDropdown as MockedFunction<typeof SortDropdown>;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const sortOptions = [
  { value: "popularity" as const, label: "Popularity" },
  { value: "alphabetical" as const, label: "Alphabetical" },
  { value: "release-date" as const, label: "Release date" },
  { value: "rating" as const, label: "Rating" },
];

describe("SortDropdown", () => {
  it("renders with correct props", () => {
    const props = {
      sortOption: "popularity" as const,
      setSortOption: vi.fn(),
      sortOptions,
      // NOTE: no buttonClass prop in the real component
    };

    render(<SortDropdown {...props} />);

    expect(mockSortDropdown).toHaveBeenCalledWith(props, undefined);
  });

  it("is called with setSortOption callback", () => {
    const setSortOption = vi.fn();
    const props = {
      sortOption: "alphabetical" as const,
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
