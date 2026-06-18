-- ArcaneEye 数据层初始化
-- 基于 ARAMGG Data API v1 (zh-CN)

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 英雄榜单表
-- 数据来源: /api/v1/zh-CN/champions.json
-- ─────────────────────────────────────────────
CREATE TABLE champions (
  id            INTEGER PRIMARY KEY,           -- 英雄 ID
  name          TEXT NOT NULL,                 -- 中文名 (如 "泽丽")
  title         TEXT,                          -- 称号 (如 "祖安花火")
  alias         TEXT,                          -- 英雄别名 (如 "Zeri")
  roles         TEXT[] DEFAULT '{}',           -- 定位 (如 ["marksman"])
  icon_url      TEXT,                          -- 图标 CDN URL

  -- 统计数据
  tier          INTEGER,                       -- 强度评级 (1-5, 1最强)
  wins          INTEGER DEFAULT 0,             -- 胜场数
  games         INTEGER DEFAULT 0,             -- 总场数
  win_rate      DOUBLE PRECISION DEFAULT 0,    -- 胜率 (0-1 小数)
  pick_rate     DOUBLE PRECISION DEFAULT 0,    -- 登场率 (0-1 小数)

  -- 元数据
  game_patch    TEXT,                          -- 游戏版本 (如 "16.10")
  data_date     DATE,                          -- 数据日期
  synced_at     TIMESTAMPTZ DEFAULT NOW()      -- 同步时间
);

-- 胜率降序索引，HUD 面板查询最频繁
CREATE INDEX idx_champions_win_rate ON champions (win_rate DESC);
CREATE INDEX idx_champions_game_patch ON champions (game_patch);

-- ─────────────────────────────────────────────
-- 海克斯强化表
-- 数据来源: /api/v1/zh-CN/augments.json
-- ─────────────────────────────────────────────
CREATE TABLE augments (
  id              INTEGER PRIMARY KEY,           -- 海克斯 ID
  name            TEXT NOT NULL,                 -- 英文名 (如 "ARAM_ApexInventor")
  display_name    TEXT NOT NULL,                 -- 中文名 (如 "尖端发明家")
  rarity          INTEGER,                       -- 稀有度 (0=白银, 1=黄金, 2=棱彩)
  rarity_name     TEXT,                          -- 稀有度英文 (silver/gold/prismatic)
  icon_url        TEXT,                          -- 图标 CDN URL
  description     TEXT,                          -- 描述 (可能含 HTML)
  tooltip         TEXT,                          -- 提示文本

  -- 统计数据
  tier            INTEGER,                       -- 强度评级 (1-5)
  wins            INTEGER DEFAULT 0,
  games           INTEGER DEFAULT 0,
  win_rate        DOUBLE PRECISION DEFAULT 0,
  pick_rate       DOUBLE PRECISION DEFAULT 0,

  -- 元数据
  game_patch      TEXT,
  data_date       DATE,
  synced_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_augments_win_rate ON augments (win_rate DESC);
CREATE INDEX idx_augments_rarity ON augments (rarity);
CREATE INDEX idx_augments_game_patch ON augments (game_patch);

-- ─────────────────────────────────────────────
-- 英雄海克斯详情表 (多对多)
-- 数据来源: /api/v1/zh-CN/champions/{id}.json
-- ─────────────────────────────────────────────
CREATE TABLE champion_augments (
  champion_id     INTEGER NOT NULL,
  augment_id      INTEGER NOT NULL,

  -- 统计数据
  tier            INTEGER,
  wins            INTEGER DEFAULT 0,
  games           INTEGER DEFAULT 0,
  win_rate        DOUBLE PRECISION DEFAULT 0,
  pick_rate       DOUBLE PRECISION DEFAULT 0,

  -- 元数据
  game_patch      TEXT,
  data_date       DATE,
  synced_at       TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (champion_id, augment_id)
);

CREATE INDEX idx_champion_augments_champion ON champion_augments (champion_id, win_rate DESC);

-- ─────────────────────────────────────────────
-- 同步日志表
-- ─────────────────────────────────────────────
CREATE TABLE sync_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource        TEXT NOT NULL,                 -- 同步资源 (champions/augments/champion_augments)
  status          TEXT NOT NULL DEFAULT 'pending', -- pending/running/success/failed
  data_version    TEXT,                          -- 数据版本 (如 "16.10.3")
  records_synced  INTEGER DEFAULT 0,            -- 同步记录数
  error_message   TEXT,                          -- 错误信息
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_sync_log_resource ON sync_log (resource, started_at DESC);

-- ─────────────────────────────────────────────
-- RLS 策略 (Row Level Security)
-- 前端只读，同步脚本通过 service_role 写入
-- ─────────────────────────────────────────────
ALTER TABLE champions ENABLE ROW LEVEL SECURITY;
ALTER TABLE augments ENABLE ROW LEVEL SECURITY;
ALTER TABLE champion_augments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

-- 匿名用户可读 (前端查询)
CREATE POLICY "Allow anonymous read champions" ON champions
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read augments" ON augments
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read champion_augments" ON champion_augments
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read sync_log" ON sync_log
  FOR SELECT USING (true);

-- service_role 可写 (同步脚本)
CREATE POLICY "Allow service role write champions" ON champions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role write augments" ON augments
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role write champion_augments" ON champion_augments
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role write sync_log" ON sync_log
  FOR ALL USING (true) WITH CHECK (true);
