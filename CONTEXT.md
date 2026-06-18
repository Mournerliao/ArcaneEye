# ArcaneEye

大乱斗 (ARAM) 桌面 HUD 助手。通过截图识别游戏状态，查询实时胜率数据，在短暂的决策窗口内为玩家提供推荐。

## Language

**英雄 (Champion)**:
ARAM 英雄池中的可选角色。选人阶段玩家需要从中选一个。
_Avoid_: 角色, 英雄角色

**海克斯强化 (Augment / Hex)**:
游戏中期出现的强化选项，影响英雄能力。每轮提供 3 个选项。
_Avoid_: 海克斯, 强化, hex augment

**胜率 (Win Rate)**:
某选项在所有对局中的胜出百分比。核心决策指标。
_Avoid_: 胜出率, 赢率

**数据链 (Pipeline)**:
截图 → AI 识别 → 数据查询 → HUD 展示的完整处理流程。
_Avoid_: 流水线, 管道

**HUD 面板 (HUD Panel)**:
桌面悬浮窗，始终置顶，展示推荐数据。Release 模式下鼠标可穿透。
_Avoid_: 悬浮窗, 覆盖层, overlay

**ARAMGG**:
外部大乱斗数据 API 提供者 (`data.dtodo.cn`)。每日同步英雄和海克斯强化的胜率数据到 Supabase。

**主屏 (Primary Monitor)**:
用户当前的主显示器。截图模块默认捕获该屏幕。
_Avoid_: 主屏幕, 主显示器

**BYOK (Bring Your Own Key)**:
用户自带 AI 提供商 API Key 的集成模式。应用提供编排能力，用户负责 AI 访问凭证。
_Avoid_: 自带密钥

**Provider**:
AI 模型提供商，如 OpenAI、Anthropic、Google。每个 Provider 有自己的 API Key 和 Base URL。
_Avoid_: 提供商, AI 供应商
