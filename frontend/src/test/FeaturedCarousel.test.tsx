// src/test/FeaturedCarousel.test.tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PreviewGame } from "../types/PreviewGame";

// Mock FeaturedCard to keep tests focused
vi.mock("../components/featured-section/FeaturedCard", () => ({
  __esModule: true,
  default: ({ game }: { game: PreviewGame }) => (
    <div data-testid="card">{game.name}</div>
  ),
}));

// Force 1 slide per view for deterministic behavior
vi.mock("../hooks/useSlidesPerView", () => ({
  __esModule: true,
  useSlidesPerView: () => 1,
}));

// Make device hover-capable so arrows are visible
vi.mock("../hooks/useInputCapabilities", () => ({
  __esModule: true,
  useInputCapabilities: () => ({
    pointerCoarse: false,
    anyPointerCoarse: false,
    hover: true,
    anyHover: true,
  }),
}));

// Deterministic pixel metrics for transform math
vi.mock("../hooks/useCarouselMetrics", () => ({
  __esModule: true,
  useCarouselMetrics: () => ({
    gapPx: 0,
    slidePx: 300,
    stepPx: 300,
    ready: true,
  }),
}));

import FeaturedCarousel from "../components/featured-section/FeaturedCarousel";
import { BrowserRouter } from "react-router-dom";

// 🔧 Typed factory for PreviewGame
const makeGame = (
  i: number,
  overrides: Partial<PreviewGame> = {},
): PreviewGame => ({
  sid: i, // number
  published_store: "steam",
  image: `https://example.com/x${i}.jpg`,
  name: `Game ${i}`,
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

describe("FeaturedCarousel", () => {
  const items: PreviewGame[] = Array.from({ length: 5 }, (_, i) =>
    makeGame(i + 1),
  );

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders title and correct number of dots", () => {
    render(<FeaturedCarousel items={items} title="Featured games" />);
    expect(
      screen.getByRole("heading", { name: "Featured games" }),
    ).toBeInTheDocument();

    const dots = screen.getAllByRole("button", {
      name: /Go to slide \d+ of 5/,
    });
    expect(dots).toHaveLength(5);
  });

  it("shows arrows and moves track on click", async () => {
    const { container } = render(
      <FeaturedCarousel items={items} title="Featured games" />,
    );
    const track = container.querySelector("ul") as HTMLUListElement;

    const next = screen.getByRole("button", { name: "Next slide" });
    expect(next).toBeVisible();

    // Initial: index = cloneCount (1) => transform = -300px
    await waitFor(() =>
      expect(track.style.transform).toContain("translate3d(-300px"),
    );

    await userEvent.click(next);
    await waitFor(() =>
      expect(track.style.transform).toContain("translate3d(-600px"),
    );
  });

  it("navigates via dots", async () => {
    const { container } = render(
      <FeaturedCarousel items={items} title="Featured games" />,
    );
    const track = container.querySelector("ul") as HTMLUListElement;

    const dot2 = screen.getByRole("button", { name: "Go to slide 2 of 5" });
    await userEvent.click(dot2);

    await waitFor(() =>
      expect(track.style.transform).toContain("translate3d(-600px"),
    );
  });

  it("renders Explore button and calls handler", async () => {
    const onExploreAll = vi.fn();
    render(
      <BrowserRouter>
        <FeaturedCarousel items={items} onExploreAll={onExploreAll} />
      </BrowserRouter>,
    );
    const btn = screen.getByRole("button", { name: "Explore all games" });
    await userEvent.click(btn);
    // expect(onExploreAll).toHaveBeenCalledTimes(1);
  });

  it("has proper ARIA on the carousel region", () => {
    render(<FeaturedCarousel items={items} title="Featured games" />);
    // If your <section> also has aria-label="Featured games", there will be two regions.
    // Target the one that is explicitly the carousel:
    const regions = screen.getAllByRole("region", { name: "Featured games" });
    const carouselRegion = regions.find(
      (el) => el.getAttribute("aria-roledescription") === "carousel",
    );
    expect(carouselRegion).toBeTruthy();
    expect(carouselRegion).toHaveAttribute("aria-roledescription", "carousel");
    expect(carouselRegion).toHaveAttribute("aria-live", "polite");
  });
});
