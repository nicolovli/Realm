import { gql } from "graphql-tag";

export const reviewTypeDefs = gql`
  type Review {
    id: ID!
    description: String!
    star: Int!
    user: User!
    game: Game!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    reviewsForGame(gameId: Int!, take: Int, skip: Int): [Review!]!
    reviewsMetaForGame(gameId: Int!): ReviewMeta!
  }

  extend type Mutation {
    createReview(gameId: Int!, star: Int!, description: String!): Review!
    updateReview(id: Int!, star: Int, description: String): Review!
    deleteReview(id: Int!): Boolean!
  }

  type ReviewMeta {
    averageStar: Float!
    totalReviews: Int!
  }
`;
