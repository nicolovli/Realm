import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleTheme } from "@/components/Header";

describe("ToggleTheme component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders light theme button by default", () => {
    render(<ToggleTheme />);
    const button = screen.getByRole("button", {
      name: /Switch to dark theme/i,
    });
    expect(button).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("renders stored theme from localStorage", () => {
    localStorage.setItem("theme", "dark");
    render(<ToggleTheme />);
    const button = screen.getByRole("button", {
      name: /Switch to light theme/i,
    });
    expect(button).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles theme on click and updates localStorage", async () => {
    render(<ToggleTheme />);
    const user = userEvent.setup();
    const button = screen.getByRole("button", {
      name: /Switch to dark theme/i,
    });

    // Click to switch to dark
    await user.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(button).toHaveAttribute("aria-label", "Switch to light theme");

    // Click again to switch to light
    await user.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
    expect(button).toHaveAttribute("aria-label", "Switch to dark theme");
  });
});
