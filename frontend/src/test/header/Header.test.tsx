import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "../../components/Header";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";

// Mock the components properly - they should NOT render Link components
vi.mock("../components/MobileMenu", () => ({
  MobileMenu: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="mobile-menu">Favorites</div> : null,
}));

vi.mock("../components/MobileSearchMenu", () => ({
  MobileSearchMenu: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? (
      <div data-testid="mobile-search-menu">Searchbar here for sprint 2</div>
    ) : null,
}));

describe("Header Component", () => {
  const renderHeader = () => {
    return render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={["/"]}>
          <Header />
        </MemoryRouter>
      </MockedProvider>,
    );
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders navigation links correctly", () => {
    renderHeader();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  it("renders login button", () => {
    renderHeader();
    expect(screen.getAllByText("Login").length).toBeGreaterThan(0);
  });

  it("renders dark mode toggle button", () => {
    renderHeader();
    const darkModeButtons = screen.getAllByRole("button", {
      name: /Switch to (dark|light) theme/i,
    });
    expect(darkModeButtons.length).toBeGreaterThan(0);
  });

  it("opens and closes mobile menu when bar button is clicked", async () => {
    renderHeader();
    const menuButton = screen.getByLabelText("Open menu");

    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.click(menuButton);
    });

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu.textContent).toBe("FavoritesDiscover");

    await act(async () => {
      await userEvent.click(menuButton);
    });

    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });

  it("opens and closes mobile search menu when search icon is clicked", async () => {
    renderHeader();
    const searchButton = screen.getByLabelText("Open search menu");

    expect(screen.queryByTestId("mobile-search-menu")).not.toBeInTheDocument();

    await userEvent.click(searchButton);
    // Check that the mobile search menu is visible
    expect(screen.getByTestId("mobile-search-menu")).toBeInTheDocument();

    await userEvent.click(searchButton);
    expect(screen.queryByTestId("mobile-search-menu")).not.toBeInTheDocument();
  });

  it("keyboard tab navigation focuses buttons and links", async () => {
    renderHeader();
    const user = userEvent.setup();
    const header = screen.getByRole("banner"); // <header> element with role=banner
    const homeLink = screen.getByLabelText("Homepage");
    const searchInput = screen.getByLabelText("Search for games"); // SearchBar input
    const searchButton = screen.getByLabelText("Search"); // SearchBar submit button
    const favoritesLink = screen.getByText("Favorites").closest("a");
    const loginButtons = screen.getAllByText("Login");
    const darkModeButtons = screen.getAllByRole("button", {
      name: /Switch to (dark|light) theme/i,
    });

    await user.tab();
    expect(document.activeElement).toBe(header);
    await user.tab();
    expect(document.activeElement).toBe(homeLink);

    await user.tab();
    expect(document.activeElement).toBe(searchInput); // SearchBar input comes next

    await user.tab();
    expect(document.activeElement).toBe(searchButton); // SearchBar button comes next

    await user.tab();
    expect(document.activeElement).toBe(favoritesLink);

    loginButtons.forEach(async (button) => {
      await user.tab();
      if (document.activeElement === button) {
        expect(document.activeElement).toBe(button);
      }
    });

    await user.tab();
    const focusedDarkModeButton = darkModeButtons.find(
      (button) => button === document.activeElement,
    );
    expect(focusedDarkModeButton).toBeDefined();
  });

  it("renders desktop nav only on md screens and above", () => {
    renderHeader();
    const desktopNav = screen.getByRole("navigation", {
      name: "Main Navigation",
    });
    const mobileSection = screen.getByLabelText("Open menu").closest("section");
    expect(desktopNav).toHaveClass("flex justify-center items-center gap-4");
    expect(mobileSection).toHaveClass("flex md:hidden");
  });

  it("renders desktop and mobile login buttons", () => {
    renderHeader();
    const loginButtons = screen.getAllByText("Login");
    expect(loginButtons.length).toBe(2);
    expect(loginButtons[0]).toBeInTheDocument();
    expect(loginButtons[1]).toBeInTheDocument();
  });
});
