import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { HOVER, FOCUS_VISIBLE, SHADOW_MD } from "@/lib/classNames";
import { toDate } from "@/lib/utils/date";
import { HeartIcon } from "@/components/HeartIcon";
import { AuthDialog } from "@/components/User";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { StarRating } from "@/components/Reviews";
import { Link } from "react-router-dom";
import { buildSrcSet } from "@/lib/utils/images";

interface GameCardBaseProps {
  gameId: number;
  title: string;
  descriptionShort: string;
  descriptionFull?: string;
  image: string;
  initialImage?: string;
  finalImage?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  tags?: string[];
  developers?: string;
  publishers?: string;
  platforms?: string;
  imagePosition?: "left" | "right";
  rating?: number;
  isPromoCard?: boolean;
  publishedStore?: string | null;
  "data-cy"?: string;
}

const stripTrailingLink = (value?: string) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.replace(/\shttps?:\/\/\S+$/gi, "").trim();
};

export const GameCardBase = ({
  gameId,
  title,
  descriptionShort,
  image,
  initialImage,
  finalImage,
  buttonText,
  onButtonClick,
  tags = [],
  developers,
  publishers,
  platforms,
  imagePosition = "right",
  rating,
  isPromoCard,
  publishedStore,
  descriptionFull,
  "data-cy": dataCy,
}: GameCardBaseProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { setIsLoggedIn } = useAuthStatus();

  const isReversed = imagePosition === "left";

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

  const buildProxied = (url: string, width: number) =>
    `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=70`;

  const resolvedFinal = finalImage ?? buildProxied(image, 800);
  const resolvedInitial = initialImage ?? resolvedFinal;
  const [src, setSrc] = useState(resolvedInitial);

  const finalSet = buildSrcSet(image, [480, 640, 800, 1200]);
  const initialSet = buildSrcSet(image, [320, 480]);

  useEffect(() => {
    setSrc(resolvedInitial);
  }, [resolvedInitial]);

  useEffect(() => {
    if (resolvedInitial === resolvedFinal) return;
    let canceled = false;
    const img = new Image();
    img.src = resolvedFinal;
    void img
      .decode()
      .then(() => {
        if (!canceled) setSrc(resolvedFinal);
      })
      .catch(() => undefined);
    return () => {
      canceled = true;
    };
  }, [resolvedInitial, resolvedFinal]);

  const trimmedShort = stripTrailingLink(descriptionShort);
  const trimmedFull = descriptionFull ? stripTrailingLink(descriptionFull) : "";
  const baseDescription = trimmedShort || trimmedFull || "";
  const canToggleDescription =
    Boolean(trimmedFull) && trimmedFull.length > baseDescription.length;
  const descriptionToShow =
    showFullDescription && trimmedFull ? trimmedFull : baseDescription;

  return (
    <section
      data-cy={dataCy}
      className={`flex flex-col md:flex-row items-center bg-lightpurple dark:bg-darkpurple rounded-4xl p-6 w-full ${SHADOW_MD} ${
        isReversed ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Image */}
      <figure className="md:w-1/2 flex justify-center mb-4 md:mb-0">
        <img
          src={src}
          srcSet={src === resolvedFinal ? finalSet.srcSet : initialSet.srcSet}
          sizes={finalSet.sizes}
          alt={title}
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
                <Link
                  key={tag}
                  to={`/games?tags=${encodeURIComponent(tag)}`}
                  className={`bg-lightdots dark:bg-lightdots text-white px-2 py-1 rounded-full text-xs inline-flex items-center ${HOVER} ${FOCUS_VISIBLE}`}
                >
                  {tag}
                </Link>
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

          {/* Rating and favorite */}
          <section className="flex justify-center items-center gap-2 mt-3">
            {rating !== 0 && (
              <span
                className="text-xl leading-none flex items-center"
                style={{ transform: "translateY(2px)" }}
              >
                {rating?.toFixed(1)}
              </span>
            )}
            <StarRating value={rating ?? 0} readOnly />

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
          <p className="text-sm md:text-base leading-snug text-black dark:text-white whitespace-pre-line">
            {descriptionToShow}
            {canToggleDescription && (
              <>
                {" "}
                <button
                  type="button"
                  aria-expanded={showFullDescription}
                  onClick={() => setShowFullDescription((prev) => !prev)}
                  className={`${FOCUS_VISIBLE} inline-flex items-center text-sm text-blue-600 dark:text-blue-400 font-semibold cursor-pointer underline dark:hover:brightness-200 hover:brightness-70`}
                >
                  {showFullDescription ? "View less" : "View more"}
                </button>
              </>
            )}
          </p>
        </header>

        {/* Developers, publishers and platforms */}
        {(developers || publishers || platforms) && (
          <section className="mt-4 flex flex-wrap justify-center gap-6 text-xs md:text-sm text-gray-800 dark:text-white text-center">
            {developers && (
              <p>
                <strong>Developer:</strong> {developers}
              </p>
            )}
            {publishers && (
              <p>
                <strong>Publisher:</strong> {publishers}
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
