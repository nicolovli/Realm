import { Prisma } from "@prisma/client";

// Helper function to normalize search terms (same as game resolvers)
export function normalizeSearchTerm(search: string): string {
  return search
    .trim()
    .replace(/[®™©]/g, "") // Remove trademark symbols
    .replace(/[^\w\s]/g, " ") // Replace special chars with spaces
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim();
}

// Helper to build game where clause from filter, optionally excluding one filter-type
export function buildGameWhereExcludingType(
  filter: Record<string, string[]>,
  excludeType: string | undefined,
  q?: string,
  pubIds: number[] = [],
  tagIds: number[] = [],
): Prisma.GameWhereInput {
  const base: Prisma.GameWhereInput = {};

  // Apply filters except excludeType
  if (filter) {
    const andFilters: Prisma.GameWhereInput[] = [];

    function requireAllValues(field: string, values?: string[]): void {
      if (!values || !values.length) return;
      if (field === excludeType) return;
      andFilters.push(
        ...values.map(
          (v) =>
            ({
              [field]: { some: { name: v } },
            }) as unknown as Prisma.GameWhereInput,
        ),
      );
    }

    requireAllValues("tags", filter.tags);
    requireAllValues("categories", filter.categories);
    requireAllValues("genres", filter.genres);
    requireAllValues("publishers", filter.publishers);
    requireAllValues("platforms", filter.platforms);
    requireAllValues("languages", filter.languages);

    if (andFilters.length) base.AND = andFilters;
  }

  // Apply search as prefix matches (index-friendly) if present
  if (q) {
    const or: Prisma.GameWhereInput[] = [
      { name: { startsWith: q, mode: "insensitive" } } as Prisma.GameWhereInput,
    ];

    if (pubIds.length)
      or.push({
        publishers: { some: { id: { in: pubIds } } },
      } as Prisma.GameWhereInput);
    if (tagIds.length)
      or.push({
        tags: { some: { id: { in: tagIds } } },
      } as Prisma.GameWhereInput);

    const orObj = { OR: or } as unknown as Prisma.GameWhereInput;

    if (base.AND) {
      // base.AND can be single object or array -> normalize to array before pushing
      if (Array.isArray(base.AND))
        (base.AND as Prisma.GameWhereInput[]).push(orObj);
      else base.AND = [base.AND as Prisma.GameWhereInput, orObj];
    } else {
      // OR expects an array of GameWhereInput
      base.OR = or as unknown as Prisma.GameWhereInput[];
    }
  }

  return base;
}
