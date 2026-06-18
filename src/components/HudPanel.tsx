import { useState, useCallback } from "react"
import { useHudVisibility } from "@/stores/hudVisibility"
import { useRankingDataStore } from "@/stores/rankingData"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { IdleScreen } from "@/components/IdleScreen"
import { HudOverlay } from "@/components/HudOverlay"
import { SettingsPage } from "@/components/SettingsPage"

export function HudPanel() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const visible = useHudVisibility((s) => s.visible)
  const hide = useHudVisibility((s) => s.hide)
  const captureAndAnalyze = useRankingDataStore((s) => s.captureAndAnalyze)
  const loadAndDisplay = useRankingDataStore((s) => s.loadAndDisplay)

  /* ── Keyboard shortcut: Alt+Q ── */
  const handleShortcut = useCallback(() => {
    if (visible) {
      hide()
    } else {
      captureAndAnalyze()
    }
  }, [visible, hide, captureAndAnalyze])

  useKeyboardShortcut("q", handleShortcut, { alt: true })

  const loadChampions = useCallback(() => loadAndDisplay("champion"), [loadAndDisplay])
  const loadHex = useCallback(() => loadAndDisplay("hex"), [loadAndDisplay])

  /* ── Settings view ── */
  if (settingsOpen) {
    return <SettingsPage onClose={() => setSettingsOpen(false)} />
  }

  /* ── Render based on visibility ── */
  if (!visible) {
    return (
      <IdleScreen
        onLoadChampions={loadChampions}
        onLoadHex={loadHex}
        onOpenSettings={() => setSettingsOpen(true)}
      />
    )
  }

  return <HudOverlay onLoadChampions={loadChampions} onLoadHex={loadHex} />
}
