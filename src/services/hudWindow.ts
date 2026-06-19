import { invoke } from "@tauri-apps/api/core"
import { emitTo } from "@tauri-apps/api/event"
import type { HudMode, RankedItem } from "@/types"
import { emitThemeChanged } from "@/services/themeSync"
import { useThemeStore } from "@/stores/themeStore"

export const HUD_WINDOW_LABEL = "hud"

export interface HudPayload {
  mode: HudMode
  title: string
  subtitle?: string
  source?: string
  items?: RankedItem[]
  loading?: boolean
  error?: string | null
}

export interface HudUpdatePayload {
  mode?: HudMode
  title?: string
  subtitle?: string
  source?: string
  items?: RankedItem[]
  loading?: boolean
  error?: string | null
}

export async function showHud(payload: HudPayload): Promise<void> {
  await invoke("show_hud_window")
  await emitThemeChanged(useThemeStore.getState().theme)
  await emitTo(HUD_WINDOW_LABEL, "hud:show", {
    source: "ARAMGG",
    items: [],
    loading: false,
    error: null,
    ...payload,
  })
}

export async function updateHud(payload: HudUpdatePayload): Promise<void> {
  await emitTo(HUD_WINDOW_LABEL, "hud:update", payload)
}

export async function hideHud(): Promise<void> {
  await emitTo(HUD_WINDOW_LABEL, "hud:hide")
}

export async function hideHudWindow(): Promise<void> {
  await invoke("hide_hud_window")
}
