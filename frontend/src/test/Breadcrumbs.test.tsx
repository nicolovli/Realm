import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import "@testing-library/jest-dom";

window.scrollTo = vi.fn();

// mock UI-breadcrumbs components to isolate Breadcrumbs tests
vi.mock("@/components/ui/breadcrumb", () => ({
  __esModule: true,
  Breadcrumb: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <nav className={className}>{children}</nav>,
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => (
    <ol>{children}</ol>
  ),
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),

  BreadcrumbLink: ({
    children,
    asChild,
    className,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    className?: string;
  }) => {
    if (asChild) {
      return <>{children}</>;
    }
    return <a className={className}>{children}</a>;
  },
  BreadcrumbPage: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  BreadcrumbSeparator: () => <span>/</span>,
}));

const { Breadcrumbs } = await import("@/components/Breadcrumbs");
const { GET_GAME } = await import("@/lib/graphql");

describe("Breadcrumbs", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // rendering tests
  it("does not render breadcrumbs on the homepage", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={["/"]}>
          <Breadcrumbs />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });

  it("renders breadcrumb for /games", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={["/games"]}>
          <Breadcrumbs />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Games")).toBeInTheDocument();

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders game name for /games/:id when data loads", async () => {
    const mocks = [
      {
        request: {
          query: GET_GAME,
          variables: { id: "7472" },
        },
        result: {
          data: {
            game: {
              __typename: "Game",
              id: "7472",
              sid: 7472,
              name: "Test Game 7472",
              image: "test.jpg",
              descriptionShort: "A test game",
              descriptionText: "A test game long description",
              publishedStore: "2024-01-01",
              platforms: ["PC"],
              developers: ["Test Studio"],
              publishers: ["Test Publisher"],
              languages: ["English"],
              categories: ["Action"],
              genres: ["Action"],
              tags: ["test"],
              avgRating: 4.5,
              reviewsCount: 10,
              favoritesCount: 5,
              popularityScore: 20,
              hasRatings: true,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/games/7472"]}>
          <Routes>
            <Route path="/games/:id" element={<Breadcrumbs />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Games")).toBeInTheDocument();

    expect(screen.getByText("Loading…")).toBeInTheDocument();

    const gameName = await screen.findByText(
      "Test Game 7472",
      {},
      { timeout: 3000 },
    );
    expect(gameName).toBeInTheDocument();

    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
  });

  it("renders breadcrumb for /favorites route", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={["/favorites"]}>
          <Breadcrumbs />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  it("renders breadcrumb with proper link structure", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={["/games"]}>
          <Breadcrumbs />
        </MemoryRouter>
      </MockedProvider>,
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    const list = nav.querySelector("ol");
    expect(list).toBeInTheDocument();

    const listItems = nav.querySelectorAll("li");
    expect(listItems.length).toBeGreaterThan(0);
  });

  // tests for unknown routes (edge case)
  it("capitalizes unknown route names", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={["/unknown-route"]}>
          <Breadcrumbs />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Unknown-route")).toBeInTheDocument();
  });
});
