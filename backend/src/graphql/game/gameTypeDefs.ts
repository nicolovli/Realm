import { gql } from "graphql-tag";

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

    avgRating: Float
    reviewsCount: Int!
    favoritesCount: Int!
    popularityScore: Int!
    hasRatings: Boolean!
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

  enum SortOrder {
    asc
    desc
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type GameEdge {
    cursor: String!
    node: Game!
  }

  type GamesConnection {
    edges: [GameEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  extend type Query {
    games(
      filter: GameFilter
      search: String
      after: Int
      take: Int = 9
      ids: [Int!]
      sortBy: String
      sortOrder: SortOrder
    ): [Game!]!

    game(id: ID!): Game
    gamesCount(filter: GameFilter, search: String): Int!
    searchGames(query: String!, limit: Int = 6): [Game!]!

    gamesConnection(
      filter: GameFilter
      search: String
      first: Int = 9
      after: String
      last: Int
      before: String
      sortBy: String
      sortOrder: SortOrder
      offset: Int
    ): GamesConnection!
  }
`;
