import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { FOCUS_VISIBLE } from "@/lib/classNames";
import { useNavigate } from "react-router-dom";
import { AuthDialog } from "@/components/User";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import {
  type LoginDialogControls,
  useLoginDialog,
} from "@/hooks/useLoginDialog";

interface AuthButtonProps {
  className?: string;
  dialogControls?: LoginDialogControls;
  renderDialog?: boolean;
}

export const AuthButton = ({
  className = "",
  dialogControls,
  renderDialog = true,
}: AuthButtonProps) => {
  const { isLoggedIn } = useAuthStatus();
  const internalDialogControls = useLoginDialog();
  const { open, openLogin, handleOpenChange } =
    dialogControls ?? internalDialogControls;
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
          onClick={openLogin}
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
      {renderDialog && (
        <AuthDialog open={open} onOpenChange={handleOpenChange} />
      )}
    </>
  );
};
