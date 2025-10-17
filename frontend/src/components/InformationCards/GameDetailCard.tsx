import GameCardBase from "./GameCardBase";
import { CARD_CONTAINER } from "../../lib/classNames";

interface GameDetailCardProps {
  title: string;
  descriptionShort: string;
  image: string;
  tags?: string[];
  developers?: string;
  platforms?: string;
  onButtonClick?: () => void;
}

export const GameDetailCard = ({
  title,
  descriptionShort,
  image,
  tags = [],
  developers,
  platforms,
  onButtonClick = () => console.log(`Clicked ${title}`),
}: GameDetailCardProps) => {
  return (
    <section className={CARD_CONTAINER}>
      <GameCardBase
        title={title}
        descriptionShort={descriptionShort}
        image={image}
        imagePosition="right"
        tags={tags}
        developers={developers}
        platforms={platforms}
        onButtonClick={onButtonClick}
      />
    </section>
  );
};

export default GameDetailCard;
