import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL;

// Attaches Authorization header if a token exists
const authLink = new SetContextLink((prevContext) => {
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

  return {
    headers: {
      ...prevContext.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Plain HTTP transport (no batching)
const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
  // credentials: "include", // uncomment if cookies needed
});

// Cache with custom merge policies for paginated fields
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        gamesConnection: {
          keyArgs: [
            "filter",
            "search",
            "sortBy",
            "sortOrder",
            "first",
            "after",
          ],
          merge(_existing, incoming) {
            return incoming;
          },
        },
        reviewsForGame: {
          keyArgs: ["gameId", "first"],
          merge(existing, incoming) {
            if (!existing) return incoming;
            return {
              ...incoming,
              edges: [...(existing.edges || []), ...(incoming.edges || [])],
            };
          },
        },
        userReviews: {
          keyArgs: ["userId", "first"],
          merge(existing, incoming) {
            if (!existing) return incoming;
            return {
              ...incoming,
              edges: [...(existing.edges || []), ...(incoming.edges || [])],
            };
          },
        },
      },
    },
    Game: {
      keyFields: ["id"],
    },
  },
});

// Compose links (auth BEFORE transport)
const link = ApolloLink.from([authLink, httpLink]);

export const client = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
      returnPartialData: true,
    },
    query: {
      fetchPolicy: "cache-first",
    },
  },
  // queryDeduplication is true by default
});
