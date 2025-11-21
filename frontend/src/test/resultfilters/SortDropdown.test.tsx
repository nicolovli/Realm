import { render, cleanup } from "@testing-library/react";
import { vi, type MockedFunction } from "vitest";
import { SortDropdown } from "@/components/ResultFilters";
import { sortOptions } from "@/test/fixtures/sortOptions";

vi.mock("../../components/ResultFilters", () => ({
  __esModule: true,
  SortDropdown: vi.fn(() => null),
}));

const mockSortDropdown = SortDropdown as MockedFunction<typeof SortDropdown>;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

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
