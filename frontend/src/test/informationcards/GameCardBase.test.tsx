import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameCardBase } from "../../components/InformationCards/GameCardBase";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";

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
        <GameCardBase {...defaultProps} />
      </MockedProvider>,
    );

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(
      screen.getByText("This is a short description."),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Test Game")).toHaveAttribute(
      "src",
      "https://images.weserv.nl/?url=test-image.jpg&w=800&output=webp",
    );
  });

  it("renders developer and platform info", () => {
    render(
      <MockedProvider mocks={[]}>
        <GameCardBase {...defaultProps} />
      </MockedProvider>,
    );
    expect(screen.getByText(/Developer:/i)).toBeInTheDocument();
    expect(screen.getByText(/Platforms:/i)).toBeInTheDocument();
  });

  it("shows only 5 tags initially (desktop width)", () => {
    render(
      <MockedProvider mocks={[]}>
        <GameCardBase {...defaultProps} />
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
        <GameCardBase {...defaultProps} />
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
        <GameCardBase {...defaultProps} onButtonClick={mockClick} />
      </MockedProvider>,
    );
    const button = screen.getByRole("button", { name: /Learn More/i });

    await user.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it("applies reversed layout when imagePosition='left'", () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <GameCardBase {...defaultProps} imagePosition="left" />
      </MockedProvider>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveClass("md:flex-row-reverse");
  });

  it("opens auth dialog when heart icon is clicked while not logged in", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]}>
        <GameCardBase {...defaultProps} />
      </MockedProvider>,
    );

    const heartButton = screen.getByLabelText("Favorite game");
    expect(screen.queryByTestId("auth-dialog")).not.toBeInTheDocument();

    await user.click(heartButton);
    expect(screen.getByTestId("auth-dialog")).toBeInTheDocument();
  });
});
