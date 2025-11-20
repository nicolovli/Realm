// Controls the login modal state and syncs auth status when it closes with a new token.
import { useState } from "react";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export const useLoginDialog = () => {
  const [open, setOpen] = useState(false);
  const { setIsLoggedIn } = useAuthStatus();

  const openLogin = () => setOpen(true);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open && localStorage.getItem("token")) {
      setIsLoggedIn(true);
      window.dispatchEvent(new Event("auth-change"));
    }
  };

  return { open, openLogin, handleOpenChange };
};
