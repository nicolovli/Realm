import { prisma } from "../../db.js";

export const reviewResolvers = {
  Query: {
    reviews: async () => {
      return prisma.review.findMany({
        include: { user: true },
      });
    },
  },
  Mutation: {
    createReview: async (
      _parent: unknown,
      args: { userId: number; description: string; star: number },
    ) => {
      return prisma.review.create({
        data: {
          description: args.description,
          star: args.star,
          user: { connect: { id: args.userId } },
        },
        include: { user: true },
      });
    },
  },
  Review: {
    user: (parent: { userId: number }) => {
      return prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },
};
