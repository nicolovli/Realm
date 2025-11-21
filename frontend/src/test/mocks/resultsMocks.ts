import type { Game } from "@/types";

export const makeGame = (overrides: Partial<Game> = {}): Game => ({
  id: "id-" + Math.random().toString(36).slice(2),
  sid: 1,
  name: "Test Game",
  image: "https://example.com/placeholder.jpg",
  descriptionShort: "Desc",
  publishedStore: "",
  platforms: ["PC"],
  developers: [],
  publishers: [],
  languages: [],
  categories: [],
  genres: [],
  tags: [],
  ...overrides,
});

export const mockGame: Game = makeGame({
  id: "1",
  name: "Test Game",
  image: "https://example.com/image.png",
});
