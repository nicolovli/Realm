import { GameCardBase } from "./GameCardBase";
import { CARD_CONTAINER } from "../../lib/classNames";

interface GameDetailCardProps {
  gameId: number;
  title: string;
  descriptionShort: string;
  image: string;
  tags?: string[];
  developers?: string;
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
  tags = [],
  developers,
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
        imagePosition="right"
        tags={tags}
        developers={developers}
        platforms={platforms}
        publishedStore={publishedStore}
        onButtonClick={onButtonClick}
        rating={typeof rating === "number" ? rating : 0}
      />
    </section>
  );
};
