import { prisma } from "@/lib/prisma";
import { SearchEngine } from "@/types/search.dto";

// Repository 只负责单纯的数据库读写，不包含业务逻辑校验

export const searchRepo = {
  // --- Engines ---

  async countEngines() {
    return prisma.searchEngine.count();
  },

  async getMaxSort() {
    const res = await prisma.searchEngine.aggregate({ _max: { sort: true } });
    return res._max.sort ?? 0;
  },

  async getEngines() {
    return prisma.searchEngine.findMany({
      orderBy: [{ sort: "asc" }, { key: "asc" }],
    });
  },

  async findFirstEngine() {
    return prisma.searchEngine.findFirst({
      orderBy: [{ sort: "asc" }, { key: "asc" }],
    });
  },

  async findEngineByKey(key: string) {
    return prisma.searchEngine.findUnique({ where: { key } });
  },

  async upsertEngine(engine: SearchEngine) {
    return prisma.searchEngine.upsert({
      where: { key: engine.key },
      create: engine,
      update: {}, // 如果已存在则不覆盖
    });
  },

  async createEngine(data: SearchEngine) {
    return prisma.searchEngine.create({
      data,
    });
  },

  // --- Settings ---

  async findSetting() {
    return prisma.searchSetting.findUnique({ where: { id: 1 } });
  },

  async upsertSetting(selectedEngineKey: string) {
    return prisma.searchSetting.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        selectedEngineKey,
      },
      update: {},
    });
  },

  async updateSetting(selectedEngineKey: string) {
    return prisma.searchSetting.update({
      where: { id: 1 },
      data: { selectedEngineKey },
    });
  },
};
