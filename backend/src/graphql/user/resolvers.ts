import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../db.js";

interface CreateUserArgs {
  auth0Id: string;
  username: string;
  givenName: string;
  familyName: string;
  email: string;
}

export const userResolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany({
        include: { reviews: true },
      });
    },
    userByAuth0Id: async (_: unknown, { auth0Id }: { auth0Id: string }) => {
      return prisma.user.findUnique({
        where: { auth0Id },
      });
    },
  },
  Mutation: {
    createUser: async (_parent: unknown, args: CreateUserArgs) => {
      try {
        return await prisma.user.create({
          data: {
            auth0Id: args.auth0Id,
            username: args.username,
            givenName: args.givenName,
            familyName: args.familyName,
            email: args.email,
          },
        });
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new Error(
            `This username is already in use. Please choose another.`,
          );
        }
        throw error;
      }
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
