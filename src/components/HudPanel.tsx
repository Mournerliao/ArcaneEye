import { useCallback } from "react"
import { useHudVisibility } from "@/stores/hudVisibility"
import { useHudContent } from "@/stores/hudContent"
import { useRankingDataStore } from "@/stores/rankingData"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { IdleScreen } from "@/components/IdleScreen"
import { HudOverlay } from "@/components/HudOverlay"

export function HudPanel() {
  const visible = useHudVisibility((s) => s.visible)
  const show = useHudVisibility((s) => s.show)
  const toggle = useHudVisibility((s) => s.toggle)
  const setContent = useHudContent((s) => s.setContent)
  const loadChampionsData = useRankingDataStore((s) => s.loadChampions)
  const loadHexData = useRankingDataStore((s) => s.loadHex)

  /* ── Keyboard shortcut: Alt+Q ── */
  useKeyboardShortcut("q", toggle, { alt: true })

  /* ── Load real data from Supabase ── */
  const loadChampions = useCallback(async () => {
    show()
    setContent({
      mode: "champion",
      title: "英雄胜率排名",
      subtitle: "大乱斗 · 当前版本",
      items: [],
    })
    await loadChampionsData()
  }, [show, setContent, loadChampionsData])

  const loadHex = useCallback(async () => {
    show()
    setContent({
      mode: "hex",
      title: "海克斯强化推荐",
      subtitle: "大乱斗 · 当前版本",
      items: [],
    })
    await loadHexData()
  }, [show, setContent, loadHexData])

  /* ── Render based on visibility ── */
  if (!visible) {
    return <IdleScreen onLoadChampions={loadChampions} onLoadHex={loadHex} />
  }

  return <HudOverlay onLoadChampions={loadChampions} onLoadHex={loadHex} />
}
