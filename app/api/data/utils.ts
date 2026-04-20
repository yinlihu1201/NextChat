import { readFile, writeFile, mkdir, access } from "fs/promises";
import path from "path";

// Data directory configuration - use environment variable or fallback to local directory
export const DATA_DIR =
  process.env.DATA_DIR || path.join(process.cwd(), "data");
export const DATA_PATH = path.join(DATA_DIR, "account-data.json");

/**
 * Ensure data directory exists, create if not
 */
export async function ensureDataDir(): Promise<void> {
  try {
    await access(DATA_DIR);
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Read and parse JSON file
 * @param filePath - File path to read
 * @returns Parsed object
 */
export async function readJsonFile<T = any>(filePath: string): Promise<T> {
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content) as T;
}

/**
 * Write object to JSON file (2-space indent)
 * @param filePath - File path to write
 * @param data - Object to write
 */
export async function writeJsonFile<T = any>(
  filePath: string,
  data: T,
): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  await writeFile(filePath, content, "utf-8");
}
