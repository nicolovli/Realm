import { GameCardSkeleton } from "@/components/Skeletons";

interface PromoCardSkeletonProps {
  "data-cy"?: string;
}

export const PromoCardSkeleton = ({
  "data-cy": dataCy,
}: PromoCardSkeletonProps) => {
  return <GameCardSkeleton imagePosition="right" data-cy={dataCy} />;
};
