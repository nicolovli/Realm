import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MobileSearchMenu } from "../../components/Header";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import type { RefObject } from "react";

describe("MobileSearchMenu", () => {
  const setup = (
    isOpen: boolean,
    triggerRef: RefObject<HTMLButtonElement | null> = { current: null },
  ) => {
    const onClose = vi.fn();
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <MobileSearchMenu
            isOpen={isOpen}
            onClose={onClose}
            triggerRef={triggerRef}
          />
        </MemoryRouter>
      </MockedProvider>,
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
    // Check that SearchBar is rendered inside the menu
    expect(screen.getByLabelText("Search for games")).toBeInTheDocument();
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
