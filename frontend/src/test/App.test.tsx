// App.test.tsx
import { render, screen } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { vi } from "vitest";

vi.mock("../index.css", () => ({}));

describe("App Component", () => {
  it("renders header and routes correctly", async () => {
    // Mock of the ApolloClient
    const mockClient = new ApolloClient({
      link: new HttpLink({ uri: "http://localhost:3001/graphql" }),
      cache: new InMemoryCache(),
    });

    render(
      <MemoryRouter>
        <ApolloProvider client={mockClient}>
          <App />
        </ApolloProvider>
      </MemoryRouter>,
    );

    // Wait for datafetching to complete
    const header = await screen.findByRole("banner");
    expect(header).toBeInTheDocument();
  });
});
