# ArcaneEye: 海克斯大乱斗 AI 助手项目文档

> **项目愿景：** 一个基于 Lumiere 硬核图形底层、专注于为《英雄联盟》大乱斗玩家提供极致、实时海克斯/出装选择辅助的专用 AI 智能体 (LOL ARAM Dedicated Agent)。

## 一、产品核心定位与功能范围

### 1. 核心场景
* **选人阶段：** 展示当前英雄池里的英雄胜率排名
* **海克斯选择：** 展示该英雄海克斯胜率排名，方便玩家参考

### 2. 核心链路流程
`全局快捷键触发 (Alt + Q)` ➔ `Lumiere 底层静默捕获 HDR 并完成色调映射` ➔ `上层外壳接收 SDR 图片并感知上下文` ➔ `触发固定大乱斗 RAG 接口 (如 ARAMGG)` ➔ `大模型多模态处理` ➔ `桌面 HUD 悬浮窗特效滑出反馈`。

### 3. 核心定位与优势
* **专用化定位：** 专注于"海克斯大乱斗助手"，将精力集中在选人与海克斯选择阶段（20-30 秒）的极致打磨。
* **硬核 HDR 破局：** 利用 Lumiere 解决 Windows 平台游戏开启 HDR 后截图疯狂发白的行业痛点，确保 VLM（视觉大模型）的图标识别率。

## 二、核心架构设计 (主从进程解耦)

项目采用 **Core-Shell（核-壳）** 架构。针对不同操作系统的图形底层痛点进行分平台差异化实现，而上层外壳保持技术栈统一。

