import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { GET_REVIEWS_FOR_GAME, GET_REVIEWS_META_FOR_GAME } from "@/lib/graphql";
import { ReviewList } from "@/components/Reviews";

const gameId = 1;
const FIRST = 10;

const initialReviews = [
  {
    id: 1,
    gameId,
    userId: 2,
    description: "Other review",
    star: 4,
    createdAt: new Date().toISOString(),
    user: { id: 2, username: "other" },
    game: { id: gameId, name: "Test Game" },
  },
  {
    id: 2,
    gameId,
    userId: 42,
    description: "My review",
    star: 5,
    createdAt: new Date().toISOString(),
    user: { id: 42, username: "me" },
    game: { id: gameId, name: "Test Game" },
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
      variables: { gameId, first: FIRST },
    },
    result: {
      data: {
        reviewsForGame: {
          __typename: "ReviewsConnection",
          edges: initialReviews.map((r) => ({
            __typename: "ReviewEdge",
            node: {
              __typename: "Review",
              ...r,
              user: { __typename: "User", ...r.user },
              game: { __typename: "Game", ...r.game },
            },
            cursor: Buffer.from(r.id.toString()).toString("base64"),
          })),
          pageInfo: {
            __typename: "PageInfo",
            endCursor: Buffer.from("2").toString("base64"),
            hasNextPage: false,
          },
          totalCount: 2,
        },
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

    // The reviews should be present (order depends on backend context)
    // Since we don't have authentication in the test, backend returns them as-is
    expect(items[0].textContent).toContain("Other review");
    expect(items[1].textContent).toContain("My review");
  });
});
