import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    reviews: [Review!]!
    favorites: [Game!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    users: [User!]!
    me: User
    userFavorites(userId: ID!): [Game!]!
  }

  extend type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    loginUser(username: String!, password: String!): AuthPayload!
    toggleFavorite(gameId: Int!, liked: Boolean!): User!
    updateUser(username: String, email: String, password: String): User!
  }
`;
