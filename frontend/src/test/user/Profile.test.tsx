// tests/Profile.test.tsx
import { describe, it, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Profile } from "../../components/User";

describe("Profile component", () => {
  const mockLogout = vi.fn();

  const mockAuth0User = {
    picture: "https://example.com/avatar.jpg",
    given_name: "Ole",
    family_name: "Nordmann",
    name: "Ole Nordmann",
    nickname: "OleN",
    email: "Ole@example.com",
  };

  const mockDbUser = {
    id: "22",
    auth0Id: "1",
    username: "KariN",
    givenName: "Kari",
    familyName: "Nordmann",
    email: "KariN@example.com",
    reviews: [],
  };

  it("renders user data from Auth0 if available", () => {
    render(
      <Profile user={mockAuth0User} dbUser={undefined} logout={mockLogout} />,
    );

    expect(screen.getByText("Hi, Ole!")).toBeInTheDocument();
    const nameElement = screen.getByText("Name:", {
      selector: "strong",
    }).parentElement;
    expect(nameElement).toHaveTextContent("Name: Ole Nordmann");

    const usernameEl = screen.getByText("Username:", {
      selector: "strong",
    }).parentElement;
    expect(usernameEl).toHaveTextContent(`Username: ${mockAuth0User.nickname}`);

    const emailEl = screen.getByText("Email:", {
      selector: "strong",
    }).parentElement;
    expect(emailEl).toHaveTextContent(`Email: ${mockAuth0User.email}`);

    expect(screen.getByRole("img", { name: /profile/i })).toHaveAttribute(
      "src",
      mockAuth0User.picture,
    );
  });

  it("renders dbUser data if Auth0 user fields are missing", () => {
    render(<Profile user={{}} dbUser={mockDbUser} logout={mockLogout} />);

    expect(
      screen.getByText(`Hi, ${mockDbUser.givenName}!`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, element) =>
          element?.tagName === "P" &&
          content.includes(`${mockDbUser.givenName} ${mockDbUser.familyName}`),
      ),
    ).toBeInTheDocument();

    const usernameEl = screen.getByText("Username:", {
      selector: "strong",
    }).parentElement;
    expect(usernameEl).toHaveTextContent(`Username: ${mockDbUser.username}`);

    const emailEl = screen.getByText("Email:", {
      selector: "strong",
    }).parentElement;
    expect(emailEl).toHaveTextContent(`Email: ${mockDbUser.email}`);
  });

  it("calls logout when the button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Profile user={mockAuth0User} dbUser={mockDbUser} logout={mockLogout} />,
    );

    const button = screen.getByRole("button", { name: /log out/i });
    await user.click(button);

    expect(mockLogout).toHaveBeenCalledOnce();
  });
});
