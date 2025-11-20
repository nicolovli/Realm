import { FOCUS_VISIBLE, HOVER } from "@/lib/classNames";
import { useUserProfileForm } from "@/hooks/useUserProfileForm";

interface UserProfileProps {
  user: {
    id: string;
    username: string;
    email: string;
  };
  handleLogOut: () => void;
}

export const Profile = ({ user, handleLogOut }: UserProfileProps) => {
  const {
    formData,
    formError,
    isEditing,
    saving,
    updateField,
    startEditing,
    cancelEditing,
    saveProfile,
  } = useUserProfileForm(user);

  const isPrivileged =
    user.id !== undefined && [1, 2, 3].includes(Number(user.id));

  return (
    <section
      className="flex bg-lightpurple dark:bg-darkpurple rounded-3xl flex-col justify-center items-center gap-4 p-10 md:p-20"
      aria-labelledby="profile-heading"
    >
      <h1 id="profile-heading" className="text-3xl">
        Hi, {user.username}! {isPrivileged && "(Admin User)"}
      </h1>
      <section className="w-full">
        {isEditing ? (
          /* Editing form */
          <section className="flex flex-col gap-4">
            <section className="flex flex-row gap-2 items-center">
              <label htmlFor="username" className="font-bold text-xl w-55">
                Username:
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(event) =>
                  updateField("username", event.target.value.toLowerCase())
                }
                placeholder="Enter your username"
                autoComplete="username"
                className={`${FOCUS_VISIBLE} w-60 lg:w-65 bg-gray-100 dark:bg-white/10 rounded-xl p-2 outline-none`}
              />
            </section>
            <section className="flex flex-row gap-2 items-center">
              <label htmlFor="email" className="font-bold text-xl w-55">
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className={`${FOCUS_VISIBLE} w-60 lg:w-65 bg-gray-100 dark:bg-white/10 rounded-xl p-2 outline-none`}
              />
            </section>
            <section className="flex flex-row gap-2 items-center">
              <label htmlFor="password" className="font-bold text-xl w-55">
                Password:
              </label>
              <input
                id="password"
                type="password"
                placeholder="New password"
                value={formData.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                autoComplete="new-password"
                className={`${FOCUS_VISIBLE} w-60 lg:w-65 bg-gray-100 dark:bg-white/10 rounded-xl p-2 outline-none`}
              />
            </section>
            <section className="flex flex-row gap-2 items-center">
              <label
                htmlFor="confirm-password"
                className="font-bold text-xl w-55 text-nowrap"
              >
                Confirm Password:
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
                autoComplete="new-password"
                className={`${FOCUS_VISIBLE} w-60 lg:w-65 bg-gray-100 dark:bg-white/10 rounded-xl p-2 outline-none`}
              />
            </section>
            {formError && (
              <p role="alert" className="text-red-500 text-sm">
                {formError}
              </p>
            )}
          </section>
        ) : (
          /* Read-only snapshot */
          <section className="flex flex-col gap-4">
            <section className="flex flex-row gap-2 items-center">
              <label
                htmlFor="current-username"
                className="font-bold text-xl w-30"
              >
                Username:
              </label>
              <p id="current-username">{user.username}</p>
            </section>
            <section className="flex flex-row gap-2 items-center">
              <label htmlFor="email" className="font-bold text-xl w-30">
                Email:
              </label>
              <p id="email">{user.email}</p>
            </section>
            <section className="flex flex-row gap-2 items-center">
              <label htmlFor="password" className="font-bold text-xl w-30">
                Password:
              </label>
              <p id="password">*********</p>
            </section>
          </section>
        )}
      </section>

      {/* Action buttons */}
      <section className="flex flex-row gap-4">
        <button
          onClick={() => (isEditing ? void saveProfile() : startEditing())}
          aria-label={isEditing ? "Save profile" : "Edit profile"}
          className={` ${HOVER} ${FOCUS_VISIBLE} cursor-pointer mt-6 bg-lightbuttonpurple dark:bg-darkbuttonpurple text-white py-2 px-4 rounded-full whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed`}
          disabled={isEditing && saving}
          aria-busy={isEditing && saving}
        >
          {isEditing ? (saving ? "Saving..." : "Save") : "Edit profile"}
        </button>
        {isEditing && (
          <button
            onClick={cancelEditing}
            aria-label={"Cancel editing profile"}
            className={` ${HOVER} ${FOCUS_VISIBLE} cursor-pointer mt-6 bg-black/20 dark:bg-white/20 text-white py-2 px-4 rounded-full whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed`}
            disabled={saving}
          >
            Cancel
          </button>
        )}

        {!isEditing && (
          <button
            onClick={handleLogOut}
            aria-label="Log out"
            className={` ${HOVER} ${FOCUS_VISIBLE} cursor-pointer mt-6 bg-black/20 dark:bg-white/20 text-white py-2 px-4 rounded-full whitespace-nowrap`}
          >
            Log out
          </button>
        )}
      </section>
    </section>
  );
};
