import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { FilterPill } from "@/components/ResultFilters";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

describe("FilterPill", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders label and options correctly", async () => {
    const user = userEvent.setup();

    render(
      <FilterPill
        label="Genre"
        options={[
          { name: "Action", disabled: false },
          { name: "Adventure", disabled: false },
        ]}
        selectedValues={[]}
        onToggle={() => {}}
      />,
    );

    const trigger = screen.getByLabelText(/Filter by Genre/i);
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Adventure")).toBeInTheDocument();
  });

  it("calls onToggle when an option is clicked", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(
      <FilterPill
        label="Genre"
        options={[{ name: "Action", disabled: false }]}
        selectedValues={[]}
        onToggle={handleToggle}
      />,
    );

    const trigger = screen.getByLabelText(/Filter by Genre/i);
    await user.click(trigger);

    const option = screen.getByText("Action");
    await user.click(option);

    expect(handleToggle).toHaveBeenCalledWith("Action");
  });

  // large dataset test
  it("renders correctly with a large number of options", async () => {
    const user = userEvent.setup();
    const options = Array.from({ length: 50 }, (_, i) => ({
      name: `Option${i}`,
      disabled: false,
    }));

    render(
      <FilterPill
        label="Many Options"
        options={options}
        selectedValues={[]}
        onToggle={() => {}}
      />,
    );

    const trigger = screen.getByLabelText(/Filter by Many Options/i);
    await user.click(trigger);

    const renderedOptions = screen.getAllByRole("menuitemcheckbox");
    expect(renderedOptions.length).toBe(51);
  });

  // disabled state test
  it("disables all options when disabled=true", async () => {
    render(
      <FilterPill
        label="Genre"
        options={[{ name: "Action", disabled: false }]}
        selectedValues={[]}
        onToggle={() => {}}
        disabled
      />,
    );

    const trigger = screen.getByLabelText(/Filter by Genre/i);
    expect(trigger).toBeDisabled();
  });

  // accessibility test
  it("has no accessibility violations", async () => {
    const { container } = render(
      <FilterPill
        label="Genre"
        options={[
          { name: "Action", disabled: false },
          { name: "Adventure", disabled: false },
        ]}
        selectedValues={[]}
        onToggle={() => {}}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
