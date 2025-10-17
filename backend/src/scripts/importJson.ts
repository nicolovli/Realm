// scripts/importJson.ts (TypeScript)
import fs from "fs";
import path from "path";
import sanitizeHtml from "sanitize-html";
import { prisma } from "../db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function cleanHtmlToText(html?: string) {
  if (!html) return null;
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
  return text.replace(/\s+/g, " ").trim();
}

function truncateToWords(text: string | null, maxChars = 350) {
  if (!text) return null;
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

function mapToConnectOrCreate(arr: unknown[]) {
  return arr.map((name) => ({
    where: { name: String(name) },
    create: { name: String(name) },
  }));
}

// // Helper function to convert to string or null
// function toStringOrNull(val: unknown): string | null {
//   if (val === undefined || val === null || val === "") return null;
//   return String(val);
// }

function toArray(val: unknown): string[] {
  if (!val) return [];

  // If it's already an array, convert each item to string
  if (Array.isArray(val)) {
    return val.map((v) => String(v)).filter(Boolean);
  }

  // If it's a string, split by comma
  return String(val)
    .split(",")
    .map((s) => String(s).trim())
    .filter(Boolean);
}

async function main() {
  const filePath = path.join(__dirname, "..", "..", "db", "steamdb.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const items = JSON.parse(raw);

  for (const item of items) {
    const sid = Number(item.sid);
    if (Number.isNaN(sid)) continue;

    const descriptionHtml = item.description ?? null;
    const descriptionText = cleanHtmlToText(descriptionHtml);
    const descriptionShort = truncateToWords(descriptionText, 350);

    const developers = toArray(item.developers);
    const publishers = toArray(item.publishers);
    const platforms = toArray(item.platforms);
    const languages = toArray(item.languages);
    const categories = toArray(item.categori || item.categories);
    const genres = toArray(item.genre || item.genres);
    const tags = toArray(item.tags);

    const name = String(item.name);
    const image = item.image ? String(item.image) : null;

    if (sid <= 1000) {
      console.log(`sid=${sid}, genres raw:`, item.genre, item.genres);
      console.log(`sid=${sid}, genres processed:`, genres);
    }

    // Upsert (create if missing, update if exists)
    await prisma.game.upsert({
      where: { sid },
      update: {
        name,
        image,
        descriptionHtml,
        descriptionText,
        descriptionShort,
        publishedStore: item.published_store
          ? new Date(item.published_store)
          : null,
        developers: { connectOrCreate: mapToConnectOrCreate(developers) },
        publishers: { connectOrCreate: mapToConnectOrCreate(publishers) },
        platforms: { connectOrCreate: mapToConnectOrCreate(platforms) },
        languages: { connectOrCreate: mapToConnectOrCreate(languages) },
        categories: { connectOrCreate: mapToConnectOrCreate(categories) },
        genres: { connectOrCreate: mapToConnectOrCreate(genres) },
        tags: { connectOrCreate: mapToConnectOrCreate(tags) },
      },
      create: {
        sid,
        name,
        image,
        descriptionHtml,
        descriptionText,
        descriptionShort,
        publishedStore: item.published_store
          ? new Date(item.published_store)
          : null,
        developers: { connectOrCreate: mapToConnectOrCreate(developers) },
        publishers: { connectOrCreate: mapToConnectOrCreate(publishers) },
        platforms: { connectOrCreate: mapToConnectOrCreate(platforms) },
        languages: { connectOrCreate: mapToConnectOrCreate(languages) },
        categories: { connectOrCreate: mapToConnectOrCreate(categories) },
        genres: { connectOrCreate: mapToConnectOrCreate(genres) },
        tags: { connectOrCreate: mapToConnectOrCreate(tags) },
      },
    });

    console.log(`Upserted sid=${sid} name=${name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
