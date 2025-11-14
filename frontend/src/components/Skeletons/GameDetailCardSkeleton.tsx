import { GameCardSkeleton } from "@/components/Skeletons";

export const GameDetailCardSkeleton = () => {
  return (
    <GameCardSkeleton
      imagePosition="left"
      showTags
      showDevelopers
      showPlatforms
      showButton={false}
    />
  );
};
