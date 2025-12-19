import { http } from "@/lib/http";
import {
  CreateEngineDTO,
  CreateEngineResponse,
  GetEnginesResponse,
  GetSettingsResponse,
  UpdateSettingsDTO,
  UpdateSettingsResponse,
} from "@/types/search.dto";

const BASE_URL = "/api/search";

/**
 * 获取所有可用的搜索引擎
 */
export async function getSearchEngines(
  signal?: AbortSignal
): Promise<GetEnginesResponse> {
  return http<GetEnginesResponse>(`${BASE_URL}/engines`, { signal });
}

/**
 * 创建新的搜索引擎
 */
export async function createSearchEngine(
  data: CreateEngineDTO
): Promise<CreateEngineResponse> {
  return http<CreateEngineResponse>(`${BASE_URL}/engines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * 获取当前的搜索设置
 */
export async function getSearchSettings(
  signal?: AbortSignal
): Promise<GetSettingsResponse> {
  return http<GetSettingsResponse>(`${BASE_URL}/settings`, { signal });
}

/**
 * 更新搜索设置（例如选中的搜索引擎）
 */
export async function updateSearchSettings(
  data: UpdateSettingsDTO
): Promise<UpdateSettingsResponse> {
  return http<UpdateSettingsResponse>(`${BASE_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * 获取初始化数据（并发请求引擎列表和设置）
 * 包含容错处理：如果设置加载失败，不会影响引擎列表的显示
 */
export async function fetchInitialSearchData(signal?: AbortSignal) {
  const [enginesRes, settingsRes] = await Promise.allSettled([
    getSearchEngines(signal),
    getSearchSettings(signal),
  ]);

  // 核心数据：如果引擎列表加载失败，则抛出错误
  if (enginesRes.status === "rejected") {
    throw enginesRes.reason;
  }

  // 次要数据：如果设置加载失败，降级处理（使用默认值/空值）
  if (settingsRes.status === "rejected") {
    console.warn("Failed to load search settings:", settingsRes.reason);
  }

  return {
    engines: enginesRes.value.engines,
    selectedEngineKey:
      settingsRes.status === "fulfilled"
        ? settingsRes.value.selectedEngineKey
        : null,
  };
}
