import type {
  ApiEnvelope,
  PublicChampion,
  PublicAugment,
  ChampionDetail,
  DataApiConfig,
} from '@/types/aramgg'

/* ─── Configuration ─── */

const API_BASE = import.meta.env.VITE_ARAMGG_API_BASE ?? 'https://data.dtodo.cn'
const API_KEY = import.meta.env.VITE_ARAMGG_API_KEY

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`
  }
  return headers
}

/* ─── Generic fetcher ─── */

async function fetchApi<T>(path: string): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${API_BASE}${path}`, { headers: getHeaders() })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '')
    throw new Error(
      `[ARAMGG API] ${res.status} ${res.statusText} — ${path}\n${errorBody}`
    )
  }

  return res.json() as Promise<ApiEnvelope<T>>
}

/* ─── Public API ─── */

/** 获取英雄榜单 (消耗 1 credit) */
export async function fetchChampions(): Promise<ApiEnvelope<PublicChampion[]>> {
  return fetchApi<PublicChampion[]>('/api/v1/zh-CN/champions.json')
}

/** 获取海克斯强化榜单 (消耗 1 credit) */
export async function fetchAugments(): Promise<ApiEnvelope<PublicAugment[]>> {
  return fetchApi<PublicAugment[]>('/api/v1/zh-CN/augments.json')
}

/** 获取单英雄详情 (消耗 2 credits) */
export async function fetchChampionDetail(
  championId: number
): Promise<ApiEnvelope<ChampionDetail>> {
  return fetchApi<ChampionDetail>(
    `/api/v1/zh-CN/champions/${championId}.json`
  )
}

/** 获取数据 API 配置 (免费，无需 API Key) */
export async function fetchConfig(): Promise<DataApiConfig> {
  const res = await fetch(`${API_BASE}/api/v1/zh-CN/config.json`)
  if (!res.ok) {
    throw new Error(`[ARAMGG API] Failed to fetch config: ${res.status}`)
  }
  return res.json() as Promise<DataApiConfig>
}

/** 检查 API 连通性 (HEAD 请求，不扣 credit) */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/zh-CN/config.json`, {
      method: 'HEAD',
      headers: getHeaders(),
    })
    return res.ok
  } catch {
    return false
  }
}
