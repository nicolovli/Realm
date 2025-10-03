import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../../../backend/db/previewDB.json", () => ({
  default: [
    { name: "X1", description: "", image: "x1.png" }, // game number 1 and 2 are skipped since we are using game 3-5 in the promosection
    { name: "X2", description: "", image: "x2.png" }, // todo: change when server side db is implemented
    { name: "Game A", description: "First game", image: "a.png" },
    { name: "Game B", description: "Second game", image: "b.png" },
    { name: "Game C", description: "Third game", image: "c.png" },
  ],
}));

import { PromoSection } from "../components/PromoSection";

describe("PromoSection tests", () => {
  beforeEach(() => {
    render(<PromoSection />);
  });

  it("renders the first game by default", () => {
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Game A",
    );
  });

  it("goes to the next and previous slides with buttons", async () => {
    const user = userEvent.setup();
    const nextBtn = screen.getByLabelText("Next slide");
    const prevBtn = screen.getByLabelText("Previous slide");

    await user.click(nextBtn);
    expect(await screen.findByRole("heading", { level: 2 })).toHaveTextContent(
      "Game B",
    );

    await user.click(nextBtn);
    expect(await screen.findByRole("heading", { level: 2 })).toHaveTextContent(
      "Game C",
    );

    await user.click(prevBtn);
    expect(await screen.findByRole("heading", { level: 2 })).toHaveTextContent(
      "Game B",
    );
  });
});
