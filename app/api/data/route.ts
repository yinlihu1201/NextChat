import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile, DATA_PATH, ensureDataDir } from "./utils";

/**
 * GET /api/data - Read saved data
 */
export async function GET() {
  try {
    await ensureDataDir();

    try {
      const data = await readJsonFile(DATA_PATH);
      return NextResponse.json(data);
    } catch {
      // Return empty object if file doesn't exist
      return NextResponse.json({});
    }
  } catch (error) {
    console.error("[GET /api/data] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to read data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/data/sync - Save data
 */
export async function POST(req: NextRequest) {
  try {
    await ensureDataDir();

    const data = await req.json();
    await writeJsonFile(DATA_PATH, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/data] Error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Invalid JSON",
          message: (error as Error).message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to save data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
