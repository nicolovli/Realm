import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@apollo/client/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { GET_PROMO_GAMES } from "../../lib/graphql/queries/promoGames";
import GameCardBase from "./GameCardBase";
import { useNavigate } from "react-router-dom";
import { HOVER, FOCUS_VISIBLE, CARD_CONTAINER } from "../../lib/classNames";
import { LOADINGandERROR } from "@/lib/classNames";
import { PromoCardSkeleton } from "../Skeletons";

interface Game {
  id: string;
  name: string;
  descriptionShort: string;
  image: string;
}

interface GetPromoGamesData {
  games: Game[];
}

export const PromoCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const promoGameIds = [14610, 8600, 7472];
  const { data, loading, error } = useQuery<GetPromoGamesData>(
    GET_PROMO_GAMES,
    {
      variables: { ids: promoGameIds },
      fetchPolicy: "cache-first",
    },
  );

  const games = data?.games ?? [];
  const currentGame = games[currentIndex];

  const goToSlide = (index: number) => setCurrentIndex(index);
  const nextSlide = useCallback(
    () => setCurrentIndex((prev) => (prev + 1) % games.length),
    [games.length],
  );
  const prevSlide = useCallback(
    () => setCurrentIndex((prev) => (prev - 1 + games.length) % games.length),
    [games.length],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (carouselRef.current?.contains(document.activeElement)) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          nextSlide();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevSlide();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  if (loading) {
    return (
      <section aria-label="Loading promotional games">
        <PromoCardSkeleton />
      </section>
    );
  }

  if (error) return <p className={LOADINGandERROR}>Error loading games.</p>;
  if (!games.length)
    return <p className={LOADINGandERROR}>No games available.</p>;

  return (
    <section
      ref={carouselRef}
      className={CARD_CONTAINER}
      aria-label="Promotional games carousel"
      tabIndex={0}
    >
      <GameCardBase
        title={currentGame.name}
        descriptionShort={currentGame.descriptionShort}
        image={currentGame.image}
        buttonText="Read more"
        onButtonClick={() => navigate(`/games/${currentGame.id}`)}
        imagePosition="left"
        showPlaceholders={false}
      />

      {/* Dot navigation */}
      <nav
        className="flex items-center justify-center gap-4 mt-2"
        aria-label="Carousel navigation"
      >
        {/* Previous button */}
        <button
          onClick={prevSlide}
          className={`text-text cursor-pointer ${HOVER} ${FOCUS_VISIBLE} p-2 rounded-full`}
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-6 h-6 dark:text-white" />
        </button>

        {/* Dots */}
        <ul
          className="flex gap-2 rounded-full bg-gray dark:bg-darkgray px-4 py-2"
          role="tablist"
        >
          {games.map((_, index) => (
            <li key={index} role="presentation">
              <button
                onClick={() => goToSlide(index)}
                className={`block w-3 h-3 rounded-full cursor-pointer ${
                  index === currentIndex
                    ? "bg-activelightdots dark:bg-darkbuttonpurple"
                    : "bg-lightdots dark:bg-darkpurple"
                } ${HOVER} ${FOCUS_VISIBLE}`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
                tabIndex={index === currentIndex ? 0 : -1}
              />
            </li>
          ))}
        </ul>

        {/* Next button */}
        <button
          onClick={nextSlide}
          className={`text-text cursor-pointer ${HOVER} ${FOCUS_VISIBLE} p-2 rounded-full`}
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-6 h-6 dark:text-white" />
        </button>
      </nav>
    </section>
  );
};

export default PromoCard;
