import { searchService } from "@/services/search.service";
import {
  GetSettingsResponse,
  UpdateSettingsDTO,
  UpdateSettingsResponse,
} from "@/types/search.dto";
import { NextResponse } from "next/server";

/**
 * GET /api/search/settings
 */
export async function GET() {
  const setting = await searchService.getSettings();
  const response: GetSettingsResponse = {
    selectedEngineKey: setting?.selectedEngineKey ?? null,
  };
  return NextResponse.json(response);
}

/**
 * PUT /api/search/settings
 */
export async function PUT(req: Request) {
  try {
    const body = (await req
      .json()
      .catch(() => null)) as UpdateSettingsDTO | null;
    if (!body || !body.selectedEngineKey) {
      return NextResponse.json(
        { error: "selectedEngineKey_required" },
        { status: 400 }
      );
    }

    const updated = await searchService.updateSettings(body);
    const response: UpdateSettingsResponse = {
      selectedEngineKey: updated.selectedEngineKey,
    };
    return NextResponse.json(response);
  } catch (error) {
    const message = (error as Error)?.message ?? String(error);
    if (message.includes("not found")) {
      return NextResponse.json(
        { error: "engine_not_found", message },
        { status: 404 }
      );
    }

    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}
