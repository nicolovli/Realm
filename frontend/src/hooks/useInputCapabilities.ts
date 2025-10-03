interface MediaQueryListWithListeners extends MediaQueryList {
  addListener(
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void,
  ): void;
  removeListener(
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void,
  ): void;
}

import { useEffect, useState } from "react";

type Caps = {
  pointerCoarse: boolean;
  anyPointerCoarse: boolean;
  hover: boolean;
  anyHover: boolean;
};

export function useInputCapabilities(): Caps {
  const get = (): Caps => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return {
        pointerCoarse: false,
        anyPointerCoarse: false,
        hover: false,
        anyHover: false,
      };
    }
    const mq = (q: string) => window.matchMedia(q).matches;
    return {
      pointerCoarse: mq("(pointer: coarse)"),
      anyPointerCoarse: mq("(any-pointer: coarse)"),
      hover: mq("(hover: hover)"),
      anyHover: mq("(any-hover: hover)"),
    };
  };

  const [caps, setCaps] = useState<Caps>(get);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const queries = [
      "(pointer: coarse)",
      "(any-pointer: coarse)",
      "(hover: hover)",
      "(any-hover: hover)",
    ];
    const mqls = queries.map((q) => window.matchMedia(q));
    const handler = () => setCaps(get());

    mqls.forEach((mql) => {
      if (mql.addEventListener) mql.addEventListener("change", handler);
      else (mql as MediaQueryListWithListeners).addListener(handler);
    });

    return () => {
      mqls.forEach((mql) => {
        if (mql.removeEventListener) mql.removeEventListener("change", handler);
        else (mql as MediaQueryListWithListeners).removeListener(handler);
      });
    };
  }, []);

  return caps;
}
