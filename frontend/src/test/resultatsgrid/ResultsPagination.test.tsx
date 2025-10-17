import { render, screen, cleanup } from "@testing-library/react";
import ResultsPagination from "../../components/ResultsGrid/ResultsPagination";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("ResultsPagination", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("disables Prev on first page by default", () => {
    render(
      <ResultsPagination
        page={1}
        totalPages={5}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />,
    );
    const prev = screen.getByRole("button", { name: /prev/i });
    expect(prev).toBeDisabled();
  });

  it("enables Next when page < totalPages (default logic)", () => {
    render(
      <ResultsPagination
        page={2}
        totalPages={5}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />,
    );
    const next = screen.getByRole("button", { name: /next/i });
    expect(next).not.toBeDisabled();
  });

  it("respects canNext/canPrev overrides", () => {
    render(
      <ResultsPagination
        page={2}
        totalPages={5}
        canPrev={false}
        canNext={false}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /prev/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("calls onNext/onPrev only when enabled", async () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <ResultsPagination
        page={2}
        totalPages={5}
        onPrev={onPrev}
        onNext={onNext}
      />,
    );

    await user.click(screen.getByRole("button", { name: /prev/i }));
    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);

    // Now disable both and verify no more calls
    rerender(
      <ResultsPagination
        page={2}
        totalPages={5}
        canPrev={false}
        canNext={false}
        onPrev={onPrev}
        onNext={onNext}
      />,
    );

    await user.click(screen.getByRole("button", { name: /prev/i }));
    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("renders page indicator", () => {
    render(
      <ResultsPagination
        page={3}
        totalPages={10}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />,
    );
    expect(screen.getByText(/Page 3 \/ 10/i)).toBeInTheDocument();
  });

  it("renders jump-to select when onPage is provided and totalPages > 1", async () => {
    const onPage = vi.fn();
    const user = userEvent.setup();
    render(
      <ResultsPagination
        page={1}
        totalPages={3}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onPage={onPage}
      />,
    );

    const select = screen.getByLabelText(/jump to/i);
    expect(select).toBeInTheDocument();

    await user.selectOptions(select, "2");
    expect(onPage).toHaveBeenCalledWith(2);
  });
});
