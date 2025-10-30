import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { FOCUS_VISIBLE } from "../../lib/classNames";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDialog } from "../User";
import { useAuthStatus } from "@/hooks/useAuthStatus";

interface AuthButtonProps {
  className?: string;
}

export const AuthButton = ({ className = "" }: AuthButtonProps) => {
  const { isLoggedIn, setIsLoggedIn } = useAuthStatus();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const loginbutton =
    "flex items-center gap-1 rounded-full cursor-pointer " +
    FOCUS_VISIBLE +
    " " +
    className;

  const handleAccountClick = () => {
    navigate("/profile");
  };

  return (
    <>
      {isLoggedIn ? (
        <button
          onClick={handleAccountClick}
          className={
            loginbutton +
            "text-black dark:text-white hover:text-white dark:hover:text-black"
          }
          title="View Account"
          aria-label="View account"
        >
          <UserCircleIcon className="w-8 h-8" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className={
            loginbutton +
            " py-3 px-5 bg-lightbuttonpurple dark:bg-darkbuttonpurple hover:bg-darkbuttonpurple text-white dark:hover:bg-lightbuttonpurple"
          }
          aria-label="login"
        >
          <ArrowRightStartOnRectangleIcon
            aria-hidden="true"
            className="w-5 h-5"
          />
          Login
        </button>
      )}
      <AuthDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open && localStorage.getItem("token")) {
            setIsLoggedIn(true);
            window.dispatchEvent(new Event("auth-change"));
          }
        }}
      />
    </>
  );
};
