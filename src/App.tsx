import { getCurrentWindow } from "@tauri-apps/api/window"
import { HudOverlayRoot } from "@/components/HudOverlayRoot"
import { MainPanelRoot } from "@/components/MainPanelRoot"
import { Toaster } from "@/components/ui/sonner"

/**
 * ArcaneEye root component.
 *
 * The UI is split by Tauri window label.
 * Theme DOM mutation is handled solely by themeStore.
 */
export function App() {
  const windowLabel = getCurrentWindow().label

  return (
    <>
      {windowLabel === "hud" ? <HudOverlayRoot /> : <MainPanelRoot />}
      {windowLabel !== "hud" && <Toaster />}
    </>
  )
}
