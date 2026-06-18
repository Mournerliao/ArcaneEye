import { useCallback } from "react"
import { useHudVisibility } from "@/stores/hudVisibility"
import { useHudContent } from "@/stores/hudContent"
import { useRankingData } from "@/hooks/useRankingData"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { IdleScreen } from "@/components/IdleScreen"
import { HudOverlay } from "@/components/HudOverlay"

export function HudPanel() {
  const visible = useHudVisibility((s) => s.visible)
  const show = useHudVisibility((s) => s.show)
  const toggle = useHudVisibility((s) => s.toggle)
  const setContent = useHudContent((s) => s.setContent)

  /* ── Data fetching hooks ── */
  const championsData = useRankingData("champion", 10)
  const hexData = useRankingData("hex", 10)

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
    await championsData.load()
    if (championsData.items.length > 0) {
      setContent({
        mode: "champion",
        title: "英雄胜率排名",
        subtitle: "大乱斗 · 当前版本",
        items: championsData.items,
      })
    }
  }, [show, setContent, championsData])

  const loadHex = useCallback(async () => {
    show()
    setContent({
      mode: "hex",
      title: "海克斯强化推荐",
      subtitle: "大乱斗 · 当前版本",
      items: [],
    })
    await hexData.load()
    if (hexData.items.length > 0) {
      setContent({
        mode: "hex",
        title: "海克斯强化推荐",
        subtitle: "大乱斗 · 当前版本",
        items: hexData.items,
      })
    }
  }, [show, setContent, hexData])

  /* ── Render based on visibility ── */
  if (!visible) {
    return <IdleScreen onLoadChampions={loadChampions} onLoadHex={loadHex} />
  }

  return <HudOverlay onLoadChampions={loadChampions} onLoadHex={loadHex} />
}
