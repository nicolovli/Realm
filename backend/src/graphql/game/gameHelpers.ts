import { GameWithRelations, GameFilter } from "./gameTypes.js";
import { Prisma } from "@prisma/client";

// Map relations -> names
export function mapGameRelations<T extends { name: string }>(
  relations: T[],
): string[] {
  return relations.map((r) => r.name);
}

export function transformGame(game: GameWithRelations) {
  return {
    ...game,
    developers: mapGameRelations(game.developers),
    publishers: mapGameRelations(game.publishers),
    platforms: mapGameRelations(game.platforms),
    tags: mapGameRelations(game.tags),
    languages: mapGameRelations(game.languages),
    categories: mapGameRelations(game.categories),
    genres: mapGameRelations(game.genres),
  };
}

export function normalizeSearchTerm(search: string): string {
  return search
    .trim()
    .replace(/[®™©]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Build precise Prisma where-chunks for search
export function buildSearchConditions(
  searchTerm: string,
): Prisma.GameWhereInput[] {
  const words = searchTerm
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (words.length === 1) {
    const word = words[0];
    return [
      { name: { contains: word, mode: "insensitive" } },
      {
        publishers: { some: { name: { contains: word, mode: "insensitive" } } },
      },
      { tags: { some: { name: { contains: word, mode: "insensitive" } } } },
    ];
  }

  return [
    {
      AND: words.map<Prisma.GameWhereInput>((word) => ({
        name: { contains: word, mode: "insensitive" },
      })),
    },
  ];
}

export function buildWhereFromFilter(
  filter?: GameFilter,
  search?: string,
): Prisma.GameWhereInput {
  const where: Prisma.GameWhereInput = {};

  // Search
  if (search && search.trim().length > 0) {
    const originalSearch = search.trim();
    const normalizedSearch = normalizeSearchTerm(search);

    const orConditions = [
      ...buildSearchConditions(originalSearch),
      ...buildSearchConditions(normalizedSearch),
    ];

    if (orConditions.length > 0) {
      // OR expects Enumerable<GameWhereInput>
      where.OR = orConditions;
    }
  }

  // Filters
  if (filter) {
    const andFilters: Prisma.GameWhereInput[] = [];

    const requireAllValues = (
      field: keyof Prisma.GameWhereInput,
      values: string[],
    ) =>
      values.map<Prisma.GameWhereInput>((v) => {
        // dynamic relation field objects need a cast through unknown
        return {
          [field as string]: { some: { name: v } },
        } as unknown as Prisma.GameWhereInput;
      });

    if (filter.tags?.length)
      andFilters.push(...requireAllValues("tags", filter.tags));
    if (filter.categories?.length)
      andFilters.push(...requireAllValues("categories", filter.categories));
    if (filter.developers?.length)
      andFilters.push(...requireAllValues("developers", filter.developers));
    if (filter.genres?.length)
      andFilters.push(...requireAllValues("genres", filter.genres));
    if (filter.publishers?.length)
      andFilters.push(...requireAllValues("publishers", filter.publishers));
    if (filter.platforms?.length)
      andFilters.push(...requireAllValues("platforms", filter.platforms));
    if (filter.languages?.length)
      andFilters.push(...requireAllValues("languages", filter.languages));

    if (andFilters.length > 0) {
      where.AND = andFilters;
    }
  }

  return where;
}

export function planForSort(
  sortBy?: string | null,
  sortOrder?: "asc" | "desc" | null,
): {
  orderBy: Prisma.GameOrderByWithRelationInput[];
  fields: Array<{
    field:
      | "name"
      | "publishedStore"
      | "avgRating"
      | "popularityScore"
      | "hasRatings"
      | "id";
    dir: "asc" | "desc";
  }>;
} {
  let dir: "asc" | "desc" =
    sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "desc";

  switch (sortBy) {
    case "alphabetical": {
      if (!sortOrder) dir = "asc";
      return {
        orderBy: [{ name: dir }, { id: "desc" }],
        fields: [
          { field: "name", dir },
          { field: "id", dir: "desc" },
        ],
      };
    }
    case "release-date": {
      return {
        orderBy: [{ publishedStore: dir }, { id: "desc" }],
        fields: [
          { field: "publishedStore", dir },
          { field: "id", dir: "desc" },
        ],
      };
    }
    case "rating": {
      return {
        orderBy: [
          { hasRatings: "desc" },
          { avgRating: dir },
          { name: "asc" },
          { id: "desc" },
        ],
        fields: [
          { field: "hasRatings", dir: "desc" },
          { field: "avgRating", dir },
          { field: "name", dir: "asc" },
          { field: "id", dir: "desc" },
        ],
      };
    }
    case "popularity":
    default: {
      return {
        orderBy: [{ popularityScore: dir }, { name: "asc" }, { id: "desc" }],
        fields: [
          { field: "popularityScore", dir },
          { field: "name", dir: "asc" },
          { field: "id", dir: "desc" },
        ],
      };
    }
  }
}

export const gameIncludes: Prisma.GameInclude = {
  developers: true,
  publishers: true,
  platforms: true,
  tags: true,
  languages: true,
  categories: true,
  genres: true,
};

type SortableField =
  | "name"
  | "publishedStore"
  | "avgRating"
  | "popularityScore"
  | "hasRatings"
  | "id";

type CursorRow = {
  id: number;
  name?: string | null;
  publishedStore?: Date | null;
  avgRating?: number | null;
  popularityScore?: number | null;
  hasRatings?: boolean | null;
};

export const serializeField = (fname: SortableField, g: CursorRow): string => {
  switch (fname) {
    case "publishedStore":
      return g.publishedStore ? g.publishedStore.toISOString() : "";
    case "avgRating":
      return g.avgRating != null ? String(g.avgRating) : "";
    case "popularityScore":
      return g.popularityScore != null ? String(g.popularityScore) : "";
    case "hasRatings":
      return g.hasRatings ? "1" : "0";
    case "name":
      return g.name ?? "";
    case "id":
      return String(g.id);
    default:
      return "";
  }
};

const parseForCompare = (
  fname: SortableField,
  raw: string,
): string | number | Date | null => {
  if (fname === "id") return Number(raw || 0);
  if (fname === "avgRating" || fname === "popularityScore")
    return raw ? Number(raw) : null;
  if (fname === "publishedStore") return raw ? new Date(raw) : null;
  return raw;
};

// Utility: check if a where has an empty AND array (used for skipping branches)
const hasEmptyAnd = (w: Prisma.GameWhereInput): boolean => {
  const maybeAnd = (w as { AND?: unknown }).AND;
  return Array.isArray(maybeAnd) && maybeAnd.length === 0;
};

// Boolean-aware comparator for hasRatings in the lexicographic chain
const booleanBranch = (
  field: "hasRatings",
  dir: "asc" | "desc",
  raw: string,
  mode: "equals" | "advance",
): Prisma.GameWhereInput => {
  const val = raw === "1";
  if (mode === "equals") {
    return { [field]: { equals: val } } as unknown as Prisma.GameWhereInput;
  }

  // "advance" limb (strictly after this boolean value)
  if (dir === "desc") {
    // DESC: true > false; strictly less than current
    return val
      ? ({ hasRatings: { equals: false } } as unknown as Prisma.GameWhereInput)
      : ({ AND: [] } as unknown as Prisma.GameWhereInput);
  } else {
    // ASC: false < true; strictly greater than current
    return !val
      ? ({ hasRatings: { equals: true } } as unknown as Prisma.GameWhereInput)
      : ({ AND: [] } as unknown as Prisma.GameWhereInput);
  }
};

// Build OR-of-ANDs lexicographic comparator for (after:) respecting dir and types
export const tupleAfterToWhere = (
  schema: Array<{ field: SortableField; dir: "asc" | "desc" }>,
  values: string[],
): Prisma.GameWhereInput => {
  const oneCmp = (
    f: SortableField,
    dir: "asc" | "desc",
    op: "gt" | "lt" | "equals",
    raw: string,
  ): Prisma.GameWhereInput => {
    if (f === "hasRatings") {
      if (op === "equals")
        return booleanBranch("hasRatings", dir, raw, "equals");
      return booleanBranch("hasRatings", dir, raw, "advance");
    }
    const val = parseForCompare(f, raw);
    return f === "publishedStore"
      ? ({ publishedStore: { [op]: val } } as unknown as Prisma.GameWhereInput)
      : ({ [f]: { [op]: val } } as unknown as Prisma.GameWhereInput);
  };

  const or: Prisma.GameWhereInput[] = [];
  for (let i = 0; i < schema.length; i++) {
    const andParts: Prisma.GameWhereInput[] = [];
    for (let j = 0; j < i; j++) {
      andParts.push(
        oneCmp(schema[j].field, schema[j].dir, "equals", values[j]),
      );
    }
    const op: "gt" | "lt" = schema[i].dir === "desc" ? "lt" : "gt";
    const branch = oneCmp(schema[i].field, schema[i].dir, op, values[i]);

    // skip empty boolean-advance limbs
    if (hasEmptyAnd(branch)) {
      // no-op
    } else {
      andParts.push(branch);
      or.push({ AND: andParts });
    }
  }

  return or.length
    ? { OR: or }
    : ({ AND: [{ id: { lt: 0 } }] } as Prisma.GameWhereInput);
};
