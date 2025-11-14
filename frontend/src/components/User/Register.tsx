import { useState, type FormEvent } from "react";
import { FOCUS_VISIBLE } from "@/lib/classNames";

interface RegisterProps {
  onSubmit: (values: {
    username: string;
    email: string;
    password: string;
  }) => void;
}

export const Register = ({ onSubmit }: RegisterProps) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    onSubmit({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
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
          name="username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value.toLowerCase() })
          }
          className={formDataCSS + FOCUS_VISIBLE}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={formDataCSS + FOCUS_VISIBLE}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className={formDataCSS + FOCUS_VISIBLE}
          required
        />
      </label>
      <label>
        Confirm Password:
        <input
          type="password"
          name="passwordConfirmation"
          value={formData.passwordConfirm}
          onChange={(e) =>
            setFormData({ ...formData, passwordConfirm: e.target.value })
          }
          className={formDataCSS + FOCUS_VISIBLE}
          required
        />
      </label>

      {error && (
        <p role="alert" className="text-red-500 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={
          `bg-lightbuttonpurple text-white p-2 rounded-2xl mt-2 hover:bg-darkbuttonpurple dark:bg-darkbuttonpurple dark:hover:bg-darkpurple cursor-pointer ` +
          FOCUS_VISIBLE
        }
      >
        Register
      </button>
    </form>
  );
};
