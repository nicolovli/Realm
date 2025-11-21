import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { FilterChips } from "@/components/ResultFilters";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

describe("FilterChips", () => {
  // rendering tests
  it("renders nothing when no active filters exist", () => {
    const { container } = render(
      <FilterChips
        activeFilters={[]}
        hasActiveFilters={false}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders active filters when hasActiveFilters is true", () => {
    render(
      <FilterChips
        activeFilters={[{ key: "genre", value: "Action", label: "Genres" }]}
        hasActiveFilters={true}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );

    expect(screen.getByLabelText("Active filters")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  // interaction tests
  it("calls onRemove when clicking a remove chip button", async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    render(
      <FilterChips
        activeFilters={[{ key: "genre", value: "Action", label: "Genres" }]}
        hasActiveFilters={true}
        onRemove={handleRemove}
        onClearAll={() => {}}
      />,
    );

    const removeBtn = screen.getByRole("button", {
      name: /remove action from genres/i,
    });

    await user.click(removeBtn);

    expect(handleRemove).toHaveBeenCalledWith("genre", "Action");
  });

  it("calls onClearAll when clicking the clear-all button", async () => {
    const user = userEvent.setup();
    const handleClearAll = vi.fn();

    render(
      <FilterChips
        activeFilters={[
          { key: "genre", value: "Action", label: "Genres" },
          { key: "platform", value: "PC", label: "Platforms" },
        ]}
        hasActiveFilters={true}
        onRemove={() => {}}
        onClearAll={handleClearAll}
      />,
    );

    const clearAllBtn = screen.getByRole("button", {
      name: /clear all filters/i,
    });
    await user.click(clearAllBtn);

    expect(handleClearAll).toHaveBeenCalledTimes(1);
  });

  it("renders a list of chips for each active filter", () => {
    const filters = [
      { key: "genre", value: "Action", label: "Genres" },
      { key: "platform", value: "PC", label: "Platforms" },
    ];

    render(
      <FilterChips
        activeFilters={filters}
        hasActiveFilters={true}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );

    const chips = screen.getAllByRole("button", { name: /remove/i });
    expect(chips.length).toBe(2);
  });

  // large dataset test
  it("renders correctly with a very large number of filters", () => {
    const filters = Array.from({ length: 50 }, (_, i) => ({
      key: `key${i}`,
      value: `Value${i}`,
      label: `Label${i}`,
    }));

    render(
      <FilterChips
        activeFilters={filters}
        hasActiveFilters={true}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );

    const chips = screen.getAllByRole("button", { name: /remove/i });
    expect(chips.length).toBe(50);
  });

  // accessibility test
  it("is keyboard accessible", async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    const handleClearAll = vi.fn();

    render(
      <FilterChips
        activeFilters={[{ key: "genre", value: "Action", label: "Genres" }]}
        hasActiveFilters={true}
        onRemove={handleRemove}
        onClearAll={handleClearAll}
      />,
    );

    await user.tab();
    expect(
      screen.getByRole("button", { name: /clear all filters/i }),
    ).toHaveFocus();

    await user.tab();
    const removeBtn = screen.getByRole("button", {
      name: /remove action from genres/i,
    });
    expect(removeBtn).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(handleRemove).toHaveBeenCalledWith("genre", "Action");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <FilterChips
        activeFilters={[{ key: "genre", value: "Action", label: "Genres" }]}
        hasActiveFilters={true}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders correctly with an empty activeFilters array but hasActiveFilters=true", () => {
    const { container } = render(
      <FilterChips
        activeFilters={[]}
        hasActiveFilters={true}
        onRemove={() => {}}
        onClearAll={() => {}}
      />,
    );

    expect(screen.getByLabelText("Active filters")).toBeInTheDocument();
    expect(container.querySelectorAll("li").length).toBe(0);
  });
});
