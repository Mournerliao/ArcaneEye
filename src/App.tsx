import { HudPanel } from "@/components/HudPanel"

/**
 * ArcaneEye root component.
 *
 * The entire UI is a single HUD overlay panel.
 * Theme DOM mutation is handled solely by themeStore.
 */
export function App() {
  return <HudPanel />
}
