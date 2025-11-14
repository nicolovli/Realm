interface GameCardSkeletonProps {
  imagePosition?: "left" | "right";
  showTags?: boolean;
  showDevelopers?: boolean;
  showPlatforms?: boolean;
  showButton?: boolean;
  "data-cy"?: string;
}

export const GameCardSkeleton = ({
  imagePosition = "left",
  showTags = false,
  showDevelopers = false,
  showPlatforms = false,
  showButton = true,
  "data-cy": dataCy,
}: GameCardSkeletonProps) => {
  const isImageRight = imagePosition === "right";

  return (
    <section
      data-cy={dataCy}
      className={`flex flex-col md:flex-row ${
        isImageRight ? "md:flex-row-reverse" : ""
      } items-start bg-lightsearchbargray dark:bg-darksearchbargray rounded-4xl 
      w-full p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 md:gap-6`}
      aria-label="Loading game card"
    >
      {/* Image skeleton */}
      <figure className="md:w-1/2 w-full flex justify-center mb-3 sm:mb-4 md:mb-0">
        <span
          className="rounded-3xl w-full h-full max-h-[25rem] min-h-[14rem] sm:min-h-[16rem] md:min-h-[17rem] 
          bg-zinc-300 dark:bg-zinc-700 animate-pulse"
          role="presentation"
        />
      </figure>

      {/* Text skeleton */}
      <article
        className="md:w-1/2 w-full flex flex-col items-center text-center 
        px-0 md:px-6 space-y-3 sm:space-y-4 min-h-[14rem] sm:min-h-[16rem] md:min-h-[17rem]"
        aria-hidden="true"
      >
        {/* Title skeleton */}
        <header className="w-full flex justify-center">
          <span className="block h-6 sm:h-7 md:h-8 w-3/4 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse" />
        </header>

        {/* Description skeleton */}
        <section className="space-y-1.5 sm:space-y-2 w-full flex flex-col items-center mt-2 sm:mt-3 md:mt-4">
          <p className="h-3 sm:h-4 w-full bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse" />
          <p className="h-3 sm:h-4 w-5/6 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse" />
          <p className="h-3 sm:h-4 w-4/6 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse" />
        </section>

        {/* Optional tags */}
        {showTags && (
          <ul className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            <li>
              <span className="block h-5 sm:h-6 w-14 sm:w-16 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse" />
            </li>
            <li>
              <span className="block h-5 sm:h-6 w-10 sm:w-12 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse" />
            </li>
          </ul>
        )}

        {/* Optional developers and platforms */}
        {(showDevelopers || showPlatforms) && (
          <section className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 w-3/4 flex flex-col items-center">
            {showDevelopers && (
              <p className="h-3 sm:h-4 w-2/3 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse" />
            )}
            {showPlatforms && (
              <p className="h-3 sm:h-4 w-1/2 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse" />
            )}
          </section>
        )}

        {/* Button skeleton */}
        {showButton && (
          <footer className="mt-4 sm:mt-6 flex justify-center">
            <button
              className="h-8 sm:h-9 md:h-10 w-28 sm:w-32 bg-zinc-400 dark:bg-zinc-600 
              rounded-full animate-pulse cursor-default"
              disabled
              aria-hidden="true"
            />
          </footer>
        )}
      </article>
    </section>
  );
};
