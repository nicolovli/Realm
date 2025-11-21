import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameCardBase } from "@/components/InformationCards";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";
import { MemoryRouter } from "react-router-dom";

// Mock auth status hook and components
vi.mock("@/hooks/useAuthStatus", () => ({
  useAuthStatus: vi.fn(() => ({
    isLoggedIn: false,
    setIsLoggedIn: vi.fn(),
  })),
}));

vi.mock("../../components/HeartIcon", () => ({
  HeartIcon: ({
    onRequireLogin,
  }: {
    gameId: number;
    onRequireLogin: () => void;
  }) => (
    <button onClick={onRequireLogin} aria-label="Favorite game">
      Heart Icon
    </button>
  ),
}));

vi.mock("../../components/User", () => ({
  AuthDialog: ({ open }: { open: boolean }) =>
    open ? <div data-testid="auth-dialog">Auth Dialog</div> : null,
}));

describe("GameCardBase", () => {
  const defaultProps = {
    gameId: 1,
    title: "Test Game",
    descriptionShort: "This is a short description.",
    descriptionFull: "This is a short description.",
    image: "test-image.jpg",
    tags: ["Action", "Adventure", "Puzzle", "RPG", "Horror", "Strategy"],
    developers: "Test Studio",
    platforms: "PC, PS5",
    buttonText: "Learn More",
    rating: 4,
  };

  beforeEach(() => {
    // Mock window width for tag slicing logic
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock window.addEventListener
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  it("renders title, description, and image", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(
      screen.getByText("This is a short description."),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Test Game")).toHaveAttribute(
      "src",
      "https://images.weserv.nl/?url=test-image.jpg&w=800&output=webp&q=70",
    );
  });

  it("renders developer and platform info", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(screen.getByText(/Developer:/i)).toBeInTheDocument();
    expect(screen.getByText(/Platforms:/i)).toBeInTheDocument();
  });

  it("shows only 5 tags initially (desktop width)", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>,
    );
    const visibleTags = screen.getAllByText(
      /Action|Adventure|Puzzle|RPG|Horror/,
    );
    expect(visibleTags).toHaveLength(5);
  });

  it("toggles tag visibility when expand/collapse button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>,
    );

    const toggleButton = screen.getByRole("button", {
      name: /Show more tags/i,
    });
    expect(toggleButton).toBeInTheDocument();

    // Expand tags
    await user.click(toggleButton);
    const expandedTags = screen.getAllByText(
      /Action|Adventure|Puzzle|RPG|Horror|Strategy/,
    );
    expect(expandedTags).toHaveLength(6);

    // Collapse tags
    const collapseButton = screen.getByRole("button", {
      name: /Show fewer tags/i,
    });
    await user.click(collapseButton);
    const collapsedTags = screen.getAllByText(
      /Action|Adventure|Puzzle|RPG|Horror/,
    );
    expect(collapsedTags).toHaveLength(5);
  });

  it("calls onButtonClick when the button is clicked", async () => {
    const user = userEvent.setup();
    const mockClick = vi.fn();

    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} onButtonClick={mockClick} />
        </MemoryRouter>
      </MockedProvider>,
    );
    const button = screen.getByRole("button", { name: /Learn More/i });

    await user.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it("applies reversed layout when imagePosition='left'", () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} imagePosition="left" />
        </MemoryRouter>
      </MockedProvider>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveClass("md:flex-row-reverse");
  });

  it("opens auth dialog when heart icon is clicked while not logged in", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>,
    );

    const heartButton = screen.getByLabelText("Favorite game");
    expect(screen.queryByTestId("auth-dialog")).not.toBeInTheDocument();

    await user.click(heartButton);
    expect(screen.getByTestId("auth-dialog")).toBeInTheDocument();
  });

  it("does not render tags section or toggle when tags are empty", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase
            {...defaultProps}
            tags={[]}
            descriptionShort="A teaser description https://example.com"
          />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(
      screen.queryByRole("button", { name: /Show more tags|Show fewer tags/i }),
    ).not.toBeInTheDocument();
  });

  it("shows 3 tags on mobile and toggles correctly", async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>,
    );

    const initialVisible = screen.getAllByText(/Action|Adventure|Puzzle/);
    expect(initialVisible).toHaveLength(3);

    const expandBtn = screen.getByRole("button", { name: /Show more tags/i });
    await user.click(expandBtn);
    const expanded = screen.getAllByText(
      /Action|Adventure|Puzzle|RPG|Horror|Strategy/,
    );
    expect(expanded).toHaveLength(6);
  });

  it("hides favorite action when used as promo card", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} isPromoCard />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.queryByLabelText("Favorite game")).not.toBeInTheDocument();
  });

  it("shows published label when publishedStore is provided", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} publishedStore={"2025-11-01"} />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(screen.getByText(/Released/i)).toBeInTheDocument();
  });

  it("does not render numeric rating text when rating is 0", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase {...defaultProps} rating={0} />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(screen.queryByText(/0\.0/)).not.toBeInTheDocument();
  });

  it("strips trailing links from description", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase
            {...defaultProps}
            descriptionShort="A teaser description https://example.com"
          />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(
      screen.getByText("A teaser description", { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/https?:\/\/example\.com/i),
    ).not.toBeInTheDocument();
  });

  it("expands description when clicking Read more", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <GameCardBase
            {...defaultProps}
            descriptionFull="This is a short description. Extra context that should appear when expanded."
          />
        </MemoryRouter>
      </MockedProvider>,
    );

    const toggleButton = screen.getByRole("button", { name: /View more/i });
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);
    expect(
      screen.getByText(/Extra context that should appear when expanded./i),
    ).toBeInTheDocument();

    const collapseButton = screen.getByRole("button", { name: /View less/i });
    await user.click(collapseButton);
    expect(
      screen.queryByText(/Extra context that should appear when expanded./i),
    ).not.toBeInTheDocument();
  });
});
