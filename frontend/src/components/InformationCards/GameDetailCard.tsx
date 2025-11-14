import { GameCardBase } from "@/components/InformationCards";
import { CARD_CONTAINER } from "@/lib/classNames";

// GameDetailCard component props
export interface GameDetailCardProps {
  gameId: number;
  title: string;
  descriptionShort: string;
  image: string;
  initialImage?: string;
  finalImage?: string;
  tags?: string[];
  developers?: string;
  publishers?: string;
  platforms?: string;
  onButtonClick?: () => void;
  rating?: number;
  publishedStore?: string | null;
}

export const GameDetailCard = ({
  gameId,
  title,
  descriptionShort,
  image,
  initialImage,
  finalImage,
  tags = [],
  developers,
  publishers,
  platforms,
  onButtonClick,
  rating,
  publishedStore,
}: GameDetailCardProps) => {
  return (
    <section className={CARD_CONTAINER} aria-labelledby={`${title}-heading`}>
      <GameCardBase
        gameId={Number(gameId)}
        title={title}
        descriptionShort={descriptionShort}
        image={image}
        initialImage={initialImage}
        finalImage={finalImage}
        imagePosition="right"
        tags={tags}
        developers={developers}
        publishers={publishers}
        platforms={platforms}
        publishedStore={publishedStore}
        onButtonClick={onButtonClick}
        rating={typeof rating === "number" ? rating : 0}
      />
    </section>
  );
};
