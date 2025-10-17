export const FeaturedCardSkeleton = () => {
  return (
    <figure className="relative w-full rounded-2xl animate-pulse bg-lightsearchbargray dark:bg-darksearchbargray">
      <span
        className="block w-full aspect-[16/9] rounded-2xl bg-lightsearchbargray dark:bg-darksearchbargray"
        aria-hidden="true"
      />
    </figure>
  );
};
