import { create } from "zustand"
import type { RankedItem, HudMode } from "@/types"
import { fetchChampionRanking, fetchAugmentRanking } from "@/services/dataQuery"
import { useHudVisibility } from "./hudVisibility"
import { useHudContent } from "./hudContent"

interface RankingDataState {
  championItems: RankedItem[]
  hexItems: RankedItem[]
  loading: boolean
  error: string | null
  loadChampions: (limit?: number) => Promise<void>
  loadHex: (limit?: number) => Promise<void>
  loadAndDisplay: (mode: HudMode, limit?: number) => Promise<void>
}

let abortController: AbortController | null = null

export const useRankingDataStore = create<RankingDataState>((set) => ({
  championItems: [],
  hexItems: [],
  loading: false,
  error: null,

  loadChampions: async (limit = 10) => {
    // Cancel any in-flight request
    if (abortController) abortController.abort()
    const controller = new AbortController()
    abortController = controller

    set({ loading: true, error: null })
    try {
      const items = await fetchChampionRanking(limit)
      if (!controller.signal.aborted) {
        set({ championItems: items, loading: false })
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const message = err instanceof Error ? err.message : "加载英雄数据失败"
        set({ error: message, loading: false })
      }
    }
  },

  loadHex: async (limit = 10) => {
    if (abortController) abortController.abort()
    const controller = new AbortController()
    abortController = controller

    set({ loading: true, error: null })
    try {
      const items = await fetchAugmentRanking(limit)
      if (!controller.signal.aborted) {
        set({ hexItems: items, loading: false })
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const message = err instanceof Error ? err.message : "加载海克斯数据失败"
        set({ error: message, loading: false })
      }
    }
  },

  loadAndDisplay: async (mode: HudMode, limit = 10) => {
    const { show } = useHudVisibility.getState()
    const { setContent } = useHudContent.getState()

    show()
    setContent({
      mode,
      title: mode === "champion" ? "英雄胜率排名" : "海克斯强化推荐",
      subtitle: "大乱斗 · 当前版本",
      items: [],
    })

    const store = useRankingDataStore.getState()
    if (mode === "champion") {
      await store.loadChampions(limit)
    } else {
      await store.loadHex(limit)
    }
  },
}))
