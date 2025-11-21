// Best-effort utility to turn unknown values into Date instances for display.
export function toDate(v: unknown): Date | null {
  if (v instanceof Date) return v;
  if (typeof v === "number" && Number.isFinite(v)) return new Date(v);
  if (typeof v === "string") {
    const s = v.trim();
    if (/^\d+$/.test(s)) {
      const n = Number(s);
      return Number.isFinite(n) ? new Date(n) : null;
    }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}
