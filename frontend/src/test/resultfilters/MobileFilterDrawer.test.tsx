import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MobileFilterDrawer } from "@/components/ResultFilters";
import type { FilterGroup, FilterKey, SelectedFilters } from "@/types";
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

// mock FilterPill component so we can focus on drawer behavior
vi.mock("@/components/ResultFilters/FilterPill", () => ({
  FilterPill: vi.fn(() => <div data-testid="filter-pill" />),
}));

// Helper functions for test data
const createFiltersMap = (
  overrides: Partial<
    Record<FilterKey, Array<{ name: string; disabled: boolean }>>
  > = {},
) => ({
  genres: [],
  tags: [],
  categories: [],
  platforms: [],
  publisher: [],
  ...overrides,
});

const createSelectedFilters = (overrides: Partial<SelectedFilters> = {}) => ({
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
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    document.body.style.left = "";
  });

  it("renders drawer open with filter groups", () => {
    render(
      <MobileFilterDrawer
        open={true}
        onClose={vi.fn()}
        availableGroups={createFilterGroups()}
        filters={createFiltersMap({
          genres: [{ name: "Action", disabled: false }],
        })}
        selectedFilters={createSelectedFilters()}
        isLoading={false}
        handleOptionToggle={vi.fn()}
      />,
    );

    expect(screen.getByText("Genres")).toBeInTheDocument();
    expect(screen.getByTestId("filter-pill")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <MobileFilterDrawer
        open={true}
        onClose={onClose}
        availableGroups={createFilterGroups()}
        filters={createFiltersMap()}
        selectedFilters={createSelectedFilters()}
        isLoading={false}
        handleOptionToggle={vi.fn()}
      />,
    );

    const closeButton = screen.getByLabelText("Close filters");
    await userEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it("renders loading state", () => {
    render(
      <MobileFilterDrawer
        open={true}
        onClose={vi.fn()}
        availableGroups={createFilterGroups()}
        filters={createFiltersMap()}
        selectedFilters={createSelectedFilters()}
        isLoading={true}
        handleOptionToggle={vi.fn()}
      />,
    );

    expect(screen.getByTestId("filter-pill")).toBeInTheDocument();
  });

  // accessibility test
  it("has no accessibility violations", async () => {
    const { container } = render(
      <MobileFilterDrawer
        open={true}
        onClose={vi.fn()}
        availableGroups={createFilterGroups()}
        filters={createFiltersMap({
          genres: [{ name: "Action", disabled: false }],
        })}
        selectedFilters={createSelectedFilters()}
        isLoading={false}
        handleOptionToggle={vi.fn()}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
