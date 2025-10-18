import { FOCUS_VISIBLE } from "../../lib/classNames";
import type { UserByAuth0IdData } from "../../types/User";

interface UserProfileProps {
  user: {
    picture?: string;
    name?: string;
    nickname?: string;
    email?: string;
    given_name?: string;
  };
  dbUser?: UserByAuth0IdData["userByAuth0Id"];
  logout: () => void;
}

export const Profile = ({ user, dbUser, logout }: UserProfileProps) => {
  return (
    <main className="flex items-center h-screen dark:text-white">
      <section className="flex bg-lightpurple dark:bg-darkpurple rounded-3xl flex-col justify-center items-center gap-4 p-10 md:p-20">
        <h1 className="text-3xl">
          Hi, {user?.given_name || dbUser?.givenName}!
        </h1>
        {user?.picture && (
          <img
            src={user?.picture}
            alt="Profile"
            className="w-40 h-40 rounded-full"
          />
        )}
        <p className="text-xl">
          <strong>Name: </strong>
          {dbUser?.givenName && dbUser?.familyName
            ? `${dbUser.givenName} ${dbUser.familyName}`
            : user?.name}{" "}
        </p>
        <p className="text-lg">
          <strong>Username: </strong>
          {user?.nickname || dbUser?.username}
        </p>
        <p className="text-lg">
          <strong>Email: </strong>
          {user?.email || dbUser?.email}
        </p>

        <button
          onClick={logout}
          className={
            `mt-6 bg-lightbuttonpurple dark:bg-darkbuttonpurple text-white py-2 px-4 rounded-full hover:bg-darkbuttonpurple dark:hover:bg-lightbuttonpurple ` +
            FOCUS_VISIBLE
          }
        >
          Log out
        </button>
      </section>
    </main>
  );
};
