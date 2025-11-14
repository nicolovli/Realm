-- Additional trigram indexes on lower-case expressions to match Prisma's case-insensitive queries
CREATE INDEX IF NOT EXISTS "idx_game_name_lower_trgm"
  ON "Game" USING gin ((lower("name")) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "idx_publisher_name_lower_trgm"
  ON "Publisher" USING gin ((lower("name")) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "idx_tag_name_lower_trgm"
  ON "Tag" USING gin ((lower("name")) gin_trgm_ops);
