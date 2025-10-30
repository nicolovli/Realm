import { useNavigate } from "react-router-dom";
import { LOADINGandERROR } from "../lib/classNames";
import { useQuery } from "@apollo/client/react";
import { Profile } from "../components/User";
import { GET_USER } from "@/lib/graphql/queries/userQueries";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { client as apolloClient } from "@/lib/apolloClient";

interface User {
  id: string;
  username: string;
  email: string;
}

interface GetUserData {
  me: User;
}

export const UserPage = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuthStatus();
  const { data, loading, error } = useQuery<GetUserData>(GET_USER);

  const handleLogOut = async () => {
    try {
      localStorage.removeItem("token");

      try {
        apolloClient.writeQuery({ query: GET_USER, data: { me: null } });
      } catch {
        console.warn("writeQuery failed, clearing Apollo store");
        await apolloClient.clearStore();
      }

      setIsLoggedIn(false);
      window.dispatchEvent(new Event("auth-change"));
      navigate("/");
    } catch {
      // Fallback: ensure token removed and navigate away
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("auth-change"));
      navigate("/");
    }
  };

  if (loading) return <p className={LOADINGandERROR}>Loading...</p>;
  if (error) return <p className={LOADINGandERROR}>Error loading profile</p>;
  if (!data?.me) return <p className={LOADINGandERROR}>User not found</p>;

  return <Profile user={data.me} handleLogOut={handleLogOut} />;
};
