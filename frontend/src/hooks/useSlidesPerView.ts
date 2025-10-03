interface MediaQueryListWithListeners extends MediaQueryList {
  addListener(
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void,
  ): void;
  removeListener(
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void,
  ): void;
}

import { useEffect, useState } from "react";

/**
 * Breakpoints aligned with index.css:
 * - Tablet: 600px
 * - Desktop: 1024px
 */
const queries = {
  desktop: "(min-width: 1024px)",
  tablet: "(min-width: 600px)",
};

export function useSlidesPerView() {
  const [spv, setSpv] = useState<number>(1);

  useEffect(() => {
    const mqlDesktop = window.matchMedia(queries.desktop);
    const mqlTablet = window.matchMedia(queries.tablet);

    const compute = () => {
      if (mqlDesktop.matches) return setSpv(3); // desktop and up
      if (mqlTablet.matches) return setSpv(2); // tablet
      setSpv(1); // mobile
    };

    compute();

    const onChange = () => compute();

    if (mqlDesktop.addEventListener) {
      mqlDesktop.addEventListener("change", onChange);
      mqlTablet.addEventListener("change", onChange);
    } else {
      // Safari / older WebViews fallback
      (mqlDesktop as MediaQueryListWithListeners).addListener(onChange);
      (mqlTablet as MediaQueryListWithListeners).addListener(onChange);
    }

    return () => {
      if (mqlDesktop.removeEventListener) {
        mqlDesktop.removeEventListener("change", onChange);
        mqlTablet.removeEventListener("change", onChange);
      } else {
        (mqlDesktop as MediaQueryListWithListeners).removeListener(onChange);
        (mqlTablet as MediaQueryListWithListeners).removeListener(onChange);
      }
    };
  }, []);

  return spv;
}
