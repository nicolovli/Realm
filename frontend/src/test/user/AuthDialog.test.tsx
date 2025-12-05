import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthDialog } from "@/components/User";
import { MockedProvider } from "@apollo/client/testing/react";

// mock toast notifications
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

// mock Login and Register components to isolate AuthDialog test
vi.mock("../../components/User/Login", () => {
  type Props = {
    onSubmit: (values: { username: string; password: string }) => void;
  };

  return {
    Login: ({ onSubmit }: Props) => (
      <button
        onClick={() => {
          localStorage.setItem("token", "dummy-token");
          onSubmit({ username: "user", password: "Group12345" });
        }}
      >
        LoginForm
      </button>
    ),
  };
});

vi.mock("../../components/User/Register", () => {
  type Props = {
    onSubmit: (values: {
      username: string;
      email: string;
      password: string;
    }) => void;
  };

  return {
    Register: ({ onSubmit }: Props) => (
      <button
        onClick={() => {
          localStorage.setItem("token", "dummy-token");

          onSubmit({
            username: "newuser",
            email: "abc@gmail.com",
            password: "Group123",
          });
        }}
      >
        RegisterForm
      </button>
    ),
  };
});

vi.mock("@apollo/client/react", async () => {
  const actual = await vi.importActual("@apollo/client/react");
  return {
    ...actual,
    useMutation: vi.fn(() => [vi.fn().mockResolvedValue({ data: {} })]),
  };
});

describe("AuthDialog", () => {
  const onOpenChangeMock = vi.fn();

  beforeEach(() => {
    vi.spyOn(Storage.prototype, "setItem");
    vi.clearAllMocks();
  });

  it("renders login mode by default", () => {
    render(
      <MockedProvider mocks={[]}>
        <AuthDialog open={true} onOpenChange={onOpenChangeMock} />
      </MockedProvider>,
    );
    expect(screen.getByText("LoginForm")).toBeInTheDocument();
  });

  it("switches to register mode when link is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]}>
        <AuthDialog open={true} onOpenChange={onOpenChangeMock} />
      </MockedProvider>,
    );

    const switchLink = screen.getByText(/Create your portal/i);
    await user.click(switchLink);

    expect(
      screen.getByRole("heading", { name: /register/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("RegisterForm")).toBeInTheDocument();
  });

  it("calls login on submit and triggers toast.success", async () => {
    const user = userEvent.setup();
    const onOpenChangeMock = vi.fn();
    const { toast } = await import("sonner");

    const { useMutation } = await import("@apollo/client/react");
    const loginMutationMock = vi.fn().mockResolvedValue({
      data: {
        loginUser: {
          token: "dummy-token",
          user: {
            id: "1",
            username: "user",
            email: "user@example.com",
          },
        },
      },
    });

    (useMutation as unknown as jest.Mock).mockReturnValue([
      loginMutationMock,
      { loading: false },
    ]);

    render(
      <MockedProvider mocks={[]}>
        <AuthDialog open={true} onOpenChange={onOpenChangeMock} />
      </MockedProvider>,
    );

    await user.click(screen.getByText("LoginForm"));
    await vi.waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "dummy-token");
    });
    await vi.waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Welcome back, player user!");
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it("calls register on submit and triggers toast.success", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]}>
        <AuthDialog open={true} onOpenChange={onOpenChangeMock} />
      </MockedProvider>,
    );

    const switchLink = screen.getByText("Create your portal");
    await user.click(switchLink);

    expect(screen.getByText("RegisterForm")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /register/i }),
    ).toBeInTheDocument();
  });

  // edge case: login without receiving a token from server
  it("shows warning toast when login returns no token", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    const { useMutation } = await import("@apollo/client/react");

    const loginMutationMock = vi.fn().mockResolvedValue({
      data: { loginUser: null },
    });

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      loginMutationMock,
      { loading: false },
    ]);

    render(
      <MockedProvider mocks={[]}>
        <AuthDialog open={true} onOpenChange={onOpenChangeMock} />
      </MockedProvider>,
    );

    await user.click(screen.getByText("LoginForm"));

    await vi.waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(
        "The portal denies entry — your details seem off.",
      );
    });
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
  });

  // edge case: network error
  it("shows error toast on login network error", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    const { useMutation } = await import("@apollo/client/react");

    const loginMutationMock = vi
      .fn()
      .mockRejectedValue(new Error("Network error"));

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      loginMutationMock,
      { loading: false },
    ]);

    render(
      <MockedProvider mocks={[]}>
        <AuthDialog open={true} onOpenChange={onOpenChangeMock} />
      </MockedProvider>,
    );

    await user.click(screen.getByText("LoginForm"));

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network error");
    });
  });

  // edge case: registration error because user already exists
  it("shows error toast when registration fails", async () => {
    const user = userEvent.setup();
    const { toast } = await import("sonner");
    const { useMutation } = await import("@apollo/client/react");

    const createUserMock = vi
      .fn()
      .mockRejectedValue(new Error("Username already exists"));

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      createUserMock,
      { loading: false },
    ]);

    render(
      <MockedProvider mocks={[]}>
        <AuthDialog open={true} onOpenChange={onOpenChangeMock} />
      </MockedProvider>,
    );

    await user.click(screen.getByText(/create your portal/i));
    await user.click(screen.getByText("RegisterForm"));

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Username already exists");
    });
  });
});
