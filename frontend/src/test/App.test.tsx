import { render, screen } from "@testing-library/react";
import App from "@/App";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import { vi } from "vitest";

vi.mock("../index.css", () => ({}));

window.scrollTo = vi.fn();

// mock Breadcrumbs to avoid GraphQL queries
vi.mock("@/components/Breadcrumbs", () => ({
  Breadcrumbs: () => <nav data-testid="breadcrumbs">Breadcrumbs</nav>,
}));

// mock all page components to avoid GraphQL queries
vi.mock("@/pages", () => ({
  HomePage: () => <div data-testid="home-page">Home Page</div>,
  ResultPage: () => <div data-testid="result-page">Result Page</div>,
  FavoritePage: () => <div data-testid="favorite-page">Favorite Page</div>,
  InformationPage: () => (
    <div data-testid="information-page">Information Page</div>
  ),
  UserPage: () => <div data-testid="user-page">User Page</div>,
}));

const renderApp = (initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MockedProvider mocks={[]}>
        <App />
      </MockedProvider>
    </MemoryRouter>,
  );
};

describe("App Component", () => {
  // tests that components related to layout and routing are rendered
  it("renders header, main content area, and footer", () => {
    renderApp();

    const header = screen.getByRole("banner");
    const main = screen.getAllByRole("main")[0];
    const footer = screen.getByRole("contentinfo");

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it("renders breadcrumbs navigation", () => {
    renderApp();

    const breadcrumbs = screen.getByTestId("breadcrumbs");
    expect(breadcrumbs).toBeInTheDocument();
  });

  it("renders home page by default", () => {
    renderApp("/");

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("renders correct page for each route", () => {
    const routes = [
      { path: "/", testId: "home-page" },
      { path: "/games", testId: "result-page" },
      { path: "/favorites", testId: "favorite-page" },
      { path: "/games/123", testId: "information-page" },
      { path: "/profile", testId: "user-page" },
    ];

    routes.forEach(({ path, testId }) => {
      const { unmount } = renderApp(path);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      unmount();
    });
  });

  // tests semantic HTML structure and flex layout classes
  it("maintains proper semantic HTML structure", () => {
    const { container } = renderApp();

    const header = screen.getByRole("banner");
    const footer = screen.getByRole("contentinfo");
    const main = container.querySelector("section > main");

    expect(main).toBeInTheDocument();
    expect(header.compareDocumentPosition(main!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(main!.compareDocumentPosition(footer)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("applies flex layout classes for proper page structure", () => {
    const { container } = renderApp();

    const section = container.querySelector("section");
    expect(section).toHaveClass("flex", "flex-col", "min-h-screen");
  });
});
