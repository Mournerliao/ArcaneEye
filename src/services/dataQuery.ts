import { supabase } from './supabase'
import type { RankedItem } from '@/types'
import type { Champion, Augment, ChampionAugment } from '@/types/supabase'

/* ─── Query functions ─── */

/**
 * 获取英雄胜率排名 (从 Supabase 缓存)
 * 按胜率降序，取前 N 名
 */
export async function fetchChampionRanking(limit = 10): Promise<RankedItem[]> {
  const { data, error } = await supabase
    .from('champions')
    .select('*')
    .order('win_rate', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`[DataQuery] Failed to fetch champions: ${error.message}`)
  }

  const rows = (data ?? []) as Champion[]
  if (rows.length === 0) return []

  const avgWinRate =
    rows.reduce((sum, c) => sum + c.win_rate, 0) / rows.length

  return rows.map((champion, index) => ({
    rank: index + 1,
    name: champion.name,
    winRate: roundWinRate(champion.win_rate),
    delta: roundWinRate(champion.win_rate - avgWinRate),
  }))
}

/**
 * 获取海克斯强化胜率排名 (从 Supabase 缓存)
 * 按胜率降序，取前 N 名
 */
export async function fetchAugmentRanking(limit = 10): Promise<RankedItem[]> {
  const { data, error } = await supabase
    .from('augments')
    .select('*')
    .order('win_rate', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`[DataQuery] Failed to fetch augments: ${error.message}`)
  }

  const rows = (data ?? []) as Augment[]
  if (rows.length === 0) return []

  const avgWinRate =
    rows.reduce((sum, a) => sum + a.win_rate, 0) / rows.length

  return rows.map((augment, index) => ({
    rank: index + 1,
    name: augment.display_name,
    winRate: roundWinRate(augment.win_rate),
    delta: roundWinRate(augment.win_rate - avgWinRate),
  }))
}

/**
 * 获取某个英雄的最佳海克斯推荐
 * 使用 Supabase join 语法一次性获取关联数据
 */
export async function fetchChampionAugments(
  championId: number,
  limit = 5
): Promise<RankedItem[]> {
  const { data, error } = await supabase
    .from('champion_augments')
    .select('*, augments(display_name)')
    .eq('champion_id', championId)
    .order('win_rate', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(
      `[DataQuery] Failed to fetch champion augments: ${error.message}`
    )
  }

  const rows = (data ?? []) as (ChampionAugment & { augments: { display_name: string } | null })[]
  if (rows.length === 0) return []

  const avgWinRate =
    rows.reduce((sum, ca) => sum + ca.win_rate, 0) / rows.length

  return rows.map((item, index) => ({
    rank: index + 1,
    name: item.augments?.display_name ?? 'Unknown',
    winRate: roundWinRate(item.win_rate),
    delta: roundWinRate(item.win_rate - avgWinRate),
  }))
}

/* ─── Helpers ─── */

/** 将 0-1 小数转为百分比，保留一位小数 (0.5234 → 52.3) */
function roundWinRate(rate: number): number {
  return Math.round(rate * 1000) / 10
}
