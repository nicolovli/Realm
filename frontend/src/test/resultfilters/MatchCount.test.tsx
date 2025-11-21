import { render, screen, cleanup } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { MatchCount } from "@/components/ResultFilters";

expect.extend(toHaveNoViolations);

describe("MatchCount", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the count correctly when positive", () => {
    render(<MatchCount matchesCount={5} />);
    expect(screen.getByText("5 matches")).toBeInTheDocument();
  });

  it("renders the no matches message when count is zero", () => {
    render(<MatchCount matchesCount={0} />);
    expect(
      screen.getByText("No matches found. Adjust filters or clear selections."),
    ).toBeInTheDocument();
  });

  it("renders large numbers correctly with formatting", () => {
    render(<MatchCount matchesCount={1000} />);
    expect(screen.getByText("1,000 matches")).toBeInTheDocument();
  });

  it("renders negative numbers correctly", () => {
    render(<MatchCount matchesCount={-3} />);
    expect(screen.getByText("-3 matches")).toBeInTheDocument();
  });

  it("updates dynamically when prop changes", () => {
    const { rerender } = render(<MatchCount matchesCount={2} />);
    expect(screen.getByText("2 matches")).toBeInTheDocument();

    rerender(<MatchCount matchesCount={7} />);
    expect(screen.getByText("7 matches")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<MatchCount matchesCount={5} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
