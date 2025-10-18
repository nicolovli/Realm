import { useNavigate } from "react-router-dom";
import { LOADINGandERROR } from "../lib/classNames";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { GET_USER_BY_AUTH0_ID } from "../lib/graphql/queries/user";
import { useQuery } from "@apollo/client/react";
import type { UserByAuth0IdData } from "../types/User";
import { Profile } from "../components/User";

export const UserPage = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<UserByAuth0IdData>(
    GET_USER_BY_AUTH0_ID,
    {
      variables: { auth0Id: user?.sub || "" },
      skip: !user?.sub,
    },
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || loading)
    return <p className={LOADINGandERROR}>Loading...</p>;
  if (error) return <p className={LOADINGandERROR}>Error loading profile</p>;
  if (!user) return <p className={LOADINGandERROR}>User not found</p>;

  return (
    <Profile
      user={user}
      dbUser={data?.userByAuth0Id}
      logout={() =>
        logout({
          logoutParams: { returnTo: window.location.origin + "/project2" },
        })
      }
    />
  );
};
