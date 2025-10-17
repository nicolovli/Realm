import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { gameTypeDefs } from "./game/typeDefs.js";
import { userTypeDefs } from "./user/typeDefs.js";
import { reviewTypeDefs } from "./review/typeDefs.js";
import { filterTypeDefs } from "./filter/typeDefs.js";
import { gameResolvers } from "./game/resolvers.js";
import { userResolvers } from "./user/resolvers.js";
import { reviewResolvers } from "./review/resolvers.js";
import { filterResolvers } from "./filter/resolvers.js";
import { baseTypeDefs } from "./baseTypeDefs.js";

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
