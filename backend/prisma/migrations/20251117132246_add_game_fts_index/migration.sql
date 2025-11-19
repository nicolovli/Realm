-- Add FTS GIN index for Game search
CREATE INDEX IF NOT EXISTS idx_game_fts
ON "Game"
USING GIN (
  to_tsvector(
    'simple',
    coalesce("name", '') || ' ' || coalesce("descriptionText", '')
  )
);
