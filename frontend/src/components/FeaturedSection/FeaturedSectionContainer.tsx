import { LOADINGandERROR } from "@/lib/classNames";
import { FeaturedCarousel } from "@/components/FeaturedSection";
import { GET_FEATURED_GAMES } from "@/lib/graphql";
import { useQuery } from "@apollo/client/react";
import type { FeaturedGame, GetFeaturedGamesData } from "@/types";
import { FeaturedCardSkeleton } from "@/components/Skeletons";

export const FeaturedSection = () => {
  const { loading, error, data } = useQuery<GetFeaturedGamesData>(
    GET_FEATURED_GAMES,
    {
      variables: { take: 10, sortBy: "popularity", sortOrder: "desc" },
      fetchPolicy: "cache-first",
    },
  );

  if (error) return <p className={LOADINGandERROR}>Error: {error.message}</p>;

  const top10: FeaturedGame[] = data?.games ?? [];

  return (
    <section className="overflow-x-hidden">
      {loading ? (
        <section className="flex gap-4 mt-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <section
              key={i}
              className={`
                shrink-0
                w-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4
              `}
            >
              <FeaturedCardSkeleton />
            </section>
          ))}
        </section>
      ) : (
        <FeaturedCarousel
          items={top10}
          onExploreAll={() => {
            /* Navigate to all games */
          }}
        />
      )}
    </section>
  );
};
