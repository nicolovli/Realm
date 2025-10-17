export const CREATE_USER = `
  mutation CreateUser($auth0Id: String!, $username: String!, $givenName: String!, $familyName: String!, $email: String!) {
    createUser(auth0Id: $auth0Id, username: $username, givenName: $givenName, familyName: $familyName, email: $email) {
      id
      username
      givenName
      familyName
      email
    }
  }
`;
