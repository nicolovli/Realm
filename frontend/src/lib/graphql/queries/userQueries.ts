import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    me {
      id
      username
      email
    }
  }
`;

export const GET_USER_WITH_FAV = gql`
  query GetUser {
    me {
      id
      username
      email
      favorites {
        id
        sid
        name
        image
        descriptionShort
      }
    }
  }
`;
