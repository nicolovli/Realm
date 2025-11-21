import { gql } from "@apollo/client";

export const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      id
      sid
      name
      descriptionShort
      descriptionText
      image
      publishedStore
      platforms
      developers
      publishers
      languages
      categories
      genres
      tags

      avgRating
      reviewsCount
      favoritesCount
      popularityScore
      hasRatings
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
