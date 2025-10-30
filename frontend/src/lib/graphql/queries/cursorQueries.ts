import { gql } from "@apollo/client";

export const GAME_LIST_CARD_FRAGMENT = gql`
  fragment GameListCard on Game {
    id
    name
    image
    descriptionShort
    publishedStore
  }
`;

export const GET_FILTERED_GAMES_CURSOR = gql`
  query GetFilteredGamesCursor(
    $filter: GameFilter
    $search: String
    $sortBy: String
    $sortOrder: SortOrder # <-- enum, not String
    $first: Int!
    $after: String
  ) {
    gamesConnection(
      filter: $filter
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
      first: $first
      after: $after
    ) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ...GameListCard
        }
      }
    }
  }
  ${GAME_LIST_CARD_FRAGMENT}
`;
