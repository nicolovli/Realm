/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."idx_gamecategories_a";

-- DropIndex
DROP INDEX "public"."idx_gamedevelopers_a";

-- DropIndex
DROP INDEX "public"."idx_gamegenres_a";

-- DropIndex
DROP INDEX "public"."idx_gamelanguages_a";

-- DropIndex
DROP INDEX "public"."idx_gameplatforms_a";

-- DropIndex
DROP INDEX "public"."idx_gamepublishers_a";

-- DropIndex
DROP INDEX "public"."idx_gametags_a";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gameId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_gameId_key" ON "Review"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
