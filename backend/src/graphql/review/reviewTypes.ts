export interface ReviewArgs {
  gameId: number;
  star: number;
  description: string;
}

export interface UpdateReviewArgs {
  id: number;
  star?: number;
  description?: string;
}

export interface DeleteReviewArgs {
  id: number;
}

export interface ReviewsForGameArgs {
  gameId: number;
  first?: number;
  after?: string;
}

export interface ReviewsMetaForGameArgs {
  gameId: number;
}

export interface ReviewMeta {
  averageStar: number;
  totalReviews: number;
}
