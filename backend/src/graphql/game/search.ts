// src/graphql/game/search.ts
import { Prisma } from "@prisma/client";
import { prisma } from "../../db.js";
import { normalizeSearchTerm } from "./gameHelpers.js";

export type SearchBoostMode = "none" | "prefixIds" | "containsIds";

// Unified search builder used by both games listing and filter options.
// - Normalizes query (strip symbols / collapse whitespace)
// - Single-word: (name contains|startsWith) OR (publisher/tag contains|startsWith)
// - Multi-word: AND over name tokens (prefix-friendly)
// - Optional “boosts”: add OR branches for publisher/tag IDs that prefix-match query.
//   (This keeps the WHERE sargable for indexes on relation names/ids.)

// Typed helpers so `mode` is correctly inferred as Prisma.QueryMode for each model
type ModelName = "Game" | "Publisher" | "Tag";
const ci = <M extends ModelName>(s: string): Prisma.StringFilter<M> => ({
  contains: s,
  mode: "insensitive",
});
const si = <M extends ModelName>(s: string): Prisma.StringFilter<M> => ({
  startsWith: s,
  mode: "insensitive",
});

const nameFilters = (s: string): Prisma.GameWhereInput[] => [
  { name: ci<"Game">(s) },
  { name: si<"Game">(s) },
];

const buildNameOnlyWhere = (words: string[]): Prisma.GameWhereInput | null => {
  if (!words.length) return null;
  if (words.length === 1) {
    return { OR: nameFilters(words[0]) };
  }
  return {
    AND: words.map<Prisma.GameWhereInput>((w) => ({ name: ci<"Game">(w) })),
  };
};

// Build a rich Game where-clause for search:
// name/publisher/tag: contains + startsWith
// multi-word: AND on name words
// optional relation ID boosts (publisherIds/tagIds)

function buildSearchWhereBase(
  qRaw: string,
  boosts?: { publisherIds?: number[]; tagIds?: number[] },
): Prisma.GameWhereInput {
  const q = qRaw?.trim();
  if (!q) return {};

  const norm = normalizeSearchTerm(q);
  const words = norm.split(/\s+/).filter(Boolean);

  const nameOnly = buildNameOnlyWhere(words);

  const nameOrRel = (s: string): Prisma.GameWhereInput => ({
    OR: [
      ...nameFilters(s),
      { publishers: { some: { name: ci<"Publisher">(s) } } },
      { publishers: { some: { name: si<"Publisher">(s) } } },
      { tags: { some: { name: ci<"Tag">(s) } } },
      { tags: { some: { name: si<"Tag">(s) } } },
    ],
  });

  const base: Prisma.GameWhereInput = nameOnly
    ? words.length === 1
      ? nameOrRel(words[0])
      : nameOnly
    : {};

  const extra: Prisma.GameWhereInput[] = [];
  if (boosts?.publisherIds?.length) {
    extra.push({ publishers: { some: { id: { in: boosts.publisherIds } } } });
  }
  if (boosts?.tagIds?.length) {
    extra.push({ tags: { some: { id: { in: boosts.tagIds } } } });
  }

  return extra.length ? { OR: [base, ...extra] } : base;
}

// Build search where-clause and (optionally) fetch relation-ID boosts.
// mode:
// "none": no ID boosts
// "prefixIds": boost games whose publisher/tag IDs match a prefix of the normalized query

export async function buildSearchWhere(
  qRaw: string | undefined,
  mode: SearchBoostMode = "prefixIds",
): Promise<Prisma.GameWhereInput> {
  if (!qRaw?.trim()) return {};
  if (mode === "none") return buildSearchWhereBase(qRaw);

  const norm = normalizeSearchTerm(qRaw);

  const terms = Array.from(new Set([norm, qRaw].filter(Boolean)));

  if (mode === "containsIds") {
    const orNameBranches: Prisma.GameWhereInput[] = [];
    for (const term of terms) {
      const tokens = term.split(/\s+/).filter(Boolean);
      const branch = buildNameOnlyWhere(tokens);
      if (branch) orNameBranches.push(branch);
    }

    const base =
      orNameBranches.length === 0
        ? {}
        : orNameBranches.length === 1
          ? orNameBranches[0]
          : ({ OR: orNameBranches } as Prisma.GameWhereInput);

    const orFilters = terms.map((term) => ({
      name: { contains: term, mode: "insensitive" as const },
    }));
    const whereClause = orFilters.length ? { OR: orFilters } : undefined;
    const MAX_REL_MATCHES = 200;

    const [pubs, tags] = await Promise.all([
      whereClause
        ? prisma.publisher.findMany({
            where: whereClause,
            select: { id: true },
            take: MAX_REL_MATCHES,
          })
        : [],
      whereClause
        ? prisma.tag.findMany({
            where: whereClause,
            select: { id: true },
            take: MAX_REL_MATCHES,
          })
        : [],
    ]);

    const extras: Prisma.GameWhereInput[] = [];
    if (pubs.length) {
      extras.push({
        publishers: {
          some: { id: { in: pubs.map((p) => p.id) } },
        },
      });
    }
    if (tags.length) {
      extras.push({
        tags: {
          some: { id: { in: tags.map((t) => t.id) } },
        },
      });
    }

    if (!extras.length) return base;
    return base && Object.keys(base).length
      ? ({ OR: [base, ...extras] } as Prisma.GameWhereInput)
      : extras.length === 1
        ? extras[0]
        : ({ OR: extras } as Prisma.GameWhereInput);
  }

  const [pubs, tags] = await Promise.all([
    prisma.publisher.findMany({
      where: { name: { startsWith: norm, mode: "insensitive" } },
      select: { id: true },
    }),
    prisma.tag.findMany({
      where: { name: { startsWith: norm, mode: "insensitive" } },
      select: { id: true },
    }),
  ]);

  const publisherIds = pubs.map((p) => p.id);
  const tagIds = tags.map((t) => t.id);

  return buildSearchWhereBase(qRaw, { publisherIds, tagIds });
}
