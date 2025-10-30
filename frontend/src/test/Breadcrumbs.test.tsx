import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";

// 1) Mock UI-breadcrumbs
vi.mock("@/components/ui/breadcrumb", () => ({
  __esModule: true,
  Breadcrumb: ({ children }: { children: React.ReactNode }) => (
    <nav>{children}</nav>
  ),
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => (
    <ol>{children}</ol>
  ),
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
  BreadcrumbLink: ({ children }: { children: React.ReactNode }) => (
    <a>{children}</a>
  ),
  BreadcrumbPage: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  BreadcrumbSeparator: () => <span>/</span>,
}));

const { Breadcrumbs } = await import("@/components/Breadcrumbs");
const { GET_GAME } = await import("@/lib/graphql/queries/gameQueries");

describe("Breadcrumbs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not render on the homepage", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={["/"]}>
          <Breadcrumbs />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(screen.queryByText("Home")).toBeNull();
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
  });

  it("renders game ID for /games/:id", async () => {
    const mocks = [
      {
        request: { query: GET_GAME, variables: { id: "7472" } },
        result: { data: { game: { id: "7472", name: "Test Game 7472" } } },
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

    const el = await screen.findByText("Test Game 7472");
    expect(el).toBeInTheDocument();
  });

  it("renders breadcrumb for other routes", () => {
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
});
