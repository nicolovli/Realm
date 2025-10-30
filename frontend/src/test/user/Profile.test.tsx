import { describe, it, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Profile } from "../../components/User";

describe("Profile component", () => {
  const mockHandleLogOut = vi.fn();

  const mockUser = {
    username: "KariN",
    email: "KariN@example.com",
  };

  it("renders user information correctly", () => {
    render(<Profile user={mockUser} handleLogOut={mockHandleLogOut} />);

    expect(screen.getByText(`Hi, ${mockUser.username}!`)).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it("renders logout button with correct label and style", () => {
    render(<Profile user={mockUser} handleLogOut={mockHandleLogOut} />);

    const button = screen.getByRole("button", { name: /log out/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("rounded-full");
  });

  it("calls handleLogOut when logout button is clicked", async () => {
    const user = userEvent.setup();
    render(<Profile user={mockUser} handleLogOut={mockHandleLogOut} />);

    const button = screen.getByRole("button", { name: /log out/i });
    await user.click(button);

    expect(mockHandleLogOut).toHaveBeenCalledOnce();
  });
});
