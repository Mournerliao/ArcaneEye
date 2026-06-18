import { supabase } from './supabase'
import { fetchChampions, fetchAugments, fetchConfig } from './aramgg'
import type { PublicChampion, PublicAugment } from '@/types/aramgg'
import type { Database } from '@/types/supabase'

type ChampionInsert = Database['public']['Tables']['champions']['Insert']
type AugmentInsert = Database['public']['Tables']['augments']['Insert']

/* ─── Transform functions ─── */

function transformChampion(
  c: PublicChampion,
  gamePatch: string,
  date: string
): ChampionInsert {
  return {
    id: c.id,
    name: c.name,
    title: c.title,
    alias: c.alias,
    roles: c.roles,
    icon_url: c.iconUrl,
    tier: c.stats?.tier ?? null,
    wins: c.stats?.wins ?? 0,
    games: c.stats?.games ?? 0,
    win_rate: c.stats?.winRate ?? 0,
    pick_rate: c.stats?.pickRate ?? 0,
    game_patch: c.stats?.gamePatch ?? gamePatch,
    data_date: c.stats?.date ?? date,
  }
}

function transformAugment(
  a: PublicAugment,
  gamePatch: string,
  date: string
): AugmentInsert {
  return {
    id: a.id,
    name: a.name,
    display_name: a.rarityDisplayName ?? a.name,
    rarity: a.rarity,
    rarity_name: a.rarityName,
    icon_url: a.iconUrl,
    description: a.description,
    tooltip: a.tooltip,
    tier: a.stats?.tier ?? null,
    wins: a.stats?.wins ?? 0,
    games: a.stats?.games ?? 0,
    win_rate: a.stats?.winRate ?? 0,
    pick_rate: a.stats?.pickRate ?? 0,
    game_patch: a.stats?.gamePatch ?? gamePatch,
    data_date: a.stats?.date ?? date,
  }
}

/* ─── Sync functions ─── */

/** 同步英雄数据到 Supabase */
export async function syncChampions(): Promise<{ count: number; error?: string }> {
  try {
    const config = await fetchConfig()
    const envelope = await fetchChampions()

    const champions = envelope.data.map((c) =>
      transformChampion(c, config.gamePatch, new Date().toISOString().slice(0, 10))
    )

    // Upsert: 如果存在则更新，不存在则插入
    const { error, count } = await supabase
      .from('champions')
      .upsert(champions as never, { onConflict: 'id', count: 'exact' })

    if (error) {
      return { count: 0, error: error.message }
    }

    return { count: count ?? champions.length }
  } catch (err) {
    return {
      count: 0,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

/** 同步海克斯强化数据到 Supabase */
export async function syncAugments(): Promise<{ count: number; error?: string }> {
  try {
    const config = await fetchConfig()
    const envelope = await fetchAugments()

    const augments = envelope.data.map((a) =>
      transformAugment(a, config.gamePatch, new Date().toISOString().slice(0, 10))
    )

    const { error, count } = await supabase
      .from('augments')
      .upsert(augments as never, { onConflict: 'id', count: 'exact' })

    if (error) {
      return { count: 0, error: error.message }
    }

    return { count: count ?? augments.length }
  } catch (err) {
    return {
      count: 0,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

/** 记录同步日志 */
async function logSync(
  resource: string,
  status: 'success' | 'failed',
  recordsSynced: number,
  errorMessage?: string
) {
  await supabase.from('sync_log').insert({
    resource,
    status,
    records_synced: recordsSynced,
    error_message: errorMessage ?? null,
    completed_at: new Date().toISOString(),
  } as never)
}

/** 执行全量同步 (英雄 + 海克斯) */
export async function syncAll(): Promise<{
  champions: number
  augments: number
  errors: string[]
}> {
  const errors: string[] = []
  let championsCount = 0
  let augmentsCount = 0

  // 同步英雄
  const champResult = await syncChampions()
  if (champResult.error) {
    errors.push(`Champions: ${champResult.error}`)
    await logSync('champions', 'failed', 0, champResult.error)
  } else {
    championsCount = champResult.count
    await logSync('champions', 'success', championsCount)
  }

  // 同步海克斯
  const augResult = await syncAugments()
  if (augResult.error) {
    errors.push(`Augments: ${augResult.error}`)
    await logSync('augments', 'failed', 0, augResult.error)
  } else {
    augmentsCount = augResult.count
    await logSync('augments', 'success', augmentsCount)
  }

  return { champions: championsCount, augments: augmentsCount, errors }
}
