import { gql } from "graphql-tag";

export const filterTypeDefs = gql`
  type Genre {
    id: ID!
    name: String!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Platform {
    id: ID!
    name: String!
  }

  type Publisher {
    id: ID!
    name: String!
  }

  type Tag {
    id: ID!
    name: String!
  }

  type FilterOptions {
    genres: [Genre!]!
    categories: [Category!]!
    platforms: [Platform!]!
    publishers: [Publisher!]!
    tags: [Tag!]!
  }

  type AvailableFilterOptions {
    genres: [String!]!
    categories: [String!]!
    platforms: [String!]!
    publishers: [String!]!
    tags: [String!]!
  }

  extend type Query {
    filterOptions: FilterOptions!
    availableFilterOptions(
      filter: GameFilter!
      search: String
    ): AvailableFilterOptions!
  }
`;
