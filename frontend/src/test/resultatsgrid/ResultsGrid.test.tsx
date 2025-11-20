// src/test/resultatsgrid/ResultsGrid.test.tsx
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import { ResultsGrid } from "@/components/ResultsGrid";
import type { Game } from "@/types";

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

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <MockedProvider mocks={[]}>
      <MemoryRouter>{ui}</MemoryRouter>
    </MockedProvider>,
  );

describe("ResultsGrid", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders 12 skeletons while loading", () => {
    const { container } = renderWithProviders(
      <ResultsGrid games={[]} loading={true} />,
    );
    expect(container.querySelectorAll(".animate-pulse").length).toBe(12);
  });

  it("renders one link per game when not loading", async () => {
    const games = [
      makeGame({ id: "1", name: "A" }),
      makeGame({ id: "2", name: "B" }),
      makeGame({ id: "3", name: "C" }),
    ];

    renderWithProviders(<ResultsGrid games={games} loading={false} />);

    const links = await screen.findAllByRole("link");
    expect(links.length).toBe(3);
    expect(screen.getByLabelText("Open A")).toBeInTheDocument();
    expect(screen.getByLabelText("Open B")).toBeInTheDocument();
    expect(screen.getByLabelText("Open C")).toBeInTheDocument();
  });

  it("renders an error message when error prop is provided", () => {
    renderWithProviders(
      <ResultsGrid games={[]} loading={false} error="Boom!" />,
    );
    expect(screen.getByText("Boom!")).toBeInTheDocument();
  });
});
