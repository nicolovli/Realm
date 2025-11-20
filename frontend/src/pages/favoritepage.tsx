import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_USER_WITH_FAV } from "@/lib/graphql";
import type { Game } from "@/types";
import { ResultsGrid } from "@/components/ResultsGrid";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useLoginDialog } from "@/hooks/useLoginDialog";
import { FOCUS_VISIBLE, ELEVATED_CONTAINER } from "@/lib/classNames";
import { AuthDialog } from "@/components/User";

interface GetMeWithFavoritesData {
  me: {
    id: string;
    username: string;
    favorites: Game[];
  } | null;
}

export const FavoritePage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const { isLoggedIn } = useAuthStatus();
  const { open, openLogin, handleOpenChange } = useLoginDialog();

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
      <>
        <main className="flex flex-col items-center justify-center min-h-screen p-6">
          <section className="text-center space-y-4 -mt-20">
            <h1 className="text-3xl font-bold dark:text-white">
              You have no favorites yet :/
            </h1>
            <section className="flex !flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={openLogin}
                className={`${FOCUS_VISIBLE} underline dark:hover:brightness-200 hover:brightness-70 text-lightbuttonpurple dark:text-lightpurple font-semibold cursor-pointer whitespace-nowrap`}
              >
                Log in
              </button>
              <p className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                and start favoriting games to see them here!
              </p>
            </section>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              (You can favorite games by clicking on the heart on a game's
              specific page)
            </p>
          </section>
        </main>
        <AuthDialog open={open} onOpenChange={handleOpenChange} />
      </>
    );
  }

  return (
    <>
      <main>
        <article
          className={`w-[min(1600px,92%)] mx-auto ${ELEVATED_CONTAINER} px-8 py-10 flex flex-col gap-8 `}
        >
          <header className="w-[min(1600px,92%)] mx-auto text-center py-6">
            <h1 className="text-3xl font-bold dark:text-white mb-2">
              My Favorites
            </h1>
            {favorites.length > 0 && !loading && (
              <p className="text-gray-600 dark:text-gray-400">
                {favorites.length} game{favorites.length !== 1 ? "s" : ""} in
                your collection
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
        </article>
      </main>
      <AuthDialog open={open} onOpenChange={handleOpenChange} />
    </>
  );
};
