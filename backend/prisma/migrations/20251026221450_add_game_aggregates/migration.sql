-- CreateIndex
CREATE INDEX "idx_game_popularity" ON "Game"("popularityScore");

-- CreateIndex
CREATE INDEX "idx_game_avg_rating" ON "Game"("avgRating");

-- CreateIndex
CREATE INDEX "idx_game_published" ON "Game"("publishedStore");
