-- Postgres full-text search index for Game

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE INDEX IF NOT EXISTS "idx_game_fts"
ON "Game"
USING GIN (
  to_tsvector(
    'simple',
    coalesce("name", '') || ' ' || coalesce("descriptionText", '')
  )
);
