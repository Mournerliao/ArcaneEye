import { useState, useEffect, useCallback, useRef } from 'react'
import type { RankedItem, HudMode } from '@/types'
import { fetchChampionRanking, fetchAugmentRanking } from '@/services/dataQuery'

interface UseRankingDataReturn {
  items: RankedItem[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * 获取排名数据的 Hook
 * 根据 mode 从 Supabase 查询英雄或海克斯排名
 */
export function useRankingData(
  mode: HudMode,
  limit = 10
): UseRankingDataReturn {
  const [items, setItems] = useState<RankedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const fetcher =
        mode === 'champion' ? fetchChampionRanking : fetchAugmentRanking
      const data = await fetcher(limit)
      if (mountedRef.current) {
        setItems(data)
      }
    } catch (err) {
      if (mountedRef.current) {
        const message =
          err instanceof Error ? err.message : 'Failed to fetch ranking data'
        setError(message)
      }
      console.error('[useRankingData]', err)
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [mode, limit])

  useEffect(() => {
    mountedRef.current = true
    const controller = new AbortController()

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetcher =
          mode === 'champion' ? fetchChampionRanking : fetchAugmentRanking
        const data = await fetcher(limit)
        if (!controller.signal.aborted) {
          setItems(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          const message =
            err instanceof Error ? err.message : 'Failed to fetch ranking data'
          setError(message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      mountedRef.current = false
      controller.abort()
    }
  }, [mode, limit])

  return { items, loading, error, refetch: fetchData }
}
