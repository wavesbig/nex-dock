# nex-dock（Trae 项目规则）

## 项目定位

- 本项目是 Next.js App Router 应用骨架，包含 Tailwind UI、Zustand 状态管理示例、Prisma + SQLite 数据层、Docker/Compose 部署示例。
- 代码以 TypeScript 为主（`tsconfig.json` 开启 `strict`）。

## 工作区与路径约定

- 路径别名：使用 `@/*` 指向项目根目录（见 `tsconfig.json` 的 `paths`）。
- 路由与页面：放在 `app/**`（App Router）。
- 通用模块：放在 `lib/**`（例如 `lib/utils.ts`）。
- 客户端交互组件：放在 `components/**`，文件顶部添加 `"use client"`（仅在需要时）。

## 状态管理（Zustand）

- 统一使用 vanilla store：`zustand/vanilla` 的 `createStore` 创建 store。
- store 放置位置：
  - 全局/跨路由复用：`lib/stores/**`
  - 仅路由私有：可就近放在 `app/<segment>/_stores/**`
- 订阅方式：在 Client Component 中用 `useStore(store, selector)`（来自 `zustand`）。
- 避免在 store 文件中直接依赖 React（避免把 hook 与 store 强耦合）。

## UI 与样式

- 使用 Tailwind CSS v4，全局样式在 `app/globals.css`。
- shadcn/ui 组件目录：`components/ui/**`
  - eslint 默认忽略该目录（见 `eslint.config.mjs` 的 `globalIgnores`）。
- `react-grid-layout@2.x`：
  - 全局 CSS 需在根布局引入：`app/layout.tsx` 中包含
    - `react-grid-layout/css/styles.css`
    - `react-resizable/css/styles.css`
  - v2 组件参数差异：使用 `gridConfig`（而不是旧版的 `cols`、`rowHeight` props）。

## 数据层（Prisma + SQLite）

- Prisma schema：`prisma/schema.prisma`
- Prisma Client 输出目录：`app/generated/prisma`（被 `.gitignore` 忽略）
  - 需要在构建/启动前确保已生成：`npx prisma generate`
- 数据库连接：
  - 通过 `DATABASE_URL` 注入（见 `prisma.config.ts` 与 `app/lib/prisma.ts`）
  - 本地建议：`DATABASE_URL="file:./dev.db"`
  - 容器建议：`DATABASE_URL="file:/app/data/dev.db"`

## Hydration 规则

- `app/layout.tsx` 的 `<body>` 已设置 `suppressHydrationWarning`，用于抑制浏览器扩展注入属性导致的 hydration mismatch。
- 不要随意移除该配置；如需移除，先确认无扩展/注入导致的属性差异。

## 代码风格与约束

- 优先遵循现有文件风格与目录约定。
- 不引入未在 `package.json` 中存在的新库，除非需求明确且必要。
- 不在仓库中提交密钥或 `.env` 内容（`.env*` 在 `.gitignore` 中）。

## 常用命令（本项目已验证）

- 安装依赖：`npm install`
- 开发：`npm run dev`
- lint：`npm run lint`
- 类型检查：`npx tsc -p tsconfig.json --noEmit`
- 构建：`npm run build`
- 启动（生产）：`npm run start`

## Docker/Compose

- 构建并启动：`docker compose up --build`
- 自动迁移：
  - `docker-entrypoint.sh` 默认执行 `npx prisma migrate deploy`
  - 通过 `RUN_MIGRATIONS=false` 关闭

## 变更交付要求

- 涉及功能改动时，必须在交付前运行：
  - `npm run lint`
  - `npx tsc -p tsconfig.json --noEmit`
  - `npm run build`
