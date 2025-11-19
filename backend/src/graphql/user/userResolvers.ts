import { prisma } from "../../db.js";
import {
  generateToken,
  handlePrismaUniqueError,
  hashPassword,
  verifyPassword,
  CreateUserArgs,
  LoginArgs,
  AuthPayload,
  UpdateUserArgs,
} from "./index.js";
import { clearGamesCache } from "../game/index.js";

export const userResolvers = {
  Query: {
    users: async () => {
      // minimal projection
      return prisma.user.findMany({
        select: { id: true, username: true, email: true },
      });
    },
    me: async (
      _parent: unknown,
      _args: unknown,
      context: { userId?: number },
    ) => {
      if (!context.userId) return null;
      return prisma.user.findUnique({
        where: { id: context.userId },
        select: {
          id: true,
          username: true,
          email: true,
          favorites: {
            select: {
              id: true,
              sid: true,
              name: true,
              image: true,
              descriptionShort: true,
            },
          },
        },
      });
    },
    userFavorites: async (_p: unknown, { userId }: { userId: number }) => {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
          favorites: {
            select: {
              id: true,
              name: true,
              image: true,
              descriptionShort: true,
              publishedStore: true,
            },
          },
        },
      });
      return user?.favorites ?? [];
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

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
          where: { id: userId },
          data: {
            favorites: {
              [liked ? "connect" : "disconnect"]: { id: Number(gameId) },
            },
          },
          select: {
            id: true,
            username: true,
            email: true,
            favorites: {
              select: {
                id: true,
                name: true,
                sid: true,
                image: true,
                descriptionShort: true,
              },
            },
          },
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

      // invalidate game cache so rating/popularity updates are reflected immediately
      clearGamesCache();

      return result;
    },

    updateUser: async (
      _parent: unknown,
      { username, email, password }: UpdateUserArgs,
      context: { userId?: number },
    ) => {
      const { userId } = context;
      if (!userId)
        throw new Error("You must be logged in to update your profile.");

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, email: true },
      });

      if (!existingUser)
        throw new Error("Hmm… we can’t seem to find a player by that name.");

      const updates: {
        username?: string;
        email?: string;
        password?: string;
      } = {};

      if (username !== undefined && username !== null) {
        const normalizedUsername = username.trim().toLowerCase();
        if (!normalizedUsername)
          throw new Error("Username cannot be empty. Time to get creative!");
        if (normalizedUsername.length < 3)
          throw new Error("Username must be at least 3 characters long.");

        if (normalizedUsername !== existingUser.username.toLowerCase()) {
          updates.username = normalizedUsername;
        }
      }

      if (email !== undefined && email !== null) {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail)
          throw new Error("Email cannot be empty. Try another one!");

        if (normalizedEmail !== existingUser.email.toLowerCase()) {
          updates.email = normalizedEmail;
        }
      }

      if (password !== undefined && password !== null) {
        const trimmedPassword = password.trim();
        if (!trimmedPassword)
          throw new Error(
            "Password cannot be empty. Please enter a valid password.",
          );
        if (trimmedPassword.length < 6)
          throw new Error("Password must be at least 6 characters long.");

        updates.password = await hashPassword(trimmedPassword);
      }

      if (!Object.keys(updates).length)
        throw new Error("No changes were provided to update.");

      try {
        return await prisma.user.update({
          where: { id: userId },
          data: updates,
          select: { id: true, username: true, email: true },
        });
      } catch (error) {
        await handlePrismaUniqueError(
          error,
          updates.username ?? existingUser.username.toLowerCase(),
          updates.email ?? existingUser.email.toLowerCase(),
        );
        throw new Error("Unable to update profile. Please try again later.");
      }
    },
  },

  User: {
    reviews: (parent: { id: number }) => {
      return prisma.review.findMany({
        where: { userId: parent.id },
        select: {
          id: true,
          description: true,
          star: true,
          gameId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    },
  },
};
