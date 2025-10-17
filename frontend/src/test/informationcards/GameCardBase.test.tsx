import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameCardBase from "../../components/InformationCards/GameCardBase";
import { vi } from "vitest";

describe("GameCardBase", () => {
  const defaultProps = {
    title: "Test Game",
    descriptionShort: "This is a short description.",
    image: "test-image.jpg",
    tags: ["Action", "Adventure", "Puzzle", "RPG", "Horror", "Strategy"],
    developers: "Test Studio",
    platforms: "PC, PS5",
    buttonText: "Learn More",
  };

  beforeEach(() => {
    // Mock window width for tag slicing logic
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
  });

  it("renders title, description, and image", () => {
    render(<GameCardBase {...defaultProps} />);

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(
      screen.getByText("This is a short description."),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Test Game")).toHaveAttribute(
      "src",
      "test-image.jpg",
    );
  });

  it("renders developer and platform info", () => {
    render(<GameCardBase {...defaultProps} />);
    expect(screen.getByText(/Developer:/i)).toBeInTheDocument();
    expect(screen.getByText(/Platforms:/i)).toBeInTheDocument();
  });

  it("shows only 5 tags initially (desktop width)", () => {
    render(<GameCardBase {...defaultProps} />);
    const visibleTags = screen.getAllByText(
      /Action|Adventure|Puzzle|RPG|Horror/,
    );
    expect(visibleTags).toHaveLength(5);
  });

  it("toggles tag visibility when expand/collapse button is clicked", async () => {
    const user = userEvent.setup();
    render(<GameCardBase {...defaultProps} />);

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

  it("renders placeholders when showPlaceholders is true", () => {
    render(<GameCardBase {...defaultProps} showPlaceholders />);
    expect(screen.getByText(/star rating placeholder/i)).toBeInTheDocument();
    expect(screen.getByText(/heart icon placeholder/i)).toBeInTheDocument();
  });

  it("does not render placeholders when showPlaceholders is false", () => {
    render(<GameCardBase {...defaultProps} showPlaceholders={false} />);
    expect(
      screen.queryByText(/star rating placeholder/i),
    ).not.toBeInTheDocument();
  });

  it("calls onButtonClick when the button is clicked", async () => {
    const user = userEvent.setup();
    const mockClick = vi.fn();

    render(<GameCardBase {...defaultProps} onButtonClick={mockClick} />);
    const button = screen.getByRole("button", { name: /Learn More/i });

    await user.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it("applies reversed layout when imagePosition='left'", () => {
    const { container } = render(
      <GameCardBase {...defaultProps} imagePosition="left" />,
    );
    expect(container.firstChild).toHaveClass("md:flex-row-reverse");
  });
});
