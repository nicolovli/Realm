// App.test.tsx
import { render } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("../index.css", () => ({}));

describe("App Component", () => {
  it("renders header and routes correctly", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
  });
});
