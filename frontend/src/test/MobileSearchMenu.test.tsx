import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MobileSearchMenu } from "../components/Header";
import type { RefObject } from "react";

describe("MobileSearchMenu", () => {
  const setup = (
    isOpen: boolean,
    triggerRef: RefObject<HTMLButtonElement | null> = { current: null },
  ) => {
    const onClose = vi.fn();
    render(
      <MobileSearchMenu
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
      />,
    );
    return { onClose };
  };

  it("does not render when isOpen=false", () => {
    setup(false);
    expect(screen.queryByTestId("mobile-search-menu")).not.toBeInTheDocument();
  });

  it("renders search menu when isOpen=true", () => {
    setup(true);
    const menu = screen.getByTestId("mobile-search-menu");
    expect(menu).toBeInTheDocument();
    expect(
      screen.getByText(/Searchbar here for sprint 2/i),
    ).toBeInTheDocument();
  });

  it("closes when Escape key is pressed", async () => {
    const { onClose } = setup(true);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking outside", async () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    const triggerRef = { current: trigger };

    const { onClose } = setup(true, triggerRef);

    await userEvent.click(document.body);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not crash if triggerRef is null", () => {
    expect(() => setup(true, { current: null })).not.toThrow();
  });
});
