import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "@/components/User";
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

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

    await user.type(usernameInput, "Group1");
    await user.type(passwordInput, "secret123");

    expect(usernameInput).toHaveValue("Group1");
    expect(passwordInput).toHaveValue("secret123");
  });

  it("calls onSubmit with valid form data when submitted", async () => {
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

  it("does NOT submit if username is empty", async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Login onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/password/i), "mypassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("does NOT submit if password is empty", async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Login onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/username/i), "group1");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("does NOT submit if fields contain only whitespace", async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Login onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/username/i), "   ");
    await user.type(screen.getByLabelText(/password/i), "   ");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("supports keyboard navigation (tab order and Enter to submit)", async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();

    render(<Login onSubmit={mockSubmit} />);

    const username = screen.getByLabelText(/username/i);
    const password = screen.getByLabelText(/password/i);
    const button = screen.getByRole("button", { name: /login/i });

    await user.tab();
    expect(username).toHaveFocus();

    await user.tab();
    expect(password).toHaveFocus();

    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("meets accessibility standards (axe)", async () => {
    const { container } = render(<Login onSubmit={() => {}} />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
