"use client";

import { useEffect } from "react";
import { initAutoSync, loadFromServer } from "../utils/auto-sync";

export function AutoSync() {
  useEffect(() => {
    // 应用启动时从服务器加载数据
    loadFromServer().then(() => {
      // 加载完成后初始化自动同步
      initAutoSync();
    });
  }, []);

  return null; // 这个组件不渲染任何内容
}
