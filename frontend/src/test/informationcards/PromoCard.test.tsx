import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";
import { MemoryRouter } from "react-router-dom";
import { GET_PROMO_GAMES } from "@/lib/graphql";
import { PromoCard } from "@/components/InformationCards";

// Mock useNavigate
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

// Mocked games data
const mocks = [
  {
    request: {
      query: GET_PROMO_GAMES,
      variables: { ids: [14610, 8600, 7472] },
    },
    result: {
      data: {
        games: [
          {
            id: "1",
            name: "Game 1",
            descriptionShort: "Desc 1",
            image: "img1",
          },
          {
            id: "2",
            name: "Game 2",
            descriptionShort: "Desc 2",
            image: "img2",
          },
          {
            id: "3",
            name: "Game 3",
            descriptionShort: "Desc 3",
            image: "img3",
          },
        ],
      },
    },
  },
];

describe("PromoCard tests", () => {
  it("renders the first game by default", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <PromoCard />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(await screen.findByText("Game 1")).toBeInTheDocument();
  });

  it("navigates slides with next/prev buttons and dots", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <PromoCard />
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for first game
    expect(await screen.findByText("Game 1")).toBeInTheDocument();

    const nextBtn = screen.getByLabelText("Next slide");
    const prevBtn = screen.getByLabelText("Previous slide");
    const dotButtons = screen.getAllByRole("tab");

    // Next slide
    await user.click(nextBtn);
    expect(await screen.findByText("Game 2")).toBeInTheDocument();

    // Next slide again
    await user.click(nextBtn);
    expect(await screen.findByText("Game 3")).toBeInTheDocument();

    // Previous slide
    await user.click(prevBtn);
    expect(await screen.findByText("Game 2")).toBeInTheDocument();

    // Dot navigation to first slide
    await user.click(dotButtons[0]);
    expect(await screen.findByText("Game 1")).toBeInTheDocument();
  });

  it("calls navigate when clicking 'Read more'", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <PromoCard />
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for first game
    expect(await screen.findByText("Game 1")).toBeInTheDocument();

    const readMoreBtn = screen.getByText("Read more");
    await user.click(readMoreBtn);
    expect(navigateMock).toHaveBeenCalledWith("/games/1", {
      state: {
        previewImage: "https://images.weserv.nl/?url=img1&w=640&output=webp",
      },
    });
  });
});
