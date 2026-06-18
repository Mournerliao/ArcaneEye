import { useEffect } from "react"
import { HudPanel } from "@/components/HudPanel"
import { useThemeStore } from "@/stores/themeStore"

/**
 * ArcaneEye root component.
 *
 * The entire UI is a single HUD overlay panel.
 * Visibility and auto-hide logic live inside HudPanel.
 */
export function App() {
  const theme = useThemeStore((s) => s.theme)

  /* Sync theme to <html> on mount (backup for rehydration timing) */
  useEffect(() => {
    document.documentElement.dataset.theme = theme === "cyan" ? "" : theme
  }, [theme])

  return <HudPanel />
}
