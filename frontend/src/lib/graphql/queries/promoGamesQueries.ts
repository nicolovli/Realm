import { gql } from "@apollo/client";

// Query to get games by id in the database to display on PromoCard
export const GET_PROMO_GAMES = gql`
  query GetPromoGames($ids: [Int!]) {
    games(ids: $ids) {
      id
      name
      descriptionShort
      image
    }
  }
`;
