import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GameDetailCard } from "../components/InformationCards";
import { GET_GAME } from "../lib/graphql/queries/gameQueries";
import { GameCardSkeleton } from "@/components/Skeletons";

interface Game {
  id: string;
  name: string;
  descriptionShort: string;
  image: string;
  tags?: string[];
  developers?: string[];
  platforms?: string[];
}

export const InformationPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useQuery<
    { game: Game | null },
    { id: string }
  >(GET_GAME, {
    variables: { id: id! },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

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
      <main className="max-w-[1600px] mx-auto mt-10 text-center text-red-600">
        <p>Game not found. ID: {id}</p>
      </main>
    );
  }

  return (
    <main className="w-[min(1600px,92%)] mx-auto">
      <section className="flex justify-center">
        <GameDetailCard
          title={game.name}
          descriptionShort={game.descriptionShort}
          image={game.image}
          tags={game.tags}
          developers={game.developers?.join(", ")}
          platforms={game.platforms?.join(", ")}
        />
      </section>
    </main>
  );
};

export default InformationPage;
