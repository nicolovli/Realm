-- Add indexes for relation tables and fulltext search (safe: IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_gametags_a ON "_GameTags"("A");
CREATE INDEX IF NOT EXISTS idx_gametags_b ON "_GameTags"("B");
CREATE INDEX IF NOT EXISTS idx_gamepublishers_a ON "_GamePublishers"("A");
CREATE INDEX IF NOT EXISTS idx_gamepublishers_b ON "_GamePublishers"("B");
CREATE INDEX IF NOT EXISTS idx_gamegenres_a ON "_GameGenres"("A");
CREATE INDEX IF NOT EXISTS idx_gamegenres_b ON "_GameGenres"("B");
CREATE INDEX IF NOT EXISTS idx_gamecategories_a ON "_GameCategories"("A");
CREATE INDEX IF NOT EXISTS idx_gamecategories_b ON "_GameCategories"("B");
CREATE INDEX IF NOT EXISTS idx_gameplatforms_a ON "_GamePlatforms"("A");
CREATE INDEX IF NOT EXISTS idx_gameplatforms_b ON "_GamePlatforms"("B");
CREATE INDEX IF NOT EXISTS idx_gamelanguages_a ON "_GameLanguages"("A");
CREATE INDEX IF NOT EXISTS idx_gamelanguages_b ON "_GameLanguages"("B");
CREATE INDEX IF NOT EXISTS idx_gamedevelopers_a ON "_GameDevelopers"("A");
CREATE INDEX IF NOT EXISTS idx_gamedevelopers_b ON "_GameDevelopers"("B");

CREATE INDEX IF NOT EXISTS idx_game_name_gin ON "Game" USING gin (to_tsvector('english', coalesce("name",'')));

CREATE INDEX IF NOT EXISTS idx_tag_name ON "Tag"("name");
CREATE INDEX IF NOT EXISTS idx_genre_name ON "Genre"("name");
CREATE INDEX IF NOT EXISTS idx_category_name ON "Category"("name");
CREATE INDEX IF NOT EXISTS idx_platform_name ON "Platform"("name");
CREATE INDEX IF NOT EXISTS idx_publisher_name ON "Publisher"("name");
CREATE INDEX IF NOT EXISTS idx_language_name ON "Language"("name");
CREATE INDEX IF NOT EXISTS idx_developer_name ON "Developer"("name");