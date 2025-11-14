// Keeps URL, React state, and transition status in sync for the results filters UI.

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SortOptionValue } from "@/constants/resultFiltersConstants";
import {
  parseOrder,
  parsePage,
  parseSelectedFilters,
  parseSort,
} from "@/lib/utils/resultFiltersHelpers";
import type { FilterKey, SelectedFilters } from "@/types/FilterTypes";
import type { UseResultFiltersStateReturn } from "@/types/HookTypes";

export const useResultFiltersState = (
  searchQuery?: string,
): UseResultFiltersStateReturn => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isPending, startTransition] = useTransition();
  const suppressReadRef = useRef(false);
  const initialSearchRef = useRef(location.search);

  const initialParams = useMemo(
    () => new URLSearchParams(initialSearchRef.current),
    [],
  );

  const initialSort = useMemo(() => parseSort(initialParams), [initialParams]);

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(() =>
    parseSelectedFilters(initialParams),
  );
  const [sortOption, setSortOption] = useState<SortOptionValue>(
    () => initialSort,
  );
  const [order, setOrder] = useState<"asc" | "desc">(() =>
    parseOrder(initialParams, initialSort),
  );
  const [currentPage, setCurrentPage] = useState<number>(() =>
    parsePage(initialParams),
  );

  useEffect(() => {
    if (suppressReadRef.current) {
      suppressReadRef.current = false;
      return;
    }

    const params = new URLSearchParams(location.search);
    const nextFilters = parseSelectedFilters(params);
    const nextSort = parseSort(params);
    const nextOrder = parseOrder(params, nextSort);
    const nextPage = parsePage(params);

    setSelectedFilters((prev) => {
      const keys = Object.keys(prev) as FilterKey[];
      const changed = keys.some((key) => {
        const current = prev[key];
        const next = nextFilters[key];
        if (current.length !== next.length) return true;
        for (let i = 0; i < current.length; i++) {
          if (current[i] !== next[i]) return true;
        }
        return false;
      });
      return changed ? nextFilters : prev;
    });

    setSortOption((prev) => (prev !== nextSort ? nextSort : prev));
    setOrder((prev) => (prev !== nextOrder ? nextOrder : prev));
    setCurrentPage((prev) => (prev !== nextPage ? nextPage : prev));
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (searchQuery) params.set("search", searchQuery);
    else params.delete("search");

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) params.set(key, values.join(","));
      else params.delete(key);
    });

    params.set("sort", sortOption);
    params.set("order", order);

    if (currentPage > 1) params.set("page", String(currentPage));
    else params.delete("page");

    const nextSearch = params.toString();
    const currentSearch = location.search.startsWith("?")
      ? location.search.slice(1)
      : location.search;

    if (nextSearch !== currentSearch) {
      suppressReadRef.current = true;
      navigate({ search: nextSearch }, { replace: true });
    }
  }, [
    selectedFilters,
    sortOption,
    order,
    currentPage,
    searchQuery,
    navigate,
    location.search,
  ]);

  return {
    selectedFilters,
    setSelectedFilters,
    sortOption,
    setSortOption,
    order,
    setOrder,
    currentPage,
    setCurrentPage,
    isPending,
    startTransition,
  };
};
