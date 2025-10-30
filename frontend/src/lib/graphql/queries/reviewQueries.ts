import { gql } from "@apollo/client";

export const GET_REVIEWS_FOR_GAME = gql`
  query GetReviewsForGame($gameId: Int!, $take: Int, $skip: Int) {
    reviewsForGame(gameId: $gameId, take: $take, skip: $skip) {
      id
      description
      star
      createdAt
      user {
        id
        username
      }
      game {
        id
        name
      }
    }
  }
`;

export const GET_REVIEWS_META_FOR_GAME = gql`
  query GetReviewsMetaForGame($gameId: Int!) {
    reviewsMetaForGame(gameId: $gameId) {
      averageStar
      totalReviews
    }
  }
`;
