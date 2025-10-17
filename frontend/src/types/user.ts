export interface UserByAuth0IdData {
  userByAuth0Id: {
    id: string;
    auth0Id: string;
    username: string;
    givenName: string;
    familyName: string;
    email: string;
  } | null;
}

export interface UserByAuth0IdVars {
  auth0Id: string;
}
