import { gql } from "@apollo/client";

export const GET_FEATURED_GAMES = gql`
  query GetFeaturedGames($take: Int, $sortBy: String, $sortOrder: SortOrder) {
    games(take: $take, sortBy: $sortBy, sortOrder: $sortOrder) {
      id
      name
      image
    }
  }
`;
