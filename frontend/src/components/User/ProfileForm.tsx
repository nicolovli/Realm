import { useState, type FormEvent } from "react";
import { FOCUS_VISIBLE, HOVER } from "../../lib/classNames";

interface ProfileFormProps {
  initialValues: { given_name: string; family_name: string; nickname: string };
  onSubmit: (values: {
    given_name: string;
    family_name: string;
    nickname: string;
  }) => void;
  errorMessage?: string;
}

const formDataCSS = "border p-2 rounded-2xl w-full";

export const ProfileForm = ({
  initialValues,
  onSubmit,
  errorMessage,
}: ProfileFormProps) => {
  const [formData, setFormData] = useState(initialValues);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <label>
        First name:
        <input
          type="text"
          value={formData.given_name}
          onChange={(e) =>
            setFormData({ ...formData, given_name: e.target.value })
          }
          className={formDataCSS + FOCUS_VISIBLE}
        />
      </label>

      <label>
        Last name:
        <input
          type="text"
          value={formData.family_name}
          onChange={(e) =>
            setFormData({ ...formData, family_name: e.target.value })
          }
          className={formDataCSS + FOCUS_VISIBLE}
        />
      </label>

      <label>
        Username:
        <input
          type="text"
          value={formData.nickname}
          onChange={(e) =>
            setFormData({ ...formData, nickname: e.target.value })
          }
          className={formDataCSS + FOCUS_VISIBLE}
        />
      </label>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <button
        type="submit"
        className={
          `bg-lightbuttonpurple text-white p-2 rounded-2xl mt-2 hover:bg-darkbuttonpurple dark:bg-darkbuttonpurple ` +
          FOCUS_VISIBLE +
          HOVER
        }
      >
        Save
      </button>
    </form>
  );
};
