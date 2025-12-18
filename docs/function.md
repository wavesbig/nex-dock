1. 整体布局实现

- 采用 shadcn/ui 组件库构建响应式布局框架

- 实现顶部导航栏（包含内外网切换功能）

- 左侧设置面板（使用 shadcn 的 Sheet 组件）

- 主内容区拖拽画布（使用 react-grid-layout 实现拖拽功能）

2. 搜索功能模块

- 实现智能搜索框（使用 shadcn 的 Input 组件）

- 支持关键词实时检索（考虑使用 Fuse.js 或类似库）

- 搜索结果分类展示（区分小组件和图标）

3. 拖拽区域实现

- 将拖拽区域划分为两个子区域：

* 小组件区（Widgets）

* 图标区（Icons）

- 实现拖拽源（使用 DndKit 的 Draggable 组件）

- 实现放置目标区（使用 DndKit 的 Droppable 组件）

- 添加拖拽预览效果（使用 shadcn 的 Tooltip 组件）

4. 内外网切换功能

- 右上角添加切换开关（使用 shadcn 的 Switch 组件）

- 实现状态管理（考虑使用 Zustand）

- 根据网络状态自动过滤显示内容

5. 图标管理功能

- 实现手动添加图标功能：

* 支持 URL 输入自动获取 favicon

* 支持本地上传图标（使用 shadcn 的 FileInput 组件）

* 图标预览和裁剪功能

- 预留图标库 API 接入点（考虑使用 react-icons 或自定义图标库）

6. 设置面板

- 实现配置保存功能（使用 shadcn 的 Form 组件）

- 添加主题切换（使用 shadcn 的 ThemeProvider）

- 实现布局偏好设置

开发规范：

1. 严格遵循 shadcn/ui 的设计规范

2. 使用 TypeScript 确保类型安全

3. 状态管理使用 Zustand

4. 拖拽交互使用 DndKit 实现

5. 所有组件需支持暗黑/明亮模式

6. 实现完整的单元测试（使用 Vitest+Testing Library）

交付要求：

- 完整可运行的 React 应用

- 类型定义文件

- 组件文档（使用 Storybook）

- 测试覆盖率报告
