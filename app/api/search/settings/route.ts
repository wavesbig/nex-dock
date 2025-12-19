import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

async function ensureDefaults() {
  const count = await prisma.searchEngine.count();
  if (count === 0) {
    try {
      await prisma.searchEngine.createMany({
        data: [
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
        ],
      });
    } catch {}
  }

  const first = await prisma.searchEngine.findFirst({
    orderBy: [{ sort: "asc" }, { key: "asc" }],
    select: { key: true },
  });

  await prisma.searchSetting.upsert({
    where: { id: 1 },
    create: { id: 1, selectedEngineKey: first?.key ?? null },
    update: {},
  });
}

export async function GET() {
  await ensureDefaults();
  const setting = await prisma.searchSetting.findUnique({
    where: { id: 1 },
    select: { selectedEngineKey: true },
  });
  return NextResponse.json({
    selectedEngineKey: setting?.selectedEngineKey ?? null,
  });
}

export async function PUT(req: Request) {
  await ensureDefaults();
  const body = (await req.json().catch(() => null)) as {
    selectedEngineKey?: unknown;
  } | null;

  const selectedEngineKey =
    typeof body?.selectedEngineKey === "string" ? body.selectedEngineKey : null;

  if (!selectedEngineKey) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const exists = await prisma.searchEngine.findUnique({
    where: { key: selectedEngineKey },
    select: { key: true },
  });
  if (!exists) {
    return NextResponse.json({ error: "engine_not_found" }, { status: 404 });
  }

  const updated = await prisma.searchSetting.upsert({
    where: { id: 1 },
    create: { id: 1, selectedEngineKey },
    update: { selectedEngineKey },
    select: { selectedEngineKey: true },
  });

  return NextResponse.json({ selectedEngineKey: updated.selectedEngineKey });
}
