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

export const GET_TOTAL_GAMES_COUNT = gql`
  query GetTotalGamesCount($filter: GameFilter, $search: String) {
    gamesCount(filter: $filter, search: $search)
  }
`;

export const GET_FILTERED_GAMES = gql`
  query GetFilteredGames(
    $filter: GameFilter
    $search: String
    $take: Int = 9
    $after: Int
    $sortBy: String
    $sortOrder: SortOrder
  ) {
    games(
      filter: $filter
      search: $search
      take: $take
      after: $after
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      id
      name
      image
      descriptionShort
      publishedStore
      platforms
      developers
      publishers
      genres
      tags
      categories

      avgRating
      reviewsCount
      favoritesCount
      popularityScore
      hasRatings
    }
  }
`;

export const GET_AVAILABLE_FILTER_OPTIONS = gql`
  query GetAvailableFilterOptions(
    $currentFilter: GameFilter!
    $search: String
  ) {
    availableFilterOptions(filter: $currentFilter, search: $search) {
      genres
      categories
      platforms
      publishers
      tags
    }
  }
`;
