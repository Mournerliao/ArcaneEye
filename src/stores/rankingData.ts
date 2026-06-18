import { create } from "zustand"
import type { RankedItem, HudMode } from "@/types"
import { fetchChampionRanking, fetchAugmentRanking } from "@/services/dataQuery"
import { captureScreen } from "@/services/screenshot"
import { analyzeScreenshot } from "@/services/ai-provider"
import { showHud, updateHud } from "@/services/hudWindow"
import { useAIConfigStore } from "./aiConfig"

interface RankingDataState {
  championItems: RankedItem[]
  hexItems: RankedItem[]
  loading: boolean
  error: string | null
  hudVisible: boolean
  setHudVisible: (visible: boolean) => void
  setHudItems: (mode: HudMode, items: RankedItem[]) => void
  setLoadingState: (payload: { loading: boolean; error: string | null }) => void
  loadChampions: (limit?: number) => Promise<void>
  loadHex: (limit?: number) => Promise<void>
  loadAndDisplay: (mode: HudMode, limit?: number) => Promise<void>
  /** Full AI pipeline: screenshot -> AI analysis -> data query -> display */
  captureAndAnalyze: () => Promise<void>
}

let abortController: AbortController | null = null

function startRequest() {
  if (abortController) abortController.abort()
  const controller = new AbortController()
  abortController = controller
  return controller
}

function getHudTitle(mode: HudMode) {
  return mode === "champion" ? "英雄胜率排名" : "海克斯强化推荐"
}

async function fetchRankingByMode(mode: HudMode, limit = 10) {
  return mode === "champion"
    ? fetchChampionRanking(limit)
    : fetchAugmentRanking(limit)
}

export const useRankingDataStore = create<RankingDataState>((set) => ({
  championItems: [],
  hexItems: [],
  loading: false,
  error: null,
  hudVisible: false,

  setHudVisible: (visible) => set({ hudVisible: visible }),

  setHudItems: (mode, items) =>
    set(mode === "champion" ? { championItems: items } : { hexItems: items }),

  setLoadingState: ({ loading, error }) => set({ loading, error }),

  loadChampions: async (limit = 10) => {
    const controller = startRequest()

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
    const controller = startRequest()

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
    const controller = startRequest()
    const title = getHudTitle(mode)

    set({ loading: true, error: null, hudVisible: true })
    await showHud({
      mode,
      title,
      subtitle: "大乱斗 · 当前版本",
      items: [],
      loading: true,
      error: null,
    })

    try {
      const items = await fetchRankingByMode(mode, limit)
      if (controller.signal.aborted) return

      set({
        ...(mode === "champion" ? { championItems: items } : { hexItems: items }),
        loading: false,
        error: null,
      })
      await updateHud({ mode, items, loading: false, error: null })
    } catch (err) {
      if (!controller.signal.aborted) {
        const message = err instanceof Error ? err.message : "加载数据失败"
        set({ error: message, loading: false })
        await updateHud({
          mode,
          title,
          subtitle: message,
          items: [],
          loading: false,
          error: message,
        })
      }
    }
  },

  captureAndAnalyze: async () => {
    const controller = startRequest()

    set({ loading: true, error: null, hudVisible: true })
    await showHud({
      mode: "champion",
      title: "AI 识别中...",
      subtitle: "正在截图并分析游戏画面",
      items: [],
      loading: true,
      error: null,
    })

    try {
      const screenshot = await captureScreen()
      if (controller.signal.aborted) return

      const aiConfig = useAIConfigStore.getState()
      const analysis = await analyzeScreenshot(screenshot, {
        provider: aiConfig.provider,
        apiKey: aiConfig.apiKey,
        baseURL: aiConfig.baseURL,
        modelId: aiConfig.modelId,
      })
      if (controller.signal.aborted) return

      const mode: HudMode = analysis.mode
      const title = getHudTitle(mode)
      await updateHud({
        mode,
        title,
        subtitle: "大乱斗 · AI 识别",
        items: [],
        loading: true,
        error: null,
      })

      const items = await fetchRankingByMode(mode)
      if (controller.signal.aborted) return

      set({
        ...(mode === "champion" ? { championItems: items } : { hexItems: items }),
        loading: false,
        error: null,
      })
      await updateHud({ mode, items, loading: false, error: null })
    } catch (err) {
      if (!controller.signal.aborted) {
        const message = err instanceof Error ? err.message : "AI 识别失败"
        set({ error: message, loading: false })
        await updateHud({
          mode: "champion",
          title: "识别失败",
          subtitle: message,
          items: [],
          loading: false,
          error: message,
        })
      }
    }
  },
}))
