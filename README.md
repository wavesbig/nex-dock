# 1. 项目概述

- 项目名称：`nex-dock`
- 项目目标：
  - 提供一个基于 Next.js App Router 的前端应用骨架
  - 内置可扩展的状态管理（Zustand）
  - 内置 SQLite + Prisma 的数据层与容器化部署方案（Docker / Compose）
- 核心功能（当前仓库内已具备）：
  - Next.js 16 + React 19 的 App Router 页面渲染（示例：`app/page.tsx`）
  - Zustand（vanilla store）状态管理示例（`lib/stores/counter-store.ts` + `components/counter-demo.tsx`）
  - `gridstack.js` 可拖拽/缩放网格布局示例（`components/grid-layout-demo.tsx`）
  - Prisma + SQLite 数据模型与迁移（`prisma/schema.prisma` + `prisma/migrations/**`）
  - Docker 多阶段构建与 docker-compose 数据持久化（`Dockerfile`、`docker-compose.yml`）

# 2. 技术架构

## 技术栈

- 语言：TypeScript（`tsconfig.json`，`strict: true`）
- 框架：Next.js `16.0.10`（App Router）
- UI：
  - Tailwind CSS v4（`app/globals.css` + `postcss.config.mjs`）
  - Radix UI Slot（`@radix-ui/react-slot`）
  - shadcn/ui 配置（`components.json`，UI 组件位于 `components/ui/**`）
- 状态管理：Zustand `5.x`（推荐 vanilla store + `useStore` 订阅）
- 数据库：SQLite
- ORM：Prisma `7.x`
  - Client 输出到 `app/generated/prisma`（见 `prisma/schema.prisma` 的 `generator client`）
  - 连接方式：`@prisma/adapter-better-sqlite3`（见 `app/lib/prisma.ts`）
- 部署：Docker / Docker Compose

## 系统架构图（文字描述）

```text
Browser
  ↓ HTTP
Next.js (App Router)
  ├─ Server Components / Route Handlers（当前未提供 API 路由）
  ├─ Client Components（Zustand / gridstack 等交互组件）
  └─ Data Layer（PrismaClient + better-sqlite3 adapter）
         ↓
      SQLite 文件（本地：./dev.db；容器：/app/data/dev.db）
```

## 关键模块

- 页面与布局：
  - `app/layout.tsx`：全局布局与全局样式引入；并对 `<body>` 使用 `suppressHydrationWarning`
  - `app/page.tsx`：首页示例，包含计数器与网格布局 demo
- 组件：
  - `components/counter-demo.tsx`：Zustand 状态 demo
  - `components/grid-layout-demo.tsx`：`gridstack` demo
  - `components/ui/**`：shadcn/ui 风格的基础 UI 组件（eslint 默认忽略该目录）
- 状态管理：
  - `lib/stores/counter-store.ts`：`createStore` 创建的 vanilla store（可复用在 RSC/CSR 场景）
- 数据层：
  - `prisma/schema.prisma`：Prisma schema（User/Post 示例模型）
  - `prisma/migrations/**`：数据库迁移文件
  - `app/lib/prisma.ts`：PrismaClient 初始化（better-sqlite3 adapter）
  - `app/test.ts`：简单的 Prisma 查询脚本示例（用于连通性验证）

# 3. 部署说明

## 环境要求

- Node.js：建议 `>= 20`（Docker 镜像基于 `node:20-bookworm-slim`）
- 包管理器：npm（仓库提供 `package-lock.json`）
- 可选：Docker（用于容器化部署）

## 安装步骤（本地开发）

1. 安装依赖：`npm install`
2. 配置环境变量（推荐创建 `.env`）：
   - `DATABASE_URL="file:./dev.db"`
3. 初始化/迁移数据库（可选）：
   - 开发迁移：`npx prisma migrate dev`
   - 生成客户端：`npx prisma generate`

## 启动方式

- 开发模式：
  - `npm run dev`
  - 访问 `http://localhost:3000`
- 生产构建与启动：
  - `npm run build`
  - `npm run start`

## Docker / Compose 部署

- 构建并启动：
  - `docker compose up --build`
- 数据持久化：
  - `docker-compose.yml` 将 SQLite 映射到 `/app/data/dev.db` 并通过 volume 持久化
- 自动迁移：
  - `docker-entrypoint.sh` 默认执行 `npx prisma migrate deploy`
  - 如需关闭：将环境变量 `RUN_MIGRATIONS` 设为 `"false"`

# 4. 代码结构

## 目录结构

```text
app/                    Next.js App Router
  lib/prisma.ts          Prisma 客户端初始化
  layout.tsx             根布局（全局 CSS / hydration 处理）
  page.tsx               首页
  globals.css            Tailwind v4 全局样式
components/              业务/演示组件
  ui/                    shadcn/ui 组件（eslint 默认忽略）
  counter-demo.tsx       Zustand demo
  grid-layout-demo.tsx   gridstack demo
lib/                     通用工具与 store
  stores/                Zustand vanilla store
prisma/                  Prisma schema 与 migrations
public/                  静态资源
Dockerfile               多阶段构建镜像
docker-compose.yml       compose 部署（sqlite volume 持久化）
```

## 核心文件

- `package.json`：脚本与依赖版本（`dev/build/start/lint`）
- `eslint.config.mjs`：eslint 配置（Next core-web-vitals + TypeScript）
- `tsconfig.json`：TS 配置（严格模式、路径别名 `@/*`）
- `prisma.config.ts`：Prisma CLI 配置（从 `DATABASE_URL` 读取）

# 5. 接口文档（如适用）

当前仓库未实现 Next.js Route Handlers（`app/api/**/route.ts`），因此暂无对外 API 端点。

建议的 API 组织方式（示例路径）：

- `app/api/health/route.ts`：健康检查
- `app/api/users/route.ts`：用户 CRUD（配合 Prisma `User` 模型）

请求/响应示例（建议）：

- `GET /api/health`
  - 响应：`{ "ok": true }`

# 6. 测试说明

- 测试方法：
  - 当前仓库未配置单元测试/集成测试框架
  - 现有质量检查命令：
    - `npm run lint`
    - `npx tsc -p tsconfig.json --noEmit`
  - 构建校验：
    - `npm run build`
- 测试覆盖率：
  - 当前暂无覆盖率数据（未接入测试框架与 coverage 采集）

# 7. 维护指南

## 常见问题

- Hydration 警告（浏览器扩展向 `<body>` 注入属性导致 SSR/CSR 不一致）
  - 现状：`app/layout.tsx` 的 `<body>` 已设置 `suppressHydrationWarning`
  - 建议：排查并禁用会修改 DOM 的扩展，或仅对必要节点使用该属性
- Prisma Client 生成目录不在仓库内
  - 现状：`app/generated/prisma` 被 `.gitignore` 忽略
  - 解决：运行 `npx prisma generate` 后再启动/构建
- SQLite 路径不一致
  - 本地建议：`DATABASE_URL="file:./dev.db"`
  - 容器建议：`DATABASE_URL="file:/app/data/dev.db"`（由 `docker-compose.yml` 提供）

## 扩展建议

- 增加 Route Handlers（`app/api/**/route.ts`）提供 API 层
- 引入测试框架（如 Vitest/Jest + React Testing Library）并开启 coverage
- 为 `gridstack` demo 引入容器宽度自适应
- 将示例模块抽象为真实业务模块（例如：用户管理、文章发布等），复用 Prisma schema
