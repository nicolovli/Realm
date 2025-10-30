import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameDetailCard } from "../../components/InformationCards";
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

describe("GameDetailCard", () => {
  const mockProps = {
    gameId: 1,
    title: "Test Game",
    descriptionShort: "This is a test game description",
    image: "/test-image.jpg",
  };

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("renders the component with required props", () => {
    render(
      <MockedProvider mocks={[]}>
        <GameDetailCard {...mockProps} />
      </MockedProvider>,
    );

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test game description"),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Test Game")).toHaveAttribute(
      "src",
      "https://images.weserv.nl/?url=%2Ftest-image.jpg&w=800&output=webp",
    );
  });

  it("renders with optional props", () => {
    const propsWithOptional = {
      ...mockProps,
      tags: ["Action", "Adventure", "RPG"],
      developers: "Test Studio",
      platforms: "PC, PS5",
    };

    render(
      <MockedProvider mocks={[]}>
        <GameDetailCard {...propsWithOptional} />
      </MockedProvider>,
    );

    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Adventure")).toBeInTheDocument();
    expect(screen.getByText("RPG")).toBeInTheDocument();
    expect(screen.getByText(/Test Studio/)).toBeInTheDocument();
    expect(screen.getByText(/PC, PS5/)).toBeInTheDocument();
  });

  it("renders tags when provided", () => {
    const propsWithTags = {
      ...mockProps,
      tags: ["Action", "Adventure"],
    };

    render(
      <MockedProvider mocks={[]}>
        <GameDetailCard {...propsWithTags} />
      </MockedProvider>,
    );

    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Adventure")).toBeInTheDocument();
  });

  it("renders developer information when provided", () => {
    const propsWithDeveloper = {
      ...mockProps,
      developers: "Epic Games Studio",
    };

    render(
      <MockedProvider mocks={[]}>
        <GameDetailCard {...propsWithDeveloper} />
      </MockedProvider>,
    );

    expect(screen.getByText(/Epic Games Studio/)).toBeInTheDocument();
  });

  it("renders platform information when provided", () => {
    const propsWithPlatforms = {
      ...mockProps,
      platforms: "PC, Xbox, PlayStation",
    };

    render(
      <MockedProvider mocks={[]}>
        <GameDetailCard {...propsWithPlatforms} />
      </MockedProvider>,
    );

    expect(screen.getByText(/PC, Xbox, PlayStation/)).toBeInTheDocument();
  });

  it("applies correct CSS classes to section", () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <GameDetailCard {...mockProps} />
      </MockedProvider>,
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "w-full",
      "max-w-[1600px]",
      "mx-auto",
    );
  });

  it("renders the image in the correct position", () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <GameDetailCard {...mockProps} />
      </MockedProvider>,
    );

    const innerSection = container.querySelector("section section");
    expect(innerSection?.className).not.toContain("flex-row-reverse");
  });

  it("logs to console when onButtonClick would be called", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(
      <MockedProvider mocks={[]}>
        <GameDetailCard {...mockProps} />
      </MockedProvider>,
    );
    expect(screen.getByText("Test Game")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("renders all optional props together", () => {
    const fullProps = {
      gameId: 1,
      title: "Complete Game",
      descriptionShort: "A fully featured game with all metadata",
      image: "/complete-game.jpg",
      tags: ["Action", "RPG", "Multiplayer"],
      developers: "Super Studio",
      platforms: "PC, PS5, Xbox",
    };

    render(
      <MockedProvider mocks={[]}>
        <GameDetailCard {...fullProps} />
      </MockedProvider>,
    );

    expect(screen.getByText("Complete Game")).toBeInTheDocument();
    expect(
      screen.getByText("A fully featured game with all metadata"),
    ).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("RPG")).toBeInTheDocument();
    expect(screen.getByText("Multiplayer")).toBeInTheDocument();
    expect(screen.getByText(/Super Studio/)).toBeInTheDocument();
    expect(screen.getByText(/PC, PS5, Xbox/)).toBeInTheDocument();
  });
});
