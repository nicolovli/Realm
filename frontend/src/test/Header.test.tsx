import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "../components/Header";
import { MemoryRouter } from "react-router-dom";

// Mock the components properly - they should NOT render Link components
vi.mock("../components/MobileMenu", () => ({
  MobileMenu: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="mobile-menu">Open</div> : null,
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
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>,
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
    const darkModeButton = screen.getAllByLabelText("Toggle dark mode");
    expect(darkModeButton.length).toBeGreaterThan(0);
  });

  it("opens and closes mobile menu when bar button is clicked", async () => {
    renderHeader();
    const menuButton = screen.getByLabelText("Open menu");

    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.click(menuButton);
    });

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu.textContent).toBe("Favorites");

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
    const searchMenu = screen.getByTestId("mobile-search-menu");
    expect(searchMenu.textContent).toBe("Searchbar here for sprint 2");

    await userEvent.click(searchButton);
    expect(screen.queryByTestId("mobile-search-menu")).not.toBeInTheDocument();
  });

  it("keyboard tab navigation focuses buttons and links", async () => {
    renderHeader();
    const user = userEvent.setup();
    const homeLink = screen.getByLabelText("Homepage");
    const favoritesLink = screen.getByText("Favorites").closest("a");
    const loginLink = screen.getAllByText("Login");
    const darkModeButtons = screen.getAllByLabelText("Toggle dark mode");

    await user.tab();
    expect(document.activeElement).toBe(homeLink);

    await user.tab();
    expect(document.activeElement).toBe(favoritesLink);

    await user.tab();
    const isLoginButtonFocused = loginLink.some(
      (buttons) => buttons === document.activeElement,
    );
    expect(isLoginButtonFocused).toBe(true);

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
