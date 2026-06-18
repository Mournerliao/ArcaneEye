import { useState, useCallback, useRef } from 'react'
import type { RankedItem, HudMode } from '@/types'
import { fetchChampionRanking, fetchAugmentRanking } from '@/services/dataQuery'

interface UseRankingDataReturn {
  items: RankedItem[]
  loading: boolean
  error: string | null
  load: () => Promise<void>
}

/**
 * 获取排名数据的 Hook（手动触发模式）
 * 根据 mode 从 Supabase 查询英雄或海克斯排名
 * 内置 AbortController 防止竞态条件
 */
export function useRankingData(
  mode: HudMode,
  limit = 10
): UseRankingDataReturn {
  const [items, setItems] = useState<RankedItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const load = useCallback(async () => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const fetcher =
        mode === 'champion' ? fetchChampionRanking : fetchAugmentRanking
      const data = await fetcher(limit)

      // 检查请求是否已被取消
      if (!controller.signal.aborted) {
        setItems(data)
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const message =
          err instanceof Error ? err.message : '加载排名数据失败'
        setError(message)
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [mode, limit])

  return { items, loading, error, load }
}
