// Manages the in-memory + session-storage cursor map used for pagination caching.
import { useCallback, useRef } from "react";
import {
  loadCursorCache,
  saveCursorCache,
} from "@/lib/utils/resultFiltersHelpers";
import type { CursorEntry, CursorCache } from "@/types";

type UseCursorCacheArgs = {
  cacheKey: string;
  currentPage: number;
};

export const useCursorCache = ({
  cacheKey,
  currentPage,
}: UseCursorCacheArgs): CursorCache => {
  const cursorByPage = useRef<Map<number, CursorEntry>>(new Map());
  const hydratedCacheKeyRef = useRef<string | null>(null);

  if (hydratedCacheKeyRef.current !== cacheKey) {
    const restored = loadCursorCache(cacheKey);
    cursorByPage.current = restored?.cursors?.length
      ? new Map(restored.cursors)
      : new Map();
    hydratedCacheKeyRef.current = cacheKey;
  }

  const persist = useCallback(
    (options?: { currentPage?: number }) => {
      saveCursorCache(cacheKey, {
        updatedAt: Date.now(),
        currentPage: options?.currentPage ?? currentPage,
        cursors: Array.from(cursorByPage.current.entries()),
      });
    },
    [cacheKey, currentPage],
  );

  const clear = useCallback(
    (options?: { resetPage?: number }) => {
      cursorByPage.current.clear();
      persist({ currentPage: options?.resetPage ?? 1 });
    },
    [persist],
  );

  return { cursorByPage, persist, clear };
};
