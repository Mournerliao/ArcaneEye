import { useCallback, useEffect, useState } from "react"
import { listen } from "@tauri-apps/api/event"
import { useRankingDataStore } from "@/stores/rankingData"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { hideHud } from "@/services/hudWindow"
import { IdleScreen } from "@/components/IdleScreen"
import { SettingsPage } from "@/components/SettingsPage"
import type { HudMode } from "@/types"

interface HudRetryPayload {
  mode: HudMode
}

export function MainPanelRoot() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const hudVisible = useRankingDataStore((s) => s.hudVisible)
  const captureAndAnalyze = useRankingDataStore((s) => s.captureAndAnalyze)
  const loadAndDisplay = useRankingDataStore((s) => s.loadAndDisplay)
  const setHudVisible = useRankingDataStore((s) => s.setHudVisible)

  const handleShortcut = useCallback(() => {
    if (hudVisible) {
      setHudVisible(false)
      void hideHud()
    } else {
      void captureAndAnalyze()
    }
  }, [hudVisible, setHudVisible, captureAndAnalyze])

  useKeyboardShortcut("q", handleShortcut, { alt: true })

  const loadChampions = useCallback(() => {
    void loadAndDisplay("champion")
  }, [loadAndDisplay])
  const loadHex = useCallback(() => {
    void loadAndDisplay("hex")
  }, [loadAndDisplay])

  useEffect(() => {
    const unlistenCallbacks: Array<() => void> = []
    let cancelled = false

    async function bindHudEvents() {
      const unlistenHidden = await listen("hud:hidden", () => {
        setHudVisible(false)
      })
      const unlistenRetry = await listen<HudRetryPayload>("hud:retry", ({ payload }) => {
        void useRankingDataStore.getState().loadAndDisplay(payload.mode)
      })

      if (cancelled) {
        unlistenHidden()
        unlistenRetry()
        return
      }

      unlistenCallbacks.push(unlistenHidden, unlistenRetry)
    }

    void bindHudEvents()

    return () => {
      cancelled = true
      unlistenCallbacks.forEach((unlisten) => unlisten())
    }
  }, [setHudVisible])

  if (settingsOpen) {
    return <SettingsPage onClose={() => setSettingsOpen(false)} />
  }

  return (
    <IdleScreen
      onLoadChampions={loadChampions}
      onLoadHex={loadHex}
      onOpenSettings={() => setSettingsOpen(true)}
    />
  )
}
