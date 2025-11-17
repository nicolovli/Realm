import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedUser = {
  id: number;
  username: string;
  email: string;
  password: string;
};

type SeedReview = {
  userId: number; // (Starts with id 20 in users.json)
  gameId: number;
  star: number;
  description: string;
};

async function main() {
  const usersPath = path.resolve(process.cwd(), "db/users.json");
  const reviewsPath = path.resolve(process.cwd(), "db/reviews.json");

  if (!fs.existsSync(usersPath)) {
    throw new Error(`users.json not found at ${usersPath}`);
  }
  if (!fs.existsSync(reviewsPath)) {
    throw new Error(`reviews.json not found at ${reviewsPath}`);
  }

  const usersData: SeedUser[] = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  const reviewsData: SeedReview[] = JSON.parse(
    fs.readFileSync(reviewsPath, "utf-8"),
  );

  console.log(`Seeding ${usersData.length} users...`);

  // map from "seed-id" -> actual db-id
  const seedIdToDbId = new Map<number, number>();

  for (const u of usersData) {
    const hashed = await bcrypt.hash("123456", 10);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        username: u.username,
        password: hashed,
      },
      create: {
        username: u.username,
        email: u.email,
        password: hashed,
      },
    });

    seedIdToDbId.set(u.id, user.id);
  }

  console.log(`Finished users. Seeding reviews...`);

  // Check which gameIds from reviews actually exist in the DB
  const uniqueGameIds = Array.from(new Set(reviewsData.map((r) => r.gameId)));

  const existingGames = await prisma.game.findMany({
    where: { id: { in: uniqueGameIds } },
    select: { id: true },
  });

  const validGameIds = new Set(existingGames.map((g) => g.id));

  console.log(
    `Found ${existingGames.length} matching games for ${uniqueGameIds.length} gameIds in reviews.json.`,
  );

  // Gather which games should become favorites per user
  // all games where the user has given 4 or 5 stars
  const favoritesByUser = new Map<number, Set<number>>();

  for (const r of reviewsData) {
    const dbUserId = seedIdToDbId.get(r.userId);
    const gameId = r.gameId;

    if (!dbUserId || !validGameIds.has(gameId)) {
      continue;
    }

    await prisma.review.upsert({
      where: {
        userId_gameId: {
          userId: dbUserId,
          gameId,
        },
      },
      update: {
        description: r.description,
        star: r.star,
      },
      create: {
        description: r.description,
        star: r.star,
        user: { connect: { id: dbUserId } },
        game: { connect: { id: gameId } },
      },
    });

    // Favorite rule: all games with 4 or 5 stars
    if (r.star >= 4) {
      let set = favoritesByUser.get(dbUserId);
      if (!set) {
        set = new Set<number>();
        favoritesByUser.set(dbUserId, set);
      }
      set.add(gameId);
    }
  }

  console.log(
    `Seeding favorites for ${favoritesByUser.size} users (based on high-star reviews)...`,
  );

  // Save favorites in many-to-many User.favorites
  for (const [dbUserId, favSet] of favoritesByUser.entries()) {
    const gameIds = Array.from(favSet);
    if (!gameIds.length) continue;

    await prisma.user.update({
      where: { id: dbUserId },
      data: {
        favorites: {
          // connect is idempotent – safe to run multiple times
          connect: gameIds.map((gameId) => ({ id: gameId })),
        },
      },
    });
  }

  console.log("Recomputing aggregates for ALL games...");

  const allGames = await prisma.game.findMany({
    select: { id: true },
  });

  for (const g of allGames) {
    const gameId = g.id;

    const [reviewCount, avgAgg, favCount] = await Promise.all([
      prisma.review.count({ where: { gameId } }),
      prisma.review.aggregate({
        where: { gameId },
        _avg: { star: true },
      }),
      prisma.user.count({
        where: { favorites: { some: { id: gameId } } },
      }),
    ]);

    const avg = avgAgg._avg.star ?? 0;
    const hasRatings = reviewCount > 0;
    const popularityScore = favCount * 2 + reviewCount;

    await prisma.game.update({
      where: { id: gameId },
      data: {
        reviewsCount: reviewCount,
        avgRating: hasRatings ? avg : null,
        hasRatings,
        favoritesCount: favCount,
        popularityScore,
      },
    });
  }

  console.log("Seeding done.");
}

main()
  .catch((e) => {
    console.error("Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
