import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "@/components/User";

describe("Login component", () => {
  it("renders username and password fields and submit button", () => {
    const mockSubmit = vi.fn();
    render(<Login onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("allows typing into username and password fields", async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Login onSubmit={mockSubmit} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, "group1");
    await user.type(passwordInput, "secret123");

    expect(usernameInput).toHaveValue("group1");
    expect(passwordInput).toHaveValue("secret123");
  });

  it("calls onSubmit with form data when submitted", async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Login onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/username/i), "Group1");
    await user.type(screen.getByLabelText(/password/i), "mypassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockSubmit).toHaveBeenCalledOnce();
    expect(mockSubmit).toHaveBeenCalledWith({
      username: "group1",
      password: "mypassword",
    });
  });
});
