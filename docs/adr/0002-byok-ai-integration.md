# 0002 — BYOK AI Integration Architecture

采用 BYOK (Bring Your Own Key) 模式集成多模态 AI 能力。用户自带 AI 提供商的 API Key，应用负责编排截图识别和数据查询。

**Provider 范围**: OpenAI、Anthropic、Google 三家主流 + 自定义 Base URL（兼容 OpenRouter、Ollama、DeepSeek 等 OpenAI 兼容端点）。

**调用位置**: 前端直接调用（React/TS + Vercel AI SDK）。Tauri 桌面应用的前后端运行在同一进程中，不存在 Web 场景的暴露风险。Key 通过 Tauri command 从 OS Keychain 读取，用完不持久化在 JS 内存。Vercel AI SDK 在 JS 侧的流式处理、结构化输出等能力远比手写 Rust HTTP 调用成熟。Cursor、Cline 等工具采用相同模式。

**Key 存储**: 使用 Rust `keyring` crate 存入 OS Keychain（Windows Credential Manager / macOS Keychain / Linux Secret Service）。轻量级方案，无重依赖，API 简洁。备选 `tauri-plugin-stronghold` 拉入 IOTA 生态过重。

**截图策略**: 全屏截图 + AI 自动识别，不裁剪区域。由 AI 判断当前是选人阶段还是海克斯选择阶段，一次调用完成模式判断和内容识别。
