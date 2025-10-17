import { gql } from "apollo-server";

export const userTypeDefs = gql`
  type User {
    id: ID!
    auth0Id: String!
    username: String!
    givenName: String!
    familyName: String!
    email: String!
    reviews: [Review!]!
  }

  extend type Query {
    users: [User!]!
    userByAuth0Id(auth0Id: String!): User
  }

  extend type Mutation {
    createUser(
      auth0Id: String!
      username: String!
      givenName: String!
      familyName: String!
      email: String!
    ): User!
  }
`;
