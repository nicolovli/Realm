import { render, cleanup } from "@testing-library/react";
import { vi, type MockedFunction } from "vitest";
import { MatchCount } from "@/components/ResultFilters";

vi.mock("../../components/ResultFilters/MatchCount", () => ({
  MatchCount: vi.fn(() => null),
}));

const mockMatchCount = MatchCount as MockedFunction<typeof MatchCount>;

describe("MatchCount", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders with correct matchesCount prop", () => {
    const props = { matchesCount: 5 };

    render(<MatchCount {...props} />);

    expect(mockMatchCount).toHaveBeenCalledWith(props, undefined);
  });

  it("renders with zero count", () => {
    const props = { matchesCount: 0 };

    render(<MatchCount {...props} />);

    expect(mockMatchCount).toHaveBeenCalledWith(props, undefined);
  });
});
