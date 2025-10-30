import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Register } from "@/components/User";

describe("Register component", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockReset();
  });

  it("renders all input fields and button", () => {
    render(<Register onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i }),
    ).toBeInTheDocument();
  });

  it("shows error if password is too short", async () => {
    render(<Register onSubmit={mockOnSubmit} />);
    const user = userEvent.setup();

    // Fill ALL required fields
    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText("Password:"), "123");
    await user.type(screen.getByLabelText("Confirm Password:"), "123");

    await user.click(screen.getByRole("button", { name: /register/i }));

    // Wait for the error message to appear
    expect(
      await screen.findByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows error if passwords do not match", async () => {
    render(<Register onSubmit={mockOnSubmit} />);
    const user = userEvent.setup();

    // Fill ALL required fields
    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText("Password:"), "123456");
    await user.type(screen.getByLabelText("Confirm Password:"), "654321");

    await user.click(screen.getByRole("button", { name: /register/i }));

    // Wait for the error message to appear
    expect(
      await screen.findByText(/passwords do not match/i),
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with correct values when form is valid", async () => {
    render(<Register onSubmit={mockOnSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), "johndoe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText("Password:"), "password123");
    await user.type(screen.getByLabelText("Confirm Password:"), "password123");

    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockOnSubmit).toHaveBeenCalledWith({
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
    });
  });
});
