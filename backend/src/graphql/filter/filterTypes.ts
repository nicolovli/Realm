export type GameFilter = {
  tags?: string[];
  languages?: string[];
  categories?: string[];
  genres?: string[];
  platforms?: string[];
  publishers?: string[];
};

export type AvailableFilterOptions = {
  genres: string[];
  categories: string[];
  platforms: string[];
  publishers: string[];
  tags: string[];
};
