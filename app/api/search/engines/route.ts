import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type EngineSeed = {
  key: string;
  name: string;
  url: string;
  sort: number;
};

const DEFAULT_ENGINES: EngineSeed[] = [
  {
    key: "bing",
    name: "Bing",
    url: "https://www.bing.com/search?q={q}",
    sort: 10,
  },
  {
    key: "baidu",
    name: "百度",
    url: "https://www.baidu.com/s?wd={q}",
    sort: 20,
  },
  {
    key: "google",
    name: "Google",
    url: "https://www.google.com/search?q={q}",
    sort: 30,
  },
];

async function ensureDefaults() {
  const count = await prisma.searchEngine.count();
  if (count > 0) return;
  try {
    await prisma.searchEngine.createMany({ data: DEFAULT_ENGINES });
  } catch {}
  await prisma.searchSetting.upsert({
    where: { id: 1 },
    create: { id: 1, selectedEngineKey: DEFAULT_ENGINES[0].key },
    update: {},
  });
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function GET() {
  await ensureDefaults();
  const engines = await prisma.searchEngine.findMany({
    orderBy: [{ sort: "asc" }, { key: "asc" }],
    select: { key: true, name: true, url: true, sort: true },
  });
  return NextResponse.json({ engines });
}

export async function POST(req: Request) {
  await ensureDefaults();
  const body = (await req.json().catch(() => null)) as {
    key?: unknown;
    name?: unknown;
    url?: unknown;
  } | null;

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  const requestedKey = typeof body?.key === "string" ? body.key.trim() : "";

  if (!name || !url || !url.includes("{q}")) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  let key = slugify(requestedKey || name);
  if (!key) key = `engine-${Date.now()}`;

  const exists = await prisma.searchEngine.findUnique({ where: { key } });
  if (exists) key = `${key}-${Math.random().toString(16).slice(2, 6)}`;

  const maxSort = await prisma.searchEngine
    .aggregate({ _max: { sort: true } })
    .then((r) => r._max.sort ?? 0);

  const created = await prisma.searchEngine.create({
    data: {
      key,
      name,
      url,
      sort: maxSort + 10,
    },
    select: { key: true, name: true, url: true, sort: true },
  });

  return NextResponse.json({ engine: created }, { status: 201 });
}
