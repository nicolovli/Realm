import { gql } from "@apollo/client";

export const GET_GAMES = gql`
  query GetGames($filter: GameFilter, $search: String, $after: ID, $take: Int) {
    games(filter: $filter, search: $search, after: $after, take: $take) {
      id
      sid
      name
      descriptionShort
      image
      publishedStore
      platforms
      developers
      publishers
      languages
      categories
      genres
      tags
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      id
      sid
      name
      descriptionShort
      image
      publishedStore
      platforms
      developers
      publishers
      languages
      categories
      genres
      tags
    }
  }
`;

export const SEARCH_GAMES = gql`
  query SearchGames($query: String!, $limit: Int = 6) {
    searchGames(query: $query, limit: $limit) {
      id
      sid
      name
      image
      publishers
    }
  }
`;
