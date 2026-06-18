/* ─── ARAMGG Data API v1 Types ─── */
/* Based on: https://data.dtodo.cn/api/v1/zh-CN/docs/cf-data-api.md */

/* ─── API Envelope ─── */

export interface ApiEnvelope<T> {
  meta: {
    service: 'aramgg-data-api'
    schemaVersion: 1
    apiVersion: 'v1'
    locale: 'zh-CN'
    gamePatch: string
    apiRelease: number
    dataVersion: string
    generatedAt: string
    publishedAt: string | null
    resource: string
    total?: number
  }
  data: T
}

/* ─── Stats ─── */

export interface PublicStats {
  tier: number | null
  wins: number | null
  games: number | null
  winRate: number | null
  pickRate: number | null
  gamePatch: string | null
  date: string | null
}

/* ─── Champions ─── */

export interface PublicChampion {
  id: number
  alias: string | null
  name: string
  title: string | null
  roles: string[]
  iconUrl: string
  stats: {
    tier: number | null
    wins: number
    games: number
    winRate: number
    pickRate: number
    gamePatch: string
    date: string
  } | null
}

/* ─── Augments ─── */

export interface PublicAugment {
  id: number
  name: string
  rarity: 0 | 1 | 2 | null
  rarityName: 'silver' | 'gold' | 'prismatic' | null
  rarityDisplayName: string | null
  iconUrl: string | null
  key: string | null
  enabled: boolean | null
  description: string | null
  tooltip: string | null
  stats: PublicStats
  stages: Array<{ stage: number | null } & PublicStats>
  topChampions: Array<PublicChampion & { rank: number | null; stats: PublicStats }>
}

/* ─── Champion Detail ─── */

export interface ChampionDetailAugment {
  id: number
  name: string
  rarity: number | null
  rarityName: string | null
  iconUrl: string | null
  tier: number | null
  wins: number | null
  games: number | null
  winRate: number | null
  pickRate: number | null
}

export interface ChampionDetailItem {
  id: number
  name: string
  iconUrl: string | null
  tier: number | null
  wins: number | null
  games: number | null
  winRate: number | null
  pickRate: number | null
}

export interface ChampionDetailBuild {
  coreItems: ChampionDetailItem[]
  itemExtensions: ChampionDetailItem[]
  situationalItems: ChampionDetailItem[]
  startingItems: ChampionDetailItem[]
  tags: string[]
  tier: string | null
}

export interface ChampionDetail {
  champion: PublicChampion & { stats: PublicStats }
  augments: ChampionDetailAugment[]
  items: ChampionDetailItem[]
  augmentTrios: Array<{
    augmentIds: number[]
    tier: number | null
    wins: number | null
    games: number | null
    winRate: number | null
    pickRate: number | null
  }>
  builds: ChampionDetailBuild[]
  relatedBlogs: Array<{ title: string; url: string }>
}

/* ─── Config ─── */

export interface DataApiConfig {
  service: 'aramgg-data-api'
  schemaVersion: 1
  apiVersion: 'v1'
  locale: 'zh-CN'
  gamePatch: string
  apiRelease: number
  dataVersion: string
  generatedAt: string
  publishedAt: string | null
  configRevision?: string
  dataBasePath: string
  docs: string
  electron: {
    latestVersion: string
    downloadUrl: string
  }
}
