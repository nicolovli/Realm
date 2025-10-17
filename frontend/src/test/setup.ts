// test/setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

/* ---------- matchMedia: make it look like desktop (hover-capable) ---------- */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => {
    const isAnyHover = query.includes("(any-hover: hover)");
    const isCoarse = query.includes("(pointer: coarse)");
    // desktop-like defaults
    const matches = isAnyHover ? true : isCoarse ? false : false;

    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(), // legacy
      removeListener: vi.fn(), // legacy
      dispatchEvent: vi.fn(),
    };
  }),
});

/* ------------------------------- ResizeObserver ---------------------------- */
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: MockResizeObserver,
});

/* ----------------------------- IntersectionObserver ------------------------ */
class MockIntersectionObserver {
  root: Element | Document | null = null;
  rootMargin = "";
  thresholds: number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});
// Some libs read from global instead of window:
Object.defineProperty(global, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});
