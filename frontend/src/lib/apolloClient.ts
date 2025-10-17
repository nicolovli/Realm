import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || "http://localhost:3001/graphql";

export const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URL, credentials: "include" }),
  cache: new InMemoryCache(),
});
