import { searchRepo } from "@/repositories/search.repo";
import {
  CreateEngineDTO,
  SearchEngine,
  UpdateSettingsDTO,
} from "@/types/search.dto";

// Service 层负责业务逻辑、校验、默认值处理

const DEFAULT_ENGINES: SearchEngine[] = [
  {
    key: "bing",
    name: "Bing",
    url: "https://www.bing.com/search?q={q}",
    sort: 10,
  },
  {
    key: "baidu",
    name: "百度",
    url: "https://www.baidu.com/s?wd={q}",
    sort: 20,
  },
  {
    key: "google",
    name: "Google",
    url: "https://www.google.com/search?q={q}",
    sort: 30,
  },
];

export const searchService = {
  /**
   * 确保默认数据存在
   */
  async ensureDefaults() {
    const count = await searchRepo.countEngines();
    if (count === 0) {
      try {
        for (const engine of DEFAULT_ENGINES) {
          await searchRepo.upsertEngine(engine);
        }
      } catch (error) {
        console.error("Failed to initialize default engines:", error);
      }
    }

    try {
      const setting = await searchRepo.findSetting();
      if (!setting) {
        const firstEngine = await searchRepo.findFirstEngine();
        const defaultKey = firstEngine?.key ?? DEFAULT_ENGINES[0].key;
        await searchRepo.upsertSetting(defaultKey);
      }
    } catch (error) {
      // Ignore P2002 (Unique constraint) for concurrent requests
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: string }).code === "P2002"
      ) {
        return;
      }
      console.error("Failed to ensure search settings:", error);
    }
  },

  /**
   * 获取所有搜索引擎
   */
  async getEngines(): Promise<SearchEngine[]> {
    await this.ensureDefaults();
    const engines = await searchRepo.getEngines();
    return engines.map((e) => ({
      key: e.key,
      name: e.name,
      url: e.url,
      sort: e.sort,
    }));
  },

  /**
   * 创建搜索引擎
   */
  async createEngine(dto: CreateEngineDTO): Promise<SearchEngine> {
    await this.ensureDefaults();

    const name = dto.name?.trim() || "";
    const url = dto.url?.trim() || "";
    const requestedKey = dto.key?.trim() || "";

    if (!name) throw new Error("name_required");
    if (!url) throw new Error("url_required");
    if (!this.isValidUrl(url)) {
      throw new Error("invalid_url_format");
    }

    let key = this.slugify(requestedKey || name);
    if (!key) key = `engine-${Date.now()}`;

    // 检查冲突
    const exists = await searchRepo.findEngineByKey(key);
    if (exists) {
      if (requestedKey && this.slugify(requestedKey) === key) {
        throw new Error("key_already_exists");
      }
      // 为自动生成的 key 解决冲突
      key = `${key}-${Math.random().toString(16).slice(2, 6)}`;
    }

    const maxSort = await searchRepo.getMaxSort();
    const nextSort = maxSort + 10;

    const newEngine = {
      key,
      name,
      url,
      sort: nextSort,
    };

    const created = await searchRepo.createEngine(newEngine);
    return {
      key: created.key,
      name: created.name,
      url: created.url,
      sort: created.sort,
    };
  },

  /**
   * 获取设置
   */
  async getSettings() {
    await this.ensureDefaults();
    const setting = await searchRepo.findSetting();
    return setting ? { selectedEngineKey: setting.selectedEngineKey } : null;
  },

  /**
   * 更新设置
   */
  async updateSettings(dto: UpdateSettingsDTO) {
    // 校验 engine key 是否存在
    const engines = await searchRepo.getEngines();
    const exists = engines.some((e) => e.key === dto.selectedEngineKey);
    if (!exists) {
      throw new Error(`Engine with key "${dto.selectedEngineKey}" not found.`);
    }

    const updated = await searchRepo.updateSetting(dto.selectedEngineKey);
    return { selectedEngineKey: updated.selectedEngineKey };
  },

  // --- Utils ---

  isValidUrl(url: string): boolean {
    try {
      const u = new URL(url.replace("{q}", "test"));
      return (
        url.includes("{q}") &&
        (u.protocol === "http:" || u.protocol === "https:")
      );
    } catch {
      return false;
    }
  },

  slugify(input: string): string {
    return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
  },
};
