import { gql } from "@apollo/client";

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($gameId: Int!, $liked: Boolean!) {
    toggleFavorite(gameId: $gameId, liked: $liked) {
      id
      favorites {
        id
        name
      }
    }
  }
`;
