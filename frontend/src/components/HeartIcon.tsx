import {
  useEffect,
  useState,
  type MouseEventHandler,
  type KeyboardEventHandler,
} from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { FOCUS_VISIBLE } from "@/lib/classNames";
import {
  getToggleFavoriteRefetchQueries,
  GET_USER_WITH_FAV,
  TOGGLE_FAVORITE,
} from "@/lib/graphql";
import type { UserData } from "@/types";

// HeartIcon component props
export type HeartIconProps = {
  size?: number;
  gameId: number;
  onRequireLogin: () => void;
};

export const HeartIcon = ({
  size = 35,
  gameId,
  onRequireLogin,
}: HeartIconProps) => {
  const { isLoggedIn } = useAuthStatus();
  const [liked, setLiked] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { data, refetch, error } = useQuery<UserData>(GET_USER_WITH_FAV, {
    fetchPolicy: "network-only",
    skip: !isLoggedIn,
  });

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
    refetchQueries: getToggleFavoriteRefetchQueries(),
    awaitRefetchQueries: true,
  });

  const user = data?.me;

  // Track if query failed
  useEffect(() => {
    if (error) {
      setHasError(true);
      toast.error("Could not load favorites status");
    }
  }, [error]);

  // Update liked state when user data changes
  useEffect(() => {
    if (user?.favorites) {
      setLiked(user.favorites.some((fav) => Number(fav.id) === gameId));
    }
  }, [user, gameId]);

  // Refetch user when login state changes
  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn, refetch]);

  const commitToggle = async () => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    if (hasError) {
      toast.error("Cannot update favorites - please refresh the page");
      return;
    }
    const newLiked = !liked;
    setLiked(newLiked);
    try {
      await toggleFavorite({ variables: { gameId, liked: newLiked } });
      toast.success(
        newLiked ? "Added to favorites :)" : "Removed from favorites :(",
      );
    } catch {
      setLiked(!newLiked);
      toast.error("Failed to update favorite.");
    }
  };

  const handleClick: MouseEventHandler<SVGSVGElement> = async () => {
    await commitToggle();
  };

  const handleKeyDown: KeyboardEventHandler<SVGSVGElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      void commitToggle();
    }
  };

  const label = liked ? "Remove from favorites" : "Add to favorites";

  const hoverClasses = liked
    ? "hover:fill-pink-100 hover:stroke-pink-300 dark:hover:stroke-pink-300"
    : "hover:fill-pink-200 hover:stroke-pink-500 dark:hover:stroke-pink-300"; // outline -> fill on hover

  const iconClass = `
    cursor-pointer
    transition-colors duration-150 ease-out outline-none
    ${liked ? "fill-pink-300 stroke-black dark:stroke-white" : "fill-none stroke-black dark:stroke-white"}
    ${hoverClasses}
    ${FOCUS_VISIBLE}
  `;

  return liked ? (
    <HeartSolid
      data-cy="filled-heart-icon"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={liked}
      className={iconClass}
      width={size}
      height={size}
    />
  ) : (
    <HeartOutline
      data-cy="outline-heart-icon"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={liked}
      className={iconClass}
      width={size}
      height={size}
    />
  );
};
