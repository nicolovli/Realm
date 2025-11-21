import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";
import { MemoryRouter } from "react-router-dom";
import {
  defaultGamesData as gamesData,
  buildPromoCarouselMocks,
} from "@/test/mocks/promoMocks";
import { PromoCard } from "@/components/InformationCards";
import {
  buildEmptyPromoMocks,
  buildIncompletePromoMocks,
} from "@/test/mocks/promoMocks";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

const mocks = buildPromoCarouselMocks(gamesData, 3);

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

    expect(await screen.findByText("Game 1")).toBeInTheDocument();

    const nextBtn = screen.getByLabelText("Next slide");
    const prevBtn = screen.getByLabelText("Previous slide");
    const dotButtons = screen.getAllByRole("tab");

    await user.click(nextBtn);
    expect(await screen.findByText("Game 2")).toBeInTheDocument();

    await user.click(nextBtn);
    expect(await screen.findByText("Game 3")).toBeInTheDocument();

    await user.click(prevBtn);
    expect(await screen.findByText("Game 2")).toBeInTheDocument();

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

    expect(await screen.findByText("Game 1")).toBeInTheDocument();

    const readMoreBtn = screen.getByText("Read more");
    await user.click(readMoreBtn);
    expect(navigateMock).toHaveBeenCalledWith("/games/1", {
      state: {
        previewImage:
          "https://images.weserv.nl/?url=img1&w=640&output=webp&q=70",
      },
    });
  });

  it("supports keyboard navigation with Arrow keys when focused", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <PromoCard />
        </MemoryRouter>
      </MockedProvider>,
    );

    const carousel = await screen.findByLabelText("Promotional games carousel");
    (carousel as HTMLElement).focus();

    await user.keyboard("{ArrowRight}");
    expect(await screen.findByText("Game 2")).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(await screen.findByText("Game 1")).toBeInTheDocument();
  });

  it("updates aria-selected on tabs when slides change", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <PromoCard />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(await screen.findByText("Game 1")).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    await user.click(tabs[1]);
    expect(await screen.findByText("Game 2")).toBeInTheDocument();
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
  });

  it("shows empty state when no games available", async () => {
    render(
      <MockedProvider mocks={buildEmptyPromoMocks()}>
        <MemoryRouter>
          <PromoCard />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(
      await screen.findByText(/No games available\./i),
    ).toBeInTheDocument();
  });

  it("shows data incomplete state when a game lacks required fields", async () => {
    render(
      <MockedProvider mocks={buildIncompletePromoMocks()}>
        <MemoryRouter>
          <PromoCard />
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(
      await screen.findByText(/Game data incomplete\./i),
    ).toBeInTheDocument();
  });
});
