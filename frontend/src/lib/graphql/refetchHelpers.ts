import {
  GET_REVIEWS_FOR_GAME,
  GET_REVIEWS_META_FOR_GAME,
  GET_USER_REVIEWS,
  GET_FILTERED_GAMES,
  GET_GAME,
  GET_USER,
  GET_USER_WITH_FAV,
} from "@/lib/graphql";
import type { RefetchConfig, FilterVariables } from "@/types/GraphQLTypes";

// Login mutation - needs to update user data
export const getLoginRefetchQueries = (): RefetchConfig[] => [
  { query: GET_USER },
  { query: GET_USER_WITH_FAV },
];

// Toggle favorite - needs to update user favorites and game sorting
export const getToggleFavoriteRefetchQueries = (
  filterVariables?: FilterVariables,
): RefetchConfig[] => {
  const base: RefetchConfig[] = [{ query: GET_USER_WITH_FAV }];
  if (filterVariables) {
    base.push({ query: GET_FILTERED_GAMES, variables: filterVariables });
  }
  return base;
};

// Create/update/delete review - needs to update reviews list, meta, and game sorting
export const getReviewRefetchQueries = (
  gameId: number,
  filterVariables?: FilterVariables,
): RefetchConfig[] => {
  const entries: RefetchConfig[] = [
    { query: GET_REVIEWS_FOR_GAME, variables: { gameId, first: 10 } },
    { query: GET_REVIEWS_FOR_GAME, variables: { gameId, first: 100 } },
    { query: GET_REVIEWS_META_FOR_GAME, variables: { gameId } },
    { query: GET_GAME, variables: { id: gameId.toString() } },
  ];

  if (filterVariables) {
    entries.push({ query: GET_FILTERED_GAMES, variables: filterVariables });
  }

  return entries;
};

// User context reviews (when viewing own reviews on user page)
export const getUserReviewsRefetchQueries = (
  userId: string,
): RefetchConfig[] => [
  { query: GET_USER_REVIEWS, variables: { userId, first: 10 } },
];
