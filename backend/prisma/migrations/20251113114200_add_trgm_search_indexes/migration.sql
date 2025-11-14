-- Enable trigram-based pattern matching support (required for gin_trgm_ops)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Accelerate case-insensitive contains/pattern search on game names
CREATE INDEX IF NOT EXISTS "idx_game_name_trgm"
  ON "Game" USING gin ("name" gin_trgm_ops);

-- Accelerate publisher name lookups used in search/filter boosting
CREATE INDEX IF NOT EXISTS "idx_publisher_name_trgm"
  ON "Publisher" USING gin ("name" gin_trgm_ops);

-- Accelerate tag name lookups used in search/filter boosting
CREATE INDEX IF NOT EXISTS "idx_tag_name_trgm"
  ON "Tag" USING gin ("name" gin_trgm_ops);
