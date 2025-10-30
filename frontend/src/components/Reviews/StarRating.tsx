// components/Reviews/StarRating.tsx
import { useId, useState } from "react";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { FOCUS_VISIBLE } from "@/lib/classNames";

type BaseProps = {
  value: number;
  size?: number;
  ariaLabel?: string;
};

type ReadOnlyProps = BaseProps & {
  readOnly?: true;
  onChange?: never;
  name?: never;
};

type InteractiveProps = BaseProps & {
  readOnly?: false;
  onChange: (n: number) => void;
  name?: string;
};

export type StarRatingProps = ReadOnlyProps | InteractiveProps;

export const StarRating = (props: StarRatingProps) => {
  const { value, size = 25, ariaLabel = "Star rating" } = props;

  const generatedId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const commonStar = (fillPercent: number, key: number) => {
    const pct = Math.max(0, Math.min(100, Math.round(fillPercent)));
    return (
      <span
        key={key}
        className="relative inline-block"
        style={{ width: size, height: size, lineHeight: 0 }}
        aria-hidden
      >
        <StarOutline
          width={size}
          height={size}
          className="dark:text-gray-300 text-gray-600"
        />
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${pct}%`,
            height: size,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <StarSolid
            width={size}
            height={size}
            className="dark:text-yellow-400 text-orange-400"
          />
        </span>
      </span>
    );
  };

  // READ-ONLY
  if (!("onChange" in props) || props.readOnly) {
    if (value == null || value === 0) {
      return (
        <span className={`text-xs md:text-sm text-black/40 dark:text-white/60`}>
          No ratings yet
        </span>
      );
    }

    const rounded = Math.round(value);
    return (
      <span
        className={`inline-flex items-center`}
        role="img"
        aria-label={`${ariaLabel}: ${rounded} av 5 stjerner`}
      >
        {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => {
          const fill = Math.max(
            0,
            Math.min(100, Math.round((value - (n - 1)) * 100)),
          );
          return commonStar(fill, n);
        })}
      </span>
    );
  }

  // Interactive
  const { onChange, name } = props;
  const groupName = name ?? generatedId;
  const current = hover ?? value;

  const dec = () => onChange?.(Math.max(1, Math.floor(value - 1)));
  const inc = () => onChange?.(Math.min(5, Math.ceil(value + 1)));

  return (
    <fieldset
      role="radiogroup"
      aria-label={ariaLabel}
      className={`inline-flex items-center`}
      onMouseLeave={() => setHover(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          dec();
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          inc();
        }
      }}
    >
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => {
        const display = current;
        const fill = Math.max(
          0,
          Math.min(100, Math.round((display - (n - 1)) * 100)),
        );
        return (
          <label
            key={n}
            className={`cursor-pointer inline-flex items-center justify-center rounded-full ${FOCUS_VISIBLE}`}
            style={{ width: size, height: size }}
            aria-label={`${n} stjerner`}
            onMouseEnter={() => setHover(n)}
          >
            <input
              type="radio"
              name={groupName}
              className="sr-only"
              value={n}
              checked={value === n}
              onChange={() => onChange?.(n)}
            />
            {commonStar(fill, n)}
          </label>
        );
      })}
    </fieldset>
  );
};
