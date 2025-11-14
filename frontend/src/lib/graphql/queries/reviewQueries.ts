import { gql } from "@apollo/client";

export const GET_REVIEWS_FOR_GAME = gql`
  query GetReviewsForGame($gameId: Int!, $first: Int, $after: String) {
    reviewsForGame(gameId: $gameId, first: $first, after: $after) {
      edges {
        node {
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
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
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

export const GET_USER_REVIEWS = gql`
  query GetUserReviews($userId: ID!, $first: Int, $after: String) {
    userReviews(userId: $userId, first: $first, after: $after) {
      edges {
        node {
          id
          star
          description
          createdAt
          updatedAt
          user {
            id
            username
          }
          game {
            id
            name
            image
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;
