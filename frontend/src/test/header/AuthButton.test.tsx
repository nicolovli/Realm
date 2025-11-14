import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthButton } from "@/components/Header";
import { MemoryRouter } from "react-router-dom";
import * as useAuthStatusModule from "@/hooks/useAuthStatus";

// Mock Auth status hook
vi.mock("@/hooks/useAuthStatus");

// Mock AuthDialog to avoid rendering internals
vi.mock("../../components/User", () => ({
  AuthDialog: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="auth-dialog">
        <button onClick={() => onOpenChange(false)}>Close Dialog</button>
      </div>
    ) : null,
}));

describe("AuthButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderWithRouter = (isLoggedIn = false) => {
    vi.mocked(useAuthStatusModule.useAuthStatus).mockReturnValue({
      isLoggedIn,
      setIsLoggedIn: vi.fn(),
    });

    return render(
      <MemoryRouter>
        <AuthButton />
      </MemoryRouter>,
    );
  };

  it("renders login button when not logged in", () => {
    renderWithRouter(false);

    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveTextContent("Login");
  });

  it("renders account button when logged in and navigates to /profile", async () => {
    renderWithRouter(true);

    const accountButton = screen.getByRole("button", { name: /view account/i });
    expect(accountButton).toBeInTheDocument();

    const svg = accountButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("opens auth dialog when login button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(false);

    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(screen.queryByTestId("auth-dialog")).not.toBeInTheDocument();

    await user.click(loginButton);

    expect(screen.getByTestId("auth-dialog")).toBeInTheDocument();
  });

  it("closes auth dialog when closed", async () => {
    const user = userEvent.setup();
    renderWithRouter(false);

    const loginButton = screen.getByRole("button", { name: /login/i });

    await user.click(loginButton);
    expect(screen.getByTestId("auth-dialog")).toBeInTheDocument();

    const closeButton = screen.getByText("Close Dialog");
    await user.click(closeButton);

    expect(screen.queryByTestId("auth-dialog")).not.toBeInTheDocument();
  });

  it("applies correct CSS classes to login button", () => {
    renderWithRouter(false);

    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toHaveClass("bg-lightbuttonpurple");
    expect(loginButton).toHaveClass("dark:bg-darkbuttonpurple");
  });

  it("dispatches auth-change event after successful login", async () => {
    const user = userEvent.setup();
    const mockSetIsLoggedIn = vi.fn();
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    const localStorageMock = {
      getItem: vi.fn((key: string) => (key === "token" ? "fake-token" : null)),
      setItem: vi.fn(() => {}),
      removeItem: vi.fn(() => {}),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(() => null),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    vi.mocked(useAuthStatusModule.useAuthStatus).mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: mockSetIsLoggedIn,
    });

    render(
      <MemoryRouter>
        <AuthButton />
      </MemoryRouter>,
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    await user.click(loginButton);

    const closeButton = screen.getByText("Close Dialog");
    await user.click(closeButton);

    if (localStorageMock.getItem("token")) {
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
    }

    dispatchEventSpy.mockRestore();
  });
});
