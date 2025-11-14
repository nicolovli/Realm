import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { FeaturedCard } from "@/components/FeaturedSection";
import { BrowserRouter } from "react-router-dom";
import type { FeaturedGame } from "@/types";

// Typed factory so we don't fight TS on required fields
const makeGame = (overrides: Partial<FeaturedGame> = {}): FeaturedGame => ({
  id: "1",
  image: "https://example.com/img.jpg",
  name: "Super Fun Game",
  ...overrides,
});

describe("FeaturedCard", () => {
  const game = makeGame();

  afterEach(() => {
    cleanup();
  });

  it("renders name and image alt", () => {
    render(
      <BrowserRouter>
        <FeaturedCard game={game} />
      </BrowserRouter>,
    );
    expect(screen.getByText("Super Fun Game")).toBeInTheDocument();
    expect(screen.getByAltText("Super Fun Game")).toBeInTheDocument();
  });

  it("links to the correct game page", () => {
    render(
      <BrowserRouter>
        <FeaturedCard game={game} />
      </BrowserRouter>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/games/1");
  });
});
