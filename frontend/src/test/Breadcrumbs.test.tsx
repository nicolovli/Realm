import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

describe("Breadcrumbs", () => {
  it("does not render on the homepage", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Breadcrumbs />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Home")).toBeNull();
  });

  it("renders breadcrumb for /games", () => {
    render(
      <MemoryRouter initialEntries={["/games"]}>
        <Breadcrumbs />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Games")).toBeInTheDocument();
  });

  it("renders game ID for /games/:id", () => {
    render(
      <MemoryRouter initialEntries={["/games/7472"]}>
        <Routes>
          <Route path="/games/:id" element={<Breadcrumbs />} />
        </Routes>
      </MemoryRouter>,
    );

    // Check static parts
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Games")).toBeInTheDocument();
    // Check that the breadcrumb shows the ID
    expect(screen.getByText("7472")).toBeInTheDocument();
  });

  it("renders breadcrumb for other routes", () => {
    render(
      <MemoryRouter initialEntries={["/favorites"]}>
        <Breadcrumbs />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });
});
