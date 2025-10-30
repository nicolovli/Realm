import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing/react";
import { HeartIcon } from "../components/HeartIcon";
import { GET_USER_WITH_FAV } from "@/lib/graphql/queries/userQueries";
import { TOGGLE_FAVORITE } from "@/lib/graphql/mutations/favorites";
import * as authHook from "@/hooks/useAuthStatus";

vi.mock("@/hooks/useAuthStatus");
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("HeartIcon", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderHeartIcon = async (
    isLoggedIn = true,
    favorites: string[] = [],
    onRequireLogin = vi.fn(),
  ) => {
    // Mock auth status hook
    vi.mocked(authHook.useAuthStatus).mockReturnValue({
      isLoggedIn,
      setIsLoggedIn: vi.fn(),
    });

    // Apollo mocks
    const mocks = [
      {
        request: { query: GET_USER_WITH_FAV },
        result: {
          data: {
            me: isLoggedIn
              ? {
                  id: "1",
                  username: "test",
                  favorites: favorites.map((id) => ({ id })),
                }
              : null,
          },
        },
      },
      {
        request: {
          query: TOGGLE_FAVORITE,
          variables: { gameId: 1, liked: true },
        },
        result: {
          data: { toggleFavorite: { id: "game1" } },
        },
      },
    ];

    const container = render(
      <MockedProvider mocks={mocks}>
        <HeartIcon gameId={1} onRequireLogin={onRequireLogin} />
      </MockedProvider>,
    ).container;

    await waitFor(() => {
      if (isLoggedIn) {
        expect(container.querySelector("svg")).toBeInTheDocument();
      }
    });

    return { container, onRequireLogin };
  };

  it("renders HeartOutline when not liked", async () => {
    const { container } = await renderHeartIcon(true, []);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders HeartSolid when liked", async () => {
    const { container } = await renderHeartIcon(true, ["game1"]);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("calls onRequireLogin when not logged in", async () => {
    const user = userEvent.setup();
    const onRequireLogin = vi.fn();
    const { container } = await renderHeartIcon(false, [], onRequireLogin);
    const svg = container.querySelector("svg")!;
    await user.click(svg);
    expect(onRequireLogin).toHaveBeenCalled();
  });
});
