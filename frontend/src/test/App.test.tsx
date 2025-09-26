import { render, screen } from "@testing-library/react";
import App from "../App";
import { expect, it } from "vitest";
import "@testing-library/jest-dom";

it("renders welcome message", () => {
  render(<App />);
  expect(screen.getByText(/Hello world!/i)).toBeInTheDocument();
});
