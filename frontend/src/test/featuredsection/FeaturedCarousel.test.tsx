import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  render as rtlRender,
  screen,
  cleanup,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeaturedCarousel } from "@/components/FeaturedSection";
import { BrowserRouter } from "react-router-dom";
import type { ReactElement } from "react";
import type { FeaturedGame } from "@/types";

// Mock FeaturedCard to keep tests focused (match the named export path)
vi.mock("@/components/FeaturedSection/FeaturedCard", () => ({
  __esModule: true,
  FeaturedCard: ({ game }: { game: FeaturedGame }) => (
    <div data-testid="card">{game.name}</div>
  ),
}));

// Typed factory for FeaturedGame
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

  const originalMatchMedia = window.matchMedia;

  const mockMatchMedia = (map: Record<string, boolean>) => {
    // Provide a minimal matchMedia mock that supports .matches and add/removeEventListener
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: !!map[query],
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  };

  beforeEach(() => {
    mockMatchMedia({
      "(any-hover: hover)": true,
      "(pointer: coarse)": false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    Object.defineProperty(window, "matchMedia", { value: originalMatchMedia });
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

    const link = btn.closest("a");
    expect(link).toHaveAttribute("href", "/games");
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

  it("caps rendering to at most 10 items", () => {
    const many: FeaturedGame[] = Array.from({ length: 25 }, (_, i) =>
      makeGame(i + 1),
    );
    renderWithRouter(<FeaturedCarousel items={many} title="Featured" />);
    const cards = screen.getAllByTestId("card");
    expect(cards.length).toBe(10);
  });

  it("exposes accessible region and pagination landmarks", () => {
    renderWithRouter(<FeaturedCarousel items={items} title="My Picks" />);

    const region = screen.getByLabelText("My Picks");
    expect(region).toHaveAttribute("aria-live", "polite");

    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav).toBeInTheDocument();
  });

  it("allows keyboard activation of dots (Enter)", async () => {
    renderWithRouter(<FeaturedCarousel items={items} title="Featured games" />);
    const dot3 = screen.getByRole("button", { name: "Go to slide 3 of 5" });
    dot3.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(dot3).toHaveAttribute("aria-current", "true"));
  });

  it("shows swipe hint on coarse pointers and hides after interaction", async () => {
    mockMatchMedia({
      "(any-hover: hover)": false,
      "(pointer: coarse)": true,
    });

    renderWithRouter(<FeaturedCarousel items={items} title="Featured games" />);

    expect(screen.getByText("Swipe →")).toBeInTheDocument();

    const hint = screen.getByText("Swipe →");
    await userEvent.pointer({ target: hint, keys: "[MouseLeft]" });

    await waitFor(() =>
      expect(screen.queryByText("Swipe →")).not.toBeInTheDocument(),
    );
  });

  it("hides arrows when hover is not supported", () => {
    mockMatchMedia({
      "(any-hover: hover)": false,
      "(pointer: coarse)": true,
    });
    renderWithRouter(<FeaturedCarousel items={items} title="Featured games" />);
    const next = screen.getByRole("button", { name: "Next slide" });
    // Not visible when any-hover is false (class includes hidden)
    expect(next.className).toMatch(/hidden/);
  });
});
