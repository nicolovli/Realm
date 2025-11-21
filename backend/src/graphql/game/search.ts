import type { Prisma } from "@prisma/client";
import { prisma } from "../../db.js";
import { normalizeSearchTerm } from "./gameHelpers.js";

const ci = (value: string): Prisma.StringFilter => ({
  contains: value,
  mode: "insensitive",
});

const si = (value: string): Prisma.StringFilter => ({
  startsWith: value,
  mode: "insensitive",
});

const nameFilters = (value: string): Prisma.GameWhereInput[] => [
  { name: ci(value) },
  { name: si(value) },
];

const buildNameOnlyWhere = (words: string[]): Prisma.GameWhereInput | null => {
  if (!words.length) return null;
  if (words.length === 1) {
    return { OR: nameFilters(words[0]) };
  }

  return {
    AND: words.map<Prisma.GameWhereInput>((word) => ({
      name: ci(word),
    })),
  };
};

type Boosts = {
  publisherIds?: number[];
  tagIds?: number[];
};

// Build a flexible search clause that can match by name, publisher names or tags.
function buildSearchWhereBase(
  qRaw?: string | null,
  boosts?: Boosts,
): Prisma.GameWhereInput {
  const q = qRaw?.trim();
  if (!q) return {};

  const norm = normalizeSearchTerm(q);
  const words = norm.split(/\s+/).filter(Boolean);
  const nameOnly = buildNameOnlyWhere(words);
  const nameOrRel = (value: string): Prisma.GameWhereInput => ({
    OR: [
      ...nameFilters(value),
      { publishers: { some: { name: ci(value) } } },
      { publishers: { some: { name: si(value) } } },
      { tags: { some: { name: ci(value) } } },
      { tags: { some: { name: si(value) } } },
    ],
  });

  const base =
    nameOnly && words.length === 1 ? nameOrRel(words[0]) : (nameOnly ?? {});

  const extras: Prisma.GameWhereInput[] = [];
  if (boosts?.publisherIds?.length) {
    extras.push({
      publishers: { some: { id: { in: boosts.publisherIds } } },
    });
  }
  if (boosts?.tagIds?.length) {
    extras.push({
      tags: { some: { id: { in: boosts.tagIds } } },
    });
  }

  return extras.length ? { OR: [base, ...extras] } : base;
}

type SearchMode = "none" | "prefixIds" | "containsIds";

export async function buildSearchWhere(
  qRaw?: string | null,
  mode: SearchMode = "prefixIds",
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
      if (branch) {
        orNameBranches.push(branch);
      }
    }

    const base =
      orNameBranches.length === 0
        ? {}
        : orNameBranches.length === 1
          ? orNameBranches[0]!
          : ({ OR: orNameBranches } as Prisma.GameWhereInput);

    const orFilters = terms.map((term) => ({
      name: { contains: term, mode: "insensitive" },
    }));

    const publisherWhere =
      orFilters.length > 0
        ? ({ OR: orFilters } as Prisma.PublisherWhereInput)
        : undefined;
    const tagWhere =
      orFilters.length > 0
        ? ({ OR: orFilters } as Prisma.TagWhereInput)
        : undefined;

    const MAX_REL_MATCHES = 200;
    const [pubs, tags] = await Promise.all([
      publisherWhere
        ? prisma.publisher.findMany({
            where: publisherWhere,
            select: { id: true },
            take: MAX_REL_MATCHES,
          })
        : [],
      tagWhere
        ? prisma.tag.findMany({
            where: tagWhere,
            select: { id: true },
            take: MAX_REL_MATCHES,
          })
        : [],
    ]);

    const extras: Prisma.GameWhereInput[] = [];
    if (pubs.length) {
      extras.push({
        publishers: { some: { id: { in: pubs.map((p) => p.id) } } },
      });
    }
    if (tags.length) {
      extras.push({
        tags: { some: { id: { in: tags.map((t) => t.id) } } },
      });
    }

    if (!extras.length) return base;
    const hasBase = base && Object.keys(base).length > 0;
    if (!hasBase) {
      return extras.length === 1 ? extras[0]! : { OR: extras };
    }
    return { OR: [base, ...extras] };
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
