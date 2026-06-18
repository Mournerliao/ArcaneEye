import { create } from "zustand"
import type { RankedItem } from "@/types"
import { fetchChampionRanking, fetchAugmentRanking } from "@/services/dataQuery"

interface RankingDataState {
  championItems: RankedItem[]
  hexItems: RankedItem[]
  loading: boolean
  error: string | null
  loadChampions: (limit?: number) => Promise<void>
  loadHex: (limit?: number) => Promise<void>
}

export const useRankingDataStore = create<RankingDataState>((set) => ({
  championItems: [],
  hexItems: [],
  loading: false,
  error: null,

  loadChampions: async (limit = 10) => {
    set({ loading: true, error: null })
    try {
      const items = await fetchChampionRanking(limit)
      set({ championItems: items, loading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : "加载英雄数据失败"
      set({ error: message, loading: false })
    }
  },

  loadHex: async (limit = 10) => {
    set({ loading: true, error: null })
    try {
      const items = await fetchAugmentRanking(limit)
      set({ hexItems: items, loading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : "加载海克斯数据失败"
      set({ error: message, loading: false })
    }
  },
}))
