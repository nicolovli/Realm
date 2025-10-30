import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ResultsGrid } from "../../components/ResultsGrid/ResultsGrid";
import type { Game } from "../../types/GameTypes";

const makeGame = (overrides: Partial<Game> = {}): Game => ({
  id: "id-" + Math.random().toString(36).slice(2),
  sid: 1,
  name: "Test Game",
  image: "https://example.com/placeholder.jpg",
  descriptionShort: "Desc",
  publishedStore: "",
  platforms: ["PC"],
  developers: [],
  publishers: [],
  languages: [],
  categories: [],
  genres: [],
  tags: [],
  ...overrides,
});

describe("ResultsGrid", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders 9 skeletons while loading", () => {
    const { container } = render(<ResultsGrid games={[]} loading={true} />);
    expect(container.querySelectorAll(".animate-pulse").length).toBe(9);
  });

  it("renders one link per game when not loading", async () => {
    const games = [
      makeGame({ id: "1", name: "A" }),
      makeGame({ id: "2", name: "B" }),
      makeGame({ id: "3", name: "C" }),
    ];

    render(
      <MemoryRouter>
        <ResultsGrid games={games} loading={false} />
      </MemoryRouter>,
    );

    const links = await screen.findAllByRole("link");
    expect(links.length).toBe(3);
    expect(screen.getByLabelText("Open A")).toBeInTheDocument();
    expect(screen.getByLabelText("Open B")).toBeInTheDocument();
    expect(screen.getByLabelText("Open C")).toBeInTheDocument();
  });

  it("renders an error message when error prop is provided", () => {
    render(<ResultsGrid games={[]} loading={false} error="Boom!" />);
    expect(screen.getByText("Boom!")).toBeInTheDocument();
  });
});
