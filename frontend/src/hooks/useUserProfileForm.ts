import { useCallback, useEffect, useMemo, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { UPDATE_USER, GET_USER } from "@/lib/graphql";

interface UpdateUserResponse {
  updateUser: {
    id: string;
    username: string;
    email: string;
  };
}

interface UpdateUserVariables {
  username?: string;
  email?: string;
  password?: string;
}

export interface UserProfileFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const EMAIL_REGEX = /^[\w-.]+@[\w-]+(\.[\w-]+)+$/;

const emptyForm = (user: {
  username: string;
  email: string;
}): UserProfileFormState => ({
  username: user.username,
  email: user.email,
  password: "",
  confirmPassword: "",
});

export const useUserProfileForm = (user: {
  username: string;
  email: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileFormState>(() =>
    emptyForm(user),
  );
  const [formError, setFormError] = useState<string | null>(null);

  const [updateUser, { loading: saving }] = useMutation<
    UpdateUserResponse,
    UpdateUserVariables
  >(gql(UPDATE_USER), {
    update(cache, { data }) {
      if (!data?.updateUser) return;
      cache.writeQuery({
        query: GET_USER,
        data: { me: data.updateUser },
      });
    },
  });

  const resetForm = useCallback(() => {
    setFormData(emptyForm(user));
    setFormError(null);
  }, [user]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const startEditing = useCallback(() => {
    resetForm();
    setIsEditing(true);
  }, [resetForm]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    resetForm();
  }, [resetForm]);

  const updateField = useCallback(
    (field: keyof UserProfileFormState, value: string) => {
      setFormData((previous) => ({ ...previous, [field]: value }));
    },
    [],
  );

  const trimmedValues = useMemo(() => {
    return {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
    };
  }, [formData]);

  const validate = useCallback((): string | null => {
    const { username, email, password, confirmPassword } = trimmedValues;

    if (!username) return "Username cannot be empty.";
    if (username.length < 3) return "Username must be at least 3 characters.";
    if (!email) return "Email cannot be empty.";
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address.";
    if (password && password.length < 6)
      return "Password must be at least 6 characters.";
    if (password && password !== confirmPassword)
      return "Passwords do not match.";
    return null;
  }, [trimmedValues]);

  const buildUpdates = useCallback((): UpdateUserVariables => {
    const { username, email, password } = trimmedValues;
    const updates: UpdateUserVariables = {};

    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    if (normalizedUsername !== user.username.toLowerCase()) {
      updates.username = normalizedUsername;
    }

    if (normalizedEmail !== user.email.toLowerCase()) {
      updates.email = normalizedEmail;
    }

    if (password) {
      updates.password = password;
    }

    return updates;
  }, [trimmedValues, user]);

  const saveProfile = useCallback(async () => {
    setFormError(null);
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const updates = buildUpdates();

    if (!Object.keys(updates).length) {
      toast.info("No changes to save.");
      setIsEditing(false);
      return;
    }

    try {
      const { data } = await updateUser({ variables: updates });
      if (data?.updateUser) {
        toast.success("Profile updated!");
        setFormData(emptyForm(data.updateUser));
        setIsEditing(false);
        setFormError(null);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update your profile right now. Please try again.";
      setFormError(message);
      toast.error(message);
    }
  }, [buildUpdates, updateUser, validate]);

  return {
    formData,
    formError,
    isEditing,
    saving,
    updateField,
    startEditing,
    cancelEditing,
    saveProfile,
  };
};
