import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import { SearchBar } from "../../components/Header/SearchBar";
import { SEARCH_GAMES } from "../../lib/graphql/queries/gameQueries";

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock data for GraphQL queries
const mockGames = [
  {
    id: "1",
    sid: "portal-2",
    name: "Portal 2",
    image: "portal2.jpg",
    publishers: ["Valve"],
  },
  {
    id: "2",
    sid: "portal",
    name: "Portal",
    image: "portal.jpg",
    publishers: ["Valve"],
  },
];

const searchMocks = [
  {
    request: {
      query: SEARCH_GAMES,
      variables: { query: "portal", limit: 6 },
    },
    result: {
      data: {
        searchGames: mockGames,
      },
    },
  },
];

describe("SearchBar Component", () => {
  const renderSearchBar = (props = {}) => {
    return render(
      <MockedProvider mocks={searchMocks}>
        <MemoryRouter>
          <SearchBar {...props} />
        </MemoryRouter>
      </MockedProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders search input and button", () => {
    renderSearchBar();
    expect(screen.getByLabelText("Search for games")).toBeInTheDocument();
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("shows suggestions when typing", async () => {
    const user = userEvent.setup();
    renderSearchBar();
    const input = screen.getByLabelText("Search for games");

    await user.type(input, "portal");

    await waitFor(() => {
      expect(screen.getByText("Portal 2")).toBeInTheDocument();
      expect(screen.getByText("Portal")).toBeInTheDocument();
    });
  });

  it("navigates to result page on form submit", async () => {
    const user = userEvent.setup();
    renderSearchBar();
    const input = screen.getByLabelText("Search for games");

    await user.type(input, "Test Game");
    await user.click(screen.getByLabelText("Search"));

    expect(mockNavigate).toHaveBeenCalledWith("/games?search=Test%20Game");
  });

  it("navigates to game detail when clicking suggestion", async () => {
    const user = userEvent.setup();
    renderSearchBar();
    const input = screen.getByLabelText("Search for games");

    await user.type(input, "portal");

    await waitFor(() => {
      expect(screen.getByText("Portal 2")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Portal 2"));
    expect(mockNavigate).toHaveBeenCalledWith("/games/1");
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    renderSearchBar();
    const input = screen.getByLabelText("Search for games");

    await user.type(input, "test");
    await user.click(screen.getByLabelText("Clear search"));

    expect(input).toHaveValue("");
  });

  it("closes suggestions with Escape key", async () => {
    const user = userEvent.setup();
    renderSearchBar();
    const input = screen.getByLabelText("Search for games");

    await user.type(input, "portal");
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });
});
