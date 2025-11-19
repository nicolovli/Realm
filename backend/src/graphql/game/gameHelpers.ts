import { GameWithRelations, GameFilter } from "./index.js";
import { Prisma } from "@prisma/client";

// Map relations -> names
export function mapGameRelations<T extends { name: string }>(
  relations: T[],
): string[] {
  return relations.map((r) => r.name);
}

const safeMap = <T extends { name: string }>(rel?: T[]) =>
  Array.isArray(rel) ? rel.map((r) => r.name) : [];

export function transformGame(game: GameWithRelations) {
  return {
    ...game,
    developers: safeMap(game.developers),
    publishers: safeMap(game.publishers),
    platforms: safeMap(game.platforms),
    tags: safeMap(game.tags),
    languages: safeMap(game.languages),
    categories: safeMap(game.categories),
    genres: safeMap(game.genres),
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
  // Search combines normalized (symbol-stripped) and raw tokens to catch names
  // with symbols while still hitting indexed text when possible.
  const where: Prisma.GameWhereInput = {};

  // Search (normalized + raw if changed)
  const raw = search?.trim();
  if (raw) {
    const norm = normalizeSearchTerm(raw);
    const orConds = [
      ...buildSearchConditions(norm),
      ...(norm !== raw ? buildSearchConditions(raw) : []),
    ];
    if (orConds.length) where.OR = orConds;
  }

  // Filters
  if (filter) {
    const andFilters: Prisma.GameWhereInput[] = [];
    const requireAllValues = (
      field: keyof Prisma.GameWhereInput,
      values: string[],
    ) =>
      // For each selected value, require at least one matching relation row.
      // AND-ing these ensures “must include ALL selected tags/platforms/etc.”.
      values.map<Prisma.GameWhereInput>(
        (v) =>
          ({
            [field as string]: { some: { name: v } },
          }) as unknown as Prisma.GameWhereInput,
      );

    if (filter.tags?.length)
      andFilters.push(...requireAllValues("tags", filter.tags));
    if (filter.categories?.length)
      andFilters.push(...requireAllValues("categories", filter.categories));
    if (filter.genres?.length)
      andFilters.push(...requireAllValues("genres", filter.genres));
    if (filter.publishers?.length)
      andFilters.push(...requireAllValues("publishers", filter.publishers));
    if (filter.platforms?.length)
      andFilters.push(...requireAllValues("platforms", filter.platforms));
    if (filter.languages?.length)
      andFilters.push(...requireAllValues("languages", filter.languages));

    if (andFilters.length) where.AND = andFilters;
  }

  return where;
}

export function planForSort(
  // Tie-breakers matter for stable pagination: every branch ends with { id: 'desc' }.
  // Rating sort: put unrated games after rated ones (hasRatings DESC) before sorting by avgRating.
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

export const gameListSelect: Prisma.GameSelect = {
  id: true,
  sid: true,
  name: true,
  image: true,
  descriptionShort: true,
  publishedStore: true,
  avgRating: true,
  reviewsCount: true,
  favoritesCount: true,
  popularityScore: true,
  hasRatings: true,
  publishers: { select: { name: true } },
};

export const gameDetailSelect: Prisma.GameSelect = {
  ...gameListSelect,
  developers: { select: { name: true } },
  platforms: { select: { name: true } },
  tags: { select: { name: true } },
  languages: { select: { name: true } },
  categories: { select: { name: true } },
  genres: { select: { name: true } },
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
  avgRating?: number | Prisma.Decimal | null;
  popularityScore?: number | Prisma.Decimal | null;
  hasRatings?: boolean | null;
};

export const serializeField = (fname: SortableField, g: CursorRow): string => {
  switch (fname) {
    case "publishedStore":
      return g.publishedStore ? g.publishedStore.toISOString() : "";
    case "avgRating":
      return g.avgRating != null ? g.avgRating.toString() : "";
    case "popularityScore":
      return g.popularityScore != null ? g.popularityScore.toString() : "";
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
): string | number | Date | Prisma.Decimal | null => {
  if (fname === "id") return Number(raw || 0);
  if (fname === "avgRating" || fname === "popularityScore")
    return raw ? new Prisma.Decimal(raw) : null;
  if (fname === "publishedStore") return raw ? new Date(raw) : null;
  return raw;
};

const hasEmptyAnd = (w: Prisma.GameWhereInput): boolean => {
  // Helper used by cursor-building to discard no-op boolean branches.
  const maybeAnd = (w as { AND?: unknown }).AND;
  return Array.isArray(maybeAnd) && maybeAnd.length === 0;
};

// Boolean-aware comparator for hasRatings in the lexicographic chain
const booleanBranch = (
  // Special-case boolean in lexicographic comparisons:
  // hasRatings DESC means true > false; to advance strictly "after", we generate
  // the appropriate equals/advance limb.
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

export const tupleAfterToWhere = (
  // Build an OR-of-ANDs that encodes “strictly after (k1,v1),(k2,v2),…”
  // for mixed-type keys and dir. This mirrors SQL tuple comparison:
  // (a,b,c) > (va,vb,vc)  =>  a>va OR (a=va AND b>vb) OR (a=va AND b=vb AND c>vc)
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

    if (f === "avgRating" && raw) {
      console.log(
        `[cursor] avgRating: raw="${raw}" -> val=${val}, op=${op}, dir=${dir}`,
      );
    }

    if (val === null) {
      if (op === "equals") {
        return { [f]: { equals: null } } as unknown as Prisma.GameWhereInput;
      }
      return { AND: [] } as unknown as Prisma.GameWhereInput;
    }

    return f === "publishedStore"
      ? ({ publishedStore: { [op]: val } } as Prisma.GameWhereInput)
      : ({ [f]: { [op]: val } } as Prisma.GameWhereInput);
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

const isEmptyWhere = (where?: Prisma.GameWhereInput): boolean =>
  !where || Object.keys(where as Record<string, unknown>).length === 0;

export const whereClauses = (
  ...clauses: Array<Prisma.GameWhereInput | null | undefined>
): Prisma.GameWhereInput => {
  const filtered = clauses.filter((clause): clause is Prisma.GameWhereInput =>
    Boolean(clause && !isEmptyWhere(clause)),
  );

  if (!filtered.length) return {};
  if (filtered.length === 1) return filtered[0];
  return { AND: filtered };
};
