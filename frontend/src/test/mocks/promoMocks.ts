import type { MockLink } from "@apollo/client/testing";
import { GET_PROMO_GAMES, GET_REVIEWS_META_FOR_GAME } from "@/lib/graphql";

export type GameSummary = {
  id: string; // Graph data returns ids as strings in tests
  name: string;
  descriptionShort: string;
  image: string;
};

export const defaultGamesData: GameSummary[] = [
  { id: "1", name: "Game 1", descriptionShort: "Desc 1", image: "img1" },
  { id: "2", name: "Game 2", descriptionShort: "Desc 2", image: "img2" },
  { id: "3", name: "Game 3", descriptionShort: "Desc 3", image: "img3" },
];

export function buildPromoGamesMock(
  games: GameSummary[],
): MockLink.MockedResponse {
  return {
    request: {
      query: GET_PROMO_GAMES,
      variables: { ids: [14610, 44235, 7988] },
    },
    result: { data: { games } },
  };
}

export function buildReviewMetaMocksForGames(
  games: GameSummary[],
  repeat: number = 3,
): MockLink.MockedResponse[] {
  return games.flatMap((game) =>
    Array.from({ length: repeat }, () => ({
      request: {
        query: GET_REVIEWS_META_FOR_GAME,
        variables: { gameId: Number(game.id) },
      },
      result: {
        data: {
          reviewsMetaForGame: {
            averageStar: 4 + Number(game.id) * 0.2,
            totalReviews: Number(game.id) * 5,
            __typename: "ReviewsMeta",
          },
        },
      },
    })),
  );
}

export function buildPromoCarouselMocks(
  games: GameSummary[] = defaultGamesData,
  repeat: number = 3,
): MockLink.MockedResponse[] {
  return [
    buildPromoGamesMock(games),
    ...buildReviewMetaMocksForGames(games, repeat),
  ];
}

export function buildEmptyPromoMocks(): MockLink.MockedResponse[] {
  return [buildPromoGamesMock([])];
}

export function buildIncompletePromoMocks(): MockLink.MockedResponse[] {
  const incomplete = [
    { id: "1", name: "Game 1", descriptionShort: "Desc 1", image: "" },
  ];
  return [
    buildPromoGamesMock(incomplete),
    ...buildReviewMetaMocksForGames(incomplete, 1),
  ];
}
