import { gql } from "@apollo/client";

export const GET_FEATURED_GAMES = gql`
  query GetFeaturedGames($take: Int, $filter: GameFilter) {
    games(take: $take, filter: $filter) {
      id
      name
      image
    }
  }
`;
