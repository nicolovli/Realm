import { FOCUS_VISIBLE } from "@/lib/classNames";
import { useState, type FormEvent } from "react";

interface LoginProps {
  onSubmit: (values: { username: string; password: string }) => void;
}

export const Login = ({ onSubmit }: LoginProps) => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const formDataCSS = "border p-2 rounded-2xl w-full flex";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-md dark:text-white"
    >
      <label>
        Username:
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value.toLowerCase() })
          }
          className={formDataCSS + FOCUS_VISIBLE}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className={formDataCSS + FOCUS_VISIBLE}
        />
      </label>
      <button
        type="submit"
        className={
          `bg-lightbuttonpurple text-white p-2 rounded-2xl mt-2 hover:bg-darkbuttonpurple dark:bg-darkbuttonpurple dark:hover:bg-darkmodebackground cursor-pointer ` +
          FOCUS_VISIBLE
        }
      >
        Login
      </button>
    </form>
  );
};
