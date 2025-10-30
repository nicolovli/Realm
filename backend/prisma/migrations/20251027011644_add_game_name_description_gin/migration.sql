-- index on name + descriptionText (english)
CREATE INDEX IF NOT EXISTS idx_game_name_description_gin
ON "Game" USING gin (to_tsvector('english', coalesce("name", '') || ' ' || coalesce("descriptionText", '')));