import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { baseTypeDefs } from "./baseTypeDefs.js";

import { gameTypeDefs, gameResolvers } from "./game/index.js";
import { userTypeDefs, userResolvers } from "./user/index.js";
import { reviewTypeDefs, reviewResolvers } from "./review/index.js";
import { filterTypeDefs, filterResolvers } from "./filter/index.js";

export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  gameTypeDefs,
  userTypeDefs,
  reviewTypeDefs,
  filterTypeDefs,
]);

export const resolvers = mergeResolvers([
  gameResolvers,
  userResolvers,
  reviewResolvers,
  filterResolvers,
]);
