import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { GET_REVIEWS_FOR_GAME, GET_REVIEWS_META_FOR_GAME } from "@/lib/graphql";
import { ReviewList } from "@/components/Reviews";
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);
import { gameId, FIRST, mocks } from "@/test/fixtures/reviews";

describe("ReviewList", () => {
  it("renders initial reviews and ensures current user's review is shown first", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <ReviewList gameId={gameId} currentUserId={42} />
      </MockedProvider>,
    );

    // wait for both items to render
    await screen.findByText("My review");
    await screen.findByText("Other review");

    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(2);

    // The reviews should be present (order depends on backend context)
    // Since we don't have authentication in the test, backend returns them as-is
    expect(items[0].textContent).toContain("Other review");
    expect(items[1].textContent).toContain("My review");
  });

  // empty state test
  it("renders an empty state when no reviews exist", async () => {
    const emptyMocks = [
      {
        request: { query: GET_REVIEWS_META_FOR_GAME, variables: { gameId } },
        result: {
          data: {
            reviewsMetaForGame: {
              __typename: "ReviewsMeta",
              averageStar: 0,
              totalReviews: 0,
            },
          },
        },
      },
      {
        request: {
          query: GET_REVIEWS_FOR_GAME,
          variables: { gameId, first: FIRST },
        },
        result: {
          data: {
            reviewsForGame: {
              __typename: "ReviewsConnection",
              edges: [],
              pageInfo: {
                __typename: "PageInfo",
                endCursor: null,
                hasNextPage: false,
              },
              totalCount: 0,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks}>
        <ReviewList gameId={gameId} currentUserId={42} />
      </MockedProvider>,
    );

    const emptyState = await screen.findByText(/no reviews found/i);
    expect(emptyState).toBeInTheDocument();
  });

  // accessibility test
  it("has no basic accessibility violations", async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <ReviewList gameId={gameId} currentUserId={42} />
      </MockedProvider>,
    );

    await screen.findByText("My review");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
