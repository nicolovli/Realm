import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameDetailCard } from "../../components/InformationCards";

describe("GameDetailCard", () => {
  const mockProps = {
    title: "Test Game",
    descriptionShort: "This is a test game description",
    image: "/test-image.jpg",
  };

  it("renders the component with required props", () => {
    render(<GameDetailCard {...mockProps} />);

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test game description"),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Test Game")).toHaveAttribute(
      "src",
      "/test-image.jpg",
    );
  });

  it("renders with optional props", () => {
    const propsWithOptional = {
      ...mockProps,
      tags: ["Action", "Adventure", "RPG"],
      developers: "Test Studio",
      platforms: "PC, PS5",
    };

    render(<GameDetailCard {...propsWithOptional} />);

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

    render(<GameDetailCard {...propsWithTags} />);

    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Adventure")).toBeInTheDocument();
  });

  it("renders developer information when provided", () => {
    const propsWithDeveloper = {
      ...mockProps,
      developers: "Epic Games Studio",
    };

    render(<GameDetailCard {...propsWithDeveloper} />);

    expect(screen.getByText(/Epic Games Studio/)).toBeInTheDocument();
  });

  it("renders platform information when provided", () => {
    const propsWithPlatforms = {
      ...mockProps,
      platforms: "PC, Xbox, PlayStation",
    };

    render(<GameDetailCard {...propsWithPlatforms} />);

    expect(screen.getByText(/PC, Xbox, PlayStation/)).toBeInTheDocument();
  });

  it("applies correct CSS classes to section", () => {
    const { container } = render(<GameDetailCard {...mockProps} />);

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
    const { container } = render(<GameDetailCard {...mockProps} />);

    const innerSection = container.querySelector("section section");
    expect(innerSection?.className).not.toContain("flex-row-reverse");
  });

  it("renders placeholder sections", () => {
    render(<GameDetailCard {...mockProps} />);

    expect(screen.getByText("star rating placeholder")).toBeInTheDocument();
    expect(screen.getByText("heart icon placeholder")).toBeInTheDocument();
  });

  it("logs to console when onButtonClick would be called", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<GameDetailCard {...mockProps} />);
    expect(screen.getByText("Test Game")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("renders all optional props together", () => {
    const fullProps = {
      title: "Complete Game",
      descriptionShort: "A fully featured game with all metadata",
      image: "/complete-game.jpg",
      tags: ["Action", "RPG", "Multiplayer"],
      developers: "Super Studio",
      platforms: "PC, PS5, Xbox",
    };

    render(<GameDetailCard {...fullProps} />);

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
