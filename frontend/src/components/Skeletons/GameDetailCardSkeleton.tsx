import { GameCardSkeleton } from "./GameCardBaseSkeleton";

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
