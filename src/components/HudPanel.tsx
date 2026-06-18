import { useCallback } from "react"
import { useHudVisibility } from "@/stores/hudVisibility"
import { useRankingDataStore } from "@/stores/rankingData"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { IdleScreen } from "@/components/IdleScreen"
import { HudOverlay } from "@/components/HudOverlay"

export function HudPanel() {
  const visible = useHudVisibility((s) => s.visible)
  const toggle = useHudVisibility((s) => s.toggle)
  const loadAndDisplay = useRankingDataStore((s) => s.loadAndDisplay)

  /* ── Keyboard shortcut: Alt+Q ── */
  useKeyboardShortcut("q", toggle, { alt: true })

  const loadChampions = useCallback(() => loadAndDisplay("champion"), [loadAndDisplay])
  const loadHex = useCallback(() => loadAndDisplay("hex"), [loadAndDisplay])

  /* ── Render based on visibility ── */
  if (!visible) {
    return <IdleScreen onLoadChampions={loadChampions} onLoadHex={loadHex} />
  }

  return <HudOverlay onLoadChampions={loadChampions} onLoadHex={loadHex} />
}
