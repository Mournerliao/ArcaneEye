import { supabase } from './supabase'
import type { RankedItem } from '@/types'
import type { Champion, Augment, ChampionAugment } from '@/types/supabase'

/* ─── Generic fetcher ─── */

type RankedItemFields = Omit<RankedItem, 'rank'>

interface FetchRankingOptions<T> {
  table: string
  select?: string
  filter?: { column: string; value: number }
  limit: number
  mapRow: (row: T, avgWinRate: number) => RankedItemFields
  errorMsg: string
}

async function fetchRanking<T>(opts: FetchRankingOptions<T>): Promise<RankedItem[]> {
  let query = supabase
    .from(opts.table)
    .select(opts.select ?? '*')
    .order('win_rate', { ascending: false })
    .limit(opts.limit)

  if (opts.filter) {
    query = query.eq(opts.filter.column, opts.filter.value)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`[DataQuery] ${opts.errorMsg}: ${error.message}`)
  }

  const rows = (data ?? []) as T[]
  if (rows.length === 0) return []

  const avgWinRate =
    rows.reduce((sum, r) => sum + ((r as unknown as { win_rate: number }).win_rate ?? 0), 0) / rows.length

  return rows.map((row, index) => ({
    rank: index + 1,
    ...opts.mapRow(row, avgWinRate),
  }))
}

/* ─── Public query functions ─── */

/** 获取英雄胜率排名 (从 Supabase 缓存) */
export async function fetchChampionRanking(limit = 10): Promise<RankedItem[]> {
  return fetchRanking<Champion>({
    table: 'champions',
    limit,
    errorMsg: 'Failed to fetch champions',
    mapRow: (c, avg) => ({
      name: c.name,
      winRate: roundWinRate(c.win_rate),
      delta: roundWinRate(c.win_rate - avg),
    }),
  })
}

/** 获取海克斯强化胜率排名 (从 Supabase 缓存) */
export async function fetchAugmentRanking(limit = 10): Promise<RankedItem[]> {
  return fetchRanking<Augment>({
    table: 'augments',
    limit,
    errorMsg: 'Failed to fetch augments',
    mapRow: (a, avg) => ({
      name: a.display_name,
      winRate: roundWinRate(a.win_rate),
      delta: roundWinRate(a.win_rate - avg),
    }),
  })
}

/** 获取某个英雄的最佳海克斯推荐 */
export async function fetchChampionAugments(
  championId: number,
  limit = 5
): Promise<RankedItem[]> {
  return fetchRanking<ChampionAugment & { augments: { display_name: string } | null }>({
    table: 'champion_augments',
    select: '*, augments(display_name)',
    filter: { column: 'champion_id', value: championId },
    limit,
    errorMsg: 'Failed to fetch champion augments',
    mapRow: (ca, avg) => ({
      name: ca.augments?.display_name ?? 'Unknown',
      winRate: roundWinRate(ca.win_rate),
      delta: roundWinRate(ca.win_rate - avg),
    }),
  })
}

/* ─── Helpers ─── */

/** 将 0-1 小数转为百分比，保留一位小数 (0.5234 → 52.3) */
function roundWinRate(rate: number): number {
  return Math.round(rate * 1000) / 10
}
