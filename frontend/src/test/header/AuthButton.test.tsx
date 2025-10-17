import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthButton } from "../../components/Header";
import { BrowserRouter } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("AuthButton", () => {
  const mockLoginWithRedirect = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
  });

  it("renders Login button and icon when not authenticated", async () => {
    (useAuth0 as Mock).mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
      user: null,
    });

    render(
      <BrowserRouter>
        <AuthButton />
      </BrowserRouter>,
    );

    const button = screen.getByRole("button", { name: /login/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(mockLoginWithRedirect).toHaveBeenCalledOnce();
  });

  it("renders Profile text when authenticated without picture", async () => {
    (useAuth0 as Mock).mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
      user: { name: "Test User", picture: null },
    });

    render(
      <BrowserRouter>
        <AuthButton />
      </BrowserRouter>,
    );

    const button = screen.getByRole("button", { name: /profile/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("renders profile picture when authenticated with picture", async () => {
    (useAuth0 as Mock).mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
      user: { name: "Test User", picture: "pic.jpg" },
    });

    render(
      <BrowserRouter>
        <AuthButton />
      </BrowserRouter>,
    );

    const img = screen.getByRole("img", { name: /profile/i });
    expect(img).toBeInTheDocument();

    await userEvent.click(img);
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });
});
