// Throttles a rapidly changing string and only emits it after the delay elapses.
import { useEffect, useState } from "react";

export const useDebouncedValue = (value: string, delay = 200) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};
