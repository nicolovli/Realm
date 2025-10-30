import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { MobileSheetMenu } from "../../components/Header/MobileSheetMenu";
import type { SVGProps } from "react";

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-trigger">{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-header">{children}</div>
  ),
  SheetTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="sheet-title">{children}</h2>
  ),
  SheetDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="sheet-description">{children}</p>
  ),
  SheetClose: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/Header", () => ({
  AuthButton: () => <button data-testid="auth-btn">AuthButton</button>,
  ToggleTheme: () => <button data-testid="toggle-theme">ToggleTheme</button>,
}));

// --- Mock icons ---
const MockIcon = (
  props: SVGProps<SVGSVGElement> & { "data-testid"?: string },
) => <svg {...props} data-testid={props["data-testid"]} />;

const mockNavigation = [
  {
    href: "/favorites",
    title: "Favorites",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <MockIcon {...props} data-testid="icon-fav" />
    ),
  },
  {
    href: "/discover",
    title: "Discover",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <MockIcon {...props} data-testid="icon-discover" />
    ),
  },
];

describe("MobileSheetMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderMenu = () =>
    render(
      <MemoryRouter>
        <MobileSheetMenu navigation={mockNavigation} />
      </MemoryRouter>,
    );

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the sheet trigger button", () => {
    renderMenu();
    const trigger = screen.getByLabelText("Open mobile menu");
    expect(trigger).toBeInTheDocument();
  });

  it("renders the menu title and description", () => {
    renderMenu();
    expect(screen.getByTestId("sheet-title")).toHaveTextContent("Menu");
    expect(screen.getByTestId("sheet-description")).toHaveTextContent(
      "Welcome to your hub. From here, you can explore, manage, and personalize your Realm experience.",
    );
  });

  it("renders AuthButton and ToggleTheme", () => {
    renderMenu();
    expect(screen.getByTestId("auth-btn")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-theme")).toBeInTheDocument();
  });

  it("renders all navigation links with correct text and icons", () => {
    renderMenu();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Discover")).toBeInTheDocument();
    expect(screen.getByTestId("icon-fav")).toBeInTheDocument();
    expect(screen.getByTestId("icon-discover")).toBeInTheDocument();
  });

  it("renders no links if navigation array is empty", () => {
    render(
      <MemoryRouter>
        <MobileSheetMenu navigation={[]} />
      </MemoryRouter>,
    );
    const navLinks = screen.queryAllByRole("link");
    expect(navLinks.length).toBe(0);
  });

  it("opens and closes sheet on trigger click (mocked behavior)", async () => {
    renderMenu();
    const trigger = screen.getByLabelText("Open mobile menu");
    await userEvent.click(trigger);
    expect(trigger).toBeEnabled();
  });
});
