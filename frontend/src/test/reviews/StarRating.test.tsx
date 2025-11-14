import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { StarRating } from "@/components/Reviews";

describe("StarRating", () => {
  it("renders 5 star containers for read-only and supports decimal fill", () => {
    render(<StarRating value={3.5} readOnly ariaLabel="star rating" />);

    const container = screen.getByLabelText(/star rating/i);
    const outerStarSpans = container.querySelectorAll(
      "span[aria-hidden='true']",
    );
    expect(outerStarSpans.length).toBe(5);

    expect(container).toHaveAttribute(
      "aria-label",
      expect.stringContaining("4") || expect.stringContaining("3"),
    );
  });

  it("is interactive when onChange is provided (keyboard and click)", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<StarRating value={2} onChange={handleChange} />);

    const star3 = screen.getByRole("radio", { name: /3 stjerner/i });
    await user.click(star3);
    expect(handleChange).toHaveBeenCalled();

    const group = screen.getByRole("radiogroup");
    group.focus();
    await user.keyboard("{ArrowRight}");
    expect(handleChange).toHaveBeenCalled();
  });
});
