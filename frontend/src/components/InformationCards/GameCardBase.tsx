import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { HOVER, FOCUS_VISIBLE } from "../../lib/classNames";

interface GameCardBaseProps {
  title: string;
  descriptionShort: string;
  image: string;
  buttonText?: string;
  onButtonClick?: () => void;
  tags?: string[];
  developers?: string;
  platforms?: string;
  imagePosition?: "left" | "right";
  showPlaceholders?: boolean;
}

export const GameCardBase = ({
  title,
  descriptionShort,
  image,
  buttonText,
  onButtonClick,
  tags = [],
  developers,
  platforms,
  imagePosition = "right",
  showPlaceholders = true,
}: GameCardBaseProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isReversed = imagePosition === "left";

  // Handle window resize to update mobile state
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleTags = showAllTags ? tags : tags.slice(0, isMobile ? 3 : 5);
  const hasExtraTags = tags.length > (isMobile ? 3 : 5);

  return (
    <section
      className={`flex flex-col md:flex-row items-center bg-lightpurple dark:bg-darkpurple rounded-4xl p-6 w-full ${
        isReversed ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Image */}
      <figure className="md:w-1/2 flex justify-center mb-4 md:mb-0">
        <img
          src={image}
          alt={title}
          className="rounded-3xl w-full h-full max-h-[25rem] object-cover"
        />
      </figure>

      {/* Text */}
      <article className="md:w-1/2 flex flex-col items-center text-center text-black dark:text-white px-0 md:px-6">
        <header className="space-y-4">
          <h2 className="text-xl md:text-3xl">{title}</h2>

          {/* Tags */}
          {tags.length > 0 && (
            <section className="flex flex-wrap justify-center gap-2 items-center">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-lightdots dark:bg-lightdots text-white dark:text-white px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}

              {hasExtraTags && (
                <button
                  onClick={() => setShowAllTags((prev) => !prev)}
                  className={`text-gray-800 dark:text-gray-200 ${HOVER} ${FOCUS_VISIBLE}`}
                  aria-label={
                    showAllTags ? "Show fewer tags" : "Show more tags"
                  }
                >
                  {showAllTags ? (
                    <ChevronUpIcon className="w-5 h-5" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5" />
                  )}
                </button>
              )}
            </section>
          )}

          {/* Placeholders */}
          {showPlaceholders && (
            <section className="flex justify-center gap-4 mt-3">
              <span className="border border-gray-400 rounded-md px-3 py-1 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                star rating placeholder
              </span>
              <span className="border border-gray-400 rounded-md px-3 py-1 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                heart icon placeholder
              </span>
            </section>
          )}

          {/* Description */}
          <p className="text-sm md:text-base leading-snug">
            {descriptionShort}
          </p>
        </header>

        {/* Developers and platforms */}
        {(developers || platforms) && (
          <section className="mt-4 flex flex-wrap justify-center gap-6 text-xs md:text-sm text-gray-800 dark:text-white text-center">
            {developers && (
              <p>
                <strong>Developer:</strong> {developers}
              </p>
            )}
            {platforms && (
              <p>
                <strong>Platforms:</strong> {platforms}
              </p>
            )}
          </section>
        )}

        {/* Button */}
        {buttonText && (
          <section className="mt-6">
            <button
              onClick={onButtonClick}
              className={`text-white font-medium px-6 py-2 rounded-full bg-lightbuttonpurple dark:bg-darkbuttonpurple text-sm md:text-base ${HOVER} ${FOCUS_VISIBLE}`}
            >
              {buttonText}
            </button>
          </section>
        )}
      </article>
    </section>
  );
};

export default GameCardBase;
