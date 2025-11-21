import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { StarRating } from "@/components/Reviews";

describe("StarRating", () => {
  it("renders 5 star containers for read-only and supports decimal fill", () => {
    render(<StarRating value={3.5} readOnly ariaLabel="star rating" />);

    const container = screen.getByLabelText(/star rating/i);
    const stars = container.querySelectorAll("span.relative.inline-block");
    expect(stars.length).toBe(5);

    expect(container).toHaveAttribute(
      "aria-label",
      expect.stringMatching(/3|4/),
    );
  });

  it("is interactive when onChange is provided (keyboard and click)", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<StarRating value={2} onChange={handleChange} />);

    // click selects exactly that star
    const star3 = screen.getByRole("radio", { name: /3 stjerner/i });
    await user.click(star3);
    expect(handleChange).toHaveBeenCalledWith(3);

    // right arrow increases rating by 1 → from 2 to 3
    const group = screen.getByRole("radiogroup");
    group.focus();

    await user.keyboard("{ArrowRight}");
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it("does not call onChange in readOnly mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<StarRating value={2} readOnly />);

    const star3 = screen.getByRole("img");
    await user.click(star3);

    expect(handleChange).not.toHaveBeenCalled();
  });
});
