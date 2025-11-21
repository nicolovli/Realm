import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ResultsGrid } from "@/components/ResultsGrid";
import { makeGame } from "@/test/mocks/resultsMocks";
import { vi } from "vitest";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const testClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: "/graphql" }),
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={testClient}>
    <MemoryRouter>{children}</MemoryRouter>
  </ApolloProvider>
);

vi.mock("@/components/HeartIcon", () => ({
  HeartIcon: () => <div data-testid="heart-icon" />,
}));

describe("ResultsGrid", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders 12 skeletons while loading", () => {
    const { container } = render(
      <Wrapper>
        <ResultsGrid games={[]} loading={true} />
      </Wrapper>,
    );
    expect(container.querySelectorAll(".animate-pulse").length).toBe(12);
  });

  it("renders one link per game when not loading", async () => {
    const games = [
      makeGame({ id: "1", name: "A" }),
      makeGame({ id: "2", name: "B" }),
      makeGame({ id: "3", name: "C" }),
    ];

    render(
      <Wrapper>
        <ResultsGrid games={games} loading={false} />
      </Wrapper>,
    );

    const links = await screen.findAllByRole("link");
    expect(links.length).toBe(3);
    expect(screen.getByLabelText("Open A")).toBeInTheDocument();
    expect(screen.getByLabelText("Open B")).toBeInTheDocument();
    expect(screen.getByLabelText("Open C")).toBeInTheDocument();
  });

  it("shows empty status message when not loading and no games", () => {
    render(
      <Wrapper>
        <ResultsGrid games={[]} loading={false} />
      </Wrapper>,
    );
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/no games to display/i);
  });

  it("shows provided emptyState content", () => {
    render(
      <Wrapper>
        <ResultsGrid
          games={[]}
          loading={false}
          emptyState={<span>Custom Empty</span>}
        />
      </Wrapper>,
    );
    expect(screen.getByText(/custom empty/i)).toBeInTheDocument();
  });

  it("does not render skeletons when loading=true but games already present", () => {
    const games = [makeGame(), makeGame()];
    const { container } = render(
      <Wrapper>
        <ResultsGrid games={games} loading={true} />
      </Wrapper>,
    );

    expect(container.querySelectorAll(".animate-pulse").length).toBe(2);
    expect(screen.getAllByRole("link").length).toBe(2);
  });

  it("renders load more button when more than 12 games and increases visible items", async () => {
    const games = Array.from({ length: 15 }, () => makeGame());
    render(
      <Wrapper>
        <ResultsGrid games={games} loading={false} />
      </Wrapper>,
    );
    const grid = screen.getByRole("list");

    expect(grid.querySelectorAll("[data-cy='result-card']").length).toBe(12);
    const btn = screen.getByRole("button", { name: /load more games/i });
    await userEvent.click(btn);
    expect(grid.querySelectorAll("[data-cy='result-card']").length).toBe(15);

    expect(
      screen.queryByRole("button", { name: /load more games/i }),
    ).toBeNull();
  });

  it("does not render load more button when games length <= 12", () => {
    const games = Array.from({ length: 12 }, () => makeGame());
    render(
      <Wrapper>
        <ResultsGrid games={games} loading={false} />
      </Wrapper>,
    );
    expect(
      screen.queryByRole("button", { name: /load more games/i }),
    ).toBeNull();
  });

  it("list has aria-live polite for dynamic updates", () => {
    const games = Array.from({ length: 15 }, () => makeGame());
    render(
      <Wrapper>
        <ResultsGrid games={games} loading={false} />
      </Wrapper>,
    );
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("aria-live", "polite");
  });
});
