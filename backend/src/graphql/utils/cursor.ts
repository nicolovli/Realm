export type CursorFieldName =
  | "name"
  | "publishedStore"
  | "avgRating"
  | "popularityScore"
  | "hasRatings"
  | "id";

export type CursorField = { k: CursorFieldName; v: string };
export type CursorPayloadV2 = { v: 2; fields: CursorField[] };

// Encodes a v2 tuple cursor
export function encodeCursorTuple(fields: CursorField[]): string {
  const payload: CursorPayloadV2 = { v: 2, fields };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

// Decodes a v2 tuple cursor
export function decodeCursorTuple(c: string): CursorPayloadV2 {
  const parsed = JSON.parse(Buffer.from(c, "base64url").toString());
  if (!parsed || parsed.v !== 2 || !Array.isArray(parsed.fields)) {
    throw new Error("Invalid cursor");
  }
  return parsed as CursorPayloadV2;
}

// Return values in expected field order
export function valuesInOrder(
  decoded: CursorPayloadV2,
  expectedOrder: CursorFieldName[],
): string[] {
  const map = new Map<string, string>();
  for (const f of decoded.fields) map.set(f.k, f.v);
  return expectedOrder.map((k) => map.get(k) ?? "");
}
