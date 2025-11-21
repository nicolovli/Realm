import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import { SearchBar } from "@/components/Header";
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);
import { searchMocks } from "@/test/mocks/searchMock";

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

    expect(mockNavigate).toHaveBeenCalledWith("/games?search=Test+Game&page=1");
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
    expect(mockNavigate).toHaveBeenCalledWith("/games/1", {
      state: {
        previewImage:
          "https://images.weserv.nl/?url=portal2.jpg&w=640&output=webp",
      },
    });
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
    const input = screen.getByLabelText("Search for games") as HTMLInputElement;

    // Type to trigger search
    await user.type(input, "portal");

    // Wait for listbox to appear with suggestions
    await waitFor(() => {
      expect(screen.getByText("Portal")).toBeInTheDocument();
    });

    // Ensure input has focus and send Escape
    input.focus();
    await user.keyboard("{Escape}");

    // ListBox should disappear
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = renderSearchBar();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
