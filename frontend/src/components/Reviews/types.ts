export type ReviewUser = { id?: number; username: string };

export interface ReviewsConnection {
  edges: Array<{ node: Review; cursor: string }>;
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
  totalCount: number;
}

export type Review = {
  id: number | string;
  description: string;
  star: number;
  createdAt: string | Date;
  user?: ReviewUser | null;
  gameId?: number;
};
