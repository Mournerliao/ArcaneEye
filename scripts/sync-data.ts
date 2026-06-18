// ARAMGG 数据同步脚本
// 运行: bun run scripts/sync-data.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_SECRET_KEY
const aramggBase = process.env.VITE_ARAMGG_API_BASE
const aramggKey = process.env.VITE_ARAMGG_API_KEY

if (!supabaseUrl || !supabaseKey || !aramggBase || !aramggKey) {
  console.error('❌ 缺少环境变量，请检查 .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

/* ─── ARAMGG API 类型 ─── */

interface PublicChampion {
  id: number
  name: string
  title: string | null
  alias: string | null
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

interface PublicAugment {
  id: number
  name: string
  rarity: 0 | 1 | 2 | null
  rarityName: 'silver' | 'gold' | 'prismatic' | null
  rarityDisplayName: string | null
  iconUrl: string | null
  description: string | null
  tooltip: string | null
  stats: {
    tier: number | null
    wins: number | null
    games: number | null
    winRate: number | null
    pickRate: number | null
    gamePatch: string | null
    date: string | null
  }
}

interface DataApiConfig {
  gamePatch: string
  dataVersion: string
}

/* ─── API 调用 ─── */

async function fetchAramgg<T>(path: string): Promise<T> {
  const res = await fetch(`${aramggBase}${path}`, {
    headers: { Authorization: `Bearer ${aramggKey}` },
  })

  if (!res.ok) {
    throw new Error(`ARAMGG API error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

/* ─── 数据转换 ─── */

function transformChampion(c: PublicChampion, gamePatch: string, date: string) {
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

function transformAugment(a: PublicAugment, gamePatch: string, date: string) {
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

/* ─── 同步函数 ─── */

async function syncChampions(config: DataApiConfig, date: string) {
  console.log('\n📥 同步英雄数据...')

  const envelope = await fetchAramgg<{ data: PublicChampion[] }>(
    '/api/v1/zh-CN/champions.json'
  )

  const champions = envelope.data.map((c) =>
    transformChampion(c, config.gamePatch, date)
  )

  const { error, count } = await supabase
    .from('champions')
    .upsert(champions, { onConflict: 'id', count: 'exact' })

  if (error) {
    throw new Error(`Champions upsert failed: ${error.message}`)
  }

  console.log(`✅ 英雄数据同步完成: ${count ?? champions.length} 条记录`)
  return count ?? champions.length
}

async function syncAugments(config: DataApiConfig, date: string) {
  console.log('\n📥 同步海克斯强化数据...')

  const envelope = await fetchAramgg<{ data: PublicAugment[] }>(
    '/api/v1/zh-CN/augments.json'
  )

  const augments = envelope.data.map((a) =>
    transformAugment(a, config.gamePatch, date)
  )

  const { error, count } = await supabase
    .from('augments')
    .upsert(augments, { onConflict: 'id', count: 'exact' })

  if (error) {
    throw new Error(`Augments upsert failed: ${error.message}`)
  }

  console.log(`✅ 海克斯数据同步完成: ${count ?? augments.length} 条记录`)
  return count ?? augments.length
}

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
  })
}

/* ─── 主函数 ─── */

async function main() {
  console.log('🚀 ArcaneEye 数据同步')
  console.log('═'.repeat(50))

  const date = new Date().toISOString().slice(0, 10)

  // 获取配置
  console.log('\n📡 获取 ARAMGG 配置...')
  const config = await fetchAramgg<DataApiConfig>(
    '/api/v1/zh-CN/config.json'
  )
  console.log(`   游戏版本: ${config.gamePatch}`)
  console.log(`   数据版本: ${config.dataVersion}`)

  let championsCount = 0
  let augmentsCount = 0
  const errors: string[] = []

  // 同步英雄
  try {
    championsCount = await syncChampions(config, date)
    await logSync('champions', 'success', championsCount)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(`Champions: ${msg}`)
    console.error('❌ 英雄同步失败:', msg)
    await logSync('champions', 'failed', 0, msg)
  }

  // 同步海克斯
  try {
    augmentsCount = await syncAugments(config, date)
    await logSync('augments', 'success', augmentsCount)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(`Augments: ${msg}`)
    console.error('❌ 海克斯同步失败:', msg)
    await logSync('augments', 'failed', 0, msg)
  }

  // 输出结果
  console.log('\n' + '═'.repeat(50))
  if (errors.length === 0) {
    console.log('✅ 数据同步完成！')
    console.log(`   英雄: ${championsCount} 条`)
    console.log(`   海克斯: ${augmentsCount} 条`)
  } else {
    console.log('⚠️  数据同步部分完成')
    console.log(`   成功: 英雄 ${championsCount} 条, 海克斯 ${augmentsCount} 条`)
    console.log(`   失败: ${errors.join(', ')}`)
  }
}

main()
