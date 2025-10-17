import type { ReactNode } from "react";
import type { Game } from "./GameTypes";

export type ResultsGridProps = {
  games: Game[];
  loading: boolean;
  emptyState?: ReactNode; // optional custom empty UI
  error?: string | null; // if you want to surface fetch errors later
};
