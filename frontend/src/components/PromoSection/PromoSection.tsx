import { useState, useEffect, useRef, useCallback } from "react";
import previewDB from "../../../../backend/db/previewDB.json";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface GameCard {
  title: string;
  description: string;
  image: string;
}

interface PreviewGame {
  name: string;
  description: string;
  image: string;
}

// Tailwind constants (todo: move to separate lib/constants file)
const section = "flex flex-col items-center w-full max-w-[1600px] mx-auto p-0";
const button =
  "text-white font-medium px-4 py-2 rounded-full hover:opacity-90 transition-all text-sm md:text-base cursor-pointer";
const dot = "w-3 h-3 rounded-full transition-all duration-300 cursor-pointer";

const PromoSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  {
    /* Get three games from the hardcoded previewDB.json */
  }
  const games: GameCard[] = (previewDB as PreviewGame[])
    .slice(2, 5)
    .map((game) => ({
      title: game.name,
      description: game.description,
      image: game.image,
    }));

  const goToSlide = (index: number) => setCurrentIndex(index);
  const currentGame = games[currentIndex];

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
      if (
        document.activeElement &&
        carouselRef.current?.contains(document.activeElement)
      ) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          nextSlide();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevSlide();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  return (
    <section
      ref={carouselRef}
      className={section}
      aria-roledescription="carousel"
      aria-label="Promotional games carousel"
      tabIndex={0}
    >
      <section className="max-w-8xl w-full rounded-4xl p-3 transition-colors duration-300 bg-lightpurple dark:bg-darkpurple">
        <section className="grid gap-6 md:grid-cols-3 items-center">
          {/* Text Section */}
          <article className="order-2 md:order-1 md:col-span-1 flex flex-col justify-between text-center text-text">
            <header className="space-y-2 min-h-[6rem] md:min-h-[17rem] text-black dark:text-white">
              <h2 className="text-xl md:text-3xl">{currentGame.title}</h2>
              <p className="text-sm md:text-base leading-snug">
                {currentGame.description}
              </p>
            </header>
            <section className="mt-1 md:mt-auto flex justify-center">
              {/* Todo: change this to route to the InformationPage with url ending with the given game's id */}
              <button
                className={`${button} bg-lightbuttonpurple dark:bg-darkbuttonpurple`}
              >
                Read more
              </button>
            </section>
          </article>

          {/* Image Section */}
          <figure className="md:col-span-2 order-1 md:order-2 flex justify-center items-center">
            <img
              src={currentGame.image}
              alt={currentGame.title}
              className="rounded-4xl w-full max-h-[28rem] object-cover"
            />
          </figure>
        </section>
      </section>

      {/* Dot controls */}
      <nav
        className="flex items-center justify-center gap-4 mt-2"
        aria-label="Carousel navigation"
      >
        <button
          onClick={prevSlide}
          className="text-text transition-colors cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <ul
          className="flex gap-2 rounded-full px-3 py-2 bg-gray dark:bg-darkgray"
          role="tablist"
        >
          {games.map((_, index) => (
            <li key={index} role="presentation">
              <button
                onClick={() => goToSlide(index)}
                className={`${dot} ${
                  index === currentIndex
                    ? "bg-activelightdots dark:bg-darkbuttonpurple"
                    : "bg-lightdots dark:bg-darkpurple"
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
                tabIndex={index === currentIndex ? 0 : -1}
              />
            </li>
          ))}
        </ul>

        <button
          onClick={nextSlide}
          className="text-text transition-colors cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </nav>
    </section>
  );
};

export { PromoSection };
