export const CREATE_USER = `
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

export const LOGIN_USER = `
  mutation LoginUser($username: String!, $password: String!){
    loginUser(username: $username, password: $password){
      token
      user{
        id
        username
        email
      }
    }
  }
`;

export const UPDATE_USER = `
  mutation UpdateUser(
    $username: String
    $email: String
    $password: String
  ) {
    updateUser(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;
