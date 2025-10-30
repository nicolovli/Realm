import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { CREATE_USER, LOGIN_USER } from "@/lib/graphql/mutations/user";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { toast } from "sonner";
import { Login, Register } from ".";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreateUserResponse {
  createUser: {
    id: string;
    username: string;
    email: string;
  };
}

interface CreateUserVariables {
  username: string;
  email: string;
  password: string;
}

interface LoginUserResponse {
  loginUser: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}

interface LoginUserVariables {
  username: string;
  password: string;
}

const darkmode = "text-black dark:text-white";

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [createUser] = useMutation<CreateUserResponse, CreateUserVariables>(
    gql(CREATE_USER),
  );
  const [loginUser] = useMutation<LoginUserResponse, LoginUserVariables>(
    gql(LOGIN_USER),
  );

  const handleLoginSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const { data } = await loginUser({
        variables: {
          username: values.username,
          password: values.password,
        },
      });
      if (data?.loginUser?.token) {
        localStorage.setItem("token", data.loginUser.token);
        toast.success(`Welcome back, player ${data.loginUser.user.username}!`);
        onOpenChange(false);
      } else {
        toast.warning("The portal denies entry — your details seem off.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "The gates remain closed. Give it another go!";

      toast.error(message);
    }
  };

  const handleRegisterSubmit = async (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      await createUser({
        variables: {
          username: values.username,
          email: values.email,
          password: values.password,
        },
      });
      const { data: loginData } = await loginUser({
        variables: {
          username: values.username.toLowerCase(),
          password: values.password,
        },
      });
      if (loginData?.loginUser?.token) {
        localStorage.setItem("token", loginData.loginUser.token);
        toast.success(
          `Welcome to Realm, player ${loginData.loginUser.user.username}`,
        );
        onOpenChange(false);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while forging your account. Give it another shot!";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col overflow-hidden bg-white dark:bg-darkpurple">
        <DialogTitle className={"text-lg md:text-3xl font-semibold" + darkmode}>
          {mode === "login" ? "Login" : "Register"}
        </DialogTitle>
        <DialogDescription className={"text-lg" + darkmode}>
          {mode === "login"
            ? "Jump back into Realm! Enter your portal credentials to continue your adventure."
            : "Create your portal and join the Realm universe!"}
        </DialogDescription>
        {mode === "login" ? (
          <Login onSubmit={handleLoginSubmit} />
        ) : (
          <Register onSubmit={handleRegisterSubmit} />
        )}
        <p className={"mt-4 text-center text-sm cursor-pointer " + darkmode}>
          {mode === "login" ? (
            <>
              New to Realm?{" "}
              <span className="underline" onClick={() => setMode("register")}>
                Create your portal
              </span>{" "}
              and start exploring!
            </>
          ) : (
            <>
              Back to the adventure?{" "}
              <span className="underline" onClick={() => setMode("login")}>
                Enter Realm
              </span>{" "}
              and continue your journey!
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
};
