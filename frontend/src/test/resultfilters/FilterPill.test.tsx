import { render, cleanup } from "@testing-library/react";
import { vi, type MockedFunction } from "vitest";
import { FilterPill } from "@/components/ResultFilters";

vi.mock("../../components/ResultFilters/FilterPill", () => ({
  FilterPill: vi.fn(() => null),
}));

const mockFilterPill = FilterPill as MockedFunction<typeof FilterPill>;

describe("FilterPill", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders with correct props", () => {
    const props = {
      label: "Genre",
      options: [
        { name: "Action", disabled: false },
        { name: "Adventure", disabled: false },
      ],
      selectedValues: [],
      isLoading: false,
      filtersReady: true,
      onToggle: vi.fn(),
      disabled: false,
    };

    render(<FilterPill {...props} />);

    expect(mockFilterPill).toHaveBeenCalledWith(props, undefined);
  });

  it("is called with onToggle callback", () => {
    const onToggle = vi.fn();
    const props = {
      label: "Genre",
      options: [{ name: "Action", disabled: false }],
      selectedValues: [],
      isLoading: false,
      filtersReady: true,
      onToggle,
      disabled: false,
    };

    render(<FilterPill {...props} />);

    expect(mockFilterPill).toHaveBeenCalledWith(
      expect.objectContaining({
        onToggle,
        label: props.label,
      }),
      undefined,
    );
  });
});
