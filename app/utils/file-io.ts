import { readFile, writeFile, mkdir, access } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_PATH = path.join(DATA_DIR, "account-data.json");

/**
 * 确保数据目录存在，如果不存在则创建
 */
export async function ensureDataDir(): Promise<void> {
  try {
    await access(DATA_DIR);
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * 读取并解析 JSON 文件
 * @param filePath 文件路径
 * @returns 解析后的对象
 */
export async function readJsonFile<T = any>(filePath: string): Promise<T> {
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content) as T;
}

/**
 * 将对象写入 JSON 文件（2-space indent）
 * @param filePath 文件路径
 * @param data 要写入的对象
 */
export async function writeJsonFile<T = any>(
  filePath: string,
  data: T,
): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  await writeFile(filePath, content, "utf-8");
}

// 导出常量供外部使用
export { DATA_DIR, DATA_PATH };
