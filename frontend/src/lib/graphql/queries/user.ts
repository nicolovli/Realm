import { gql } from "@apollo/client";

export const GET_USER_BY_AUTH0_ID = gql`
  query GetUserByAuth0Id($auth0Id: String!) {
    userByAuth0Id(auth0Id: $auth0Id) {
      id
      username
      givenName
      familyName
      email
    }
  }
`;
