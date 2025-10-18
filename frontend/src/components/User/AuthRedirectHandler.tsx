import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_USER_BY_AUTH0_ID } from "../../lib/graphql/queries/user";
import type { UserByAuth0IdData, UserByAuth0IdVars } from "../../types/User";

export const AuthRedirectHandler = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const hasChecked = useRef(false);

  const { data, loading } = useQuery<UserByAuth0IdData, UserByAuth0IdVars>(
    GET_USER_BY_AUTH0_ID,
    {
      variables: { auth0Id: user?.sub || "" },
      skip: !isAuthenticated || !user || hasChecked.current,
    },
  );

  useEffect(() => {
    if (isLoading || loading || hasChecked.current) return;

    if (isAuthenticated && user && location.pathname === "/") {
      hasChecked.current = true;

      if (data?.userByAuth0Id) {
        // user exist, stay on homepage
      } else {
        // User doesn't exist -> Go to complete profile
        navigate("/completeprofile", { replace: true });
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    loading,
    data,
    navigate,
    user,
    location.pathname,
  ]);

  return null;
};
