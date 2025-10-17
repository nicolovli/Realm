import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render as rtlRender,
  screen,
  cleanup,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeaturedCarousel from "../../components/FeaturedSection/FeaturedCarousel";
import { BrowserRouter } from "react-router-dom";
import type { ReactElement } from "react";
import type { FeaturedGame } from "@/types/GameTypes";

// Mock FeaturedCard to keep tests focused
vi.mock("../../components/featured-section/FeaturedCard", () => ({
  __esModule: true,
  default: ({ game }: { game: FeaturedGame }) => (
    <div data-testid="card">{game.name}</div>
  ),
}));

// 🔧 Typed factory for FeaturedGame
const makeGame = (
  i: number,
  overrides: Partial<FeaturedGame> = {},
): FeaturedGame => ({
  id: `${i}`,
  image: `https://example.com/x${i}.jpg`,
  name: `Game ${i}`,
  ...overrides,
});

const renderWithRouter = (ui: ReactElement) =>
  rtlRender(<BrowserRouter>{ui}</BrowserRouter>);

describe("FeaturedCarousel (shadcn/Embla)", () => {
  const items: FeaturedGame[] = Array.from({ length: 5 }, (_, i) =>
    makeGame(i + 1),
  );

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders title and correct number of dots", () => {
    renderWithRouter(<FeaturedCarousel items={items} title="Featured games" />);
    expect(
      screen.getByRole("heading", { name: "Featured games" }),
    ).toBeInTheDocument();

    const dots = screen.getAllByRole("button", {
      name: /Go to slide \d+ of 5/,
    });
    expect(dots).toHaveLength(5);
  });

  it("shows arrows on hover-capable devices and advances selection on click", async () => {
    renderWithRouter(<FeaturedCarousel items={items} title="Featured games" />);

    const next = screen.getByRole("button", { name: "Next slide" });
    expect(next).toBeVisible();

    const dot1 = screen.getByRole("button", { name: "Go to slide 1 of 5" });
    await waitFor(() => expect(dot1).toHaveAttribute("aria-current", "true"));

    await userEvent.click(next);
    const dot2 = screen.getByRole("button", { name: "Go to slide 2 of 5" });
    await waitFor(() => expect(dot2).toHaveAttribute("aria-current", "true"));
  });

  it("navigates via dots", async () => {
    renderWithRouter(<FeaturedCarousel items={items} title="Featured games" />);

    const dot3 = screen.getByRole("button", { name: "Go to slide 3 of 5" });
    await userEvent.click(dot3);

    await waitFor(() => expect(dot3).toHaveAttribute("aria-current", "true"));
  });

  it("renders Explore button and calls handler", async () => {
    const onExploreAll = vi.fn();
    renderWithRouter(
      <FeaturedCarousel items={items} onExploreAll={onExploreAll} />,
    );
    const btn = screen.getByRole("button", { name: "Explore all games" });
    await userEvent.click(btn);
    expect(onExploreAll).toHaveBeenCalledTimes(1);
  });

  it("has proper ARIA on the carousel region", () => {
    renderWithRouter(<FeaturedCarousel items={items} title="Featured games" />);
    const regions = screen.getAllByRole("region", { name: "Featured games" });
    const carouselRegion = regions.find(
      (el) => el.getAttribute("aria-roledescription") === "carousel",
    );
    expect(carouselRegion).toBeTruthy();
    expect(carouselRegion).toHaveAttribute("aria-roledescription", "carousel");
    expect(carouselRegion).toHaveAttribute("aria-live", "polite");
  });

  it("handles an empty list of items gracefully", () => {
    renderWithRouter(<FeaturedCarousel items={[]} title="Featured games" />);
    expect(
      screen.getByRole("heading", { name: "Featured games" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("card")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Go to slide/ }),
    ).not.toBeInTheDocument();
  });
});
