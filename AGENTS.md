# AGENTS.md

## 项目概述

ArcaneEye 是一个专注于为《英雄联盟》大乱斗玩家提供极致、实时海克斯/出装选择辅助的专用 AI 智能体。

## 核心功能

- **选人阶段**：展示当前英雄池里的英雄胜率排名
- **海克斯选择**：展示该英雄海克斯胜率排名，方便玩家参考

## 平台约束

- **桌面框架**：Tauri (Rust 后端) + React (前端)
- **截图能力**：内置 SDR 截图，可选 HDR 增强
- **数据后端**：Supabase (PostgreSQL + pgvector)
- **AI 集成**：Vercel AI SDK + 多模态大模型

## 架构模块

| 模块 | 职责 |
|---|---|
| `src-tauri/` | Tauri Rust 后端，处理系统级操作和截图功能 |
| `src/` | React 前端，提供用户界面 |
| `src/components/` | React 组件库 |
| `src/hooks/` | 自定义 React Hooks |
| `src/services/` | API 服务和业务逻辑 |
| `src/stores/` | Zustand 状态管理 |
| `harness/` | 项目文档、配置、测试和脚本 |

## 编码约束

- 使用 TypeScript 进行类型安全开发
- 使用 Tailwind CSS 进行样式管理
- 使用 shadcn/ui 组件库保持 UI 一致性
- 使用 Zustand 进行状态管理
- 使用 Vercel AI SDK 集成 AI 功能
- 遵循 Conventional Commits 提交规范

## 验证命令

```bash
# 安装依赖
bun install

# 开发模式
bun run tauri dev

# 构建应用
bun run tauri build

# 运行测试
bun test

# 类型检查
bun run type-check

# 代码检查
bun run lint
```

## 提交规范

```
feat:  用户可见的新功能
fix:   缺陷修复
docs:  仅文档变更
chore: 构建、仓库维护
test:  仅测试变更
refactor: 代码重构（不改变功能）
style: 代码风格调整
perf:  性能优化
```

## 关键文件

- `harness/docs/project.md` — 项目详细文档
- `harness/README.md` — harness 层索引
- `src-tauri/tauri.conf.json` — Tauri 配置
- `package.json` — 前端依赖配置

## 特殊注意事项

1. **截图功能**：内置基本 SDR 截图能力，HDR 场景可选集成外部工具
2. **进程间通讯**：支持通过 HTTP API 与外部截图工具通信
3. **数据同步**：每天定时同步 ARAMGG 数据到本地数据库
4. **用户体验**：HUD 面板必须保持无干扰置顶，鼠标可穿透，自动隐藏功能