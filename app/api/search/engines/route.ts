import { searchService } from "@/services/search.service";
import { CreateEngineDTO, GetEnginesResponse } from "@/types/search.dto";
import { NextResponse } from "next/server";

/**
 * GET /api/search/engines
 */
export async function GET() {
  const engines = await searchService.getEngines();
  const response: GetEnginesResponse = { engines };
  return NextResponse.json(response);
}

/**
 * POST /api/search/engines
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as CreateEngineDTO | null;
    if (!body) {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const engine = await searchService.createEngine(body);
    return NextResponse.json({ engine }, { status: 201 });
  } catch (error) {
    const message = (error as Error)?.message ?? String(error);

    if (
      message === "name_required" ||
      message === "url_required" ||
      message === "invalid_url_format"
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (message === "key_already_exists") {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    console.error("Failed to create engine:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}
