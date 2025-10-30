import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { ReviewItem } from "../../components/Reviews/ReviewItem";
import type { Review } from "../../types/Review";

const sampleReview: Review & { user?: { id?: number; username?: string } } = {
  id: 1,
  gameId: 1,
  description: "Great!",
  star: 4,
  createdAt: new Date().toISOString(),
  user: { id: 2, username: "testuser" },
};

describe("ReviewItem", () => {
  it("renders review content, author and read-only star rating", () => {
    render(
      <MockedProvider mocks={[]}>
        <ReviewItem
          review={sampleReview}
          gameId={1}
          currentUserId={undefined}
        />
      </MockedProvider>,
    );

    expect(screen.getByText(/Great!/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();

    // find the star rating container by label
    const rating = screen.getByLabelText(/star rating/i);
    const outerStarSpans = rating.querySelectorAll("span[aria-hidden='true']");
    expect(outerStarSpans.length).toBe(5);
  });
});
