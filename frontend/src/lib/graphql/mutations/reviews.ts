import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview($gameId: Int!, $star: Int!, $description: String!) {
    createReview(gameId: $gameId, star: $star, description: $description) {
      id
      star
      description
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

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: Int!, $star: Int, $description: String) {
    updateReview(id: $id, star: $star, description: $description) {
      id
      star
      description
      updatedAt
      user {
        id
        username
      }
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: Int!) {
    deleteReview(id: $id)
  }
`;
