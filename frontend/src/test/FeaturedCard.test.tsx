import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeaturedCard } from "../components/featured-section/index";
import type { PreviewGame } from "../types/PreviewGame";

// Typed factory so we don't fight TS on required fields
const makeGame = (overrides: Partial<PreviewGame> = {}): PreviewGame => ({
  sid: 1,
  published_store: "steam",
  image: "https://example.com/img.jpg",
  name: "Super Fun Game",
  description: "desc",
  full_price: 0,
  platforms: "PC",
  developers: "Dev",
  publisher: "Pub",
  languages: "en",
  categori: "Action",
  genre: "Action",
  tags: "tag1,tag2",
  ...overrides,
});

describe("FeaturedCard", () => {
  const game = makeGame();

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders name and image alt", () => {
    render(<FeaturedCard game={game} />);
    expect(screen.getByText("Super Fun Game")).toBeInTheDocument();
    expect(screen.getByAltText("Super Fun Game")).toBeInTheDocument();
  });

  it("logs on click (dummy handler)", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<FeaturedCard game={game} />);

    const card = screen.getByRole("button", { name: "Super Fun Game" });
    await userEvent.click(card);

    expect(spy).toHaveBeenCalled();
  });

  it("fires click via keyboard (Enter)", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<FeaturedCard game={game} />);

    const card = screen.getByRole("button", { name: "Super Fun Game" });
    card.focus();
    await userEvent.keyboard("{Enter}");

    expect(spy).toHaveBeenCalled();
  });
});
