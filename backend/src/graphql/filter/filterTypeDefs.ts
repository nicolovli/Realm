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

  extend type Query {
    filterOptions: FilterOptions!
  }
`;
