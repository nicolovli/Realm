// Game-related types
export type Game = {
  id: string;
  sid: number;
  name: string;
  descriptionShort?: string;
  image?: string;
  publishedStore?: string;
  platforms: string[];
  developers: string[];
  publishers: string[];
  languages: string[];
  categories: string[];
  genres: string[];
  tags: string[];
};

export type GameFilter = {
  tags?: string[];
  languages?: string[];
  categories?: string[];
  genres?: string[];
  platforms?: string[];
  publishers?: string[];
  developers?: string[];
};

export type FeaturedGame = {
  id: string;
  name: string;
  image?: string;
};

// Promo card game - subset of full Game type

export type PromoGame = {
  id: string;
  name: string;
  descriptionShort: string;
  image: string;
  rating?: number;
};

export type GetFeaturedGamesData = {
  games: FeaturedGame[];
};
