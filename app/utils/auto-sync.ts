import { useChatStore, useAccessStore, useAppConfig } from "../store";
import { useMaskStore } from "../store/mask";
import { usePromptStore } from "../store/prompt";
import { useSyncStore } from "../store/sync";
import { getLocalAppState, setLocalAppState, AppState } from "./sync";

// Backend API URL - change port if backend runs on different port
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// Maximum retry attempts
const MAX_RETRIES = 3;
// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 1000;

let syncTimeout: NodeJS.Timeout | null = null;

/**
 * 防抖函数：在指定的延迟后执行，如果在此期间再次调用，则重置延迟
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 */
function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>) => {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }
    syncTimeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * 带重试的数据保存函数
 * @param data 要保存的数据
 * @param retries 当前重试次数
 */
async function saveDataWithRetry(data: any, retries = 0): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/data/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error("Save failed: success flag is false");
    }
  } catch (error) {
    console.error("[Auto-sync] Save error:", error);

    if (retries < MAX_RETRIES) {
      console.log(`[Auto-sync] Retrying... (${retries + 1}/${MAX_RETRIES})`);
      // 指数退避
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, retries) * 1000),
      );
      return saveDataWithRetry(data, retries + 1);
    }

    console.error("[Auto-sync] Max retries reached, giving up");
    // 不抛出异常，避免阻塞用户操作
  }
}

/**
 * 同步当前所有 stores 的数据到后端
 */
async function syncToServer(): Promise<void> {
  try {
    const appState = getLocalAppState();
    await saveDataWithRetry(appState);
  } catch (error) {
    console.error("[Auto-sync] Failed to sync:", error);
    // 静默失败，不抛出异常
  }
}

/**
 * 创建防抖的同步函数（只创建一次，避免重复订阅）
 */
const debouncedSync = debounce(syncToServer, DEBOUNCE_DELAY);

/**
 * 初始化自动同步：订阅所有 stores 的变化
 */
export function initAutoSync(): void {
  const stores = [
    useChatStore,
    useAccessStore,
    useAppConfig,
    useMaskStore,
    usePromptStore,
    useSyncStore,
  ];

  // 订阅每个 store 的变化
  stores.forEach((store) => {
    store.subscribe(() => {
      // 防抖同步到服务器
      debouncedSync();
    });
  });

  console.log("[Auto-sync] Initialized and monitoring all stores");
}

/**
 * 从服务器加载数据并合并到本地 stores
 */
export async function loadFromServer(): Promise<void> {
  try {
    console.log("[Auto-sync] Loading from server...");
    const response = await fetch(`${BACKEND_URL}/api/data`);
    console.log("[Auto-sync] Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const serverData = await response.json();
    console.log("[Auto-sync] Server data keys:", Object.keys(serverData));
    console.log(
      "[Auto-sync] Server data:",
      JSON.stringify(serverData).substring(0, 200),
    );

    // 检查是否有实际数据（非空对象）
    if (serverData && Object.keys(serverData).length > 0) {
      // 使用 setLocalAppState 将服务器数据设置到 stores
      setLocalAppState(serverData as AppState);
      console.log("[Auto-sync] Server data applied to stores");
    } else {
      console.log("[Auto-sync] No server data found, using default state");
    }
  } catch (error) {
    console.error("[Auto-sync] Failed to load from server:", error);
    // 加载失败时使用默认状态，不阻塞应用启动
  }
}
