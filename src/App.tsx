import { HudPanel } from "@/components/HudPanel"

/**
 * ArcaneEye root component.
 *
 * The entire UI is a single HUD overlay panel.
 * Visibility and auto-hide logic live inside HudPanel.
 */
export function App() {
  return <HudPanel />
}
