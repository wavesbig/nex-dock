/**
 * 搜索引擎数据结构
 */
export interface SearchEngine {
  key: string;
  name: string;
  url: string;
  sort: number;
}

/**
 * 搜索设置数据结构
 */
export interface SearchSettings {
  selectedEngineKey: string | null;
}

// --- API 响应类型 ---

export interface GetEnginesResponse {
  engines: SearchEngine[];
}

export interface GetSettingsResponse {
  selectedEngineKey: string | null;
}

export interface CreateEngineResponse {
  engine: SearchEngine;
}

export interface UpdateSettingsResponse {
  selectedEngineKey: string | null;
}

// --- API 请求/DTO 类型 ---

export interface CreateEngineDTO {
  name: string;
  url: string;
  key?: string;
}

export interface UpdateSettingsDTO {
  selectedEngineKey: string;
}
