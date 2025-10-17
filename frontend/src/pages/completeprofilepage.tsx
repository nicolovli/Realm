import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CREATE_USER } from "../lib/graphql/mutations/user";
import { useQuery } from "@apollo/client/react";
import { GET_USER_BY_AUTH0_ID } from "../lib/graphql/queries/user";
import { LOADINGandERROR } from "../lib/classNames";
import { ProfileForm } from "../components/User";

export const CompleteProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { refetch } = useQuery(GET_USER_BY_AUTH0_ID, {
    variables: { auth0Id: user?.sub || "" },
    skip: !isAuthenticated || !user,
  });

  if (isLoading) return <main className={LOADINGandERROR}>Loading...</main>;
  if (!isAuthenticated)
    return <main className={LOADINGandERROR}>Please log in first.</main>;

  const handleSubmit = async (formData: {
    given_name: string;
    family_name: string;
    nickname: string;
  }) => {
    setErrorMessage("");
    if (!user) return;

    const variables = {
      auth0Id: user.sub,
      username: formData.nickname,
      givenName: formData.given_name,
      familyName: formData.family_name,
      email: user.email,
    };

    try {
      const response = await fetch(import.meta.env.VITE_GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: CREATE_USER, variables }),
      });
      console.log(import.meta.env.VITE_GRAPHQL_URL);
      const result = await response.json();

      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions?.exception?.code === "P2002") {
          setErrorMessage(
            `This username is already in use. Please choose another.`,
          );
        } else {
          setErrorMessage(error.message || "An error occurred");
        }
        return;
      }

      await refetch();
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="p-6 flex items-center justify-center dark:text-white">
      <section className="border-2 rounded-2xl p-6 w-full max-w-md dark:border-white border-lightbuttonpurple">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Complete Your Profile
        </h1>
        <ProfileForm
          initialValues={{
            given_name: user?.given_name || "",
            family_name: user?.family_name || "",
            nickname: user?.nickname || "",
          }}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
        />
      </section>
    </main>
  );
};
