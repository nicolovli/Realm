import { GET_REVIEWS_FOR_GAME, GET_REVIEWS_META_FOR_GAME } from "@/lib/graphql";

export const gameId = 1;
export const FIRST = 10;

export const initialReviews = [
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

export const mocks = [
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
