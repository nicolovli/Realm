import { useEffect, useState } from "react";

interface MediaQueryListWithListeners extends MediaQueryList {
  addListener(
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void,
  ): void;
  removeListener(
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void,
  ): void;
}

// Returns true when viewport is at least minWidth (e.g., 1024 for lg)
// Includes Safari/WebView fallback for matchMedia listeners.
export function useMinWidth(minWidth: number) {
  const getMatch = () =>
    typeof window === "undefined"
      ? false
      : window.matchMedia(`(min-width:${minWidth}px)`).matches;

  const [ok, setOk] = useState<boolean>(getMatch);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(min-width:${minWidth}px)`);

    const handler = () => setOk(mql.matches);
    handler();

    // addEventListener fallback
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else (mql as MediaQueryListWithListeners).addListener(handler);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else (mql as MediaQueryListWithListeners).removeListener(handler);
    };
  }, [minWidth]);

  return ok;
}
