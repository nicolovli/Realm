import { gql } from "@apollo/client";

export const GET_FILTER_OPTIONS = gql`
  query GetFilterOptions {
    filterOptions {
      genres {
        id
        name
      }
      categories {
        id
        name
      }
      platforms {
        id
        name
      }
      publishers {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;

export const GET_AVAILABLE_FILTER_OPTIONS = gql`
  query GetAvailableFilterOptions($filter: GameFilter!, $search: String) {
    availableFilterOptions(filter: $filter, search: $search) {
      genres
      categories
      platforms
      publishers
      tags
    }
  }
`;

export const GET_TOTAL_GAMES_COUNT = gql`
  query GetTotalGamesCount($filter: GameFilter, $search: String) {
    gamesCount(filter: $filter, search: $search)
  }
`;

export const GAME_LIST_CARD_FRAGMENT = gql`
  fragment GameListCard on Game {
    id
    name
    image
    descriptionShort
    publishedStore
  }
`;

export const GET_FILTERED_GAMES = gql`
  query GetFilteredGames(
    $filter: GameFilter
    $search: String
    $sortBy: String
    $sortOrder: SortOrder
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
