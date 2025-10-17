import { gql } from "apollo-server";

export const reviewTypeDefs = gql`
  type Review {
    id: ID!
    description: String!
    star: Int!
    user: User!
  }

  extend type Query {
    reviews: [Review!]!
  }

  extend type Mutation {
    createReview(userId: Int!, description: String!, star: Int!): Review!
  }
`;
