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
    reviewsForGame(gameId: Int!, first: Int, after: String): ReviewConnection!
    reviewsMetaForGame(gameId: Int!): ReviewMeta!
    userReviews(userId: ID!, first: Int, after: String): ReviewConnection!
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

  type ReviewEdge {
    node: Review!
    cursor: String!
  }

  type ReviewConnection {
    edges: [ReviewEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }
`;
