import { Router } from "express";
import {
  readJsonFile,
  writeJsonFile,
  DATA_PATH,
  ensureDataDir,
} from "../utils/file-io.js";

export const dataRouter = Router();

// GET /api/data - Read saved data
dataRouter.get("/", async (req, res) => {
  try {
    await ensureDataDir();

    try {
      const data = await readJsonFile(DATA_PATH);
      res.json(data);
    } catch {
      // Return empty object if file doesn't exist
      res.json({});
    }
  } catch (error) {
    console.error("[GET /api/data] Error:", error);
    res.status(500).json({
      error: "Failed to read data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/data/sync - Save data
dataRouter.post("/sync", async (req, res) => {
  try {
    await ensureDataDir();

    const data = req.body;
    await writeJsonFile(DATA_PATH, data);

    res.json({ success: true });
  } catch (error) {
    console.error("[POST /api/data/sync] Error:", error);

    if (error instanceof SyntaxError) {
      return res.status(400).json({
        error: "Invalid JSON",
        message: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to save data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