### 1. 跨平台底层核心 (Core) 适配策略
* **Windows 平台：**
  - 运行 Lumiere (WinUI3 / C#)。
  - 职责：监听系统快捷键；调用现代图形 API (`Windows.Graphics.Capture`) 抓取 DirectX 渲染表面；进行色调映射 (Tone Mapping)，输出完美的 SDR 图片 (Base64)。
* **macOS 平台 (未来演进)：**
  - 免除独立 Core 进程，由 Tauri Rust 后端原生接管。
  - 职责：利用 macOS 原生的全时色彩管理 (ColorSync) 与 `ScreenCaptureKit` API，直接静默获取色彩精准、不发白的图像。

### 2. 进程间通讯 (IPC)
* 底层核心（Lumiere）启动后挂在后台，开启本地轻量级 HTTP 服务（监听 `localhost:18650`）。
* 上层外壳触发快捷键后，通过标准的 `fetch` 请求向本地接口索要截图，实现跨语言、跨进程的无缝联动。

### 3. 架构图
```text
ArcaneEye (Tauri)
  ├── 前端 UI（React）
  ├── 后端逻辑（Rust）
  └── 截图模块
       ├── 调用 Lumiere HTTP API（HDR 场景）
       └── 调用系统级 API（SDR 场景）

Lumiere (WinUI3/C#)
  └── HTTP Server (localhost:18650)
       └── /capture 接口
```

## 三、视觉与交互规范 (UI/UX)

### 1. 技术栈
* **CSS 框架：** Tailwind CSS
* **UI 组件库：** shadcn/ui
* **设计系统：** 待定（需要详细设计）

### 2. 智能交互幽灵层 (HUD Overlay)
* **无干扰置顶：** HUD 面板必须采用亚克力透明度（Acrylic）或幽灵层（Stealth Overlay）技术，保持鼠标可穿透（Click-through），绝对不夺取游戏窗口焦点。
* **高亮锁定：** 当模型识别出最佳选项时，直接在截图对应的选项周围渲染一个发光的魔法符文圈。
* **即刻归隐：** 核心输出面板具备自动隐藏功能（带有 5 秒倒计时进度条），点评结束即刻消失。

## 四、关键技术细节：固定数据链 (RAG)

* **固定数据绑定：** 针对该特定场景，无需解耦 RAG 插件系统。
* **数据来源：** 使用 ARAMGG 数据 API（`https://data.dtodo.cn`），每天同步数据到本地数据库。
* **动态数据流向：**
  1. 视觉大模型首先识别出截图中的英雄（如：瑞兹）。
  2. 触发外壳内置的 `fetchAramGGStats` 插件，异步请求外部大乱斗数据接口。
  3. 将最新的海克斯/出装胜率 JSON 数据与原始毒舌 Prompt 拼接，二次喂给大模型（如 Gemini 1.5 Flash）。
  4. 产出具备绝对时效性的高准确度回答。

## 五、技术栈选择

### 1. 前端技术栈
* **框架：** React + TypeScript
* **CSS 框架：** Tailwind CSS
* **UI 组件库：** shadcn/ui
* **状态管理：** Zustand
* **动效：** Framer Motion
* **AI 集成：** Vercel AI SDK

### 2. 后端与数据库
* **后端：** Supabase（无需自建）
* **数据库：** Supabase PostgreSQL + pgvector（支持向量存储）
* **数据同步：** 每天定时同步 ARAMGG 数据 API

### 3. 桌面框架
* **跨平台：** Tauri（Rust 后端）
* **Windows 特殊处理：** Lumiere（WinUI3 / C#）处理 HDR 截图

### 4. AI 模型
* **视觉识别：** Claude 3.5 Sonnet / GPT-4V
* **数据处理：** Gemini 1.5 Flash
* **RAG 实现：** Vercel AI SDK + pgvector

### 5. 开发环境
* **Node.js：** v24 LTS
* **包管理器：** bun
* **Rust：** 最新稳定版
* **Tauri CLI：** 最新版本
* **Supabase CLI：** 最新版本

## 六、MVP 开发路线图

### Phase 1：数据层搭建
* 申请 ARAMGG 数据 API Key
* 搭建 Supabase 数据库，设计数据表结构
* 实现每天定时同步 ARAMGG 数据到本地数据库
* 验证数据完整性和准确性

### Phase 2：核心功能开发
* 实现截图识别英雄功能（使用多模态大模型）
* 实现海克斯胜率数据查询
* 实现选人阶段英雄胜率排名展示
* 实现海克斯强化推荐功能

### Phase 3：UI 与交互
* 搭建 Tauri 桌面应用框架
* 实现基础 HUD 展示面板
* 实现大模型配置界面
* 实现 5 秒自动隐藏逻辑

### Phase 4：AI 集成与优化
* 优化 Prompt 链条，提升识别准确率
* 实现 RAG 增强，结合实时数据生成推荐
* 性能优化和用户体验改进

### Phase 5：联调与发布
* 联调联试，嚎哭深渊实战演练
* 修复 Bug，优化稳定性
* 打包发布 MVP 版本

## 七、Harness 层建设

### 1. 项目 Harness 层
* **文档管理：** 使用 harness 层统一管理项目文档，包括开发文档、配置文档等
* **配置管理：** 统一管理项目配置，包括环境变量、API Key 等
* **测试管理：** 统一管理测试用例和测试数据
* **构建管理：** 统一管理构建脚本和部署流程

### 2. Harness 层优势
* **文档集中管理：** 所有文档归类整理到 harness 层，便于查找和维护
* **配置统一管理：** 避免配置分散，提高配置管理效率
* **测试自动化：** 便于实现测试自动化和持续集成
* **构建标准化：** 统一构建流程，提高构建效率

## 八、项目结构

```text
ArcaneEye/
├── src-tauri/                    # Tauri Rust 代码
│   ├── src/
│   │   ├── main.rs              # 入口点
│   │   ├── lib.rs               # 库导出
│   │   └── commands/            # Tauri 命令
│   ├── Cargo.toml               # Rust 依赖
│   ├── tauri.conf.json          # Tauri 配置
│   └── icons/                   # 应用图标
├── src/                         # 前端代码（React）
│   ├── components/              # React 组件
│   ├── hooks/                   # 自定义 Hooks
│   ├── services/                # API 服务
│   ├── stores/                  # 状态管理
│   └── types/                   # TypeScript 类型
├── harness/                     # Harness 层
│   ├── docs/                    # 文档
│   ├── config/                  # 配置
│   ├── tests/                   # 测试
│   └── scripts/                 # 脚本
├── public/                      # 静态资源
├── package.json                 # 前端依赖
└── README.md                    # 项目说明
```

## 九、依赖列表

### 前端依赖
* **AI：** Vercel AI SDK
* **UI：** React + TypeScript + Tailwind CSS + shadcn/ui
* **状态管理：** Zustand
* **动效：** Framer Motion

### 后端依赖
* **Tauri CLI**
* **Supabase CLI**

## 十、配置文件

* **环境变量：** `.env.local`（存储 API Key 等敏感信息）
* **Tauri 配置：** `src-tauri/tauri.conf.json`
* **TypeScript 配置：** `tsconfig.json`
* **Tailwind 配置：** `tailwind.config.js`
* **ESLint 配置：** `eslint.config.js`
* **Prettier 配置：** `.prettierrc`

## 十一、开发流程

### 1. 开发阶段
* 本地开发，使用 Supabase 本地实例
* 热重载，快速迭代
* 使用 Tauri DevTools 调试

### 2. 测试阶段
* 单元测试：Vitest
* 端到端测试：Playwright
* 类型检查：TypeScript

### 3. 构建阶段
* 使用 Tauri CLI 构建
* 生成安装包（Windows/macOS/Linux）

### 4. 发布阶段
* 通过 GitHub Release 发布
* 自动化构建和发布

## 十二、版本控制

* **版本号：** 语义化版本（SemVer）
* **分支策略：**
  - `main`：稳定版本
  - `develop`：开发分支
  - `feature/*`：功能分支
  - `hotfix/*`：紧急修复分支
* **提交规范：** Conventional Commits
* **代码审查：** Pull Request + Code Review

## 十三、错误处理和用户体验

### 1. 错误处理
* 截图识别失败：提示用户重新截图
* 数据查询失败：使用缓存数据或提示用户稍后重试
* API 调用失败：提示用户检查网络或 API Key

### 2. 用户体验
* 加载状态：显示加载动画
* 成功反馈：显示推荐结果
* 错误提示：显示友好的错误信息

## 十四、测试策略

* **单元测试：** 测试各个模块的功能
* **集成测试：** 测试模块之间的交互
* **端到端测试：** 测试完整的用户流程
* **性能测试：** 测试响应时间和资源消耗

## 十五、部署和发布策略

* **开发环境：** 本地开发，使用 Supabase 本地实例
* **测试环境：** 使用 Supabase 测试项目
* **生产环境：** 使用 Supabase 生产项目
* **发布方式：** 通过 GitHub Release 发布安装包

## 十六、安全性和隐私保护

* **API Key 安全：** 使用环境变量存储 API Key，不提交到代码仓库
* **数据隐私：** 不收集用户个人信息，只收集游戏数据
* **通信安全：** 使用 HTTPS 进行 API 通信
* **本地存储：** 使用加密存储敏感数据
