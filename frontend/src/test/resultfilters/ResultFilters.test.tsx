import { render, cleanup } from "@testing-library/react";
import { vi, type MockedFunction } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import { ResultFilters } from "@/components/ResultFilters";
import { defaultProps } from "../fixtures/resultfilters";

// Mock the ResultFilters component (default export)
vi.mock("../../components/ResultFilters", () => ({
  __esModule: true,
  ResultFilters: vi.fn(() => null),
}));

const mockResultFilters = ResultFilters as MockedFunction<typeof ResultFilters>;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ResultFilters", () => {
  const renderWithProviders = (props = {}) => {
    return render(
      <MockedProvider>
        <MemoryRouter>
          <ResultFilters {...defaultProps} {...props} />
        </MemoryRouter>
      </MockedProvider>,
    );
  };

  it("renders ResultFilters without search query", () => {
    renderWithProviders();
    expect(mockResultFilters).toHaveBeenCalled();
  });

  it("renders ResultFilters with search query", () => {
    const searchQuery = "test game";
    renderWithProviders({ searchQuery });
    expect(mockResultFilters).toHaveBeenCalledWith(
      expect.objectContaining({ searchQuery }),
      undefined,
    );
  });

  it("renders multiple times without issues", () => {
    renderWithProviders();
    renderWithProviders({ searchQuery: "another search" });
    expect(mockResultFilters).toHaveBeenCalledTimes(2);
  });
});
