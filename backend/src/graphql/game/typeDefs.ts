import { gql } from "apollo-server";

export const gameTypeDefs = gql`
  type Game {
    id: ID!
    sid: Int!
    name: String!
    descriptionShort: String
    image: String
    publishedStore: String
    platforms: [String!]!
    developers: [String!]!
    publishers: [String!]!
    languages: [String!]!
    categories: [String!]!
    genres: [String!]!
    tags: [String!]!
  }

  input GameFilter {
    tags: [String!]
    languages: [String!]
    categories: [String!]
    genres: [String!]
    platforms: [String!]
    publishers: [String!]
    developers: [String!]
  }

  extend type Query {
    games(
      filter: GameFilter
      search: String
      after: Int
      take: Int = 9
      ids: [Int!]
      sortBy: String
    ): [Game!]!
    game(id: ID!): Game
    gamesCount(filter: GameFilter, search: String): Int!
    searchGames(query: String!, limit: Int = 6): [Game!]!
  }
`;
