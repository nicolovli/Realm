import { FOCUS_VISIBLE } from "../../lib/classNames";

interface UserProfileProps {
  user: {
    username: string;
    email: string;
  };
  handleLogOut: () => void;
}

export const Profile = ({ user, handleLogOut }: UserProfileProps) => {
  return (
    <main className="flex items-center dark:text-white min-h-screen">
      <section
        className="flex bg-lightpurple dark:bg-darkpurple rounded-3xl flex-col justify-center items-center gap-4 p-10 md:p-20"
        aria-labelledby="profile-heading"
      >
        <h1 id="profile-heading" className="text-3xl">
          Hi, {user.username}!
        </h1>
        <h2 id="email-label" className="font-bold text-xl">
          Email:
        </h2>
        <p aria-labelledby="email-label">{user.email}</p>

        <button
          onClick={handleLogOut}
          aria-label="Log out"
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
