import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { GET_USER_WITH_FAV } from "@/lib/graphql/queries/userQueries";
import { TOGGLE_FAVORITE } from "@/lib/graphql/mutations/favorites";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { FOCUS_VISIBLE } from "@/lib/classNames";

type HeartIconProps = {
  size?: number;
  gameId: number;
  onRequireLogin: () => void;
};

export interface UserData {
  me: {
    id: string;
    username: string;
    favorites: { id: string }[];
  } | null;
}

export const HeartIcon = ({
  size = 35,
  gameId,
  onRequireLogin,
}: HeartIconProps) => {
  const { isLoggedIn } = useAuthStatus();
  const [liked, setLiked] = useState(false);

  const { data, refetch } = useQuery<UserData>(GET_USER_WITH_FAV, {
    fetchPolicy: "network-only",
    skip: !isLoggedIn,
  });

  const user = data?.me;

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

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE);

  const handleClick = async () => {
    if (!isLoggedIn) {
      onRequireLogin();
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

  const iconClass = `
    cursor-pointer 
    ${liked ? "fill-pink-300 stroke-black dark:stroke-white" : "fill-none stroke-black dark:stroke-white"}
    ${FOCUS_VISIBLE}
  `;

  return liked ? (
    <HeartSolid
      onClick={handleClick}
      className={iconClass}
      width={size}
      height={size}
    />
  ) : (
    <HeartOutline
      onClick={handleClick}
      className={iconClass}
      width={size}
      height={size}
    />
  );
};
