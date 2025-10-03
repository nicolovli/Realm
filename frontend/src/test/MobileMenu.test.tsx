import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { MobileMenu, useClickOutside } from "../components/Header";
import type { JSX, RefObject, SVGProps } from "react";

vi.mock("../components/Header/useClickOutside", () => ({
  useClickOutside: vi.fn(),
}));

const MockIcon = (
  props: SVGProps<SVGSVGElement> & { "data-testid"?: string },
) => <svg {...props} data-testid={props["data-testid"]} />;

type Item = {
  href: string;
  title: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

const mockItems: Item[] = [
  {
    href: "/favorites",
    title: "Favorites",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <MockIcon {...props} data-testid="icon-fav" />
    ),
  },
  {
    href: "/profile",
    title: "Profile",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <MockIcon {...props} data-testid="icon-profile" />
    ),
  },
];

describe("MobileMenu", () => {
  const setup = (
    isOpen: boolean,
    items = mockItems,
    triggerRef: RefObject<HTMLButtonElement | null> = { current: null },
  ) => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <MobileMenu
          isOpen={isOpen}
          onClose={onClose}
          triggerRef={triggerRef}
          items={items}
        />
      </MemoryRouter>,
    );
    return { onClose };
  };

  it("does not render when isOpen=false", () => {
    setup(false);
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });

  it("renders links when isOpen=true", () => {
    setup(true);
    const menu = screen.getByTestId("mobile-menu");
    expect(menu).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("closes when Escape is pressed", async () => {
    const { onClose } = setup(true);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("registers useClickOutside correctly", () => {
    const { onClose } = setup(true);
    expect(useClickOutside).toHaveBeenCalledWith(
      true,
      onClose,
      expect.any(Object),
      { current: null },
    );
  });

  it("keeps focus order within links when tabbing", async () => {
    setup(true);
    const user = userEvent.setup();
    const links = screen.getAllByRole("link");

    await user.tab();
    expect(links[0]).toHaveFocus();

    await user.tab();
    expect(links[1]).toHaveFocus();
  });

  it("renders nothing when items array is empty", () => {
    setup(true, []);
    const menu = screen.getByTestId("mobile-menu");
    expect(menu).toBeInTheDocument();
    expect(menu.querySelectorAll("a").length).toBe(0);
  });

  it("does not crash if triggerRef is null", () => {
    expect(() => setup(true, mockItems, { current: null })).not.toThrow();
  });
});
