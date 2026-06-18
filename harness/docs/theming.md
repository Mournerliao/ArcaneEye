# 主题系统开发指南

## 架构概览

ArcaneEye 使用 CSS 自定义属性 + Tailwind v4 `@theme inline` 实现运行时主题切换。

```
src/index.css
├── :root                     ← 默认主题（Hextech Cyan）色值
├── [data-theme="gold"]       ← Hextech Gold 色值覆盖
└── @theme inline             ← Tailwind 映射（引用 CSS 变量）
    ├── --color-*             ← 组件中使用 bg-primary、text-ink 等
    └── --shadow-glow         ← 引用 --c-glow 变量

src/stores/themeStore.ts      ← Zustand store，持久化到 localStorage
src/App.tsx                   ← 挂载时同步 theme → data-theme 属性
```

**数据流：**

1. 用户切换主题 → `useThemeStore.toggleTheme()`
2. Store 设置 `document.documentElement.dataset.theme`
3. CSS 选择器匹配 `[data-theme="gold"]`，覆盖 `--c-*` 变量
4. `@theme inline` 中的 `var(--c-*)` 自动解析为新值
5. 所有 Tailwind 工具类（`bg-primary`、`text-ink` 等）立即更新

## 新增主题：分步指南

### 步骤 1：定义色值

在 `src/index.css` 中新增一个 `[data-theme="xxx"]` 选择器块。必须覆盖以下 9 个变量：

```css
[data-theme="xxx"] {
  --c-bg: oklch(L C H); /* 最深背景 */
  --c-surface: oklch(L C H); /* 面板、卡片 */
  --c-surface-2: oklch(L C H); /* 嵌套表面、hover */
  --c-primary: oklch(L C H); /* 主色，承载 30-60% 视觉身份 */
  --c-accent: oklch(L C H); /* 辅助色，强调和高亮 */
  --c-ink: oklch(L C H); /* 主文字 */
  --c-muted: oklch(L C H); /* 次级文字 */
  --c-glow: oklch(L C H / opacity); /* 发光阴影色 */
  --c-glow-lg: oklch(L C H / opacity); /* 大发光阴影色 */
}
```

**色值规范：**

| 变量            | OKLCH L 范围 | 说明                        |
| --------------- | ------------ | --------------------------- |
| `--c-bg`        | 0.06 - 0.09  | 必须足够暗，确保 7:1 对比度 |
| `--c-surface`   | 0.10 - 0.13  | 比 bg 亮一级                |
| `--c-surface-2` | 0.14 - 0.17  | 比 surface 亮一级           |
| `--c-primary`   | 0.65 - 0.80  | 饱和度 C ≥ 0.10，确保可辨识 |
| `--c-accent`    | 0.70 - 0.82  | 与 primary 形成色相对比     |
| `--c-ink`       | 0.93 - 0.97  | 近白色，chroma ≤ 0.01       |
| `--c-muted`     | 0.48 - 0.55  | 在 bg 上需 ≥ 3.5:1 对比度   |

**不可覆盖的共享 Token（所有主题统一）：**

- `--color-success`、`--color-warning`、`--color-danger` — 语义色
- `--font-body`、`--font-mono` — 字体
- `--radius-panel`、`--radius-sm` — 圆角

### 步骤 2：注册主题 ID

在 `src/stores/themeStore.ts` 中：

1. 将新主题 ID 加入 `Theme` 类型联合：

```typescript
export type Theme = "cyan" | "gold" | "xxx"
```

2. 在 `toggleTheme` 中更新切换逻辑（如果只有两个主题可保持三元，三个以上建议改为列表循环）

### 步骤 3：更新 UI 标签

在 `src/components/HudPanel.tsx` 的主题切换按钮中添加新标签：

```tsx
{
  theme === "cyan" ? "海克斯青" : theme === "gold" ? "海克斯金" : "主题名"
}
```

### 步骤 4：更新文档

- `DESIGN.md` — Color Strategy 的主题表中添加新行
- `harness/docs/theming.md` — 本文件，如有架构变更需同步

## OKLCH 快速参考

```
oklch(L C H)
  L = 亮度 (0 = 纯黑, 1 = 纯白)
  C = 色度/饱和度 (0 = 灰色, 0.4 = 高饱和)
  H = 色相角度 (0 = 红, 90 = 黄, 140 = 绿, 185 = 青, 280 = 紫, 360 = 红)

常用色相：
  75-85   = 金色/琥珀
  140     = 翡翠绿
  185-200 = 海克斯青/蓝绿
  280-300 = 紫色
```

## 对比度检查

新主题上线前必须验证：

| 配对                         | 最低要求                  |
| ---------------------------- | ------------------------- |
| ink on bg                    | ≥ 7:1（主数据）           |
| primary on bg                | ≥ 4.5:1（强调元素）       |
| muted on bg                  | ≥ 3.5:1（次级文字）       |
| white on primary（填充背景） | 饱和中亮度 → 白色文字可用 |

推荐工具：[OKLCH 对比度计算器](https://oklch.com/) 或 Chrome DevTools 的 Accessibility 面板。

## 文件索引

| 文件                          | 职责                               |
| ----------------------------- | ---------------------------------- |
| `src/index.css`               | 主题色值定义 + Tailwind 映射       |
| `src/stores/themeStore.ts`    | 主题状态管理 + localStorage 持久化 |
| `src/App.tsx`                 | 主题初始化（data-theme 同步）      |
| `src/components/HudPanel.tsx` | 主题切换按钮 UI                    |
| `DESIGN.md`                   | 设计规范中的主题文档               |
| `harness/docs/theming.md`     | 本文件                             |
