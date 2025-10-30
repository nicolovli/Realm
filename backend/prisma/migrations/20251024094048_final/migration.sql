/*
  Warnings:

  - You are about to drop the `_UserFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_UserFavorites" DROP CONSTRAINT "_UserFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserFavorites" DROP CONSTRAINT "_UserFavorites_B_fkey";

-- DropTable
DROP TABLE "public"."_UserFavorites";

-- CreateTable
CREATE TABLE "_Favorites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Favorites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Favorites_B_index" ON "_Favorites"("B");

-- AddForeignKey
ALTER TABLE "_Favorites" ADD CONSTRAINT "_Favorites_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Favorites" ADD CONSTRAINT "_Favorites_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
