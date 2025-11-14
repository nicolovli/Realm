// src/utils/cacheKey.ts
import type { GameFilter } from "../game/index.js";

// Trim; return undefined if empty after trim
export function normalizeSearch(s?: string): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

// Dedup + sort each selected array; remove empty keys; return undefined if nothing left
export function normalizeFilter(
  filter?: Partial<GameFilter>,
): Partial<GameFilter> | undefined {
  if (!filter) return undefined;

  const out: Partial<Record<keyof GameFilter, string[]>> = {};

  (Object.keys(filter) as Array<keyof GameFilter>).forEach((k) => {
    const arr = filter[k];
    if (Array.isArray(arr) && arr.length) {
      const dedup = Array.from(
        new Set(arr.map((v) => String(v).trim()).filter(Boolean)),
      ).sort();
      if (dedup.length) out[k] = dedup;
    }
  });

  return Object.keys(out).length ? out : undefined;
}

// Stable stringify by recursively sorting object keys. Arrays are left as-is.
export function stableStringify(obj: unknown): string {
  const sorted = sortDeep(obj);
  return JSON.stringify(sorted);
}

// Recursively sort plain-object keys; leave arrays and primitives unchanged
function sortDeep<T>(val: T): T {
  if (val === null) return val;
  if (typeof val !== "object") return val;
  if (Array.isArray(val)) return val;

  const input = val as Record<string, unknown>;
  const entries = Object.entries(input)
    // drop undefined, null, and empty arrays to reduce key noise
    .filter(([, v]) => {
      if (v === undefined || v === null) return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    })
    .map(([k, v]) => [k, sortDeep(v)] as const)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  const out: Record<string, unknown> = {};
  for (const [k, v] of entries) out[k] = v;
  return out as T;
}
