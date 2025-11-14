import { GET_USER, GET_GAME } from "@/lib/graphql";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GameDetailCard } from "@/components/InformationCards";
import { GameCardSkeleton } from "@/components/Skeletons";
import { ReviewList, ReviewForm } from "@/components/Reviews";
import { useEffect } from "react";
import { useReviewsMeta } from "@/hooks/useReviews";

interface Game {
  id: number;
  name: string;
  descriptionShort: string;
  image: string;
  tags?: string[];
  developers?: string[];
  publishers?: string[];
  platforms?: string[];
  publishedStore?: string | null;
}

export const InformationPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const { data: meData } = useQuery<{
    me: { id: number } | null;
  }>(GET_USER, {
    fetchPolicy: "cache-first",
  });
  const currentUserId = meData?.me?.id ? Number(meData.me.id) : undefined;

  const { id } = useParams<{ id: string }>();
  const gameId = id ? Number(id) : 0;

  const location = useLocation();
  const previewImage = (location.state as { previewImage?: string } | null)
    ?.previewImage;

  const { data, loading, error } = useQuery<
    { game: Game | null },
    { id: number }
  >(GET_GAME, {
    variables: { id: gameId! },
    skip: gameId === undefined || Number.isNaN(gameId),
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

  const { averageStar } = useReviewsMeta(gameId);

  if (loading) {
    return (
      <main className="w-[min(1600px,92%)] mx-auto">
        <section className="flex justify-center">
          <GameCardSkeleton />
        </section>
      </main>
    );
  }

  if (error)
    return <p className="text-center text-red-500 mt-10">{error.message}</p>;

  const game = data?.game;
  if (!game) {
    return (
      <main className="max-w-[1600px] mx-auto text-center text-red-600">
        <p>Game not found. ID: {id}</p>
      </main>
    );
  }

  return (
    <main className="w-[min(1600px,92%)] mx-auto !pt-3">
      <section className="flex justify-center">
        <GameDetailCard
          gameId={game.id!}
          title={game.name ?? ""}
          descriptionShort={game.descriptionShort ?? ""}
          image={game.image ?? ""}
          initialImage={previewImage}
          tags={game.tags ?? []}
          developers={game.developers ? game.developers.join(", ") : ""}
          publishers={game.publishers ? game.publishers.join(", ") : ""}
          platforms={game.platforms ? game.platforms.join(", ") : ""}
          publishedStore={game.publishedStore ?? null}
          rating={typeof averageStar === "number" ? averageStar : 0}
        />
      </section>
      <ReviewForm gameId={Number(game.id)} currentUserId={currentUserId} />
      <section>
        <ReviewList gameId={Number(game.id)} currentUserId={currentUserId} />
      </section>
    </main>
  );
};
