import { emitTo, listen } from "@tauri-apps/api/event"

export type Theme = "cyan" | "gold"

const HUD_WINDOW_LABEL = "hud"
const THEME_CHANGED_EVENT = "theme:changed"

interface ThemeChangedPayload {
  theme: Theme
}

export function applyThemeToDocument(theme: Theme) {
  document.documentElement.dataset.theme = theme === "cyan" ? "" : theme
}

export async function emitThemeChanged(theme: Theme) {
  await emitTo(HUD_WINDOW_LABEL, THEME_CHANGED_EVENT, { theme })
}

export async function listenForThemeChanged(onThemeChanged: (theme: Theme) => void) {
  return listen<ThemeChangedPayload>(THEME_CHANGED_EVENT, ({ payload }) => {
    onThemeChanged(payload.theme)
  })
}
