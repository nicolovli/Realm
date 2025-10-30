import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import {
  GET_REVIEWS_FOR_GAME,
  GET_REVIEWS_META_FOR_GAME,
} from "../../lib/graphql/queries/reviewQueries";
import { ReviewList } from "../../components/Reviews/ReviewList";

const gameId = 1;
const TAKE = 6;

const initialReviews = [
  {
    id: 1,
    gameId,
    userId: 2,
    description: "Other review",
    star: 4,
    createdAt: new Date().toISOString(),
    user: { id: 2, username: "other" },
  },
  {
    id: 2,
    gameId,
    userId: 42,
    description: "My review",
    star: 5,
    createdAt: new Date().toISOString(),
    user: { id: 42, username: "me" },
  },
];

const mocks = [
  {
    request: { query: GET_REVIEWS_META_FOR_GAME, variables: { gameId } },
    result: {
      data: {
        reviewsMetaForGame: {
          __typename: "ReviewsMeta",
          averageStar: 4.5,
          totalReviews: 2,
        },
      },
    },
  },
  {
    request: {
      query: GET_REVIEWS_FOR_GAME,
      variables: { gameId, take: TAKE, skip: 0 },
    },
    result: {
      data: {
        reviewsForGame: initialReviews.map((r) => ({
          __typename: "Review",
          ...r,
          user: { __typename: "User", ...r.user },
        })),
      },
    },
  },
];

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
    // first item should be the current user's review
    expect(items[0].textContent).toContain("My review");
    expect(items[1].textContent).toContain("Other review");
  });
});
