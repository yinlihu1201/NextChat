import { NextResponse } from "next/server";
import {
  readJsonFile,
  writeJsonFile,
  DATA_PATH,
  ensureDataDir,
} from "../../utils/file-io";
import { getLocalAppState, AppState } from "../../utils/sync";

// GET /api/data - 读取保存的数据
export async function GET() {
  try {
    await ensureDataDir();

    try {
      const data = await readJsonFile<AppState>(DATA_PATH);
      return NextResponse.json(data);
    } catch (error) {
      // 文件不存在时返回默认 AppState
      const defaultState = getLocalAppState();
      return NextResponse.json(defaultState);
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

// POST /api/data/sync - 保存数据
export async function POST(request: Request) {
  try {
    await ensureDataDir();

    const data: AppState = await request.json();
    await writeJsonFile(DATA_PATH, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/data/sync] Error:", error);

    if (error instanceof SyntaxError) {
      // JSON parse error
      return NextResponse.json(
        { error: "Invalid JSON", message: error.message },
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
