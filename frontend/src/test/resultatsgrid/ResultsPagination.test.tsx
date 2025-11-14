import { render, screen, cleanup } from "@testing-library/react";
import { ResultsPagination } from "@/components/ResultsGrid";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("ResultsPagination (always-input)", () => {
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
    expect(screen.getByRole("button", { name: /prev/i })).toBeDisabled();
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
    expect(screen.getByRole("button", { name: /next/i })).not.toBeDisabled();
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

  it("renders an always-visible input; readOnly when onPage is not provided", () => {
    const { rerender } = render(
      <ResultsPagination
        page={3}
        totalPages={10}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />,
    );

    const input = screen.getByLabelText(/page number/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("readonly"); // no onPage => readOnly
    expect(screen.getByText(/\/ 10/i)).toBeInTheDocument();

    // with onPage -> editable (no readonly)
    rerender(
      <ResultsPagination
        page={3}
        totalPages={10}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onPage={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/page number/i)).not.toHaveAttribute(
      "readonly",
    );
  });

  it("typing a number and pressing Enter calls onPage with that page", async () => {
    const onPage = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultsPagination
        page={1}
        totalPages={5}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onPage={onPage}
      />,
    );

    const input = screen.getByLabelText(/page number/i);
    await user.clear(input);
    await user.type(input, "4{Enter}");
    expect(onPage).toHaveBeenCalledWith(4);
  });

  it("Escape or blur cancels edit and does not call onPage", async () => {
    const onPage = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultsPagination
        page={2}
        totalPages={5}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onPage={onPage}
      />,
    );

    const input = screen.getByLabelText(/page number/i);

    // Esc cancels and resets value to current page
    await user.clear(input);
    await user.type(input, "5{Escape}");
    expect(onPage).not.toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe("2");

    // Blur cancels
    await user.clear(input);
    await user.type(input, "3");
    await user.click(screen.getByRole("button", { name: /next/i })); // blur
    expect(onPage).not.toHaveBeenCalled();
    expect(
      (screen.getByLabelText(/page number/i) as HTMLInputElement).value,
    ).toBe("2");
  });

  it("clamps out-of-range values on submit", async () => {
    const onPage = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultsPagination
        page={1}
        totalPages={5}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onPage={onPage}
      />,
    );

    const input = screen.getByLabelText(/page number/i);
    await user.clear(input);
    await user.type(input, "999{Enter}");
    expect(onPage).toHaveBeenCalledWith(5);
  });
});
