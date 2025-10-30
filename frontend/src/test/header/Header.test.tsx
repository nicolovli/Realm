import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Header } from "../../components/Header";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import * as useAuthStatusModule from "@/hooks/useAuthStatus";

vi.mock("@/hooks/useAuthStatus");

vi.mock("../../components/Header/MobileSheetMenu", () => ({
  MobileSheetMenu: () => (
    <div data-testid="mobile-sheet-menu">MobileSheetMenu</div>
  ),
}));

vi.mock("../../components/Header/SearchBar", () => ({
  SearchBar: ({ placeholder }: { placeholder?: string }) => (
    <div>
      <input aria-label={placeholder ?? "Search"} />
      <button aria-label="Search">Search</button>
    </div>
  ),
}));

vi.mock("../../components/Header/ToggleTheme", () => ({
  ToggleTheme: () => <button aria-label="Switch theme">Toggle Theme</button>,
}));

vi.mock("../../components/Header/AuthButton", () => ({
  AuthButton: () => {
    const { useAuthStatus } = useAuthStatusModule;
    const { isLoggedIn } = useAuthStatus();
    return <button>{isLoggedIn ? "Profile" : "Login"}</button>;
  },
}));

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHeader = (isLoggedIn = false) => {
    vi.mocked(useAuthStatusModule.useAuthStatus).mockReturnValue({
      isLoggedIn,
      setIsLoggedIn: vi.fn(),
    });

    return render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </MockedProvider>,
    );
  };

  afterEach(() => {
    cleanup();
  });

  it("renders logo and main navigation links", () => {
    renderHeader();
    expect(screen.getByLabelText("Homepage")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Discover")).toBeInTheDocument();
  });

  it("renders login button when user is not logged in", () => {
    renderHeader(false);
    expect(screen.getAllByText("Login").length).toBeGreaterThan(0);
  });

  it("renders profile button when user is logged in", () => {
    renderHeader(true);
    expect(screen.getAllByText("Profile").length).toBeGreaterThan(0);
  });

  it("renders theme toggle button", () => {
    renderHeader();
    const buttons = screen.getAllByRole("button", { name: /switch theme/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders mobile sheet menu in small screens", async () => {
    renderHeader();
    expect(screen.getByTestId("mobile-sheet-menu")).toBeInTheDocument();
  });

  it("renders desktop navigation section on md screens and above", () => {
    renderHeader();
    const nav = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(nav).toBeInTheDocument();
  });

  it("renders search bars for desktop and mobile", () => {
    renderHeader();
    expect(screen.getAllByLabelText(/Search/i).length).toBeGreaterThan(1);
  });
});
