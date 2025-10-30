import { prisma } from "../../db.js";
import {
  generateToken,
  handlePrismaUniqueError,
  hashPassword,
  verifyPassword,
} from "./userHelpers.js";
import { CreateUserArgs, LoginArgs, AuthPayload } from "./userTypes.js";

export const userResolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
    me: async (
      _parent: unknown,
      _args: unknown,
      context: { userId?: number },
    ) => {
      if (!context.userId) return null;
      return prisma.user.findUnique({
        where: { id: context.userId },
        include: { favorites: true },
      });
    },
  },
  Mutation: {
    createUser: async (_: unknown, args: CreateUserArgs) => {
      const handleUsername = args.username.toLowerCase();
      const handleEmail = args.email.toLowerCase();
      try {
        const hashedPassword = await hashPassword(args.password);
        return await prisma.user.create({
          data: {
            username: handleUsername,
            email: handleEmail,
            password: hashedPassword,
          },
        });
      } catch (error) {
        await handlePrismaUniqueError(error, handleUsername, handleEmail);
      }
    },
    loginUser: async (
      _: unknown,
      { username, password }: LoginArgs,
    ): Promise<AuthPayload> => {
      const loginUsername = username.toLowerCase();
      const user = await prisma.user.findUnique({
        where: { username: loginUsername },
      });
      if (!user)
        throw new Error("Hmm… we can’t seem to find a player by that name.");

      const valid = await verifyPassword(password, user.password!);
      if (!valid)
        throw new Error("Oops! That password doesn’t unlock this treasure.");

      const token = generateToken(user.id, user.username);
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      };
    },
    toggleFavorite: async (
      _: unknown,
      { gameId, liked }: { gameId: number; liked: boolean },
      context: { userId?: number },
    ) => {
      const { userId } = context;
      if (!userId) throw new Error("You must be logged in to favorite games!");

      // Use transaction to update user favorites and recompute counts
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
          where: { id: userId },
          data: {
            favorites: {
              [liked ? "connect" : "disconnect"]: { id: Number(gameId) },
            },
          },
          include: { favorites: true },
        });

        const favCount = await tx.user.count({
          where: { favorites: { some: { id: Number(gameId) } } },
        });

        const reviewCount = await tx.review.count({
          where: { gameId: Number(gameId) },
        });
        const avgAgg = await tx.review.aggregate({
          where: { gameId: Number(gameId) },
          _avg: { star: true },
        });
        const avg = avgAgg._avg.star ?? 0;
        const hasRatings = reviewCount > 0;
        const popularityScore = favCount * 2 + reviewCount;

        await tx.game.update({
          where: { id: Number(gameId) },
          data: {
            favoritesCount: favCount,
            reviewsCount: reviewCount,
            avgRating: hasRatings ? avg : null,
            hasRatings,
            popularityScore,
          },
        });

        return user;
      });

      return result;
    },
  },
  User: {
    reviews: (parent: { id: number }) => {
      return prisma.review.findMany({
        where: { userId: parent.id },
      });
    },
  },
};
