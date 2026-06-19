import { useCallback, useEffect } from "react"
import { emitTo, listen } from "@tauri-apps/api/event"
import { HudOverlay } from "@/components/HudOverlay"
import { hideHudWindow, type HudPayload, type HudUpdatePayload } from "@/services/hudWindow"
import { applyThemeToDocument, listenForThemeChanged } from "@/services/themeSync"
import { useThemeStore } from "@/stores/themeStore"
import { useHudContent } from "@/stores/hudContent"
import { useHudVisibility } from "@/stores/hudVisibility"
import { useRankingDataStore } from "@/stores/rankingData"

export function HudOverlayRoot() {
  const visible = useHudVisibility((s) => s.visible)
  const show = useHudVisibility((s) => s.show)
  const hide = useHudVisibility((s) => s.hide)
  const setContent = useHudContent((s) => s.setContent)
  const setHudItems = useRankingDataStore((s) => s.setHudItems)
  const setLoadingState = useRankingDataStore((s) => s.setLoadingState)

  const applyPayload = useCallback(
    (payload: HudPayload | HudUpdatePayload) => {
      const current = useHudContent.getState()
      const mode = payload.mode ?? current.mode
      const currentItems =
        mode === "champion"
          ? useRankingDataStore.getState().championItems
          : useRankingDataStore.getState().hexItems
      const items = payload.items ?? currentItems

      setContent({
        mode,
        title: payload.title ?? current.title,
        subtitle: payload.subtitle ?? current.subtitle,
        items,
        source: payload.source ?? current.source,
      })
      setHudItems(mode, items)

      if ("loading" in payload || "error" in payload) {
        setLoadingState({
          loading: payload.loading ?? false,
          error: payload.error ?? null,
        })
      }
    },
    [setContent, setHudItems, setLoadingState],
  )

  useEffect(() => {
    const unlistenCallbacks: Array<() => void> = []
    let cancelled = false

    async function bindHudEvents() {
      applyThemeToDocument(useThemeStore.getState().theme)

      const unlistenThemeChanged = await listenForThemeChanged((theme) => {
        applyThemeToDocument(theme)
      })
      const unlistenShow = await listen<HudPayload>("hud:show", ({ payload }) => {
        applyPayload(payload)
        show()
      })
      const unlistenUpdate = await listen<HudUpdatePayload>("hud:update", ({ payload }) => {
        applyPayload(payload)
      })
      const unlistenHide = await listen("hud:hide", () => {
        hide()
      })

      if (cancelled) {
        unlistenThemeChanged()
        unlistenShow()
        unlistenUpdate()
        unlistenHide()
        return
      }

      unlistenCallbacks.push(
        unlistenThemeChanged,
        unlistenShow,
        unlistenUpdate,
        unlistenHide,
      )
    }

    void bindHudEvents()

    return () => {
      cancelled = true
      unlistenCallbacks.forEach((unlisten) => unlisten())
    }
  }, [applyPayload, hide, show])

  const retry = useCallback(() => {
    const { mode } = useHudContent.getState()
    void emitTo("main", "hud:retry", { mode })
  }, [])

  if (!visible) {
    return null
  }

  return (
    <HudOverlay
      onHidden={() => {
        void hideHudWindow()
        void emitTo("main", "hud:hidden")
      }}
      onRetry={retry}
    />
  )
}
