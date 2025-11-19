import { prisma } from "../../db.js";
import { TOP_PUBLISHERS } from "../../constants/topPublishers.js";

export const filterResolvers = {
  Query: {
    // Get all available filter options (for initial dropdown population)
    filterOptions: async () => {
      const [genres, categories, platforms, tags] = await Promise.all([
        prisma.genre.findMany({ orderBy: { name: "asc" } }),
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.platform.findMany({ orderBy: { name: "asc" } }),
        prisma.tag.findMany({ orderBy: { name: "asc" } }),
      ]);

      // Get only curated top publishers
      const publishers = await prisma.publisher.findMany({
        where: { name: { in: TOP_PUBLISHERS } },
        orderBy: { name: "asc" },
      });

      return { genres, categories, platforms, publishers, tags };
    },
  },
};
