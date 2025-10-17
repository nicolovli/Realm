import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth0 } from "@auth0/auth0-react";
import { FOCUS_VISIBLE } from "../../lib/classNames";
import { useNavigate } from "react-router-dom";

interface AuthButtonProps {
  className?: string;
}

export const AuthButton = ({ className = "" }: AuthButtonProps) => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  const loginbutton =
    "flex items-center gap-1 text-white bg-lightbuttonpurple dark:bg-darkbuttonpurple rounded-full text-whitehover:bg-darkbuttonpurple dark:hover:bg-lightbuttonpurple " +
    FOCUS_VISIBLE +
    " " +
    className;

  const handleAuth = () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
      });
    } else {
      navigate("/profile");
    }
  };

  return (
    <button
      onClick={handleAuth}
      className={
        isAuthenticated ? loginbutton + " p-0" : loginbutton + " py-3 px-5"
      }
    >
      {!isAuthenticated && (
        <ArrowRightStartOnRectangleIcon
          aria-hidden="true"
          className="w-5 h-5"
        />
      )}
      {isAuthenticated ? (
        user?.picture ? (
          <img
            src={user.picture}
            alt="Profile"
            className={`w-10 h-10 rounded-full` + FOCUS_VISIBLE}
          />
        ) : (
          "Profile"
        )
      ) : (
        "Login"
      )}
    </button>
  );
};
