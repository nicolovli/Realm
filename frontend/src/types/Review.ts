export type ReviewUser = { id?: number; username: string };
export type Review = {
  id: number | string;
  description: string;
  star: number;
  createdAt: string | Date;
  user?: ReviewUser | null;
  gameId?: number;
};
