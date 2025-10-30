import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { HOVER, FOCUS_VISIBLE } from "../../lib/classNames";

import { HeartIcon } from "../HeartIcon";
import { AuthDialog } from "../User";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { StarRating } from "../Reviews/StarRating";

interface GameCardBaseProps {
  gameId: number;
  title: string;
  descriptionShort: string;
  image: string;
  buttonText?: string;
  onButtonClick?: () => void;
  tags?: string[];
  developers?: string;
  platforms?: string;
  imagePosition?: "left" | "right";
  rating?: number;
  isPromoCard?: boolean;
  publishedStore?: string | null;
}

// Robust date parser (gjenbrukt fra ReviewItem)
function toDate(v: unknown): Date | null {
  if (v instanceof Date) return v;
  if (typeof v === "number" && Number.isFinite(v)) return new Date(v);
  if (typeof v === "string") {
    const s = v.trim();
    if (/^\d+$/.test(s)) {
      const n = Number(s);
      return Number.isFinite(n) ? new Date(n) : null;
    }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export const GameCardBase = ({
  gameId,
  title,
  descriptionShort,
  image,
  buttonText,
  onButtonClick,
  tags = [],
  developers,
  platforms,
  imagePosition = "right",
  rating,
  isPromoCard,
  publishedStore,
}: GameCardBaseProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { setIsLoggedIn } = useAuthStatus();

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

  const publishedDateObj = toDate(publishedStore);
  const publishedLabel = publishedDateObj
    ? publishedDateObj.toLocaleDateString("nb-NO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <section
      className={`flex flex-col md:flex-row items-center bg-lightpurple dark:bg-darkpurple rounded-4xl p-6 w-full ${
        isReversed ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Image */}
      <figure className="md:w-1/2 flex justify-center mb-4 md:mb-0">
        <img
          src={`https://images.weserv.nl/?url=${encodeURIComponent(image)}&w=800&output=webp`}
          alt={title}
          sizes="(max-width: 768px) 90vw, 50vw"
          className="rounded-3xl w-full h-full max-h-[25rem] object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </figure>

      {/* Text */}
      <article className="md:w-1/2 flex flex-col items-center text-center text-black dark:text-white px-0 md:px-6">
        <header className="space-y-4">
          <h2 className="text-xl md:text-3xl">{title}</h2>

          {/* Release / published date */}
          {publishedLabel && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Released {publishedLabel}
            </p>
          )}
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
                  className={`text-gray-800 dark:text-gray-200 cursor-pointer ${HOVER} ${FOCUS_VISIBLE}`}
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

          <section className="flex justify-center items-center gap-2 mt-3">
            {rating !== 0 && (
              <span className="text-xl">{rating?.toFixed(1)} </span>
            )}
            <span>
              <StarRating value={rating ?? 0} readOnly />
            </span>

            {!isPromoCard && (
              <HeartIcon
                gameId={gameId}
                onRequireLogin={() => setAuthOpen(true)}
              />
            )}

            <AuthDialog
              open={authOpen}
              onOpenChange={(open) => {
                setAuthOpen(open);
                if (!open && localStorage.getItem("token")) {
                  setIsLoggedIn(true);
                  window.dispatchEvent(new Event("auth-change"));
                }
              }}
            />
          </section>

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
              className={`text-white font-medium px-6 py-2 rounded-full bg-lightbuttonpurple dark:bg-darkbuttonpurple text-sm md:text-base cursor-pointer ${HOVER} ${FOCUS_VISIBLE}`}
            >
              {buttonText}
            </button>
          </section>
        )}
      </article>
    </section>
  );
};
