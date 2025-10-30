import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { ResultsGrid } from "@/components/ResultsGrid";
import type { Game } from "@/types/GameTypes";
import { GET_USER_WITH_FAV } from "@/lib/graphql/queries/userQueries";
import { useAuthStatus } from "@/hooks/useAuthStatus";

interface GetMeWithFavoritesData {
  me: {
    id: string;
    username: string;
    favorites: Game[];
  } | null;
}

export const FavoritePage = () => {
  const { isLoggedIn } = useAuthStatus();

  const {
    data: userData,
    loading,
    error,
    refetch,
  } = useQuery<GetMeWithFavoritesData>(GET_USER_WITH_FAV, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
    skip: !isLoggedIn,
  });

  useEffect(() => {
    if (isLoggedIn) refetch();
  }, [isLoggedIn, refetch]);

  const favorites: Game[] = userData?.me?.favorites || [];

  // Show this if user is not logged in
  if (!isLoggedIn) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <section className="text-center space-y-4 -mt-20">
          <h1 className="text-3xl font-bold dark:text-white">
            You have no favorites yet :/
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Log in and start favoriting games to see them here!
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            (You can favorite games by clicking on the heart on a game's
            specific page)
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <header className="w-[min(1600px,92%)] mx-auto text-center py-6">
        <h1 className="text-3xl font-bold dark:text-white mb-2">
          My Favorites
        </h1>
        {favorites.length > 0 && !loading && (
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length} game{favorites.length !== 1 ? "s" : ""} in your
            collection
          </p>
        )}
      </header>

      <section
        className="w-[min(1600px,92%)] mx-auto"
        aria-label="Favorite games list"
      >
        <ResultsGrid
          games={favorites}
          loading={loading}
          error={error?.message}
          emptyState="No favorite games yet. Start exploring and favorite some games!"
        />
      </section>
    </main>
  );
};
