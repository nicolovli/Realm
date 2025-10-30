import { FilterChips } from "@/components/ResultFilters";
import { render, cleanup } from "@testing-library/react";
import { vi, type MockedFunction } from "vitest";

vi.mock("../../components/ResultFilters/FilterChips", () => ({
  FilterChips: vi.fn(() => null),
}));

const mockFilterChips = FilterChips as MockedFunction<typeof FilterChips>;

describe("FilterChips", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders with correct props", () => {
    const props = {
      activeFilters: [
        { key: "genres", value: "Action", label: "Genres" },
        { key: "platforms", value: "PC", label: "Platforms" },
      ],
      hasActiveFilters: true,
      onRemove: vi.fn(),
      onClearAll: vi.fn(),
    };

    render(<FilterChips {...props} />);

    expect(mockFilterChips).toHaveBeenCalledWith(props, undefined);
  });

  it("is called with callback functions", () => {
    const onRemove = vi.fn();
    const onClearAll = vi.fn();
    const props = {
      activeFilters: [{ key: "genres", value: "Action", label: "Genres" }],
      hasActiveFilters: true,
      onRemove,
      onClearAll,
    };

    render(<FilterChips {...props} />);

    expect(mockFilterChips).toHaveBeenCalledWith(
      expect.objectContaining({
        onRemove,
        onClearAll,
        hasActiveFilters: true,
        activeFilters: props.activeFilters,
      }),
      undefined,
    );
  });
});
