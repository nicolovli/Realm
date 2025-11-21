import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing/react";
import { ReviewForm } from "@/components/Reviews";
import { GET_REVIEWS_FOR_GAME, GET_REVIEWS_META_FOR_GAME } from "@/lib/graphql";

describe("ReviewForm", () => {
  it("renders form fields and allows rating selection when user is provided", async () => {
    const user = userEvent.setup();

    const mocks = [
      {
        request: {
          query: GET_REVIEWS_FOR_GAME,
          variables: { gameId: 1, first: 100 },
        },
        result: {
          data: {
            reviewsForGame: {
              __typename: "ReviewsConnection",
              edges: [],
              pageInfo: {
                __typename: "PageInfo",
                endCursor: null,
                hasNextPage: false,
              },
              totalCount: 0,
            },
          },
        },
      },
      {
        request: {
          query: GET_REVIEWS_META_FOR_GAME,
          variables: { gameId: 1 },
        },
        result: {
          data: {
            reviewsMetaForGame: {
              __typename: "ReviewsMeta",
              averageStar: 0,
              totalReviews: 0,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <ReviewForm gameId={1} currentUserId={42} />
      </MockedProvider>,
    );

    // wait for textarea to appear (MockedProvider resolves async)
    const textarea = await screen.findByRole("textbox");
    expect(textarea).toBeInTheDocument();

    // star inputs are radios (labels like "1 stjerner") — pick a star
    const star3Label = await screen.findByLabelText(/3 stjerner/i);
    await user.click(star3Label);
    const star3Input = star3Label.querySelector(
      "input",
    ) as HTMLInputElement | null;
    expect(star3Input).not.toBeNull();
    expect(star3Input?.checked).toBeTruthy();

    // submit button exists (wait for it)
    const submit = await screen.findByRole("button", { name: /post|sender/i });
    expect(submit).toBeInTheDocument();
  });

  it("renders error state if GraphQL query fails", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_REVIEWS_FOR_GAME,
          variables: { gameId: 1, first: 100 },
        },
        error: new Error("Network error"),
      },
      {
        request: {
          query: GET_REVIEWS_META_FOR_GAME,
          variables: { gameId: 1 },
        },
        error: new Error("Network error"),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks}>
        <ReviewForm gameId={1} currentUserId={42} />
      </MockedProvider>,
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(
      /could not check existing reviews\. please try again later\./i,
    );
  });
});
