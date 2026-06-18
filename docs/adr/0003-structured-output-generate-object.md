# 0003 — Structured Output with generateObject

AI 识别结果采用 Vercel AI SDK 的 `generateObject` + Zod schema 约束输出格式。相比 `generateText` + JSON.parse，`generateObject` 由 SDK 保证返回合法的结构化 JSON，类型安全，无需手动兜底格式错误。

识别结果直接使用，不展示置信度。MVP 阶段保持体验流畅，出错时用户自行判断。

Prompt 模板以 TS 常量形式硬编码在代码中，结构清晰、类型安全、调试方便。等 Prompt 稳定后再考虑外部化。数据链路为：AI 识别英雄/海克斯名称 → `dataQuery` 查询胜率数据 → `HudOverlay` 展示推荐结果。
