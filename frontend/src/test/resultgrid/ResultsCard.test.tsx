import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import type { Game } from "@/types";
import { Card } from "@/components/ResultsGrid";
import { act } from "react";
import { mockGame } from "../mocks/resultsMocks";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const testClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: "/graphql" }),
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={testClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </ApolloProvider>
);

vi.mock("@/components/HeartIcon", () => ({
  HeartIcon: () => <div data-testid="heart-icon" />,
}));

describe("Card component", () => {
  it("renders a Link if no onClick prop is provided", () => {
    render(<Card game={mockGame} />, { wrapper: Wrapper });

    const link = screen.getByRole("link", { name: /open test game/i });
    expect(link).toBeInTheDocument();

    const img = screen.getByAltText(/test game/i);
    expect(img.getAttribute("src")).toContain(
      encodeURIComponent(mockGame.image!),
    );

    const figcaption = screen.getByText(/test game/i);
    expect(figcaption).toBeVisible();
  });

  it("renders a button if onClick prop is provided", async () => {
    const handleClick = vi.fn();
    render(<Card game={mockGame} onClick={handleClick} />, {
      wrapper: Wrapper,
    });

    const button = screen.getByRole("button", { name: /open test game/i });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledWith(mockGame);
  });

  it("falls back gracefully when image is missing", () => {
    const gameNoImage: Game = { ...mockGame, image: undefined };
    render(<Card game={gameNoImage} />, { wrapper: Wrapper });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(/image unavailable/i)).toBeInTheDocument();
  });

  it("shows loading shimmer until image loads then hides it", async () => {
    const handleClick = vi.fn();
    render(<Card game={mockGame} onClick={handleClick} />, {
      wrapper: Wrapper,
    });
    const wrapper = screen.getByRole("button", { name: /open test game/i });
    const shimmer = wrapper.querySelector(".animate-pulse");
    expect(shimmer).toBeTruthy();
    const img = screen.getByAltText(/test game/i);
    await act(async () => {
      img.dispatchEvent(new Event("load"));
    });
    await waitFor(() =>
      expect(wrapper.querySelector(".animate-pulse")).toBeNull(),
    );
  });

  it("displays fallback when image errors", async () => {
    render(<Card game={mockGame} />, { wrapper: Wrapper });
    const img = screen.getByAltText(/test game/i);
    await act(async () => {
      img.dispatchEvent(new Event("error"));
    });
    await waitFor(() =>
      expect(screen.getByText(/image unavailable/i)).toBeInTheDocument(),
    );
  });

  it("has accessible name matching game name for both link and button variants", () => {
    render(<Card game={mockGame} />, { wrapper: Wrapper });
    expect(
      screen.getByRole("link", {
        name: new RegExp(`open ${mockGame.name}`, "i"),
      }),
    ).toBeInTheDocument();
    const handleClick = vi.fn();
    render(<Card game={mockGame} onClick={handleClick} />, {
      wrapper: Wrapper,
    });
    expect(
      screen.getByRole("button", {
        name: new RegExp(`open ${mockGame.name}`, "i"),
      }),
    ).toBeInTheDocument();
  });
});
