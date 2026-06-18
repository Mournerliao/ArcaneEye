import { create } from "zustand"
import type { RankedItem, HudMode } from "@/types"
import { fetchChampionRanking, fetchAugmentRanking } from "@/services/dataQuery"
import { captureScreen } from "@/services/screenshot"
import { analyzeScreenshot } from "@/services/ai-provider"
import { useHudVisibility } from "./hudVisibility"
import { useHudContent } from "./hudContent"
import { useAIConfigStore } from "./aiConfig"

interface RankingDataState {
  championItems: RankedItem[]
  hexItems: RankedItem[]
  loading: boolean
  error: string | null
  loadChampions: (limit?: number) => Promise<void>
  loadHex: (limit?: number) => Promise<void>
  loadAndDisplay: (mode: HudMode, limit?: number) => Promise<void>
  /** Full AI pipeline: screenshot → AI analysis → data query → display */
  captureAndAnalyze: () => Promise<void>
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

  captureAndAnalyze: async () => {
    if (abortController) abortController.abort()
    const controller = new AbortController()
    abortController = controller

    const { show } = useHudVisibility.getState()
    const { setContent } = useHudContent.getState()

    show()
    setContent({
      mode: "champion",
      title: "AI 识别中...",
      subtitle: "正在截图并分析游戏画面",
      items: [],
    })

    set({ loading: true, error: null })

    try {
      // 1. Capture screenshot
      const screenshot = await captureScreen()
      if (controller.signal.aborted) return

      // 2. AI analysis
      const aiConfig = useAIConfigStore.getState()
      const analysis = await analyzeScreenshot(screenshot, {
        provider: aiConfig.provider,
        apiKey: aiConfig.apiKey,
        baseURL: aiConfig.baseURL,
        modelId: aiConfig.modelId,
      })
      if (controller.signal.aborted) return

      // 3. Determine mode and query data
      const mode: HudMode = analysis.mode
      setContent({
        mode,
        title: mode === "champion" ? "英雄胜率排名" : "海克斯强化推荐",
        subtitle: "大乱斗 · AI 识别",
        items: [],
      })

      const store = useRankingDataStore.getState()
      if (mode === "champion") {
        await store.loadChampions()
      } else {
        await store.loadHex()
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const message = err instanceof Error ? err.message : "AI 识别失败"
        set({ error: message, loading: false })
        setContent({
          mode: "champion",
          title: "识别失败",
          subtitle: message,
          items: [],
        })
      }
    }
  },
}))
