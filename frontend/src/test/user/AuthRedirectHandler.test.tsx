import { describe, it, vi, beforeEach, expect, type Mock } from "vitest";
import { render } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { AuthRedirectHandler } from "../../components/User";

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

describe("AuthRedirectHandler", () => {
  const mockNavigate = vi.fn();
  const mockUseQuery = useQuery as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
    (useLocation as unknown as Mock).mockReturnValue({ pathname: "/" });
  });

  it("redirects to /completeprofile if user does not exist in DB", () => {
    (useAuth0 as Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { sub: "auth0|123" },
    });
    mockUseQuery.mockReturnValue({
      data: { userByAuth0Id: null },
      loading: false,
    });

    render(<AuthRedirectHandler />);

    expect(mockNavigate).toHaveBeenCalledWith("/completeprofile", {
      replace: true,
    });
  });

  it("does not redirect if user exists", () => {
    (useAuth0 as Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { sub: "auth0|123" },
    });
    mockUseQuery.mockReturnValue({
      data: { userByAuth0Id: { id: "1" } },
      loading: false,
    });

    render(<AuthRedirectHandler />);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("does nothing if not authenticated", () => {
    (useAuth0 as Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
    mockUseQuery.mockReturnValue({ data: null, loading: false });

    render(<AuthRedirectHandler />);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
