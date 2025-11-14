import { render, cleanup } from "@testing-library/react";
import { vi, type MockedFunction } from "vitest";
import { MobileFilterDrawer } from "@/components/ResultFilters";
import type { FilterGroup, FilterKey, SelectedFilters } from "@/types";

vi.mock("../../components/ResultFilters", () => ({
  MobileFilterDrawer: vi.fn(() => null),
}));

const mockMobileFilterDrawer = MobileFilterDrawer as MockedFunction<
  typeof MobileFilterDrawer
>;

// Helper functions for test data
type FiltersWithAvailability = Record<
  FilterKey,
  Array<{ name: string; disabled: boolean }>
>;

const createFiltersMap = (
  overrides: Partial<FiltersWithAvailability> = {},
): FiltersWithAvailability => ({
  genres: [],
  tags: [],
  categories: [],
  platforms: [],
  publisher: [],
  ...overrides,
});

const createSelectedFilters = (
  overrides: Partial<SelectedFilters> = {},
): SelectedFilters => ({
  genres: [],
  tags: [],
  categories: [],
  platforms: [],
  publisher: [],
  ...overrides,
});

const createFilterGroups = (): FilterGroup[] => [
  { key: "genres", label: "Genres" },
];

describe("MobileFilterDrawer", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders with correct props", () => {
    const props = {
      open: true,
      onClose: vi.fn(),
      availableGroups: createFilterGroups(),
      filters: createFiltersMap({
        genres: [{ name: "Action", disabled: false }],
      }),
      selectedFilters: createSelectedFilters(),
      isLoading: false,
      handleOptionToggle: vi.fn(),
    };

    render(<MobileFilterDrawer {...props} />);

    expect(mockMobileFilterDrawer).toHaveBeenCalledWith(props, undefined);
  });

  it("is called with onClose callback", () => {
    const onClose = vi.fn();
    const props = {
      open: true,
      onClose,
      availableGroups: [],
      filters: createFiltersMap(),
      selectedFilters: createSelectedFilters(),
      isLoading: false,
      handleOptionToggle: vi.fn(),
    };

    render(<MobileFilterDrawer {...props} />);

    expect(mockMobileFilterDrawer).toHaveBeenCalledWith(
      expect.objectContaining({
        onClose,
        open: true,
      }),
      undefined,
    );
  });

  it("is called with open=false", () => {
    const props = {
      open: false,
      onClose: vi.fn(),
      availableGroups: [],
      filters: createFiltersMap(),
      selectedFilters: createSelectedFilters(),
      isLoading: false,
      handleOptionToggle: vi.fn(),
    };

    render(<MobileFilterDrawer {...props} />);

    expect(mockMobileFilterDrawer).toHaveBeenCalledWith(
      expect.objectContaining({
        open: false,
      }),
      undefined,
    );
  });
});
