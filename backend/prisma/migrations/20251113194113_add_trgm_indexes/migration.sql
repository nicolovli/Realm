-- CreateIndex
CREATE INDEX "idx_game_name_trgm" ON "Game" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_publisher_name_trgm" ON "Publisher" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_tag_name_trgm" ON "Tag" USING GIN ("name" gin_trgm_ops);
