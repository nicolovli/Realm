import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { FeaturedCard } from "@/components/FeaturedSection";
import { BrowserRouter } from "react-router-dom";
import type { FeaturedGame } from "@/types";
import userEvent from "@testing-library/user-event";
import { act } from "react";

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
    expect(screen.getByAltText("Picture of game: Super Fun Game")).toBeInTheDocument();
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

  it("shows a skeleton before image load and hides it after load", async () => {
    render(
      <BrowserRouter>
        <FeaturedCard game={game} />
      </BrowserRouter>,
    );

    expect(screen.getByAltText("Next game")).toBeInTheDocument();

    const img = screen.getByAltText("Picture of game: Super Fun Game");
    await act(async () => {
      img.dispatchEvent(new Event("load"));
    });
    await waitFor(() =>
      expect(screen.queryByAltText("Next game")).not.toBeInTheDocument(),
    );
  });

  it("renders fallback when no image is provided", () => {
    const noImgGame = makeGame({ image: undefined });
    render(
      <BrowserRouter>
        <FeaturedCard game={noImgGame} />
      </BrowserRouter>,
    );
    expect(screen.getByText("Image unavailable")).toBeInTheDocument();
    // No content image should be present
    expect(
      screen.queryByRole("img", { name: noImgGame.name }),
    ).not.toBeInTheDocument();
  });

  it("renders fallback when image fails to load", async () => {
    render(
      <BrowserRouter>
        <FeaturedCard game={game} />
      </BrowserRouter>,
    );

    const img = screen.getByAltText("Picture of game: Super Fun Game");
    await act(async () => {
      img.dispatchEvent(new Event("error"));
    });
    await waitFor(() =>
      expect(screen.getByText("Image unavailable")).toBeInTheDocument(),
    );
  });

  it("is focusable via keyboard tab (accessibility)", async () => {
    render(
      <BrowserRouter>
        <FeaturedCard game={game} />
      </BrowserRouter>,
    );

    await userEvent.tab();
    const link = screen.getByRole("link", { name: game.name });
    expect(link).toHaveFocus();
  });
});
